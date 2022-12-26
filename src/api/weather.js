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
        method: 'GET',
        url: apiUrl + `/weather/${id}`
    })
}

export const getLatestWeather = (user) => {
    return axios({
        method: 'GET',
        url: apiUrl + '/latest'
    })
}