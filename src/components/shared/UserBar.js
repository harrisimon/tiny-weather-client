import {  Header, Button } from "semantic-ui-react"
import { Link } from 'react-router-dom'

const UserBar = (props) => {


	return (
        <>
        
			<div className="sign-in">
                <Link to='/user'>
                
				<Button icon="user" 
                />
                </Link>
			</div>
            <Link to='/'>

			<Header inverted>
				<span className="tiny">Tiny</span>
				<span className="title">Weather</span>
			</Header>
            </Link>
        </>


	)
}

export default UserBar