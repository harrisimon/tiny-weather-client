const MAGNUS_A = 17.625
const MAGNUS_B = 243.04

export function computeDewPointC(temperatureC, relativeHumidity) {
	if (
		temperatureC == null ||
		relativeHumidity == null ||
		!Number.isFinite(Number(temperatureC)) ||
		!Number.isFinite(Number(relativeHumidity))
	) {
		return null
	}

	const t = Number(temperatureC)
	const rh = Math.min(100, Math.max(0, Number(relativeHumidity)))
	if (rh <= 0) return null

	const alpha = Math.log(rh / 100) + (MAGNUS_A * t) / (MAGNUS_B + t)
	return (MAGNUS_B * alpha) / (MAGNUS_A - alpha)
}

export function dewPointComfortLabel(dewPointC) {
	if (dewPointC == null || !Number.isFinite(dewPointC)) return null
	if (dewPointC < 10) return "Dry"
	if (dewPointC < 16) return "Comfortable"
	if (dewPointC < 18) return "Pleasant"
	if (dewPointC < 21) return "Sticky"
	if (dewPointC < 24) return "Muggy"
	return "Oppressive"
}
