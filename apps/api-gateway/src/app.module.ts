import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { CatalogModule } from "./catalog/catalog.module";
import { APP_FILTER } from "@nestjs/core";
import { ProblemFilter } from "./common/problem/problem.filter";
import { randomUUID } from "node:crypto";
import { LoggerModule } from "nestjs-pino";

const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";
const NODE_ENV = process.env.NODE_ENV ?? "development";

@Module({
  imports: [
    LoggerModule.forRoot({
    pinoHttp: {
      level: LOG_LEVEL,
      genReqId: (req, res) => {
        const incoming = req.headers["x-request-id"];
        const id = typeof incoming === "string" && incoming ? incoming : randomUUID();
        res.setHeader("x-request-id", id);
        return id;
      },
      redact: [
        "req.headers.authorization",
        "req.headers.cookie",
        "res.headers['set-cookie']",
      ],
      transport:
        NODE_ENV === "development"
          ? { target: "pino-pretty", options: {singleLine: true}}
          : undefined,
    },
  }),
    HealthModule, CatalogModule],
  providers: [
    {provide: APP_FILTER, useClass: ProblemFilter}
  ],
})
export class AppModule {}
