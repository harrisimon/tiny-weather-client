import React from "react"
import { Container, Card } from "semantic-ui-react"

import CardStack from "./CardStack"
import Past24HoursChart from "./Past24hChart"
import PressureGauge from "./PressureGauge"
import {
	computePressureTrendHpa,
	formatInHg,
	hPaToInHg,
} from "../utils/pressure"

const Latest = (props) => {
	const {
		weather,
		history24h,
		postList,
		showChart,
		tempMeasure,
	} = props

	let temp
	let pressure
	let humidity
	let humidityValue
	let humidityStatus
	let posttime
	let pressureTrendNotice

	if (weather !== null && postList !== null) {
		let time = new Date(weather.createdAt).toLocaleString("en-us")
		if (tempMeasure === true) {
			temp = (
				<p className="temp">
					{Math.round(weather.temperature * (9 / 5) + 32)}° F
				</p>
			)
		} else {
			temp = <p className="temp">{weather.temperature}° C</p>
		}
		pressure = formatInHg(weather.pressure)
		humidityValue = Math.min(100, Math.max(0, Number(weather.humidity) || 0))
		humidity = humidityValue.toFixed(1).replace(/\.0$/, "")
		humidityStatus =
			humidityValue < 30 ? "Dry" : humidityValue < 60 ? "Comfortable" : "Humid"
		posttime = <p>{time}</p>

		if (history24h == null) {
			pressureTrendNotice = "Trend loading…"
		} else {
			const dir = computePressureTrendHpa(
				weather.pressure,
				weather.createdAt,
				history24h
			)
			const word = {
				rising: "Rising",
				falling: "Falling",
				steady: "Steady",
			}
			const glyph = {
				rising: "↑",
				falling: "↓",
				steady: "→",
			}
			pressureTrendNotice = dir
				? `${word[dir]} ${glyph[dir]}`
				: "Need an earlier sample to compare"
		}
	} else {
		return <p>...loading</p>
		// add in loading wheel
	}
	return (
		<Container
			className="latest-container"
			style={{ paddingBottom: showChart ? "0.5rem" : "0" }}
		>
			<div className="dashboard-overview">
				<section className="dash-cell dash-temp">
					<h4>Temp</h4>
					<div className="reading dash-temp-reading">{temp}</div>
				</section>
				<section className="dash-cell dash-pressure">
					<h4>Pressure</h4>
					<PressureGauge
						valueInHg={hPaToInHg(weather.pressure)}
						label={`Barometric pressure ${pressure} inHg`}
					/>
					<div className="reading reading--pressure-value">
						{pressure}{" "}
						<span className="pressure-unit">inHg</span>
					</div>
					<p className="pressure-trend" aria-live="polite">
						{pressureTrendNotice}
					</p>
				</section>
				<section className="dash-cell dash-humidity">
					<h4>Humidity</h4>
					<div
						className="humidity-meter"
						style={{ "--humidity-level": `${humidityValue}%` }}
						aria-label={`Relative humidity ${humidity}%`}
					>
						<div className="humidity-meter__track">
							<span className="humidity-meter__fill" />
						</div>
					</div>
					<div className="reading dash-humidity-reading">
						<p>
							{humidity}
							<span className="humidity-unit">%</span>
						</p>
					</div>
					<p className="humidity-status">{humidityStatus}</p>
				</section>
			</div>

			<div className="dash-meta">
				<small>The last reading was taken</small>
				<div>{posttime}</div>
			</div>

			{postList && postList.length > 0 && <h3>Posts</h3>}

			{postList && postList.length > 0 && (
				<div className="reviews reviews--home">
					<Card.Group centered>
						<div className="reading">
							<CardStack weather={weather} postList={postList} />
						</div>
					</Card.Group>
				</div>
			)}

			{showChart && (
				<Past24HoursChart
					tempMeasure={tempMeasure}
					historyWeather={history24h}
					compact
				/>
			)}
		</Container>
	)
}

export default Latest
