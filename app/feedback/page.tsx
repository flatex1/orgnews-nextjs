"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const schema = z.object({
  name: z.string().min(2, "Введите имя"),
  email: z.string().email("Введите корректный email"),
  message: z.string().min(10, "Сообщение слишком короткое"),
});

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const sendFeedback = useMutation(api.feedback.createFeedback);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      await sendFeedback({ ...form });
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("Ошибка при отправке. Попробуйте позже.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F6F5EE] py-20 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Обратная связь
        </h1>
        <p className="text-black/70 mb-8 text-center">
          Мы всегда открыты для ваших вопросов, предложений и обратной связи.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="name"
            placeholder="Ваше имя"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            required
            className="bg-[#F6F5EE]"
          />
          <Input
            name="email"
            type="email"
            placeholder="Email для ответа"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            required
            className="bg-[#F6F5EE]"
          />
          <Textarea
            name="message"
            placeholder="Ваше сообщение"
            value={form.message}
            onChange={handleChange}
            rows={5}
            disabled={loading}
            required
            className="bg-[#F6F5EE]"
          />
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-700 text-sm text-center">
              Спасибо! Ваше сообщение отправлено.
            </div>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-black text-white rounded-xl font-semibold"
            disabled={loading}
          >
            {loading ? "Отправка..." : "Отправить"}
          </Button>
        </form>
      </div>
    </main>
  );
}
