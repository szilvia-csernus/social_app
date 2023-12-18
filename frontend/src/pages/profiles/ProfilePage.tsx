import { useContext, useEffect, useState } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import Asset from '../../components/Asset';
import styles from './Profile.module.css';
import btnStyles from '../../components/Button.module.css';

import PopularProfiles from './PopularProfiles';
import { AuthAxiosContext, CurrentUserContext } from '../../contexts/CurrentUserContext';
import { useParams } from 'react-router-dom';
import { ProfileType } from './ProfileTypes';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';
import { Image } from 'react-bootstrap';
import { PostType, PostsResponseType } from '../posts/PostTypes';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostDetail from '../posts/PostDetail';
import { fetchMoreData } from '../../utils/utils';
import NoResults from '../../assets/no-results.png';
import { useSetProfileData, useHandleFollow, useHandleUnfollow } from '../../hooks/useProfileContext';
import { ProfileEditDropdown } from '../../components/MoreDropdown';
import axios, { AxiosResponse } from 'axios';

function ProfilePage() {
	const [hasLoaded, setHasLoaded] = useState(false);
	const currentUser = useContext(CurrentUserContext);
    const authAxios = useContext(AuthAxiosContext);
    const {id} = useParams();
    const setProfileData = useSetProfileData();
    const handleFollow = useHandleFollow();
    const handleUnfollow = useHandleUnfollow();
    const profileData = useContext(ProfileDataContext)
    const { pageProfile } = profileData;
    const isOwner = currentUser?.username === pageProfile?.owner;

    const [profilePosts, setProfilePosts] = useState<PostsResponseType>({
			count: 0,
			next: '',
			previous: '',
			results: [],
		});


	useEffect(() => {
        const fetchData = async () => {

            try {
                let responses: Array<AxiosResponse<object> | null>;
                // Promise.all() returns an array of resolved data
                if (currentUser) {
                    responses = await Promise.all([
											authAxios({path: `/profiles/${id}`}),
											authAxios({path: `/posts/?owner__profile=${id}`}),
										]);
                } else {
                    responses = await Promise.all([
											axios.get(`/profiles/${id}`),
											axios.get(`/posts/?owner__profile=${id}`),
										]);
                }
                
                if (responses && responses.length > 0 && responses[0]) {
                    const profileDataResponse = responses[0].data as ProfileType;

                    setProfileData((prevState) => {
                        return { ...prevState,
                            pageProfile: profileDataResponse };
                    });
                    if (
                        responses[1] &&
                        responses[1].data &&
                        'results' in responses[1].data
                    ) {
                        const postsData = responses[1].data as PostsResponseType;
                        setProfilePosts((prevState) => {
                            return {
                                ...prevState,
                                next: postsData.next,
                                results: postsData.results,
                            };
                        });
                    }
                    console.log('profile page responses by handleMount in useEffect', responses);
                    setHasLoaded(true);
                }
                
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
	}, [id, currentUser, setProfileData, authAxios]);

    

	const mainProfile = (
		<>
			{profileData.pageProfile && isOwner && (
				<ProfileEditDropdown id={profileData.pageProfile.id} />
			)}
			{profileData.pageProfile ? (
				<Row className="px-3 text-center">
					<Col lg={3} className="text-lg-left">
						<Image
							className={styles.ProfileImage}
							roundedCircle
							src={profileData.pageProfile.image}
						/>
					</Col>
					<Col lg={6}>
						<h3 className="m-2">{profileData.pageProfile.owner}</h3>
						<Row className="justify-content-center no-gutters">
							<Col xs={3} className={'my-2'}>
								<div>{profileData.pageProfile.posts_count}</div>
								<div>posts</div>
							</Col>
							<Col xs={3} className={'my-2'}>
								<div>{profileData.pageProfile.followers_count}</div>
								<div>followers</div>
							</Col>
							<Col xs={3} className={'my-2'}>
								<div>{profileData.pageProfile.following_count}</div>
								<div>following</div>
							</Col>
						</Row>
					</Col>
					<Col lg={3} className="text-lg-right">
						{currentUser &&
							!isOwner &&
							(profileData.pageProfile.follow_id ? (
								<button
									className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
									onClick={() =>
										profileData.pageProfile &&
										handleUnfollow(profileData.pageProfile)
									}
								>
									unfollow
								</button>
							) : (
								<button
									className={`${btnStyles.Button} ${btnStyles.Black}`}
									onClick={() =>
										profileData.pageProfile &&
										handleFollow(profileData.pageProfile)
									}
								>
									follow
								</button>
							))}
					</Col>
					<Col className="p-3">Profile content</Col>
				</Row>
			) : (
				<Row className="px-3 text-center">Profile not found.</Row>
			)}
		</>
	);

	const mainProfilePosts = (
		<>
        {pageProfile && (
            <>
			<hr />
			{profilePosts.results.length ? (
				<InfiniteScroll
					children={profilePosts.results.map((post) => (
						<PostDetail
							key={post.id}
							{...post}
							setPosts={setProfilePosts}
							postPage={false}
						/>
					))}
					dataLength={profilePosts.results.length}
					loader={<Asset spinner />}
					hasMore={!!profilePosts.next}
					next={() => {
                        const isLoggedIn = currentUser ? true : false;
						fetchMoreData<PostsResponseType, PostType>(
							authAxios,
                            isLoggedIn,
							profilePosts,
							setProfilePosts
						);
					}}
				/>
			) : (
				<Container className="Content">
					<Asset
						src={NoResults}
						message={`No results found, ${pageProfile.owner} hasn't posted yet.`}
					/>
				</Container>
			)}
			<hr />
            </>
            )}
		</>
	);

	return (
		<Row>
			<Col className="py-2 p-0 p-lg-2" lg={8}>
				<PopularProfiles mobile />
				<Container className="Content">
					{hasLoaded ? (
						<>
							{mainProfile}
							{mainProfilePosts}
						</>
					) : (
						<Asset spinner />
					)}
				</Container>
			</Col>
			<Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
				<PopularProfiles />
			</Col>
		</Row>
	);
}

export default ProfilePage;
