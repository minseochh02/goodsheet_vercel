"use client";

import { createClient } from "@/utils/supabase/client";

interface User {
	id: string;
	name: string | null;
	email: string;
	profile_pic: string | null;
	created_at: string;
}

interface App {
	id: string;
	user_id: string;
	sheet_id: string | null;
	script_id: string | null;
	kakao: {
		nickname: string | null;
		profile_image: string | null;
		token: string | null;
		message_count: number | null;
	} | null;
}

interface Subscription {
	id: string;
	user_id: string;
	subscriptions: string[] | null;
	created_at: string;
}

interface DashboardData {
	user: User | null;
	app: App | null;
	subscriptions: Subscription | null;
}

import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function MyDashboardContent() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<DashboardData>({
		user: null,
		app: null,
		subscriptions: null,
	});
	const supabase = createClient();

	useEffect(() => {
		async function fetchDashboardData() {
			try {
				setLoading(true);
				setError(null);

				// Get current user
				const {
					data: { user },
					error: userError,
				} = await supabase.auth.getUser();
				if (userError) throw new Error("Failed to get user session");
				if (!user) throw new Error("No user found");

				// Fetch user details
				const { data: userData, error: userDetailsError } = await supabase
					.from("users")
					.select("*")
					.eq("id", user.id)
					.single();
				if (userDetailsError) throw new Error("Failed to fetch user details");

				// Fetch app data
				const { data: appData, error: appError } = await supabase
					.from("apps")
					.select("*")
					.eq("user_id", user.id)
					.single();
				if (appError) throw new Error("Failed to fetch app data");

				// Only fetch subscriptions if kakao exists
				let subscriptionData = null;
				if (appData?.kakao?.token) {
					const { data: subData, error: subError } = await supabase
						.from("subscriptions")
						.select("*")
						.eq("user_id", user.id)
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
	}, []);

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
								{data.app?.kakao?.token ? "Connected" : "Not connected"}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Subscription Card - Only show if kakao exists */}
			{data.app?.kakao?.token && (
				<Card>
					<CardHeader>
						<CardTitle>Subscriptions</CardTitle>
					</CardHeader>
					<CardContent>
						{data.subscriptions?.subscriptions?.length ? (
							<ul className="list-disc pl-4">
								{data.subscriptions.subscriptions.map((sub, index) => (
									<li key={index}>{sub}</li>
								))}
							</ul>
						) : (
							<p>No active subscriptions</p>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
