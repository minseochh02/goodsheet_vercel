"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	KakaoFriend,
	UserData,
	AppData,
	SubscriptionData,
} from "@/utils/types/data";

// Create supabase client once outside component
const supabase = createClient();

interface DashboardData {
	user: UserData | null;
	app: AppData | null;
	subscriptions: SubscriptionData | null;
}

export function MyDashboardContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<DashboardData>({
		user: null,
		app: null,
		subscriptions: null,
	});
	const [user_id, setUserId] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const router = useRouter();
	useEffect(() => {
		async function checkAuth() {
			const urlUserId = searchParams.get("user_id");
			if (urlUserId) {
				setUserId(urlUserId);
				return;
			}

			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error || !session?.user) {
				setError("Please sign in to view the dashboard");
				setLoading(false);
				return;
			}
			setUserId(session.user.id);
		}

		checkAuth();
	}, [searchParams]);

	useEffect(() => {
		async function fetchDashboardData() {
			if (!user_id) return;

			try {
				setLoading(true);
				setError(null);

				// Fetch user details
				const { data: userData, error: userDetailsError } = await supabase
					.from("users")
					.select("*")
					.eq("id", user_id)
					.single();
				if (userDetailsError) throw new Error("Failed to fetch user details");

				// Fetch app data
				const { data: appData, error: appError } = await supabase
					.from("apps")
					.select("*")
					.eq("user_id", user_id)
					.single();
				if (appError) throw new Error("Failed to fetch app data");

				// Only fetch subscriptions if kakao exists
				let subscriptionData = null;
				if (appData?.kakao?.token) {
					const { data: subData, error: subError } = await supabase
						.from("subscriptions")
						.select("*")
						.eq("user_id", user_id)
						.single();
					if (subError) throw new Error("Failed to fetch subscription data");
					subscriptionData = subData;
				}

				setData({
					user: userData,
					app: appData,
					subscriptions: subscriptionData,
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
			} finally {
				setLoading(false);
			}
		}

		fetchDashboardData();
	}, [user_id]);

	if (loading) {
		return (
			<div className="space-y-4 p-4">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-32 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 text-red-500">Error loading dashboard: {error}</div>
		);
	}

	const copyToClipboard = async (text: string): Promise<void> => {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(text);
				toast.success("Invite link copied!", {
					description: "Share this link with your friend to invite them.",
					duration: 3000,
				});
			} else {
				fallbackCopyToClipboard(text);
			}
		} catch (err) {
			fallbackCopyToClipboard(text);
		}
	};

	const fallbackCopyToClipboard = (text: string): void => {
		const textArea = document.createElement("textarea");
		textArea.value = text;
		textArea.style.position = "fixed";
		textArea.style.left = "-999999px";
		textArea.style.top = "-999999px";
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			const successful = document.execCommand("copy");
			if (successful) {
				toast.success("Invite link copied!", {
					description: "Share this link with your friend to invite them.",
					duration: 3000,
				});
			}
		} catch (err) {
			console.error("Failed to copy: ", err);
			toast.error("Failed to copy", {
				description: "Please try again or copy manually.",
				duration: 3000,
			});
		}

		document.body.removeChild(textArea);
	};

	return (
		<div className="space-y-6 p-4">
			{/* User Profile Card */}
			<Card>
				<CardHeader className="flex flex-row items-center space-x-4">
					<Avatar className="h-12 w-12">
						<AvatarImage src={data.user?.profile_pic || undefined} />
						<AvatarFallback>
							{data.user?.name?.[0] || data.user?.email[0]}
						</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle>{data.user?.name || "User"}</CardTitle>
						<p className="text-sm text-gray-500">{data.user?.email}</p>
					</div>
				</CardHeader>
			</Card>

			{/* App Integration Status Card */}
			<Card>
				<CardHeader>
					<CardTitle>App Integrations</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span>Google Sheet:</span>
							<span>{data.app?.sheet_id ? "Connected" : "Not connected"}</span>
						</div>
						<div className="flex justify-between">
							<span>Google Script:</span>
							<span>{data.app?.script_id ? "Connected" : "Not connected"}</span>
						</div>
						<div className="flex justify-between">
							<span>Kakao:</span>
							<span>
								{data.app?.kakao?.access_token ? "Connected" : "Not connected"}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
			{/* Connect to KakaoTalk Card, show if kakao does not exist */}
			{!data.app?.kakao?.access_token && (
				<Card>
					<CardHeader>
						<CardTitle>Connect to KakaoTalk</CardTitle>
					</CardHeader>
					<CardContent>
						<Button
							onClick={() => {
								// // open new tab
								// window.open(
								// 	window.location.origin + "/kakao?user_id=" + user_id,
								// 	"_blank"
								// );
								// test within modal
								router.push("/kakao?user_id=" + user_id);
							}}
						>
							Connect to KakaoTalk
						</Button>
					</CardContent>
				</Card>
			)}
			{/* Subscription Card - Only show if kakao exists */}
			{data.app?.kakao?.access_token && (
				<>
					<Card>
						<CardHeader>
							<CardTitle>Message Count</CardTitle>
						</CardHeader>
						<CardContent>
							<p>{data.app?.kakao?.message_count}</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Subscriptions</CardTitle>
						</CardHeader>
						<CardContent>
							{data.subscriptions?.friend_ids ? (
								<div className="space-y-4">
									{(() => {
										const friendsArray = JSON.parse(
											data.subscriptions?.friend_ids || "[]"
										);
										const subscriptionsArray =
											data.subscriptions?.subscriptions || [];

										return friendsArray.map((friend: KakaoFriend) => {
											const isSubscribed = subscriptionsArray.includes(
												friend.id.toString()
											);

											return (
												<div
													key={friend.id}
													className="flex items-center justify-between"
												>
													<div className="flex items-center space-x-3">
														<Avatar className="h-10 w-10">
															<AvatarImage
																src={friend.profile_thumbnail_image}
															/>
															<AvatarFallback>
																{friend.profile_nickname[0]}
															</AvatarFallback>
														</Avatar>
														<span>{friend.profile_nickname}</span>
													</div>
													<Button
														variant={isSubscribed ? "outline" : "default"}
														size="sm"
														onClick={() => {
															if (!isSubscribed) {
																const inviteUrl = `https://goodsheet-vercel.vercel.app/kakao/add/${user_id}`;
																copyToClipboard(inviteUrl);
															}
														}}
													>
														{isSubscribed ? "Subscribed" : "Invite"}
													</Button>
												</div>
											);
										});
									})()}
								</div>
							) : (
								<p>No friends available</p>
							)}
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
