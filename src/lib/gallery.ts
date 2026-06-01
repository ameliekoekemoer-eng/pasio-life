import fs from "node:fs";
import path from "node:path";
import {
  galleryFeaturedFilenames,
  gallerySkipFilenames,
  publicImagePath
} from "@/lib/images";

export type GalleryCategory = "all" | "horses" | "experiences" | "family";

export type GalleryImage = {
  src: string;
  alt: string;
  filename: string;
  categories: GalleryCategory[];
};

function isJpgFilename(filename: string): boolean {
  const lower = filename.toLowerCase();
  return lower.endsWith(".jpg") || lower.endsWith(".jpeg");
}

function labelFromFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/&/g, " & ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim();
}

const FAMILY_KEYWORDS = [
  "amelie",
  "sue-mari",
  "buffy",
  "johnny",
  "johnney",
  "zoe & buffy",
  "helmets"
];

const HORSE_KEYWORDS = [
  "eclipse",
  "eclispe",
  "roemo",
  "romeo",
  "sharif",
  "luna",
  "purple",
  "biscuit",
  "boas",
  "bronwin",
  "moskou",
  "moksou",
  "moon",
  "pasha",
  "jade",
  "lollipop",
  "jackie",
  "zoe",
  "bubbles",
  "liani"
];

const EXPERIENCE_KEYWORDS = [
  "trail",
  "nationals",
  "helmets",
  "pony",
  "camp",
  "lesson",
  "ride"
];

export function categorizeGalleryImage(filename: string): GalleryCategory[] {
  const lower = filename.toLowerCase();
  const categories = new Set<GalleryCategory>();

  if (FAMILY_KEYWORDS.some((k) => lower.includes(k))) {
    categories.add("family");
  }
  if (HORSE_KEYWORDS.some((k) => lower.includes(k))) {
    categories.add("horses");
  }
  if (EXPERIENCE_KEYWORDS.some((k) => lower.includes(k))) {
    categories.add("experiences");
  }

  if (categories.size === 0) {
    categories.add("horses");
  }

  return Array.from(categories);
}

export function getGalleryImages(): GalleryImage[] {
  const imagesDir = path.join(process.cwd(), "public", "images");

  if (!fs.existsSync(imagesDir)) {
    return [];
  }

  const filenames = fs
    .readdirSync(imagesDir)
    .filter(
      (filename) =>
        isJpgFilename(filename) &&
        !gallerySkipFilenames.has(filename.toLowerCase())
    )
    .sort((a, b) => {
      const featuredOrder = new Map<string, number>(
        galleryFeaturedFilenames.map((name, index) => [name.toLowerCase(), index])
      );
      const aFeatured = featuredOrder.get(a.toLowerCase());
      const bFeatured = featuredOrder.get(b.toLowerCase());

      if (aFeatured !== undefined && bFeatured !== undefined) return aFeatured - bFeatured;
      if (aFeatured !== undefined) return -1;
      if (bFeatured !== undefined) return 1;
      return b.localeCompare(a);
    });

  return filenames.map((filename) => ({
    filename,
    src: publicImagePath(filename),
    alt: `Pasio Life — ${labelFromFilename(filename)}`,
    categories: categorizeGalleryImage(filename)
  }));
}
