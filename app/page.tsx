"use client";
import { useState, useMemo } from "react";
import { Search, Book, PenTool, Hash, HelpCircle } from "lucide-react";
import initialData from "../data.json";

export default function ExamPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"theory" | "practice">("theory");

  const filtered = useMemo(() => {
    const searchStr = query.toLowerCase().trim();
    return (initialData as any[]).filter(item => {
      const matchTab = item.type === tab;
      const matchText = item.title.toLowerCase().includes(searchStr) || 
                        item.content.toLowerCase().includes(searchStr);
      return matchTab && matchText;
    });
  }, [query, tab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <header className="sticky top-0 bg-slate-50/90 backdrop-blur-md pt-8 pb-4 z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Hash className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black">MDK.EXAM</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по тексту или номеру..."
              className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm outline-none focus:border-blue-500 transition-all shadow-blue-900/5"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-6 bg-slate-200/50 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setTab("theory")}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all ${tab === "theory" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}
            >Теория</button>
            <button
              onClick={() => setTab("practice")}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all ${tab === "practice" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}
            >Практика</button>
          </div>
        </header>

        <div className="mt-8 space-y-4">
          {filtered.length > 0 ? filtered.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
              <h2 className="text-lg font-bold text-slate-800 mb-4 leading-tight">{item.title}</h2>
              <div 
                className="text-slate-600 text-sm md:text-base leading-relaxed break-words overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <HelpCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Ничего не найдено</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
