"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventIdParam = exports.listEventsOuery = void 0;
const zod_1 = require("zod");
const uuidLike = zod_1.z
    .string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Очікується ідентифікатор у форматі UUID");
exports.listEventsOuery = zod_1.z.object({
    city: zod_1.z.string().trim().min(1).optional(),
    from: zod_1.z.string().date().optional(),
    cursor: zod_1.z.string().min(1).optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(50).default(20),
});
exports.eventIdParam = zod_1.z.object({
    eventId: uuidLike,
});
//# sourceMappingURL=schemas.js.map