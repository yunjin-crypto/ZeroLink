import ProtectedRoute from "@/components/layout/protected-route";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="p-8">
        <h1 className="text-3xl font-bold">
          ZeroLink Dashboard
        </h1>

        <p className="mt-4">
          登录成功。
        </p>
      </main>
    </ProtectedRoute>
  );
}