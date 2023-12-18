import { useState, useEffect, useRef, ChangeEvent, FormEvent, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

import {
    AuthAxiosContext,
    CurrentUserContext,
    SetCurrentUserContext
} from '../../contexts/CurrentUserContext';

import btnStyles from '../../components/Button.module.css';
import { EditProfileDataType, EditProfileErrorDataType } from './ProfileTypes';
import { AxiosError } from 'axios';

const ProfileEditForm = () => {
	const currentUser = useContext(CurrentUserContext);
	const dispatch = useContext(SetCurrentUserContext);
	const { id } = useParams();
	const navigate = useNavigate();
	const imageFile = useRef<HTMLInputElement>(null);
    const authAxios = useContext(AuthAxiosContext);

	const [profileData, setProfileData] = useState<EditProfileDataType>({
		name: '',
		content: '',
		image: '',
	});
	const { name, content, image } = profileData;

	const [errors, setErrors] = useState<EditProfileErrorDataType>();

	useEffect(() => {
		const handleMount = async () => {
			if (currentUser?.profile_id?.toString() === id) {
				try {
					const response = await authAxios({path: `/profiles/${id}/`});
                    if (response && response.data) {
                        const { name, content, image } = response.data as EditProfileDataType;
                        setProfileData({ name, content, image });
                    }
				} catch (err) {
					console.log(err);
					navigate('/');
				}
			} else {
				navigate('/');
			}
		};

		handleMount();
	}, [currentUser, navigate, id, authAxios]);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setProfileData({
			...profileData,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('name', name);
		formData.append('content', content);

        if (
            imageFile.current &&
            imageFile.current.files &&
            imageFile.current.files.length > 0
        ) {
            formData.append('image', imageFile.current.files[0]);
        }

		try {
			const response = await authAxios({ method: 'put', path: `/profiles/${id}/`, body: formData});
			if (response && response.data) {
                const responseData = response.data as EditProfileDataType
                dispatch({
                            type: 'UPDATE_PROFILE',
                            payload: {
                                name: responseData.name,
                                content: responseData.content,
                                profile_image: responseData.image,
                            },
                        });
            }
			navigate(-1);
		} catch (err) {
			const axiosError = err as AxiosError;
			console.log('axios error', axiosError);
			if (axiosError.response && axiosError.response.data) {
				setErrors(axiosError.response.data as EditProfileErrorDataType);
			}
		}
	};

	const textFields = (
		<>
			<Form.Group>
				<Form.Label>Bio</Form.Label>
				<Form.Control
					as="textarea"
					value={content}
					onChange={handleChange}
					name="content"
					rows={7}
				/>
			</Form.Group>

			{errors?.content?.map((message, idx) => (
				<Alert variant="warning" key={idx}>
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
		</>
	);

	return (
		<Form onSubmit={handleSubmit}>
			<Row>
				<Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
					<Container className="Content">
						<Form.Group>
							{image && (
								<figure>
									<Image src={image} fluid />
								</figure>
							)}
							{errors?.image?.map((message, idx) => (
								<Alert variant="warning" key={idx}>
									{message}
								</Alert>
							))}
							<div>
								<Form.Label
									className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
									htmlFor="image-upload"
								>
									Change the image
								</Form.Label>
							</div>
							<Form.Control
								type="file"
								id="image-upload"
								ref={imageFile}
								accept="image/*"
                                className="mt-2"
								onChange={(e) => {
                                    const files = (e.target as HTMLInputElement).files;
                                    if (files && files.length > 0) {
                                        setProfileData({
                                            ...profileData,
                                            image: URL.createObjectURL(files[0]),
                                        });
                                    }
								}}
							/>
						</Form.Group>
						<div className="d-md-none">{textFields}</div>
					</Container>
				</Col>
				<Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
					<Container className="Content">{textFields}</Container>
				</Col>
			</Row>
		</Form>
	);
};

export default ProfileEditForm;
