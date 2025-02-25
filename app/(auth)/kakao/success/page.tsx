import { KakaoSuccessContent } from "./SuccessContent";
import { Suspense } from "react";

export default function KakaoSuccess() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<KakaoSuccessContent />
		</Suspense>
	);
}
