export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

export interface SaleTemplate {
    id: string;
    category: "lead" | "followup" | "closing" | "objection" | "briefing" | "contract";
    title: string;
    message: string;
}

export interface TrainingModule {
    id: string;
    title: string;
    description: string;
    icon: string;
    progress: number;
    image?: string;
    details?: string[];
    quizQuestions: QuizQuestion[];
}

export const SALES_TEMPLATES: SaleTemplate[] = [
    // LEADS
    {
        id: "l1",
        category: "lead",
        title: "Primeiro Contato (WhatsApp)",
        message: "Olá [Nome]! Sou [Seu Nome] da Innexar. Notei que você tem interesse em [Solução] e gostaria de entender como podemos ajudar sua empresa a escalar. Teria 5 minutos hoje?"
    },
    {
        id: "l2",
        category: "lead",
        title: "Abordagem LinkedIn",
        message: "Olá [Nome], vi seu perfil e percebi que estamos conectados ao setor de [Setor]. Trabalhamos com [Solução] para empresas como a sua e adoraria trocar uma ideia sobre seus desafios atuais em [Processo]. Aceita um convite?"
    },
    {
        id: "l3",
        category: "lead",
        title: "Cold Mail - Foco em Dor",
        message: "Oi [Nome],\n\nNotei que muitas empresas de [Setor] estão sofrendo com [Problema Comum]. Na Innexar, ajudamos a reduzir isso em [X]% através de [Solução]. Se isso for uma prioridade para você, adoraria mostrar como fizemos com o [Caso de Sucesso]."
    },
    // FOLLOW-UP
    {
        id: "f1",
        category: "followup",
        title: "Acompanhamento Pós-Reunião",
        message: "Olá [Nome], conforme conversamos, seguem os pontos principais da nossa reunião e a proposta anexa. Fico no aguardo de sua percepção sobre o [Item Específico]."
    },
    {
        id: "f2",
        category: "followup",
        title: "Follow-up Sem Resposta (Gelo)",
        message: "[Nome], estou passando para verificar se você conseguiu revisar os documentos. Faz sentido continuarmos nossa conversa ou suas prioridades mudaram?"
    },
    {
        id: "f3",
        category: "followup",
        title: "Check-in de Valor",
        message: "Oi [Nome], vi este artigo/notícia sobre [Tema] e lembrei de nossa conversa sobre [Desafio]. Achei que poderia ser útil para você!"
    },
    // OBJECTIONS
    {
        id: "o1",
        category: "objection",
        title: "Objeção: Ta caro",
        message: "Entendo perfeitamente o foco no investimento, [Nome]. No entanto, se considerarmos o ROI de [X]% que nossos clientes costumam ter, o custo se torna irrisório perante ao ganho de produtividade. Vamos analisar os números?"
    },
    {
        id: "o2",
        category: "objection",
        title: "Objeção: Já tenho fornecedor",
        message: "Que ótimo que você já utiliza uma solução! Isso mostra que sua empresa valoriza [Área]. Posso te enviar um breve comparativo de como a Innexar está entregando [Diferencial] de forma única? Sem compromisso."
    },
    {
        id: "o3",
        category: "objection",
        title: "Objeção: Falar com o Sócio",
        message: "Com certeza, decisão em conjunto é sempre melhor. Quer que eu participe desse papo para tirar as dúvidas técnicas dele e facilitar a análise de vocês?"
    },
    // BRIEFING
    {
        id: "b1",
        category: "briefing",
        title: "BANT - Orçamento",
        message: "Para que eu possa dimensionar a melhor solução, você já tem uma faixa de investimento separada para este projeto este ano?"
    },
    {
        id: "b2",
        category: "briefing",
        title: "BANT - Autoridade",
        message: "Além de você, quem mais precisaria estar presente na apresentação final para batermos o martelo no projeto?"
    },
    {
        id: "b3",
        category: "briefing",
        title: "Sondagem de Processos",
        message: "Como vocês resolvem o [Processo] hoje? Quanto tempo o time gasta fazendo isso manualmente?"
    },
    // CLOSING
    {
        id: "cl1",
        category: "closing",
        title: "Fechamento Direto",
        message: "Dado que solucionamos [Dor 1] e [Dor 2], podemos prosseguir com a ativação do plano [Nome do Plano] ainda esta semana?"
    },
    {
        id: "cl2",
        category: "closing",
        title: "Urgência de Agenda",
        message: "[Nome], se conseguirmos formalizar hoje, consigo garantir a implementação ainda para este mês. O que me diz?"
    },
    // CONTRACTS
    {
        id: "c1",
        category: "contract",
        title: "Cláusula de Escopo Básica",
        message: "O presente contrato tem como objeto a prestação de serviços de [Serviço], compreendendo as atividades de [Atividade 1], [Atividade 2] e [Atividade 3], conforme detalhado no Anexo I."
    },
    {
        id: "c2",
        category: "contract",
        title: "Mensagem de Envio de Contrato",
        message: "Tudo pronto, [Nome]! Conforme combinamos, segue o link para assinatura digital do nosso contrato. Qualquer dúvida nas cláusulas de [Cláusula], estou à disposição. Bem-vindo à Innexar!"
    }
];

