import type { ReactNode } from "react";

type Props = {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

export function Choice({ selected, onClick, children, className }: Props) {
  return (
    <button
      type="button"
      className={`choice ${selected ? "is-selected" : ""} ${className ?? ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
