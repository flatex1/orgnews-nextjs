import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Получить всех пользователей
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({
      _id: u._id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
    }));
  },
});

// Изменить роль пользователя
export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("participant"),
      v.literal("editor"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, { userId, role }) => {
    await ctx.db.patch(userId, { role });
    return null;
  },
});

// Удалить пользователя
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.db.delete(userId);
    return null;
  },
});
