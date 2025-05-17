import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  // Получаем абсолютный URL для редиректа
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const loginUrl = `${protocol}://${host}/auth/login`;
  return NextResponse.redirect(loginUrl, { status: 302 });
}
