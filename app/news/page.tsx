import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { cookies } from "next/headers";
import { NewsList } from "@/components/news/NewsList";

export default async function NewsPage() {
  const news = await fetchQuery(api.news.list, {});
  // Получаем роль пользователя из сессии
  const session = (await cookies()).get("session")?.value;
  let role: string | null = null;
  if (session) {
    try {
      const { userId } = JSON.parse(session);
      const user = await fetchQuery(api.auth.getUserPublicById, { userId });
      role = user?.role || null;
    } catch {}
  }
  return <NewsList news={news} userRole={role} />;
}
