import { useContext, useEffect, useState } from 'react';
import styles from './Post.module.css';
import { Dispatch, SetStateAction, FC } from 'react';
import { AuthAxiosContext, CurrentUserContext } from '../../contexts/CurrentUserContext';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { type PostsResponseType } from './PostTypes';
import { PostType } from './PostTypes';
import { MoreDropdown } from '../../components/MoreDropdown';



export type PostDetailProps = PostType & {
	setPosts: Dispatch<SetStateAction<PostsResponseType>>;
	postPage: boolean;
};

type LikeResponseType = {
	id: number;
}


const PostDetail: FC<PostDetailProps> = ({
	id,
	owner,
	profile_id,
	profile_image,
	comments_count,
	likes_count,
	like_id,
	title,
	content,
	image,
	updated_at,
	setPosts,
	postPage,
}) => {
    
	const currentUser = useContext(CurrentUserContext)
	const authAxios = useContext(AuthAxiosContext);
	const [isPostOwner, setIsPostOwner] = useState<boolean>(false);

	const navigate = useNavigate();

	useEffect(() => {
		const postOwner = currentUser
			? currentUser.username === owner
			: false;
		setIsPostOwner(postOwner)
	}, [currentUser, owner])

	const handleEdit = () => {
		navigate(`/posts/${id}/edit`);
	}

	const handleDelete = async () => {
		try {
			await authAxios({ method: 'delete', path: `/posts/${id}`});
			setPosts((prevPosts: PostsResponseType) => {
				const updatedResults = prevPosts.results.filter((post) => post.id !== id);
				return {
					...prevPosts,
					results: updatedResults,
				};
			});
			navigate(-1);
		} catch (err) {
			console.log(err);
		}
	}

	const handleLike = async () => {
		try {
			const response = await authAxios({
				method: 'post',
				path: '/likes/',
				body: { post: id }
		});
			if (response && response.data && 'id' in response.data && typeof response.data.id === 'number') {
				console.log('like response', response);
				const responseData = response.data as LikeResponseType
				setPosts((prevPosts: PostsResponseType) => {
					const indx = prevPosts.results.findIndex((post) => post.id === id);
					const updatedResults = [...prevPosts.results];
					console.log('prevPost', updatedResults[indx]);
					updatedResults[indx] = {
						...updatedResults[indx],
						likes_count: updatedResults[indx].likes_count + 1,
						like_id: responseData.id,
					};
					console.log('updated Post', updatedResults[indx]);
					return {
						...prevPosts,
						results: updatedResults,
					};
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleUnLike = async () => {
		try {
			await authAxios({ method: 'delete', path: `/likes/${like_id}` });
			setPosts((prevPosts: PostsResponseType) => {
				const indx = prevPosts.results.findIndex((post) => post.id === id);
				const updatedResults = [...prevPosts.results];
				console.log('prevPost', updatedResults[indx]);
				updatedResults[indx] = {
					...updatedResults[indx],
					likes_count: updatedResults[indx].likes_count - 1,
					like_id: null,
				};
				console.log('updated Post', updatedResults[indx]);
				return {
					...prevPosts,
					results: updatedResults,
				};
			});

		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Card className={styles.Post}>
				<Card.Body>
					<div className="d-flex align-items-center justify-content-between">
						<Link to={`/profiles/${profile_id}`} className="d-flex gap-2">
							<Avatar src={profile_image} height={55} text="" />
							{owner}
						</Link>
						<div className="d-flex gap-1 align-items-center">
							<span>{updated_at}</span>
							{isPostOwner && postPage && (
								<MoreDropdown
									handleEdit={handleEdit}
									handleDelete={handleDelete}
								/>
							)}
						</div>
					</div>
				</Card.Body>
				<Link to={`/posts/${id}`}>
					<Card.Img src={image} alt={title} />
				</Link>
				<Card.Body>
					{title && <Card.Title className="text-center">{title}</Card.Title>}
					{content && <Card.Text>{content}</Card.Text>}
					<div
						className={`${styles.PostBar} d-flex gap-2 justify-content-center`}
					>
						{isPostOwner ? (
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>You can't like your own post!</Tooltip>}
							>
								<i className="far fa-heart" />
							</OverlayTrigger>
						) : like_id ? (
							<span onClick={handleUnLike}>
								<i className={`fas fa-heart ${styles.Heart}`} />
							</span>
						) : currentUser ? (
							<span onClick={handleLike}>
								<i className={`far fa-heart ${styles.HeartOutline}`} />
							</span>
						) : (
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>Log in to like posts!</Tooltip>}
							>
								<i className="far fa-heart" />
							</OverlayTrigger>
						)}
						{likes_count}
						{currentUser ? (
							<Link to={`/posts/${id}`}>
								<i className="far fa-comments" />
							</Link>
						) : (
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>Log in to comment!</Tooltip>}
							>
								<i className="far fa-comments" />
							</OverlayTrigger>
						)}

						{comments_count}
					</div>
				</Card.Body>
			</Card>
		</>
	);
};

export default PostDetail;
