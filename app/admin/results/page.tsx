"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AdminResultsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/results-data");
      const d = await res.json();
      setData(d.items || []);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Результаты (всего: {data.length})</h1>
        <Button onClick={fetchResults} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Обновить
        </Button>
      </div>

      {loading && data.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Загрузка...</p>
      ) : data.length === 0 ? (
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
