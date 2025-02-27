import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { user_id, memo } = await request.json();
    
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/send-memo`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    user_id: user_id,
                    memo: memo,
                }),
        }
    );

    const data = await response.json();

    return NextResponse.json(data);
}

