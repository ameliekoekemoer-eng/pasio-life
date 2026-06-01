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
  hero: "Ecslipsetrailride.jpg",
  about: "IMG_9338.jpg",
  buySell: "sharif&purple.jpg",
  experiences: {
    trails: "Ecslipsetrailride.jpg",
    clinics: "BiscuitNationals.jpg",
    lessons: "IMG_9275.jpg",
    ponyCamps: "biscuit&liani.jpg",
    parties: "Luna&Buffy.jpg"
  },
  home: {
    trails: "Ecslipsetrailride.jpg",
    lessons: "IMG_9338.jpg",
    camps: "IMG_9320.jpg",
    family: ["Boas.jpg", "IMG_9335.jpg", "Luna&Buffy.jpg"] as const
  },
  family: {
    boas: "Boas.jpg",
    johnnyLiani: "johnney&liani.jpg",
    jade: "Jade.jpg",
    purple: "IMG_9326.jpg",
    lollipop: "IMG_9314.jpg",
    moonPasha: "moon&pasha1.jpg",
    amelie: "IMG_9335.jpg",
    buffy: "Luna&Buffy.jpg"
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
