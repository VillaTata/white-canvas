import { useRef } from "react";
import type { GalleryImage, GalleryTab } from "@/hooks/useGallery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GaleriaSectionProps {
  activeTab: GalleryTab;
  animateGallery: boolean;
  currentGallery: GalleryImage[];
  selectedIndex: number | null;
  activeGallery: GalleryImage[];
  changeTab: (tab: GalleryTab) => void;
  openImage: (gallery: GalleryImage[], index: number) => void;
  closeModal: () => void;
  nextImage: () => void;
  prevImage: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}

const tabs: { key: GalleryTab; label: string }[] = [
  { key: "zonas", label: "Zonas comunes" },
  { key: "paisajes", label: "Paisajes y animales" },
  { key: "cabana", label: "Cabaña" },
  { key: "apartaestudio", label: "Apartaestudio" },
];

const getTabLabel = (key: GalleryTab) =>
  tabs.find((tab) => tab.key === key)?.label ?? "Galería";

const GaleriaSection = ({
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
}: GaleriaSectionProps) => {
  const activeTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      open={selectedIndex !== null}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <section
        id="galeria"
        className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-20 py-20 bg-black/70 text-white"
      >
        <h2 className="landing-h2 mb-14">
          Galería
          <span className="landing-h2-accent" />
        </h2>

        <div className="flex justify-center gap-4 mb-14 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => changeTab(tab.key)}
              aria-pressed={activeTab === tab.key}
              className={`px-6 py-2 rounded-full transition ${
                activeTab === tab.key
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className={`
            flex flex-wrap justify-center items-center gap-6 max-w-6xl mx-auto w-full
            transition-all duration-500
            ${animateGallery ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          {currentGallery.map((img, index) => (
            <DialogTrigger asChild key={index}>
              <button
                type="button"
                aria-label={`Ampliar foto ${index + 1} de ${getTabLabel(activeTab)}`}
                className="relative h-64 w-full flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border-0 p-0 text-left shadow-lg group sm:w-72 md:w-80"
                onClick={(event) => {
                  activeTriggerRef.current = event.currentTarget;
                  openImage(currentGallery, index);
                }}
              >
                <img
                  src={img.thumbnail}
                  srcSet={`${img.thumbnail} 640w, ${img.full} 1600w`}
                  sizes="(min-width: 768px) 320px, 100vw"
                  alt={`${getTabLabel(activeTab)} de Finca Villa Tata, foto ${index + 1}`}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </button>
            </DialogTrigger>
          ))}
        </div>
      </section>

      <DialogContent
        className="max-w-[95vw] border-white/20 bg-black/95 p-4 text-white sm:rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          activeTriggerRef.current?.focus();
        }}
      >
        {selectedIndex !== null && (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>
                {getTabLabel(activeTab)}: foto {selectedIndex + 1}
              </DialogTitle>
              <DialogDescription>
                Usa las flechas izquierda y derecha para cambiar de foto. Pulsa
                Escape para cerrar.
              </DialogDescription>
            </DialogHeader>
            <div className="flex h-[85vh] items-center justify-center">
              <button
                type="button"
                onClick={prevImage}
                aria-label="Imagen anterior"
                className="absolute left-6 z-10 text-5xl text-white"
              >
                ‹
              </button>
              <img
                src={activeGallery[selectedIndex].full}
                alt={`${getTabLabel(activeTab)} de Finca Villa Tata, foto ${selectedIndex + 1}`}
                draggable={false}
                className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
              />
              <button
                type="button"
                onClick={nextImage}
                aria-label="Imagen siguiente"
                className="absolute right-6 z-10 text-5xl text-white"
              >
                ›
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GaleriaSection;
