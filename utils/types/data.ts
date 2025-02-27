export interface UserData {
	id: string;
	name: string;
	email: string;
	profile_pic: string | null;
	created_at: string;
}

export interface AppData {
	id: string;
	user_id: string;
	sheet_id: string | null;
	script_id: string | null;
	kakao: {
		nickname: string | null;
		profile_image: string | null;
		access_token: string | null;
		refresh_token: string | null;
		message_count: number | null;
	}
}

export interface SubscriptionData {
	id: string;
	user_id: string;
	subscriptions: string[] | null;
	friend_ids: string | null;
	created_at: string;
}

export interface KakaoFriend {
	profile_nickname: string;
	profile_thumbnail_image: string;
	allowed_msg: boolean;
	id: number;
	uuid: string;
	favorite: boolean;
}
