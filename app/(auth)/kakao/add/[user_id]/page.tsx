import { KakaoAddContent } from "./AddFriendContent";

export default function KakaoAdd({ params }: { params: { user_id: string } }) {
	return <KakaoAddContent params={params} />;
}
