"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function KakaoDisconnectSuccessContent() {
	const router = useRouter();

	return (
		<div className="container max-w-md py-10">
			<Card className="text-center">
				<CardHeader>
					<div className="flex justify-center mb-4">
						<CheckCircle className="h-12 w-12 text-green-500" />
					</div>
					<CardTitle>Kakao Account Disconnected</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						Your Kakao account has been successfully disconnected from our
						service. All your Kakao-related data has been removed.
					</p>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button onClick={() => router.push("/dashboard")}>
						Return to Dashboard
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
