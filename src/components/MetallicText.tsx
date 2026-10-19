"use client";

import MetallicPaint from "./MetallicPaint";

interface MetallicTextProps {
  text: string;
  className?: string;
  fontFamily?: string;
  fontWeight?: number;
  color?: string;
  speed?: number;
  density?: number;
  softness?: number;
  dispersion?: number;
  distortion?: number;
  edgeBend?: number;
  scale?: number;
  mouseTilt?: number;
}

export default function MetallicText({
  text,
  className = "",
  fontFamily,
  fontWeight = 800,
  color = "#ffffff",
  speed = 1,
  density = 2,
  softness = 0.1,
  dispersion = 0.3,
  distortion = 0.07,
  edgeBend = 0.6,
  scale = 1.08,
  mouseTilt = 0.5,
}: MetallicTextProps) {
  return (
    <span className={`inline-grid ${className}`} role="img" aria-label={text}>
      <span className="invisible" style={{ gridArea: "1 / 1" }}>
        {text}
      </span>
      <span style={{ gridArea: "1 / 1" }}>
        <MetallicPaint
          text={text}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          color={color}
          speed={speed}
          density={density}
          softness={softness}
          dispersion={dispersion}
          distortion={distortion}
          edgeBend={edgeBend}
          scale={scale}
          mouseTilt={mouseTilt}
          fallback={<span>{text}</span>}
        />
      </span>
    </span>
  );
}
