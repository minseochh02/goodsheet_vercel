"use client";

import { useEffect, Suspense, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { UserData, AppData } from "@/utils/types/data";
import { Session } from "@supabase/supabase-js";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

// Search params wrapper component
function SignUpContent() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const redirect_url = searchParams.get("redirect_url");
	const sheet_id = searchParams.get("sheet_id");
	const script_id = searchParams.get("script_id");

	// state management
	const [user, setUser] = useState<UserData | null>(null);
	const [app, setApp] = useState<AppData | null>(null);
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	const supabase = createClient();

	// Initial auth check - runs only once
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				setLoading(true);
				const { data, error } = await supabase.auth.getSession();
				if (error) throw error;

				setSession(data.session);

				// After setting session, fetch user data if we have a session
				if (data.session?.user?.email) {
					const { data: userData, error: userError } = await supabase
						.from("users")
						.select("*")
						.eq("email", data.session.user.email)
						.single();

					if (userError && userError.code !== "PGRST116") {
						throw userError;
					}

					setUser(userData || null);

					// If we have a user, check for their app
					if (userData) {
						const { data: appData, error: appError } = await supabase
							.from("apps")
							.select("*")
							.eq("user_id", userData.id)
							.single();

						if (appError && appError.code !== "PGRST116") {
							throw appError;
						}

						setApp(appData || null);
					}
				}
			} catch (err) {
				console.error("Auth check error:", err);
			} finally {
				setLoading(false);
			}
		};

		checkAuthStatus();
	}, []);

	// Handle URL params scenario (Scenario A)
	useEffect(() => {
		if (!email || !sheet_id || !script_id || loading) return;

		const handleEmailParams = async () => {
			try {
				// Check if user exists by email
				const { data: userData, error: userError } = await supabase
					.from("users")
					.select("*")
					.eq("email", email)
					.single();

				if (userError && userError.code !== "PGRST116") {
					throw userError;
				}

				if (userData) {
					setUser(userData);
					setCurrentStep(3); // Move to app creation step

					// Check if app exists for this user
					const { data: appData, error: appError } = await supabase
						.from("apps")
						.select("*")
						.eq("user_id", userData.id)
						.single();

					if (appError && appError.code !== "PGRST116") {
						throw appError;
					}

					if (appData) {
						setApp(appData);
						// If app matches URL params, redirect to mypage
						if (
							appData.sheet_id === sheet_id &&
							appData.script_id === script_id
						) {
							redirect("/mypage");
						}
					} else {
						// Create new app for existing user
						const { data: newApp, error: createError } = await supabase
							.from("apps")
							.insert({
								user_id: userData.id,
								sheet_id: sheet_id,
								script_id: script_id,
							})
							.select()
							.single();

						if (createError) throw createError;
						setApp(newApp);
					}
				} else {
					// User doesn't exist, stay at step 1 for sign in
					setCurrentStep(1);
				}
			} catch (err) {
				console.error("URL params handling error:", err);
			}
		};

		handleEmailParams();
	}, [email, sheet_id, script_id, loading]);

	// Handle redirect from OAuth (Scenario C)
	useEffect(() => {
		if (!redirect_url || loading) return;

		const handleRedirect = async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();
				if (error) throw error;

				setSession(session);

				if (session?.user?.email) {
					// Check if user exists
					const { data: userData, error: userError } = await supabase
						.from("users")
						.select("*")
						.eq("email", session.user.email)
						.single();

					if (userError && userError.code !== "PGRST116") {
						throw userError;
					}

					if (userData) {
						setUser(userData);

						// Check for existing app
						const { data: appData, error: appError } = await supabase
							.from("apps")
							.select("*")
							.eq("user_id", userData.id)
							.single();

						if (appError && appError.code !== "PGRST116") {
							throw appError;
						}

						if (appData) {
							setApp(appData);
							redirect("/mypage");
						} else {
							// User exists but no app
							setCurrentStep(2);
						}
					} else {
						// Create new user
						const { data: newUser, error: createError } = await supabase
							.from("users")
							.insert({
								email: session.user.email,
								name: session.user.user_metadata.name,
								profile_pic: session.user.user_metadata.avatar_url,
								created_at: new Date(),
							})
							.select()
							.single();

						if (createError) throw createError;
						setUser(newUser);
						setCurrentStep(2);
					}
				}
			} catch (err) {
				console.error("Redirect handling error:", err);
			}
		};

		handleRedirect();
	}, [redirect_url, loading]);

	// Determine step based on state
	useEffect(() => {
		if (loading) return;

		if (!session) {
			setCurrentStep(1); // Not logged in
		} else if (!user) {
			setCurrentStep(1); // Logged in but no user record
		} else if (!app) {
			setCurrentStep(2); // User exists but no app
		} else {
			setCurrentStep(3); // User and app exist
		}
	}, [session, user, app, loading]);

	const handleGoogleSignIn = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback?redirect_to=/signup`,
					queryParams: {
						access_type: "offline",
						prompt: "consent",
					},
				},
			});

			if (error) throw error;
		} catch (err) {
			console.error("Google sign in error:", err);
		}
	};

	const handleCreateApp = () => {
		// Open template spreadsheet copy in new tab
		const templateUrl = process.env.NEXT_PUBLIC_GOOSL_TEMPLATE_URL;
		if (!templateUrl) {
			console.error("Template URL is not defined");
			return;
		}
		window.open(templateUrl, "_blank");
		setCurrentStep(3); // Move to next step after opening template
	};

	const handleCompleteSetup = () => {
		redirect("/mypage");
	};

	const stepsUI = [
		{
			number: 1,
			title: "Sign in with Google",
			description: "Connect your Google account to get started",
			action: handleGoogleSignIn,
			buttonText: "Continue with Google",
			loading: false,
		},
		{
			number: 2,
			title: "Create Your App",
			description:
				"1. Make a copy of the template in the opened tab\n2. Click 'Next' after you've copied the template",
			action: handleCreateApp,
			buttonText: "Get a Copy of Template",
			loading: false,
		},
		{
			number: 3,
			title: "Complete Setup",
			description:
				"In your copied spreadsheet, click on Extensions > GoodSheetLife > Connect to Google Sheets to complete the setup",
			action: handleCompleteSetup,
			buttonText: "Go to Dashboard",
			loading: false,
		},
	];

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
				<Card className="w-full max-w-2xl p-8">
					<div className="flex justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
					</div>
					<p className="text-center mt-4">Loading your account...</p>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Create your account (Step {currentStep})
					</CardTitle>
					<CardDescription>Complete these steps to get started</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Progress bar */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-2">
							{stepsUI.map((step, index) => (
								<React.Fragment key={step.number}>
									{/* Step circle */}
									<div className="flex flex-col items-center">
										<div
											className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${
												currentStep > step.number
													? "bg-green-500"
													: currentStep === step.number
														? "bg-blue-500"
														: "bg-gray-200"
											}
                      text-white font-medium
                    `}
										>
											{currentStep > step.number ? (
												<Check className="w-6 h-6" />
											) : (
												step.number
											)}
										</div>
										<span className="text-sm mt-2">{step.title}</span>
									</div>
									{/* Connector line */}
									{index < stepsUI.length - 1 && (
										<div
											className={`
                      flex-1 h-1 mx-4
                      ${
												currentStep > step.number + 1
													? "bg-green-500"
													: currentStep > step.number
														? "bg-blue-500"
														: "bg-gray-200"
											}
                    `}
										/>
									)}
								</React.Fragment>
							))}
						</div>
					</div>

					{/* Current step content */}
					<div className="text-center py-6">
						<h3 className="text-xl font-semibold mb-2">
							{stepsUI[currentStep - 1].title}
						</h3>
						<p className="text-gray-600 mb-6 whitespace-pre-line">
							{stepsUI[currentStep - 1].description}
						</p>
						<Button
							onClick={stepsUI[currentStep - 1].action}
							disabled={stepsUI[currentStep - 1].loading}
							className="w-full max-w-sm"
						>
							{stepsUI[currentStep - 1].loading ? (
								<span className="flex items-center">Loading...</span>
							) : (
								<span className="flex items-center">
									{stepsUI[currentStep - 1].buttonText}
									<ArrowRight className="ml-2 w-4 h-4" />
								</span>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function SignUpDev() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
					<Card className="w-full max-w-2xl p-8">
						<div className="flex justify-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
						</div>
						<p className="text-center mt-4">Loading...</p>
					</Card>
				</div>
			}
		>
			<SignUpContent />
		</Suspense>
	);
}
