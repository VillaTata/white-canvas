interface HeroSectionProps {
  textVisible: boolean;
}

const HeroSection = ({ textVisible }: HeroSectionProps) => (
  <section
    id="top"
    className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6"
  >
    <h1
      className={`text-5xl md:text-7xl font-bold text-white drop-shadow-lg transition-all duration-1000 ${
        textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}
    >
      Finca Villa Tata
    </h1>
    <h2
      className={`mt-4 max-w-2xl text-lg md:text-2xl text-white/90 font-light transition-all duration-1000 delay-300 ${
        textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
    >
      Un espacio para disfrutar en familia del campo, los animales y la naturaleza.
    </h2>
  </section>
);

export default HeroSection;
