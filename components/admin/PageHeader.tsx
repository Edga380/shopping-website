import { ReactNode } from "react";

export function PageHeader({ children }: { children: ReactNode }) {
  return <h1 className="text-text-color-dark-green text-4xl">{children}</h1>;
}
