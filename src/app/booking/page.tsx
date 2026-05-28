"use client"; // <-- this is required if using React hooks like useState

import { useState } from "react";

export default function BookingPage() { // <-- must be default export
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Booking request submitted! I will confirm availability soon.");
  };

  return (
    <main className="min-h-screen bg-white text-black px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Book Your Pasio Life Experience</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto grid gap-6 bg-[#f9f9f9] p-8 rounded-2xl shadow-md"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg"
        />
        <textarea
          name="message"
          placeholder="Any special requests or notes"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="p-3 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-[#C8A2C8] text-black px-6 py-3 rounded-full font-semibold hover:opacity-80 transition"
        >
          Request Booking
        </button>
      </form>
    </main>
  );
}