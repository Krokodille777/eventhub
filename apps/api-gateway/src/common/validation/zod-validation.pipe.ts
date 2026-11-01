import { Injectable } from "@nestjs/common";
import type { ArgumentMetadata, PipeTransform } from "@nestjs/common"
import type { ZodDtoClass } from "./zod-dto";
import { RequestValidationFailed } from "../problem/domain-errors";

function hasZodSchema(metatype: unknown): metatype is ZodDtoClass {
  if (typeof metatype !== "function") return false;
  const schema = (metatype as { zodschema?: { safeParse?: unknown } }).zodschema;
  return typeof schema?.safeParse === "function";
}

@Injectable()

export class ZodValidationPipe implements PipeTransform{
    transform(value: unknown, metadata: ArgumentMetadata): unknown {
        const dto = metadata.metatype;
        if (!hasZodSchema(dto)) return value;

        const result = dto.zodschema.safeParse(value);
        if (result.success) return result.data;

        throw new RequestValidationFailed(
            result.error.issues.map((i) => ({
                field: i.path.join(".") || "(root)",
                code: i.code,
                message: i.message,
            })),
        );
    }
}
