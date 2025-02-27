import { KakaoRemoveContent } from "./RemoveContent";

export default function KakaoRemove({
	params,
}: {
	params: { user_id: string };
}) {
	return <KakaoRemoveContent params={params} />;
}
