import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

await sql`
  CREATE TABLE IF NOT EXISTS waitlist_signups (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`

await sql`
  ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE
`

await sql`
  ALTER TABLE waitlist_signups
    ADD COLUMN IF NOT EXISTS referred_by TEXT REFERENCES waitlist_signups(referral_code)
`

console.log("waitlist_signups table ready")
