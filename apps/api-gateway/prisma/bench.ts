import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Всі тестові події прив'язані до одного майданчика —
// так --clean видаляє тільки їх і не чіпає сиди
const BENCH_VENUE = "b0000000-0000-7000-8000-000000000001";
const TOTAL = 100_000;
const BATCH = 5_000;

async function main() {
  if (process.argv.includes("--clean")) {
    const { count } = await prisma.event.deleteMany({ where: { venueId: BENCH_VENUE } });
    await prisma.venue.deleteMany({ where: { id: BENCH_VENUE } });
    console.log(`Видалено ${count} тестових подій`);
    return;
  }

  const t0 = Date.now();
  await prisma.venue.upsert({
    where: { id: BENCH_VENUE },
    update: {},
    create: { id: BENCH_VENUE, name: "Bench Hall", city: "Benchtown" },
  });

  const base = Date.parse("2027-01-01T00:00:00Z");
  for (let done = 0; done < TOTAL; done += BATCH) {
    const data = Array.from({ length: BATCH }, (_, i) => {
      const n = done + i;
      return {
        title: `Bench #${n}`,
        startsAt: new Date(base + ((n * 7919) % 730) * 86_400_000), // розкид на 2 роки
        minPriceCents: 10_000 + (n % 50) * 1_000,
        venueId: BENCH_VENUE,
      };
    });
    await prisma.event.createMany({ data });
    console.log(`Створено ${done + BATCH} з ${TOTAL}`);
  }

  // Оновити статистику, щоб планувальник знав про 100 тисяч рядків
  await prisma.$executeRawUnsafe(`ANALYZE "Event"`);
  console.log(`Готово за ${((Date.now() - t0) / 1000).toFixed(1)} с`);
}

main()
  .catch((err) => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
