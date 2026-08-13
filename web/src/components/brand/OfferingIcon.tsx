type Id = "coffee" | "italian" | "chinese" | "indian" | "snooker";

export function OfferingIcon({
  id,
  className = "h-8 w-8",
}: {
  id: Id;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (id) {
    case "coffee":
      return (
        <svg {...common}>
          <path d="M14 18h16v12a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V18z" />
          <path d="M30 22h3a4 4 0 0 1 0 8h-3" />
          <path d="M18 10c0 2 1 3 1 5M23 9c0 2 1 3 1 5M28 10c0 2 1 3 1 5" />
        </svg>
      );
    case "italian":
      return (
        <svg {...common}>
          <path d="M10 30c4-10 24-10 28 0" />
          <path d="M14 30h20l-2 8H16l-2-8z" />
          <circle cx="20" cy="24" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="26" cy="22" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="30" cy="26" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "chinese":
      return (
        <svg {...common}>
          <path d="M12 28c2 6 22 6 24 0" />
          <path d="M14 28h20v2a8 8 0 0 1-20 0v-2z" />
          <path d="M18 20l12 8M22 18l12 8" />
        </svg>
      );
    case "indian":
      return (
        <svg {...common}>
          <path d="M16 30c0 4 4 6 8 6s8-2 8-6" />
          <path d="M14 30h20c0-6-4-10-10-14-6 4-10 8-10 14z" />
          <path d="M24 10v6" />
          <circle cx="24" cy="9" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "snooker":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="12" />
          <circle cx="24" cy="18" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="19" cy="26" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="29" cy="26" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="24" cy="30" r="2.2" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
