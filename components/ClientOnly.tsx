"use client";

import { useState, useEffect } from "react";

interface ClientOnlyProps {
	children: React.ReactNode;
}

export function ClientOnly({ children }: ClientOnlyProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return <>{children}</>;
}
