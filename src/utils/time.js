export const getTimestampValue = (item) => {
	if (!item) return null
	return (
		item.createdAt ??
		item.measuredAt ??
		item.measured_at ??
		item.timestamp ??
		item.date ??
		null
	)
}

export const parseTimestamp = (valueOrItem) => {
	if (valueOrItem == null) return null
	const timestamp =
		typeof valueOrItem === "object"
			? getTimestampValue(valueOrItem)
			: valueOrItem
	if (timestamp == null) return null
	const date = new Date(timestamp)
	return Number.isFinite(date.getTime()) ? date : null
}

export const formatTimestamp = (valueOrItem) => {
	const date = parseTimestamp(valueOrItem)
	return date ? date.toLocaleString("en-us") : null
}

export const getTimestampMs = (valueOrItem) => {
	const date = parseTimestamp(valueOrItem)
	return date ? date.getTime() : null
}
