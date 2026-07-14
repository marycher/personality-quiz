import HomeStart from "@/components/home-start";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 px-4">
      <div className="w-full max-w-md mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Насколько хорошо ты знаешь Алину?
        </h1>
        <p className="text-lg text-white/80 mb-8">
          Ответь на вопросы, оставь пожелание и порадуй ее историей!
        </p>
        <HomeStart />
      </div>
    </main>
  );
}
