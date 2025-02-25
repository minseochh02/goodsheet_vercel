"use client";

import { createClient } from "@/utils/supabase/client";

export async function MyPageContent() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return (
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="container mx-auto px-4">
					<div className="bg-white rounded-lg shadow p-6">
						<p className="text-center text-red-600">Error: No user found</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4">
				<div className="bg-white rounded-lg shadow p-6">
					<p> My Page </p>
				</div>
			</div>
		</div>
	);
}
