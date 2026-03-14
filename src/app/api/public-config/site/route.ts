import { NextResponse } from 'next/server'

/**
 * Config pública do site (Site + Portal + Workspace).
 * Valores opcionais via env: SITE_PHONE_BR, SITE_WHATSAPP_BR, SITE_ADDRESS_BR, etc.
 */
export async function GET() {
  const config: Record<string, string | undefined> = {}
  if (process.env.SITE_PHONE_BR) config.site_phone_br = process.env.SITE_PHONE_BR
  if (process.env.SITE_WHATSAPP_BR) config.site_whatsapp_br = process.env.SITE_WHATSAPP_BR
  if (process.env.SITE_ADDRESS_BR) config.site_address_br = process.env.SITE_ADDRESS_BR
  if (process.env.SALES_EMAIL) config.sales_email = process.env.SALES_EMAIL
  if (process.env.SUPPORT_EMAIL) config.support_email = process.env.SUPPORT_EMAIL
  if (process.env.COMPANY_NAME) config.company_name = process.env.COMPANY_NAME
  return NextResponse.json(config)
}
