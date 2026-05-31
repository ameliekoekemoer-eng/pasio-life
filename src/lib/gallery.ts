import fs from "node:fs";
import path from "node:path";
import {
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

  return fs
    .readdirSync(imagesDir)
    .filter(
      (filename) =>
        isWebImageFilename(filename) &&
        !gallerySkipFilenames.has(filename.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b))
    .map((filename) => ({
      src: publicImagePath(filename),
      alt: `Pasio Life — ${labelFromFilename(filename)}`
    }));
}
