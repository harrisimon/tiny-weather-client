import React, { useEffect, useState } from "react"
import { getLatestWeather } from "../api/weather"

const Latest = (props) => {

    const {user} = props

    const [weather, setWeather] = useState(null)
    useEffect(()=> {
        getLatestWeather()
            .then((res) => {
                console.log(res.data.weather)
                setWeather(res.data.weather[0])

            })
    },[])
    console.log(weather)
    let temp
    let pressure
    let humidity
    let review
    let posttime
    
    if (weather !== null){
        let time = new Date(weather.createdAt).toLocaleString('en-us')
        temp = <h1>{weather.temperature} C</h1>
        pressure = <h1>{weather.pressure} hpa</h1>
        humidity = <h1>{weather.humidity} </h1>
        posttime = <h1>{time}</h1>
        // review = <h3>{weather.reviews[0].review}</h3>

    } else {
        <h1>...loading</h1>
        // add in loading wheel
    }
    return(
        <>
        
        {temp}
        {pressure}
        {humidity}
        {review}
        {posttime}
         the weather
        </>
    )
}

export default Latest