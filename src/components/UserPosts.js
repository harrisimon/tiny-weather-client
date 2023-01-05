import React, { useEffect, useState } from "react"
import { getMyPosts } from "../api/weather"
import { useNavigate } from "react-router-dom"
import { Card, Container } from "semantic-ui-react"
import UserBar from "./shared/UserBar"

const UserPosts = (props) => {
	const { user } = props
	const [userPosts, setPosts] = useState(null)
	const navigate = useNavigate()
	let posts

	useEffect(() => {
		if (user === null) {
			navigate('/')
		} else {

			getMyPosts(user).then((res) => {
				
				setPosts(res.data.reviews)
			})
		}
	}, [user])
	

	if (userPosts !== null) {
		posts = userPosts.slice(0).reverse().map((post, index) => (
			
			<Card key={index}>
				<Card.Content>
					<Card.Header>
						{new Date(post.reviews.createdAt).toLocaleString(
							"en-us"
						)}
					</Card.Header>
				</Card.Content>
				<Card.Content>{post.reviews.review}</Card.Content>
				<Card.Content>{((post.temperature)*(9 / 5) + 32)+'° F'}</Card.Content>
			</Card>
		))
	} else {
		posts = <h1>loading...</h1>
	}
	return (
        <Container as='nav'>
            <UserBar/>
			<h1>
                My posts
                </h1>
			<div className="user-posts">
				<Card.Group centered>{posts}</Card.Group>
			</div>
		</Container>
	)
}

export default UserPosts
