import { NextResponse } from 'next/server'

/**
 * Legacy dashboard/me (CRM) removed. Use Portal for customer panel.
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Use the Portal for your panel. This endpoint is no longer available.' },
    { status: 410 }
  )
}
