import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GaleriaSection from "@/components/landing/GaleriaSection";
import { useGallery } from "@/hooks/useGallery";

const GalleryHarness = () => <GaleriaSection {...useGallery()} />;

describe("gallery accessibility", () => {
  it("labels the gallery images and exposes the active category", async () => {
    render(<GalleryHarness />);

    expect(
      screen.getByRole("button", { name: "Zonas comunes" })
    ).toHaveAttribute("aria-pressed", "true");
    const firstPhoto = screen.getByRole("img", {
      name: "Zonas comunes de Finca Villa Tata, foto 1",
    });
    expect(firstPhoto).toBeInTheDocument();
    expect(firstPhoto).toHaveAttribute("draggable", "false");

    fireEvent.click(screen.getByRole("button", { name: "Paisajes y animales" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Paisajes y animales" })
      ).toHaveAttribute("aria-pressed", "true")
    );
    expect(
      screen.getByRole("img", {
        name: "Paisajes y animales de Finca Villa Tata, foto 1",
      })
    ).toBeInTheDocument();
  });

  it("sorts gallery filenames in natural numeric order", async () => {
    render(<GalleryHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Apartaestudio" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Apartaestudio" })
      ).toHaveAttribute("aria-pressed", "true")
    );

    const filenames = screen.getAllByRole("img").map((image) => {
      const src = image.getAttribute("src");
      if (!src) throw new Error("Gallery thumbnail is missing its source");

      const pathname = new URL(src, window.location.href).pathname;
      return decodeURIComponent(pathname.slice(pathname.lastIndexOf("/") + 1));
    });

    expect(filenames).toEqual([
      "1 (2)-640.webp",
      "1 (6)-640.webp",
      "1 (7)-640.webp",
      "1 (8)-640.webp",
      "1 (13)-640.webp",
      "1000052772-640.webp",
    ]);
  });

  it("includes the newly added landscape and common-area photos", async () => {
    render(<GalleryHarness />);

    for (const [category, expectedFilenames] of [
      [
        "Paisajes y animales",
        [
          "1000076594-640.webp",
          "1000076595-640.webp",
          "1000076615-640.webp",
        ],
      ],
      [
        "Zonas comunes",
        [
          "1000001521-640.webp",
          "1000002153-640.webp",
          "1000076590-640.webp",
          "1000076591-640.webp",
          "1000076593-640.webp",
          "1000076614-640.webp",
          "1000076578-640.webp",
        ],
      ],
    ] as const) {
      fireEvent.click(screen.getByRole("button", { name: category }));

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: category })
        ).toHaveAttribute("aria-pressed", "true")
      );

      const filenames = screen.getAllByRole("img").map((image) => {
        const src = image.getAttribute("src");
        if (!src) throw new Error("Gallery thumbnail is missing its source");

        const pathname = new URL(src, window.location.href).pathname;
        return decodeURIComponent(pathname.slice(pathname.lastIndexOf("/") + 1));
      });

      for (const filename of expectedFilenames) {
        expect(filenames).toContain(filename);
      }
    }
  });

  it("opens an accessible lightbox and returns focus to its trigger on Escape", async () => {
    render(<GalleryHarness />);

    const trigger = screen.getByRole("button", {
      name: "Ampliar foto 1 de Zonas comunes",
    });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: "Zonas comunes: foto 1" })
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(
      within(dialog).getByRole("img", {
        name: "Zonas comunes de Finca Villa Tata, foto 2",
      })
    ).toHaveAttribute("draggable", "false");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
