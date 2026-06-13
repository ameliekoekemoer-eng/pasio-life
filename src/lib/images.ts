/** Build a public URL for files in /public/images (handles & and spaces). */
export function publicImagePath(filename: string): string {
  return `/images/${encodeURIComponent(filename)}`;
}

const WEB_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"] as const;

export function isWebImageFilename(filename: string): boolean {
  const lower = filename.toLowerCase();
  return WEB_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/** Curated photos for key pages (filenames in /public/images). */
export const siteImages = {
  hero: "Ecslipse on a trail ride.jpg",
  about: "Eclispe & Bronwin 3.jpg",
  buySell: "Sharif & Purple.jpg",
  experiences: {
    trails: "Ecslipse on a trail ride.jpg",
    clinics: "Biscuit at Nationals.jpg",
    lessons: "Helmets.jpg",
    ponyCamps: "Biscuit & Liani.jpg",
    parties: "Luna & Buffy.jpg"
  },
  home: {
    trails: "Ecslipse on a trail ride.jpg",
    lessons: "Jade.jpg",
    camps: "Biscuit & Liani.jpg",
    family: ["Boas.jpg", "Amelie, Sue-Mari, Liani & Buffy.jpg", "Luna & Buffy.jpg"] as const
  },
  family: {
    boas: "Boas.jpg",
    johnnyLiani: "Johnney & Liani.jpg",
    jade: "Jade.jpg",
    purple: "Purple.jpg",
    lollipop: "Lollipop.jpg",
    moonPasha: "Moon & Pasha1.jpg",
    amelie: "Amelie, Sue-Mari, Liani & Buffy.jpg",
    buffy: "Luna & Buffy.jpg"
  }
} as const;

export const gallerySkipFilenames = new Set([
  "pasiolifelogo.png.png",
  "logo.png",
  "logo.svg"
]);

/** New professional shots — surfaced first in gallery order (matched case-insensitively). */
export const galleryFeaturedFilenames = [
  "Ecslipse on a trail ride.jpg",
  "Amelie, Sue-Mari, Liani & Buffy.jpg",
  "Sharif & Purple.jpg",
  "Eclipse.jpg",
  "Biscuit at Nationals.jpg",
  "Luna & Buffy.jpg",
  "Moon & Pasha1.jpg",
  "Roemo & Bronwin.jpg",
  "Zoe Smiling.jpg"
] as const;
