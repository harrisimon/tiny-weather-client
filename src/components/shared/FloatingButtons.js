import React, { useState } from "react"
import { Button, Modal, Form, TextArea } from "semantic-ui-react"
import { submitPost } from "../../api/weather"
import { useNavigate } from "react-router-dom"

const FloatingButtons = (props) => {
	const { user, msgAlert, weather, onTempMeasureChange } = props
	const navigate = useNavigate()

	const [open, setOpen] = useState(false)
	const [openPost, setPostOpen] = useState(false)
	const [post, setPost] = useState(null)

	const submit = (e) => {
		e.preventDefault()

		submitPost(user, weather._id, post)
			.then(setPostOpen(false))
			.then(() => navigate(0))
			.catch((error) => {
				msgAlert({
					heading: "Failure",
					message: "Create Post Failure" + error,
				})
			})
	}

	const handleChange = (e) => {
		setPost((prevPost) => {
			const updatedName = e.target.name
			let updatedValue = e.target.value

			const updatedPost = { [updatedName]: updatedValue }
			return { ...prevPost, ...updatedPost }
		})
	}

	const changeTempMeasure = () => {
		if (onTempMeasureChange) {
			onTempMeasureChange((prev) => !prev)
		}
	}

	return (
		<div className="floating-buttons">
			{user !== null && (
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
			)}

			<Button
				className="font"
				color="grey"
				onClick={changeTempMeasure}
			>
				Change Temp Measure
			</Button>

			<Button
				color="black"
				className="font"
				onClick={() => setOpen(!open)}
			>
				About this site
			</Button>

			<Modal
				onClose={() => setOpen(false)}
				open={open}
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
	)
}

export default FloatingButtons

