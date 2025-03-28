import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { MyDashboardContent } from "./DashboardContent";

export default function DashboardPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center p-4">
					<Loader2 className="animate-spin h-6 w-6 text-gray-600" />
				</div>
			}
		>
			<MyDashboardContent />
		</Suspense>
	);
}
