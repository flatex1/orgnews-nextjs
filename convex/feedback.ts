import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Получить все сообщения обратной связи
export const getAllFeedback = query({
  args: {},
  handler: async (ctx) => {
    const feedback = await ctx.db.query("feedback").order("desc").collect();
    return feedback.map((f) => ({
      _id: f._id,
      name: f.name,
      email: f.email,
      message: f.message,
      isAnswered: f.isAnswered,
    }));
  },
});

// Пометить сообщение как обработанное
export const markFeedbackAnswered = mutation({
  args: { id: v.id("feedback") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isAnswered: true });
    return null;
  },
});

// Создать сообщение обратной связи
export const createFeedback = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, { name, email, message }) => {
    await ctx.db.insert("feedback", {
      name,
      email,
      message,
      isAnswered: false,
    });
    return null;
  },
});
