import React, { useState } from "react"
import { Button, Container, Grid, Card } from "semantic-ui-react"

import CardStack from "./CardStack"
import Past24HoursChart from "./Past24hChart"
import FloatingButtons from "./shared/FloatingButtons"

const Latest = (props) => {
	const { user, msgAlert, weather, postList, showChart, toggleChart } = props

	const [tempMeasure, setTempMeasure] = useState(true)

	let temp
	let pressure
	let humidity
	let posttime

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
		pressure = Math.round(weather.pressure * 100) / 100
		humidity = <p>{Math.floor(weather.humidity * 100) / 100}</p>
		posttime = <p>{time}</p>
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
					<div className="reading">{pressure} hPa</div>
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

			{showChart && <Past24HoursChart tempMeasure={tempMeasure} />}

			<FloatingButtons
				user={user}
				msgAlert={msgAlert}
				weather={weather}
				onTempMeasureChange={setTempMeasure}
			/>
		</Container>
	)
}

export default Latest
