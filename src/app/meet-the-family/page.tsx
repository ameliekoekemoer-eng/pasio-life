import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ProfileCard from "@/components/cards/ProfileCard";
import { publicImagePath, siteImages } from "@/lib/images";

export default function MeetTheFamilyPage() {
  const { family: img } = siteImages;

  const profiles = [
    {
      name: "Boas",
      title: "Steady & Kind",
      story:
        "Boas brings calm to every moment. He’s wonderful for riders who want to feel safe while they learn to trust.",
      imageSrc: publicImagePath(img.boas),
      highlights: ["Gentle presence", "Patient partner", "Great for beginners"]
    },
    {
      name: "Johnny & Liani",
      title: "The Trail Pair",
      story:
        "Johnny and Liani love the open path. Together they teach rhythm, balance, and the joy of moving through nature.",
      imageSrc: publicImagePath(img.johnnyLiani),
      highlights: ["Trail lovers", "Strong connection", "Freedom on earth"]
    },
    {
      name: "Jade",
      title: "The Soft Teacher",
      story:
        "Jade notices how you feel and meets you there. She’s brilliant for building confidence from the ground up.",
      imageSrc: publicImagePath(img.jade),
      highlights: ["Attentive", "Kind energy", "Confidence builder"]
    },
    {
      name: "Purple",
      title: "Spirit & Grace",
      story:
        "Purple has presence—beautiful, honest, and full of heart. Riding with her feels like a conversation.",
      imageSrc: publicImagePath(img.purple),
      highlights: ["Elegant mover", "Deep connection", "Memorable rides"]
    },
    {
      name: "Lollipop",
      title: "Playful Heart",
      story:
        "Lollipop brings lightness to learning. She’s perfect for riders who want fun, warmth, and a little sparkle.",
      imageSrc: publicImagePath(img.lollipop),
      highlights: ["Playful", "Affectionate", "Camp favourite"]
    },
    {
      name: "Moon & Pasha",
      title: "Sunset Souls",
      story:
        "Moon and Pasha are trail magic—patient, curious, and happiest out in the open with you beside them.",
      imageSrc: publicImagePath(img.moonPasha),
      highlights: ["Trail specialists", "Calm explorers", "Nature lovers"]
    },
    {
      name: "Amelie",
      title: "Owner & Guide",
      story:
        "Amelie created Pasio Life as a place for dreamers. She believes horses live naturally—and people should feel that same freedom.",
      imageSrc: publicImagePath(img.amelie),
      highlights: ["Heart-led coaching", "Welfare first", "Adventure with meaning"]
    },
    {
      name: "Buffy",
      title: "The Dream Dog",
      story:
        "Buffy is the playful guardian of good energy. If you’re nervous, she finds you. If you’re happy, she celebrates louder.",
      imageSrc: publicImagePath(img.buffy),
      highlights: ["Friendly welcome", "Gentle humor", "Warm company"]
    }
  ];

  return (
    <div className="py-14">
      <Container>
        <Reveal delayMs={60}>
          <SectionHeading
            eyebrow="Meet the Family"
            title="Real characters. Real connection."
            subtitle="You’re not booking a service—you’re stepping into relationships. Horses, people, and the small magic of trust."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p, idx) => (
            <Reveal key={p.name} delayMs={idx * 70}>
              <ProfileCard
                name={p.name}
                title={p.title}
                story={p.story}
                imageSrc={p.imageSrc}
                highlights={p.highlights}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
