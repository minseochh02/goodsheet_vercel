import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function KakaoAuthContent() {
	const [user_id, setUserId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const searchParams = useSearchParams();

	useEffect(() => {
		setUserId(searchParams.get("user_id"));
	}, [searchParams]);

	useEffect(() => {
		if (!user_id) {
			const getSession = async () => {
				const supabase = createClient();
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (session) {
					const { data: user } = await supabase
						.from("users")
						.select("id")
						.eq("email", session.user.email)
						.single();

					if (user) {
						setUserId(user.id);
					}
				}
			};

			getSession();
		}
	}, [user_id]);

	const initiateKakaoAuth = async () => {
		if (!user_id) return;

		setIsLoading(true);
		try {
			const response = await fetch(`/api/kakao/authorize?user_id=${user_id}`);
			const data = await response.json();

			if (data.authorization_url) {
				// Store user_id in localStorage for the callback
				localStorage.setItem("kakao_auth_user_id", user_id);
				// Redirect to Kakao's auth page
				window.location.href = data.authorization_url;
			}
		} catch (error) {
			console.error("Failed to initiate Kakao auth:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			{isLoading ? (
				<div>Connecting to KakaoTalk...</div>
			) : (
				<button
					onClick={initiateKakaoAuth}
					disabled={!user_id}
					className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50"
				>
					Connect with KakaoTalk
				</button>
			)}
		</div>
	);
}
