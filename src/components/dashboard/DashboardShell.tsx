import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
  /** Full-height layout for chat-like pages */
  fullHeight?: boolean;
  /** Constrain content width */
  size?: "md" | "lg" | "xl" | "full";
}

const sizeMap = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-7xl",
};

export function DashboardShell({
  children,
  className,
  fullHeight = false,
  size = "xl",
}: DashboardShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeMap[size],
        fullHeight
          ? "flex h-[100dvh] flex-col pt-16"
          : "min-h-[100dvh] pt-20 pb-12 sm:pt-24 sm:pb-16",
        className
      )}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
          {meta && <div className="mt-2 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

export function TokenBadge({ tokens }: { tokens: number | null }) {
  if (tokens === null) return null;

  const low = tokens <= 5;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        low
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border bg-muted/60 text-foreground"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          low ? "bg-destructive" : "bg-emerald-500"
        )}
      />
      {tokens} token{tokens === 1 ? "" : "s"} left
    </span>
  );
}

export function Surface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
