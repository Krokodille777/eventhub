import { z } from "zod";
export declare const listEventsOuery: z.ZodObject<{
    city: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    cursor?: string;
    city?: string;
    from?: string;
    limit?: number;
}, {
    cursor?: string;
    city?: string;
    from?: string;
    limit?: number;
}>;
export type ListEventsQuery = z.infer<typeof listEventsOuery>;
export declare const eventIdParam: z.ZodObject<{
    eventId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    eventId?: string;
}, {
    eventId?: string;
}>;
export type EventIdParam = z.infer<typeof eventIdParam>;
