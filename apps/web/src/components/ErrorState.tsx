import type { Problem } from "@eventhub/contracts";

function titleOf(error: unknown): string {
  if (typeof error === "object" && error !== null && "title" in error) {
    return String((error as Problem).title);
  }
  return "Не вдалося завантажити дані";
}

type Props = {
  error: unknown;
  onRetry: () => void;
};

export function ErrorState({ error, onRetry }: Props) {
  return (
    <div role="alert" className="state state--error">
      <p>{titleOf(error)}</p>
      <button type="button" onClick={onRetry}>
        Спробувати ще
      </button>
    </div>
  );
}
