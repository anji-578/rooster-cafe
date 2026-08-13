export type Dish = {
  id: string;
  name: string;
  rank: number;
  rating: number;
  likes: number;
  price: string;
  chef: string;
  chefNote: string;
  overview: string;
  ingredients: string[];
  image: string;
  category: "food" | "drinks";
};

/** Signature dishes with photos */
export const dishes: Dish[] = [
  {
    id: "coffee",
    name: "House Coffee",
    rank: 1,
    rating: 4.9,
    likes: 186,
    price: "₹149",
    chef: "Barista",
    chefNote: "Smooth pull, every time.",
    overview:
      "Our signature brew — rich aroma, balanced body, and a clean finish. The Rooster morning ritual.",
    ingredients: ["Fresh espresso", "Steamed milk", "House roast"],
    image: "/dishes/coffee.jpg",
    category: "drinks",
  },
  {
    id: "pizza",
    name: "Woodfire Pizza",
    rank: 2,
    rating: 4.8,
    likes: 154,
    price: "₹349",
    chef: "Kitchen",
    chefNote: "Crisp base, molten cheese.",
    overview:
      "Italian classic from our oven — thin golden crust, generous toppings, and fresh herbs.",
    ingredients: ["Flour base", "Mozzarella", "Tomato", "Basil", "Olive oil"],
    image: "/dishes/pizza.jpg",
    category: "food",
  },
  {
    id: "pasta",
    name: "Creamy Pasta",
    rank: 3,
    rating: 4.7,
    likes: 132,
    price: "₹299",
    chef: "Kitchen",
    chefNote: "Comfort in every fork.",
    overview:
      "Silky pasta tossed in a creamy sauce with herbs. A table favourite at Rooster.",
    ingredients: ["Pasta", "Cream", "Garlic", "Herbs", "Parmesan"],
    image: "/dishes/pasta.jpg",
    category: "food",
  },
  {
    id: "momos",
    name: "Steamed Momos",
    rank: 4,
    rating: 4.8,
    likes: 168,
    price: "₹199",
    chef: "Kitchen",
    chefNote: "Hot, juicy, addictive.",
    overview:
      "Soft steamed momos with spicy dipping sauce. Perfect for sharing — or not.",
    ingredients: ["Flour wrap", "Veg filling", "Ginger", "Chili chutney"],
    image: "/dishes/momos.jpg",
    category: "food",
  },
  {
    id: "burger",
    name: "Rooster Burger",
    rank: 5,
    rating: 4.9,
    likes: 201,
    price: "₹279",
    chef: "Kitchen",
    chefNote: "Stacked and satisfying.",
    overview:
      "Juicy patty, soft bun, crisp lettuce, and house sauce. Our crowd-pleaser.",
    ingredients: ["Bun", "Patty", "Cheese", "Lettuce", "House sauce"],
    image: "/dishes/burger.jpg",
    category: "food",
  },
];
