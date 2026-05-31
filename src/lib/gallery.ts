export type GalleryImage = {
  src: string;
  alt: string;
};

function imageSrc(filename: string): string {
  return `/images/${encodeURIComponent(filename)}`;
}

function labelFromFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/&/g, " & ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim();
}

const filenames = [
  "Ecslipsetrailride.jpg",
  "horses1.jpg",
  "horses2.jpg",
  "horses3.jpg",
  "horses4.jpg",
  "horses5.jpg",
  "horses6.jpg",
  "Boas.jpg",
  "Jade.jpg",
  "Lollipop.jpg",
  "Purple.jpg",
  "Zoe.jpg",
  "ZoeSmile.jpg",
  "Bubbles.jpg",
  "Moksou.jpg",
  "BiscuitNationals.jpg",
  "biscuit&liani.jpg",
  "johnney&liani.jpg",
  "sharif&purple.jpg",
  "moon&pasha1.jpg",
  "moon&pasha2.jpg",
  "Buffy&Johnny.jpg",
  "Luna&Buffy.jpg",
  "Zoe&buffy.jpg",
  "IMG-20251118-WA0166.jpg"
];

export const galleryImages: GalleryImage[] = filenames.map((filename) => ({
  src: imageSrc(filename),
  alt: `Pasio Life — ${labelFromFilename(filename)}`
}));
