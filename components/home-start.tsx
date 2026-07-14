"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomeStart() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleStart = () => {
    const params = name ? `?name=${encodeURIComponent(name)}` : "";
    router.push(`/quiz${params}`);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <Input
        type="text"
        placeholder="Введите ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-center text-lg py-6 bg-white/20 border-white/30 text-white placeholder:text-white/50"
      />
      <Button
        onClick={handleStart}
        size="lg"
        className="text-lg px-12 py-6 bg-white text-purple-700 hover:bg-white/90 font-bold shadow-lg"
      >
        Начать!
      </Button>
    </div>
  );
}
