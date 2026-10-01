import { neon } from "@neondatabase/serverless"
import { ensureConfirmationSchema } from "./_lib/confirmation.js"

const TASKS = new Set(["follow", "engage", "engage2", "share", "copy"])

// Records that a signup clicked one of the post-signup tasks (shown in the back office).
export async function POST(request: Request): Promise<Response> {
  let code: unknown
  let task: unknown
  try {
    ;({ code, task } = await request.json())
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }
  if (typeof code !== "string" || typeof task !== "string" || !TASKS.has(task)) {
    return Response.json({ error: "Invalid task" }, { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  await ensureConfirmationSchema(sql)
  await sql`
    INSERT INTO task_events (referral_code, task)
    SELECT referral_code, ${task} FROM waitlist_signups WHERE referral_code = ${code}
    ON CONFLICT DO NOTHING
  `
  return Response.json({ ok: true })
}
