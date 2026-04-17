export interface CardItem {
  id: number;
  tagline: string;
  title: string;
  subtitle: string;
  cta: string;
  brand: string;
  tags: string[];
  gradient: string;
  video?: string;
}

export const fantasyCards: CardItem[] = [
  {
    id: 1,
    tagline: "Where light bends",
    title: "The Ember Divide.",
    subtitle: "A world split by flame and silence",
    cta: "Enter the Divide",
    brand: "Luminos",
    tags: ["Fantasy", "Cinematic"],
    gradient: "linear-gradient(135deg, #f97316 0%, #dc2626 40%, #1a1a2e 100%)",
    video: "/videos/video_11.mp4",
  },
  {
    id: 2,
    tagline: "Beyond the veil",
    title: "Twilight Marshlands.",
    subtitle: "Where forgotten kingdoms rest beneath the mist",
    cta: "Explore the Marsh",
    brand: "Luminos",
    tags: ["Adventure", "Moody"],
    gradient: "linear-gradient(135deg, #6366f1 0%, #1e1b4b 50%, #0f172a 100%)",
    video: "/videos/video_12.mp4",
  },
  {
    id: 3,
    tagline: "Roots remember",
    title: "The Verdant Spire.",
    subtitle: "Ancient forests that whisper in emerald tongues",
    cta: "Climb the Spire",
    brand: "Luminos",
    tags: ["Nature", "Epic"],
    gradient: "linear-gradient(135deg, #22c55e 0%, #065f46 50%, #0a0a0a 100%)",
    video: "/videos/video_13.mp4",
  },
  {
    id: 4,
    tagline: "Written in starlight",
    title: "Celestine Rift.",
    subtitle: "The cosmos fractured into a thousand glowing shards",
    cta: "Chart the Rift",
    brand: "Luminos",
    tags: ["Cosmic", "Surreal"],
    gradient: "linear-gradient(135deg, #a78bfa 0%, #1e1b4b 40%, #020617 100%)",
    video: "/videos/video_14.mp4",
  },
  {
    id: 5,
    tagline: "Gilded and untamed",
    title: "The Aureate Expanse.",
    subtitle: "Endless golden plains under a blazing amber sky",
    cta: "Cross the Expanse",
    brand: "Luminos",
    tags: ["Warm", "Vast"],
    gradient: "linear-gradient(135deg, #fbbf24 0%, #d97706 40%, #292524 100%)",
    video: "/videos/video_15.mp4",
  },
];
