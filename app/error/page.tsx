"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
	const searchParams = useSearchParams();
	const errorMessage = searchParams.get("message") || "An error occurred";

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-bold text-gray-900">Error</h2>
					<p className="mt-2 text-sm text-gray-600">
						{decodeURIComponent(errorMessage)}
					</p>
				</div>

				<div className="mt-8 space-y-6">
					<div className="rounded-md bg-red-50 p-4">
						<div className="flex">
							<div className="ml-3">
								<h3 className="text-sm font-medium text-red-800">
									Something went wrong
								</h3>
								<div className="mt-2 text-sm text-red-700">
									<p>
										We encountered an error while processing your request.
										Please try again later.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col space-y-4">
						<Link href="/" passHref>
							<Button className="w-full">Return to Home</Button>
						</Link>
						<Button
							onClick={() => window.history.back()}
							variant="outline"
							className="w-full"
						>
							Go Back
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
