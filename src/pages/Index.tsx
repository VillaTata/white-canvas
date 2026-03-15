import BirdSketch from "@/components/BirdSketch";
import villaLogo from "@/assets/villa-tata-logo.jpeg";

const Index = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <BirdSketch />
      <div className="relative z-10 text-center max-w-2xl px-6 flex flex-col items-center">
        <img src={villaLogo} alt="Villa Tata - Finca Ecoturística" className="w-64 mb-6 rounded-lg shadow-lg" />
        <h1 className="text-5xl font-semibold tracking-tight text-foreground mb-4">
          Villa Tata
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Finca ecoturística
        </p>
      </div>
    </div>
  );
};

export default Index;
