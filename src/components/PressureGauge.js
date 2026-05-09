import React from "react"

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
	const clamped = Math.min(maxInHg, Math.max(minInHg, valueInHg))
	const t = maxInHg > minInHg ? (clamped - minInHg) / (maxInHg - minInHg) : 0.5

	const cx = 100
	const cy = 88
	const rTrack = 58
	const rNeedle = 48

	const theta = Math.PI * (1 - t)
	const nx = cx + rNeedle * Math.cos(theta)
	const ny = cy - rNeedle * Math.sin(theta)

	const sx = cx - rTrack
	const sy = cy
	const ex = cx + rTrack
	const ey = cy

	return (
		<div className="pressure-gauge-wrap" aria-hidden={false}>
			<svg viewBox="0 0 200 118" width="100%" height="auto" role="img" aria-label={label}>
				<title>{label}</title>
				<defs>
					<linearGradient id="pressureGaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#206b8a" />
						<stop offset="55%" stopColor="#3db8a8" />
						<stop offset="100%" stopColor="#8fd4c8" />
					</linearGradient>
				</defs>
				<path
					d={`M ${sx} ${sy} A ${rTrack} ${rTrack} 0 0 0 ${ex} ${ey}`}
					fill="none"
					stroke="url(#pressureGaugeTrack)"
					strokeWidth="10"
					strokeLinecap="round"
				/>
				<line
					x1={cx}
					y1={cy}
					x2={nx}
					y2={ny}
					stroke="#233"
					strokeWidth="3"
					strokeLinecap="round"
				/>
				<circle cx={cx} cy={cy} r="5.5" fill="#233" />
			</svg>
		</div>
	)
}
