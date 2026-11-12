type Props = {
  hasFilters: boolean;
  onReset?: () => void;
};

export function EmptyState({ hasFilters, onReset }: Props) {
  return (
    <div role="status" className="state state--empty">
      <p>
        {hasFilters
          ? "За обраними фільтрами подій не знайдено"
          : "Подій поки немає"}
      </p>
      {hasFilters && onReset && (
        <button type="button" onClick={onReset}>
          Скинути фільтри
        </button>
      )}
    </div>
  );
}
