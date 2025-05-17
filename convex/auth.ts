import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";

// internalQuery: Проверка существования пользователя по email
export const checkUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    return !!user;
  },
});

// internalQuery: Получить пользователя по email
export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  },
});

// internalQuery: Получить пользователя по userId
export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

// internalMutation: Вставка пользователя
export const insertUser = internalMutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, { fullName, email, passwordHash }) => {
    await ctx.db.insert("users", {
      fullName,
      email,
      passwordHash,
      role: "participant",
    });
  },
});

// internalMutation: Обновление пароля пользователя
export const updateUserPassword = internalMutation({
  args: {
    userId: v.id("users"),
    passwordHash: v.string(),
  },
  handler: async (ctx, { userId, passwordHash }) => {
    await ctx.db.patch(userId, { passwordHash });
  },
});

// Action: Регистрация пользователя
export const register = action({
  args: {
    fullName: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { fullName, email, password }) => {
    const exists = await ctx.runQuery(internal.auth.checkUserByEmail, {
      email,
    });
    if (exists) return "Пользователь с таким email уже существует";
    const passwordHash = await bcrypt.hash(password, 10);
    await ctx.runMutation(internal.auth.insertUser, {
      fullName,
      email,
      passwordHash,
    });
    return null;
  },
});

// Action: Логин пользователя
export const login = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (
    ctx,
    { email, password }
  ): Promise<string | { userId: Id<"users">; role: Doc<"users">["role"] }> => {
    const user = (await ctx.runQuery(internal.auth.getUserByEmail, {
      email,
    })) as Doc<"users"> | null;
    if (!user) return "Неверный email или пароль";
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return "Неверный email или пароль";
    return { userId: user._id, role: user.role };
  },
});

// Action: Смена пароля
export const changePassword = action({
  args: {
    userId: v.id("users"),
    oldPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (
    ctx,
    { userId, oldPassword, newPassword }
  ): Promise<string | null> => {
    const user = (await ctx.runQuery(internal.auth.getUserById, {
      userId,
    })) as Doc<"users"> | null;
    if (!user) return "Пользователь не найден";
    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) return "Старый пароль неверен";
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await ctx.runMutation(internal.auth.updateUserPassword, {
      userId,
      passwordHash,
    });
    return null;
  },
});

// Публичный query для SSR: получить публичные данные пользователя по userId
export const getUserPublicById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return { fullName: user.fullName, role: user.role };
  },
});
