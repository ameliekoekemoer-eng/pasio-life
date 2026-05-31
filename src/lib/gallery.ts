import fs from "node:fs";
import path from "node:path";
import {
  galleryFeaturedFilenames,
  gallerySkipFilenames,
  isWebImageFilename,
  publicImagePath
} from "@/lib/images";

export type GalleryImage = {
  src: string;
  alt: string;
};

function labelFromFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/&/g, " & ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim();
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
        isWebImageFilename(filename) &&
        !gallerySkipFilenames.has(filename.toLowerCase())
    )
    .sort((a, b) => {
      const featuredOrder = new Map(
        galleryFeaturedFilenames.map((name, index) => [name, index])
      );
      const aFeatured = featuredOrder.get(a);
      const bFeatured = featuredOrder.get(b);

      if (aFeatured !== undefined && bFeatured !== undefined) return aFeatured - bFeatured;
      if (aFeatured !== undefined) return -1;
      if (bFeatured !== undefined) return 1;
      return a.localeCompare(b);
    });

  return filenames.map((filename) => ({
    src: publicImagePath(filename),
    alt: `Pasio Life — ${labelFromFilename(filename)}`
  }));
}
