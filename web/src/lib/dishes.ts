export type Dish = {
  id: string;
  name: string;
  tag: string;
  price: string;
  blurb: string;
  image: string;
  category: "food" | "drinks" | "space";
};

/** Signature dishes & drinks from cafe photos */
export const dishes: Dish[] = [
  {
    id: "creamy-pasta",
    name: "Garden Alfredo Pasta",
    tag: "Italian",
    price: "₹160",
    blurb: "Penne in a silky white sauce with peppers and broccoli.",
    image: "/food/creamy-pasta.jpg",
    category: "food",
  },
  {
    id: "chilli-paneer",
    name: "Chilli Paneer",
    tag: "Starters",
    price: "₹160",
    blurb: "Glossy wok-tossed paneer with peppers and scallions.",
    image: "/food/chilli-paneer.jpg",
    category: "food",
  },
  {
    id: "manchurian",
    name: "Manchurian Special",
    tag: "Chinese",
    price: "₹180",
    blurb: "Crispy bites in a rich dark sauce — a table favourite.",
    image: "/food/manchurian.jpg",
    category: "food",
  },
  {
    id: "fried-rice",
    name: "Fried Rice & Manchurian Bowl",
    tag: "Combos",
    price: "₹189",
    blurb: "Half rice, half gravy — the full wok meal in one bowl.",
    image: "/food/fried-rice-bowl.jpg",
    category: "food",
  },
  {
    id: "noodles",
    name: "Hakka Noodles Plate",
    tag: "Chinese",
    price: "₹160",
    blurb: "Stir-fried noodles with golden tofu and fresh greens.",
    image: "/food/noodles-stirfry.jpg",
    category: "food",
  },
  {
    id: "maggi",
    name: "Rooster Maggi Special",
    tag: "Maggi",
    price: "₹160",
    blurb: "Loaded noodles with a Rooster masala finish.",
    image: "/food/maggi-special.jpg",
    category: "food",
  },
  {
    id: "curry",
    name: "House Curry & Roti",
    tag: "Indian",
    price: "₹180",
    blurb: "Slow gravy, cream swirl, and soft flame-toasted rotis.",
    image: "/food/curry-roti.jpg",
    category: "food",
  },
  {
    id: "onion-rings",
    name: "Crispy Onion Rings",
    tag: "Starters",
    price: "₹120",
    blurb: "Golden battered rings with house dipping sauce.",
    image: "/food/onion-rings.jpg",
    category: "food",
  },
  {
    id: "mojito",
    name: "Mint Mojito",
    tag: "Drinks",
    price: "₹89",
    blurb: "Lime, mint, fizz — cold glass, busy evenings.",
    image: "/food/mojito.jpg",
    category: "drinks",
  },
  {
    id: "shake",
    name: "Chocolate Shake",
    tag: "Drinks",
    price: "₹80",
    blurb: "Thick, creamy, finished with a chocolate swirl.",
    image: "/food/chocolate-shake.jpg",
    category: "drinks",
  },
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    tag: "Drinks",
    price: "₹80",
    blurb: "Chilled brew with a soft foam crown.",
    image: "/food/iced-coffee.jpg",
    category: "drinks",
  },
  {
    id: "punch",
    name: "Rooster Punch",
    tag: "Drinks",
    price: "₹160",
    blurb: "Bright citrus layers over ice — our house cooler.",
    image: "/food/iced-punch.jpg",
    category: "drinks",
  },
];
