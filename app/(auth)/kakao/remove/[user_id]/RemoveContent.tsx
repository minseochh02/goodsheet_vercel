"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function KakaoRemoveContent({
	params,
}: {
	params: { user_id: string };
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	// Function to authenticate with Kakao
	const authenticateWithKakao = () => {
		setIsAuthenticating(true);
		// Kakao OAuth URL
		const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
		const redirectUri = encodeURIComponent(
			`${window.location.origin}/api/kakao/unsubscribe-callback`
		);
		const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectUri}&response_type=code&state=${params.user_id}`;

		// Redirect to Kakao auth
		window.location.href = kakaoAuthUrl;
	};

	const handleUnsubscribe = async () => {
		try {
			setIsLoading(true);

			// First authenticate with Kakao to get the subscriber's ID
			authenticateWithKakao();

			// The actual unsubscribe will happen after Kakao authentication callback
			// See the unsubscribe-callback API route
		} catch (err) {
			setError(
				"Failed to initiate unsubscribe process. Please try again later."
			);
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-bold text-gray-900">
						Unsubscribe Confirmation
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						You are about to unsubscribe from notifications
					</p>
				</div>

				<div className="mt-8 space-y-6">
					<div className="rounded-md bg-yellow-50 p-4">
						<div className="flex">
							<div className="ml-3">
								<h3 className="text-sm font-medium text-yellow-800">
									Please Note
								</h3>
								<div className="mt-2 text-sm text-yellow-700">
									<p>
										By clicking continue, you will no longer receive messages
										from this channel through GoodSheetLife. This action will:
									</p>
									<ul className="list-disc list-inside mt-2">
										<li>Stop all notifications from this sender</li>
										<li>Remove your subscription to this channel</li>
										<li>
											Require re-subscription if you want to receive messages
											again
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					{error && (
						<div className="rounded-md bg-red-50 p-4">
							<div className="flex">
								<div className="ml-3">
									<h3 className="text-sm font-medium text-red-800">Error</h3>
									<div className="mt-2 text-sm text-red-700">{error}</div>
								</div>
							</div>
						</div>
					)}

					<div className="flex flex-col space-y-4">
						<Button
							onClick={handleUnsubscribe}
							disabled={isLoading || isAuthenticating}
							className="w-full bg-red-600 hover:bg-red-700 text-white"
						>
							{isLoading
								? "Processing..."
								: isAuthenticating
									? "Authenticating with Kakao..."
									: "Yes, Unsubscribe Me"}
						</Button>
						<Button
							onClick={() => {
								window.history.back();
							}}
							variant="outline"
							className="w-full"
							disabled={isLoading || isAuthenticating}
						>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
