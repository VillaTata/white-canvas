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
  targetVy: number;
  turnTimer: number;
  gliding: boolean;
  glideTimer: number;
}

const BirdSketch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const birds: Bird[] = [];
      const NUM_BIRDS = 18;
      const TRAIL_LENGTH = 25;

      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current!.offsetWidth,
          containerRef.current!.offsetHeight
        );
        canvas.style("display", "block");

        for (let i = 0; i < NUM_BIRDS; i++) {
          const x = p.random(p.width);
          const y = p.random(p.height * 0.5);
          birds.push({
            x, y,
            vx: p.random(1.0, 2.2) * (p.random() > 0.5 ? 1 : -1),
            vy: p.random(-0.3, 0.3),
            size: p.random(5, 11),
            wingPhase: p.random(p.TWO_PI),
            wingSpeed: p.random(0.08, 0.15),
            trail: Array.from({ length: TRAIL_LENGTH }, () => ({ x, y })),
            targetVy: 0,
            turnTimer: p.random(60, 200),
            gliding: false,
            glideTimer: p.random(30, 120),
          });
        }
      };

      const drawBird = (bird: Bird, angle: number, wing: number) => {
        const s = bird.size;

        p.push();
        p.translate(bird.x, bird.y);
        p.rotate(angle);

        // Wing curve amount
        const wingUp = wing * s * 0.9;

        // Body - subtle tapered shape
        p.noStroke();
        p.fill(30, 30, 35, 160);
        p.beginShape();
        p.vertex(s * 1.2, 0);       // beak tip
        p.vertex(s * 0.3, -s * 0.12);
        p.vertex(-s * 0.6, 0);      // tail
        p.vertex(s * 0.3, s * 0.12);
        p.endShape(p.CLOSE);

        // Tail fork
        p.stroke(30, 30, 35, 130);
        p.strokeWeight(1.2);
        p.line(-s * 0.6, 0, -s * 1.1, -s * 0.2);
        p.line(-s * 0.6, 0, -s * 1.1, s * 0.2);

        // Wings - smooth curved arcs
        p.noFill();
        p.strokeWeight(1.8);
        p.stroke(30, 30, 35, 150);

        // Left wing
        p.beginShape();
        p.curveVertex(s * 0.4, 0);
        p.curveVertex(s * 0.2, -s * 0.08);
        p.curveVertex(s * 0.1, -s * 0.6 - wingUp);
        p.curveVertex(-s * 0.8, -s * 0.3 - wingUp * 0.7);
        p.curveVertex(-s * 1.0, -s * 0.1 - wingUp * 0.3);
        p.endShape();
        // Wing tip feather
        p.strokeWeight(1.0);
        p.line(-s * 0.8, -s * 0.3 - wingUp * 0.7, -s * 1.1, -s * 0.15 - wingUp * 0.4);

        // Right wing
        p.strokeWeight(1.8);
        p.beginShape();
        p.curveVertex(s * 0.4, 0);
        p.curveVertex(s * 0.2, s * 0.08);
        p.curveVertex(s * 0.1, s * 0.6 + wingUp);
        p.curveVertex(-s * 0.8, s * 0.3 + wingUp * 0.7);
        p.curveVertex(-s * 1.0, s * 0.1 + wingUp * 0.3);
        p.endShape();
        // Wing tip feather
        p.strokeWeight(1.0);
        p.line(-s * 0.8, s * 0.3 + wingUp * 0.7, -s * 1.1, s * 0.15 + wingUp * 0.4);

        p.pop();
      };

      p.draw = () => {
        p.clear();

        for (const bird of birds) {
          // Organic movement - occasional direction changes
          bird.turnTimer--;
          if (bird.turnTimer <= 0) {
            bird.targetVy = p.random(-0.5, 0.5);
            bird.turnTimer = p.random(80, 250);
            // Occasionally toggle gliding
            if (p.random() > 0.6) {
              bird.gliding = !bird.gliding;
              bird.glideTimer = p.random(40, 100);
            }
          }

          bird.glideTimer--;
          if (bird.glideTimer <= 0) {
            bird.gliding = false;
          }

          // Smooth steering
          bird.vy += (bird.targetVy - bird.vy) * 0.02;

          // Gentle bobbing
          const bob = p.sin(p.frameCount * 0.015 + bird.wingPhase) * 0.08;

          bird.x += bird.vx;
          bird.y += bird.vy + bob;

          // Wrap & bounds
          if (bird.x > p.width + 30) bird.x = -30;
          if (bird.x < -30) bird.x = p.width + 30;
          if (bird.y > p.height * 0.65) bird.targetVy = -Math.abs(bird.targetVy) - 0.2;
          if (bird.y < 30) bird.targetVy = Math.abs(bird.targetVy) + 0.2;

          // Trail
          bird.trail.push({ x: bird.x, y: bird.y });
          if (bird.trail.length > TRAIL_LENGTH) bird.trail.shift();

          // Draw trail - fading dotted line
          for (let i = 1; i < bird.trail.length; i++) {
            const t = i / bird.trail.length;
            const alpha = t * 35;
            p.stroke(50, 50, 55, alpha);
            p.strokeWeight(t * 1.2);
            p.line(bird.trail[i - 1].x, bird.trail[i - 1].y, bird.trail[i].x, bird.trail[i].y);
          }

          // Flight angle
          const angle = p.atan2(bird.vy + bob, bird.vx);

          // Wing flap - slower when gliding
          const flapSpeed = bird.gliding ? bird.wingSpeed * 0.15 : bird.wingSpeed;
          const wingRaw = p.sin(p.frameCount * flapSpeed + bird.wingPhase);
          const wing = bird.gliding ? 0.3 + wingRaw * 0.1 : wingRaw;

          drawBird(bird, angle, wing);
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
