import { HttpException } from "@nestjs/common";
import {EventNotFound, InvalidCursor, RequestValidationFailed, type ValidationIssue} from "./domain-errors";

export interface ProblemBody{
    type: string;
    title: string;
    status: number;
    detail?: string;
    errors?: ValidationIssue[];
}

export function toProblem (err: unknown): ProblemBody{
    if (err instanceof RequestValidationFailed){
        return {
            type: "/errors/invalid-query",
            title: "Invalid query parameters",
            status: 400,
            detail: err.issues.map((i) => `${i.field}: ${i.message}`).join("; "),
            errors: err.issues,
        };
    }
        if (err instanceof InvalidCursor){
            return {
                type: "/errors/invalid-cursor",
                title: "Invalid pagination cursor",
                status: 400,
                detail: err.message,
            };
        }
        if (err instanceof EventNotFound){
            return {
                type: "/errors/event-not-found",
                title: "Event not found",
                status: 404,
                detail: err.message,
            };
        }
        if (err instanceof HttpException){
            const status = err.getStatus();
            return {
                type: status === 404 ? "/errors/not-found" : "about:blank",
                title: status === 404 ? "Not found" : err.message,
                status,
                detail: err.message,
            };
        }

        return {
            type: "about:blank",
            title: "Internal server error",
            status: 500,
        };
    }
