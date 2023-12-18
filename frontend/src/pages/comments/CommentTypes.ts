export type CommentType = {
	id: number;
	owner: string;
	content: string;
	post: number;
	profile_id: number;
	profile_image: string;
	created_at: string;
	updated_at: string;
	is_owner: boolean;
};

export type CommentsType = CommentType[];

export type CommentsResponseType = {
	count: number;
	next: string;
	previous: string;
	results: CommentsType;
};
