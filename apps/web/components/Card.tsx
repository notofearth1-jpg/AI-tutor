import React from "react";
import clsx from "clsx";

export default function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("rounded-2xl border border-slate-800 bg-slate-900 p-6", className)}>
      {children}
    </div>
  );
}
