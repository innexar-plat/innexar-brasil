import { FileText, ArrowRight, BookOpen, BarChart, ClipboardList } from "lucide-react";

const PROCEDURES = [
    {
        title: "Métricas e Siglas (Glossário)",
        icon: <BarChart size={28} />,
        color: "bg-blue-600",
        steps: [
            "ROI (Return on Investment): Lucro Líquido / Custo do Investimento. Ex: Investiu R$1mil, voltou R$5mil = ROI 4x.",
            "CAC (Cost to Acquire Customer): Soma de Marketing + Vendas / Novos Clientes.",
            "LTV (Lifetime Value): Faturamento total que um cliente gera enquanto está na empresa.",
            "BANT: Metodologia de qualificação (Budget, Authority, Need, Timeframe).",
            "Churn: Taxa de cancelamento de clientes em um período.",
            "MQL/SQL: Leads qualificados por Marketing e por Vendas, respectivamente."
        ]
    },
    {
        title: "Modelo de Briefing de Qualificação",
        icon: <ClipboardList size={28} />,
        color: "bg-emerald-600",
        steps: [
            "Pergunta Chave 1: Qual o objetivo principal de negócio você quer atingir hoje?",
            "Pergunta Chave 2: O que acontece se você não implementar essa solução em 6 meses?",
            "Pergunta Chave 3: Quem mais sofreria as consequências desse problema se não resolvido?",
            "Pergunta Chave 4: Além de você, quem mais assina o cheque ou valida a parte técnica?",
            "Pergunta Chave 5: Vocês já tentaram resolver isso antes? Como foi a experiência?"
        ]
    },
    {
        title: "Manual de Negociação & Fechamento",
        icon: <FileText size={28} />,
        color: "bg-indigo-600",
        steps: [
            "Técnica de Fechamento por Opções: 'Prefere começar com o plano Pro ou Enterprise?'",
            "Fechamento por Perca: 'Este bônus de ativação expira amanhã às 18h.'",
            "Contorno de Objeções: Ouça, empatize, isole a objeção e valide a solução.",
            "Envio de Contrato: Sempre valide o recebimento via WhatsApp logo após enviar por e-mail."
        ]
    }
];

export default function ProceduresPage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12 animate-in text-foreground">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">Manual de Procedimentos 2.0</h1>
                    <p className="text-muted-foreground text-lg">Guia profundo de execução comercial e terminologias da Innexar.</p>
                </header>

                <div className="space-y-8">
                    {PROCEDURES.map((proc, idx) => (
                        <section key={idx} className="bg-card border rounded-3xl overflow-hidden shadow-sm">
                            <div className={`${proc.color} p-6 flex items-center gap-4 text-white`}>
                                {proc.icon}
                                <h2 className="text-2xl font-bold">{proc.title}</h2>
                            </div>
                            <div className="p-8">
                                <ul className="space-y-6">
                                    {proc.steps.map((step, sIdx) => (
                                        <li key={sIdx} className="flex items-start gap-4 group">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                {sIdx + 1}
                                            </div>
                                            <div className="pt-1">
                                                <p className="text-lg font-medium leading-tight">{step}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
