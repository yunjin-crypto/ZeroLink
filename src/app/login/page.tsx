import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded border p-8">
        <h1 className="mb-6 text-2xl font-bold">
          ZeroLink 登录
        </h1>

        <LoginForm />
      </div>
    </main>
  );
}