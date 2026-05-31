import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoGallery from "@/components/gallery/PhotoGallery";
import { getGalleryImages } from "@/lib/gallery";

export default function GalleryPage() {
  const galleryImages = getGalleryImages();
  return (
    <div className="py-14">
      <Container>
        <Reveal delayMs={60}>
          <SectionHeading
            eyebrow="Gallery"
            title="Moments at Pasio Life"
            subtitle="Trail rides, lessons, camps, and the family—horses, people, and the quiet magic in between."
          />
        </Reveal>

        <div className="mt-10">
          <Reveal delayMs={120}>
            <PhotoGallery images={galleryImages} />
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
