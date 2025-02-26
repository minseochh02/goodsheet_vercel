"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { UserData } from "@/utils/types/data";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function KakaoSuccessAddContent() {
	const searchParams = useSearchParams();
	const user_id = searchParams.get("user_id");
	const router = useRouter();
	const supabase = createClient();
	const [subscription, setSubscription] = useState<UserData | null>(null);

	useEffect(() => {
		const fetchSubscriptionInfo = async () => {
			const { data: user, error } = await supabase
				.from("users")
				.select("*")
				.eq("id", user_id)
				.single();
			if (error) {
				console.error("Error fetching user:", error);
				return;
			}
			const { data: subscription, error: subscriptionError } = await supabase
				.from("subscriptions")
				.select("*")
				.eq("user_id", user_id)
				.single();
			if (subscriptionError) {
				// TODO: handle error
				return;
			}
			setSubscription(subscription);
		};
		fetchSubscriptionInfo();
	}, []);

	return (
		<div>
			<h1>Successfully subscribed to {subscription?.name}</h1>
		</div>
	);
}
