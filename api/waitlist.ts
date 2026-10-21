import { neon, type NeonQueryFunction } from "@neondatabase/serverless"
import {
  ensureConfirmationSchema,
  generateConfirmToken,
  sendConfirmationEmail,
  backupSignup,
} from "./_lib/confirmation.js"

// Anti-spam: max signup attempts per IP in a rolling window.
const RATE_LIMIT = 5
const RATE_WINDOW_MINUTES = 10

let rateTableReady: Promise<unknown> | null = null
function ensureRateTable(sql: NeonQueryFunction<false, false>) {
  rateTableReady ??= (async () => {
    await sql`CREATE TABLE IF NOT EXISTS signup_attempts (ip_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`
    await sql`CREATE INDEX IF NOT EXISTS signup_attempts_ip_time ON signup_attempts (ip_hash, created_at)`
  })().catch((err) => {
    rateTableReady = null
    throw err
  })
  return rateTableReady
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`meridian:${ip}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("")
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const REFERRAL_BOOST_DAYS = 2
// Keep in sync with api/waitlist-count.ts and api/waitlist-status.ts — the
// same real people counted in the public "X already joined" number should
// rank ahead of every DB row, since they signed up before this table existed.
const EXTERNAL_SIGNUP_BASE = Number(process.env.EXTERNAL_SIGNUP_BASE || 0)

function generateReferralCode(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8)
}

export async function POST(request: Request): Promise<Response> {
  let email: unknown
  let ref: unknown
  let company: unknown
  try {
    ;({ email, ref, company } = await request.json())
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Enter a valid email." }, { status: 400 })
  }

  // Honeypot filled in: almost certainly a bot. Reject without touching the DB.
  if (typeof company === "string" && company.trim() !== "") {
    return Response.json({ error: "Something went wrong. Try again." }, { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  await Promise.all([ensureConfirmationSchema(sql), ensureRateTable(sql)])

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  const ipHash = await hashIp(ip)
  const [{ attempts }] = await sql`
    SELECT COUNT(*)::int AS attempts FROM signup_attempts
    WHERE ip_hash = ${ipHash}
      AND created_at > now() - make_interval(mins => ${RATE_WINDOW_MINUTES})
  `
  if (attempts >= RATE_LIMIT) {
    return Response.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 }
    )
  }
  await sql`INSERT INTO signup_attempts (ip_hash) VALUES (${ipHash})`
  if (Math.random() < 0.02) {
    await sql`DELETE FROM signup_attempts WHERE created_at < now() - INTERVAL '1 day'`
  }
  const normalizedEmail = email.trim().toLowerCase()
  const referredBy = typeof ref === "string" && ref.trim() ? ref.trim() : null

  const [signup] = await sql`
    INSERT INTO waitlist_signups (email, referral_code, referred_by)
    VALUES (
      ${normalizedEmail},
      ${generateReferralCode()},
      (SELECT referral_code FROM waitlist_signups WHERE referral_code = ${referredBy})
    )
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING referral_code, referred_by, created_at, confirmed_at, (xmax = 0) AS inserted
  `

  // Real-time backup copy of every new signup (independent of the database).
  if (signup.inserted) {
    await backupSignup({
      email: normalizedEmail,
      referral_code: signup.referral_code as string,
      referred_by: (signup.referred_by as string | null) ?? null,
      created_at: signup.created_at as string,
    })
  }

  const referralCode = signup.referral_code as string
  const confirmed = signup.confirmed_at !== null

  const [{ referral_count: referralCount }] = await sql`
    SELECT COUNT(*)::int AS referral_count
    FROM waitlist_signups
    WHERE referred_by = ${referralCode}
  `

  const [{ position }] = await sql`
    WITH counts AS (
      SELECT referred_by, COUNT(*)::int AS n
      FROM waitlist_signups
      WHERE referred_by IS NOT NULL
      GROUP BY referred_by
    ),
    scored AS (
      SELECT
        w.referral_code,
        w.created_at - (COALESCE(c.n, 0) * INTERVAL '1 day' * ${REFERRAL_BOOST_DAYS}) AS effective_time
      FROM waitlist_signups w
      LEFT JOIN counts c ON c.referred_by = w.referral_code
    )
    SELECT COUNT(*)::int + 1 AS position
    FROM scored
    WHERE effective_time < (
      SELECT effective_time FROM scored WHERE referral_code = ${referralCode}
    )
  `

  // Double opt-in: email a confirmation link unless already confirmed.
  // Re-sending is throttled to once per 2 minutes per address.
  if (!confirmed) {
    const [pending] = await sql`
      UPDATE waitlist_signups
      SET confirm_token = COALESCE(confirm_token, ${generateConfirmToken()}),
          confirm_sent_at = now()
      WHERE referral_code = ${referralCode}
        AND (confirm_sent_at IS NULL OR confirm_sent_at < now() - INTERVAL '2 minutes')
      RETURNING confirm_token
    `
    if (pending) {
      const sent = await sendConfirmationEmail(normalizedEmail, pending.confirm_token as string, {
        position: position + EXTERNAL_SIGNUP_BASE,
        referralCode,
      })
      if (!sent) {
        // Let the next attempt retry immediately.
        await sql`UPDATE waitlist_signups SET confirm_sent_at = NULL WHERE referral_code = ${referralCode}`
      }
    }
  }

  return Response.json({
    ok: true,
    referralCode,
    referralCount,
    position: position + EXTERNAL_SIGNUP_BASE,
    confirmed,
  })
}
