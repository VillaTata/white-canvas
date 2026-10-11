import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Review {
  id: string;
  rating: number;
  text: string;
  reviewerName: string;
  date: string | null;
}

type ReviewsStatus = "loading" | "ready" | "error";

const isReview = (value: unknown): value is Review => {
  if (typeof value !== "object" || value === null) return false;

  const review = value as Record<string, unknown>;
  return (
    typeof review.id === "string" &&
    typeof review.rating === "number" &&
    typeof review.text === "string" &&
    typeof review.reviewerName === "string" &&
    (typeof review.date === "string" || review.date === null)
  );
};

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [status, setStatus] = useState<ReviewsStatus>("loading");

  useEffect(() => {
    const controller = new AbortController();

    const loadReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}reviews.json`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Could not load reviews (${response.status})`);
        }

        const payload: unknown = await response.json();
        if (
          typeof payload !== "object" ||
          payload === null ||
          !("reviews" in payload) ||
          !Array.isArray(payload.reviews) ||
          !payload.reviews.every(isReview)
        ) {
          throw new Error("The published reviews file has an invalid format");
        }

        setReviews(payload.reviews);
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Unable to load Airbnb reviews:", error);
        setStatus("error");
      }
    };

    void loadReviews();
    return () => controller.abort();
  }, []);

  return (
    <section id="resenas" className="relative z-10 flex min-h-[70vh] scroll-mt-20 flex-col justify-center bg-black/75 px-6 py-20 text-white md:px-20">
      <div className="mx-auto w-full">
        <h2 className="landing-h2 mb-4">
          Opiniones de nuestros huéspedes
          <span className="landing-h2-accent" />
        </h2>

        {status === "loading" && (
          <p className="py-10 text-center text-white/80" role="status">
            Cargando reseñas...
          </p>
        )}

        {status === "error" && (
          <p className="py-10 text-center text-white/80" role="alert">
            No fue posible cargar las reseñas en este momento.
          </p>
        )}

        {status === "ready" && reviews.length === 0 && (
          <p className="py-10 text-center text-white/80">
            Aún no hay reseñas disponibles.
          </p>
        )}

        {status === "ready" && reviews.length > 0 && (
          <Carousel
            opts={{ align: "start", slidesToScroll: "auto" }}
            className="mx-auto w-full px-10"
          >
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="basis-[min(100%,22rem)] self-start"
                >
                  <article className="flex flex-col rounded-xl border border-white/15 bg-white/10 p-6 shadow-lg backdrop-blur-sm">
                    <div
                      className="mb-4 flex gap-1 text-amber-300"
                      aria-label={`${review.rating} de 5 estrellas`}
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <span key={index} aria-hidden="true">
                          {index < review.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <blockquote className="whitespace-pre-line leading-relaxed text-white/90">
                      “{review.text}”
                    </blockquote>
                    <footer className="mt-6 border-t border-white/15 pt-4">
                      <p className="font-semibold">{review.reviewerName}</p>
                      {review.date && (
                        <p className="mt-1 text-sm text-white/60">{review.date}</p>
                      )}
                    </footer>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              aria-label="Reseña anterior"
              className="left-0 border-white/30 bg-black/30 text-white hover:bg-white/20 hover:text-white"
            />
            <CarouselNext
              aria-label="Siguiente reseña"
              className="right-0 border-white/30 bg-black/30 text-white hover:bg-white/20 hover:text-white"
            />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
