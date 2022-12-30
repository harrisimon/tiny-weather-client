import { Container } from "semantic-ui-react"
import Latest from "./Latest"
import UserBar from "./shared/UserBar"

const Home = (props) => {
	const { msgAlert, user } = props
	

	return (
		<Container as="nav">

			<UserBar/>

			<Latest user={user} msgAlert={msgAlert} />
		</Container>
	)
}

export default Home
