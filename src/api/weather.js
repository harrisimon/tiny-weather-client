import apiUrl from "../apiConfig"
import axios from "axios"

export const getWeatherIndex = (user) => {
	return axios({
		method: "GET",
		url: apiUrl + "/weather",
	})
}

export const getWeatherReading = (user, id) => {
	return axios({
		method: "GET",
		url: apiUrl + `/weather/${id}`,
	})
}

export const getLatestWeather = (user) => {
	return axios({
		method: "GET",
		url: apiUrl + "/latest",
	})
}

export const submitPost = (user, id, data) => {
	return axios({
		method: "POST",
		url: apiUrl + "/review/" + id,
		data,
		headers: {
			Authorization: `Token token=${user.token}`,
		},
	})
}

export const getMyPosts = (user) => {
	return axios({
		method: 'GET',
		url: apiUrl + "/my-posts",
		headers: {
			Authorization: `Token token=${user.token}`
		}
	})
}

export const deletePost = (user, weather, review) => {
	return axios({
		method: 'DELETE',
		url: apiUrl + `/review/${weather}/${review}`,
		headers: {
			Authorization: `Token token=${user.token}`
		}
	})
}