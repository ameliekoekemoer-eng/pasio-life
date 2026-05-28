import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ProfileCard from "@/components/cards/ProfileCard";

export default function MeetTheFamilyPage() {
  const profiles = [
    {
      name: "Dawn",
      title: "The Gentle Teacher",
      story:
        "Dawn is the horse who makes learning feel safe. She notices everything you’re feeling—then guides you toward calm.",
      imageSrc: "/images/Boas.jpg",
      highlights: ["Quiet confidence", "Slow trust", "Loves head scratches"]
    },
    {
      name: "Río",
      title: "The Trail Whisperer",
      story:
        "Río is brave in the soft way—he moves like a thought through the landscape. His presence teaches patience and rhythm.",
      imageSrc: "/images/johnney%26liani.jpg",
      highlights: ["Steady pace", "Sunset energy", "Partner in freedom"]
    },
    {
      name: "Velvet",
      title: "The Spirit Builder",
      story:
        "Velvet is playful, affectionate, and honest. She shows you how confidence can be built from connection—not control.",
      imageSrc: "/images/Jade.jpg",
      highlights: ["Big heart", "Positive learning", "Kind boundaries"]
    },
    {
      name: "Amelie",
      title: "Owner & Guide",
      story:
        "Amelie created Pasio Life as a place for dreamers. She believes horses live naturally—and people should feel that same freedom in every moment.",
      imageSrc: "/images/ZoeSmile.jpg",
      highlights: ["Heart-led coaching", "Welfare first", "Adventure with meaning"]
    },
    {
      name: "Buffy",
      title: "The Dream Dog",
      story:
        "Buffy is the playful guardian of good energy. If you’re nervous, she finds you. If you’re happy, she celebrates louder.",
      imageSrc: "/images/Buffy%26Johnny.jpg",
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

