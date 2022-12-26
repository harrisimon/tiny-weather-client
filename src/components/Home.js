import Latest from "./Latest"


const Home = (props) => {
	const { msgAlert, user } = props
	console.log('props in home', props)

	return (
		<>
		
			<h2>Home Page</h2>
			<Latest user={user}/>
		</>
	)
}

export default Home
