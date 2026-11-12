import type { Money } from "@eventhub/contracts";

// amount у копійках – ділимо на 100 лише для показу.
// У розрахунках копійки НІКОЛИ не перетворюються на дробові гривні.
export function formatPrice(money: Money): string {
  return `${(money.amount / 100).toFixed(2)} грн`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("uk-UA");
}
