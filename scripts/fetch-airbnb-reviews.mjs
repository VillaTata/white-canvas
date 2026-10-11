import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const targetReviewCount = 21;
const apiUrl = "https://api.stayapi.com/v1/airbnb/listing/reviews";

function isReview(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.id === "string" &&
    Number.isInteger(value.rating) &&
    value.rating >= 1 &&
    value.rating <= 5 &&
    typeof value.text === "string" &&
    value.text.trim().length > 0 &&
    typeof value.reviewerName === "string" &&
    value.reviewerName.trim().length > 0 &&
    (typeof value.date === "string" || value.date === null)
  );
}

function isReviewsPayload(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    Number.isInteger(value.totalCount) &&
    value.totalCount >= 0 &&
    Array.isArray(value.reviews) &&
    value.reviews.length > 0 &&
    value.totalCount >= value.reviews.length &&
    value.reviews.every(isReview)
  );
}

async function readCachedReviews(filePath) {
  let contents;
  try {
    contents = await readFile(filePath, "utf8");
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return { payload: null, reason: "the cache file does not exist" };
    }
    throw error;
  }

  let payload;
  try {
    payload = JSON.parse(contents);
  } catch {
    return { payload: null, reason: "the cache file is not valid JSON" };
  }

  if (!isReviewsPayload(payload)) {
    return { payload: null, reason: "the cache file has no usable reviews" };
  }

  return { payload };
}

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
      payload.total_count < 0 ||
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

export async function main({
  apiKey = process.env.STAYAPI_API_KEY,
  listingId = process.env.AIRBNB_LISTING_ID,
  fetchImpl = fetch,
  outputPath = resolve("public/reviews.json"),
  logger = console,
} = {}) {
  let payload;
  let usingCachedReviews = false;

  try {
    const result = await fetchAirbnbReviews({
      apiKey,
      listingId,
      fetchImpl,
    });
    payload = { totalCount: result.totalCount, reviews: result.reviews };
    if (!isReviewsPayload(payload)) {
      throw new Error("StayAPI returned no usable reviews");
    }
  } catch (error) {
    const cached = await readCachedReviews(outputPath);
    if (!cached.payload) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Unable to refresh Airbnb reviews (${reason}); no valid fallback is available at ${outputPath}: ${cached.reason}.`,
        { cause: error }
      );
    }

    payload = cached.payload;
    usingCachedReviews = true;
    const reason = error instanceof Error ? error.message : String(error);
    logger.warn(
      `WARNING: StayAPI update failed (${reason}); using ${payload.reviews.length} cached reviews of ${payload.totalCount}. The cached reviews may be outdated.`
    );
  }

  await writeFile(
    outputPath,
    `${JSON.stringify(payload, null, 2)}\n`,
  );

  logger.log(
    `Generated ${outputPath} with ${payload.reviews.length} of ${payload.totalCount} reviews${usingCachedReviews ? " (cached fallback)" : ""}`
  );
  return { ...payload, source: usingCachedReviews ? "cache" : "api" };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
