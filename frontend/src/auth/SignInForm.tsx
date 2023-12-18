import styles from './Auth.module.css';
import btnStyles from '../components/Button.module.css';

import { Col, Row, Form, Button, Alert, Image, Container } from 'react-bootstrap';
import illustration from '../assets/signin.jpg';

import { type ChangeEvent, useState, FormEvent, useContext, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CurrentUserContext, SetCurrentUserContext } from '../contexts/CurrentUserContext';
import { setTokenExp } from '../utils/utils';

export type signinDataType = {
	username: string,
	password: string
};

type errorDetail = string[];

type errorDataType =
	{
        username: errorDetail,
        password: errorDetail,
		non_field_errors: errorDetail
	}
	| undefined;

type ErrorResponse = {
	username?: string[],
	password?: string[],
	non_field_errors?: string[]
};

const SignInForm = () => {
	const currentUser = useContext(CurrentUserContext);
	const dispatch = useContext(SetCurrentUserContext);

	const [signinData, setSigninData] = useState<signinDataType>({
		username: '',
		password: ''
	});

	const [errors, setErrors] = useState<errorDataType>();

	const { username, password } = signinData;

	const navigate = useNavigate();

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setSigninData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		try {
			const signinDataResponse = await axios.post('dj-rest-auth/login/', signinData)
			if (signinDataResponse.status === 200) {
				dispatch({
					type: 'LOG_IN',
					payload: { user: signinDataResponse.data.user },
				});
				setTokenExp(signinDataResponse.data.access);
			}
		} catch (error) {
			console.log(error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>;
				if (axiosError.response) {
					const { data } = axiosError.response;
					setErrors({
						username: data.username ? data.username : [],
						password: data.password ? data.password : [],
						non_field_errors: data.non_field_errors ? data.non_field_errors : []
					});
				}
			}
		}
	};

	useEffect(() => {
		if (currentUser) {
			navigate('/')
		}
	}, [currentUser, navigate])

	return (
		<Row className={styles.Row}>
			<Col md={6} className="my-auto p-0 d-md-2">
				<Container className="Content p-4">
					<h1 className={styles.Header}>Sign In</h1>

					<Form onSubmit={handleSubmit}>
						<Form.Group className="mb-3" controlId="username">
							<Form.Label className="d-none">Username/email</Form.Label>
							<Form.Control
								className={styles.Input}
								type="username"
								placeholder="Enter username"
								name="username"
								autoComplete="username"
								value={username}
								onChange={handleChange}
							/>
						</Form.Group>
						{errors &&
							errors.username.map((data, idx) => (
								<Alert variant="warning" key={idx}>
									{data}
								</Alert>
							))}

						<Form.Group className="mb-3" controlId="password1">
							<Form.Label className="d-none">Password</Form.Label>
							<Form.Control
								className={styles.Input}
								type="password"
								placeholder="Password"
								name="password"
								autoComplete="password"
								value={password}
								onChange={handleChange}
							/>
						</Form.Group>
						{errors &&
							errors.password.map((data, idx) => (
								<Alert variant="warning" key={idx}>
									{data}
								</Alert>
							))}

						<Button
							className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright} mb-2`}
							type="submit"
						>
							Sign In
						</Button>
						{errors &&
							errors.non_field_errors.map((data, idx) => (
								<Alert variant="warning" key={idx}>
									{data}
								</Alert>
							))}
					</Form>
				</Container>
				<Container className="Content mt-3">
					<div>
						<Link className={styles.Link} to="/singup">
							Don't have an account?
							<span>Sign Up</span>
						</Link>
					</div>
				</Container>
			</Col>
			<Col className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}>
				<Image src={illustration} className="FillerImage" alt="signup illustration" />
			</Col>
		</Row>
	);
};

export default SignInForm;
