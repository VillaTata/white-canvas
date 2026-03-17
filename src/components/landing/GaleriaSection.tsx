import type { GalleryTab } from "@/hooks/useGallery";

interface GaleriaSectionProps {
  activeTab: GalleryTab;
  animateGallery: boolean;
  currentGallery: string[];
  selectedIndex: number | null;
  activeGallery: string[];
  changeTab: (tab: GalleryTab) => void;
  openImage: (gallery: string[], index: number) => void;
  closeModal: () => void;
  nextImage: () => void;
  prevImage: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}

const tabs: { key: GalleryTab; label: string }[] = [
  { key: "zonas", label: "Zonas comunes" },
  { key: "cabana", label: "Cabaña" },
  { key: "apartaestudio", label: "Apartaestudio" },
];

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
}: GaleriaSectionProps) => (
  <>
    <section
      id="galeria"
      className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-20 py-20 bg-black/70 text-white"
    >
      <h2 className="landing-h2 mb-14">
        Galería
        <span className="landing-h2-accent" />
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-14 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => changeTab(tab.key)}
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

      {/* Grid */}
      <div
        className={`
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
          transition-all duration-500
          ${animateGallery ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        {currentGallery.map((img, index) => (
          <div
            key={index}
            className="relative h-64 overflow-hidden rounded-xl cursor-pointer group shadow-lg"
            onClick={() => openImage(currentGallery, index)}
          >
            <img
              src={img}
              loading="lazy"
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>

    {/* Lightbox Modal */}
    {selectedIndex !== null && (
      <div
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div onClick={closeModal} className="absolute inset-0" />
        <button onClick={prevImage} className="absolute left-6 text-white text-5xl z-50">
          ‹
        </button>
        <img
          src={activeGallery[selectedIndex]}
          className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl z-50"
        />
        <button onClick={nextImage} className="absolute right-6 text-white text-5xl z-50">
          ›
        </button>
      </div>
    )}
  </>
);

export default GaleriaSection;
