import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const apiKey = process.env.STAYAPI_API_KEY;
const listingId = process.env.AIRBNB_LISTING_ID;

if (!apiKey) {
  throw new Error("Missing required environment variable: STAYAPI_API_KEY");
}

if (!listingId || !/^\d+$/.test(listingId)) {
  throw new Error("AIRBNB_LISTING_ID must be a numeric Airbnb listing ID");
}

const url = new URL(
  `https://api.stayapi.com/v1/airbnb/listing/reviews/${encodeURIComponent(listingId)}`,
);
url.searchParams.set("limit", "12");
url.searchParams.set("sort_by", "MOST_RECENT");

const response = await fetch(url, {
  headers: {
    "x-api-key": apiKey,
    Accept: "application/json",
  },
  signal: AbortSignal.timeout(30_000),
});

if (!response.ok) {
  throw new Error(`StayAPI returned HTTP ${response.status} ${response.statusText}`);
}

const payload = await response.json();
if (payload.success !== true || !Array.isArray(payload.reviews)) {
  throw new Error("StayAPI returned an invalid reviews response");
}

const reviews = payload.reviews
  .filter(
    (review) =>
      typeof review.text === "string" &&
      review.text.trim().length > 0 &&
      Number.isInteger(review.rating) &&
      review.rating >= 1 &&
      review.rating <= 5,
  )
  .map((review) => ({
    id: String(review.id),
    rating: review.rating,
    text: review.text,
    reviewerName:
      typeof review.reviewer?.name === "string" && review.reviewer.name.trim()
        ? review.reviewer.name
        : "Huésped de Airbnb",
    date:
      typeof review.localized_date === "string"
        ? review.localized_date
        : typeof review.created_at === "string"
          ? review.created_at
          : null,
  }));

await writeFile(
  resolve("public/reviews.json"),
  `${JSON.stringify({ reviews }, null, 2)}\n`,
);

console.log(`Generated public/reviews.json with ${reviews.length} reviews`);
