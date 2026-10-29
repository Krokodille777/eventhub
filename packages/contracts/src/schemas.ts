import {z} from "zod";


const uuidLike = z
.string()
.regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Очікується ідентифікатор у форматі UUID",
);

export const listEventsOuery = z.object({
    city: z.string().trim().min(1).optional(),
    from: z.string().date().optional(),
    cursor: z.string().min(1).optional(),
    limit: z.coerce.number().int().min(1). max(50).default(20),
});

export type ListEventsQuery = z.infer<typeof listEventsOuery>;

export const eventIdParam = z.object({
    eventId: uuidLike,
})

export type EventIdParam = z.infer<typeof eventIdParam>;