import '../api/axiosDefaults';

import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import { CurrentUserProvider } from '../contexts/CurrentUserContext';
import { ProfileDataProvider } from '../contexts/ProfileDataContext';


function App() {
	

	return (
		<CurrentUserProvider>
			<ProfileDataProvider>
				<Container>
					<Header />
					<Container className="Main">
						<Outlet />
					</Container>
				</Container>
			</ProfileDataProvider>
		</CurrentUserProvider>
	);
}

export default App;