export const TRAINING_MODULES: TrainingModule[] = [
    {
        id: "m1",
        title: "Técnica SPIN Selling",
        description: "Domine a arte de fazer as perguntas certas para descobrir as dores reais do cliente.",
        icon: "Target",
        progress: 0,
        image: "/images/spin_selling_concept_1771700561429.png",
        details: [
            "Situação: Entenda o contexto atual.",
            "Problema: Identifique as dores.",
            "Implicação: Mostre as consequências de não resolver.",
            "Necessidade: Apresente o valor da solução."
        ],
        quizQuestions: [
            {
                id: 1,
                question: "O que representa o 'I' na metodologia SPIN?",
                options: ["Investimento", "Implicação", "Implementação", "Inovação"],
                correct: 1,
                explanation: "Implicação serve para mostrar ao cliente as consequências negativas de não resolver o problema identificado."
            },
            {
                id: 2,
                question: "Qual o objetivo das perguntas de Necessidade de Solução?",
                options: ["Descobrir o orçamento", "Fazer o cliente falar os benefícios da sua solução", "Criticar a concorrência", "Finalizar o contrato"],
                correct: 1,
                explanation: "Estas perguntas levam o cliente a descrever como a solução o ajudaria, criando auto-convencimento."
            }
        ]
    },
    {
        id: "m2",
        title: "Análise Comportamental DISC",
        description: "Aprenda a identificar os 4 perfis predominantes e adapte seu discurso para cada um.",
        icon: "Users",
        progress: 0,
        image: "/images/disc_personality_types.png",
        details: [
            "Dominante: Focado em resultados e rapidez.",
            "Influente: Focado em conexões e entusiasmo.",
            "Estável: Focado em segurança e colaboração.",
            "Conforme: Focado em dados, qualidade e precisão."
        ],
        quizQuestions: [
            {
                id: 1,
                question: "Como você deve se comportar com um cliente de perfil 'Conforme'?",
                options: ["Ser muito efusivo e contar piadas", "Apresentar dados, fatos e evidências lógicas", "Falar rápido e pressionar por fechamento", "Focar apenas em amizade"],
                correct: 1,
                explanation: "O perfil Conforme valoriza precisão, detalhes técnicos e lógica."
            },
            {
                id: 2,
                question: "Qual a principal característica do perfil 'Influente'?",
                options: ["Analítico e calado", "Direto e autoritário", "Comunicativo e entusiasmado", "Paciência extrema"],
                correct: 2,
                explanation: "Influentes são movidos por interação social e entusiasmo."
            }
        ]
    },
    {
        id: "m3",
        title: "Glossário de Marketing e Vendas",
        description: "Entenda termos como ROI, CAC, LTV e BANT para falar a língua do mercado.",
        icon: "BarChart",
        progress: 0,
        image: "/images/marketing_roi_dashboard_concept.png",
        details: [
            "ROI: Retorno sobre o Investimento.",
            "CAC: Custo de Aquisição de Cliente.",
            "LTV: Lifetime Value (Quanto o cliente vale no tempo).",
            "BANT: Budget, Authority, Need, Timeframe."
        ],
        quizQuestions: [
            {
                id: 1,
                question: "O que significa CAC em marketing?",
                options: ["Custo de Apoio ao Cliente", "Custo de Aquisição de Cliente", "Conversão de Alta Categoria", "Canal de Atendimento Central"],
                correct: 1,
                explanation: "CAC é a soma de todos os custos de marketing e vendas dividida pelo número de clientes novos."
            }
        ]
    },
    {
        id: "m4",
        title: "Briefing e Qualificação",
        description: "Como conduzir reuniões de descoberta que garantem leads de alta qualidade.",
        icon: "Search",
        progress: 0,
        image: "/images/briefing_meeting_sales.png",
        details: [
            "Ouvir 70% e falar 30%.",
            "Identificar o 'Gatekeeper' vs 'Decisor'.",
            "Aprofundar na 'Dor do Negócio' vs 'Dor Pessoal'.",
            "Validar o 'Budget' de forma elegante."
        ],
        quizQuestions: [
            {
                id: 1,
                question: "Qual a melhor proporção de fala em um briefing inicial?",
                options: ["Falar 90% do tempo", "Ouvir 70% e falar 30%", "Falar 50/50", "Não falar nada"],
                correct: 1,
                explanation: "A fase de briefing é sobre coleta de informações; o vendedor deve ser um facilitador da fala do cliente."
            }
        ]
    }
];
