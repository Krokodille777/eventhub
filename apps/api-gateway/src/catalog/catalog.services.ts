import { Injectable } from "@nestjs/common";
import type { Event, EventList, ListEventsQuery } from "@eventhub/contracts";
import{ EventRepository } from "./event.repository";
import { EventNotFound } from "../common/problem/domain-errors";

@Injectable()
export class CatalogService {
  constructor(private readonly repo: EventRepository) {}

  // ВРЕМЕННО: фиксированный limit, без курсора — переделаем на шаге 4
  async list(query: ListEventsQuery): Promise<EventList> {
    const limit = 20;
    const rows = await this.repo.find({ city: query.city, from: query.from, limit });
    return { items: rows.slice(0, limit), nextCursor: null };
  }

  async getOne(eventId: string): Promise<Event> {
    const event = await this.repo.byId(eventId);
    if (!event) throw new EventNotFound(eventId);
    return event;
  }
}
