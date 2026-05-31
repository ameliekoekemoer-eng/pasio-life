import { Suspense } from "react";
import BookingForm from "./BookingForm";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-black">
      <Suspense
        fallback={
          <div className="mx-auto max-w-3xl text-center text-sm text-black/70">Loading booking form…</div>
        }
      >
        <BookingForm />
      </Suspense>
    </main>
  );
}
