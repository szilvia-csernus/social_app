import styles from './Auth.module.css';
import btnStyles from '../components/Button.module.css'

import { Col, Row, Form, Button, Alert, Image, Container } from 'react-bootstrap';
import illustration from '../assets/signup.jpg';

import { type ChangeEvent, useState, FormEvent, useContext, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

type SignUpDataType = {
	username: string,
	password1: string,
	password2: string
}

type errorDetail = string[]

type errorDataType = {
	username: errorDetail,
	password1: errorDetail,
	password2: errorDetail,
	non_field_errors: errorDetail
} | undefined

type ErrorResponse = {
	username?: string[],
	password1?: string[],
	password2?: string[],
	non_field_errors?: string[]
};


const SignUpForm = () => {
	const currentUser = useContext(CurrentUserContext);
	const [signUpData, setSignUpData] = useState<SignUpDataType>({
		username: '',
		password1: '',
		password2: ''
	})

	const [errors, setErrors] = useState<errorDataType>();

	const {username, password1, password2 } = signUpData;

	const navigate = useNavigate();

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = event.target;
		setSignUpData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		try {
			await axios.post('dj-rest-auth/registration/', signUpData,);
			navigate('/signin');
		} catch (error) {
			console.log(error)
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>;
				if (axiosError.response) {
					const { data } = axiosError.response;
					setErrors({
						username: data.username ? data.username : [],
						password1: data.password1 ? data.password1 : [],
						password2: data.password2 ? data.password2 : [],
						non_field_errors: data.non_field_errors ? data.non_field_errors : []
					});
				}
			}
		}
	};

	useEffect(() => {
		if (currentUser) {
			navigate('/');
		}
	}, [currentUser, navigate]);

	return (
		<Row className={styles.Row}>
			<Col className={`my-auto py-2 p-md-2`} md={6}>
				<Container className="Content p-4">
							<h1 className={`pb-3 ${styles.Header}`}>Sign Up</h1>

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
									name="password1"
									autoComplete="new-password"
									value={password1}
									onChange={handleChange}
								/>
							</Form.Group>
							{errors &&
								errors.password1.map((data, idx) => (
									<Alert variant="warning" key={idx}>
										{data}
									</Alert>
								))}

							<Form.Group className="mb-3" controlId="password2">
								<Form.Label className="d-none">Password (again)</Form.Label>
								<Form.Control
									className={styles.Input}
									type="password"
									placeholder="Password (again)"
									name="password2"
									autoComplete="new-password"
									value={password2}
									onChange={handleChange}
								/>
							</Form.Group>

							{errors &&
								errors.password2.map((data, idx) => (
									<Alert variant="warning" key={idx}>
										{data}
									</Alert>
								))}

							<Button
								className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright} mb-2`}
								type="submit"
							>
								Sign Up
							</Button>
							{errors &&
								errors.non_field_errors.map((data, idx) => (
									<Alert variant="warning" key={idx}>
										{data}
									</Alert>
								))}
						</Form>

					<div className="mt-3">
						<Link className={styles.Link} to="/signin">
						Already have an account?
							<span>Log in</span>
						</Link>
					</div>
				</Container>
			</Col>
			<Col
				md={6}
				className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
			>
				<Image
					className="FillerImage"
					src={illustration}
					alt="sign up illustration"
				/>
			</Col>
		</Row>
	);
}

export default SignUpForm;
