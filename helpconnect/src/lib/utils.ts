import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "text-red-600 bg-red-50 border-red-200";
    case "HIGH":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "MEDIUM":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "LOW":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getSeverityMapColor(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "#C62828";
    case "HIGH":
      return "#FF8F00";
    case "MEDIUM":
      return "#1565C0";
    case "LOW":
      return "#4CAF50";
    default:
      return "#555555";
  }
}

export function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function parseJsonSafe<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
