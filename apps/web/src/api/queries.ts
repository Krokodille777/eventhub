import { api } from "./client";
import type { components } from "@eventhub/contracts";

export type EventPage = components["schemas"]["EventPage"];
export type CatalogFilters = {city?: string | undefined, from?: string | undefined};
export const PAGE_SIZE = 6;
export async function fetchEvents(
    filters: CatalogFilters,
    cursor?: string | undefined,
): Promise<EventPage> {
    const { data, error } = await api.GET("/events", {
        params: {
            query: {
            ...(filters.city ? {city: filters.city}: {}),
            ...(filters.from ? {from: filters.from}: {}),
            ...(cursor ? { cursor} : {}),
            limit: PAGE_SIZE,
        },
    },
});
  if (error) throw new Error("Failed to fetch events");
  return data;
}

export async function fetchEvent(eventId: string)
{
    const { data, error } = await api.GET("/events/{eventId}", {
        params: {path: {eventId} },
    });
    if (error) throw error;
    return data;
}
