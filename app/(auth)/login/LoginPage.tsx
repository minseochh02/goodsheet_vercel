import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";

export default async function LoginPageContent() {
	const supabase = createClient();
	const searchParams = useSearchParams();
	const user_id = searchParams.get("user_id");

	if (user_id) {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", user_id);

		if (data) {
			return redirect(`/mypage?user_id=${user_id}`);
		} 
	} else {
		const { data: session } = await supabase.auth.getSession();
		if (session) {
			return redirect(`/mypage`);
		} 
    }

    return;
}
