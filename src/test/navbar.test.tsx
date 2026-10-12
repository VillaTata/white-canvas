import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Navbar from "@/components/landing/Navbar";

describe("navigation bar", () => {
  it("offers all sections in the accessible mobile menu", () => {
    render(<Navbar visible />);

    const menuButton = screen.getByRole("button", { name: "Abrir menú" });
    fireEvent.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    const mobileMenu = document.getElementById("mobile-navigation");
    if (!mobileMenu) throw new Error("Mobile navigation was not found");

    for (const [href, label] of [
      ["#finca", "La finca"],
      ["#galeria", "Galería"],
      ["#resenas", "Reseñas"],
      ["#reservas", "Reservas"],
      ["#contacto", "Contacto"],
    ]) {
      const link = mobileMenu.querySelector(`a[href="${href}"]`);
      if (!link) throw new Error(`Mobile navigation link ${href} was not found`);
      expect(link).toHaveTextContent(label);
    }

    const contactLink = mobileMenu.querySelector('a[href="#contacto"]');
    if (!contactLink) throw new Error("Contact navigation link was not found");
    fireEvent.click(contactLink);
    expect(screen.getByRole("button", { name: "Abrir menú" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
