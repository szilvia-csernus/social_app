import { Link, NavLink } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import myLogo from '../assets/logo.png';

import styles from './Header.module.css';
import { ReactNode, useContext } from 'react';
import {
	CurrentUserContext,
	SetCurrentUserContext,
} from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';

function Header() {
	const currentUser = useContext(CurrentUserContext);
	const dispatch = useContext(SetCurrentUserContext)

	const { expanded, setExpanded, ref } = useClickOutsideToggle();

	const HandleSignOut = async () => {
		const response = await axios.post('/dj-rest-auth/logout/');
		if (response.status === 200) {
			dispatch({type: 'LOG_OUT'});
			localStorage.removeItem('access_exp');
		} else {
			console.log('Logout unsuccessful', response);
		}
	};

	const loggedInIcons: ReactNode = (
		<>
			
			<NavLink to="/" className={styles.NavLink}>
				<i className="fas fa-home"></i>Home
			</NavLink>
			<NavLink to="/feed" className={styles.NavLink}>
				<i className="fas fa-stream"></i>Feed
			</NavLink>
			<NavLink to="/liked" className={styles.NavLink}>
				<i className="fas fa-heart"></i>Liked
			</NavLink>
			<Link to="/" className={styles.NavLink} onClick={HandleSignOut}>
				<i className="fas fa-sign-out-alt"></i>Logout
			</Link>
			<NavLink
				to={`/profiles/${currentUser?.profile_id}`}
				className={styles.NavLink}
			>
				{currentUser && (
					<Avatar
						src={currentUser.profile_image}
						text=""
						height={40}
					/>
				)}
			</NavLink>
		</>
	);
	const loggedOutIcons = (
		<>
			<NavLink to="/signin" className={styles.NavLink}>
				<i className="fas fa-sign-in-alt"></i>Sign in
			</NavLink>
			<NavLink to="/signup" className={styles.NavLink}>
				<i className="fas fa-user-plus"></i>Sign up
			</NavLink>
		</>
	);
	return (
		<Navbar
			expanded={expanded}
			expand="md"
			fixed="top"
			className={`bg-body-tertiary ${styles.NavBar}`}
		>
			<Container>
				<Navbar.Brand className="d-flex align-center">
					<Link to="/" className={styles.NavLink}>
						<img
							src={myLogo}
							width="50"
							height="40"
							className="d-inline-block align-top"
							alt="connect logo"
						/>
					</Link>
					{currentUser && (
						<NavLink to="/posts/create" className={styles.NavLink}>
							<i className="far fa-plus-square"></i>Post
						</NavLink>
					)}
				</Navbar.Brand>
				<Navbar.Toggle
					className={styles.Toggler}
					onClick={() => setExpanded(!expanded)}
					ref={ref}
					aria-controls="basic-navbar-nav"
				/>
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>{currentUser ? loggedInIcons : loggedOutIcons}</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
