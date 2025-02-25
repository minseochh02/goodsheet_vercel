"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export function KakaoAddContent({ params }: { params: { user_id: string } }) {
	const [user_name, setUser_name] = useState("");
	const [profile_pic, setProfile_pic] = useState("");

	useEffect(() => {
		const fetchUser = async () => {
			const supabase = await createClient();
			const { data: app } = await supabase
				.from("apps")
				.select("*")
				.eq("id", params.user_id)
				.single();
			setUser_name(app?.kakao?.nickname);
			setProfile_pic(app?.kakao?.profile_image);
		};
		fetchUser();
	}, [params.user_id]);

	return (
		<div className="container mx-auto max-w-2xl p-6">
			<Card className="w-full bg-card shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Add Friend on GoodSheetLife
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="text-muted-foreground">
						<Avatar>
							<AvatarImage src={profile_pic} />
							<AvatarFallback>{user_name?.charAt(0)}</AvatarFallback>
						</Avatar>
						<p className="mb-4">
							You're about to agree to receiving messages from
							<span className="font-semibold"> {user_name}</span> on
							GoodSheetLife.
						</p>
						<p className="mb-2">
							By proceeding, you agree to allow this user to:
						</p>
						<ul className="list-disc pl-6 mb-4 text-left">
							<li>View your KakaoTalk profile information</li>
							<li>Send you KakaoTalk messages through GoodSheetLife</li>
						</ul>
						<p>
							This connection will help them send you automated messages through
							Google Sheets.
						</p>
					</div>

					<Button
						asChild
						className="w-full sm:w-auto bg-[#fee500] hover:bg-[#e6cf00] text-black"
					>
						<a href={`/api/authorize-subscription?user_id=${user_id}`}>
							Continue with KakaoTalk
						</a>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
