"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function KakaoSuccessAddContent() {
	const searchParams = useSearchParams();
	const user_id = searchParams.get("user_id");
	const router = useRouter();

	return (
		<div>
			<h1>Successfully subscribed to TODO: pass subscription info</h1>
		</div>
	);
}
