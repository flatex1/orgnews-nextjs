import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatRelative } from "date-fns/formatRelative";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";
import { use } from "react";

export default function NewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = use(params);

  const news = use(
    fetchQuery(api.news.getById, {
      id: awaitedParams.id as Id<"news">,
    })
  );
  if (!news) return notFound();

  const author = use(
    fetchQuery(api.auth.getUserPublicById, {
      userId: news.authorId,
    })
  );

  return (
    <article className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
      <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
        <span>
          {formatRelative(new Date(news.publishedAt), new Date(), {
            locale: ru,
          })}
        </span>
        <span>•</span>
        <span>Автор: {author ? author.fullName : "Неизвестно"}</span>
      </div>
      <div className="mb-6">
        <Image
          src={news.mainImage}
          alt={news.title}
          width={800}
          height={400}
          className="rounded-lg w-full object-cover max-h-96"
          priority
        />
      </div>
      <div
        className={cn("prose prose-lg max-w-none")}
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
    </article>
  );
}
