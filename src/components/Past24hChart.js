import React from "react"
import { Line } from "react-chartjs-2"
import "chart.js/auto"

export default function Past24HoursChart({
	tempMeasure = true,
	historyWeather,
	compact = false,
}) {
	const data = historyWeather

	if (!data) return <p>Loading...</p>

	if (data.length === 0) return <p>No data available</p>

	const chartData = {
		labels: data.map((entry) =>
			new Date(entry.createdAt).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})
		),
		datasets: [
			{
				label: tempMeasure ? "Temperature (°F)" : "Temperature (°C)",
				data: data.map((entry) => {
					// Convert to Fahrenheit if tempMeasure is true, otherwise use Celsius
					return tempMeasure
						? Math.round(entry.temperature * (9 / 5) + 32)
						: Math.round(entry.temperature * 10) / 10 // Round to 1 decimal for Celsius
				}),
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
			? { padding: { top: 4, bottom: 0, left: 0, right: 4 } }
			: undefined,
		plugins: {
			legend: {
				display: true,
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
					display: !compact,
				},
			},
			y: {
				ticks: {
					font: {
						size: compact ? 8 : 10,
					},
					maxTicksLimit: compact ? 5 : undefined,
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
				compact ? "chart-container chart-container--compact" : "chart-container"
			}
		>
			<div className="chart-inner">
				<h2
					className={
						compact ? "chart-title chart-title--compact" : "chart-title"
					}
				>
					Past 24 Hours Temperature
				</h2>
				<div className={compact ? "chart-canvas-wrap chart-canvas-wrap--compact" : "chart-canvas-wrap"}>
					<Line data={chartData} options={chartOptions} />
				</div>
			</div>
		</div>
	)
}
