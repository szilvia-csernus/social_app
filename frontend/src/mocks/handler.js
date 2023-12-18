import { rest } from "msw";

const baseURL = 'https://social-app-szilvia-8965907d743d.herokuapp.com/';

export const handlers = [
	rest.get(`${baseURL}dj-rest-auth/user`, (req, res, ctx) => {
		return res(
			ctx.json({
				pk: 4,
				username: 'test2',
				email: 'test2@gmail.com',
				first_name: '',
				last_name: '',
				profile_id: 4,
				profile_image:
					'https://res.cloudinary.com/domjz4dz6/image/upload/v1/media/../default_profile_bq1aht',
			})
		);
	}),
	rest.get(`${baseURL}dj-rest-auth/login/`, (req, res, ctx) => {
		return res(
			ctx.json({
				access:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAyODU1NDE2LCJpYXQiOjE3MDI4NTM2MTYsImp0aSI6IjhjMWJhZGEzZTk3ZDRiMjY4OGQwNDYxNjI2YjhjYWI5IiwidXNlcl9pZCI6NH0.dau6NgOq1Gj9x43yXuhBO3zL1wq5p4JwEVddGRVc924',
				refresh: '',
				user: {
					pk: 4,
					username: 'test2',
					email: 'test2@gmail.com',
					first_name: '',
					last_name: '',
					profile_id: 4,
					profile_image:
						'https://res.cloudinary.com/domjz4dz6/image/upload/v1/media/../default_profile_bq1aht',
				},
			})
		);
	}),
	rest.post(`${baseURL}dj-rest-auth/token/refresh/`, (req, res, ctx) => {
		return res(
			ctx.json({
				access:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAyODkzMDgwLCJpYXQiOjE3MDI4NTM2MTYsImp0aSI6IjZlN2Y3Y2JjOTE0ZDQ3Yjc5YjMwNzA2ZDRjZDIwZmNiIiwidXNlcl9pZCI6NH0.l-euJw-KdpkAl_vyRLQ-sqoMqgOHsPi-uF71WMNjdBM',
				access_expiration: '2023-12-18T09:51:20.389275Z',
			})
		);
	}),
	rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
		return res(
			ctx.status(200))
		;
	}),
];