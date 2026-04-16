"use client";

import { useState, useMemo } from "react";
import { Search, Book, PenTool, Hash, AlertCircle } from "lucide-react";
import data from "../data.json";

export default function ExamSite() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"theory" | "practice">("theory");

  const filtered = useMemo(() => {
    const searchTerms = query.toLowerCase().trim().split(/\s+/); // Разделяем поиск на отдельные слова
    
    return (data as any[]).filter((item) => {
      const matchTab = item.type === tab;
      
      // Очищаем текст от лишних символов для более легкого поиска
      const itemTitle = item.title.toLowerCase();
      const itemContent = item.content.toLowerCase();
      
      // Проверяем, содержатся ли все слова из поиска в заголовке или контенте
      const matchSearch = searchTerms.every(term => 
        itemTitle.includes(term) || 
        itemContent.includes(term) ||
        String(item.id) === term
      );

      return matchTab && matchSearch;
    });
  }, [query, tab]);

  return (
    <div className="max-w-3xl mx-auto min-h-screen px-4 pb-20">
      <header className="sticky top-0 bg-slate-50/90 backdrop-blur-md pt-8 pb-4 z-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Hash className="text-white w-5 h-5" />
          </div>
          ExamHelper
        </h1>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Начните вводить текст вопроса..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <nav className="flex gap-2 mt-6 bg-slate-200/50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setTab("theory")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === "theory" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Book className="w-4 h-4" /> Теория ({ (data as any[]).filter(d => d.type === 'theory').length })
          </button>
          <button
            onClick={() => setTab("practice")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === "practice" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PenTool className="w-4 h-4" /> Практика ({ (data as any[]).filter(d => d.type === 'practice').length })
          </button>
        </nav>
      </header>

      <main className="mt-8 space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-slate-800 leading-tight tracking-tight">
                  {item.title}
                </h2>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                  Вопрос {item.id}
                </span>
              </div>
              <div 
                className="prose prose-slate max-w-none text-slate-600 text-sm md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Ничего не найдено</p>
            <p className="text-slate-400 text-sm">Попробуйте ввести только ключевое слово (например: "коммутации")</p>
          </div>
        )}
      </main>
    </div>
  );
}
