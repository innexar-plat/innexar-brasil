import { NextRequest, NextResponse } from 'next/server'

const WORKSPACE_API_URL = (process.env.NEXT_PUBLIC_WORKSPACE_API_URL || process.env.WORKSPACE_API_URL || '').replace(/\/$/, '')

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, phone, interest, conversation_summary } = body

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Nome e email são obrigatórios' },
                { status: 400 }
            )
        }

        if (!WORKSPACE_API_URL) {
            return NextResponse.json(
                { error: 'Serviço de contato não configurado. Use o formulário de contato.' },
                { status: 501 }
            )
        }

        const response = await fetch(`${WORKSPACE_API_URL}/api/public/web-to-lead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                phone: phone || undefined,
                message: [interest, conversation_summary].filter(Boolean).join(' | ') || undefined,
                source: 'ai-lead',
            }),
        })

        if (!response.ok) {
            const errorData = await response.text()
            console.error('Workspace web-to-lead error:', errorData)
            return NextResponse.json(
                { error: 'Erro ao salvar contato' },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error: unknown) {
        console.error('Erro ao processar lead:', error)
        return NextResponse.json(
            { error: 'Erro ao processar sua solicitação.' },
            { status: 500 }
        )
    }
}
