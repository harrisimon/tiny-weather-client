import React from "react"
import UserBar from "../shared/UserBar"
import { Container, Header, Icon, Button } from "semantic-ui-react"
import { Link } from "react-router-dom"

const User = (props) => {
	const { msgAlert, user } = props
	let bunny
	let buttons
	if (user === null) {
        buttons =
		<>
			
			<Link to="/sign-up">
				<Button className="usr-btn" size="huge">
					Sign Up
				</Button>
			</Link>
			<Link to="/sign-in">
				<Button size="huge" className="usr-btn">
					Sign In
				</Button>
			</Link>
		</>
	} 
	return (
		<Container as="nav">
			<UserBar />
			<div className="user-buttons">
			{buttons}

				<Link to="/sign-out">
					<Button size="huge" className="usr-btn">
						Sign Out
					</Button>
				</Link>
			</div>
		</Container>
	)
}

export default User
