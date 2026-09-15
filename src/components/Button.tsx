import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary";
  children: ReactNode;
};

export function Button({ variant = "default", children, className, type = "button", ...props }: Props) {
  return (
    <button type={type} className={`${variant === "primary" ? "primary" : ""} ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
}
