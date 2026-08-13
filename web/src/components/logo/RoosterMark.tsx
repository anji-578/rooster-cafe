"use client";

export function RoosterMark({
  className = "h-14 w-14",
  gold = false,
}: {
  className?: string;
  gold?: boolean;
}) {
  const stroke = gold ? "#C9A227" : "#123A6D";
  const fill = gold ? "#C9A227" : "#123A6D";

  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="40" cy="40" r="36" stroke={stroke} strokeWidth="1.5" />
      <path
        d="M28 48c2-10 8-18 18-22 2 6 4 10 4 16-6 2-12 4-16 10-4-2-6-2-6-4z"
        fill={fill}
      />
      <path
        d="M46 28c4-2 8-2 12 0-2 4-4 6-8 8-2-2-4-4-4-8z"
        fill={fill}
      />
      <circle cx="50" cy="34" r="1.6" fill={gold ? "#0B1F3A" : "#FFFFFF"} />
      <path
        d="M52 42c4 2 8 6 10 12"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M54 46c3 1 6 3 8 6"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="58" cy="40" r="2.2" fill={fill} />
    </svg>
  );
}
