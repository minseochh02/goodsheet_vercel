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
		token: string | null;
		message_count: number | null;
	}
}

