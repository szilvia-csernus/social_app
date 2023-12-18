import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import styles from './Comment.module.css';
import btnStyles from '../../components/Button.module.css';
import Avatar from '../../components/Avatar';
import { AuthAxiosContext, CurrentUserContext } from '../../contexts/CurrentUserContext';
import { PostsResponseType } from '../posts/PostTypes';
import { CommentType, CommentsResponseType } from './CommentTypes';

type CreateCommentPropsType = {
	postId: string;
	setPosts: Dispatch<SetStateAction<PostsResponseType>>;
	setComments: Dispatch<SetStateAction<CommentsResponseType>>;
	profileImage: string;
	profileId: number;
};

function CreateCommentForm(props: CreateCommentPropsType) {
	const { postId, setPosts, setComments, profileImage, profileId } = props;
	const [content, setContent] = useState('');

	const currentUser = useContext(CurrentUserContext);

	const authAxios = useContext(AuthAxiosContext);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setContent(event.target.value);
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

        const formData = new FormData();

        formData.append('content', content);
		try {
			const response = await authAxios({ method: 'post', path: '/comments/', body: {
				content,
				post: postId
			}});
            if (response && response.status === 201) {
				console.log('create comment response', response)
                setComments((prevComments: CommentsResponseType) => {
				return {
                    ...prevComments,
                    results: [
						{
						...response.data as CommentType,
						},
						...prevComments.results
					],
                }});
            } else {
                console.log('response was not in the requiered format', response);
            }
            console.log('fetching filtered posts response: ', response);
			
			setPosts((prevPosts) => ({
				...prevPosts,
				results: [
					{
						...prevPosts.results[0],
						comments_count: prevPosts.results[0].comments_count + 1,
					},
				],
			}));
			setContent('');
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
		{currentUser && 
		<Form className="mt-2" onSubmit={handleSubmit}>
			<Form.Group>
				<InputGroup>
					<Link to={`/profiles/${profileId}`}>
						<Avatar src={profileImage} />
					</Link>
					<Form.Control
						className={styles.Form}
						placeholder="my comment..."
						as="textarea"
						value={content}
						onChange={handleChange}
						rows={2}
					/>
				</InputGroup>
			</Form.Group>
			<button
				className={`${btnStyles.Button} ${btnStyles.Blue} mt-4 btn d-block ml-auto`}
				disabled={!content.trim()}
				type="submit"
			>
				post
			</button>
		</Form>
		}
		</>
	);
}

export default CreateCommentForm;
