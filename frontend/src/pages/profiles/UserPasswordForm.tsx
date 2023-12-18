import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { useNavigate, useParams } from 'react-router-dom';
import { AuthAxiosContext, CurrentUserContext } from '../../contexts/CurrentUserContext';

import btnStyles from '../../components/Button.module.css';
import { AxiosError } from 'axios';
import { ProfileErrorDataType } from './ProfileTypes';

const UserPasswordForm = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const currentUser = useContext(CurrentUserContext);
    const authAxios = useContext(AuthAxiosContext)

	const [userData, setUserData] = useState({
		new_password1: '',
		new_password2: '',
	});
	const { new_password1, new_password2 } = userData;

	const [errors, setErrors] = useState<ProfileErrorDataType>();

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setUserData({
			...userData,
			[event.target.name]: event.target.value,
		});
	};

	useEffect(() => {
		if (currentUser?.profile_id?.toString() !== id) {
			// redirect user if they are not the owner of this profile
			navigate('/');
		}
	}, [currentUser, navigate, id]);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		try {
			await authAxios({ method: 'post', path: '/dj-rest-auth/password/change/', body: userData });
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
					<Form onSubmit={handleSubmit}>
						<Form.Group className="mt-2">
							<Form.Label>New password</Form.Label>
							<Form.Control
								placeholder="new password"
								type="password"
								value={new_password1}
								onChange={handleChange}
								name="new_password1"
							/>
						</Form.Group>
						{errors?.new_password1?.map((message, idx) => (
							<Alert key={idx} variant="warning">
								{message}
							</Alert>
						))}
						<Form.Group className="mt-2">
							<Form.Label>Confirm password</Form.Label>
							<Form.Control
								placeholder="confirm new password"
								type="password"
								value={new_password2}
								onChange={handleChange}
								name="new_password2"
							/>
						</Form.Group>
						{errors?.new_password2?.map((message, idx) => (
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
								type="submit"
								className={`${btnStyles.Button} ${btnStyles.Blue}`}
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

export default UserPasswordForm;
