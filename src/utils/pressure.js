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

const PRESSURE_GAUGE_SPAN_INHG = 1.1
const PRESSURE_CHANGE_WINDOW_MS = 3 * 60 * 60 * 1000

export function computePressureGaugeRangeInHg(
	currentHpa,
	history,
	currentCreatedAt
) {
	const values = []
	const currentTime = new Date(currentCreatedAt).getTime()
	const hasCurrentTime = Number.isFinite(currentTime)

	if (currentHpa != null && Number.isFinite(Number(currentHpa))) {
		values.push(hPaToInHg(Number(currentHpa)))
	}

	if (history && history.length) {
		history.forEach((entry) => {
			const createdAt = new Date(entry.createdAt).getTime()
			const isRecent =
				!hasCurrentTime ||
				(createdAt <= currentTime &&
					createdAt >= currentTime - PRESSURE_CHANGE_WINDOW_MS)
			if (
				isRecent &&
				entry.pressure != null &&
				Number.isFinite(Number(entry.pressure))
			) {
				values.push(hPaToInHg(Number(entry.pressure)))
			}
		})
	}

	if (!values.length) return DEFAULT_PRESSURE_RANGE_INHG

	const low = Math.min(...values)
	const high = Math.max(...values)
	const center = (low + high) / 2
	const halfSpan = PRESSURE_GAUGE_SPAN_INHG / 2

	return {
		minInHg: center - halfSpan,
		maxInHg: center + halfSpan,
	}
}

export function findPreviousPressureHpa(currentCreatedAt, history) {
	if (!history || !history.length) return null
	const curr = new Date(currentCreatedAt).getTime()
	const older = [...history]
		.filter((e) => {
			const createdAt = new Date(e.createdAt).getTime()
			return (
				createdAt < curr &&
				e.pressure != null &&
				Number.isFinite(Number(e.pressure))
			)
		})
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)[0]

	if (!older || older.pressure == null) return null
	return Number(older.pressure)
}

export function findPressureChangeStartHpa(currentCreatedAt, history) {
	if (!history || !history.length) return null
	const curr = new Date(currentCreatedAt).getTime()
	if (!Number.isFinite(curr)) return null
	const start = curr - PRESSURE_CHANGE_WINDOW_MS

	const recent = [...history]
		.filter((e) => {
			const createdAt = new Date(e.createdAt).getTime()
			return (
				createdAt < curr &&
				createdAt >= start &&
				e.pressure != null &&
				Number.isFinite(Number(e.pressure))
			)
		})
		.sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		)[0]

	if (recent && recent.pressure != null) return Number(recent.pressure)
	return findPreviousPressureHpa(currentCreatedAt, history)
}

/** Compare current reading to nearest older history point for trend arrow. */
export function computePressureTrendHpa(currentHpa, currentCreatedAt, history) {
	if (!history || !history.length || currentHpa == null) return null
	const previousPressure = findPreviousPressureHpa(currentCreatedAt, history)
	if (previousPressure == null) return null

	const delta = Number(currentHpa) - previousPressure
	const epsHPa = 0.35
	if (delta > epsHPa) return "rising"
	if (delta < -epsHPa) return "falling"
	return "steady"
}
