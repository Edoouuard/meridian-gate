import { neon } from "@neondatabase/serverless"

export async function GET(): Promise<Response> {
  const sql = neon(process.env.DATABASE_URL!)

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count FROM waitlist_signups
  `

  return Response.json({ count })
}
