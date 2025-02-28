// display unsubscripe sucess
import { KakaoSuccessRemoveContent } from "./SuccessRemoveContent";
import { Suspense } from "react";
export default function KakaoRemoveSuccess() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<KakaoSuccessRemoveContent />
		</Suspense>
	);
}
