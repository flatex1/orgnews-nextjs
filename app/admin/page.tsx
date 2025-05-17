"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id, Doc } from "@/convex/_generated/dataModel";

const TABS = [
  { key: "users", label: "Пользователи" },
  { key: "news", label: "Новости" },
  { key: "feedback", label: "Обратная связь" },
];

function UsersAdmin() {
  const users = useQuery(api.users.getAllUsers) ?? [];
  const setUserRole = useMutation(api.users.setUserRole);
  const deleteUser = useMutation(api.users.deleteUser);
  const [loadingId, setLoadingId] = useState<Id<"users"> | null>(null);

  const roles: Array<"participant" | "editor" | "admin"> = [
    "participant",
    "editor",
    "admin",
  ];

  const handleRoleChange = async (
    userId: Id<"users">,
    role: "participant" | "editor" | "admin"
  ) => {
    setLoadingId(userId);
    await setUserRole({ userId, role });
    setLoadingId(null);
  };
  const handleDelete = async (userId: Id<"users">) => {
    if (!confirm("Удалить пользователя?")) return;
    setLoadingId(userId);
    await deleteUser({ userId });
    setLoadingId(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Пользователи</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">ФИО</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Роль</th>
              <th className="p-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="p-2 border">{u.fullName}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.role}</td>
                <td className="p-2 border flex gap-2">
                  {roles.map((role) => (
                    <Button
                      key={role}
                      size="sm"
                      variant={u.role === role ? "default" : "outline"}
                      disabled={u.role === role || loadingId === u._id}
                      onClick={() => handleRoleChange(u._id, role)}
                    >
                      {role === "participant"
                        ? "Участник"
                        : role === "editor"
                          ? "Редактор"
                          : "Админ"}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loadingId === u._id}
                    onClick={() => handleDelete(u._id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewsAdmin() {
  const news = useQuery(api.news.list) ?? [];
  const deleteNews = useMutation(api.news.deleteNews);
  const [loadingId, setLoadingId] = useState<Id<"news"> | null>(null);

  type NewsWithAuthor = Doc<"news"> & { authorName: string };

  const handleDelete = async (id: Id<"news">) => {
    if (!confirm("Удалить новость?")) return;
    setLoadingId(id);
    await deleteNews({ id });
    setLoadingId(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Новости</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">Заголовок</th>
              <th className="p-2 border">Автор</th>
              <th className="p-2 border">Дата</th>
              <th className="p-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {(news as NewsWithAuthor[]).map((n) => (
              <tr key={n._id}>
                <td className="p-2 border">{n.title}</td>
                <td className="p-2 border">{n.authorName}</td>
                <td className="p-2 border">
                  {new Date(n.publishedAt).toLocaleDateString()}
                </td>
                <td className="p-2 border flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`/news/${n._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Открыть
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loadingId === n._id}
                    onClick={() => handleDelete(n._id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeedbackAdmin() {
  const feedback = useQuery(api.feedback.getAllFeedback) ?? [];
  const markAnswered = useMutation(api.feedback.markFeedbackAnswered);
  const [loadingId, setLoadingId] = useState<Id<"feedback"> | null>(null);

  const handleMark = async (id: Id<"feedback">) => {
    setLoadingId(id);
    await markAnswered({ id });
    setLoadingId(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Обратная связь</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">Имя</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Сообщение</th>
              <th className="p-2 border">Статус</th>
              <th className="p-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {(feedback as Doc<"feedback">[]).map((f) => (
              <tr key={f._id}>
                <td className="p-2 border">{f.name}</td>
                <td className="p-2 border">{f.email}</td>
                <td className="p-2 border max-w-xs whitespace-pre-line break-words">
                  {f.message}
                </td>
                <td className="p-2 border">
                  {f.isAnswered ? "Обработано" : "Не обработано"}
                </td>
                <td className="p-2 border">
                  {!f.isAnswered && (
                    <Button
                      size="sm"
                      disabled={loadingId === f._id}
                      onClick={() => handleMark(f._id)}
                    >
                      Отметить как обработано
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState("users");

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "default" : "outline"}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </div>
      <div>
        {tab === "users" && <UsersAdmin />}
        {tab === "news" && <NewsAdmin />}
        {tab === "feedback" && <FeedbackAdmin />}
      </div>
    </div>
  );
}
