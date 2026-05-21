"use client";

import { useEffect } from "react";

import { api } from "@/lib/axios";

import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
  const {
    user,
    setUser,
    isLoading,
    setLoading,
  } = useAuthStore();

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get("/auth/me");

        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, [setLoading, setUser]);

  return {
    user,
    isLoading,
  };
}