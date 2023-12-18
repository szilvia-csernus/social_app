export type PostType = {
	id: number;
	owner: string;
	profile_id: number;
	profile_image: string;
	comments_count: number;
	likes_count: number;
	like_id: number | null;
	title: string;
	content: string;
	image: string;
    is_owner: boolean;
    created_at: string;
	updated_at: string;
};

export type PostsType = PostType[]


export type PostsResponseType = {
	count: number;
	next: string;
	previous: string;
	results: PostsType;
};

export type EditPostResponseType = {
	title: string;
	content: string;
	image: string;
	is_owner: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEditPostResponseType(obj: any): obj is EditPostResponseType {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		typeof obj.title === 'string' &&
		typeof obj.content === 'string' &&
		typeof obj.image === 'string' &&
		typeof obj.is_owner === 'boolean'
	);
}
