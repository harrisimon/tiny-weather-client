import React, { useEffect, useState } from "react"
import { getLatestWeather } from "../api/weather"
import { Button, Container, Grid, Header, Modal, Card, Form } from "semantic-ui-react"
import TextareaCounter from 'react-textarea-counter';

const Latest = (props) => {
	const { user } = props
	const [tempMeasure, changeTempMeasure] = useState(true)

	const [weather, setWeather] = useState(null)
	const [open, setOpen] = useState(false)
	const [openPost, setPostOpen] = useState(false)
    const [post, setPost] = useState(null)
	useEffect(() => {
		getLatestWeather().then((res) => {
			setWeather(res.data.weather[0])
			
		})
	}, [])

	let temp
	let pressure
	let humidity
	let reviews
	let posttime
    let addPost
    
    const handleChange = (e) => {
        
        setPost((prevPost) =>{
            const updatedName = e.target.name
            let updatedValue = e.target.value

            const updatedPost = {[updatedName]:updatedValue}
            return {...prevPost, ...updatedPost}
            
        })
        console.log(post)
    }
    if (user === null) {
        console.log('logged in')
        addPost =  <Modal
        onClose={() => setPostOpen(false)}
        onOpen={() => setPostOpen(true)}
        open={openPost}
        trigger ={
        <Button color='teal'
        className="font" >
            Add a Post
        </Button>
        }
        >
            <Modal.Header>
                Add a Post
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <TextareaCounter 
                    name="review"
                    onChange={handleChange}
                    // value={post}
                    countLimit={140} 
                    placeholder='A poem just came to mind...'
                     />
                </Form>
            </Modal.Content>
            <Modal.Actions>

            <Button>Post</Button>
            </Modal.Actions>
        
        </Modal>
            
        
    } else {
        console.log('not logged in')
    }
	if (weather !== null) {
		console.log(weather)
		let time = new Date(weather.createdAt).toLocaleString("en-us")
		if (tempMeasure == true) {
			temp = (
				<p className="temp">
					{Math.round(weather.temperature * (9 / 5) + 32)} F
				</p>
			)
		} else {
			temp = <p className="temp">{weather.temperature} C</p>
		}
		pressure = Math.round(weather.pressure * 100) / 100
		humidity = <p>{Math.floor(weather.humidity * 100) / 100}</p>
		posttime = <p>{time}</p>
		// reviews = weather.review[0]
		reviews = weather.reviews.map((review, index) => (
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
		// review = <h3>{weather.reviews[0].review}</h3>
	} else {
		;<p>...loading</p>
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
					<div className="reading">{pressure} hPa</div>
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
				</Grid.Row>
			</Grid>
				<h3>Posts</h3>
			<Container className="reviews">
				<Card.Group centered>
					<div className="reading">{reviews}</div>
				</Card.Group>
			</Container>
			{/* <Button.Group> */}
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
						<p>
							Tiny Weather is a site created by{" "}
							<a href="https://harrison-simon.netlify.app/">
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
						</p>
					</Modal.Content>
				</Modal>
			</div>

			{/* </Button.Group> */}
		</Container>
	)
}

export default Latest
