import { neon } from "@neondatabase/serverless"
import {
  ensureConfirmationSchema,
  generateConfirmToken,
  sendConfirmationEmail,
} from "./_lib/confirmation.js"

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
  try {
    ;({ email, ref } = await request.json())
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Enter a valid email." }, { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  await ensureConfirmationSchema(sql)
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
    RETURNING referral_code, confirmed_at
  `

  const referralCode = signup.referral_code as string
  const confirmed = signup.confirmed_at !== null

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
      const sent = await sendConfirmationEmail(normalizedEmail, pending.confirm_token as string)
      if (!sent) {
        // Let the next attempt retry immediately.
        await sql`UPDATE waitlist_signups SET confirm_sent_at = NULL WHERE referral_code = ${referralCode}`
      }
    }
  }

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

  return Response.json({
    ok: true,
    referralCode,
    referralCount,
    position: position + EXTERNAL_SIGNUP_BASE,
    confirmed,
  })
}
