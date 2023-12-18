import { FormEvent, useContext, useEffect, useState } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { useNavigate, useParams } from 'react-router-dom';
import {
    AuthAxiosContext,
    CurrentUserContext,
	SetCurrentUserContext
} from '../../contexts/CurrentUserContext';

import btnStyles from '../../components/Button.module.css';
import { AxiosError } from 'axios';
import { ProfileErrorDataType } from './ProfileTypes';

const UsernameForm = () => {
	const [username, setUsername] = useState('');
	const [errors, setErrors] = useState<ProfileErrorDataType>();

	const navigate = useNavigate();
	const { id } = useParams();

	const currentUser = useContext(CurrentUserContext);
	const dispatch = useContext(SetCurrentUserContext);
    const authAxios = useContext(AuthAxiosContext);

	useEffect(() => {
		if (currentUser && currentUser?.profile_id?.toString() === id) {
			setUsername(currentUser.username);
		} else {
			navigate('/');
		}
	}, [currentUser, navigate, id]);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		try {
			await authAxios({ method: 'put', path: '/dj-rest-auth/user/', body: {
				username,
			}});
			dispatch({ type: 'EDIT_USERNAME', payload: {	username: username }});
			navigate(-1);
		} catch (err) {
			const axiosError = err as AxiosError;
			console.log('axios error', axiosError);
			if (axiosError.response && axiosError.response.data) {
				setErrors(axiosError.response.data as ProfileErrorDataType);
			}
		}
	};

	return (
		<Row>
			<Col className="py-2 mx-auto text-center" md={6}>
				<Container className="Content">
					<Form onSubmit={handleSubmit} className="my-2">
						<Form.Group>
							<Form.Label>Change username</Form.Label>
							<Form.Control
								placeholder="username"
								type="text"
								value={username}
								onChange={(event) => setUsername(event.target.value)}
							/>
						</Form.Group>
						{errors?.username?.map((message, idx) => (
							<Alert key={idx} variant="warning">
								{message}
							</Alert>
						))}
						<div className="mt-2">
							<Button
								className={`${btnStyles.Button} ${btnStyles.Blue}`}
								onClick={() => navigate(-1)}
							>
								cancel
							</Button>
							<Button
								className={`${btnStyles.Button} ${btnStyles.Blue}`}
								type="submit"
							>
								save
							</Button>
						</div>
					</Form>
				</Container>
			</Col>
		</Row>
	);
};

export default UsernameForm;
