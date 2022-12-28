import { Container, Segment, Grid, Header } from "semantic-ui-react"
import Latest from "./Latest"


const Home = (props) => {
	const { msgAlert, user } = props
	console.log('props in home', props)

	return (
		<Container as="nav">
			<Header inverted><h2 className="reading">Tiny Weather</h2></Header>
			
			<Latest user={user}/>
		</Container>
	)
}

export default Home
