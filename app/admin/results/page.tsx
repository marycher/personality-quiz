"use client";

import { useState, useEffect } from "react";

export default function AdminResultsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/check-results")
      .then(r => r.json())
      .then(d => {
        const items = (d.items || []).map((item: any) => ({
          id: item.id?.S || "",
          name: item.name?.S || "Аноним",
          percentage: Number(item.percentage?.N || 0),
          wish: item.wish?.S || "",
          story: item.story?.S || "",
          createdAt: item.createdAt?.S || "",
          answers: (item.answers?.L || []).map((a: any) => ({
            questionId: a.M?.questionId?.S || "",
            selectedIndex: Number(a.M?.selectedIndex?.N || 0),
            isCorrect: a.M?.isCorrect?.BOOL || false,
          })),
        }));
        
        // Сортируем по дате (сначала новые)
        items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setData(items);
      })
      .catch(e => console.error("Error:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Загрузка...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Результаты (всего: {data.length})</h1>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Пока нет результатов</p>
      ) : (
        <div className="space-y-4">
          {data.map((r: any, i: number) => (
            <div key={r.id || i} className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{r.name}</h3>
                <span className="text-2xl font-bold text-purple-600">{r.percentage}%</span>
              </div>
              {r.wish ? <p className="text-sm text-gray-600">💝 {r.wish}</p> : null}
              {r.story ? <p className="text-sm text-gray-600">📖 {r.story}</p> : null}
              <p className="text-sm text-gray-400 mt-1">
                📅 {new Date(r.createdAt).toLocaleDateString("ru-RU")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
