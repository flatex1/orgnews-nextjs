"use server";

import { cookies } from "next/headers";

export async function setSessionCookie(userId: string, role: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify({ userId, role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  });
}
