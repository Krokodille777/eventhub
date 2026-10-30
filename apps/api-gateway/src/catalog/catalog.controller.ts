import { Controller, Get, Param, Query } from '@nestjs/common';
import type { Event, EventList, ListEventsQuery} from '@eventhub/contracts';
import { CatalogService } from './catalog.services';

@Controller("events")
export class CatalogController{
    constructor (private readonly catalog: CatalogService){}


@Get()
list( @Query() query: ListEventsQuery): Promise<EventList>{
    return this.catalog.list(query);
}

@Get(":eventId")
getOne(@Param("eventId") eventId: string): Promise<Event>{
    return this.catalog.getOne(eventId);
}
}
