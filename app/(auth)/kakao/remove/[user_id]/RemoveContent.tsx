"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";

export function KakaoRemoveContent({
	params,
}: {
	params: { user_id: string };
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [user_name, setUser_name] = useState("");
	const [profile_pic, setProfile_pic] = useState("");

	useEffect(() => {
		const fetchUser = async () => {
			const supabase = await createClient();
			const { data: app } = await supabase
				.from("apps")
				.select("*")
				.eq("user_id", params.user_id)
				.single();
			setUser_name(app?.kakao?.nickname);
			setProfile_pic(app?.kakao?.profile_image);
		};
		fetchUser();
	}, [params.user_id]);

	const handleUnsubscribe = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(
				`/api/kakao/unsubscribe?user_id=${params.user_id}`
			);
			const data = await response.json();
			window.location.href = data.authorization_url;
		} catch (err) {
			setError(
				"Failed to initiate unsubscribe process. Please try again later."
			);
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto max-w-2xl p-6 min-h-[70vh] flex items-center justify-center">
			<Card className="w-full bg-card shadow-lg">
				<CardHeader className="pb-4">
					<CardTitle className="text-2xl font-bold text-center">
						Unsubscribe Confirmation
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex flex-col items-center text-center">
						<div className="mb-4">
							<Avatar className="h-20 w-20">
								<AvatarImage src={profile_pic} />
								<AvatarFallback className="text-lg">
									{user_name?.charAt(0)}
								</AvatarFallback>
							</Avatar>
						</div>
						<div className="mb-6">
							<p className="text-lg">
								You are about to stop receiving messages from
								<span className="font-semibold"> {user_name}</span> on
								GoodSheetLife.
							</p>
						</div>

						<div className="w-full rounded-md bg-amber-50 p-5 border border-amber-200 mb-6">
							<div className="flex items-start">
								<AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
								<div>
									<h3 className="text-sm font-medium text-amber-800">
										Please Note
									</h3>
									<div className="mt-2 text-sm text-amber-700">
										<p>
											By clicking continue, you will no longer receive messages
											from this channel through GoodSheetLife. This action will:
										</p>
										<ul className="list-disc list-inside mt-2 space-y-1">
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
							<div className="w-full rounded-md bg-red-50 p-4 border border-red-200 mb-4">
								<div className="flex items-start">
									<AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
									<div>
										<h3 className="text-sm font-medium text-red-800">Error</h3>
										<div className="mt-1 text-sm text-red-700">{error}</div>
									</div>
								</div>
							</div>
						)}

						<div className="flex flex-col space-y-4 w-full max-w-sm mx-auto">
							<Button
								onClick={handleUnsubscribe}
								disabled={isLoading || isAuthenticating}
								className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Processing...
									</>
								) : isAuthenticating ? (
									"Authenticating with Kakao..."
								) : (
									"Yes, Unsubscribe Me"
								)}
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
				</CardContent>
			</Card>
		</div>
	);
}
