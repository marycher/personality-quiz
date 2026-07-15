"use client";

import { useState, useEffect } from "react";

interface QuizResult {
  id: string;
  name: string;
  percentage: number;
  wish: string;
  story: string;
  createdAt: string;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}

export default function AdminResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/results-data")
      .then(r => r.json())
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Загрузка...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Результаты</h1>
      {results.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Пока нет результатов</p>
      ) : (
        <div className="space-y-4">
          {results.map(r => (
            <div key={r.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{r.name}</h3>
                <span className="text-2xl font-bold text-purple-600">{r.percentage}%</span>
              </div>
              {r.wish && <p className="text-sm text-gray-600">💝 {r.wish}</p>}
              {r.story && <p className="text-sm text-gray-600">📖 {r.story}</p>}
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
