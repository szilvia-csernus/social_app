import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react';

import Form from 'react-bootstrap/Form';

import styles from './Comment.module.css';
import btnStyles from '../../components/Button.module.css';
import { AuthAxiosContext } from '../../contexts/CurrentUserContext';
import { CommentsResponseType } from './CommentTypes';

type EditCommentFormType = {
	id: number;
	profile_id: number;
	content: string;
	profile_image: string;
	setShowEditForm: Dispatch<SetStateAction<boolean>>;
	setComments: Dispatch<SetStateAction<CommentsResponseType>>;
};

function EditCommentForm(props: EditCommentFormType) {
	const { id, content, setShowEditForm, setComments } = props;

    const authAxios = useContext(AuthAxiosContext);

	const [formContent, setFormContent] = useState(content);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setFormContent(event.target.value);
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		try {
            await authAxios({ method: 'put', path: `/comments/${id}/`, body: {
								content: formContent.trim(),
			}});
			setComments((prevComments: CommentsResponseType) => ({
				...prevComments,
				results: prevComments.results.map((comment) => {
					return comment.id === id
						? {
                            ...comment,
                            content: formContent.trim(),
                            updated_at: 'now',
						}
						: comment;
				}),
			}));
			setShowEditForm(false);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group className="pr-1">
				<Form.Control
					className={styles.Form}
					as="textarea"
					value={formContent}
					onChange={handleChange}
					rows={2}
				/>
			</Form.Group>
			<div className="text-right mt-2">
				<button
					className={btnStyles.Button}
					onClick={() => setShowEditForm(false)}
					type="button"
				>
					cancel
				</button>
				<button
					className={btnStyles.Button}
					disabled={!content.trim()}
					type="submit"
				>
					save
				</button>
			</div>
		</Form>
	);
}

export default EditCommentForm;
