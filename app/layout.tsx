import { ThemeSwitcher } from "@/components/theme-switcher";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata: Metadata = {
	title: "GoodSheetLife",
	description: "Transform everything into spreadsheets",
	icons: {
		icon: "/favicon.ico",
	},
};

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
			suppressHydrationWarning
		>
			<body className="bg-background text-foreground">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />

					{children}
					<Toaster />
					<footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
						<p>
							Powered by{" "}
							<a
								href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
								target="_blank"
								className="font-bold hover:underline"
								rel="noreferrer"
							>
								Supabase
							</a>
						</p>
						<ThemeSwitcher />
					</footer>
				</ThemeProvider>
			</body>
		</html>
	);
}
