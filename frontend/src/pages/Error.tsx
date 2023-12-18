import { useRouteError } from 'react-router-dom';
import Header from '../components/Header';

type RouteError = {
	code?: string;
	message?: string;
	stack?: string;
	statusText?: string;
};

export default function ErrorPage() {
	const error = useRouteError() as RouteError;
	console.error(error);

	return (
		<>
            <Header />
			<div id="error-page">
				<h1>Oops!</h1>
				<p>Sorry, an unexpected error has occurred.</p>
				<p>
					<i>{error.statusText || error.message}</i>
				</p>
			</div>
		</>
	);
}
