import React from "react"
import { Card } from "semantic-ui-react"

const CardStack = (props) => {
	const { postList } = props
	// const [cards, setCards] = useState(weather.reviews)
	// console.log(weather, "in card stack")
	let reviews

	// console.log("post list in stack", postList)
	if (postList.length >= 1) {
		reviews = postList.map((review, index) => (
			<Card key={index}>
				<Card.Content>
					<Card.Header>
						{new Date(review.createdAt).toLocaleString("en-us")}
					</Card.Header>
				</Card.Content>
				<Card.Content className="review-text">
					{review.review}
				</Card.Content>
				<Card.Content extra>by: {review.author.email}</Card.Content>
			</Card>
		))
	} else {
		reviews = <p>No posts yet... sign in to leave a post</p>
	}
	
	return (
		<>
			{reviews}
		</>
	)
}
export default CardStack
