import { Container, Header, Icon, Button } from "semantic-ui-react"
import Latest from "./Latest"
import UserBar from "./shared/UserBar"

const Home = (props) => {
	const { msgAlert, user } = props
	console.log("props in home", props)

	return (
		<Container as="nav">

			<UserBar
			
			/>

			<Latest user={user} msgAlert={msgAlert} />
		</Container>
	)
}

export default Home
