import { Container, Segment, Grid, Header } from "semantic-ui-react"
import Latest from "./Latest"


const Home = (props) => {
	const { msgAlert, user } = props
	console.log('props in home', props)

	return (
		<Container as="nav">
			<Header inverted><span className="tiny">Tiny</span> <span className="title">Weather</span></Header>
			
			<Latest user={user}/>
		</Container>
	)
}

export default Home
