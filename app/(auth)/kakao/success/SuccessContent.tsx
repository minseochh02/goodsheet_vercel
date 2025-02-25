"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function KakaoSuccessContent() {
	const searchParams = useSearchParams();
	const user_id = searchParams.get("user_id");
	const router = useRouter();

	useEffect(() => {
		if (user_id && window.parent) {
			window.parent.postMessage(
				{
					type: "kakao_success",
					user_id,
				},
				"*"
			);
		}
	}, [user_id]);

	return (
		<div>
			<Button
				onClick={() => {
					router.push("/dashboard?user_id=" + user_id);
				}}
			>
				Go to Dashboard
			</Button>
		</div>
	);
}
