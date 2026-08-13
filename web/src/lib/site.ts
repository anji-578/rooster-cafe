export const siteConfig = {
  name: "rooster Cafe & Dine",
  shortName: "rooster",
  tagline: "Enjoyed the food? We'd love to hear from you.",
  locationLine1: "1A Block, Near Wipro Park",
  locationLine2: "Koramangala, Bengaluru",
  location: "1A Block, Near Wipro Park, Koramangala, Bengaluru",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.roostercafe.in",
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://instagram.com/roostercafe.dine",
  instagramHandle: "@roostercafe.dine",
  whatsappUrl:
    process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/910000000000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "910000000000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@roostercafe.in",
  currency: "₹",
};

export const offerings = [
  {
    id: "coffee",
    title: "Coffee",
    blurb: "Fresh brews to start slow or stay sharp.",
    href: "/menu#coffee",
  },
  {
    id: "italian",
    title: "Italian",
    blurb: "Pizzas, pastas, and comfort classics.",
    href: "/menu#italian",
  },
  {
    id: "chinese",
    title: "Chinese",
    blurb: "Wok-tossed favourites, full of flavour.",
    href: "/menu#chinese",
  },
  {
    id: "indian",
    title: "Indian",
    blurb: "Homestyle plates that feel familiar.",
    href: "/menu#indian",
  },
  {
    id: "snooker",
    title: "Snooker",
    blurb: "Play a frame while you unwind.",
    href: "/snooker",
  },
] as const;

export function reviewPageUrl(source = "visit") {
  const url = new URL("/review", siteConfig.siteUrl);
  url.searchParams.set("src", source);
  return url.toString();
}

export function formatPrice(amount: number) {
  return `${siteConfig.currency}${amount.toLocaleString("en-IN")}`;
}
