import { neon } from "@neondatabase/serverless"
import {
  addResendContact,
  confirmLink,
  ensureConfirmationSchema,
  renderConfirmationEmail,
  sendBatch,
} from "../_lib/confirmation.js"

// Runs once a day (vercel.json). Two jobs:
// 1. Remind signups who haven't confirmed after 24h (one reminder max, only
//    for signups less than 7 days old). Capped to stay within Resend quotas.
// 2. Retry adding confirmed signups to Resend Contacts if it failed earlier.
const REMINDER_CAP = 50
const SYNC_CAP = 50

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  const sql = neon(process.env.DATABASE_URL!)
  await ensureConfirmationSchema(sql)

  // 1. Reminders
  const pending = await sql`
    SELECT email, confirm_token, referral_code
    FROM waitlist_signups
    WHERE confirmed_at IS NULL
      AND confirm_token IS NOT NULL
      AND reminder_sent_at IS NULL
      AND created_at < now() - INTERVAL '24 hours'
      AND created_at > now() - INTERVAL '7 days'
    ORDER BY created_at
    LIMIT ${REMINDER_CAP}
  `
  let reminded = 0
  if (pending.length) {
    const messages = pending.map((r) => {
      const { subject, html, text } = renderConfirmationEmail(confirmLink(r.confirm_token as string), {
        reminder: true,
        referralCode: r.referral_code as string,
      })
      return { to: r.email as string, subject, html, text }
    })
    if (await sendBatch(messages)) {
      const emails = pending.map((r) => r.email as string)
      await sql`UPDATE waitlist_signups SET reminder_sent_at = now() WHERE email = ANY(${emails})`
      reminded = pending.length
    }
  }

  // 2. Resend Contacts sync (retries)
  const unsynced = await sql`
    SELECT email FROM waitlist_signups
    WHERE confirmed_at IS NOT NULL AND audience_synced_at IS NULL
    ORDER BY confirmed_at
    LIMIT ${SYNC_CAP}
  `
  let synced = 0
  for (const r of unsynced) {
    if (await addResendContact(r.email as string)) {
      await sql`UPDATE waitlist_signups SET audience_synced_at = now() WHERE email = ${r.email as string}`
      synced++
    }
    await new Promise((res) => setTimeout(res, 600)) // stay under Resend's rate limit
  }

  return Response.json({ reminded, synced })
}
