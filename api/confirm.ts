import { neon } from "@neondatabase/serverless"
import { ensureConfirmationSchema } from "./_lib/confirmation.js"

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const redirect = (state: string) =>
    Response.redirect(new URL(`/?confirmed=${state}`, url.origin).toString(), 302)

  if (!token) return redirect("invalid")

  const sql = neon(process.env.DATABASE_URL!)
  await ensureConfirmationSchema(sql)

  const rows = await sql`
    UPDATE waitlist_signups
    SET confirmed_at = COALESCE(confirmed_at, now())
    WHERE confirm_token = ${token}
    RETURNING referral_code
  `
  return redirect(rows.length ? "1" : "invalid")
}
