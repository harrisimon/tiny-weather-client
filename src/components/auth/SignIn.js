import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import { signIn } from "../../api/auth"
import messages from "../shared/AutoDismissAlert/messages"
import { Button, Container, Form } from "semantic-ui-react"
// import Form from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button'

const SignIn = (props) => {
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		email: '',
	// 		password: '',
	// 	}
	// }
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const navigate = useNavigate()

	// handleChange = (event) =>
	// 	this.setState({
	// 		[event.target.name]: event.target.value,
	// 	})

	const onSignIn = (event) => {
		event.preventDefault()
		console.log("the props", props)
		const { msgAlert, setUser } = props

		const credentials = { email, password }

		signIn(credentials)
			.then((res) => setUser(res.data.user))
			.then(() =>
				msgAlert({
					heading: "Sign In Success",
					message: messages.signInSuccess,
					variant: "success",
				})
			)
			.then(() => navigate("/"))
			.catch((error) => {
				setEmail("")
				setPassword("")
				msgAlert({
					heading: "Sign In Failed with error: " + error.message,
					message: messages.signInFailure,
					variant: "danger",
				})
			})
	}

	return (
		<Container className="sign-in-form">
			<div className="sign">
				<h3>Sign In</h3>
				<Form onSubmit={onSignIn}>
					<Form.Group>
						<Form.Field>
							<Form.Input
								label="Username"
								required
								
								name="email"
								value={email}
								placeholder="Enter username"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Form.Field>
					</Form.Group>
					<Form.Group>
						{/* <label>Password</label> */}
						<Form.Field>
							<Form.Input
								required
								label="password"
								name="password"
								value={password}
								type="password"
								placeholder="Password"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Form.Field>
					</Form.Group>
					<br />
					<Button className="font" color="grey" type="submit">
						Submit
					</Button>
				</Form>
			</div>
		</Container>
	)
}

export default SignIn
