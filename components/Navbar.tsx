/* eslint-disable */
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

function NavbarContent() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const user_id = searchParams.get("user_id");
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		const getUser = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				setUser(user);
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setLoading(false);
			}
		};

		getUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	const handleLogin = async () => {
		try {
			await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
					queryParams: {
						access_type: "offline",
						prompt: "consent",
					},
				},
			});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			await router.push("/");
			router.refresh();
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	if (user_id) return null;

	return (
		<header className="bg-white shadow-sm">
			<nav className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link href="/" className="text-xl font-bold text-blue-600">
							GoodSheetLife
						</Link>
						<div className="hidden md:flex items-center space-x-4 ml-8">
							<Link
								href="/"
								className={`px-3 py-2 rounded-md text-sm font-medium ${
									pathname === "/"
										? "text-blue-600 bg-blue-50"
										: "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
								}`}
							>
								Home
							</Link>
							<Suspense fallback={<div>Loading...</div>}>
								{user && (
									<>
										<Link
											href="/dashboard"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/dashboard"
													? "text-blue-600 bg-blue-50"
													: "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
											}`}
										>
											My Page
										</Link>
										{/* <Link
											href="/mylinks"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/mylinks"
													? "text-blue-600 bg-blue-50"
													: "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
											}`}
										>
											My Links
										</Link>
										<Link
											href="/marketplace"
											className={`px-3 py-2 rounded-md text-sm font-medium ${
												pathname === "/marketplace"
													? "text-blue-600 bg-blue-50"
													: "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
											}`}
										>
											Marketplace
										</Link> */}
									</>
								)}
							</Suspense>
						</div>
					</div>

					<div className="flex items-center space-x-4">
						<Suspense fallback={<div>Loading...</div>}>
							{user ? (
								<div className="flex items-center space-x-4">
									<span className="text-sm text-gray-600">{user.email}</span>
									<button
										onClick={handleSignOut}
										className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
									>
										Log Out
									</button>
								</div>
							) : (
								<button
									onClick={handleLogin}
									className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
								>
									Log in with Google
								</button>
							)}
						</Suspense>
					</div>
				</div>
			</nav>
		</header>
	);
}

export default function Navbar() {
	return (
		<Suspense fallback={<></>}>
			<NavbarContent />
		</Suspense>
	);
}
