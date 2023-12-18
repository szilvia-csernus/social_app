import styles from './Profile.module.css';
import btnStyles from '../../components/Button.module.css';
import { ProfileType } from './ProfileTypes';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useHandleFollow, useHandleUnfollow } from '../../hooks/useProfileContext';

type ProfilePropsType = {
    profile: ProfileType;
    mobile?: boolean;
    imageSize?: number;
}

function Profile({profile, mobile, imageSize=55}: ProfilePropsType) {
    const { id, follow_id, image, owner } = profile;

    const currentUser = useContext(CurrentUserContext);
    const is_owner = currentUser?.username === owner;
	const handleFollow = useHandleFollow();
	const handleUnfollow = useHandleUnfollow();

  return (
		<div
			className={`my-3 d-flex align-items-center justify-content-between ${
				mobile && 'flex-column'
			}`}
		>
			<div className={`d-flex align-items-center ${mobile && 'flex-column gap-2'}`} >
				<div>
					<Link to={`/profiles/${id}`}>
						<Avatar src={image} height={imageSize} />
					</Link>
				</div>
				<div className={`mx-2 ${styles.WordBreak}`}>
					<strong>{owner}</strong>
				</div>
			</div>
			<div className={`text-right ${!mobile && 'ml-auto'}`}>
				{!mobile &&
					currentUser &&
					!is_owner &&
					(follow_id ? (
						<Button
							className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
							onClick={() => handleUnfollow(profile)}
						>
							unfollow
						</Button>
					) : (
						<Button
							className={`${btnStyles.Button} ${btnStyles.Black}`}
							onClick={() => handleFollow(profile)}
						>
							follow
						</Button>
					))}
			</div>
		</div>
	);
}

export default Profile