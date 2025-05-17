import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const news = await ctx.db
      .query("news")
      .withIndex("by_publishedAt")
      .order("desc")
      .collect();
    // Получаем id всех авторов
    const authorIds = Array.from(new Set(news.map((n) => n.authorId)));
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const idToName = Object.fromEntries(
      authors.map((a) => [a?._id, a?.fullName || "Неизвестно"])
    );
    return news.map((n) => ({
      ...n,
      authorName: idToName[n.authorId] || "Неизвестно",
    }));
  },
});

export const getById = query({
  args: { id: v.id("news") },
  handler: async (ctx, { id }) => {
    const news = await ctx.db.get(id);
    if (!news) return null;
    return news;
  },
});

export const createNews = mutation({
  args: {
    title: v.string(),
    summary: v.string(),
    content: v.string(),
    publishedAt: v.number(),
    authorId: v.id("users"),
    mainImage: v.string(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("news", args);
    return id;
  },
});

export const updateNews = mutation({
  args: {
    id: v.id("news"),
    title: v.string(),
    summary: v.string(),
    content: v.string(),
    mainImage: v.string(),
    images: v.array(v.string()),
  },
  handler: async (ctx, { id, ...rest }) => {
    await ctx.db.patch(id, rest);
    return id;
  },
});

export const deleteNews = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return null;
  },
});

export const uploadImage = action({
  args: { file: v.string(), contentType: v.string() },
  handler: async (ctx, { file, contentType }) => {
    // Преобразуем JSON-строку массива байт в Uint8Array
    const buffer = new Uint8Array(JSON.parse(file));
    const blob = new Blob([buffer], { type: contentType });
    const storageId = await ctx.storage.store(blob);
    const url = await ctx.storage.getUrl(storageId);
    return url;
  },
});
