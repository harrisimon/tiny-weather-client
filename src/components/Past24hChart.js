import React from "react"
import { Line } from "react-chartjs-2"
import "chart.js/auto"
import { hPaToInHg } from "../utils/pressure"
import { computeDewPointC } from "../utils/dewpoint"
import { parseTimestamp } from "../utils/time"

const CHART_METRICS = {
	temperature: {
		title: "Past 24 Hours Temperature",
		label: (tempMeasure) =>
			tempMeasure ? "Temperature (°F)" : "Temperature (°C)",
		value: (entry, tempMeasure) =>
			tempMeasure
				? Math.round(entry.temperature * (9 / 5) + 32)
				: Math.round(entry.temperature * 10) / 10,
	},
	pressure: {
		title: "Past 24 Hours Pressure",
		label: () => "Pressure (inHg)",
		value: (entry) => Math.round(hPaToInHg(entry.pressure) * 100) / 100,
		borderColor: "#f5fffd",
		backgroundColor: "rgba(245,255,253,0.16)",
	},
	humidity: {
		title: "Past 24 Hours Humidity",
		label: () => "Humidity (%)",
		value: (entry) => Math.round(Number(entry.humidity) * 10) / 10,
		borderColor: "#7ee8d8",
		backgroundColor: "rgba(126,232,216,0.16)",
	},
	dewpoint: {
		title: "Past 24 Hours Dew Point",
		label: (tempMeasure) =>
			tempMeasure ? "Dew Point (°F)" : "Dew Point (°C)",
		value: (entry, tempMeasure) => {
			const dp = computeDewPointC(entry.temperature, entry.humidity)
			if (dp == null) return null
			return tempMeasure
				? Math.round(dp * (9 / 5) + 32)
				: Math.round(dp * 10) / 10
		},
		borderColor: "#a8d8ea",
		backgroundColor: "rgba(168,216,234,0.16)",
	},
}

export default function Past24HoursChart({
	tempMeasure = true,
	historyWeather,
	compact = false,
	metric = "temperature",
	mini = false,
}) {
	const metricConfig = CHART_METRICS[metric] || CHART_METRICS.temperature
	const data = historyWeather?.filter((entry) => {
		if (metric === "dewpoint") {
			return (
				entry.temperature != null &&
				Number.isFinite(Number(entry.temperature)) &&
				entry.humidity != null &&
				Number.isFinite(Number(entry.humidity))
			)
		}
		const key = metric === "temperature" ? "temperature" : metric
		return entry[key] != null && Number.isFinite(Number(entry[key]))
	})

	if (!data) return <p>Loading...</p>

	if (data.length === 0) return <p>No data available</p>

	const chartData = {
		labels: data.map((entry) => {
			const parsed = parseTimestamp(entry)
			return parsed
				? parsed.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})
				: ""
		}),
		datasets: [
			{
				label: metricConfig.label(tempMeasure),
				data: data.map((entry) =>
					metricConfig.value(entry, tempMeasure),
				),
				borderColor: metricConfig.borderColor,
				backgroundColor: metricConfig.backgroundColor,
				borderWidth: 2,
				tension: 0.2,
				pointRadius: 0,
			},
		],
	}

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: !compact,
		...(compact
			? {}
			: {
					aspectRatio: 2,
				}),
		layout: compact
			? { padding: { top: mini ? 0 : 4, bottom: 0, left: 0, right: 4 } }
			: undefined,
		plugins: {
			legend: {
				display: !mini,
				position: compact ? "bottom" : "top",
				labels: {
					boxWidth: compact ? 10 : 40,
					font: { size: compact ? 9 : 12 },
					padding: compact ? 6 : 12,
				},
			},
		},
		scales: {
			x: {
				display: !mini,
				ticks: {
					maxRotation: compact ? 0 : 45,
					minRotation: compact ? 0 : 45,
					autoSkip: true,
					maxTicksLimit: compact ? 6 : undefined,
					font: {
						size: compact ? 8 : 10,
					},
				},
				grid: {
					display: !compact && !mini,
				},
			},
			y: {
				ticks: {
					font: {
						size: mini ? 7 : compact ? 8 : 10,
					},
					maxTicksLimit: mini
						? metric === "temperature"
							? 4
							: 3
						: compact
							? 5
							: undefined,
				},
				grid: {
					color: compact ? "rgba(255,255,255,0.06)" : undefined,
				},
			},
		},
	}

	return (
		<div
			className={
				compact
					? `chart-container chart-container--compact chart-container--${metric}${mini ? " chart-container--mini" : ""}`
					: "chart-container"
			}
		>
			<div className="chart-inner">
				<h2
					className={
						compact
							? "chart-title chart-title--compact"
							: "chart-title"
					}
				>
					{metricConfig.title}
				</h2>
				<div
					className={
						compact
							? "chart-canvas-wrap chart-canvas-wrap--compact"
							: "chart-canvas-wrap"
					}
				>
					<Line data={chartData} options={chartOptions} />
				</div>
			</div>
		</div>
	)
}
