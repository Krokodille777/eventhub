import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { CatalogModule } from "./catalog/catalog.module";
import { APP_FILTER } from "@nestjs/core";
import { ProblemFilter } from "./common/problem/problem.filter";


@Module({
  imports: [HealthModule, CatalogModule],
  providers: [
    {provide: APP_FILTER, useClass: ProblemFilter}
  ]
})
export class AppModule {}
