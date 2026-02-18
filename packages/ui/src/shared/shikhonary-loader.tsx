"use client";

import React, { useEffect, useState } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const LETTERS = ["S", "H", "I", "K", "H", "O", "N", "A", "R", "Y"];
const PAGE_DURATION = 850; // Slower, more majestic flip
const PAGE_HOLD = 450;

const LETTER_COLORS = [
  "#6366f1", // S – indigo
  "#0ea5e9", // H – sky
  "#10b981", // I – emerald
  "#f59e0b", // K – amber
  "#ec4899", // H – pink
  "#8b5cf6", // O – violet
  "#14b8a6", // N – teal
  "#f97316", // A – orange
  "#3b82f6", // R – blue
  "#e11d48", // Y – rose
];

const VARIANTS: Array<"mcq" | "lines" | "grid" | "check" | "builder"> = [
  "mcq",
  "builder",
  "grid",
  "builder",
  "check",
  "builder",
  "lines",
  "builder",
  "mcq",
  "builder",
];

// ─── SVG Patterns ────────────────────────────────────────────────────────────
const PagePattern = ({
  w,
  h,
  accent,
  variant,
  isFlipping,
}: {
  w: number;
  h: number;
  accent: string;
  variant: "mcq" | "lines" | "grid" | "check" | "builder";
  isFlipping?: boolean;
}) => {
  const pad = 10;
  const lineGap = 12;
  const lineCount = Math.floor((h - pad * 2) / lineGap);

  if (variant === "builder") {
    return (
      <svg
        width={w}
        height={h}
        style={{ position: "absolute", inset: 0, opacity: 0.22 }}
      >
        {/* Builder Header */}
        <rect
          x={pad}
          y={pad}
          width={w - pad * 2}
          height={4}
          rx={2}
          fill={accent}
          opacity={0.6}
        />

        {/* Builder Rows */}
        {[0, 1, 2].map((i) => {
          const y = pad + 10 + i * 16;
          return (
            <g key={i}>
              <circle cx={pad + 1} cy={y + 2.5} r={0.6} fill={accent} />
              <circle cx={pad + 3} cy={y + 2.5} r={0.6} fill={accent} />
              <circle cx={pad + 1} cy={y + 4.5} r={0.6} fill={accent} />
              <circle cx={pad + 3} cy={y + 4.5} r={0.6} fill={accent} />
              <circle cx={pad + 1} cy={y + 6.5} r={0.6} fill={accent} />
              <circle cx={pad + 3} cy={y + 6.5} r={0.6} fill={accent} />

              <rect
                x={pad + 6}
                y={y}
                width={w - pad * 2 - 12}
                height={11}
                rx={1.5}
                stroke={accent}
                strokeWidth={0.5}
                fill="none"
              />
              <rect
                x={pad + 10}
                y={y + 3}
                width={w - pad * 2 - 20}
                height={0.8}
                rx={0.4}
                fill={accent}
                opacity={0.3}
              />
              <rect
                x={pad + 10}
                y={y + 6}
                width={w - pad * 2 - 28}
                height={0.8}
                rx={0.4}
                fill={accent}
                opacity={0.3}
              />

              <circle
                cx={w - pad - 2.5}
                cy={y + 5.5}
                r={2.5}
                fill={accent}
                opacity={0.15}
              />
              <path
                d={`M ${w - pad - 3.5} ${y + 5.5} L ${w - pad - 1.5} ${y + 5.5} M ${w - pad - 2.5} ${y + 4.5} L ${w - pad - 2.5} ${y + 6.5}`}
                stroke={accent}
                strokeWidth={0.5}
              />
            </g>
          );
        })}
      </svg>
    );
  }

  if (variant === "mcq") {
    const questions = 3;
    const opts = ["A", "B", "C", "D"];
    return (
      <svg
        width={w}
        height={h}
        style={{ position: "absolute", inset: 0, opacity: 0.22 }}
      >
        {Array.from({ length: questions }).map((_, qi) => {
          const y = pad + qi * ((h - pad * 2) / questions) + 4;
          return (
            <g key={qi}>
              <rect
                x={pad}
                y={y}
                width={w - pad * 2}
                height={1.5}
                rx={0.7}
                fill={accent}
              />
              {opts.map((opt, oi) => {
                const bx = pad + oi * ((w - pad * 2) / opts.length) + 3;
                const by = y + 8;
                const filled = oi === 1 && qi === 1;
                return (
                  <g key={opt}>
                    <circle
                      cx={bx + 4}
                      cy={by + 4}
                      r={4}
                      fill={filled ? accent : "none"}
                      stroke={accent}
                      strokeWidth={1}
                    >
                      {filled && (
                        <animate
                          attributeName="opacity"
                          values="0.4;1;0.4"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>
                    <text
                      x={bx + 4}
                      y={by + 6.5}
                      textAnchor="middle"
                      fontSize={3.5}
                      fill={filled ? "#fff" : accent}
                      fontWeight="bold"
                      style={{ pointerEvents: "none" }}
                    >
                      {opt}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    );
  }

  if (variant === "grid") {
    return (
      <svg
        width={w}
        height={h}
        style={{ position: "absolute", inset: 0, opacity: 0.08 }}
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 8 0 L 0 0 0 8"
              fill="none"
              stroke={accent}
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    );
  }

  if (variant === "check") {
    const items = 4;
    return (
      <svg
        width={w}
        height={h}
        style={{ position: "absolute", inset: 0, opacity: 0.2 }}
      >
        {Array.from({ length: items }).map((_, i) => {
          const y = pad + i * ((h - pad * 2) / items) + 4;
          const checked = i % 2 === 0;
          return (
            <g key={i}>
              <rect
                x={pad}
                y={y}
                width={7}
                height={7}
                rx={1.5}
                fill={checked ? accent : "none"}
                stroke={accent}
                strokeWidth={1}
              />
              {checked && (
                <path
                  d={`M ${pad + 1.5} ${y + 3.5} L ${pad + 3} ${y + 5.5} L ${pad + 5.5} ${y + 1.5}`}
                  stroke="#fff"
                  strokeWidth={1.2}
                  fill="none"
                  strokeLinecap="round"
                />
              )}
              <rect
                x={pad + 12}
                y={y + 2.5}
                width={w - pad * 2 - 12}
                height={1.5}
                rx={0.7}
                fill={accent}
              />
            </g>
          );
        })}
      </svg>
    );
  }

  // lines
  return (
    <svg
      width={w}
      height={h}
      style={{ position: "absolute", inset: 0, opacity: 0.12 }}
    >
      <line
        x1={pad + 8}
        y1={0}
        x2={pad + 8}
        y2={h}
        stroke="#ef4444"
        strokeWidth={0.8}
      />
      {Array.from({ length: lineCount }).map((_, i) => (
        <line
          key={i}
          x1={pad + 12}
          y1={pad + i * lineGap + lineGap}
          x2={w - pad}
          y2={pad + i * lineGap + lineGap}
          stroke={accent}
          strokeWidth={0.6}
        />
      ))}
    </svg>
  );
};

// ─── Styles & Keyframes ──────────────────────────────────────────────────────
const STYLES = `
  @keyframes sk-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes sk-flip {
    0% { transform: perspective(800px) rotateY(0deg); }
    20% { transform: perspective(800px) rotateY(-5deg); }
    100% { transform: perspective(800px) rotateY(-180deg); }
  }
  @keyframes sk-shadow-breathe {
    0%, 100% { opacity: 0.25; transform: scaleX(0.85); }
    50% { opacity: 0.1; transform: scaleX(1.1); }
  }
  @keyframes sk-mesh-pulse {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
    33% { transform: translate(10%, 15%) scale(1.1); opacity: 0.6; }
    66% { transform: translate(-15%, 5%) scale(0.9); opacity: 0.5; }
  }
  @keyframes sk-page-sheen {
    0% { opacity: 0; transform: translateX(-100%) skewX(-20deg); }
    50% { opacity: 0.3; }
    100% { opacity: 0; transform: translateX(200%) skewX(-20deg); }
  }
  @keyframes sk-letter-pop {
    0% { transform: scale(0.8) translateY(10px); opacity: 0; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  
  .sk-float { animation: sk-float 3s ease-in-out infinite; }
  .sk-shadow { animation: sk-shadow-breathe 3s ease-in-out infinite; }
  .sk-flip-page { animation: sk-flip ${PAGE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
  .sk-mesh { animation: sk-mesh-pulse 10s ease-in-out infinite; }
  .sk-pop { animation: sk-letter-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  
  .sk-paper-texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.04;
    mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }
  
  .sk-page-glass {
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
`;

// ─── Sub-components ──────────────────────────────────────────────────────────
const MeshBackground = ({ color }: { color: string }) => (
  <div
    style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: -1 }}
  >
    <div
      className="sk-mesh"
      style={{
        position: "absolute",
        top: "20%",
        left: "25%",
        width: "50%",
        height: "50%",
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        filter: "blur(60px)",
      }}
    />
    <div
      className="sk-mesh"
      style={{
        position: "absolute",
        bottom: "10%",
        right: "20%",
        width: "60%",
        height: "60%",
        background: `radial-gradient(circle, ${color}11 0%, transparent 70%)`,
        filter: "blur(80px)",
        animationDelay: "-3s",
      }}
    />
  </div>
);

interface PageProps {
  frontLetter: string;
  frontColor: string;
  frontVariant: "mcq" | "lines" | "grid" | "check" | "builder";
  backLetter: string;
  backColor: string;
  backVariant: "mcq" | "lines" | "grid" | "check" | "builder";
  flipping: boolean;
  w: number;
  h: number;
}

const BookPage: React.FC<PageProps> = ({
  frontLetter,
  frontColor,
  frontVariant,
  backLetter,
  backColor,
  backVariant,
  flipping,
  w,
  h,
}) => {
  const fontSize = Math.round(h * 0.45);

  return (
    <div
      className={flipping ? "sk-flip-page" : ""}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: w,
        height: h,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
        zIndex: flipping ? 15 : 5,
      }}
    >
      {/* Front Face */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          background: `linear-gradient(145deg, ${frontColor}12 0%, ${frontColor}08 100%)`,
          backgroundColor: "#fffdf9", // Slightly cream paper
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          borderTop: `1px solid ${frontColor}22`,
          borderRight: `1px solid ${frontColor}22`,
          borderBottom: `1px solid ${frontColor}22`,
          borderLeft: "0",
          boxShadow: "2px 4px 12px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div className="sk-paper-texture" />
        <PagePattern w={w} h={h} accent={frontColor} variant={frontVariant} />

        {/* Spine shadow (Tactile) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.05), transparent)",
            zIndex: 3,
          }}
        />

        <span
          key={`f-${frontLetter}`}
          className="sk-pop"
          style={{
            fontSize,
            fontWeight: 900,
            fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
            color: frontColor,
            lineHeight: 1,
            userSelect: "none",
            textShadow: `0 0 12px ${frontColor}33`,
            position: "relative",
            zIndex: 4,
          }}
        >
          {frontLetter}
        </span>

        {/* Dynamic Sheen during flip */}
        {flipping && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
              animation: `sk-page-sheen ${PAGE_DURATION}ms ease-in-out forwards`,
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* Back Face */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: `linear-gradient(145deg, ${backColor}12 0%, ${backColor}08 100%)`,
          backgroundColor: "#fffdf9",
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          borderTop: `1px solid ${backColor}22`,
          borderLeft: `1px solid ${backColor}22`,
          borderBottom: `1px solid ${backColor}22`,
          borderRight: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div className="sk-paper-texture" />
        <PagePattern w={w} h={h} accent={backColor} variant={backVariant} />

        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background:
              "linear-gradient(to left, rgba(0,0,0,0.05), transparent)",
            zIndex: 3,
          }}
        />

        <span
          style={{
            fontSize,
            fontWeight: 900,
            fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
            color: `${backColor}66`,
            lineHeight: 1,
            userSelect: "none",
            position: "relative",
            zIndex: 4,
          }}
        >
          {backLetter}
        </span>
      </div>

      {/* Paper Edge (Thickness) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: -1.5,
          bottom: 0,
          width: 1.5,
          background: "#e5e3df",
          transform: "rotateY(90deg)",
          transformOrigin: "left center",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
};

// ─── Main Loader ─────────────────────────────────────────────────────────────
interface ShikhonaryLoaderProps {
  fullscreen?: boolean;
  message?: string;
}

export function ShikhonaryLoader({
  fullscreen = true,
  message,
}: ShikhonaryLoaderProps) {
  const [index, setIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const BOOK_W = 112; // Smaller
  const BOOK_H = 82;
  const HALF = BOOK_W / 2;

  useEffect(() => {
    let flipTimer: ReturnType<typeof setTimeout>;
    let holdTimer: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setFlipping(true);
      flipTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % LETTERS.length);
        setFlipping(false);
      }, PAGE_DURATION);
      holdTimer = setTimeout(cycle, PAGE_DURATION + PAGE_HOLD);
    };
    holdTimer = setTimeout(cycle, PAGE_HOLD);
    return () => {
      clearTimeout(flipTimer);
      clearTimeout(holdTimer);
    };
  }, []);

  const cur = index;
  const next = (index + 1) % LETTERS.length;
  const prev = (index - 1 + LETTERS.length) % LETTERS.length;

  const curColor = LETTER_COLORS[cur]!;
  const nextColor = LETTER_COLORS[next]!;
  const prevColor = LETTER_COLORS[prev]!;

  const loaderContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        zIndex: 10,
      }}
    >
      <style>{STYLES}</style>

      {/* ── Book Container ── */}
      <div className="sk-float" style={{ position: "relative" }}>
        <div
          style={{
            position: "relative",
            width: BOOK_W,
            height: BOOK_H,
            perspective: 1200,
          }}
        >
          {/* Left page static */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: HALF,
              height: BOOK_H,
              backgroundColor: "#fffdf9",
              borderTop: `1px solid ${prevColor}22`,
              borderLeft: `1px solid ${prevColor}22`,
              borderBottom: `1px solid ${prevColor}22`,
              borderRight: "0",
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              boxShadow: "-3px 6px 15px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div className="sk-paper-texture" />
            <PagePattern
              w={HALF}
              h={BOOK_H}
              accent={prevColor}
              variant={VARIANTS[prev]!}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 10,
                background:
                  "linear-gradient(to left, rgba(0,0,0,0.06), transparent)",
                zIndex: 3,
              }}
            />
            <span
              style={{
                fontSize: BOOK_H * 0.45,
                fontWeight: 900,
                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                color: `${prevColor}33`,
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              {LETTERS[prev]}
            </span>
          </div>

          {/* Spine 3D */}
          <div
            style={{
              position: "absolute",
              top: -2,
              left: "50%",
              transform: "translateX(-50%)",
              width: 5,
              height: BOOK_H + 4,
              background: `linear-gradient(to bottom, #d1d5db, #9ca3af, #d1d5db)`,
              borderRadius: 3,
              zIndex: 30,
              boxShadow: `0 0 10px rgba(0,0,0,0.15), 0 0 4px ${curColor}44`,
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to right, transparent, ${curColor}33, transparent)`,
              }}
            />
          </div>

          {/* Right page base */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: HALF,
              height: BOOK_H,
              backgroundColor: "#fffdf9",
              borderTop: `1px solid ${nextColor}22`,
              borderRight: `1px solid ${nextColor}22`,
              borderBottom: `1px solid ${nextColor}22`,
              borderLeft: "0",
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              boxShadow: "3px 6px 15px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div className="sk-paper-texture" />
            <PagePattern
              w={HALF}
              h={BOOK_H}
              accent={nextColor}
              variant={VARIANTS[next]!}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 10,
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.06), transparent)",
                zIndex: 3,
              }}
            />
            <span
              style={{
                fontSize: BOOK_H * 0.45,
                fontWeight: 900,
                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                color: nextColor,
                lineHeight: 1,
                userSelect: "none",
                textShadow: `0 0 16px ${nextColor}44`,
              }}
            >
              {LETTERS[next]}
            </span>
          </div>

          {/* Flipping Page */}
          <BookPage
            key={index}
            frontLetter={LETTERS[cur]!}
            frontColor={curColor}
            frontVariant={VARIANTS[cur]!}
            backLetter={LETTERS[next]!}
            backColor={nextColor}
            backVariant={VARIANTS[next]!}
            flipping={flipping}
            w={HALF}
            h={BOOK_H}
          />
        </div>

        {/* Dynamic Shadow */}
        <div
          className="sk-shadow"
          style={{
            width: BOOK_W * 0.7,
            height: 10,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.12)",
            filter: "blur(6px)",
            margin: "8px auto 0",
          }}
        />
      </div>

      {/* ── Brand text ── */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 7,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: "0.4em",
            color: "transparent",
            backgroundImage: `linear-gradient(135deg, ${curColor} 0%, ${nextColor} 50%, ${curColor} 100%)`,
            backgroundSize: "200% auto",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            animation: "sk-brand-shimmer 3s linear infinite",
            textTransform: "uppercase",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.05))",
          }}
        >
          SHIKHONARY
        </span>

        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: curColor,
                opacity: 0.15 + i * 0.2,
                transform: `scale(${0.8 + i * 0.1})`,
                transition:
                  "background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: `sk-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {message && (
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "hsl(var(--muted-foreground))",
            letterSpacing: "0.05em",
            opacity: 0.8,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );

  if (!fullscreen) {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "60px 0",
          minHeight: 250,
        }}
      >
        <MeshBackground color={curColor} />
        {loaderContent}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "hsl(var(--background))",
        overflow: "hidden",
      }}
    >
      {/* Premium Background Layers */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, transparent 0%, hsl(var(--background)) 80%)`,
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          background: `
            radial-gradient(at 0% 0%, ${curColor}10 0, transparent 50%),
            radial-gradient(at 100% 0%, ${nextColor}10 0, transparent 50%)
          `,
          zIndex: 1,
        }}
      />

      <MeshBackground color={curColor} />

      {/* Glass Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(40px) saturate(160%)",
          WebkitBackdropFilter: "blur(40px) saturate(160%)",
          zIndex: 3,
        }}
      />

      {loaderContent}
    </div>
  );
}

export function ShikhonaryLoaderInline({ message }: { message?: string }) {
  return <ShikhonaryLoader fullscreen={false} message={message} />;
}
