import { KakaoSuccessAddContent } from "./SuccessAddContent";
import { Suspense } from "react";

export default function KakaoAddSuccess() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<KakaoSuccessAddContent />
		</Suspense>
	);
}
