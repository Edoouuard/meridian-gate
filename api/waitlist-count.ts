import { neon } from "@neondatabase/serverless"

// Signups tracked outside this database (e.g. an existing contact list),
// added to the real count for display. Set by the site owner — this must
// stay backed by an actual real count, never adjusted to "look good."
const EXTERNAL_SIGNUP_BASE = Number(process.env.EXTERNAL_SIGNUP_BASE || 0)

export async function GET(): Promise<Response> {
  const sql = neon(process.env.DATABASE_URL!)

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count FROM waitlist_signups
  `

  return Response.json({ count: count + EXTERNAL_SIGNUP_BASE })
}
