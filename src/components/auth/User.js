import React, { useState, useEffect } from "react"
import UserBar from "../shared/UserBar"
import { Container, Button } from "semantic-ui-react"
import { Link } from "react-router-dom"

const User = (props) => {
	const { user } = props
	
	// Get tempMeasure from localStorage, default to true (Fahrenheit)
	const getTempMeasure = () => {
		const saved = localStorage.getItem("tempMeasure")
		return saved !== null ? saved === "true" : true
	}
	const [tempMeasure, setTempMeasure] = useState(getTempMeasure)
	
	// Update localStorage when tempMeasure changes
	useEffect(() => {
		localStorage.setItem("tempMeasure", tempMeasure.toString())
	}, [tempMeasure])
	
	const changeTempMeasure = () => {
		setTempMeasure((prev) => {
			const newValue = !prev
			// Dispatch custom event so Home component can update immediately
			window.dispatchEvent(new Event("tempMeasureChanged"))
			return newValue
		})
	}

	let buttons
	if (user === null) {
        buttons =
		<>
			
			<Link to="/sign-up">
				<Button className="usr-btn" size="huge">
					Sign Up
				</Button>
			</Link>
			<Link to="/sign-in">
				<Button size="huge" className="usr-btn">
					Sign In
				</Button>
			</Link>
		</>
	} else {
        buttons = 
        <>
        
        <Link to="/sign-out">
        <Button size="huge" className="usr-btn">
            Sign Out
        </Button>
    </Link>
    <Link to='/my-posts'>
    <Button size='huge' className="usr-btn">My Posts</Button></Link>
        </>
    
    }

	return (
		<Container as="nav">
			<UserBar />
			<div className="user-buttons">
			{buttons}
			<Button 
				size="huge" 
				className="usr-btn"
				onClick={changeTempMeasure}
			>
				Change Temp Measure ({tempMeasure ? "°F" : "°C"})
			</Button>
			</div>
		</Container>
	)
}

export default User
