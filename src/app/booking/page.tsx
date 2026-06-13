import { Suspense } from "react";
import Container from "@/components/ui/Container";
import BookingForm from "./BookingForm";

export default function BookingPage() {
  return (
    <div className="py-14">
      <Container>
        <Suspense
          fallback={
            <div className="text-center text-sm text-ink-900/70">Loading booking form…</div>
          }
        >
          <BookingForm />
        </Suspense>
      </Container>
    </div>
  );
}
