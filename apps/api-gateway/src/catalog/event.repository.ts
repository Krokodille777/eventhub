import { Injectable } from '@nestjs/common';
import type { Event } from '@eventhub/contracts';
import {EVENTS} from "./seed";

export interface FindParams {
    city?: string;
    from?: string;
    after?: {startsAt: string; id: string};
    limit: number;
}
function byStartThenId(a: Event, b: Event): number{
    if (a.startsAt !== b.startsAt) return a.startsAt < b.startsAt ? -1 : 1;
    if (a.id !== b.id) return a.id < b.id ? -1 : 1;
    return 0;
}

@Injectable()
export class EventRepository{
    private readonly events: Event[] = [...EVENTS].sort(byStartThenId);

    async find (params: FindParams): Promise<Event[]>{

        let rows = this.events;
         if (params.city) {
            const needle = params.city.toLocaleLowerCase("uk");
            rows = rows.filter((e) => e.venue.city.toLocaleLowerCase("uk") === needle);
        }
        if (params.from) {
            rows = rows.filter((e) => e.startsAt >= `${params.from}T00:00:00Z`);
        }
        if (params.after) {
            const { startsAt, id } = params.after;
            rows = rows.filter(
            (e) => e.startsAt > startsAt || (e.startsAt === startsAt && e.id > id),
            );
        }
        return rows.slice(0, params.limit);
    }
    async byId(id:string): Promise<Event | undefined>{
        return this.events.find((e) => e.id === id);
  }
}
