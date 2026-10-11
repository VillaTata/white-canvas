import { useEffect, useRef } from "react";

interface Color {
  r: number;
  g: number;
  b: number;
}

interface Point {
  x: number;
  y: number;
}

interface Butterfly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  wingPhase: number;
  wingSpeed: number;
  trail: Point[];
  targetVy: number;
  turnTimer: number;
  color1: Color;
  color2: Color;
  wobble: number;
}

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const colorWithAlpha = (color: Color, alpha: number, shade = 1) =>
  `rgba(${Math.round(color.r * shade)}, ${Math.round(color.g * shade)}, ${Math.round(color.b * shade)}, ${alpha / 255})`;

function drawPolygon(
  context: CanvasRenderingContext2D,
  points: Point[],
  fillColor: string,
  strokeColor: string
) {
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index++) {
    const point = points[index];
    context.lineTo(point.x, point.y);
  }
  context.closePath();
  context.fillStyle = fillColor;
  context.fill();
  context.strokeStyle = strokeColor;
  context.stroke();
}

function drawButterfly(
  context: CanvasRenderingContext2D,
  butterfly: Butterfly,
  wing: number
) {
  const size = butterfly.size;
  const wingOpen = Math.abs(wing);
  const upperWingHeight = size * 1.1 * wingOpen;
  const lowerWingHeight = size * 0.75 * wingOpen;
  const firstColor = butterfly.color1;
  const secondColor = butterfly.color2;

  context.save();
  context.translate(butterfly.x, butterfly.y);
  context.rotate(Math.atan2(butterfly.vy, butterfly.vx));

  context.beginPath();
  context.ellipse(0, 0, size * 0.45, size * 0.09, 0, 0, Math.PI * 2);
  context.fillStyle = "rgba(40, 35, 30, 0.78)";
  context.fill();

  context.beginPath();
  context.moveTo(size * 0.4, 0);
  context.lineTo(size * 0.8, -size * 0.35);
  context.moveTo(size * 0.4, 0);
  context.lineTo(size * 0.8, size * 0.35);
  context.strokeStyle = "rgba(40, 35, 30, 0.59)";
  context.lineWidth = 0.8;
  context.stroke();

  context.beginPath();
  context.ellipse(size * 0.8, -size * 0.35, size * 0.05, size * 0.05, 0, 0, Math.PI * 2);
  context.ellipse(size * 0.8, size * 0.35, size * 0.05, size * 0.05, 0, 0, Math.PI * 2);
  context.fillStyle = "rgba(40, 35, 30, 0.47)";
  context.fill();

  context.lineWidth = 0.8;
  drawPolygon(
    context,
    [
      { x: size * 0.2, y: -size * 0.06 },
      { x: size * 0.5, y: -upperWingHeight * 0.8 },
      { x: size * 0.1, y: -upperWingHeight },
      { x: -size * 0.3, y: -upperWingHeight * 0.6 },
      { x: -size * 0.2, y: -size * 0.06 },
    ],
    colorWithAlpha(firstColor, 180),
    colorWithAlpha(firstColor, 100, 0.6)
  );
  drawPolygon(
    context,
    [
      { x: size * 0.2, y: size * 0.06 },
      { x: size * 0.5, y: upperWingHeight * 0.8 },
      { x: size * 0.1, y: upperWingHeight },
      { x: -size * 0.3, y: upperWingHeight * 0.6 },
      { x: -size * 0.2, y: size * 0.06 },
    ],
    colorWithAlpha(firstColor, 180),
    colorWithAlpha(firstColor, 100, 0.6)
  );

  drawPolygon(
    context,
    [
      { x: -size * 0.1, y: -size * 0.05 },
      { x: -size * 0.15, y: -lowerWingHeight * 0.9 },
      { x: -size * 0.5, y: -lowerWingHeight },
      { x: -size * 0.5, y: -size * 0.05 },
    ],
    colorWithAlpha(secondColor, 160),
    colorWithAlpha(secondColor, 80, 0.6)
  );
  drawPolygon(
    context,
    [
      { x: -size * 0.1, y: size * 0.05 },
      { x: -size * 0.15, y: lowerWingHeight * 0.9 },
      { x: -size * 0.5, y: lowerWingHeight },
      { x: -size * 0.5, y: size * 0.05 },
    ],
    colorWithAlpha(secondColor, 160),
    colorWithAlpha(secondColor, 80, 0.6)
  );

  context.beginPath();
  context.ellipse(
    size * 0.15,
    -upperWingHeight * 0.5,
    size * 0.125,
    size * 0.1,
    0,
    0,
    Math.PI * 2
  );
  context.ellipse(
    size * 0.15,
    upperWingHeight * 0.5,
    size * 0.125,
    size * 0.1,
    0,
    0,
    Math.PI * 2
  );
  context.fillStyle = colorWithAlpha({ r: 255, g: 255, b: 255 }, 60 * wingOpen);
  context.fill();

  context.beginPath();
  context.ellipse(
    -size * 0.25,
    -lowerWingHeight * 0.5,
    size * 0.075,
    size * 0.06,
    0,
    0,
    Math.PI * 2
  );
  context.ellipse(
    -size * 0.25,
    lowerWingHeight * 0.5,
    size * 0.075,
    size * 0.06,
    0,
    0,
    Math.PI * 2
  );
  context.fillStyle = "rgba(0, 0, 0, 0.16)";
  context.fill();

  context.restore();
}

