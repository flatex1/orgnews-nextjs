import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    fullName: v.string(), // ФИО
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(
      v.literal("participant"), // только чтение
      v.literal("editor"), // может добавлять/редактировать свои новости
      v.literal("admin") // полный доступ
    ),
  }).index("by_email", ["email"]),

  news: defineTable({
    title: v.string(),
    summary: v.string(),
    content: v.string(),
    publishedAt: v.number(), // timestamp
    authorId: v.id("users"),
    mainImage: v.string(), // url или storageId
    images: v.array(v.string()), // массив url/storageId для изображений в тексте
  })
    .index("by_author", ["authorId"])
    .index("by_publishedAt", ["publishedAt"]),

  feedback: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    isAnswered: v.boolean(),
  }).index("by_isAnswered", ["isAnswered"]),
});
