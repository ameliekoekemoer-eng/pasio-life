import type { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/experiences",
  "/booking",
  "/contact",
  "/meet-the-family",
  "/gallery",
  "/buy-sell-horses",
  "/school-of-life"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `https://pasio.life${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
