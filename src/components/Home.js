import React, { useState, useEffect } from "react"
import { Container, Loader } from "semantic-ui-react"
import PullToRefresh from "react-simple-pull-to-refresh"
import { getLatestWeather } from "../api/weather"
import Latest from "./Latest"
import UserBar from "./shared/UserBar"
import FloatingButtons from "./shared/FloatingButtons"

const Home = (props) => {
	const { msgAlert, user } = props
	const [refresh, setRefresh] = useState(false)
	const [weather, setWeather] = useState(null)
	const [postList, setPostList] = useState(null)
	const [showChart, setShowChart] = useState(true)
	const [tempMeasure, setTempMeasure] = useState(true)

	const loadInfo = (res) => {
		// console.log("load info res reviews", res.data.weather[0].reviews)
		setWeather(res.data.weather[0])
		setPostList(res.data.weather[0].reviews.slice(0).reverse())
	}

	const fetchWeatherData = async () => {
		try {
			const res = await getLatestWeather()
			console.log("res", res.data.weather[0])
			loadInfo(res)
			return res
		} catch (error) {
			console.error("Error fetching weather data:", error)
			msgAlert({
				heading: "Error",
				message: "Failed to refresh weather data",
				variant: "danger",
			})
			throw error
		}
	}

	useEffect(() => {
		fetchWeatherData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh])

	const handleRefresh = async () => {
		return fetchWeatherData()
	}

	return (
		<Container as="nav">
			<UserBar />
			<PullToRefresh
				onRefresh={handleRefresh}
				pullingContent={
					<div style={{ textAlign: "center", padding: "20px" }}>
						<Loader active inline="centered" />
						<p>Pull down to refresh...</p>
					</div>
				}
				refreshingContent={
					<div style={{ textAlign: "center", padding: "20px" }}>
						<Loader active inline="centered" />
						<p>Refreshing...</p>
					</div>
				}
			>
				<div style={{ paddingTop: "10px" }}>
					<Latest
						refresh={refresh}
						triggerRefresh={() => setRefresh((prev) => !prev)}
						weather={weather}
						postList={postList}
						showChart={showChart}
						toggleChart={() => setShowChart((prev) => !prev)}
						tempMeasure={tempMeasure}
					/>
				</div>
			</PullToRefresh>
			<FloatingButtons
				user={user}
				msgAlert={msgAlert}
				weather={weather}
				onTempMeasureChange={setTempMeasure}
			/>
		</Container>
	)
}

export default Home
