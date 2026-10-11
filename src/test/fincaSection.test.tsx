import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FincaSection from "@/components/landing/FincaSection";

describe("finca section", () => {
  it("shows the sustainability introduction and all amenities before the feature cards", () => {
    render(<FincaSection visible />);

    expect(
      screen.getByText(/turismo responsable y sostenible/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/gastronomía orgánica.*cultivados directamente en la finca/i)
    ).toBeInTheDocument();

    const amenities = screen.getByRole("list");
    expect(within(amenities).getAllByRole("listitem")).toHaveLength(12);
    for (const label of [
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
