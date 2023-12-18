import {
	FC,
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
    useState,
} from 'react';
import { ProfileDataType, ProfileType, ProfilesResponseType } from '../pages/profiles/ProfileTypes';
import { CurrentUserContext, AuthAxiosContext } from './CurrentUserContext';
import { followHelper, unfollowHelper } from '../utils/utils';
import axios, { AxiosResponse } from 'axios';


const initialProfileData: ProfileDataType = {
	// we will use the pageProfile later!
	pageProfile: null,
	popularProfiles: {
		count: 0,
		next: '',
		previous: '',
		results: [],
	},
};

export const ProfileDataContext =
	createContext<ProfileDataType>(initialProfileData);

type SetProfileDataProps = {
	setProfileData: React.Dispatch<React.SetStateAction<ProfileDataType>>;
	handleFollow: (clickedProfile: ProfileType) => Promise<void>;
	handleUnfollow: (clickedProfile: ProfileType) => Promise<void>;
};

type FollowResponseType = {
    id: number;
    followed_user: number;
    owner: string;
}

export const SetProfileDataContext = createContext<SetProfileDataProps>({
	setProfileData: () => {},
	handleFollow: async () => {},
	handleUnfollow: async () => {}
});



export const ProfileDataProvider: FC<PropsWithChildren> = ({children}) => {
	console.log('ProfileDataProvider runs');
	const [profileData, setProfileData] = useState<ProfileDataType>(initialProfileData);

		const currentUser = useContext(CurrentUserContext);
        const authAxios = useContext(AuthAxiosContext);

        const handleFollow = async (clickedProfile: ProfileType) => {
            try {
                const response = await authAxios({ method: 'post', path: '/follows/', body: {
                    followed_user: clickedProfile.id
            }})
                if (response && response.data) {
                    console.log('follow response: ', response)
                    const responseData = response.data as FollowResponseType
                    setProfileData((prevState: ProfileDataType) => {
                        if (prevState.pageProfile) {
                            return {
                                ...prevState,
                                pageProfile:
                                    followHelper(prevState.pageProfile, clickedProfile, responseData.id),
                                popularProfiles: {
                                    ...prevState.popularProfiles,
                                    results: prevState.popularProfiles.results.map(profile =>
                                        followHelper(profile, clickedProfile, responseData.id))
                                }
                            }
                        } else {
                            return prevState;
                        }
                    })
                }
            } catch (err) {
                console.log(err)
            }
        }

        const handleUnfollow = async (clickedProfile: ProfileType) => {
					try {
						const response = await authAxios({ method: 'delete',
							path: `/follows/${clickedProfile.follow_id}/`
                    });
						if (response && response.status === 204) {
							setProfileData((prevState: ProfileDataType) => {
								if (prevState.pageProfile) {
									return {
										...prevState,
										pageProfile: unfollowHelper(
											prevState.pageProfile,
											clickedProfile
										),
										popularProfiles: {
											...prevState.popularProfiles,
											results: prevState.popularProfiles.results.map(
												(profile) =>
													unfollowHelper(
														profile,
														clickedProfile
													),
											)
										},
									};
								} else {
									return prevState;
								}
							});
						}
					} catch (err) {
						console.log(err);
					}
				};

		useEffect(() => {
			const handleMount = async () => {
                let response: AxiosResponse<object> | null;
				try {
                    if (currentUser) {
                        response = await authAxios({ path: '/profiles/?ordering=-followers_count' });
                    } else {
                        response = await axios.get('/profiles/?ordering=-followers_count');
                    }
					console.log('popular profiles response: ', response);
					if (response && response.data) {
                        const responseData = response.data as ProfilesResponseType
						setProfileData((prevState: ProfileDataType) => ({
							...prevState,
							popularProfiles: responseData,
						}));
					}
				} catch (err) {
					console.log(err);
				}
			};

			handleMount();
		}, [currentUser, authAxios]);

	return (
		<ProfileDataContext.Provider value={profileData}>
			<SetProfileDataContext.Provider value={{setProfileData, handleFollow, handleUnfollow}}>
				{children}
			</SetProfileDataContext.Provider>
		</ProfileDataContext.Provider>
	);
};
