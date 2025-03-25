import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { user_id, friend_names } = data;

        if (!user_id) {
            return NextResponse.json(
                { error: "Missing user_id parameter" },
                { status: 400 }
            );
        }
        if (!friend_names) {
            return NextResponse.json(
                { error: "Missing friend_names parameter" },
                { status: 400 }
            );
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resolve-friends`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id, friend_names }),
        });

        return response.json();
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error resolving friends" }, { status: 500 });
    }
}