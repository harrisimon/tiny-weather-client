import React from "react"
import { Button, Container, Grid, Card } from "semantic-ui-react"

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
		toggleChart,
		tempMeasure,
	} = props

	let temp
	let pressure
	let humidity
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
		humidity = <p>{Math.floor(weather.humidity * 100) / 100}</p>
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
		<Container style={{ paddingBottom: showChart ? "120px" : "0" }}>
			<Grid>
				<Grid.Row>
					<Grid.Column width={16}>
						<div className="temp-label">
							<h4>Temp</h4>
						</div>
						<div className="reading">{temp}</div>
					</Grid.Column>
				</Grid.Row>
				<Grid.Column width={8}>
					<h4>Pressure</h4>
					<PressureGauge
						valueInHg={hPaToInHg(weather.pressure)}
						label={`Barometric pressure ${pressure} inHg`}
					/>
					<div className="reading">
						{pressure} <span className="pressure-unit">inHg</span>
					</div>
					<p
						className="pressure-trend"
						aria-live="polite"
					>
						{pressureTrendNotice}
					</p>
				</Grid.Column>
				<Grid.Column widescreen={8}>
					<h4>Humidity</h4>
					<div className="reading">{humidity}</div>
				</Grid.Column>
				<Grid.Row>
					<Grid.Column width={16}>
						<small>The last reading was taken</small>

						<div>{posttime}</div>
					</Grid.Column>
				</Grid.Row>
			</Grid>
			{postList && postList.length > 0 && <h3>Posts</h3>}

			{postList && postList.length > 0 && (
				<div className="reviews">
					<Card.Group centered>
						<div className="reading">
							{/* {reviews} */}

							<CardStack weather={weather} postList={postList} />
						</div>
					</Card.Group>
				</div>
			)}

			{/* NEW: chart toggle button + chart, BEFORE the floating buttons */}
			<Button
				primary
				className="font"
				onClick={toggleChart}
				style={{ marginTop: "1rem", marginBottom: "1rem" }}
			>
				{showChart ? "Hide Past 24 Hours" : "Show Past 24 Hours"}
			</Button>

			{showChart && (
				<Past24HoursChart
					tempMeasure={tempMeasure}
					historyWeather={history24h}
				/>
			)}
		</Container>
	)
}

export default Latest
