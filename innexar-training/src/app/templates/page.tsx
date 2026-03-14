"use client";

import { useState } from "react";
import { Copy, Check, Search, MessageSquare } from "lucide-react";
import { SALES_TEMPLATES } from "@/lib/data";

export default function TemplatesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredTemplates = SALES_TEMPLATES.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 animate-in text-foreground">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">Central de Mensagens</h1>
                    <p className="text-muted-foreground text-lg">Modelos prontos para acelerar sua comunicação.</p>
                </header>

                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por categoria ou título..."
                        className="w-full bg-card border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {filteredTemplates.map((template) => (
                        <div key={template.id} className="bg-card border rounded-2xl p-6 hover:border-primary/50 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded mb-2 inline-block">
                                        {template.category}
                                    </span>
                                    <h3 className="text-xl font-bold">{template.title}</h3>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(template.message, template.id)}
                                    className={`p-3 rounded-xl transition-all ${copiedId === template.id ? 'bg-green-500 text-white' : 'bg-secondary text-primary hover:scale-110'}`}
                                >
                                    {copiedId === template.id ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                            </div>
                            <div className="bg-secondary/50 rounded-xl p-4 text-muted-foreground font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                {template.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
