import React, {
	FC,
	PropsWithChildren,
	createContext,
	useCallback,
	useMemo,
	useReducer,
} from 'react';
import axios, { AxiosResponse } from 'axios';
import ErrorBoundary from '../ErrorBoundary';
import { useNavigate } from 'react-router';
import { signinDataType } from '../auth/SignInForm';
import { setTokenExp, shouldRefresh } from '../utils/utils';

export type UserContextType = {
	pk: number;
	username: string;
	email: string;
	name: string;
	content: string;
	profile_id: number;
	profile_image: string;
} | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isUserContextType(obj: any): obj is UserContextType {
	return (
		obj &&
		typeof obj.pk === 'number' &&
		typeof obj.username === 'string' &&
		typeof obj.email === 'string' &&
		typeof obj.first_name === 'string' &&
		typeof obj.last_name === 'string' &&
		typeof obj.profile_id === 'number' &&
		typeof obj.profile_image === 'string'
	);
}

type Action =
	| { type: 'LOG_IN'; payload: { user: UserContextType } }
	| { type: 'LOG_OUT' }
	| { type: 'EDIT_USERNAME'; payload: { username: string }}
	| { type: 'UPDATE_PROFILE'; payload: { name: string, content: string, profile_image: string}}

const accessTokenExpiry = localStorage.getItem('access_exp') || null;

const initialCurrentUser: UserContextType = null;

export type AuthAxiosPropsType = {
		method?: 'get' | 'post' | 'put' | 'delete',
		path: string,
		body?: object | null,
		multipart?: boolean
	}

export const CurrentUserContext =
	createContext<UserContextType>(initialCurrentUser);
export const FetchTokensContext = createContext<
	(signinData: signinDataType) => void
>(() => null);
export const AuthAxiosContext = createContext<
(props: AuthAxiosPropsType) => Promise<AxiosResponse<object> | null>
>(() => Promise.resolve({} as AxiosResponse));
export const SetCurrentUserContext = createContext<React.Dispatch<Action>>(
	() => {}
);

function currentUserReducer(
	state: UserContextType,
	action: Action
): UserContextType {
	switch (action.type) {
		case 'LOG_IN':
			return action.payload.user;
		case 'LOG_OUT':
			return null;
		case 'EDIT_USERNAME':
			if (state) {
				return {
					...state,
					username: action.payload.username,
				}
			} else {
				return state
			}
		case 'UPDATE_PROFILE':
			if (state) {
				return {
					...state,
					name: action.payload.name,
					content: action.payload.content,
					profile_image: action.payload.content
				}
			} else {
				return state
			}
		default:
			return state;
	}
}

export const CurrentUserProvider: FC<PropsWithChildren> = ({
	children,
}) => {
	console.log('CurrentUserProvider runs');
	const [currentUser, dispatch] = useReducer(
		currentUserReducer,
		initialCurrentUser
	);

	const navigate = useNavigate();

	const authAxios = useCallback(async ({method, path, body=null, multipart=false}: AuthAxiosPropsType): Promise<AxiosResponse<object> | null> => {
		try {
			if (shouldRefresh()) {
				const accessKeyData = await axios.post('dj-rest-auth/token/refresh/');
				setTokenExp(accessKeyData.data.access);
			}
			const config: {
				headers: {
					'Content-Type'?: string;
				}
			} = {
				headers: {
					'Content-Type': 'application/json',
				},
			};
			if (multipart) {
				config.headers['Content-Type'] = 'multipart/form-data'
			}
			switch (method) {
				case 'post':
					return axios.post(path, body, config);
				case 'put':
					return axios.put(path, body, config);
				case 'delete':
					return axios.delete(path, config);
				default:
					return axios.get(path, config);
			}
				
		} catch (err) {
			dispatch({ type: 'LOG_OUT' });
			localStorage.removeItem('refresh');
			console.log('refresh key has been cleared from everywhere!!');
			console.error(err);
			navigate('signin');
			return null;
		}
	},[navigate]);

	const fetchUser = useCallback(async () => {
		try {
			const response: AxiosResponse<object> | null = await authAxios({ path:
				'dj-rest-auth/user/'
		});
			if (response && response.data) {
				const user = response.data;
				console.log('successful fetchUser response: ', response);
				if (isUserContextType(user)) {
					return user;
				}
			}
			console.log('unsuccessful fetchUser response: ', response);
			return null;
		} catch (err) {
			console.log('fetchUser error: ', err);
			return null;
		}
	}, [authAxios]);

	const setUser = useCallback(() => {
		console.log('setting user for the first time');
		fetchUser().then((user) => {
			if (user) {
				console.log('newUser: ', user);
				dispatch({
					type: 'LOG_IN',
					payload: { user },
				});
			}
		});
	}, [fetchUser]);

	useMemo(() => {
		if (!accessTokenExpiry) return null;

		const expDate = new Date(accessTokenExpiry);
		if (expDate.getTime() >= Date.now()) {
			return setUser();
		} else {
			return null;
		}
	}, [setUser]);

	return (
		<ErrorBoundary>
			<CurrentUserContext.Provider value={currentUser}>
				<AuthAxiosContext.Provider value={authAxios}>
					<SetCurrentUserContext.Provider value={dispatch}>
						{children}
					</SetCurrentUserContext.Provider>
				</AuthAxiosContext.Provider>
			</CurrentUserContext.Provider>
		</ErrorBoundary>
	);
};
