"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export default function HomePage() {
  // Получаем последние 3 новости
  const news = (useQuery(api.news.list) ?? []).slice(0, 3);

  return (
    <main className="min-h-screen flex flex-col bg-[#F6F5EE]">
      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-24 px-4 max-w-7xl mx-auto">
        <div className="flex-1">
          <div className="mb-6">
            <Image
              src="/logo.svg"
              alt="Логотип компании"
              width={120}
              height={120}
              className="mb-2"
            />
            <div className="text-2xl md:text-4xl font-extrabold leading-tight text-black">
              Цифровые решения и IT-новости
            </div>
          </div>
          <p className="text-xl md:text-2xl text-black/80 mb-8 max-w-2xl">
            Мы создаём продукты, делимся опытом и рассказываем о главных
            событиях в мире технологий.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button
              asChild
              size="lg"
              className="text-base px-8 py-5 bg-black hover:bg-black/80 text-white rounded-xl font-semibold shadow-lg"
            >
              <Link href="#news">К новостям</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 py-5 border-black text-black rounded-xl font-semibold"
            >
              <Link href="/feedback">Обратная связь</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Image
            src="/hero.svg"
            alt="TechNova иллюстрация"
            width={320}
            height={370}
            className="max-w-xs md:max-w-md w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* О компании и преимущества */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
              О компании
            </h2>
            <p className="text-lg text-black/80 mb-2">
              Наша команда профессионалов в области IT и цифровых технологий
              создаёт решения для бизнеса, автоматизирует процессы и помогает
              компаниям расти в цифровую эпоху.
            </p>
            <p className="text-base text-black/60">
              Наша миссия — делать технологии доступными, полезными и
              безопасными для каждого клиента.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white shadow p-6 flex flex-col items-center text-center">
              <span className="mb-3 text-3xl">💡</span>
              <span className="font-semibold mb-1 text-black">Экспертиза</span>
              <span className="text-black/60 text-sm">
                10+ лет опыта в IT и цифровых продуктах
              </span>
            </div>
            <div className="rounded-2xl bg-white shadow p-6 flex flex-col items-center text-center">
              <span className="mb-3 text-3xl">🚀</span>
              <span className="font-semibold mb-1 text-black">Инновации</span>
              <span className="text-black/60 text-sm">
                Внедряем современные технологии и лучшие практики
              </span>
            </div>
            <div className="rounded-2xl bg-white shadow p-6 flex flex-col items-center text-center">
              <span className="mb-3 text-3xl">🤝</span>
              <span className="font-semibold mb-1 text-black">Поддержка</span>
              <span className="text-black/60 text-sm">
                Оперативная помощь и консультации для клиентов
              </span>
            </div>
            <div className="rounded-2xl bg-white shadow p-6 flex flex-col items-center text-center">
              <span className="mb-3 text-3xl">👥</span>
              <span className="font-semibold mb-1 text-black">Команда</span>
              <span className="text-black/60 text-sm">
                Профессионалы, увлечённые своим делом
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Новости */}
      <section id="news" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-black text-center underline decoration-2 decoration-black underline-offset-8">
          Новости компании
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {news.length === 0 && (
            <div className="col-span-3 text-center text-black/50">
              Пока нет новостей
            </div>
          )}
          {news.map((n) => (
            <div
              key={n._id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col border border-black/10"
            >
              <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
                {n.mainImage ? (
                  <Image
                    src={n.mainImage}
                    alt={n.title}
                    className="object-cover w-full h-32"
                    width={320}
                    height={128}
                    loading="lazy"
                  />
                ) : (
                  <span className="text-4xl text-slate-300">📰</span>
                )}
              </div>
              <h3 className="font-bold text-lg mb-1 line-clamp-2 text-black">
                {n.title}
              </h3>
              <div className="text-xs text-black/50 mb-2">
                {n.authorName} • {new Date(n.publishedAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-black/70 mb-4 line-clamp-3">
                {n.summary}
              </div>
              <Button
                asChild
                size="sm"
                className="mt-auto w-full bg-black text-white rounded-xl font-semibold"
              >
                <Link href={`/news/${n._id}`}>Читать</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 px-4 bg-[#F6F5EE]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
            Оставайтесь на связи
          </h2>
          <p className="text-black/70 mb-8 text-lg">
            Подпишитесь на наши новости или свяжитесь с нами для консультации.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-base px-8 py-5 bg-black hover:bg-black/80 text-white rounded-xl font-semibold"
            >
              <Link href="/news">Все новости</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 py-5 border-black text-black rounded-xl font-semibold"
            >
              <Link href="/feedback">Обратная связь</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
