import type { ReactNode } from "react";
import { ListenButton } from "./ListenButton";

type Props = {
  stepLabel: string;
  children: ReactNode;
  extra?: ReactNode;
  brand?: string;
};

export function Shell({ stepLabel, children, extra, brand = "Happy Learn" }: Props) {
  return (
    <div className="app-shell">
      <ListenButton />
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">✦</span>
          {brand}
        </div>
        <div className="step-pill">{stepLabel}</div>
        {extra}
      </header>
      <div className="window">{children}</div>
    </div>
  );
}
