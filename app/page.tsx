"use client";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ClientOnly } from "@/components/ClientOnly";

export default function Home() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const supabase = createClient();

	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error) {
				console.error("Auth error:", error);
				return;
			}

			setIsAuthenticated(!!session?.user);
			setUserEmail(session?.user?.email ?? null);
		};

		void checkAuth();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setIsAuthenticated(!!session?.user);
			setUserEmail(session?.user?.email ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	const handleLogin = async () => {
		try {
			await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			<main className="container mx-auto px-4 py-16">
				{/* Hero Section */}
				<section className="text-center mb-16">
					<h1 className="text-5xl font-bold mb-6 text-gray-800">
						Manage Your Workspace with Ease
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Streamline your document signing process with our secure, efficient,
						and user-friendly digital signature platform.
					</p>
					<ClientOnly>
						<div className="flex justify-center gap-4">
							{isAuthenticated ? (
								<Link
									href={`/mypage`}
									className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									Go to My Page
								</Link>
							) : (
								<button
									onClick={handleLogin}
									className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									Get Started
								</button>
							)}
						</div>
					</ClientOnly>
				</section>

				{/* Features Section */}
				<section className="grid md:grid-cols-3 gap-8 mb-16">
					<div className="bg-white p-6 rounded-xl shadow-sm">
						<h3 className="text-xl font-semibold mb-2">Secure Signing</h3>
						<p className="text-gray-600">
							Advanced encryption and authentication to keep your documents
							safe.
						</p>
					</div>
					<div className="bg-white p-6 rounded-xl shadow-sm">
						<h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
						<p className="text-gray-600">
							Seamlessly integrate with your existing workflow and tools.
						</p>
					</div>
					<div className="bg-white p-6 rounded-xl shadow-sm">
						<h3 className="text-xl font-semibold mb-2">Track & Manage</h3>
						<p className="text-gray-600">
							Monitor document status and manage signatures in real-time.
						</p>
					</div>
				</section>

				{/* CTA Section */}
				<section className="text-center bg-blue-600 text-white rounded-2xl p-12">
					<h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
					<p className="text-xl mb-8 opacity-90">
						Join thousands of businesses using GoodSlideLife for their document
						signing needs
					</p>
					{isAuthenticated ? (
						<Link
							href={`/mypage`}
							className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
						>
							Go to My Page
						</Link>
					) : (
						<Link
							href={"/signup"}
							className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
						>
							Create Your Account
						</Link>
					)}
				</section>
			</main>
		</div>
	);
}
