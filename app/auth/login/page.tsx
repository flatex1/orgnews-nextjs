"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { setSessionCookie } from "./actions";

const schema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

export default function LoginPage() {
  const login = useAction(api.auth.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const res = await login(form);
    setLoading(false);
    if (typeof res === "string") setError(res);
    else {
      // Устанавливаем cookie сессии через server action
      await setSessionCookie(res.userId, res.role);
      // Сохраняем userId в localStorage для NewsList
      if (typeof window !== "undefined") {
        localStorage.setItem("session", JSON.stringify({ userId: res.userId }));
      }
      window.location.href = "/";
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Вход</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-2 block">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-2 block">
            Пароль
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Вход..." : "Войти"}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Нет аккаунта?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
}
