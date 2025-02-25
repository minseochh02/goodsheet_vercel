// server component, cannot use hooks or state management
import LoginPageContent from "./LoginPage";
import { Suspense } from "react";
export default async function LoginPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginPageContent />
		</Suspense>
	);
}
