import { useState, useRef, useEffect, useCallback } from "react";

export interface GalleryImage {
  thumbnail: string;
  full: string;
}

const galleryFilenameCollator = new Intl.Collator("es", {
  numeric: true,
  sensitivity: "base",
});

const zonasComunesThumbnails = import.meta.glob<string>(
  "@/assets/galeria-optimizada/zonas comunes/*-640.webp",
  { eager: true, import: "default" }
);
const zonasComunesFullImages = import.meta.glob<string>(
  "@/assets/galeria-optimizada/zonas comunes/*-1600.webp",
  { eager: true, import: "default" }
);
const paisajesAnimalesThumbnails = import.meta.glob<string>(
  "@/assets/galeria-optimizada/paisajes y animales/*-640.webp",
  { eager: true, import: "default" }
);
const paisajesAnimalesFullImages = import.meta.glob<string>(
  "@/assets/galeria-optimizada/paisajes y animales/*-1600.webp",
  { eager: true, import: "default" }
);
const cabanaThumbnails = import.meta.glob<string>(
  "@/assets/galeria-optimizada/cabana/*-640.webp",
  { eager: true, import: "default" }
);
const cabanaFullImages = import.meta.glob<string>(
  "@/assets/galeria-optimizada/cabana/*-1600.webp",
  { eager: true, import: "default" }
);
const apartaestudioThumbnails = import.meta.glob<string>(
  "@/assets/galeria-optimizada/apartaestudio/*-640.webp",
  { eager: true, import: "default" }
);
const apartaestudioFullImages = import.meta.glob<string>(
  "@/assets/galeria-optimizada/apartaestudio/*-1600.webp",
  { eager: true, import: "default" }
);

function createGallery(
  thumbnails: Record<string, string>,
  fullImages: Record<string, string>
): GalleryImage[] {
  return Object.entries(thumbnails)
    .sort(([firstPath], [secondPath]) =>
      galleryFilenameCollator.compare(firstPath, secondPath)
    )
    .map(([thumbnailPath, thumbnail]) => {
      const fullPath = thumbnailPath.replace("-640.webp", "-1600.webp");
      const full = fullImages[fullPath];
      if (!full) throw new Error(`Missing full-size gallery image for ${thumbnailPath}`);
      return { thumbnail, full };
    });
}

const galleries = {
  zonas: createGallery(zonasComunesThumbnails, zonasComunesFullImages),
  paisajes: createGallery(paisajesAnimalesThumbnails, paisajesAnimalesFullImages),
  cabana: createGallery(cabanaThumbnails, cabanaFullImages),
  apartaestudio: createGallery(apartaestudioThumbnails, apartaestudioFullImages),
};

export type GalleryTab = "zonas" | "paisajes" | "cabana" | "apartaestudio";

export function useGallery() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("zonas");
  const [animateGallery, setAnimateGallery] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeGallery, setActiveGallery] = useState<GalleryImage[]>([]);
  const touchStartX = useRef<number | null>(null);

  const currentGallery = galleries[activeTab];

  const changeTab = useCallback((tab: GalleryTab) => {
    setAnimateGallery(false);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimateGallery(true);
    }, 200);
  }, []);

  const openImage = useCallback((gallery: GalleryImage[], index: number) => {
    setActiveGallery(gallery);
    setSelectedIndex(index);
  }, []);

  const closeModal = useCallback(() => setSelectedIndex(null), []);

  const nextImage = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % activeGallery.length);
  }, [selectedIndex, activeGallery.length]);

  const prevImage = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (selectedIndex - 1 + activeGallery.length) % activeGallery.length
    );
  }, [selectedIndex, activeGallery.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, nextImage, prevImage, closeModal]);

  // Touch/swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextImage();
    if (diff < -50) prevImage();
    touchStartX.current = null;
  };

  return {
    activeTab,
    animateGallery,
    currentGallery,
    selectedIndex,
    activeGallery,
    changeTab,
    openImage,
    closeModal,
    nextImage,
    prevImage,
    handleTouchStart,
    handleTouchEnd,
  };
}
