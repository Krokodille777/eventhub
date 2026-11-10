import { PrismaClient, SeatStatus } from "@prisma/client";

const prisma = new PrismaClient();

const vid = (n: number) => `10000000-0000-7000-8000-${String(n). padStart(12, "0")}`;
const eid = (n: number) => `20000000-0000-7000-8000-${String(n). padStart(12, "0")}`;

const VENUES = [
  { id: vid(1), name: "Палац мистецтв", city: "Львів" },
  { id: vid(2), name: "Caribbean Club", city: "Київ" },
  { id: vid(3), name: "Atlas", city: "Київ" },
  { id: vid(4), name: "Оперний театр", city: "Одеса" },
  { id: vid(5), name: "Парк Горького", city: "Харків" },
  { id: vid(6), name: "Площа Ринок", city: "Львів" },
];

type Layout = { rows: number; perRow: number } | null;

const EVENTS: Array<{
  id: string; title: string; startsAt: string; venueId: string;
  minPriceCents: number; availableSeats: number; layout: Layout;
}> = [
  { id: eid(1), title: "Джазовий вечір",
    startsAt: "2026-10-12T19:00:00Z", venueId: vid(1),
    minPriceCents: 15000, availableSeats: 50, layout: { rows: 5, perRow: 12 } },   // 60 місць, 50 вільних
  { id: eid(2), title: "Стендап-шоу",
    startsAt: "2026-10-15T18:30:00Z", venueId: vid(2),
    minPriceCents: 20000, availableSeats: 100, layout: { rows: 10, perRow: 12 } },
  // дві події з однаковим startsAt — для перевірки курсора
  { id: eid(3), title: "Рок-концерт",
    startsAt: "2026-10-19T20:00:00Z", venueId: vid(3),
    minPriceCents: 30000, availableSeats: 200, layout: { rows: 20, perRow: 12 } },
  { id: eid(4), title: "Камерний оркестр",
    startsAt: "2026-10-19T20:00:00Z", venueId: vid(4),
    minPriceCents: 25000, availableSeats: 150, layout: { rows: 15, perRow: 12 } },
  // без нумерованих місць — availableSeats = місткість
  { id: eid(5), title: "Кінопоказ просто неба",
    startsAt: "2026-10-24T17:00:00Z", venueId: vid(5),
    minPriceCents: 10000, availableSeats: 300, layout: null },
  { id: eid(6), title: "Фестиваль кави",
    startsAt: "2026-11-02T10:00:00Z", venueId: vid(6),
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
