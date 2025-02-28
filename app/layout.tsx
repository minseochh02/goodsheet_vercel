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
						<div className="flex flex-col gap-2">
							<p>
								<a
									href="https://www.quus.cloud/"
									target="_blank"
									className="font-bold hover:underline"
									rel="noreferrer"
								>
									(주)쿠스 | QUUS Inc.
								</a>
							</p>
							<p>Email: quus.aispace@gmail.com | Tel: 010-7523-5071</p>
							<p>
								Address: 배곧테크노밸리 609호, 경기도 시흥시 서울대학로 59-69
							</p>
							<p>
								&copy; {new Date().getFullYear()} QUUS Inc. All rights reserved.
							</p>
						</div>
					</footer>
				</ThemeProvider>
			</body>
		</html>
	);
}
