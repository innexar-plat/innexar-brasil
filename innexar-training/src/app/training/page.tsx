"use client";

import Quiz from "@/components/Quiz";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { TRAINING_MODULES } from "@/lib/data";
import { Suspense } from "react";

function TrainingContent() {
    const searchParams = useSearchParams();
    const moduleId = searchParams.get("module") || "m1";
    const module = TRAINING_MODULES.find(m => m.id === moduleId) || TRAINING_MODULES[0];

    return (
        <div className="max-w-4xl mx-auto">
            <a href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 font-medium transition-colors">
                <ArrowLeft size={20} /> Voltar ao Painel
            </a>

            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                        Módulo: {module.id}
                    </span>
                </div>
                <h1 className="text-4xl font-bold mb-4">{module.title}</h1>
                <p className="text-muted-foreground text-lg">
                    {module.description}
                </p>
            </header>

            <Quiz questions={module.quizQuestions} title={module.title} />

            {module.details && (
                <div className="mt-12 bg-card border rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Pontos Chave do Módulo</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {module.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                {detail}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default function TrainingPage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12 animate-in text-foreground">
            <Suspense fallback={<div className="text-center p-12">Carregando conteúdo...</div>}>
                <TrainingContent />
            </Suspense>
        </div>
    );
}
