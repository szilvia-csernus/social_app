import { useContext } from 'react'
import { Container} from 'react-bootstrap'
import Asset from '../../components/Asset';
import Profile from './Profile';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';

type PopularProfileProps = {
    mobile?: boolean;
}

function PopularProfiles({mobile}:PopularProfileProps) {
    const profileData = useContext(ProfileDataContext)

  return (
		<Container className={`Content ${mobile && 'd-lg-none text-center mb-3'}`}>
			{profileData.popularProfiles.results.length > 0 ? (
				<>
					<p>Most followed profiles</p>
					{mobile ? (
						<div className="d-flex justify-content-around">
							{profileData.popularProfiles.results
								.slice(0, 4)
								.map((profile) => (
									<Profile key={profile.id} profile={profile} mobile />
								))}
						</div>
					) : (
						profileData.popularProfiles.results.map((profile) => (
							<Profile key={profile.id} profile={profile} />
						))
					)}
				</>
			) : (
				<Asset spinner />
			)}
		</Container>
	);
}

export default PopularProfiles