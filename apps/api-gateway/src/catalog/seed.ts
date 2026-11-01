import type { Event } from "@eventhub/contracts";

export const EVENTS: Event[] = [
  {
    id: "018f2c1e-4a7b-7c3d-9e1f-000000000001",
    title: "Джазовий вечір",
    startsAt: "2026-10-12T19:00:00Z",
    venue: {id: "018f2c1e-0000-7000-8000-000000000001", name: "Палац мистецтв", city: "Львів" },
    minPrice: { amount: 15000, currency: "UAH" },
    availableSeats: 50,
  },
  {
    id: "018f2c1e-4a7b-7c3d-9e1f-000000000002",
    title: "Стендап-шоу",
    startsAt: "2026-10-15T18:30:00Z",
    venue: { id: "018f2c1e-0000-7000-8000-000000000002", name: "Caribbean Club", city: "Київ" },
    minPrice: { amount: 20000, currency: "UAH" },
    availableSeats: 100,
  },
  // ДВІ події з однаковим startsAt — для перевірки курсора на кроці 4
  {
    id: "018f2c1e-4a7b-7c3d-9e1f-000000000003",
    title: "Рок-концерт",
    startsAt: "2026-10-19T20:00:00Z",
    venue: { id: "018f2c1e-0000-7000-8000-000000000003", name: "Atlas", city: "Київ" },
    minPrice: { amount: 30000, currency: "UAH" },
    availableSeats: 200,
  },
  {
    id: "018f2c1e-4a7b-7c3d-9e1f-000000000004",
    title: "Камерний оркестр",
    startsAt: "2026-10-19T20:00:00Z",
    venue: { id: "018f2c1e-0000-7000-8000-000000000004", name: "Оперний театр", city: "Одеса" },
    minPrice: { amount: 25000, currency: "UAH" },
    availableSeats: 150,
  },
  {
    id: "018f2c1e-4a7b-7c3d-9e1f-000000000005",
    title: "Кінопоказ просто неба",
    startsAt: "2026-10-24T17:00:00Z",
    venue: { id: "018f2c1e-0000-7000-8000-000000000005", name: "Парк Горького", city: "Харків" },
    minPrice: { amount: 10000, currency: "UAH" },
    availableSeats: 300,
  },
  {
    id: "018f2c1e-4a7b-7c3d-9e1f-000000000006",
    title: "Фестиваль кави",
    startsAt: "2026-11-02T10:00:00Z",
    venue: { id: "018f2c1e-0000-7000-8000-000000000006",  name: "Площа Ринок", city: "Львів" },
    minPrice: { amount: 5000, currency: "UAH" },
    availableSeats: 500,
  },
];
