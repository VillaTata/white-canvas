import { useState, useRef, useEffect, useCallback } from "react";

const zonasComunesImages = import.meta.glob(
  "@/assets/galeria/zonas-comunes/*.{jpg,jpeg,png,JPG,JPEG,PNG}",
  { eager: true, import: "default" }
);
const cabanaImages = import.meta.glob(
  "@/assets/galeria/cabana/*.{jpg,jpeg,png,JPG,JPEG,PNG}",
  { eager: true, import: "default" }
);
const apartaestudioImages = import.meta.glob(
  "@/assets/galeria/apartaestudio/*.{jpg,jpeg,png,JPG,JPEG,PNG}",
  { eager: true, import: "default" }
);

const galleries = {
  zonas: Object.values(zonasComunesImages).sort() as string[],
  cabana: Object.values(cabanaImages).sort() as string[],
  apartaestudio: Object.values(apartaestudioImages).sort() as string[],
};

export type GalleryTab = "zonas" | "cabana" | "apartaestudio";

export function useGallery() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("zonas");
  const [animateGallery, setAnimateGallery] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeGallery, setActiveGallery] = useState<string[]>([]);
  const touchStartX = useRef<number | null>(null);

  const currentGallery = galleries[activeTab];

  const changeTab = useCallback((tab: GalleryTab) => {
    setAnimateGallery(false);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimateGallery(true);
    }, 200);
  }, []);

  const openImage = useCallback((gallery: string[], index: number) => {
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
      if (e.key === "Escape") closeModal();
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
