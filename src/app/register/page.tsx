import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded border p-8">
        <h1 className="mb-6 text-2xl font-bold">
          ZeroLink 注册
        </h1>

        <RegisterForm />
      </div>
    </main>
  );
}