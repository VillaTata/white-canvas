import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const targetReviewCount = 21;
const apiUrl = "https://api.stayapi.com/v1/airbnb/listing/reviews";

export async function fetchAirbnbReviews({
  apiKey,
  listingId,
  fetchImpl = fetch,
  limit = targetReviewCount,
}) {
  if (!apiKey) {
    throw new Error("Missing required environment variable: STAYAPI_API_KEY");
  }

  if (!listingId || !/^\d+$/.test(listingId)) {
    throw new Error("AIRBNB_LISTING_ID must be a numeric Airbnb listing ID");
  }

  const allReviews = [];
  const seenReviewIds = new Set();
  let offset = 0;
  let totalCount = 0;
  let hasMore = true;

  while (allReviews.length < limit && hasMore) {
    const url = new URL(
      `${apiUrl}/${encodeURIComponent(listingId)}`,
    );
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("sort_by", "MOST_RECENT");

    const response = await fetchImpl(url, {
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
    if (
      payload.success !== true ||
      !Array.isArray(payload.reviews) ||
      !Number.isInteger(payload.total_count) ||
      typeof payload.has_more !== "boolean"
    ) {
      throw new Error("StayAPI returned an invalid reviews response");
    }

    totalCount = payload.total_count;
    if (payload.reviews.length === 0 && payload.has_more) {
      throw new Error("StayAPI indicated more reviews but returned an empty page");
    }

    for (const review of payload.reviews) {
      const id = String(review.id);
      if (
        seenReviewIds.has(id) ||
        typeof review.text !== "string" ||
        review.text.trim().length === 0 ||
        !Number.isInteger(review.rating) ||
        review.rating < 1 ||
        review.rating > 5
      ) {
        continue;
      }

      seenReviewIds.add(id);
      allReviews.push({
        id,
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
      });
    }

    offset += payload.reviews.length;
    hasMore = payload.has_more;
  }

  return { reviews: allReviews.slice(0, limit), totalCount };
}

async function main() {
  const { reviews, totalCount } = await fetchAirbnbReviews({
    apiKey: process.env.STAYAPI_API_KEY,
    listingId: process.env.AIRBNB_LISTING_ID,
  });

  await writeFile(
    resolve("public/reviews.json"),
    `${JSON.stringify({ totalCount, reviews }, null, 2)}\n`,
  );

  console.log(`Generated public/reviews.json with ${reviews.length} of ${totalCount} reviews`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
