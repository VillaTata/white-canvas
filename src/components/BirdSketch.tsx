import { useEffect, useRef } from "react";
import p5 from "p5";

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  wingPhase: number;
  wingSpeed: number;
}

const BirdSketch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const birds: Bird[] = [];
      const NUM_BIRDS = 18;

      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current!.offsetWidth,
          containerRef.current!.offsetHeight
        );
        canvas.style("display", "block");

        for (let i = 0; i < NUM_BIRDS; i++) {
          birds.push({
            x: p.random(p.width),
            y: p.random(p.height * 0.6),
            vx: p.random(0.4, 1.2) * (p.random() > 0.5 ? 1 : -1),
            vy: p.random(-0.2, 0.2),
            size: p.random(3, 6),
            wingPhase: p.random(p.TWO_PI),
            wingSpeed: p.random(0.06, 0.12),
          });
        }
      };

      p.draw = () => {
        p.clear();

        for (const bird of birds) {
          bird.x += bird.vx;
          bird.y += bird.vy + p.sin(p.frameCount * 0.02 + bird.wingPhase) * 0.15;

          // Wrap around
          if (bird.x > p.width + 20) bird.x = -20;
          if (bird.x < -20) bird.x = p.width + 20;
          if (bird.y > p.height * 0.7) bird.vy = -Math.abs(bird.vy);
          if (bird.y < 20) bird.vy = Math.abs(bird.vy);

          const wing = p.sin(p.frameCount * bird.wingSpeed + bird.wingPhase);
          const wingSpan = bird.size * 2.5;
          const wingLift = wing * bird.size * 1.2;

          p.push();
          p.translate(bird.x, bird.y);
          p.noFill();
          p.stroke(0, 0, 0, 40);
          p.strokeWeight(1.2);

          // Left wing
          p.line(0, 0, -wingSpan * 0.5, -wingLift);
          p.line(-wingSpan * 0.5, -wingLift, -wingSpan, -wingLift * 0.3);

          // Right wing
          p.line(0, 0, wingSpan * 0.5, -wingLift);
          p.line(wingSpan * 0.5, -wingLift, wingSpan, -wingLift * 0.3);

          p.pop();
        }
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(
            containerRef.current.offsetWidth,
            containerRef.current.offsetHeight
          );
        }
      };
    };

    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      p5Ref.current?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default BirdSketch;
