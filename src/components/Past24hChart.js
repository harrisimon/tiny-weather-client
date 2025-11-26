import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import "chart.js/auto"
import { get24HourHistory } from "../api/weather"

export default function Past24HoursChart() {
	const [data, setData] = useState(null)

	useEffect(() => {
		get24HourHistory()
			.then((res) => {
				console.log("Chart data response:", res.data) // Debug log
				setData(res.data.weather) // We know the structure is { weather: [...] }
			})
			.catch((err) => {
				console.error("Failed to load 24h history", err)
				setData([]) // fallback to empty array on error
			})
	}, [])

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
				label: "Temperature (°F)",
				data: data.map((entry) => {
					// Convert Celsius to Fahrenheit
					return Math.round(entry.temperature * (9 / 5) + 32)
				}),
				borderWidth: 2,
				tension: 0.2,
				pointRadius: 0,
			},
		],
	}

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: true,
		aspectRatio: 2,
		plugins: {
			legend: {
				display: true,
				position: 'top',
			},
		},
		scales: {
			x: {
				ticks: {
					maxRotation: 45,
					minRotation: 45,
					font: {
						size: 10
					}
				}
			},
			y: {
				ticks: {
					font: {
						size: 10
					}
				}
			}
		}
	}

	return (
		<div className="chart-container">
			<div className="chart-inner">
				<h2 className="chart-title">Past 24 Hours Temperature</h2>
				<Line data={chartData} options={chartOptions} />
			</div>
		</div>
	)
}
