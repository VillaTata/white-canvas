import BirdSketch from "@/components/BirdSketch";

const Index = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <BirdSketch />
      <div className="relative z-10 text-center max-w-2xl px-6">
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
