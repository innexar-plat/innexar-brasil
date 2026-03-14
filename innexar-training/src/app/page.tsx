import { Target, FileText, CheckCircle, MessageSquare, ArrowRight, Play, Copy } from "lucide-react";
import { TRAINING_MODULES, SALES_TEMPLATES } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-in">
      <header className="mb-12 max-w-5xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
            Innexar Sales Academy
          </h1>
          <p className="text-muted-foreground text-lg">
            Bem-vindo ao seu portal de excelência em vendas.
          </p>
        </div>
        <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Target size={28} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-12">
        {/* Training Modules Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Módulos de Treinamento</h2>
            <button className="text-primary flex items-center gap-2 font-medium hover:underline">
              Ver todos <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRAINING_MODULES.map((module) => (
              <div key={module.id} className="group bg-card border rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                {module.image && (
                  <div className="h-40 w-full relative overflow-hidden">
                    <img
                      src={module.image}
                      alt={module.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60"></div>
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-4 inline-flex p-3 bg-secondary rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {module.icon === "Target" && <Target size={24} />}
                    {module.icon === "FileText" && <FileText size={24} />}
                    {module.icon === "CheckCircle" && <CheckCircle size={24} />}
                    {module.icon === "Users" && <MessageSquare size={24} />}
                    {module.icon === "BarChart" && <ArrowRight size={24} />}
                    {module.icon === "Search" && <Play size={24} />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <a href={`/training?module=${module.id}`} className="p-2 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform">
                      <Play size={16} fill="currentColor" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Templates & Procedures Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Manual de Procedimentos</h3>
              <p className="text-muted-foreground mb-8">
                Acesse o passo a passo detalhado de cada etapa do nosso processo comercial, do primeiro contato ao pós-venda.
              </p>
              <a href="/procedures" className="bg-foreground text-background px-6 py-3 rounded-xl font-bold inline-flex items-center gap-3 hover:opacity-90 transition-opacity">
                Abrir Procedimentos <FileText size={20} />
              </a>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
              <FileText size={200} />
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <MessageSquare className="text-primary" /> Atalhos de Copy
            </h3>
            <div className="space-y-4">
              {SALES_TEMPLATES.slice(0, 2).map((template) => (
                <div key={template.id} className="bg-card border p-4 rounded-xl flex justify-between items-center group">
                  <div className="truncate pr-4">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{template.category}</p>
                    <p className="font-semibold">{template.title}</p>
                  </div>
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Copiar mensagem">
                    <Copy size={18} className="text-muted-foreground group-hover:text-primary" />
                  </button>
                </div>
              ))}
            </div>
            <a href="/templates" className="mt-8 text-primary font-bold inline-flex items-center gap-2 hover:underline">
              Ver biblioteca completa <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
