import { forwardRef } from "react";
import fincaBg from "@/assets/finca.jpeg";

interface FincaSectionProps {
  visible: boolean;
}

const cards = [
  {
    title: "Naturaleza",
    description: "Rodeado de paisajes naturales y aire puro para desconectarte.",
  },
  {
    title: "Alojamiento",
    description: "Cabaña y apartaestudio totalmente equipados.",
  },
  {
    title: "Experiencia",
    description: "Ideal para escapadas, descanso o celebraciones especiales.",
  },
];

const FincaSection = forwardRef<HTMLElement, FincaSectionProps>(
  ({ visible }, ref) => (
    <section
      id="finca"
      ref={ref}
      className={`
        relative z-10 min-h-screen flex items-center
        px-6 md:px-20 bg-cover bg-center
        transition-all duration-1000
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
      `}
      style={{ backgroundImage: `url(${fincaBg})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-6xl mx-auto text-white w-full">
        <h2 className="landing-h2 mb-16">
          La Finca
          <span className="landing-h2-accent" />
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition"
            >
              <h3 className="landing-h3">{card.title}</h3>
              <p className="text-white/80">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
);

FincaSection.displayName = "FincaSection";
export default FincaSection;
