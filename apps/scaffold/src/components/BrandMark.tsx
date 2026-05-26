interface BrandMarkProps {
  className?: string;
  title?: string;
  decorative?: boolean;
}

export function BrandMark({
  className = "h-11 w-11",
  title = "Scaffold",
  decorative = false
}: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : title}
    >
      <rect width="48" height="48" rx="8" fill="#FFFCF6" />
      <rect x="8" y="8" width="5" height="32" rx="1.5" fill="currentColor" />
      <rect x="35" y="8" width="5" height="32" rx="1.5" fill="currentColor" />
      <rect x="8" y="8" width="24" height="5" rx="1.5" fill="currentColor" />
      <rect x="16" y="21.5" width="24" height="5" rx="1.5" fill="currentColor" />
      <rect x="8" y="35" width="24" height="5" rx="1.5" fill="currentColor" />
      <rect x="8" y="35" width="7" height="5" rx="1.5" fill="#3F7C6B" />
    </svg>
  );
}