const BirdSketch = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = container?.ownerDocument.createElement("canvas");
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) {
      console.error("No se pudo inicializar el canvas de la animación del hero.");
      return;
    }

    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const palettes: Color[] = [
      { r: 220, g: 120, b: 50 },
      { r: 240, g: 200, b: 60 },
      { r: 180, g: 80, b: 160 },
      { r: 60, g: 160, b: 200 },
      { r: 200, g: 60, b: 80 },
      { r: 100, g: 180, b: 80 },
      { r: 240, g: 140, b: 180 },
    ];
    const butterflies: Butterfly[] = [];
    const trailLength = 20;
    let width = 0;
    let height = 0;
    let frameCount = 0;
    let animationFrame: number | null = null;
    let attractPoint: (Point & { timer: number }) | null = null;
    let isInViewport = !("IntersectionObserver" in window);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const canAnimate = () =>
      isInViewport && !document.hidden && !reducedMotion.matches;

    const resizeCanvas = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (butterflies.length === 0) {
        for (let index = 0; index < 18; index++) {
          const x = randomBetween(0, width);
          const y = randomBetween(0, height * 0.6);
          butterflies.push({
            x,
            y,
            vx: randomBetween(0.5, 1.4) * (Math.random() > 0.5 ? 1 : -1),
            vy: randomBetween(-0.3, 0.3),
            size: randomBetween(8, 16),
            wingPhase: randomBetween(0, Math.PI * 2),
            wingSpeed: randomBetween(0.1, 0.2),
            trail: Array.from({ length: trailLength }, () => ({ x, y })),
            targetVy: 0,
            turnTimer: randomBetween(40, 150),
            color1: palettes[Math.floor(Math.random() * palettes.length)],
            color2: palettes[Math.floor(Math.random() * palettes.length)],
            wobble: randomBetween(0.02, 0.05),
          });
        }
      }
    };

    const drawFrame = () => {
      animationFrame = null;
      if (!canAnimate()) return;

      context.clearRect(0, 0, width, height);
      frameCount++;

      if (attractPoint) {
        attractPoint.timer--;
        if (attractPoint.timer <= 0) attractPoint = null;
      }

      for (const butterfly of butterflies) {
        butterfly.turnTimer--;
        if (butterfly.turnTimer <= 0) {
          butterfly.targetVy = randomBetween(-0.8, 0.8);
          butterfly.vx += randomBetween(-0.3, 0.3);
          butterfly.turnTimer = randomBetween(30, 120);
        }

        butterfly.vy += (butterfly.targetVy - butterfly.vy) * 0.04;

        if (attractPoint) {
          const dx = attractPoint.x - butterfly.x;
          const dy = attractPoint.y - butterfly.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          butterfly.vx += (dx / (distance + 1)) * 0.03;
          butterfly.vy += (dy / (distance + 1)) * 0.03;
          const speed = Math.sqrt(
            butterfly.vx * butterfly.vx + butterfly.vy * butterfly.vy
          );
          if (speed > 3) {
            butterfly.vx = (butterfly.vx / speed) * 3;
            butterfly.vy = (butterfly.vy / speed) * 3;
          }
        }

        const wobbleX =
          Math.sin(frameCount * butterfly.wobble + butterfly.wingPhase) * 0.4;
        const wobbleY =
          Math.cos(
            frameCount * butterfly.wobble * 1.3 + butterfly.wingPhase
          ) * 0.3;
        butterfly.x += butterfly.vx + wobbleX;
        butterfly.y += butterfly.vy + wobbleY;

        if (butterfly.x > width + 30) butterfly.x = -30;
        if (butterfly.x < -30) butterfly.x = width + 30;
        if (butterfly.y > height * 0.7) {
          butterfly.targetVy = -Math.abs(butterfly.targetVy) - 0.3;
        }
        if (butterfly.y < 20) {
          butterfly.targetVy = Math.abs(butterfly.targetVy) + 0.3;
        }

        const speed = Math.sqrt(
          butterfly.vx * butterfly.vx + butterfly.vy * butterfly.vy
        );
        if (speed < 0.4) {
          butterfly.vx = (butterfly.vx / (speed + 0.01)) * 0.5;
        }

        butterfly.trail.push({ x: butterfly.x, y: butterfly.y });
        if (butterfly.trail.length > trailLength) butterfly.trail.shift();

        for (let index = 1; index < butterfly.trail.length; index++) {
          const trailPosition = index / butterfly.trail.length;
          context.beginPath();
          context.moveTo(
            butterfly.trail[index - 1].x,
            butterfly.trail[index - 1].y
          );
          context.lineTo(
            butterfly.trail[index].x,
            butterfly.trail[index].y
          );
          context.strokeStyle = colorWithAlpha(
            butterfly.color1,
            trailPosition * 25
          );
          context.lineWidth = trailPosition;
          context.stroke();
        }

        const wing = Math.sin(
          frameCount * butterfly.wingSpeed + butterfly.wingPhase
        );
        drawButterfly(context, butterfly, wing);
      }

      animationFrame = window.requestAnimationFrame(drawFrame);
    };

    const updatePlayback = () => {
      if (canAnimate() && animationFrame === null) {
        animationFrame = window.requestAnimationFrame(drawFrame);
      } else if (!canAnimate() && animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    const handleClick = (event: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect();
      attractPoint = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
        timer: 180,
      };
    };

    const handleVisibilityChange = () => updatePlayback();
    const handleMotionPreferenceChange = () => updatePlayback();
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(resizeCanvas);
    const intersectionObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            isInViewport = entry.isIntersecting;
            updatePlayback();
          });

    resizeCanvas();
    resizeObserver?.observe(container);
    intersectionObserver?.observe(container);
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionPreferenceChange);
    canvas.addEventListener("click", handleClick);
    updatePlayback();

    return () => {
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);
      canvas.removeEventListener("click", handleClick);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default BirdSketch;
