"use client";

import { useState, useEffect } from "react";
import { NewsForm } from "./NewsForm";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import Image from "next/image";
import type { Id } from "@/convex/_generated/dataModel";

interface NewsListProps {
  news: Array<{
    _id: Id<"news">;
    title: string;
    summary: string;
    content: string;
    mainImage: string;
    images: string[];
    authorName?: string;
    publishedAt: number;
  }>;
  userRole: string | null;
}

export function NewsList({ news, userRole }: NewsListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editNews, setEditNews] = useState<
    null | NewsListProps["news"][number]
  >(null);
  const [deleteId, setDeleteId] = useState<Id<"news"> | null>(null);
  const createNews = useMutation(api.news.createNews);
  const updateNews = useMutation(api.news.updateNews);
  const deleteNews = useMutation(api.news.deleteNews);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Пробуем получить userId из localStorage (например, после логина)
    const session =
      typeof window !== "undefined" ? localStorage.getItem("session") : null;
    if (session) {
      try {
        const { userId } = JSON.parse(session);
        setUserId(userId as Id<"users">);
      } catch {}
    }
    // Альтернатива: можно получить userId из куки через document.cookie, если localStorage не используется
  }, []);

  type NewsFormValues = {
    title: string;
    summary: string;
    content: string;
    mainImage: string;
    images?: string[];
  };

  const handleCreate = async (values: NewsFormValues) => {
    setLoading(true);
    setError(null);
    if (!userId) {
      setError(
        "Ошибка: не удалось определить пользователя. Пожалуйста, войдите в систему."
      );
      setLoading(false);
      return;
    }
    await createNews({
      ...values,
      images: values.images || [],
      publishedAt: Date.now(),
      authorId: userId,
    });
    setShowForm(false);
    setLoading(false);
    // TODO: обновить список новостей
  };

  const handleEdit = async (values: NewsFormValues) => {
    setLoading(true);
    if (!editNews) return;
    await updateNews({
      id: editNews._id,
      ...values,
      images: values.images || [],
    });
    setEditNews(null);
    setLoading(false);
    // TODO: обновить список новостей
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await deleteNews({ id: deleteId });
    setDeleteId(null);
    setLoading(false);
    // TODO: обновить список новостей
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Новости</h2>
        {userRole === "editor" || userRole === "admin" ? (
          <Button
            onClick={() => {
              setShowForm(true);
              setEditNews(null);
            }}
          >
            Создать новость
          </Button>
        ) : null}
      </div>
      {showForm && (
        <div className="mb-8">
          {error && (
            <div className="text-destructive text-sm mb-2">{error}</div>
          )}
          <NewsForm
            onSubmit={handleCreate}
            loading={loading}
            submitText="Создать"
          />
        </div>
      )}
      {news.map((item) => (
        <div key={item._id} className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 items-start">
            <Image
              src={item.mainImage}
              alt={item.title}
              width={160}
              height={90}
              className="rounded object-cover max-h-24"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
              <div className="text-muted-foreground text-xs mb-2">
                {item.authorName}
              </div>
              <div className="text-sm mb-2 line-clamp-3">{item.summary}</div>
              <div className="flex gap-2 mt-2">
                <Button asChild size="sm" variant="outline">
                  <a href={`/news/${item._id}`}>Читать</a>
                </Button>
                {(userRole === "editor" || userRole === "admin") && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditNews(item);
                        setShowForm(false);
                      }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(item._id)}
                    >
                      Удалить
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          {editNews && editNews._id === item._id && (
            <div className="mt-4">
              <NewsForm
                initialValues={editNews}
                onSubmit={handleEdit}
                loading={loading}
                submitText="Сохранить"
              />
            </div>
          )}
        </div>
      ))}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
