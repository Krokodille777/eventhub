import { Catch, Logger } from "@nestjs/common";
import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import type { Request, Response } from "express";
import { toProblem } from "./problem";

@Catch()
export class ProblemFilter implements ExceptionFilter{
    private readonly logger = new Logger (ProblemFilter.name);

    catch(err: unknown, host: ArgumentsHost): void{
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const problem = toProblem(err);

        if (problem.status >= 500){
            this.logger.error(err, `unhandled error at ${req.url}`);
        } else {
            this.logger.debug(`request rejected: ${problem.title} ${req.url}`);
        }


        ctx
        .getResponse<Response>()
        .status(problem.status)
        .type("application/problem+json")
        .json({...problem, instance: req.originalUrl });
    }
}
