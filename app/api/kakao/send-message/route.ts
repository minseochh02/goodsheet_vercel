import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { user_id, message, recipient } = await request.json();
    
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/send-message`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    user_id: user_id,
                    message: message,
                    recipient: recipient
                }),
        }
    );

    const data = await response.json();

    return NextResponse.json(data);
}

