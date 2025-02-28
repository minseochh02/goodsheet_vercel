import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnsubscribeSuccessPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-bold text-gray-900">
						Unsubscribed Successfully
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						You have been successfully unsubscribed from notifications.
					</p>
				</div>

				<div className="mt-8 space-y-6">
					<div className="rounded-md bg-green-50 p-4">
						<div className="flex">
							<div className="ml-3">
								<h3 className="text-sm font-medium text-green-800">Success</h3>
								<div className="mt-2 text-sm text-green-700">
									<p>
										You will no longer receive messages from this sender through
										GoodSheetLife.
									</p>
									<p className="mt-2">
										If you change your mind, you can always re-subscribe later.
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col space-y-4">
						<Link href="/" passHref>
							<Button className="w-full">Return to Home</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
