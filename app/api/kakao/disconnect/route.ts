import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const { user_id } = data;
    
    try {
        const response = await fetch("https://minseochh02-goodsheet.hf.space/disconnect-kakao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to disconnect Kakao account");
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error disconnecting Kakao account:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
