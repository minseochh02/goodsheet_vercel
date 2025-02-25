import { KakaoCallbackContent } from "./CallbackContent";
import { Suspense } from "react";

export default function KakaoCallback() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<KakaoCallbackContent />
		</Suspense>
	);
}
