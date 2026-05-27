import type { ButtonHTMLAttributes, ReactNode } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Shell({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rescue-enter mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Panel({
  children,
  className,
  tone = "surface"
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "paper" | "ink";
}) {
  const toneClass = {
    surface: "border-line/80 bg-surface/95 text-ink shadow-premium",
    paper: "border-line/80 bg-paper/70 text-ink",
    ink: "border-ink bg-ink text-paper shadow-premium"
  }[tone];

  return (
    <section className={cx("rounded-lg border p-5 sm:p-6", toneClass, className)}>
      {children}
    </section>
  );
}

export function PrimaryAction({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-moss px-6 text-base font-semibold text-white shadow-action transition hover:bg-mossDark disabled:cursor-not-allowed disabled:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SignalPill({
  label,
  value,
  tone = "quiet"
}: {
  label?: string;
  value: ReactNode;
  tone?: "quiet" | "moss" | "clay" | "ink";
}) {
  const toneClass = {
    quiet: "border-line/80 bg-paper/70 text-ink",
    moss: "border-moss/25 bg-moss/10 text-mossDark",
    clay: "border-clay/25 bg-clay/10 text-clay",
    ink: "border-ink/10 bg-ink text-paper"
  }[tone];

  return (
    <span
      className={cx(
        "inline-flex min-h-8 items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        toneClass
      )}
    >
      {label && <span className="text-muted">{label}</span>}
      <span className="safe-text">{value}</span>
    </span>
  );
}

export function RescueBrief({
  eyebrow,
  title,
  body,
  action,
  className
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Panel className={cx("relative overflow-hidden p-6 sm:p-8", className)}>
      <div className="absolute inset-y-0 left-0 w-1 bg-moss" aria-hidden="true" />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-moss">{eyebrow}</p>
          <h1 className="safe-text mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {title}
          </h1>
          {body && <div className="safe-text mt-4 max-w-3xl text-base leading-7 text-muted">{body}</div>}
        </div>
        {action && <div className="flex-none">{action}</div>}
      </div>
    </Panel>
  );
}

export function EmptyState({
  title,
  body,
  className
}: {
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-lg border border-dashed border-line bg-surface/70 p-4 text-sm leading-6 text-muted",
        className
      )}
    >
      <p className="font-semibold text-ink">{title}</p>
      {body && <p className="mt-1">{body}</p>}
    </div>
  );
}

export function ScriptCard({
  title,
  children,
  actions,
  className
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <Panel tone="paper" className={cx("p-4 sm:p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {actions}
      </div>
      <div className="safe-text mt-3 leading-7 text-muted">{children}</div>
    </Panel>
  );
}
