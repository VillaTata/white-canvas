import villaLogo from "@/assets/villa-tata-logo.jpeg";

const HeroSection = () => (
  <section
    id="top"
    className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6"
  >
    <img
      src={villaLogo}
      alt="Villa Tata - Finca Ecoturística"
      className="w-64 mb-6 rounded-lg shadow-lg"
    />
  </section>
);

export default HeroSection;
