import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { message } = body

        if (!message) {
            return NextResponse.json(
                { error: 'Mensagem é obrigatória' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Chat não disponível no momento. Use o formulário de contato.' },
            { status: 501 }
        )
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error))
        console.error('Erro ao processar chat:', err.message)
        return NextResponse.json(
            { error: 'Erro ao processar sua mensagem. Tente novamente.' },
            { status: 500 }
        )
    }
}
