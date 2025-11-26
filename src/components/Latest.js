import React, { useState } from "react"
import {
	Button,
	Container,
	Grid,
	Modal,
	Card,
	Form,
	TextArea,
} from "semantic-ui-react"

import { submitPost } from "../api/weather"
import CardStack from "./CardStack"
import { useNavigate } from "react-router-dom"
import Past24HoursChart from "./Past24hChart"

const Latest = (props) => {
	const { user, msgAlert, weather, postList, showChart, toggleChart } = props
	const navigate = useNavigate()

	const [tempMeasure, changeTempMeasure] = useState(true)
	const [open, setOpen] = useState(false)
	const [openPost, setPostOpen] = useState(false)
	const [post, setPost] = useState(null)
	const [refresh, setRefresh] = useState(0)

	let temp
	let pressure
	let humidity
	let posttime
	let addPost

	const submit = (e) => {
		e.preventDefault()

		submitPost(user, weather._id, post)
			// .then(setRefresh(true))
			.then(setPostOpen(false))

			// .then("refresh submit", console.log(refresh))
			.then(() => navigate(0))
			// .then(()=>triggerRefresh())
			.catch((error) => {
				msgAlert({
					heading: "Failure",
					message: "Create Post Failure" + error,
				})
			})
		setRefresh((old) => old + 1)
	}

	const handleChange = (e) => {
		setPost((prevPost) => {
			const updatedName = e.target.name
			let updatedValue = e.target.value

			const updatedPost = { [updatedName]: updatedValue }
			return { ...prevPost, ...updatedPost }
		})
	}
	if (user !== null) {
		addPost = (
			<>
				<Modal
					onClose={() => setPostOpen(false)}
					onOpen={() => setPostOpen(true)}
					open={openPost}
					trigger={
						<Button color="teal" className="font">
							Add a Post
						</Button>
					}
				>
					<Modal.Header>Add a Post</Modal.Header>
					<Modal.Content>
						<Form onSubmit={submit}>
							<TextArea
								name="review"
								onChange={handleChange}
								className="review-box"
								placeholder="A poem just came to mind..."
							/>
							<Modal.Actions>
								<Button type="submit">Post</Button>
							</Modal.Actions>
						</Form>
					</Modal.Content>
				</Modal>
			</>
		)
	}

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
			<h3>Posts</h3>

			<div className="reviews">
				<Card.Group centered>
					<div className="reading">
						{/* {reviews} */}

						<CardStack weather={weather} postList={postList} />
					</div>
				</Card.Group>
			</div>

			{/* NEW: chart toggle button + chart, BEFORE the .buttons div */}
			<Button
				primary
				className="font"
				onClick={toggleChart}
				style={{ marginTop: "1rem", marginBottom: "1rem" }}
			>
				{showChart ? "Hide Past 24 Hours" : "Show Past 24 Hours"}
			</Button>

			{showChart && (
				<div style={{ marginBottom: "120px" }}>
					<Past24HoursChart />
				</div>
			)}

			<div className="buttons">
				{addPost}

				<Button
					className="font"
					color="grey"
					onClick={() => changeTempMeasure(!tempMeasure)}
				>
					Change Temp Measure
				</Button>
				<Modal
					onClose={() => setOpen(false)}
					onOpen={() => setOpen(true)}
					open={open}
					trigger={
						<Button color="black" className="font">
							About this site
						</Button>
					}
				>
					<Modal.Header className="temp">
						About Tiny Weather
					</Modal.Header>
					<Modal.Content>
						Tiny Weather is a site created by
						<a href="https://harrison-simon.netlify.app/">
							{" "}
							Harrison Simon
						</a>
						. The data presented on the site are gathered from a
						Raspberry Pi with a weather sensor which takes a reading
						every half hour.
						<br />
						<h3>About the readings</h3>
						The readings are taken from a{" "}
						<a href="https://www.adafruit.com/product/2652">
							BME 280 sensor
						</a>
						. Currently the humity sensor seems to be taking
						incorrect readings.
						<br />
						More features coming soon...
					</Modal.Content>
				</Modal>
			</div>
		</Container>
	)
}

export default Latest
