"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function KakaoCallback() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleCallback = async () => {
			const code = searchParams.get("code");
			const user_id = localStorage.getItem("kakao_auth_user_id");

			if (!code || !user_id) {
				setError("Missing required parameters");
				return;
			}

			try {
				const response = await fetch("/api/kakao/callback", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ code, user_id }),
				});

				const data = await response.json();

				if (data.success) {
					// Clear the stored user_id
					localStorage.removeItem("kakao_auth_user_id");
					// Redirect to success page or home
					router.push("/kakao/success");
				} else {
					setError("Failed to complete authentication");
				}
			} catch (error) {
				setError("An error occurred during authentication");
			}
		};

		handleCallback();
	}, [searchParams, router]);

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	return <div>Completing authentication...</div>;
}
