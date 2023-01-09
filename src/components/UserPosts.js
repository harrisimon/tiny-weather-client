import React, { useEffect, useState } from "react"
import { getMyPosts, deletePost } from "../api/weather"
import { useNavigate } from "react-router-dom"
import { Button, Card, Container } from "semantic-ui-react"
import UserBar from "./shared/UserBar"

const UserPosts = (props) => {
	const { user, msgAlert } = props
	const [userPosts, setPosts] = useState(null)
	const navigate = useNavigate()
	let posts

	const removePost = (index) => {
		// console.log( userPosts[index])
		deletePost(user, userPosts[index]._id, userPosts[index].reviews._id)
		.then(()=> {
			msgAlert({
				heading: 'Post deleted!',
				message: 'Removed!',
				variant: 'success'
			})
		})
		.then(() => getMyPosts(user).then((res) => {
				
			setPosts(res.data.reviews)
		}))
		.catch(() => {

		})
	}
	// console.log(userPosts._id)

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
		posts = userPosts.reverse().map((post, index) => (
			
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
				<Card.Content><Button circular color="red" onClick={()=>removePost(index)}>X</Button></Card.Content>
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
