/** Meteorological hectopascal (hPa === mbar) to inches of mercury. */
export function hPaToInHg(hPa) {
	return hPa * 0.029529983071445
}

/** Format inHg for display (typical precision for home weather). */
export function formatInHg(hPa, decimals = 2) {
	return hPaToInHg(hPa).toFixed(decimals)
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
