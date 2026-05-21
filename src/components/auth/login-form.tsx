"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { api } from "@/lib/axios";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      await api.post("/auth/login", {
        email,
        password,
      });

      router.push("/dashboard");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "登录失败"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-4"
    >
      <div>
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full rounded border p-3"
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full rounded border p-3"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-black p-3 text-white"
      >
        {loading
          ? "登录中..."
          : "登录"}
      </button>
    </form>
  );
}