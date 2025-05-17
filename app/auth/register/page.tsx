"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  fullName: z.string().min(2, "Введите ФИО"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

export default function RegisterPage() {
  const register = useAction(api.auth.register);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res) setError(res as string);
    else setSuccess(true);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">ФИО</Label>
          <Input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>
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
            autoComplete="new-password"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm">Регистрация успешна!</div>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>
    </div>
  );
}
