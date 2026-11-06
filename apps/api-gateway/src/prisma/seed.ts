import { PrismaClient, SeatStatus } from "@prisma/client";

const prisma = new PrismaClient();

const VENUES = [
  { id: "018f2c1e-0000-7000-8000-000000000001", name: "Палац мистецтв", city: "Львів" },
  { id: "018f2c1e-0000-7000-8000-000000000002", name: "Caribbean Club", city: "Київ" },
  { id: "018f2c1e-0000-7000-8000-000000000003", name: "Atlas", city: "Київ" },
  { id: "018f2c1e-0000-7000-8000-000000000004", name: "Оперний театр", city: "Одеса" },
  { id: "018f2c1e-0000-7000-8000-000000000005", name: "Парк Горького", city: "Харків" },
  { id: "018f2c1e-0000-7000-8000-000000000006", name: "Площа Ринок", city: "Львів" },
];

type Layout = { rows: number; perRow: number } | null;

const EVENTS: Array<{
  id: string; title: string; startsAt: string; venueId: string;
  minPriceCents: number; availableSeats: number; layout: Layout;
}> = [
  { id: "018f2c1e-4a7b-7c3d-9e1f-000000000001", title: "Джазовий вечір",
    startsAt: "2026-10-12T19:00:00Z", venueId: "018f2c1e-0000-7000-8000-000000000001",
    minPriceCents: 15000, availableSeats: 50, layout: { rows: 5, perRow: 12 } },   // 60 місць, 50 вільних
  { id: "018f2c1e-4a7b-7c3d-9e1f-000000000002", title: "Стендап-шоу",
    startsAt: "2026-10-15T18:30:00Z", venueId: "018f2c1e-0000-7000-8000-000000000002",
    minPriceCents: 20000, availableSeats: 100, layout: { rows: 10, perRow: 12 } },
  // дві події з однаковим startsAt — для перевірки курсора
  { id: "018f2c1e-4a7b-7c3d-9e1f-000000000003", title: "Рок-концерт",
    startsAt: "2026-10-19T20:00:00Z", venueId: "018f2c1e-0000-7000-8000-000000000003",
    minPriceCents: 30000, availableSeats: 200, layout: { rows: 20, perRow: 12 } },
  { id: "018f2c1e-4a7b-7c3d-9e1f-000000000004", title: "Камерний оркестр",
    startsAt: "2026-10-19T20:00:00Z", venueId: "018f2c1e-0000-7000-8000-000000000004",
    minPriceCents: 25000, availableSeats: 150, layout: { rows: 15, perRow: 12 } },
  // без нумерованих місць — availableSeats = місткість
  { id: "018f2c1e-4a7b-7c3d-9e1f-000000000005", title: "Кінопоказ просто неба",
    startsAt: "2026-10-24T17:00:00Z", venueId: "018f2c1e-0000-7000-8000-000000000005",
    minPriceCents: 10000, availableSeats: 300, layout: null },
  { id: "018f2c1e-4a7b-7c3d-9e1f-000000000006", title: "Фестиваль кави",
    startsAt: "2026-11-02T10:00:00Z", venueId: "018f2c1e-0000-7000-8000-000000000006",
    minPriceCents: 5000, availableSeats: 500, layout: null },
];

function buildSeats(e: (typeof EVENTS)[number]) {
  if (!e.layout) return [];
  const total = e.layout.rows * e.layout.perRow;
  const sold = total - e.availableSeats; // скільки позначити проданими
  const seats = [];
  for (let r = 0; r < e.layout.rows; r++) {
    for (let n = 1; n <= e.layout.perRow; n++) {
      const index = r * e.layout.perRow + (n - 1);
      seats.push({
        eventId: e.id,
        rowLabel: String(r + 1),
        number: n,
        priceCents: e.minPriceCents + r * 5000, // перший ряд — мінімальна ціна
        status: index < sold ? SeatStatus.SOLD : SeatStatus.FREE,
      });
    }
  }
  return seats;
}

async function main() {
  for (const v of VENUES) {
    await prisma.venue.upsert({ where: { id: v.id }, update: v, create: v });
  }

  for (const e of EVENTS) {
    const { layout, startsAt, ...rest } = e;
    const data = { ...rest, startsAt: new Date(startsAt), currency: "UAH" };
    await prisma.event.upsert({ where: { id: e.id }, update: data, create: data });

    await prisma.$transaction([
      prisma.seat.deleteMany({ where: { eventId: e.id } }),
      prisma.seat.createMany({ data: buildSeats(e) }),
    ]);
  }

  const [v, ev, s] = await Promise.all([
    prisma.venue.count(), prisma.event.count(), prisma.seat.count(),
  ]);
  console.log(`Створено ${v} майданчиків, ${ev} подій, ${s} місць`);
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
