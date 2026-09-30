import type { NeonQueryFunction } from "@neondatabase/serverless"

// Double opt-in: every signup gets a confirmation email with a one-time link.
// Columns are added lazily (once per cold start) so no manual migration is
// needed; scripts/migrate.mjs does the same for fresh databases.
let schemaReady: Promise<unknown> | null = null
export function ensureConfirmationSchema(sql: NeonQueryFunction<false, false>) {
  schemaReady ??= (async () => {
    await sql`ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ`
    await sql`ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS confirm_token TEXT UNIQUE`
    await sql`ALTER TABLE waitlist_signups ADD COLUMN IF NOT EXISTS confirm_sent_at TIMESTAMPTZ`
  })().catch((err) => {
    schemaReady = null
    throw err
  })
  return schemaReady
}

export function generateConfirmToken(): string {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "")
}

const SITE_URL = (process.env.SITE_URL || "https://www.meridian-terminal.com").replace(/\/$/, "")
const FROM = process.env.RESEND_FROM || "Meridian <hello@meridian-terminal.com>"

export async function sendConfirmationEmail(email: string, token: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[confirm] RESEND_API_KEY is not set, skipping email")
    return false
  }
  const link = `${SITE_URL}/api/confirm?token=${encodeURIComponent(token)}`
  const html = `<!doctype html>
<html><body style="margin:0;background:#0b0b0c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#e8e8ea">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#141416;border:1px solid #26262a;border-radius:16px;padding:36px 32px">
        <tr><td>
          <p style="margin:0 0 24px;font-size:18px;letter-spacing:.02em;color:#ffffff">Meridian</p>
          <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#ffffff">Confirm your email</h1>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#a1a1aa">
            Thanks for joining the Meridian waitlist. Click below to confirm your email and lock in your spot.
          </p>
          <a href="${link}" style="display:inline-block;background:#ffffff;color:#0b0b0c;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:999px">Confirm my email</a>
          <p style="margin:28px 0 0;font-size:12px;line-height:1.6;color:#71717a">
            Or paste this link in your browser:<br><a href="${link}" style="color:#a1a1aa;word-break:break-all">${link}</a>
          </p>
          <p style="margin:24px 0 0;font-size:12px;color:#71717a">If you didn't sign up, you can ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
  const text = `Thanks for joining the Meridian waitlist.\n\nConfirm your email: ${link}\n\nIf you didn't sign up, you can ignore this email.`

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [email], subject: "Confirm your spot on the Meridian waitlist", html, text }),
    })
    if (!res.ok) {
      console.error("[confirm] Resend error", res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error("[confirm] Resend request failed", err)
    return false
  }
}
