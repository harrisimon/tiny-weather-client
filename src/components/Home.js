import React, {useState} from "react"
import { Container } from "semantic-ui-react"
import Latest from "./Latest"
import UserBar from "./shared/UserBar"

const Home = (props) => {
	const { msgAlert, user } = props
	const [refresh, setRefresh] = useState(false)
	
	

	return (
		<Container as="nav">

			<UserBar/>

			<Latest user={user} msgAlert={msgAlert} refresh={refresh} triggerRefresh={()=> setRefresh(prev => !prev)} />
		</Container>
	)
}

export default Home
