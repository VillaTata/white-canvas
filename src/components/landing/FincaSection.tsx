import { forwardRef } from "react";
import {
  Bird,
  Building2,
  CookingPot,
  Droplets,
  Flame,
  Gamepad2,
  House,
  PawPrint,
  ParkingSquare,
  Target,
  Volleyball,
  Waves,
  Wifi,
} from "lucide-react";
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

const amenities = [
  { label: "Cabaña: hasta 10 personas", icon: House },
  { label: "Apartamento: hasta 3 personas", icon: Building2 },
  { label: "Pet friendly", icon: PawPrint },
  { label: "Piscina", icon: Waves },
  { label: "Zona de juegos", icon: Gamepad2 },
  { label: "Cancha de volleyball", icon: Volleyball },
  { label: "Zona de fogata", icon: Flame },
  { label: "WiFi", icon: Wifi },
  { label: "Río a 5 minutos", icon: Droplets },
  { label: "Zona BBQ", icon: CookingPot },
  { label: "Cancha de tejo", icon: Target },
  { label: "Parqueadero", icon: ParkingSquare },
  { label: "Avistamiento de aves", icon: Bird },
  { label: "Fuente", icon: Waves },
  { label: "Lagos tipo estanque", icon: Droplets },
];

const FincaSection = forwardRef<HTMLElement, FincaSectionProps>(
  ({ visible }, ref) => (
    <section
      id="finca"
      ref={ref}
      className={`
        relative z-10 flex min-h-screen flex-col justify-start
        px-6 py-12 md:px-20 md:py-20 bg-cover bg-center
        transition-opacity duration-1000
        ${visible ? "opacity-100" : "opacity-0"}
      `}
      style={{ backgroundImage: `url(${fincaBg})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-6xl mx-auto text-white w-full">
        <h2 className="landing-h2 mb-16">
          La Finca
          <span className="landing-h2-accent" />
        </h2>

        <div className="mx-auto mb-12 max-w-4xl text-center">
          <p className="mb-4 text-xl leading-relaxed text-white/90 md:text-2xl">
            Desconéctate del ruido de la ciudad y reconecta con lo esencial en
            Villa Tata, un refugio de naturaleza y tranquilidad donde
            practicamos turismo responsable y sostenible.
          </p>
          <p className="mb-8 text-xl leading-relaxed text-white/90 md:text-2xl">
            Aquí vivirás una experiencia auténtica, rodeado de paisajes
            naturales y sabores locales. Disfruta de nuestra gastronomía
            orgánica, preparada con productos cultivados directamente en la
            finca.
          </p>

          <h3 className="mb-4 text-lg font-semibold text-white">
            Contamos con
          </h3>
          <ul className="grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
            {amenities.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4 text-white/90 transition-colors hover:bg-white/20"
              >
                <Icon
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 text-green-300 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6 motion-reduce:transition-none"
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

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
