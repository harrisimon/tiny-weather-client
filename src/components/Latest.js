import React, { useEffect, useState } from "react"
import { getLatestWeather } from "../api/weather"
import { Button, Container, Grid, Header } from "semantic-ui-react"

const Latest = (props) => {
	const { user } = props
    const [tempMeasure,changeTempMeasure] = useState(true)

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
        if (tempMeasure == true){
            
            temp = <p className="temp">{(Math.round(weather.temperature* (9/5) + 32))} F</p>
        } else {
            
            temp = <p className="temp">{weather.temperature} C</p>
        }
		pressure = <p>{Math.round(weather.pressure * 100)/100} hpa</p>
		humidity = <p>{Math.floor(weather.humidity * 100)/100}</p>
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
                    <h4>Pressure</h4>
					<div className="reading">{pressure}</div>
				</Grid.Column>
				<Grid.Column widescreen={8}>
                    <h4>Humidity</h4>
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

            <Button onClick={() => changeTempMeasure(!tempMeasure)}>Change Temp Measure</Button>
		</Container>
	)
}

export default Latest
