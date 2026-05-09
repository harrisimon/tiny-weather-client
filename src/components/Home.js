import React, { useState, useEffect } from "react"
import { Container, Loader } from "semantic-ui-react"
import PullToRefresh from "react-simple-pull-to-refresh"
import { get24HourHistory, getLatestWeather } from "../api/weather"
import Latest from "./Latest"
import UserBar from "./shared/UserBar"
import FloatingButtons from "./shared/FloatingButtons"

const Home = (props) => {
	const { msgAlert, user } = props
	const [refresh, setRefresh] = useState(false)
	const [weather, setWeather] = useState(null)
	const [history24h, setHistory24h] = useState(null)
	const [postList, setPostList] = useState(null)
	const [showChart, setShowChart] = useState(true)

	// Get tempMeasure from localStorage, default to true (Fahrenheit)
	const getTempMeasure = () => {
		const saved = localStorage.getItem("tempMeasure")
		return saved !== null ? saved === "true" : true
	}
	const [tempMeasure, setTempMeasure] = useState(getTempMeasure)

	// Listen for changes to tempMeasure in localStorage (from User component)
	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === "tempMeasure") {
				setTempMeasure(e.newValue === "true")
			}
		}

		window.addEventListener("storage", handleStorageChange)

		// Also listen for custom event for same-tab updates
		const handleCustomStorageChange = () => {
			const saved = localStorage.getItem("tempMeasure")
			if (saved !== null) {
				setTempMeasure(saved === "true")
			}
		}

		window.addEventListener("tempMeasureChanged", handleCustomStorageChange)

		return () => {
			window.removeEventListener("storage", handleStorageChange)
			window.removeEventListener(
				"tempMeasureChanged",
				handleCustomStorageChange
			)
		}
	}, [])

	const loadInfo = (res) => {
		// console.log("load info res reviews", res.data.weather[0].reviews)
		setWeather(res.data.weather[0])
		setPostList(res.data.weather[0].reviews.slice(0).reverse())
	}

	const fetchWeatherData = async () => {
		const [latestResult, historyResult] = await Promise.allSettled([
			getLatestWeather(),
			get24HourHistory(),
		])

		if (historyResult.status === "fulfilled") {
			const hist = historyResult.value?.data?.weather
			setHistory24h(Array.isArray(hist) ? hist : [])
		} else {
			console.error("Failed to load 24h history", historyResult.reason)
			setHistory24h([])
		}

		if (latestResult.status === "fulfilled") {
			console.log("res", latestResult.value.data.weather[0])
			loadInfo(latestResult.value)
			return latestResult.value
		}

		const error = latestResult.reason
		console.error("Error fetching weather data:", error)
		msgAlert({
			heading: "Error",
			message: "Failed to refresh weather data",
			variant: "danger",
		})
		throw error
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
				<div style={{ paddingTop: "4px" }}>
					<Latest
						refresh={refresh}
						triggerRefresh={() => setRefresh((prev) => !prev)}
						weather={weather}
						history24h={history24h}
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
			/>
		</Container>
	)
}

export default Home
