"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function DisconnectKakaoContent() {
	const [isDisconnecting, setIsDisconnecting] = useState(false);
	const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();

	const handleDisconnect = async () => {
		if (isDisconnecting) return;

		setIsDisconnecting(true);
		setStatus("idle");

		try {
			const response = await fetch("/api/kakao/disconnect", {
				method: "POST",
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to disconnect Kakao account");
			}

			setStatus("success");
		} catch (error) {
			console.error("Error:", error);
			setStatus("error");
			setErrorMessage(
				error instanceof Error ? error.message : "Unknown error occurred"
			);
		} finally {
			setIsDisconnecting(false);
		}
	};

	return (
		<div className="container max-w-md py-10">
			<Card>
				<CardHeader>
					<CardTitle>Disconnect Kakao Account</CardTitle>
					<CardDescription>
						This will disconnect your Kakao account from our service and remove
						all related data.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<p>When you disconnect your Kakao account:</p>
						<ul className="list-disc pl-5 space-y-2">
							<li>Your Kakao account will be unlinked from our service</li>
							<li>Your Kakao profile information will be removed</li>
							<li>You will be removed from all subscription lists</li>
							<li>You will no longer receive messages through Kakao</li>
						</ul>

						<p className="font-semibold">
							You can always reconnect your Kakao account later if you wish.
						</p>

						{status === "success" && (
							<Alert className="bg-green-50 border-green-200">
								<CheckCircle className="h-4 w-4 text-green-600" />
								<AlertTitle>Success</AlertTitle>
								<AlertDescription>
									Your Kakao account has been successfully disconnected.
								</AlertDescription>
							</Alert>
						)}

						{status === "error" && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>
									{errorMessage ||
										"Failed to disconnect Kakao account. Please try again."}
								</AlertDescription>
							</Alert>
						)}
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" onClick={() => router.back()}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDisconnect}
						disabled={isDisconnecting || status === "success"}
					>
						{isDisconnecting ? "Disconnecting..." : "Disconnect Kakao"}
					</Button>
				</CardFooter>
			</Card>

			{status === "success" && (
				<div className="mt-4 text-center">
					<Button variant="link" onClick={() => router.push("/dashboard")}>
						Return to Dashboard
					</Button>
				</div>
			)}
		</div>
	);
}
