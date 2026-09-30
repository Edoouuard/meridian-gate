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

type EmailContext = {
  position?: number
  referralCode?: string
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

// Brand: deep ocean blue background, white type, Instrument Serif headlines
// (falls back to Georgia in clients that block web fonts, e.g. Gmail).
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif"
const SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

export function renderConfirmationEmail(link: string, ctx: EmailContext = {}) {
  const safeLink = esc(link)
  const referralLink = ctx.referralCode ? `${SITE_URL}/?ref=${encodeURIComponent(ctx.referralCode)}` : null
  const positionLine = ctx.position ? `You're <span style="font-family:${SERIF};font-size:20px;color:#ffffff">#${ctx.position}</span> on the list.` : "Your spot is reserved."

  const step = (n: string, title: string, body: string) => `
    <tr><td style="padding:0 0 18px">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
        <td valign="top" width="34" style="font-family:${SANS};font-size:12px;color:#7fa7bf;padding-top:3px">${n}</td>
        <td valign="top">
          <p style="margin:0 0 4px;font-family:${SERIF};font-size:19px;color:#ffffff">${title}</p>
          <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.6;color:#a9c1cf">${body}</p>
        </td>
      </tr></table>
    </td></tr>`

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<title>Confirm your spot on Meridian</title>
</head>
<body style="margin:0;padding:0;background:#002b42">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">One click to lock in your early access to the prompt-to-trade terminal for DeFi.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#002b42">
<tr><td align="center" style="padding:40px 16px 48px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">

  <tr><td style="padding:0 4px 36px">
    <span style="font-family:${SERIF};font-size:26px;color:#ffffff;letter-spacing:.01em">Meridian</span>
    <br><span style="font-family:${SANS};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#7fa7bf">Prompt-to-trade · DeFi terminal</span>
  </td></tr>

  <tr><td style="padding:0 4px">
    <h1 style="margin:0 0 18px;font-family:${SERIF};font-weight:400;font-size:44px;line-height:1.05;color:#ffffff">
      Form your thesis.<br>Execute it. <em style="color:#a9c1cf">All at once.</em>
    </h1>
    <p style="margin:0 0 8px;font-family:${SANS};font-size:16px;line-height:1.6;color:#d6e3ea">
      Thanks for joining the waitlist. ${positionLine}
    </p>
    <p style="margin:0 0 28px;font-family:${SANS};font-size:16px;line-height:1.6;color:#a9c1cf">
      Confirm your email so we can reach you the moment Meridian opens.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#ffffff">
      <a href="${safeLink}" style="display:inline-block;padding:15px 30px;font-family:${SANS};font-size:15px;font-weight:500;color:#0a0a0a;text-decoration:none;border-radius:999px">Confirm my email &rarr;</a>
    </td></tr></table>
  </td></tr>

  <tr><td style="padding:44px 4px 0">
    <p style="margin:0 0 18px;font-family:${SANS};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#7fa7bf">How it works</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${step("01", "State your thesis", "Type what you believe: go long ETH, hedge my portfolio, lock in fixed yield. No forms, no protocol-hopping.")}
      ${step("02", "Meridian finds the trade", "We scan Aave, Morpho, Lido, Pendle, Hyperliquid, Uniswap and more to propose the clearest path to execute it.")}
      ${step("03", "Review, then act", "See the exact positions, the risk and the route before you sign anything. Nothing executes without you.")}
    </table>
  </td></tr>

  ${referralLink ? `<tr><td style="padding:22px 4px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #0d4d70;border-radius:18px">
      <tr><td style="padding:20px 22px">
        <p style="margin:0 0 6px;font-family:${SERIF};font-size:20px;color:#ffffff">Move up the list</p>
        <p style="margin:0 0 12px;font-family:${SANS};font-size:14px;line-height:1.6;color:#a9c1cf">Every friend who joins through your link moves you closer to the front.</p>
        <a href="${esc(referralLink)}" style="font-family:${SANS};font-size:13px;color:#ffffff;word-break:break-all">${esc(referralLink.replace(/^https?:\/\//, ""))}</a>
      </td></tr>
    </table>
  </td></tr>` : ""}

  <tr><td style="padding:40px 4px 0;border-top:0">
    <p style="margin:0 0 10px;font-family:${SANS};font-size:12px;line-height:1.6;color:#7fa7bf">
      Button not working? Paste this link in your browser:<br>
      <a href="${safeLink}" style="color:#a9c1cf;word-break:break-all">${safeLink}</a>
    </p>
    <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:#7fa7bf">
      You're receiving this because this address joined the waitlist at meridian-terminal.com. If that wasn't you, just ignore this email.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`

  const text = [
    "Meridian: form your thesis. Execute it. All at once.",
    "",
    `Thanks for joining the waitlist.${ctx.position ? ` You're #${ctx.position} on the list.` : ""}`,
    "Confirm your email so we can reach you the moment Meridian opens:",
    link,
    "",
    "How it works:",
    "1. State your thesis: go long ETH, hedge my portfolio, lock in fixed yield.",
    "2. Meridian finds the trade across Aave, Morpho, Lido, Pendle, Hyperliquid, Uniswap and more.",
    "3. Review, then act. Nothing executes without you.",
    ...(referralLink ? ["", `Move up the list, share your link: ${referralLink}`] : []),
    "",
    "If you didn't sign up, you can ignore this email.",
  ].join("\n")

  const subject = ctx.position
    ? `You're #${ctx.position} on the Meridian waitlist. Confirm your spot`
    : "Confirm your spot on the Meridian waitlist"

  return { subject, html, text }
}

export async function sendConfirmationEmail(
  email: string,
  token: string,
  ctx: EmailContext = {}
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[confirm] RESEND_API_KEY is not set, skipping email")
    return false
  }
  const link = `${SITE_URL}/api/confirm?token=${encodeURIComponent(token)}`
  const { subject, html, text } = renderConfirmationEmail(link, ctx)

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [email], subject, html, text }),
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
