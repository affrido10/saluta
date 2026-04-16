"use client";
import { useState, useMemo } from "react";
import { Search, Book, PenTool, Hash, Info } from "lucide-react";
import data from "../data.json";

export default function ExamSite() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"theory" | "practice">("theory");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return data.filter(item => item.type === tab);

    return data.filter((item) => {
      const isCorrectTab = item.type === tab;
      const inTitle = item.title.toLowerCase().includes(q);
      const inContent = item.content.toLowerCase().includes(q);
      const byId = item.id.toString() === q || item.title.startsWith(q);
      
      return isCorrectTab && (inTitle || inContent || byId);
    });
  }, [query, tab]);

  return (
    <div className="max-w-3xl mx-auto min-h-screen px-4 pb-10 bg-slate-50">
      <header className="sticky top-0 bg-slate-50/95 backdrop-blur-sm pt-8 pb-4 z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Hash className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">MDK.HELP</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Номер билета или текст вопроса..."
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none focus:border-blue-500 transition-all text-lg"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setTab("theory")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              tab === "theory" ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Book className="w-5 h-5" /> Теория
          </button>
          <button
            onClick={() => setTab("practice")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              tab === "practice" ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            <PenTool className="w-5 h-5" /> Практика
          </button>
        </div>
      </header>

      <main className="mt-6 space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item: any) => (
            <div key={item.id + item.type} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 leading-snug">{item.title}</h2>
              </div>
              <div 
                className="text-slate-600 text-base leading-relaxed prose-blue"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Ничего не нашли. Попробуй другое слово.</p>
          </div>
        )}
      </main>
    </div>
  );
}
