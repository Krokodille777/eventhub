import { useInfiniteQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { fetchEvents } from "../../api/queries";
import { eventKeys } from "../../api/queryKeys";
import { ErrorState } from "../../components/ErrorState";
import { EmptyState } from "./EmptyState";
import { EventListSkeleton } from "./EventListSkeleton";
import { formatDate, formatPrice } from "./format";
import { useCatalogFilters } from "./useCatalogFilters";

export function EventList() {
  const { filters, reset, isEmpty } = useCatalogFilters();
  const { search } = useLocation();

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    // Фільтри використовуються в queryFn, отже вони мають бути й у ключі.
    queryKey: eventKeys.list(filters),
    queryFn: ({ pageParam }) => fetchEvents(filters, pageParam),
    initialPageParam: undefined as string | undefined,
    // null у контракті = «сторінок більше немає». Повертаємо undefined,
    // бо null TanStack Query вважає валідним параметром сторінки.
    // Курсор непрозорий (ADR-001) – передаємо як є, нічого не розбираємо.
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  // 1. Завантаження
  if (isPending) return <EventListSkeleton />;

  // 2. Помилка
  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />;

  // 3. Порожньо
  const events = data.pages.flatMap((page) => page.items);
  if (events.length === 0) return <EmptyState hasFilters={!isEmpty} onReset={reset} />;

  // 4. Дані
  return (
    <>
      <ul className="event-list">
        {events.map((e) => (
          <li key={e.id}>
            {/* search у state – щоб «До каталогу» повернула ті самі фільтри */}
            <Link to={`/events/${e.id}`} state={{ search }}>
              <strong>{e.title}</strong>
            </Link>{" "}
            - {e.venue.city}, {formatDate(e.startsAt)}
            {" · від "}
            {formatPrice(e.minPrice)}
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <button
          type="button"
          className="load-more"
          disabled={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          {isFetchingNextPage ? "Завантаження..." : "Показати ще"}
        </button>
      )}
    </>
  );
}
