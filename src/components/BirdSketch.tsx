import { useEffect, useRef } from "react";
import p5 from "p5";

interface Butterfly {
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
  color1: { r: number; g: number; b: number };
  color2: { r: number; g: number; b: number };
  wobble: number;
}

const BirdSketch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      const butterflies: Butterfly[] = [];
      const NUM = 18;
      const TRAIL_LENGTH = 20;
      let attractPoint: { x: number; y: number; timer: number } | null = null;

      const palettes = [
        { r: 220, g: 120, b: 50 },   // orange monarch
        { r: 240, g: 200, b: 60 },   // yellow
        { r: 180, g: 80, b: 160 },   // purple
        { r: 60, g: 160, b: 200 },   // blue morpho
        { r: 200, g: 60, b: 80 },    // red
        { r: 100, g: 180, b: 80 },   // green
        { r: 240, g: 140, b: 180 },  // pink
      ];

      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current!.offsetWidth,
          containerRef.current!.offsetHeight
        );
        canvas.style("display", "block");

        for (let i = 0; i < NUM; i++) {
          const x = p.random(p.width);
          const y = p.random(p.height * 0.6);
          const c1 = palettes[Math.floor(p.random(palettes.length))];
          const c2 = palettes[Math.floor(p.random(palettes.length))];
          butterflies.push({
            x, y,
            vx: p.random(0.5, 1.4) * (p.random() > 0.5 ? 1 : -1),
            vy: p.random(-0.3, 0.3),
            size: p.random(8, 16),
            wingPhase: p.random(p.TWO_PI),
            wingSpeed: p.random(0.1, 0.2),
            trail: Array.from({ length: TRAIL_LENGTH }, () => ({ x, y })),
            targetVy: 0,
            turnTimer: p.random(40, 150),
            color1: c1,
            color2: c2,
            wobble: p.random(0.02, 0.05),
          });
        }
      };

      const drawButterfly = (b: Butterfly, wing: number) => {
        const s = b.size;
        const angle = p.atan2(b.vy, b.vx);
        const wingOpen = Math.abs(wing); // 0 to 1, wing openness

        p.push();
        p.translate(b.x, b.y);
        p.rotate(angle);

        // Body
        p.noStroke();
        p.fill(40, 35, 30, 200);
        p.ellipse(0, 0, s * 0.9, s * 0.18);

        // Antennae
        p.stroke(40, 35, 30, 150);
        p.strokeWeight(0.8);
        p.line(s * 0.4, 0, s * 0.8, -s * 0.35);
        p.line(s * 0.4, 0, s * 0.8, s * 0.35);
        // Antenna tips
        p.fill(40, 35, 30, 120);
        p.noStroke();
        p.ellipse(s * 0.8, -s * 0.35, s * 0.1, s * 0.1);
        p.ellipse(s * 0.8, s * 0.35, s * 0.1, s * 0.1);

        // Upper wings (larger)
        const upperWingH = s * 1.1 * wingOpen;
        p.fill(b.color1.r, b.color1.g, b.color1.b, 180);
        p.stroke(b.color1.r * 0.6, b.color1.g * 0.6, b.color1.b * 0.6, 100);
        p.strokeWeight(0.8);

        // Top upper wing
        p.beginShape();
        p.vertex(s * 0.2, -s * 0.06);
        p.vertex(s * 0.5, -upperWingH * 0.8);
        p.vertex(s * 0.1, -upperWingH);
        p.vertex(-s * 0.3, -upperWingH * 0.6);
        p.vertex(-s * 0.2, -s * 0.06);
        p.endShape(p.CLOSE);

        // Bottom upper wing
        p.beginShape();
        p.vertex(s * 0.2, s * 0.06);
        p.vertex(s * 0.5, upperWingH * 0.8);
        p.vertex(s * 0.1, upperWingH);
        p.vertex(-s * 0.3, upperWingH * 0.6);
        p.vertex(-s * 0.2, s * 0.06);
        p.endShape(p.CLOSE);

        // Lower wings (smaller, rounder)
        const lowerWingH = s * 0.75 * wingOpen;
        p.fill(b.color2.r, b.color2.g, b.color2.b, 160);
        p.stroke(b.color2.r * 0.6, b.color2.g * 0.6, b.color2.b * 0.6, 80);

        // Top lower wing
        p.beginShape();
        p.vertex(-s * 0.1, -s * 0.05);
        p.vertex(-s * 0.15, -lowerWingH * 0.9);
        p.vertex(-s * 0.5, -lowerWingH);
        p.vertex(-s * 0.5, -s * 0.05);
        p.endShape(p.CLOSE);

        // Bottom lower wing
        p.beginShape();
        p.vertex(-s * 0.1, s * 0.05);
        p.vertex(-s * 0.15, lowerWingH * 0.9);
        p.vertex(-s * 0.5, lowerWingH);
        p.vertex(-s * 0.5, s * 0.05);
        p.endShape(p.CLOSE);

        // Wing spots/patterns
        p.noStroke();
        p.fill(255, 255, 255, 60 * wingOpen);
        p.ellipse(s * 0.15, -upperWingH * 0.5, s * 0.25, s * 0.2);
        p.ellipse(s * 0.15, upperWingH * 0.5, s * 0.25, s * 0.2);

        p.fill(0, 0, 0, 40 * wingOpen);
        p.ellipse(-s * 0.25, -lowerWingH * 0.5, s * 0.15, s * 0.12);
        p.ellipse(-s * 0.25, lowerWingH * 0.5, s * 0.15, s * 0.12);

        p.pop();
      };

      p.draw = () => {
        p.clear();

        if (attractPoint) {
          attractPoint.timer--;
          if (attractPoint.timer <= 0) attractPoint = null;
        }

        for (const b of butterflies) {
          // Erratic direction changes (butterfly-like)
          b.turnTimer--;
          if (b.turnTimer <= 0) {
            b.targetVy = p.random(-0.8, 0.8);
            b.vx += p.random(-0.3, 0.3);
            b.turnTimer = p.random(30, 120);
          }

          b.vy += (b.targetVy - b.vy) * 0.04;

          // Attract toward click
          if (attractPoint) {
            const dx = attractPoint.x - b.x;
            const dy = attractPoint.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const force = 0.03;
            b.vx += (dx / (dist + 1)) * force;
            b.vy += (dy / (dist + 1)) * force;
            const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
            if (speed > 3) {
              b.vx = (b.vx / speed) * 3;
              b.vy = (b.vy / speed) * 3;
            }
          }

          // Flutter wobble
          const wobX = p.sin(p.frameCount * b.wobble + b.wingPhase) * 0.4;
          const wobY = p.cos(p.frameCount * b.wobble * 1.3 + b.wingPhase) * 0.3;

          b.x += b.vx + wobX;
          b.y += b.vy + wobY;

          // Wrap & bounds
          if (b.x > p.width + 30) b.x = -30;
          if (b.x < -30) b.x = p.width + 30;
          if (b.y > p.height * 0.7) b.targetVy = -Math.abs(b.targetVy) - 0.3;
          if (b.y < 20) b.targetVy = Math.abs(b.targetVy) + 0.3;

          // Clamp base speed
          const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          if (spd < 0.4) {
            b.vx = (b.vx / (spd + 0.01)) * 0.5;
          }

          // Trail
          b.trail.push({ x: b.x, y: b.y });
          if (b.trail.length > TRAIL_LENGTH) b.trail.shift();

          // Draw trail with butterfly color
          for (let i = 1; i < b.trail.length; i++) {
            const t = i / b.trail.length;
            const alpha = t * 25;
            p.stroke(b.color1.r, b.color1.g, b.color1.b, alpha);
            p.strokeWeight(t * 1.0);
            p.line(b.trail[i - 1].x, b.trail[i - 1].y, b.trail[i].x, b.trail[i].y);
          }

          // Wing flap
          const wing = p.sin(p.frameCount * b.wingSpeed + b.wingPhase);

          drawButterfly(b, wing);
        }
      };

      p.mousePressed = () => {
        attractPoint = { x: p.mouseX, y: p.mouseY, timer: 180 };
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
      className="absolute inset-0"
      style={{ zIndex: 0 }}
    />
  );
};

export default BirdSketch;
