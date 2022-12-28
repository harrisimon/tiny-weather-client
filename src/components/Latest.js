import React, { useEffect, useState } from "react"
import { getLatestWeather } from "../api/weather"
import { Container, Grid, Header } from "semantic-ui-react"

const Latest = (props) => {
	const { user } = props

	const [weather, setWeather] = useState(null)
	useEffect(() => {
		getLatestWeather().then((res) => {
			// console.log(res.data.weather)
			setWeather(res.data.weather[0])
		})
	}, [])
	// console.log(weather)
	let temp
	let pressure
	let humidity
	let review
	let posttime

	if (weather !== null) {
		let time = new Date(weather.createdAt).toLocaleString("en-us")
		temp = <p>{weather.temperature} C</p>
		pressure = <p>{weather.pressure} hpa</p>
		humidity = <p>{weather.humidity} humidity</p>
		posttime = <p>{time}</p>
		// review = <h3>{weather.reviews[0].review}</h3>
	} else {
		;<h1>...loading</h1>
		// add in loading wheel
	}
	return (
		<Container>
			<Grid>
				<Grid.Row>
					<Grid.Column width={16}>
                        <h4>Temp</h4>
						<div className="reading">{temp}</div>
					</Grid.Column>
				</Grid.Row>
				<Grid.Column width={8}>
					<div className="reading">{pressure}</div>
				</Grid.Column>
				<Grid.Column widescreen={8}>
					<div className="reading">{humidity}</div>
				</Grid.Column>
				<Grid.Row>
                    <Grid.Column width={16}>

					<small>The last reading was taken</small>

					<div className="reading">{posttime}</div>
                    </Grid.Column>
					<div className="reading">{review}</div>

				</Grid.Row>
			</Grid>
		</Container>
	)
}

export default Latest
