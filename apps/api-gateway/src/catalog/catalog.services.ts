import { Injectable } from "@nestjs/common";
import type { Event, EventList, ListEventsQuery } from "@eventhub/contracts";
import{ EventRepository } from "./event.repository";
import { EventNotFound } from "../common/problem/domain-errors";
import { decodeCursor, encodeCursor } from "./cursor";

@Injectable()
export class CatalogService {
  constructor(private readonly repo: EventRepository) {}

  // ВРЕМЕННО: фиксированный limit, без курсора — переделаем на шаге 4
  async list(query: ListEventsQuery): Promise<EventList> {
    const after = query.cursor ? decodeCursor(query.cursor) : undefined;

    const rows = await this.repo.find({ city: query.city, from: query.from, after, limit: query.limit });

    const hasMore = rows.length > query.limit;
    const items = hasMore ? rows.slice(0, query.limit): rows;
    const last = items.at(-1);

    return { items, nextCursor: hasMore && last ? encodeCursor(last) : null,};
  }

  async getOne(eventId: string): Promise<Event> {
    const event = await this.repo.byId(eventId);
    if (!event) throw new EventNotFound(eventId);
    return event;
  };
}
