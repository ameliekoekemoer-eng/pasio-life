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
  about: "moon&pasha2.jpg",
  buySell: "sharif&purple.jpg",
  experiences: {
    trails: "Ecslipsetrailride.jpg",
    clinics: "BiscuitNationals.jpg",
    lessons: "horses5.jpg",
    ponyCamps: "biscuit&liani.jpg",
    parties: "Luna&Buffy.jpg"
  },
  home: {
    trails: "moon&pasha1.jpg",
    lessons: "horses2.jpg",
    camps: "horses3.jpg",
    family: ["Boas.jpg", "ZoeSmile.jpg", "Luna&Buffy.jpg"] as const
  }
} as const;

export const gallerySkipFilenames = new Set([
  "pasiolifelogo.png.png",
  "logo.png",
  "logo.svg"
]);
