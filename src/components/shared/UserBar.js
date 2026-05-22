import { Header } from "semantic-ui-react"
import { Link } from 'react-router-dom'

const UserBar = (props) => {


	return (
        <>
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
