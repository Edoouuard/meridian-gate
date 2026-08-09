import { neon } from "@neondatabase/serverless"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request): Promise<Response> {
  let email: unknown
  try {
    ;({ email } = await request.json())
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Enter a valid email." }, { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)

  await sql`
    INSERT INTO waitlist_signups (email)
    VALUES (${email.trim().toLowerCase()})
    ON CONFLICT (email) DO NOTHING
  `

  return Response.json({ ok: true })
}
