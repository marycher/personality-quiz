"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Star, Trophy, Share2, Copy, Check } from "lucide-react";

interface ResultScreenProps {
  percentage: number;
  name: string;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}

function getResultMessage(percentage: number): string {
  if (percentage <= 40) {
    return "Безусловно, ты знаешь Алину, но ты явно не слышал много интересных историй от нее :) Самое время спросить, когда доедешь до места празднования!)";
  }
  if (percentage <= 70) {
    return "Ты неплохо знаешь Алину, но стоит спросить у нее про ее детство и интересные истории, когда доедешь до места празднования! :)";
  }
  if (percentage <= 90) {
    return "Ты пишешь мемуары Алининой жизни?! Ты великолепно знаешь ее истории и единственный совет тебе - создавай с ней новые!";
  }
  return "Кажется, ты и есть Алина :)))";
}

function getResultEmoji(percentage: number): string {
  if (percentage <= 40) return "😅";
  if (percentage <= 70) return "😊";
  if (percentage <= 90) return "🤩";
  return "😂";
}

export default function ResultScreen({ percentage, name, answers }: ResultScreenProps) {
  const [wish, setWish] = useState("");
  const [story, setStory] = useState("");
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedWish = localStorage.getItem("alina_wish");
    const savedStory = localStorage.getItem("alina_story");
    if (savedWish) setWish(savedWish);
    if (savedStory) setStory(savedStory);
  }, []);

  const handleSave = async () => {
    localStorage.setItem("alina_wish", wish);
    localStorage.setItem("alina_story", story);

    const id = toast.loading("Сохраняем результат...");

    try {
      console.log("Sending result:", { name, percentage, wish, story, answers });
      
      const res = await fetch("/api/quiz-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          percentage,
          wish,
          story,
          answers,
        }),
      });

      const text = await res.text();
      console.log("Response:", text);

      if (res.ok) {
        toast.success("Результат отправлен! 🎉", { id });
        setSaved(true);
      } else {
        toast.error(`Ошибка: ${text}`, { id });
      }
    } catch (e) {
      console.error("Error:", e);
      toast.success("Результат сохранён локально! 🎉", { id });
      setSaved(true);
    }
  };

  const handleShare = () => {
    setShareOpen(!shareOpen);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Ссылка скопирована!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: "Telegram", url: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Я набрал ${percentage}% в квизе "Я знаю Алину лучше всех"!`)}` },
    { name: "VK", url: `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(`Я набрал ${percentage}% в квизе "Я знаю Алину лучше всех"!`)}` },
    { name: "X", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Я набрал ${percentage}% в квизе "Я знаю Алину лучше всех"!`)}&url=${encodeURIComponent(window.location.href)}` },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <Star className="w-8 h-8 text-yellow-400" />
          <Trophy className="w-8 h-8 text-yellow-400" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {name ? `${name}, твой результат:` : "Твой результат:"}
        </h2>

        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="15.5"
              fill="none" stroke="#e5e7eb" strokeWidth="3"
            />
            <circle
              cx="18" cy="18" r="15.5"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeDasharray={`${percentage} ${100 - percentage}`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-3xl font-bold text-purple-700">
            {percentage}%
          </span>
        </div>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          {getResultMessage(percentage)}
        </p>

        <div className="text-6xl mb-6">{getResultEmoji(percentage)}</div>

        {/* Wish Section */}
        <div className="text-left mb-4">
          <Label htmlFor="wish" className="text-sm text-gray-600 mb-2 block">
            На праздновании не всегда получается сказать все то, что хочется. Иногда неловко, иногда некогда. Но здесь ты можешь сказать Алине все-все, а потом при возможности еще и сказать лично!
          </Label>
          <Textarea
            id="wish"
            placeholder="Напишите ваше пожелание..."
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Story Section */}
        <div className="text-left mb-6">
          <Label htmlFor="story" className="text-sm text-gray-600 mb-2 block">
            Все мы любим воспоминания. Ты очень порадуешь Алину, если расскажешь любимую историю, связанную с ней. Это может быть день знакомства или просто какой-то день вместе
          </Label>
          <Textarea
            id="story"
            placeholder="Напишите вашу историю..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Save Button */}
        {!saved && (
          <Button
            onClick={handleSave}
            className="w-full mb-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
          >
            Отправить
          </Button>
        )}

        {saved && (
          <p className="text-green-600 font-semibold mb-4">Результат отправлен! 🎉</p>
        )}

        {/* Share Button */}
        <div className="relative mb-4">
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Поделиться
          </Button>

          {shareOpen && (
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border rounded-xl shadow-lg p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <Button
                onClick={handleCopyLink}
                variant="ghost"
                className="w-full justify-start"
              >
                {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Скопировано!" : "Копировать ссылку"}
              </Button>
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Restart Button */}
        <Button
          onClick={() => window.location.href = "/"}
          variant="outline"
          className="w-full"
        >
          Пройти заново
        </Button>
      </div>
    </div>
  );
}
