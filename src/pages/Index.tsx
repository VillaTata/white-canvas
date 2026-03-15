import { useEffect, useState, useRef } from "react";
import BirdSketch from "@/components/BirdSketch";
import villaLogo from "@/assets/villa-tata-logo.jpeg";
import background from "@/assets/background.jpeg";
import fincaBg from "@/assets/finca.jpeg";

/* CARGA AUTOMATICA DE IMAGENES */

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

const zonasComunes = Object.values(zonasComunesImages).sort() as string[];
const cabana = Object.values(cabanaImages).sort() as string[];
const apartaestudio = Object.values(apartaestudioImages).sort() as string[];

const Index = () => {

  const [logoTop, setLogoTop] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "zonas" | "cabana" | "apartaestudio"
  >("zonas");

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeGallery, setActiveGallery] = useState<string[]>([]);
  const [animateGallery, setAnimateGallery] = useState(true);

  const [showFinca, setShowFinca] = useState(false);

  const fincaRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  /* LOGO INTRO */

  useEffect(() => {
    const timer = setTimeout(() => setLogoTop(true), 700);
    return () => clearTimeout(timer);
  }, []);

  /* ANIMACION FINCA */

  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            setShowFinca(true);
          }

        });

      },
      { threshold: 0.3 }
    );

    if (fincaRef.current) observer.observe(fincaRef.current);

    return () => observer.disconnect();

  }, []);

  /* CAMBIO TAB */

  const changeTab = (tab: "zonas" | "cabana" | "apartaestudio") => {

    setAnimateGallery(false);

    setTimeout(() => {
      setActiveTab(tab);
      setAnimateGallery(true);
    }, 200);

  };

  const getGallery = () => {

    if (activeTab === "zonas") return zonasComunes;
    if (activeTab === "cabana") return cabana;
    return apartaestudio;

  };

  const currentGallery = getGallery();

  /* NAVEGACION GALERIA */

  const nextImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % activeGallery.length);
  };

  const prevImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (selectedIndex - 1 + activeGallery.length) % activeGallery.length
    );
  };

  /* TECLADO */

  useEffect(() => {

    const handleKey = (e: KeyboardEvent) => {

      if (selectedIndex === null) return;

      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setSelectedIndex(null);

    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);

  }, [selectedIndex]);

  /* SWIPE MOVIL */

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

  return (

    <div className="relative w-full min-h-screen flex flex-col overflow-hidden">

      {/* BACKGROUND */}

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${background})` }}
      />

      <BirdSketch />

      {/* LOGO */}

      <img
        src={villaLogo}
        alt="Villa Tata"
        className={`
        fixed z-50 rounded-lg shadow-lg
        transform-gpu will-change-transform
        transition-all duration-[1800ms] ease-[cubic-bezier(.22,1,.36,1)]
        ${logoTop
          ? "top-4 left-6 w-12"
          : "top-1/2 left-1/2 w-72 -translate-x-1/2 -translate-y-1/2"}
      `}
      />

      {/* NAVBAR */}

      <header
        className={`
        fixed top-0 w-full z-40
        bg-black/40 backdrop-blur-md
        transition-all duration-[1200ms]
        ${logoTop ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
      `}
      >

        <nav className="flex justify-end items-center px-6 md:px-12 py-4 text-white gap-8">

          <a href="#finca" className="hover:text-green-300 transition">
            La finca
          </a>

          <a href="#galeria" className="hover:text-green-300 transition">
            Galería
          </a>

          <a href="#reservas" className="hover:text-green-300 transition">
            Reservas
          </a>

        </nav>

      </header>

      {/* HERO */}

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 text-white">

        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Villa Tata
        </h1>

        <p className="text-lg md:text-xl max-w-xl text-white/90">
          Naturaleza, descanso y una experiencia inolvidable.
        </p>

      </section>

      {/* FINCA */}

      <section
        id="finca"
        ref={fincaRef}
        className={`
        relative z-10
        min-h-screen
        flex items-center
        px-6 md:px-20
        bg-cover bg-center
        transition-all duration-1000
        ${showFinca ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
      `}
        style={{ backgroundImage: `url(${fincaBg})` }}
      >

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-6xl mx-auto text-white">

          <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16">
            La Finca
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition">
              <h3 className="text-xl font-semibold mb-4">Naturaleza</h3>
              <p className="text-white/80">
                Rodeado de paisajes naturales y aire puro para desconectarte.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition">
              <h3 className="text-xl font-semibold mb-4">Alojamiento</h3>
              <p className="text-white/80">
                Cabaña y apartaestudio totalmente equipados.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition">
              <h3 className="text-xl font-semibold mb-4">Experiencia</h3>
              <p className="text-white/80">
                Ideal para escapadas, descanso o celebraciones especiales.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* GALERIA */}

      <section
        id="galeria"
        className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-20 py-20 bg-black/70 text-white"
      >

        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-14">
          Galería
        </h2>

        {/* TABS */}

        <div className="flex justify-center gap-4 mb-14 flex-wrap">

          <button
            onClick={() => changeTab("zonas")}
            className={`px-6 py-2 rounded-full transition ${
              activeTab === "zonas"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Zonas comunes
          </button>

          <button
            onClick={() => changeTab("cabana")}
            className={`px-6 py-2 rounded-full transition ${
              activeTab === "cabana"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Cabaña
          </button>

          <button
            onClick={() => changeTab("apartaestudio")}
            className={`px-6 py-2 rounded-full transition ${
              activeTab === "apartaestudio"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Apartaestudio
          </button>

        </div>

        {/* GRID UNIFORME */}

        <div
          className={`
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-6
          transition-all duration-500
          ${animateGallery
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"}
        `}
        >

          {currentGallery.map((img, index) => (

            <div
              key={index}
              className="
              relative
              h-64
              overflow-hidden
              rounded-xl
              cursor-pointer
              group
              shadow-lg
              "
              onClick={() => {
                setActiveGallery(currentGallery);
                setSelectedIndex(index);
              }}
            >

              <img
                src={img}
                loading="lazy"
                className="
                w-full
                h-full
                object-cover
                transition
                duration-500
                group-hover:scale-110
                "
              />

            </div>

          ))}

        </div>

      </section>

      {/* MODAL */}

      {selectedIndex !== null && (

        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          <div
            onClick={() => setSelectedIndex(null)}
            className="absolute inset-0"
          />

          <button
            onClick={prevImage}
            className="absolute left-6 text-white text-5xl z-50"
          >
            ‹
          </button>

          <img
            src={activeGallery[selectedIndex]}
            className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl z-50"
          />

          <button
            onClick={nextImage}
            className="absolute right-6 text-white text-5xl z-50"
          >
            ›
          </button>

        </div>

      )}

      {/* RESERVAS */}

<section
  id="reservas"
  className="
  relative z-10
  min-h-screen
  flex flex-col items-center justify-center
  px-6
  text-white
  bg-black/80
  "
>

  <div className="max-w-3xl text-center">

    <h2 className="text-3xl md:text-4xl font-semibold mb-6">
      Reserva tu experiencia
    </h2>

    <p className="text-white/80 mb-12">
      Puedes reservar tu estadía en Villa Tata desde cualquiera de nuestras plataformas.
    </p>

    {/* BOTONES RESERVA */}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* WHATSAPP */}

      <a
        href="https://wa.me/573213221252"
        target="_blank"
        className="
        flex flex-col items-center
        bg-green-600
        hover:bg-green-700
        transition
        rounded-xl
        py-6
        shadow-lg
        "
      >

        <span className="text-2xl mb-2">💬</span>

        <span className="font-semibold text-lg">
          WhatsApp
        </span>

        <span className="text-sm text-white/80">
          Reserva directa
        </span>

      </a>

      {/* AIRBNB */}

      <a
        href="https://www.airbnb.com.co/rooms/1335775644190168406?search_mode=regular_search&adults=1&check_in=2026-03-15&check_out=2026-03-20&children=0&infants=0&pets=0&source_impression_id=p3_1773617165_P3zUTmvh246Ns2d0&previous_page_section_name=1000&federated_search_id=2493949c-7c6b-47f6-9f8a-7eab7ca1ffa3"
        target="_blank"
        className="
        flex flex-col items-center
        bg-[#FF385C]
        hover:opacity-90
        transition
        rounded-xl
        py-6
        shadow-lg
        "
      >

        <span className="text-2xl mb-2">🏡</span>

        <span className="font-semibold text-lg">
          Airbnb
        </span>

        <span className="text-sm text-white/90">
          Ver disponibilidad
        </span>

      </a>

      {/* BOOKING */}

      <a
        href="https://www.booking.com/hotel/co/alquiler-de-cabana-completa-granja-autosostenible.es.html?aid=304142&label=gen173rf-10CAEoggI46AdIClgDaDKIAQGYATO4ARfIARXYAQPoAQH4AQGIAgGiAg5sb2NhbGhvc3Q6ODA4MKgCAbgC8f7czQbAAgHSAiQzOGMyZDUyMy1kMjdmLTQxMzQtYjAwYy0yNWQzMTM4Y2VmOWbYAgHgAgE&ucfs=1&arphpl=1"
        target="_blank"
        className="
        flex flex-col items-center
        bg-[#003580]
        hover:bg-[#00224f]
        transition
        rounded-xl
        py-6
        shadow-lg
        "
      >

        <span className="text-2xl mb-2">🛎️</span>

        <span className="font-semibold text-lg">
          Booking
        </span>

        <span className="text-sm text-white/90">
          Reservar en Booking
        </span>

      </a>

    </div>

  </div>

</section>

    </div>

  );

};

export default Index;