import React, { useRef } from "react"

const TICK_POSITIONS = [0, 0.25, 0.5, 0.75, 1]

/**
 * Semi-circular barometric gauge for inHg.
 * minInHg/maxInHg span typical sea-level-ish surface range (~28–31).
 */
export default function PressureGauge({
	valueInHg,
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

	const clamped = Math.min(maxInHg, Math.max(minInHg, valueInHg))
	const t =
		maxInHg > minInHg ? (clamped - minInHg) / (maxInHg - minInHg) : 0.5

	const cx = 100
	const cy = 92
	const rTrack = 62
	const rNeedle = 50
	const rTicksInner = rTrack - 6
	const rTicksOuter = rTrack + 2

	const theta = Math.PI * (1 - t)
	const nx = cx + rNeedle * Math.cos(theta)
	const ny = cy - rNeedle * Math.sin(theta)

	const sx = cx - rTrack
	const sy = cy
	const ex = cx + rTrack
	const ey = cy

	const tickAngles = TICK_POSITIONS.map((u) => Math.PI * (1 - u))

	return (
		<div className="pressure-gauge-wrap">
			<svg
				className="pressure-gauge-svg"
				viewBox="0 0 200 124"
				width="200"
				height="124"
				role="img"
				aria-label={label}
			>
				<title>{label}</title>
				<defs>
					<linearGradient
						id={gradId}
						gradientUnits="userSpaceOnUse"
						x1={sx}
						y1={cy - rTrack * 0.5}
						x2={ex}
						y2={cy - rTrack * 0.5}
					>
						<stop offset="0%" stopColor="#2a8faf" />
						<stop offset="50%" stopColor="#3db8a8" />
						<stop offset="100%" stopColor="#7ee8d8" />
					</linearGradient>
					<filter
						id={filterId}
						x="-40%"
						y="-40%"
						width="180%"
						height="180%"
					>
						<feDropShadow
							dx="0"
							dy="1"
							stdDeviation="1.2"
							floodColor="#000"
							floodOpacity="0.55"
						/>
					</filter>
				</defs>

				{/* Full background track — reads as one continuous arc */}
				<path
					d={`M ${sx} ${sy} A ${rTrack} ${rTrack} 0 0 0 ${ex} ${ey}`}
					fill="none"
					stroke="rgba(255,255,255,0.14)"
					strokeWidth="14"
					strokeLinecap="round"
				/>
				<path
					d={`M ${sx} ${sy} A ${rTrack} ${rTrack} 0 0 0 ${ex} ${ey}`}
					fill="none"
					stroke={`url(#${gradId})`}
					strokeWidth="10"
					strokeLinecap="round"
				/>

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
							strokeWidth={i === 0 || i === 4 ? 2 : 1.25}
							strokeLinecap="round"
						/>
					)
				})}

				<text
					x={sx - 2}
					y={cy + 18}
					fill="rgba(255,255,255,0.45)"
					fontSize="10"
					textAnchor="start"
					fontFamily="system-ui, sans-serif"
				>
					{minInHg}
				</text>
				<text
					x={ex + 2}
					y={cy + 18}
					fill="rgba(255,255,255,0.45)"
					fontSize="10"
					textAnchor="end"
					fontFamily="system-ui, sans-serif"
				>
					{maxInHg}
				</text>

				{/* Needle: bright body + dark outline for contrast on dark UI */}
				<line
					x1={cx}
					y1={cy}
					x2={nx}
					y2={ny}
					stroke="#0d0d0d"
					strokeWidth="6"
					strokeLinecap="round"
					opacity="0.85"
				/>
				<line
					x1={cx}
					y1={cy}
					x2={nx}
					y2={ny}
					stroke="#e8fffa"
					strokeWidth="3.5"
					strokeLinecap="round"
					filter={`url(#${filterId})`}
				/>
				<circle cx={cx} cy={cy} r="8" fill="#1a1a1a" />
				<circle cx={cx} cy={cy} r="5" fill="#5ec4b5" />
				<circle cx={cx} cy={cy} r="2.2" fill="#f5fffd" />
			</svg>
		</div>
	)
}
