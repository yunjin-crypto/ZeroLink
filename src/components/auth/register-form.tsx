"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { api } from "@/lib/axios";

export default function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      router.push("/login");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "注册失败"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleRegister}
      className="space-y-4"
    >
      <input
        type="text"
        placeholder="用户名"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
        className="w-full rounded border p-3"
      />

      <input
        type="email"
        placeholder="邮箱"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="w-full rounded border p-3"
      />

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
          ? "注册中..."
          : "注册"}
      </button>
    </form>
  );
}