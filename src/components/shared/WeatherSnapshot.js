import React from "react"
import { formatInHg } from "../../utils/pressure"
import { computeDewPointC } from "../../utils/dewpoint"
import { formatTimestamp } from "../../utils/time"

const formatHumidity = (humidity) => {
	const value = Number(humidity)
	if (!Number.isFinite(value)) return null
	return value.toFixed(1).replace(/\.0$/, "")
}

const formatTemperature = (temperature) => {
	const value = Number(temperature)
	if (!Number.isFinite(value)) return null
	return `${Math.round(value * (9 / 5) + 32)}° F`
}

const WeatherSnapshot = ({ weather }) => {
	if (!weather) return null

	const temperature = formatTemperature(weather.temperature)
	const pressure =
		weather.pressure == null || !Number.isFinite(Number(weather.pressure))
			? null
			: `${formatInHg(weather.pressure)} inHg`
	const humidity = formatHumidity(weather.humidity)
	const dewPoint = computeDewPointC(weather.temperature, weather.humidity)
	const dewPointDisplay =
		dewPoint != null ? `${Math.round(dewPoint * (9 / 5) + 32)}° F` : null
	const readingTime = formatTimestamp(weather)

	return (
		<div className="weather-snapshot">
			{temperature && (
				<div>
					<span>Temp</span>
					<strong>{temperature}</strong>
				</div>
			)}
			{pressure && (
				<div>
					<span>Pressure</span>
					<strong>{pressure}</strong>
				</div>
			)}
			{humidity && (
				<div>
					<span>Humidity</span>
					<strong>{humidity}%</strong>
				</div>
			)}
			{dewPointDisplay && (
				<div>
					<span>Dew Point</span>
					<strong>{dewPointDisplay}</strong>
				</div>
			)}
			{readingTime && (
				<div className="weather-snapshot__time">
					<span>Reading</span>
					<strong>{readingTime}</strong>
				</div>
			)}
		</div>
	)
}

export default WeatherSnapshot
