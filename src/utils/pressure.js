import { getTimestampMs } from "./time"

/** Meteorological hectopascal (hPa === mbar) to inches of mercury. */
export function hPaToInHg(hPa) {
	return hPa * 0.029529983071445
}

/** Format inHg for display (typical precision for home weather). */
export function formatInHg(hPa, decimals = 2) {
	return hPaToInHg(hPa).toFixed(decimals)
}

const DEFAULT_PRESSURE_RANGE_INHG = {
	minInHg: 29.0,
	maxInHg: 30.6,
}

const PRESSURE_CHANGE_WINDOW_MS = 12 * 60 * 60 * 1000

export function computePressureGaugeRangeInHg() {
	return DEFAULT_PRESSURE_RANGE_INHG
}

export function findPreviousPressureHpa(currentCreatedAt, history) {
	if (!history || !history.length) return null
	const curr = getTimestampMs(currentCreatedAt)
	if (!Number.isFinite(curr)) return null
	const older = [...history]
		.filter((e) => {
			const createdAt = getTimestampMs(e)
			return (
				createdAt != null &&
				createdAt < curr &&
				e.pressure != null &&
				Number.isFinite(Number(e.pressure))
			)
		})
		.sort((a, b) => getTimestampMs(b) - getTimestampMs(a))[0]

	if (!older || older.pressure == null) return null
	return Number(older.pressure)
}

export function findPressureChangeStartHpa(currentCreatedAt, history) {
	if (!history || !history.length) return null
	const curr = getTimestampMs(currentCreatedAt)
	if (!Number.isFinite(curr)) return null
	const start = curr - PRESSURE_CHANGE_WINDOW_MS

	const recent = [...history]
		.filter((e) => {
			const createdAt = getTimestampMs(e)
			return (
				createdAt != null &&
				createdAt < curr &&
				createdAt >= start &&
				e.pressure != null &&
				Number.isFinite(Number(e.pressure))
			)
		})
		.sort((a, b) => getTimestampMs(a) - getTimestampMs(b))[0]

	if (recent && recent.pressure != null) return Number(recent.pressure)
	return findPreviousPressureHpa(currentCreatedAt, history)
}

export function computePressureChangeWindowHpa(
	currentHpa,
	currentCreatedAt,
	history,
) {
	if (currentHpa == null) return null
	const startPressure = findPressureChangeStartHpa(currentCreatedAt, history)
	if (startPressure == null) return null
	return Number(currentHpa) - startPressure
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
