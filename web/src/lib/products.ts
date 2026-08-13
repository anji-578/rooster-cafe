export type ProductCategory = "coffee" | "pickles";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  subtitle: string;
  price: number;
  weight: string;
  description: string;
  image: string;
  badge?: string;
  details?: Record<string, string>;
  tasteNotes?: string[];
  roastLevel?: number; // 1-5
};

export const products: Product[] = [
  {
    id: "coffee-bolaven",
    slug: "bolaven-laos",
    name: "Bolaven Laos",
    category: "coffee",
    subtitle: "Single Origin · 100% Arabica",
    price: 649,
    weight: "250 g",
    badge: "Premium Coffee",
    description:
      "Smooth, rich, and memorable. Ethically sourced from the Bolaven Plateau and roasted with care for everyday rituals that feel special.",
    image: "/products/coffee-packaging.png",
    roastLevel: 4,
    tasteNotes: ["Dark Chocolate", "Orange", "Hazelnut", "Caramel"],
    details: {
      Origin: "Laos",
      Region: "Bolaven Plateau",
      Farm: "Phouyam Estate",
      Altitude: "1,200 – 1,400 MASL",
      Variety: "Typica, Catimor",
      Process: "Washed",
    },
  },
  {
    id: "pickle-mango",
    slug: "sun-dried-mango-pickle",
    name: "Sun-Dried Mango Pickle",
    category: "pickles",
    subtitle: "Homestyle · Tangy & Bold",
    price: 299,
    weight: "250 g",
    badge: "Kitchen Classic",
    description:
      "Slow-cured mango with warm spices. Made in small batches for that familiar, comforting bite with every meal.",
    image: "/products/pickle-jar.jpg",
    tasteNotes: ["Tangy", "Spicy", "Savoury"],
    details: {
      Style: "Traditional",
      Heat: "Medium",
      "Best with": "Rice, curd, sandwiches",
      Storage: "Keep refrigerated after opening",
    },
  },
  {
    id: "pickle-mixed",
    slug: "garden-mixed-pickle",
    name: "Garden Mixed Pickle",
    category: "pickles",
    subtitle: "Seasonal vegetables · Everyday favourite",
    price: 279,
    weight: "250 g",
    badge: "Staff Pick",
    description:
      "A bright mix of seasonal vegetables in a balanced spice blend. Simple, honest, and made to share.",
    image: "/products/pickle-mixed.jpg",
    tasteNotes: ["Zesty", "Earthy", "Warm spice"],
    details: {
      Style: "Mixed vegetable",
      Heat: "Mild–Medium",
      "Best with": "Thalis, parathas, bowls",
      Storage: "Keep refrigerated after opening",
    },
  },
  {
    id: "coffee-beans-loose",
    slug: "house-espresso-blend",
    name: "House Espresso Blend",
    category: "coffee",
    subtitle: "Cafe roast · Smooth & balanced",
    price: 549,
    weight: "250 g",
    badge: "Cafe Favourite",
    description:
      "The blend we pull every morning at the cafe. Balanced body, clean finish — built for home espresso and filter alike.",
    image: "/products/coffee-beans.jpg",
    roastLevel: 3,
    tasteNotes: ["Cocoa", "Brown sugar", "Nutty"],
    details: {
      Origin: "Blend",
      Roast: "Medium",
      "Best for": "Espresso, moka, filter",
      Process: "Washed & natural mix",
    },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category?: ProductCategory) {
  if (!category) return products;
  return products.filter((p) => p.category === category);
}
