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
    if (weather !== null){
        temp = <h1>{weather.temperature}</h1>
    } else {
        temp = <h1>nothing here</h1>
        // add in loading wheel
    }
    return(
        <>
        
        {temp}
         the weather
        </>
    )
}

export default Latest