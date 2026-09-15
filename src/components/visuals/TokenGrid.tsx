type TokenGridProps = {
  count: number;
  columns: number;
  active?: number;
  blink?: boolean;
  tone?: "good" | "other";
  label?: string;
};

export function TokenGrid({
  count,
  columns,
  active = 0,
  blink = false,
  tone = "good",
  label,
}: TokenGridProps) {
  const items = Array.from({ length: count }, (_, index) => {
    const on = index < active;
    return (
      <i
        key={index}
        className={`token tone-${tone} ${on ? "is-on" : ""} ${blink && !on ? "is-blink" : ""}`}
      />
    );
  });
  return (
    <div
      className="token-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      role="img"
      aria-label={label}
    >
      {items}
    </div>
  );
}

export function FractionSlices({ filled, total, label }: { filled: number; total: number; label: string }) {
  return (
    <div className="fraction-slices" role="img" aria-label={label}>
      {Array.from({ length: total }, (_, index) => (
        <b key={index} className={index < filled ? "is-filled" : ""} />
      ))}
    </div>
  );
}
