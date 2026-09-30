import { neon } from "@neondatabase/serverless"
import { ensureConfirmationSchema } from "./_lib/confirmation.js"

const REFERRAL_BOOST_DAYS = 2
// Keep in sync with api/waitlist-count.ts and api/waitlist.ts
const EXTERNAL_SIGNUP_BASE = Number(process.env.EXTERNAL_SIGNUP_BASE || 0)

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const referralCode = url.searchParams.get("code")

  if (!referralCode) {
    return Response.json({ error: "Missing code" }, { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  await ensureConfirmationSchema(sql)

  const rows = await sql`
    SELECT referral_code, confirmed_at FROM waitlist_signups WHERE referral_code = ${referralCode}
  `
  if (rows.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 })
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
    referralCode,
    referralCount,
    position: position + EXTERNAL_SIGNUP_BASE,
    confirmed: rows[0].confirmed_at !== null,
  })
}
