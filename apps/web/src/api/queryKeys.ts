import type { CatalogFilters } from "./queries";

export const eventKeys = {
    all: ["events"] as const,
    list: (filters: CatalogFilters) => ["events", "list", filters] as const,
    details: (eventId: string) => ["events", "details", eventId] as const,
}
