import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchEvent } from "../../api/queries";
import { eventKeys } from "../../api/queryKeys";
import { ErrorState } from "../../components/ErrorState";
import { formatDate, formatPrice } from "../catalog/format";

type BackState = { search?: string } | null;

export function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const backTo = { pathname: "/", search: (location.state as BackState)?.search ?? "" };

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: eventKeys.detail(eventId ?? ""),
    queryFn: () => fetchEvent(eventId ?? ""),
    // Без eventId запит не йде взагалі – інакше отримали б 400.
    enabled: Boolean(eventId),
  });

  return (
    <article className="event-page">
      <Link to={backTo} className="event-page__back">
        ← До каталогу
      </Link>

      {isPending ? (
        <div className="skeleton-card" aria-busy="true" aria-label="Завантаження події">
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--short" />
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <>
          <h2>{data.title}</h2>
          <p className="event-page__meta">
            {data.venue.name}, {data.venue.city} · {formatDate(data.startsAt)}
          </p>
          {data.description && <p>{data.description}</p>}
          <p>
            Від {formatPrice(data.minPrice)} · вільних місць: {data.availableSeats}
          </p>
        </>
      )}
    </article>
  );
}
