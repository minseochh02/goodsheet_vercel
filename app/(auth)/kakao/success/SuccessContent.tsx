"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function KakaoSuccessContent() {
	const searchParams = useSearchParams();
	const user_id = searchParams.get("user_id");
	const router = useRouter();
	const [isInNewTab, setIsInNewTab] = useState(true);

	useEffect(() => {
		// Check if we're in a new tab (window.opener exists) or in an iframe (window.parent !== window)
		const isNewTab = window.opener !== null;
		const isIframe = window.parent !== window;

		setIsInNewTab(isNewTab && !isIframe);

		if (user_id) {
			// Try to communicate with parent window if we're in an iframe
			if (isIframe) {
				try {
					window.parent.postMessage(
						{
							type: "kakao_success",
							user_id,
						},
						"*"
					);
				} catch (error) {
					console.error("Failed to communicate with parent window:", error);
				}
			}

			// If we're in a new tab and have an opener
			if (isNewTab) {
				try {
					// Try to navigate the opener (parent) window back to dashboard
					window.opener.location.href = `/dashboard?user_id=${user_id}`;
					// Auto close this tab after a short delay
					setTimeout(() => {
						window.close();
					}, 1000);
				} catch (error) {
					console.error("Failed to communicate with opener window:", error);
				}
			}
		}
	}, [user_id]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen space-y-6">
			<h1 className="text-2xl font-bold">
				Successfully connected to KakaoTalk!
			</h1>

			{isInNewTab ? (
				<>
					<p>You can close this tab and return to your dashboard.</p>
					<div className="flex space-x-4">
						<Button
							onClick={() => {
								if (window.opener) {
									window.opener.location.href = `/dashboard?user_id=${user_id}`;
									window.close();
								} else {
									router.push(`/dashboard?user_id=${user_id}`);
								}
							}}
						>
							Return to Dashboard
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								window.close();
							}}
						>
							Close this tab
						</Button>
					</div>
				</>
			) : (
				<Button
					onClick={() => {
						router.push(`/dashboard?user_id=${user_id}`);
					}}
				>
					Go to Dashboard
				</Button>
			)}
		</div>
	);
}
