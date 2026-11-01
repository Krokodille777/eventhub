import type { paths, components } from "./generated/schema";
export type { paths, components };
export type Event = components["schemas"]["Event"];
export type EventList = components["schemas"]["EventPage"];
export type VenueSummary = components["schemas"]["VenueSummary"];
export type Money = components["schemas"]["Money"];
export type Problem = components["schemas"]["Problem"];
export * from "./schemas";
