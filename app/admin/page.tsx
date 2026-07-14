import AdminQuestions from "@/components/admin-questions";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Управление вопросами</h1>
        <AdminQuestions />
      </div>
    </main>
  );
}
