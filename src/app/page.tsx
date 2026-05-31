import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { publicImagePath, siteImages } from "@/lib/images";

const homeExperiences = [
  {
    title: "Horse Riding Trails",
    description: "Ride through nature at your own rhythm.",
    image: siteImages.home.trails,
    href: "/experiences"
  },
  {
    title: "Riding Lessons",
    description: "Build connection first—then skills that last.",
    image: siteImages.home.lessons,
    href: "/booking?topic=Riding%20Lessons&experience=Lessons"
  },
  {
    title: "Pony Camps",
    description: "Dream days where young hearts learn calm courage.",
    image: siteImages.home.camps,
    href: "/booking?topic=Pony%20Camps&experience=Pony%20Camp"
  }
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <Image
          src={publicImagePath(siteImages.hero)}
          alt="Trail ride at Pasio Life"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#C8A2C8]/80 via-[#C8A2C8]/50 to-white/95" />
        <div className="relative z-10 max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold md:text-7xl">Live Your Dream</h1>
          <p className="mb-8 text-lg md:text-xl">
            Welcome to Pasio Life — where you don’t just ride horses, you experience a lifestyle, a
            connection, and a dream.
          </p>
          <ButtonLink href="/booking" variant="primary" className="!bg-black !text-white hover:!bg-[#C8A2C8] hover:!text-black">
            Book Your Experience
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="mb-6 text-3xl font-semibold">What is Pasio Life?</h2>
        <p className="text-lg leading-relaxed">
          Pasio Life is more than a place — it’s a way of living. From peaceful trail rides to
          exciting pony camps and lessons, every moment is designed to connect you with horses,
          nature, and yourself.
        </p>
        <div className="mt-8">
          <Link href="/gallery" className="font-semibold text-[#9d5cff] hover:underline">
            View our gallery →
          </Link>
        </div>
      </section>

      <section className="bg-[#f9f9f9] px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-semibold">Experiences</h2>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {homeExperiences.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-lg"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={publicImagePath(item.image)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                <p className="mb-4">{item.description}</p>
                <span className="font-semibold text-[#C8A2C8] group-hover:underline">Book Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="mb-12 text-3xl font-semibold">Meet the Family</h2>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {[
            { label: "Our Horses", image: siteImages.home.family[0], href: "/meet-the-family" },
            { label: "Your Guide", image: siteImages.home.family[1], href: "/meet-the-family" },
            { label: "Buffy the Dog", image: siteImages.home.family[2], href: "/meet-the-family" }
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group overflow-hidden rounded-2xl border transition hover:bg-[#C8A2C8] hover:text-white"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={publicImagePath(item.image)}
                  alt={item.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{item.label}</h3>
                <p className="mt-2">Get to know the heart behind Pasio Life.</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-black px-6 py-20 text-center text-white">
        <h2 className="mb-6 text-3xl font-semibold">Ready to Live the Experience?</h2>
        <p className="mb-6">
          Bookings are based around my NWU university schedule. Request your experience and I will
          confirm availability.
        </p>
        <ButtonLink href="/booking" variant="primary">
          Request Booking
        </ButtonLink>
      </section>
    </main>
  );
}
