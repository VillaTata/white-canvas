import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
const jsonLdMatch = html.match(
  /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/
);

describe("local SEO metadata", () => {
  it("publishes valid lodging data for the verified location", () => {
    if (!jsonLdMatch) {
      throw new Error("Could not find the lodging JSON-LD in index.html");
    }

    const business = JSON.parse(jsonLdMatch[1]);

    expect(business).toMatchObject({
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      name: "Finca Villa Tata",
      url: "https://www.fincavillatata.com/",
      telephone: "+573213221252",
      address: {
        addressLocality: "Sasaima",
        addressRegion: "Cundinamarca",
        addressCountry: "CO",
      },
      geo: {
        latitude: 4.9180313,
        longitude: -74.4213367,
      },
      petsAllowed: true,
    });
    expect(business.address).not.toHaveProperty("streetAddress");
    expect(business.amenityFeature).toHaveLength(12);
    expect(html).toContain("Finca Villa Tata en Sasaima, Cundinamarca");
    expect(html).toContain("San Bernardo, Sasaima, Cundinamarca");
  });
});
