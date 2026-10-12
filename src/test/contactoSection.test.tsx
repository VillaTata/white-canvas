import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactoSection from "@/components/landing/ContactoSection";

describe("contact section", () => {
  it("shows the confirmed location and map link without inventing a street address", () => {
    render(<ContactoSection />);

    const section = screen.getByRole("region", {
      name: "Contacto y ubicación",
    });
    expect(section).toHaveClass("min-h-screen", "justify-center");
    expect(
      within(section).getByText(
        "Visítanos en San Bernardo, Sasaima, Cundinamarca, Colombia."
      )
    ).toBeInTheDocument();

    const mapLink = within(section).getByRole("link", {
      name: "Ver ubicación en Google Maps",
    });
    expect(mapLink).toHaveAttribute(
      "href",
      "https://www.google.com/maps/search/?api=1&query=4.9180313%2C-74.4213367"
    );
    expect(mapLink).toHaveAttribute("target", "_blank");
    expect(mapLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(within(section).queryByText(/calle|carrera|vereda/i)).not.toBeInTheDocument();
  });

  it("provides a direct WhatsApp contact with the published number", () => {
    render(<ContactoSection />);

    const contactLink = screen.getByRole("link", {
      name: "Escríbenos por WhatsApp",
    });
    expect(contactLink).toHaveAttribute("href", "https://wa.me/573213221252");
    expect(contactLink).toHaveAttribute("target", "_blank");
    expect(screen.getByText("+57 321 322 1252")).toBeInTheDocument();
  });

  it("shows the social links below the location and contact cards", () => {
    render(<ContactoSection />);

    const section = screen.getByRole("region", {
      name: "Contacto y ubicación",
    });
    const socialLinks = [
      {
        name: "Facebook: Finca Villa Tata",
        href: "https://www.facebook.com/Fincavillatata",
      },
      {
        name: "Instagram: @villatata8",
        href: "https://www.instagram.com/villatata8/",
      },
    ];
    const socialHeading = within(section).getByRole("heading", {
      name: "Síguenos en redes sociales",
    });
    const cards = within(section).getAllByRole("article");

    expect(
      cards.every(
        (card) =>
          card.compareDocumentPosition(socialHeading) &
          Node.DOCUMENT_POSITION_FOLLOWING
      )
    ).toBe(true);

    for (const { name, href } of socialLinks) {
      const link = within(section).getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
  });
});
