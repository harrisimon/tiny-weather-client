import React, { useEffect, useRef, useState } from "react"
import { getMyPosts } from "../api/weather"


const UserPosts = (props) => {
    const {user} = props
    useEffect(()=> {
        getMyPosts(user)
            .then((res) => {
                console.log(res.data.reviews)
            })
    })

    return(
        <>
        user posts

        </>
    )
}

export default UserPosts