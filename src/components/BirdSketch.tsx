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
  trail: { x: number; y: number }[];
}

const BirdSketch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const birds: Bird[] = [];
      const NUM_BIRDS = 18;
      const TRAIL_LENGTH = 20;

      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current!.offsetWidth,
          containerRef.current!.offsetHeight
        );
        canvas.style("display", "block");

        for (let i = 0; i < NUM_BIRDS; i++) {
          const x = p.random(p.width);
          const y = p.random(p.height * 0.6);
          birds.push({
            x,
            y,
            vx: p.random(0.6, 1.5) * (p.random() > 0.5 ? 1 : -1),
            vy: p.random(-0.3, 0.3),
            size: p.random(6, 14),
            wingPhase: p.random(p.TWO_PI),
            wingSpeed: p.random(0.06, 0.12),
            trail: Array.from({ length: TRAIL_LENGTH }, () => ({ x, y })),
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

          // Update trail
          bird.trail.push({ x: bird.x, y: bird.y });
          if (bird.trail.length > TRAIL_LENGTH) bird.trail.shift();

          // Draw trail
          p.noFill();
          for (let i = 1; i < bird.trail.length; i++) {
            const alpha = (i / bird.trail.length) * 60;
            const weight = (i / bird.trail.length) * 1.5;
            p.stroke(0, 0, 0, alpha);
            p.strokeWeight(weight);
            p.line(bird.trail[i - 1].x, bird.trail[i - 1].y, bird.trail[i].x, bird.trail[i].y);
          }

          // Calculate flight angle
          const angle = p.atan2(bird.vy, bird.vx);

          const wing = p.sin(p.frameCount * bird.wingSpeed + bird.wingPhase);
          const wingSpan = bird.size * 2.5;
          const wingLift = wing * bird.size * 1.2;

          p.push();
          p.translate(bird.x, bird.y);
          p.rotate(angle);
          p.noFill();
          p.stroke(0, 0, 0, 120);
          p.strokeWeight(2);

          // Body line pointing forward
          p.line(-bird.size * 0.5, 0, bird.size * 0.8, 0);

          // Wings perpendicular to flight direction
          // Left wing (up)
          p.line(0, 0, 0, -wingSpan * 0.5 - wingLift * 0.5);
          p.line(0, -wingSpan * 0.5 - wingLift * 0.5, -bird.size * 0.3, -wingSpan * 0.3 - wingLift * 0.2);

          // Right wing (down)
          p.line(0, 0, 0, wingSpan * 0.5 + wingLift * 0.5);
          p.line(0, wingSpan * 0.5 + wingLift * 0.5, -bird.size * 0.3, wingSpan * 0.3 + wingLift * 0.2);

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
