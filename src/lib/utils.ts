import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const VAT_RATE_FOOD = 0.12;

export function priceExclVat(priceInclVat: number): number {
  return priceInclVat / (1 + VAT_RATE_FOOD);
}

export function formatPriceExclVat(priceInclVat: number): string {
  return formatPrice(priceExclVat(priceInclVat));
}
