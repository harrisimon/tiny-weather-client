// import React, { Component } from 'react'
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import { signUp, signIn } from "../../api/auth"
import messages from "../shared/AutoDismissAlert/messages"

import { Form, Button, Container } from "semantic-ui-react"
// import Form from 'react-bootstrap/Form'
// import Button from "react-bootstrap/Button"

const SignUp = (props) => {
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		email: '',
	// 		password: '',
	// 		passwordConfirmation: '',
	// 	}
	// }
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirmation, setPasswordConfirmation] = useState("")

	const navigate = useNavigate()

	const onSignUp = (event) => {
		event.preventDefault()

		const { msgAlert, setUser } = props

		const credentials = { email, password, passwordConfirmation }

		signUp(credentials)
			.then(() => signIn(credentials))
			.then((res) => setUser(res.data.user))
			.then(() =>
				msgAlert({
					heading: "Sign Up Success",
					message: messages.signUpSuccess,
					
				})
			)
			.then(() => navigate("/"))
			.catch((error) => {
				setEmail("")
				setPassword("")
				setPasswordConfirmation("")
				msgAlert({
					heading: "Sign Up Failed with error: " + error.message,
					message: messages.signUpFailure,
					
				})
			})
	}

	return (
		<div className="row">
			<div className="sign">
				<h3>Sign Up</h3>
                <Container>
                    <h4>Post Kindly!</h4>
                    <p className="warning">Posts will only appear for every half hour weather reading, after the reading updates posts written will no longer appear. Please do not post any identifying information, slander, or anything generally unkind. <br/>Happy posting!</p>
                </Container>
                <br/>
				<Form onSubmit={onSignUp}>
					<Form.Group >
						
						<Form.Field>
							<Form.Input
								required
                                label='Username'
								name="email"
								value={email}
								placeholder="Enter username"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Form.Field>
					</Form.Group>
					<Form.Group >
						
						<Form.Field>
							<Form.Input
                            label='Password'
								required
								name="password"
								value={password}
								type='password'
								placeholder="Password"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Form.Field>
					</Form.Group>
					<Form.Group >
						
						<Form.Field>
							<Form.Input
                            label='Password Confirmation'
								required
                                type="password"
								name="passwordConfirmation"
								value={passwordConfirmation}
								placeholder="Confirm Password"
								onChange={(e) =>
									setPasswordConfirmation(e.target.value)
								}
							/>
						</Form.Field>
					</Form.Group>
                        <br/>
					<Button  className="font" color="grey"
                    type="submit">
						Submit
					</Button>
				</Form>
			</div>
		</div>
	)
}

export default SignUp
