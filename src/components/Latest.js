import React, { useEffect, useState } from "react"
import { getLatestWeather } from "../api/weather"
import {
	Button,
	Container,
	Grid,
	Modal,
	Card,
	Form,

} from "semantic-ui-react"
import TextareaCounter from "react-textarea-counter"
import { submitPost } from "../api/weather"

const Latest = (props) => {
	const { user, msgAlert } = props

	const [tempMeasure, changeTempMeasure] = useState(true)
	const [weather, setWeather] = useState(null)
	const [postList, setPostList] = useState(null)
	const [open, setOpen] = useState(false)
	const [openPost, setPostOpen] = useState(false)
	const [post, setPost] = useState(null)
	const [refresh, setRefresh] = useState(false)

	let temp
	let pressure
	let humidity
	let reviews
	let posttime
	let addPost

	const loadInfo = (res) => {
		// console.log("load info res reviews", res.data.weather[0].reviews)
		setWeather(res.data.weather[0])
		setPostList(res.data.weather[0].reviews.slice(0).reverse())
	}

	useEffect(() => {
		getLatestWeather()
			.then((res) => {
				// console.log("res", res.data.weather[0])
				loadInfo(res)

				// console.log("posts", postList)
			})
			.then(setRefresh(false))
		// console.log("refresh useeffect", refresh)
	}, [refresh])

	const submit = (e) => {
		e.preventDefault()

		submitPost(user, weather._id, post)
			.then(setPostOpen(false))
			.then(setRefresh(true))
			.then("refresh submit", console.log(refresh))
			.catch((error) => {
				msgAlert({
					heading: "Failure",
					message: "Create Post Failure" + error,
				})
			})
	}

	const handleChange = (e) => {
		// console.log("weather",weather._id)

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
							<TextareaCounter
								name="review"
								onChange={handleChange}
								countLimit={140}
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
		// reviews = weather.review[0]
		if (weather.reviews.length >= 1) {
			reviews = postList.map((review, index) => (
				<Card key={index}>
					<Card.Content>
						<Card.Header>
							{new Date(review.createdAt).toLocaleString("en-us")}
						</Card.Header>
					</Card.Content>
					<Card.Content className="review-text">
						{review.review}
					</Card.Content>
					<Card.Content extra>by: {review.author.email}</Card.Content>
				</Card>
			))
		} else {
			reviews = <p>No posts yet... sign in to leave a post</p>
		}
		// review = <h3>{weather.reviews[0].review}</h3>
	} else {
		return <p>...loading</p>
		// add in loading wheel
	}
	return (
		<Container>
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
					<div className="reading">{reviews}</div>
				</Card.Group>
			</div>

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
							Raspberry Pi with a weather sensor which takes a
							reading every half hour.
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
