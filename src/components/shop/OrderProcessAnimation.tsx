"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type AnimationState = "idle" | "animating" | "complete";

const steps = [
  { emoji: "📦", label: "Objednávka přijata!", color: "#CC1939" },
  { emoji: "👨‍🍳", label: "Připravujeme", color: "#F59E0B" },
  { emoji: "📦", label: "Balíme do chlazeného boxu", color: "#3B82F6" },
  { emoji: "🚚", label: "Na cestě k vám!", color: "#8B5CF6" },
  { emoji: "🍽️", label: "Dobrou chuť!", color: "#10B981" },
];

const STEP_DELAY = 600;
const TOTAL_DURATION = STEP_DELAY * steps.length;

const confettiColors = [
  "#CC1939",
  "#F59E0B",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#EC4899",
  "#F97316",
  "#14B8A6",
];

function generateConfetti() {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    color: confettiColors[i % confettiColors.length],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 400,
    duration: 800 + Math.random() * 600,
    angle: Math.random() * 360,
    drift: -50 + Math.random() * 100,
  }));
}

export function OrderProcessAnimation() {
  const [state, setState] = useState<AnimationState>("idle");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [confetti, setConfetti] = useState<ReturnType<typeof generateConfetti>>(
    []
  );

  const startAnimation = useCallback(() => {
    setState("animating");
    setVisibleSteps(0);
    setConfetti([]);
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setVisibleSteps(0);
    setConfetti([]);
  }, []);

  useEffect(() => {
    if (state !== "animating") return;

    // Reveal steps one by one
    const timers: NodeJS.Timeout[] = [];
    steps.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleSteps(i + 1);
        }, STEP_DELAY * (i + 1))
      );
    });

    // Complete
    timers.push(
      setTimeout(() => {
        setState("complete");
        setConfetti(generateConfetti());
      }, TOTAL_DURATION + 600)
    );

    return () => timers.forEach(clearTimeout);
  }, [state]);

  const progressPercent =
    state === "idle"
      ? 0
      : state === "complete"
        ? 100
        : (visibleSteps / steps.length) * 100;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <span className="text-xs uppercase tracking-[0.15em] font-medium text-primary mb-3 block">
          Jak to probíhá
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
          Vaše objednávka na cestě
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-12 max-w-md mx-auto">
          Klikněte a sledujte, co se děje po objednání
        </p>

        {/* CTA Button — idle state */}
        {state === "idle" && (
          <div className="flex flex-col items-center mb-8">
            <span
              className="text-sm font-medium text-gray-400 mb-3"
              style={{
                animation: "orderBounce 1.5s ease-in-out infinite",
              }}
            >
              Klikněte na mě!
            </span>
            <button
              onClick={startAnimation}
              className="relative px-12 py-5 bg-primary text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:bg-primary-dark transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                animation: "orderPulse 2s ease-in-out infinite",
              }}
            >
              😊 Objednat!
            </button>
          </div>
        )}

        {/* Steps — animating / complete */}
        {state !== "idle" && (
          <div className="relative">
            {/* Progress line */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-1 bg-gray-100 rounded-full z-0">
              <div
                className="h-full bg-primary rounded-full transition-all ease-out"
                style={{
                  width: `${progressPercent}%`,
                  transitionDuration: `${STEP_DELAY}ms`,
                }}
              />
            </div>
            {/* Vertical progress line for mobile */}
            <div className="lg:hidden absolute top-0 bottom-0 left-7 w-1 bg-gray-100 rounded-full z-0">
              <div
                className="w-full bg-primary rounded-full transition-all ease-out"
                style={{
                  height: `${progressPercent}%`,
                  transitionDuration: `${STEP_DELAY}ms`,
                }}
              />
            </div>

            {/* Steps grid */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-4">
              {steps.map((step, i) => {
                const visible = i < visibleSteps;
                return (
                  <div
                    key={i}
                    className="flex lg:flex-col items-center lg:items-center gap-4 lg:gap-2 transition-all duration-500 ease-out"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible
                        ? "translateY(0)"
                        : "translateY(20px)",
                      transitionDelay: "0ms",
                    }}
                  >
                    {/* Circle icon */}
                    <div
                      className="w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center text-2xl bg-white shadow-md border-2 transition-colors duration-300"
                      style={{ borderColor: visible ? step.color : "#E5E5E5" }}
                    >
                      {step.emoji}
                    </div>
                    {/* Card */}
                    <div
                      className="bg-white rounded-xl shadow-sm px-4 py-3 text-left lg:text-center border-l-4 lg:border-l-0 lg:border-t-4 transition-colors duration-300"
                      style={{
                        borderColor: visible ? step.color : "#E5E5E5",
                      }}
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confetti & completion */}
            {state === "complete" && (
              <div className="relative mt-12">
                {/* Confetti burst */}
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  style={{ height: 200, top: -80 }}
                >
                  {confetti.map((c) => (
                    <span
                      key={c.id}
                      className="absolute rounded-full"
                      style={{
                        left: c.left,
                        top: c.top,
                        width: c.size,
                        height: c.size,
                        backgroundColor: c.color,
                        animation: `confettiBurst ${c.duration}ms ${c.delay}ms ease-out forwards`,
                        opacity: 0,
                      }}
                    />
                  ))}
                </div>

                {/* "Hotovo!" text */}
                <p
                  className="text-3xl font-display font-bold mb-6"
                  style={{
                    animation: "fadeSlideUp 600ms ease-out forwards",
                  }}
                >
                  🎉 Hotovo!
                </p>

                {/* Action buttons */}
                <div
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                  style={{
                    animation: "fadeSlideUp 600ms 200ms ease-out both",
                  }}
                >
                  <button
                    onClick={reset}
                    className="px-6 py-3 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Přehrát znovu
                  </button>
                  <Link
                    href="/sortiment"
                    className="px-6 py-3 text-sm font-medium rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Objednat doopravdy
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSS keyframes */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style>{`
        @keyframes orderPulse {
          0%,
          100% {
            box-shadow:
              0 10px 15px -3px rgba(204, 25, 57, 0.2),
              0 4px 6px -4px rgba(204, 25, 57, 0.1);
          }
          50% {
            box-shadow:
              0 20px 25px -5px rgba(204, 25, 57, 0.3),
              0 8px 10px -6px rgba(204, 25, 57, 0.15);
          }
        }

        @keyframes orderBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes confettiBurst {
          0% {
            opacity: 1;
            transform: scale(0) translateY(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) translateY(-40px);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateY(-80px) rotate(180deg);
          }
        }
      `}</style>
    </section>
  );
}
