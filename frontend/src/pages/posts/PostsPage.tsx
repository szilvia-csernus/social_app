import { useContext, type FC, useState, useEffect, SetStateAction, FormEvent } from 'react';

// import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
// import Container from 'react-bootstrap/Container';

import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './Post.module.css';
import { useLocation } from 'react-router-dom';
import {
	AuthAxiosContext,
	CurrentUserContext,
} from '../../contexts/CurrentUserContext';
import PostDetail from './PostDetail';
import axios, { AxiosResponse } from 'axios';
import { PostType, PostsResponseType } from './PostTypes';
import NoResults from '../../assets/no-results.png';
import { Container, Form } from 'react-bootstrap';
import Asset from '../../components/Asset';
import { fetchMoreData } from '../../utils/utils';
import PopularProfiles from '../profiles/PopularProfiles';

type PostsProps = {
	message: string;
};

const PostsPage: FC<PostsProps> = ({ message }) => {
	const currentUser = useContext(CurrentUserContext);
	const authAxios = useContext(AuthAxiosContext)

	const [posts, setPosts] = useState<PostsResponseType>({
		count: 0,
		next: '',
		previous: '',
		results: [],
	});
	const [hasLoaded, setHasLoaded] = useState(false);
	const [query, setQuery] = useState('')
	// const [filter, setFilter] = useState('');
	const { pathname } = useLocation();

	useEffect(() => {
		console.log('useEffect() for set filtering in PostPage runs');

		let filter: string = '';
		if (currentUser) {
			console.log('currentUser: ', currentUser);
			console.log('pathname: ', pathname);
			switch (pathname) {
				case '/feed':
					filter = `owner__followed__owner__profile=${currentUser.profile_id}&`;
					break;
				case '/liked':
					filter = `likes__owner__profile=${currentUser.profile_id}&ordering=-likes__created_at&`;
					break;
			}
		}

		console.log('filter after setting filter: ', filter)

		let response: AxiosResponse<object> | null;
		const fetchPosts = async () => {
			if (currentUser) {
				response = await authAxios({ path: `/posts/?${filter}search=${query}` });
			} else {
				response = await axios.get(`/posts/?search=${query}`);
			}
			
			if (response && response.data) {
				const responseData = response.data;
					setPosts(responseData as SetStateAction<PostsResponseType>);
			} else {
				console.log('response was not in the requiered format', response)
			}
			console.log('fetching filtered posts response: ', response)

			setHasLoaded(true);
		};

		setHasLoaded(false);
		const timer = setTimeout(() => {
			fetchPosts();
		}, 1000)
		return () => {
			clearTimeout(timer)
		}
	}, [currentUser, pathname, query, authAxios]);

	return (
		<Row className="h-100">
			<Col className="py-2 p-0 p-lg-2" lg={8}>
				<PopularProfiles mobile />
				<i className={`fas fa-search ${styles.SearchIcon}`} />
				<Form
					className={styles.SearchBar}
					onSubmit={(event: FormEvent) => event.preventDefault()}
				>
					<Form.Control
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						type="text"
						className="mr-sm-2"
						placeholder="Search posts"
					/>
				</Form>
				{hasLoaded && (
					<>
						{posts.results.length ? (
							<InfiniteScroll
								children={posts.results.map((post) => (
									<PostDetail
										key={post.id}
										{...post}
										setPosts={setPosts}
										postPage={false}
									/>
								))}
								dataLength={posts.results.length}
								loader={<Asset spinner />}
								hasMore={!!posts.next}
								next={() => {
									const isLoggedIn = currentUser ? true : false;
									fetchMoreData<PostsResponseType, PostType>(
										authAxios,
										isLoggedIn,
										posts,
										setPosts
									)
								}}
							/>
						) : (
							<Container className="Content">
								<Asset src={NoResults} message={message} />
							</Container>
						)}
					</>
				)}
				{!hasLoaded && (
					<Container className="Content">
						<Asset spinner />
					</Container>
				)}
			</Col>
			<Col md={4} className="d-none d-lg-block p-0 p-lg-2">
				<PopularProfiles />
			</Col>
		</Row>
	);
};

export default PostsPage;
