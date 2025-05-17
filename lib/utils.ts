import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматирует ФИО в вид "Имя Ф." (например, "Иванов Иван Петрович" -> "Иван П.")
 */
export function formatName(fullName: string): string {
  const [first, ...rest] = fullName.trim().split(" ");
  if (!first) return fullName;
  const last = rest.length ? rest[rest.length - 1] : "";
  return last ? `${first} ${last[0]}.` : first;
}

/**
 * Возвращает роль пользователя на русском языке
 */
export function getRoleRu(role: string): string {
  switch (role) {
    case "participant":
      return "Участник";
    case "editor":
      return "Редактор";
    case "admin":
      return "Администратор";
    default:
      return role;
  }
}
