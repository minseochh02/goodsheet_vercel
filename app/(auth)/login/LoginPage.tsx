"use client";

import { createClient } from "@/utils/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPageContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const user_id = searchParams.get("user_id");

	useEffect(() => {
		const checkAuthAndRedirect = async () => {
			const supabase = createClient();

			if (user_id) {
				const { data, error } = await supabase
					.from("users")
					.select("*")
					.eq("id", user_id);

				if (data) {
					router.push(`/mypage?user_id=${user_id}`);
					return;
				}
			} else {
				const { data: session } = await supabase.auth.getSession();
				if (session) {
					router.push("/mypage");
					return;
				}
			}
		};

		checkAuthAndRedirect();
	}, [user_id, router]);

	return null; // or a loading component while checking auth
}
