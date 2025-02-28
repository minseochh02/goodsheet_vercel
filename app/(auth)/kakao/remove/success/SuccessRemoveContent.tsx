"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { UserData } from "@/utils/types/data";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, UserMinus } from "lucide-react";

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
		<div className="container mx-auto max-w-2xl p-6 min-h-[50vh] flex items-center justify-center">
			<Card className="w-full bg-card shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Unsubscription Status
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex flex-col items-center text-center p-4">
						{loading ? (
							<div className="flex flex-col items-center space-y-4">
								<Loader2 className="h-12 w-12 text-primary animate-spin" />
								<p className="text-lg text-muted-foreground">
									Processing your unsubscription...
								</p>
							</div>
						) : user ? (
							<div className="flex flex-col items-center space-y-4">
								<div className="relative">
									<UserMinus className="h-16 w-16 text-red-500" />
									<CheckCircle2 className="h-8 w-8 text-green-500 absolute -bottom-2 -right-2" />
								</div>
								<h2 className="text-xl font-semibold">
									Unsubscribed Successfully
								</h2>
								<p className="text-lg">
									You have successfully unsubscribed from{" "}
									<span className="font-semibold">{user.name}</span>
								</p>
								<p className="text-sm text-muted-foreground mt-2">
									You will no longer receive messages from this user through
									GoodSheetLife.
								</p>
								<Button className="mt-6" onClick={() => router.push("/")}>
									Return to Home
								</Button>
							</div>
						) : (
							<div className="flex flex-col items-center space-y-4">
								<p className="text-lg text-muted-foreground">
									Unsubscription information not found.
								</p>
								<Button className="mt-4" onClick={() => router.push("/")}>
									Return to Home
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
