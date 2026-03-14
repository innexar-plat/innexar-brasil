// Stripe/SMTP: usa apenas variáveis de ambiente (Site + Portal + Workspace).

export interface StripeConfig {
    stripe_secret_key?: string
    stripe_publishable_key?: string
    stripe_webhook_secret?: string
}

export interface SMTPConfig {
    smtp_host?: string
    smtp_port?: string
    smtp_secure?: string
    smtp_user?: string
    smtp_password?: string
    smtp_from_email?: string
}

export async function getStripeSecretKey(): Promise<string> {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
        throw new Error('Stripe secret key not configured. Set STRIPE_SECRET_KEY env var.')
    }
    return key
}

export async function getStripeWebhookSecret(): Promise<string> {
    return process.env.STRIPE_WEBHOOK_SECRET || ''
}

export async function getStripePublishableKey(): Promise<string> {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
}

export async function getSMTPConfig(): Promise<SMTPConfig> {
    return {
        smtp_host: process.env.SMTP_HOST,
        smtp_port: process.env.SMTP_PORT,
        smtp_secure: process.env.SMTP_SECURE,
        smtp_user: process.env.SMTP_USER,
        smtp_password: process.env.SMTP_PASSWORD,
        smtp_from_email: process.env.SMTP_FROM_EMAIL,
    }
}
