"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { UserData } from "@/utils/types/data";

export default function SignUpPageContent() {
	const [currentStep, setCurrentStep] = useState(1);
	const [authLoading, setAuthLoading] = useState(false);
	const [templateOpened, setTemplateOpened] = useState(false);
	const [user, setUser] = useState<UserData | null>(null);
	const [appCreating, setAppCreating] = useState(false);
	const supabase = createClient();

	// Debug current state
	useEffect(() => {
		console.log("State updated:", {
			currentStep,
			authLoading,
			user,
			templateOpened,
			appCreating,
		});
	}, [currentStep, authLoading, user, templateOpened, appCreating]);

	const moveToNextStep = useCallback((step: number) => {
		console.log("Moving to step:", step);
		setCurrentStep(step);
	}, []);

	const handleUserSetup = useCallback(
		async (authUser: any) => {
			// Skip setup if we're past step 1
			if (currentStep > 1) {
				console.log("Skipping user setup - already past step 1");
				return;
			}

			console.log("Starting user setup for:", authUser);
			if (!authUser?.id) {
				console.log("No auth user ID found");
				return;
			}

			setAuthLoading(true);
			try {
				// Check if user already exists
				console.log("Checking if user exists:", authUser.id);
				const { data: existingUser, error: existingError } = await supabase
					.from("users")
					.select()
					.eq("id", authUser.id)
					.single();

				console.log("User check result:", { existingUser, existingError });

				if (existingError && existingError.code !== "PGRST116") {
					console.error("Error checking existing user:", existingError);
					return;
				}

				if (existingUser) {
					console.log("Found existing user, checking for existing app");

					// Check if user has an existing app setup
					const { data: existingApp, error: appError } = await supabase
						.from("apps")
						.select()
						.eq("user_id", authUser.id)
						.not("sheet_id", "is", null)
						.single();

					if (appError && appError.code !== "PGRST116") {
						console.error("Error checking existing app:", appError);
						return;
					}

					if (existingApp) {
						console.log("Found existing app, redirecting to /dashboard");
						window.location.href = "/dashboard";
						return;
					}

					console.log("No existing app found, checking current step");
					setUser(existingUser);
					// Only move to step 2 if we're still on step 1
					if (currentStep === 1) {
						console.log("Moving to step 2");
						moveToNextStep(2);
					}
					return;
				}

				// Create new user only if they don't exist
				console.log("Creating new user");
				const { data: userData, error: userError } = await supabase
					.from("users")
					.insert({
						id: authUser.id,
						email: authUser.email,
						name: authUser.user_metadata.name,
						created_at: new Date().toISOString(),
					})
					.select()
					.single();

				if (userError) {
					if (userError.code === "23505") {
						console.log(
							"User already exists (race condition), fetching user data"
						);
						const { data: retryUser } = await supabase
							.from("users")
							.select()
							.eq("id", authUser.id)
							.single();
						if (retryUser) {
							console.log("Retrieved user after race condition");
							setUser(retryUser);
							// Only move to step 2 if we're still on step 1
							if (currentStep === 1) {
								console.log("Moving to step 2");
								moveToNextStep(2);
							}
							return;
						}
					}
					throw userError;
				}

				console.log("Successfully created new user");
				setUser(userData);
				// Only move to step 2 if we're still on step 1
				if (currentStep === 1) {
					console.log("Moving to step 2");
					moveToNextStep(2);
				}
			} catch (error) {
				console.error("Error in user setup:", error);
			} finally {
				setAuthLoading(false);
			}
		},
		[supabase, setUser, moveToNextStep, currentStep]
	);

	useEffect(() => {
		let mounted = true;

		const checkUser = async () => {
			console.log("Checking current user");
			const {
				data: { user: authUser },
				error,
			} = await supabase.auth.getUser();

			if (error) {
				console.error("Error getting user:", error);
				return;
			}

			if (authUser && mounted) {
				console.log("Found authenticated user:", authUser);
				await handleUserSetup(authUser);
			} else {
				console.log("No authenticated user found");
			}
		};

		checkUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log("Auth state changed:", event, session?.user?.id);
			if (event === "SIGNED_IN" && session?.user && mounted) {
				console.log("Processing sign in for user:", session.user.id);
				await handleUserSetup(session.user);
			}
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, [handleUserSetup, supabase]);

	const handleSignUp = async () => {
		try {
			setAuthLoading(true);
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

			if (error) {
				console.error("Error during sign in:", error);
				setAuthLoading(false);
			}
		} catch (error) {
			console.error("Error:", error);
			setAuthLoading(false);
		}
	};

	const setUpApp = () => {
		console.log("Setting up app");
		const templateUrl = process.env.NEXT_PUBLIC_GOOSL_TEMPLATE_URL;
		if (!templateUrl) {
			console.error("Template URL is not defined");
			return;
		}
		window.open(templateUrl, "_blank");
		setTemplateOpened(true);
	};

	// Handle URL parameters for app creation
	useEffect(() => {
		const handleAppSetup = async () => {
			// Only proceed if we have a user
			if (!user?.id) return;

			const searchParams = new URLSearchParams(window.location.search);
			const sheetId = searchParams.get("sheet_id");
			const scriptId = searchParams.get("script_id");

			// If we have both parameters, create the app
			if (sheetId && scriptId) {
				console.log("Found sheet_id and script_id, creating app");
				setAppCreating(true);
				try {
					// Check if app already exists
					const { data: existingApp } = await supabase
						.from("apps")
						.select()
						.eq("user_id", user.id)
						.single();

					if (existingApp) {
						console.log("App already exists, redirecting to /dashboard");
						window.location.href = "/dashboard";
						return;
					}

					// Create new app
					const { error: appError } = await supabase.from("apps").insert({
						user_id: user.id,
						sheet_id: sheetId,
						script_id: scriptId,
					});

					if (appError) {
						console.error("Error creating app:", appError);
						return;
					}

					console.log("App created successfully, redirecting to /dashboard");
					window.location.href = "/dashboard";
				} catch (error) {
					console.error("Error in app setup:", error);
				} finally {
					setAppCreating(false);
				}
			}
		};

		handleAppSetup();
	}, [user, supabase]);

	const steps = [
		{
			number: 1,
			title: "Sign in with Google",
			description: "Connect your Google account to get started",
			action: handleSignUp,
			buttonText: "Continue with Google",
			loading: authLoading,
		},
		{
			number: 2,
			title: "Create Your App",
			description: templateOpened
				? "1. Make a copy of the template in the opened tab\n2. Click 'Next' after you've copied the template"
				: "You will need to create a copy of the template spreadsheet",
			action: templateOpened ? () => setCurrentStep(3) : setUpApp,
			buttonText: templateOpened ? "Next" : "Get a Copy of Template",
			loading: false,
		},
		{
			number: 3,
			title: "Complete Setup",
			description:
				"In your copied spreadsheet, click on Extensions > GoodSheetLife > Connect to Google Sheets to complete the setup",
			action: () => {}, // Remove dashboard redirect as it's handled by URL params
			buttonText: "Waiting for setup completion...",
			loading: appCreating,
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Create your account (Step {currentStep})
					</CardTitle>
					<CardDescription>Complete these steps to get started</CardDescription>
				</CardHeader>
				<Suspense fallback={<div>Loading...</div>}>
					<CardContent>
						{/* Progress bar */}
						<div className="mb-8">
							<div className="flex items-center justify-between mb-2">
								{steps.map((step, index) => (
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
										{index < steps.length - 1 && (
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
								{steps[currentStep - 1].title}
							</h3>
							<p className="text-gray-600 mb-6">
								{steps[currentStep - 1].description}
							</p>
							<Button
								onClick={steps[currentStep - 1].action}
								disabled={steps[currentStep - 1].loading}
								className="w-full max-w-sm"
							>
								{steps[currentStep - 1].loading ? (
									<span className="flex items-center">Loading...</span>
								) : (
									<span className="flex items-center">
										{steps[currentStep - 1].buttonText}
										<ArrowRight className="ml-2 w-4 h-4" />
									</span>
								)}
							</Button>
						</div>

						{/* Debug info */}
						{process.env.NODE_ENV === "development" && (
							<div className="mt-8 p-4 bg-gray-100 rounded text-xs">
								<pre>
									Current State:{" "}
									{JSON.stringify(
										{
											currentStep,
											authLoading,
											user,
											templateOpened,
											appCreating,
										},
										null,
										2
									)}
								</pre>
							</div>
						)}
					</CardContent>
				</Suspense>
			</Card>
		</div>
	);
}
