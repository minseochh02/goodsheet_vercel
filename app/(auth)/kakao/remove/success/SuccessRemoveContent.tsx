"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { UserData } from "@/utils/types/data";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function KakaoSuccessRemoveContent() {
	const searchParams = useSearchParams();
	const user_id = searchParams.get("user_id");
	const router = useRouter();
	const supabase = createClient();
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSubscriptionInfo = async () => {
			setLoading(true);

			const { data: user, error } = await supabase
				.from("users")
				.select("*")
				.eq("id", user_id)
				.single();

			if (error) {
				console.error("Error fetching user:", error);
				setLoading(false);
				return;
			}

			setUser(user);
			setLoading(false);
		};

		if (user_id) {
			fetchSubscriptionInfo();
		}
	}, [user_id, supabase]);

	return (
		<div>
			{loading ? (
				<p>Unsubscribed successfully</p>
			) : user ? (
				<h1>Successfully unsubscribed from {user.name}</h1>
			) : (
				<p>Unsubscription information not found.</p>
			)}
		</div>
	);
}
