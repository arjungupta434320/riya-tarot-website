import { Product } from "@/store/useStore";

export const products: Product[] = [
  {
    id: "love-attraction",
    name: "ROSE QUARTZ BRACELET",
    description: "A delicate pink Rose Quartz bracelet inspired by the traditional symbolism of unconditional love. Created around themes of self-love, warmth and emotional connection, it makes a thoughtful personal or gifting piece.",
    shortIntention: "Love • Connection • Harmony",
    price: 4200,
    salePrice: 2100,
    image: "/images/products/love-attraction-main.jpg",
    gallery: [
      "/images/products/love-attraction-main.jpg",
      "/images/products/love-attraction-1.jpg",
      "/images/products/love-attraction-2.jpg",
      "/images/products/love-attraction-v2.jpg"
    ],
    category: "Love",
  },
  {
    id: "citrine",
    name: "CITRINE BRACELET",
    description: "A luminous golden Citrine bracelet inspired by the traditional symbolism of optimism, prosperity and personal confidence. Its warm natural color makes it equally suited to spiritual rituals and everyday jewelry styling.",
    shortIntention: "Optimism • Abundance • Focus",
    price: 4200,
    salePrice: 2100,
    image: "/images/products/citrine-main.jpg",
    gallery: [
      "/images/products/citrine-main.jpg",
      "/images/products/citrine-1.jpg",
      "/images/products/citrine-2.jpg",
      "/images/products/citrine-v2.jpg"
    ],
    category: "Abundance",
  },
  {
    id: "tiger-eye-celeb",
    name: "TIGER EYE BRACELET",
    description: "A polished Tiger Eye bracelet designed with a premium, confident aesthetic. Its golden-brown tones create a sophisticated statement while drawing from traditional symbolism around courage and focus.",
    shortIntention: "Confidence • Courage • Focus",
    price: 4200,
    salePrice: 2100,
    image: "/images/products/tiger-eye-main.jpg",
    gallery: [
      "/images/products/tiger-eye-main.jpg",
      "/images/products/tiger-eye-1.jpg",
      "/images/products/tiger-eye-2.jpg",
      "/images/products/tiger-eye-celeb-v2.jpg"
    ],
    category: "Confidence",
  },
  {
    id: "red-carnelian",
    name: "RED CARNELIAN BRACELET",
    description: "A bold deep-red Carnelian bracelet designed around themes of vitality and motivation. Its warm design represents the balance between personal connection and ambition, making it an expressive choice for everyday wear.",
    shortIntention: "Motivation • Ambition • Protection",
    price: 4200,
    salePrice: 2100,
    image: "/images/products/red-carnelian-main.jpg",
    gallery: [
      "/images/products/red-carnelian-main.jpg",
      "/images/products/red-carnelian-1.jpg",
      "/images/products/red-carnelian-2.jpg",
      "/images/products/red-carnelian-v2.jpg"
    ],
    category: "Protection",
  },
  {
    id: "turquoise",
    name: "TURQUOISE BRACELET",
    description: "Blue-green Turquoise tones create a refreshing and distinctive bracelet. Traditionally associated with protection symbolism, balance and positive journeys.",
    shortIntention: "Protection • Balance • Calm",
    price: 4200,
    salePrice: 2100,
    image: "/images/products/turquoise-main.jpg",
    gallery: [
      "/images/products/turquoise-main.jpg",
      "/images/products/turquoise-1.jpg",
      "/images/products/turquoise-2.jpg",
      "/images/products/turquoise-v2.jpg"
    ],
    category: "Calm",
  }
];
