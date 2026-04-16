"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, Book, PenTool, Hash, HelpCircle, X } from "lucide-react";
import data from "../data.json";

export default function ExamPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"theory" | "practice">("theory");

  // Авто-сброс поиска при переключении вкладок для исключения пустых экранов
  useEffect(() => {
    setQuery("");
  }, [tab]);

  const filtered = useMemo(() => {
    const searchWords = query
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ") // Заменяем знаки на пробелы
      .split(/\s+/)
      .filter(word => word.length > 0);

    return (data as any[]).filter(item => {
      if (item.type !== tab) return false;
      if (searchWords.length === 0) return true;

      const titleClean = item.title.toLowerCase();
      const contentClean = item.content.toLowerCase();

      return searchWords.every(word => 
        titleClean.includes(word) || contentClean.includes(word)
      );
    });
  }, [query, tab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-4">
        
        <header className="sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-xl pt-8 pb-4 z-20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Hash className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">MDK.HELP</h1>
            </div>
            <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
              v1.0.2 ONLINE
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              value={query}
              placeholder={`Поиск в ${tab === 'theory' ? 'теории' : 'практике'}...`}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 shadow-sm outline-none focus:border-blue-500 transition-all text-lg"
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            )}
          </div>

          <div className="flex gap-2 mt-6 bg-slate-200/40 p-1.5 rounded-2xl w-fit border border-slate-200/50">
            <button
              onClick={() => setTab("theory")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                tab === "theory" ? "bg-white shadow-md text-blue-600" : "text-slate-500"
              }`}
            >
              <Book className="w-4 h-4" /> Теория
            </button>
            <button
              onClick={() => setTab("practice")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                tab === "practice" ? "bg-white shadow-md text-blue-600" : "text-slate-500"
              }`}
            >
              <PenTool className="w-4 h-4" /> Практика
            </button>
          </div>
        </header>

        <div className="mt-8 space-y-4">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-extrabold text-slate-800 leading-tight mb-4 border-b border-slate-50 pb-4">
                  {item.title}
                </h2>
                <div 
                  className="text-slate-600 text-[15px] md:text-base leading-relaxed break-words overflow-x-auto custom-scrollbar"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
              <HelpCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-bold">Ничего не найдено</p>
              <button onClick={() => setQuery("")} className="text-blue-600 font-semibold mt-2 underline">Сбросить поиск</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
