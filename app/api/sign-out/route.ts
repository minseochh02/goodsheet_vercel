import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { user_id } = data;

        if (!user_id) {
            return NextResponse.json(
                { error: "Missing user_id parameter" },
                { status: 400 }
            );
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign-out`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id }),
        });

        return NextResponse.json({ message: "User created" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error creating user" }, { status: 500 });
    }
}