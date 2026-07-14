"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editOptions, setEditOptions] = useState<Option[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newOptions, setNewOptions] = useState<Option[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const fetchQuestions = async () => {
    const res = await fetch("/api/questions");
    if (res.ok) {
      const data = await res.json();
      setQuestions(data);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async () => {
    if (!newText.trim()) {
      toast.error("Введите текст вопроса");
      return;
    }

    const validOptions = newOptions.filter((o) => o.text.trim());
    if (validOptions.length < 2) {
      toast.error("Добавьте минимум 2 варианта ответа");
      return;
    }

    if (!validOptions.some((o) => o.isCorrect)) {
      toast.error("Отметьте хотя бы один правильный ответ");
      return;
    }

    const id = toast.loading("Добавляем вопрос...");
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText.trim(), options: validOptions }),
    });

    if (res.ok) {
      toast.success("Вопрос добавлен!", { id });
      setNewText("");
      setNewOptions([{ text: "", isCorrect: false }, { text: "", isCorrect: false }]);
      setIsAdding(false);
      fetchQuestions();
    } else {
      toast.error("Ошибка при добавлении", { id });
    }
  };

  const handleEdit = (question: Question) => {
    setEditingId(question.id);
    setEditText(question.text);
    setEditOptions(question.options.map((o) => ({ ...o })));
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      toast.error("Введите текст вопроса");
      return;
    }

    const validOptions = editOptions.filter((o) => o.text.trim());
    if (validOptions.length < 2) {
      toast.error("Добавьте минимум 2 варианта ответа");
      return;
    }

    if (!validOptions.some((o) => o.isCorrect)) {
      toast.error("Отметьте хотя бы один правильный ответ");
      return;
    }

    const id = toast.loading("Сохраняем...");
    const res = await fetch("/api/questions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        text: editText.trim(),
        options: validOptions,
      }),
    });

    if (res.ok) {
      toast.success("Вопрос обновлён!", { id });
      setEditingId(null);
      fetchQuestions();
    } else {
      toast.error("Ошибка при сохранении", { id });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Удалить этот вопрос?");
    if (!confirmed) return;

    const toastId = toast.loading("Удаляем...");
    const res = await fetch(`/api/questions?id=${id}`, { method: "DELETE" });

    if (res.ok) {
      toast.success("Вопрос удалён!", { id: toastId });
      fetchQuestions();
    } else {
      toast.error("Ошибка при удалении", { id: toastId });
    }
  };

  const addNewOption = () => {
    setNewOptions([...newOptions, { text: "", isCorrect: false }]);
  };

  const addEditOption = () => {
    setEditOptions([...editOptions, { text: "", isCorrect: false }]);
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="mb-4">
          <Plus className="w-4 h-4 mr-2" />
          Добавить вопрос
        </Button>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="bg-white rounded-xl border p-4 space-y-4">
          <Input
            placeholder="Текст вопроса"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <div className="space-y-2">
            {newOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) => {
                    const updated = [...newOptions];
                    updated[index] = { ...updated[index], isCorrect: e.target.checked };
                    setNewOptions(updated);
                  }}
                  className="w-4 h-4"
                />
                <Input
                  placeholder={`Вариант ${index + 1}`}
                  value={option.text}
                  onChange={(e) => {
                    const updated = [...newOptions];
                    updated[index] = { ...updated[index], text: e.target.value };
                    setNewOptions(updated);
                  }}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={addNewOption} variant="outline" size="sm">
              <Plus className="w-3 h-3 mr-1" /> Вариант
            </Button>
            <Button onClick={handleAdd}>Добавить</Button>
            <Button onClick={() => setIsAdding(false)} variant="ghost">Отмена</Button>
          </div>
        </div>
      )}

      {/* Questions List */}
      {questions.map((question) => (
        <div key={question.id} className="bg-white rounded-xl border p-4">
          {editingId === question.id ? (
            <div className="space-y-4">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className="space-y-2">
                {editOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) => {
                        const updated = [...editOptions];
                        updated[index] = { ...updated[index], isCorrect: e.target.checked };
                        setEditOptions(updated);
                      }}
                      className="w-4 h-4"
                    />
                    <Input
                      value={option.text}
                      onChange={(e) => {
                        const updated = [...editOptions];
                        updated[index] = { ...updated[index], text: e.target.value };
                        setEditOptions(updated);
                      }}
                      className="flex-1"
                      placeholder={`Вариант ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={addEditOption} variant="outline" size="sm">
                  <Plus className="w-3 h-3 mr-1" /> Вариант
                </Button>
                <Button onClick={handleSaveEdit} size="sm">
                  <Check className="w-4 h-4 mr-1" /> Сохранить
                </Button>
                <Button onClick={() => setEditingId(null)} variant="ghost" size="sm">
                  <X className="w-4 h-4 mr-1" /> Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{question.text}</h3>
                <div className="flex gap-1">
                  <Button onClick={() => handleEdit(question)} variant="ghost" size="sm">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(question.id)} variant="ghost" size="sm" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                {question.options.map((option, index) => (
                  <div key={index} className={`text-sm px-3 py-1 rounded ${option.isCorrect ? "bg-green-50 text-green-700" : "text-gray-600"}`}>
                    {option.isCorrect && "✓ "}{option.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
