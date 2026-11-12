import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { CatalogFilters } from "../../api/queries";

/**
 * Фільтри каталогу живуть лише в URL — це єдине джерело правди.
 * Жодного useState: посилання відтворює екран, «назад» знімає фільтр.
 */
export function useCatalogFilters() {
  const [params, setParams] = useSearchParams();

  const filters: CatalogFilters = useMemo(
    () => ({
      city: params.get("city") ?? undefined,
      from: params.get("from") ?? undefined,
    }),
    [params],
  );

  const setFilter = useCallback(
    (key: keyof CatalogFilters, value: string | undefined) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      });
    },
    [setParams],
  );

  const reset = useCallback(() => setParams(new URLSearchParams()), [setParams]);

  const isEmpty = !filters.city && !filters.from;

  return { filters, setFilter, reset, isEmpty };
}
