"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw } from "lucide-react";
import { QuizQuestion } from "@/lib/data";

interface QuizProps {
    questions: QuizQuestion[];
    title: string;
}

export default function QuizComponent({ questions, title }: QuizProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    if (!questions || questions.length === 0) {
        return (
            <div className="bg-card border rounded-3xl p-8 text-center">
                <p className="text-muted-foreground">Nenhum quiz disponível para este módulo.</p>
            </div>
        );
    }

    const handleSelect = (idx: number) => {
        if (isSubmitted) return;
        setSelectedOption(idx);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        setIsSubmitted(true);
        if (selectedOption === questions[currentQuestion].correct) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setShowResult(false);
    };

    if (showResult) {
        return (
            <div className="bg-card border rounded-3xl p-8 text-center animate-in">
                <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full mb-6">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-bold mb-2">Treinamento Concluído!</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                    Você acertou {score} de {questions.length} questões no módulo {title}.
                </p>
                <button
                    onClick={resetQuiz}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    Tentar Novamente <RefreshCcw size={20} />
                </button>
            </div>
        );
    }

    const q = questions[currentQuestion];

    return (
        <div className="bg-card border rounded-3xl overflow-hidden animate-in">
            <div className="p-1 bg-secondary">
                <div
                    className="h-1.5 bg-primary transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
            </div>
            <div className="p-8 md:p-12">
                <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-6 inline-block">
                    Questão {currentQuestion + 1} de {questions.length}
                </span>
                <h3 className="text-2xl font-bold mb-8 leading-tight">{q.question}</h3>

                <div className="space-y-4 mb-8">
                    {q.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedOption === idx
                                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                                    : 'border-transparent bg-secondary/50 hover:bg-secondary'
                                } ${isSubmitted && idx === q.correct ? 'border-green-500 bg-green-50' : ''
                                } ${isSubmitted && selectedOption === idx && idx !== q.correct ? 'border-red-500 bg-red-50' : ''
                                }`}
                        >
                            <span className="font-medium text-lg">{opt}</span>
                            {isSubmitted && idx === q.correct && <CheckCircle2 className="text-green-500" size={24} />}
                            {isSubmitted && selectedOption === idx && idx !== q.correct && <XCircle className="text-red-500" size={24} />}
                        </button>
                    ))}
                </div>

                {isSubmitted && (
                    <div className="bg-secondary/50 p-6 rounded-2xl mb-8 border-l-4 border-primary">
                        <p className="font-bold text-primary mb-1">Explicação:</p>
                        <p className="text-muted-foreground">{q.explanation}</p>
                    </div>
                )}

                <div className="flex justify-end">
                    {!isSubmitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
                        >
                            Confirmar Resposta
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="bg-foreground text-background px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            {currentQuestion + 1 === questions.length ? "Ver Resultado" : "Próxima Questão"} <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
