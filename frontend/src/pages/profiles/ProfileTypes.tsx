export type ProfileType = {
	id: number;
	owner: string;
	created_at: string;
	updated_at: string;
	name: string;
	content: string;
	image: string;
    is_owner: boolean;
	follow_id: number | null;
	posts_count: number;
	followers_count: number;
    following_count: number;
};

export type ProfilesType = ProfileType[];

export type ProfilesResponseType = {
	count: number;
	next: string;
	previous: string;
	results: ProfilesType;
};

export type ProfileDataType = {
	pageProfile: ProfileType | null;
	popularProfiles: ProfilesResponseType;
};

export type ProfileErrorDataType = {
	username?: string[];
	password?: string[];
	new_password1?: string[];
	new_password2?: string[];
	non_field_errors?: string[];
	content?: string[];
};

export type EditProfileDataType = {
	name: string;
	content: string;
	image: string;
};

export type EditProfileErrorDataType = {
	name?: string[];
	content?: string[];
	image?: string[];
};
