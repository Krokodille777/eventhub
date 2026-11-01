import type { z } from "zod";

export interface ZodDtoClass<S extends z.ZodTypeAny = z.ZodTypeAny> {
  new (): z.infer<S>;
  zodschema: S;
}

export function createZodDto<S extends z.ZodTypeAny>(schema: S): ZodDtoClass<S> {
  class Dto {
    static zodschema = schema;
  }
  return Dto as unknown as ZodDtoClass<S>;
}
