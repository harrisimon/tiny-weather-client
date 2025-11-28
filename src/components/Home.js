import React, { useState, useEffect } from "react"
import { Container } from "semantic-ui-react"
import { getLatestWeather } from "../api/weather"
import Latest from "./Latest"
import UserBar from "./shared/UserBar"

const Home = (props) => {
	const { msgAlert, user } = props
	const [refresh, setRefresh] = useState(false)
	const [weather, setWeather] = useState(null)
	const [postList, setPostList] = useState(null)
	const [showChart, setShowChart] = useState(true)

	const loadInfo = (res) => {
		// console.log("load info res reviews", res.data.weather[0].reviews)
		setWeather(res.data.weather[0])
		setPostList(res.data.weather[0].reviews.slice(0).reverse())
	}
	useEffect(() => {
		getLatestWeather().then((res) => {
			console.log("res", res.data.weather[0])
			loadInfo(res)
			// console.log("posts", postList)
		})

		// .then(setRefresh(false))

		// console.log("refresh useeffect", refresh)
	}, [refresh])

	return (
		<Container as="nav">
			<UserBar />

			<Latest
				user={user}
				msgAlert={msgAlert}
				refresh={refresh}
				triggerRefresh={() => setRefresh((prev) => !prev)}
				weather={weather}
				postList={postList}
				showChart={showChart}
				toggleChart={() => setShowChart((prev) => !prev)}
			/>
		</Container>
	)
}

export default Home
