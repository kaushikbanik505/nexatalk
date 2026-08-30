import { useMemo } from "react";

const STAR_COUNT = 140;
const BUBBLE_COUNT = 16;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const StarryBackground = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        id: i,
        top: randomBetween(0, 100),
        left: randomBetween(0, 100),
        size: randomBetween(1, 2.5),
        duration: randomBetween(2, 6),
        delay: randomBetween(0, 5),
      })),
    []
  );

  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
        id: i,
        left: randomBetween(0, 100),
        size: randomBetween(14, 70),
        duration: randomBetween(16, 32),
        delay: randomBetween(0, 24),
        drift: randomBetween(-50, 50),
        hue: i % 2 === 0 ? "var(--p)" : "var(--s)",
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: `${bubble.left}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            bottom: `-${bubble.size}px`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            "--drift": `${bubble.drift}px`,
            background: `radial-gradient(circle at 35% 30%, oklch(${bubble.hue} / 0.6), oklch(${bubble.hue} / 0.08) 70%)`,
            boxShadow: `0 0 16px oklch(${bubble.hue} / 0.45), inset 0 0 10px rgba(255,255,255,0.2)`,
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;
