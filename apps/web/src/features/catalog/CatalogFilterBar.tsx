import { useCatalogFilters } from "./useCatalogFilters";

// Міста з сидів. Окремого ендпоінта для довідника міст у контракті поки немає.
const CITIES = ["Київ", "Львів", "Одеса", "Харків"] as const;

export function CatalogFilterBar() {
  const { filters, setFilter, reset, isEmpty } = useCatalogFilters();

  return (
    <div className="filters">
      <div className="filters__cities" role="group" aria-label="Місто">
        <button
          type="button"
          aria-pressed={!filters.city}
          onClick={() => setFilter("city", undefined)}
        >
          Усі міста
        </button>
        {CITIES.map((city) => (
          <button
            key={city}
            type="button"
            aria-pressed={filters.city === city}
            onClick={() => setFilter("city", city)}
          >
            {city}
          </button>
        ))}
      </div>

      <label className="filters__date">
        Не раніше
        <input
          type="date"
          value={filters.from ?? ""}
          onChange={(e) => setFilter("from", e.target.value)}
        />
      </label>

      {!isEmpty && (
        <button type="button" className="filters__reset" onClick={reset}>
          Скинути фільтри
        </button>
      )}
    </div>
  );
}
