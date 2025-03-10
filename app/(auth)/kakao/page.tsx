import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { KakaoAuthContent } from "./KakaoAuthContent";

export default function KakaoAuthPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center p-4">
					<Loader2 className="animate-spin h-6 w-6 text-gray-600" />
				</div>
			}
		>
			<KakaoAuthContent />
		</Suspense>
	);
}
