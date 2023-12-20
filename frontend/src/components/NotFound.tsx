import NoResults from '../assets/no-results.png';
import Asset from './Asset';

const NotFound = () => {
  return (
		<div className="d-flex justify-content-center align-items-center ">
			<Asset
				src={NoResults}
				message="Sorry, the page you're looking for doesn't exist."
			/>
		</div>
	);
}

export default NotFound