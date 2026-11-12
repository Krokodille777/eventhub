import { useQuery } from "@tanstack/react-query";
import {fetchEvents, type CatalogFilters} from "../../api/queries";
import { eventKeys } from "../../api/queryKeys";

export function EventList(){
    const filters: CatalogFilters = {};

    const { data, isPending, isError, error} = useQuery({
        queryKey: eventKeys.list(filters),
        queryFn: () => fetchEvents(filters),
    });

    if (isPending) return <p>Loading...</p>;
    if (isError) return <p role = "alert">Failed to load events</p>;

    return(
        <ul className = "event-list">
            {data.items.map((e) => (
                <li key = {e.id}>
                    <strong>{e.title}</strong> - {e.venue.city},{" "}
                    {new Date(e.startsAt).toLocaleString("uk-UA")}
                    {" · від "}
                    {/* amount у копійках - ділимо на 10 лише для показу.
                    У розрахунках копійки НІКОЛИ не перетворюються
                    на дробові гривні. */}
                    {(e.minPrice.amount / 100).toFixed(2)} грн
                </li>
            ))}
        </ul>
    );
}
