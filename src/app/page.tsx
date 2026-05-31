

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      {/* HERO SECTION */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-[#C8A2C8] to-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Live Your Dream
        </h1>
        <p className="max-w-xl text-lg md:text-xl mb-8">
          Welcome to Pasio Life — where you don’t just ride horses,
          you experience a lifestyle, a connection, and a dream.
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-[#C8A2C8] hover:text-black transition">
          Book Your Experience
        </button>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">What is Pasio Life?</h2>
        <p className="text-lg leading-relaxed">
          Pasio Life is more than a place — it’s a way of living. 
          From peaceful trail rides to exciting pony camps and lessons, 
          every moment is designed to connect you with horses, nature, 
          and yourself.
        </p>
      </section>

      {/* EXPERIENCES */}
      <section className="py-20 px-6 bg-[#f9f9f9]">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Experiences
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Horse Riding Trails",
            "Riding Lessons",
            "Clinics",
            "Pony Camps",
            "Parties"
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-3">{item}</h3>
              <p className="mb-4">
                Experience {item.toLowerCase()} in a way that connects you with nature and horses.
              </p>
              <button className="text-[#C8A2C8] font-semibold hover:underline">
                Book Now →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* MEET THE FAMILY */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">Meet the Family</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            "Our Horses",
            "Your Coach",
            "Buffy the Dog"
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 border rounded-2xl hover:bg-[#C8A2C8] hover:text-white transition"
            >
              <h3 className="text-xl font-semibold">{item}</h3>
              <p className="mt-2">
                Get to know the heart behind Pasio Life.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="py-20 px-6 text-center bg-black text-white">
        <h2 className="text-3xl font-semibold mb-6">
          Ready to Live the Experience?
        </h2>
        <p className="mb-6">
          Bookings are based around my NWU university schedule.
          Request your experience and I will confirm availability.
        </p>
        <button className="bg-[#C8A2C8] text-black px-6 py-3 rounded-full hover:opacity-80 transition">
          Request Booking
        </button>
      </section>

    </main>
  );
}