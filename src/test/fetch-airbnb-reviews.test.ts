import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  fetchAirbnbReviews,
  main,
} from "../../scripts/fetch-airbnb-reviews.mjs";

if (typeof AbortSignal.timeout !== "function") {
  Object.defineProperty(AbortSignal, "timeout", {
    configurable: true,
    value: () => new AbortController().signal,
  });
}

const cachedPayload = {
  totalCount: 1,
  reviews: [
    {
      id: "cached-review",
      rating: 5,
      text: "Una reseña guardada.",
      reviewerName: "Huésped",
      date: null,
    },
  ],
};

describe("Airbnb review build fallback", () => {
  let temporaryDirectory: string;
  let outputPath: string;

  beforeEach(async () => {
    temporaryDirectory = await mkdtemp(
      path.join(tmpdir(), "villa-tata-reviews-")
    );
    outputPath = path.join(temporaryDirectory, "reviews.json");
  });

  afterEach(async () => {
    await rm(temporaryDirectory, { recursive: true, force: true });
  });

  it("uses and reports the last valid cache when StayAPI is unavailable", async () => {
    await writeFile(outputPath, JSON.stringify(cachedPayload));
    const logger = { log: vi.fn(), warn: vi.fn() };

    const result = await main({
      apiKey: "test-key",
      listingId: "123",
      fetchImpl: vi.fn().mockRejectedValue(new Error("network unavailable")),
      outputPath,
      logger,
    });

    expect(result).toMatchObject({ ...cachedPayload, source: "cache" });
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("cached reviews may be outdated")
    );
    expect(JSON.parse(await readFile(outputPath, "utf8"))).toEqual(cachedPayload);
  });

  it("rejects an API failure when no usable fallback exists", async () => {
    await expect(
      main({
        apiKey: "test-key",
        listingId: "123",
        fetchImpl: vi.fn().mockRejectedValue(new Error("network unavailable")),
        outputPath,
        logger: { log: vi.fn(), warn: vi.fn() },
      })
    ).rejects.toThrow(/no valid fallback is available/i);
  });

  it("does not treat an empty placeholder as a valid fallback", async () => {
    await writeFile(outputPath, JSON.stringify({ totalCount: 0, reviews: [] }));

    await expect(
      main({
        apiKey: "test-key",
        listingId: "123",
        fetchImpl: vi.fn().mockRejectedValue(new Error("network unavailable")),
        outputPath,
        logger: { log: vi.fn(), warn: vi.fn() },
      })
    ).rejects.toThrow(/no valid fallback is available/i);
  });

  it("replaces the cache after a successful API request", async () => {
    const freshPayload = {
      success: true,
      total_count: 1,
      has_more: false,
      reviews: [
        {
          id: "fresh-review",
          rating: 4,
          text: "Una reseña reciente.",
          reviewer: { name: "Huésped nuevo" },
          localized_date: "October 2026",
        },
      ],
    };
    const result = await main({
      apiKey: "test-key",
      listingId: "123",
      fetchImpl: vi.fn().mockResolvedValue({
        ok: true,
        json: async () => freshPayload,
      }),
      outputPath,
      logger: { log: vi.fn(), warn: vi.fn() },
    });

    expect(result.source).toBe("api");
    expect(JSON.parse(await readFile(outputPath, "utf8"))).toMatchObject({
      totalCount: 1,
      reviews: [{ id: "fresh-review", rating: 4 }],
    });
  });

  it("collects pages, removes duplicate reviews, and stops at the requested count", async () => {
    const pages = [
      {
        success: true,
        total_count: 4,
        has_more: true,
        reviews: [
          {
            id: "review-1",
            rating: 5,
            text: "Primera reseña.",
            reviewer: { name: "Ana" },
            localized_date: "October 2026",
          },
          {
            id: "review-invalid",
            rating: 5,
            text: "  ",
            reviewer: { name: "Invitado" },
          },
          {
            id: "review-2",
            rating: 4,
            text: "Segunda reseña.",
            reviewer: {},
            created_at: "2026-10-01",
          },
        ],
      },
      {
        success: true,
        total_count: 4,
        has_more: false,
        reviews: [
          {
            id: "review-2",
            rating: 4,
            text: "Segunda reseña repetida.",
            reviewer: { name: "Duplicado" },
          },
          {
            id: "review-3",
            rating: 5,
            text: "Tercera reseña.",
            reviewer: { name: "Luis" },
            localized_date: "September 2026",
          },
        ],
      },
    ];
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => pages[0],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => pages[1],
      });

    const result = await fetchAirbnbReviews({
      apiKey: "test-key",
      listingId: "123",
      fetchImpl,
      limit: 3,
    });

    expect(result).toMatchObject({
      totalCount: 4,
      reviews: [
        { id: "review-1", reviewerName: "Ana", date: "October 2026" },
        {
          id: "review-2",
          reviewerName: "Huésped de Airbnb",
          date: "2026-10-01",
        },
        { id: "review-3", reviewerName: "Luis" },
      ],
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(
      fetchImpl.mock.calls.map(([url]) => new URL(url).searchParams.get("offset"))
    ).toEqual(["0", "3"]);
  });
});
