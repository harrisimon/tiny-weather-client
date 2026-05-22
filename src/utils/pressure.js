/** Meteorological hectopascal (hPa === mbar) to inches of mercury. */
export function hPaToInHg(hPa) {
	return hPa * 0.029529983071445
}

/** Format inHg for display (typical precision for home weather). */
export function formatInHg(hPa, decimals = 2) {
	return hPaToInHg(hPa).toFixed(decimals)
}

const DEFAULT_PRESSURE_RANGE_INHG = {
	minInHg: 28.6,
	maxInHg: 30.9,
}

const PRESSURE_RANGE_PADDING_INHG = 0.15

export function computePressureGaugeRangeInHg(currentHpa, history) {
	const values = []

	if (currentHpa != null && Number.isFinite(Number(currentHpa))) {
		values.push(hPaToInHg(Number(currentHpa)))
	}

	if (history && history.length) {
		history.forEach((entry) => {
			if (entry.pressure != null && Number.isFinite(Number(entry.pressure))) {
				values.push(hPaToInHg(Number(entry.pressure)))
			}
		})
	}

	if (!values.length) return DEFAULT_PRESSURE_RANGE_INHG

	return {
		minInHg: Math.min(...values) - PRESSURE_RANGE_PADDING_INHG,
		maxInHg: Math.max(...values) + PRESSURE_RANGE_PADDING_INHG,
	}
}

/** Compare current reading to nearest older history point for trend arrow. */
export function computePressureTrendHpa(currentHpa, currentCreatedAt, history) {
	if (!history || !history.length || currentHpa == null) return null
	const curr = new Date(currentCreatedAt).getTime()
	const older = [...history]
		.filter((e) => new Date(e.createdAt).getTime() < curr)
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)[0]
	if (!older || older.pressure == null) return null

	const delta = Number(currentHpa) - Number(older.pressure)
	const epsHPa = 0.35
	if (delta > epsHPa) return "rising"
	if (delta < -epsHPa) return "falling"
	return "steady"
}
