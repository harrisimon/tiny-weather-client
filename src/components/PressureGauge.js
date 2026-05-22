import React, { useRef } from "react"

const TICK_POSITIONS = [0, 0.25, 0.5, 0.75, 1]

/**
 * Semi-circular barometric gauge for inHg.
 * minInHg/maxInHg span typical sea-level-ish surface range (~28–31).
 * viewBox includes padding so strokes, filter, and top tick are never clipped.
 */
export default function PressureGauge({
  valueInHg,
  previousValueInHg,
  minInHg = 28.6,
  maxInHg = 30.9,
  label,
}) {
  const gradId = useRef(
    `pressureGaugeGrad-${Math.random().toString(36).slice(2, 11)}`
  ).current
  const filterId = useRef(
    `needleGlow-${Math.random().toString(36).slice(2, 11)}`
  ).current

  // Clamp value and normalize
  const clamped = Math.min(maxInHg, Math.max(minInHg, valueInHg))
  const t = maxInHg > minInHg ? (clamped - minInHg) / (maxInHg - minInHg) : 0.5
  const previousClamped =
    previousValueInHg == null
      ? null
      : Math.min(maxInHg, Math.max(minInHg, previousValueInHg))
  const previousT =
    previousClamped == null || maxInHg <= minInHg
      ? null
      : (previousClamped - minInHg) / (maxInHg - minInHg)

  // Gauge dimensions
  const cx = 100
  const cy = 86
  const rTrack = 48
  const rNeedle = 40
  const rTicksInner = rTrack - 5
  const rTicksOuter = rTrack + 2

  // Needle position (upright semi-circle): low values point left, high values point right.
  const theta = Math.PI * (1 - t)
  const nx = cx + rNeedle * Math.cos(theta)
  const ny = cy - rNeedle * Math.sin(theta) // SVG y-axis goes down

  // Track endpoints
  const sx = cx - rTrack
  const sy = cy
  const ex = cx + rTrack
  const ey = cy

  const pointOnArc = (u, radius = rTrack) => {
    const angle = Math.PI * (1 - u)
    return {
      x: cx + radius * Math.cos(angle),
      y: cy - radius * Math.sin(angle),
    }
  }

  const hasPressureChangeArc =
    previousT != null && Math.abs(previousT - t) > 0.004
  const pressureChangeArc = hasPressureChangeArc
    ? (() => {
        const start = pointOnArc(previousT)
        const end = pointOnArc(t)
        const sweepFlag = previousT < t ? 1 : 0
        return `M ${start.x} ${start.y} A ${rTrack} ${rTrack} 0 0 ${sweepFlag} ${end.x} ${end.y}`
      })()
    : null

  // Tick angles
  const tickAngles = TICK_POSITIONS.map((u) => Math.PI * u)

  // Label position below arc
  const labelY = cy + 20

  return (
    <div className="pressure-gauge-wrap">
      <svg
        className="pressure-gauge-svg"
        viewBox="4 10 192 100"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={label}
      >
        <title>{label}</title>
        <defs>
          <linearGradient
            id={gradId}
            gradientUnits="userSpaceOnUse"
            x1={sx}
            y1={cy - rTrack * 0.45}
            x2={ex}
            y2={cy - rTrack * 0.45}
          >
            <stop offset="0%" stopColor="#2a8faf" />
            <stop offset="50%" stopColor="#3db8a8" />
            <stop offset="100%" stopColor="#7ee8d8" />
          </linearGradient>
          <filter
            id={filterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1"
              floodColor="#000"
              floodOpacity="0.5"
            />
          </filter>
        </defs>

        {/* Track */}
        <path
          d={`M ${sx} ${sy} A ${rTrack} ${rTrack} 0 0 1 ${ex} ${ey}`}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${sx} ${sy} A ${rTrack} ${rTrack} 0 0 1 ${ex} ${ey}`}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="8"
          strokeLinecap="round"
        />
        {pressureChangeArc && (
          <path
            d={pressureChangeArc}
            fill="none"
            stroke="#f5fffd"
            strokeWidth="13"
            strokeLinecap="round"
            opacity="0.62"
          />
        )}

        {/* Ticks */}
        {tickAngles.map((ang, i) => {
          const x1 = cx + rTicksInner * Math.cos(ang)
          const y1 = cy - rTicksInner * Math.sin(ang)
          const x2 = cx + rTicksOuter * Math.cos(ang)
          const y2 = cy - rTicksOuter * Math.sin(ang)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={i === 0 || i === 4 ? 1.75 : 1}
              strokeLinecap="round"
            />
          )
        })}

        {/* Min / Max labels */}
        <text
          x={sx}
          y={labelY}
          fill="rgba(255,255,255,0.5)"
          fontSize="9"
          textAnchor="middle"
          fontFamily="'Unbounded', system-ui, sans-serif"
        >
          {minInHg.toFixed(2)}
        </text>
        <text
          x={ex}
          y={labelY}
          fill="rgba(255,255,255,0.5)"
          fontSize="9"
          textAnchor="middle"
          fontFamily="'Unbounded', system-ui, sans-serif"
        >
          {maxInHg.toFixed(2)}
        </text>

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#0d0d0d"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#e8fffa"
          strokeWidth="3"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
        />
        <circle cx={cx} cy={cy} r="6.5" fill="#1a1a1a" />
        <circle cx={cx} cy={cy} r="4" fill="#5ec4b5" />
        <circle cx={cx} cy={cy} r="1.8" fill="#f5fffd" />
      </svg>
    </div>
  )
}
