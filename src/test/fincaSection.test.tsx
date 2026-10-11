import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FincaSection from "@/components/landing/FincaSection";

describe("finca section", () => {
  it("shows the sustainability introduction and all amenities before the feature cards", () => {
    render(<FincaSection visible />);

    const firstParagraph = screen.getByText(/turismo responsable y sostenible/i);
    const secondParagraph = screen.getByText(
      /gastronomía orgánica.*cultivados directamente en la finca/i
    );
    expect(firstParagraph).toHaveClass("text-xl", "md:text-2xl");
    expect(secondParagraph).toHaveClass("text-xl", "md:text-2xl");

    const amenities = screen.getByRole("list");
    const items = within(amenities).getAllByRole("listitem");
    expect(items).toHaveLength(15);
    expect(items.slice(0, 3).map((item) => item.textContent)).toEqual([
      "Cabaña: hasta 10 personas",
      "Apartamento: hasta 3 personas",
      "Pet friendly",
    ]);
    for (const label of [
      "Cabaña: hasta 10 personas",
      "Apartamento: hasta 3 personas",
      "Pet friendly",
      "Piscina",
      "Zona de juegos",
      "Cancha de volleyball",
      "Zona de fogata",
      "WiFi",
      "Río a 5 minutos",
      "Zona BBQ",
      "Cancha de tejo",
      "Parqueadero",
      "Avistamiento de aves",
      "Fuente",
      "Lagos tipo estanque",
    ]) {
      expect(within(amenities).getByText(label)).toBeInTheDocument();
    }

    const section = screen.getByRole("heading", { name: "La Finca" }).parentElement
      ?.parentElement;
    if (!section) throw new Error("Finca section root was not found");

    const introduction = within(section).getByText(/turismo responsable y sostenible/i);
    const firstCard = within(section).getByRole("heading", {
      name: "Naturaleza",
    });
    expect(
      introduction.compareDocumentPosition(firstCard) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("keeps responsive vertical spacing without adding extra anchor offset", () => {
    render(<FincaSection visible />);

    const section = screen.getByRole("heading", { name: "La Finca" })
      .parentElement?.parentElement;

    expect(section).toHaveClass("py-12", "md:py-20");
    expect(section).not.toHaveClass("scroll-mt-[-24px]");
    expect(section).not.toHaveClass("translate-y-16", "translate-y-0");
  });

  it("animates only decorative amenity icons on hover", () => {
    render(<FincaSection visible />);

    const pool = screen.getByText("Piscina").parentElement;
    expect(pool).toHaveClass("group");
    expect(pool?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(pool?.querySelector("svg")).toHaveClass(
      "group-hover:-translate-y-1",
      "group-hover:rotate-6"
    );
  });
});
