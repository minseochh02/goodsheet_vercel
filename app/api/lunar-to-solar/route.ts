import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { lunar_dates } = data;

        if (!lunar_dates) {
            return NextResponse.json(
                { error: "Missing lunar_dates parameter" },
                { status: 400 }
            );
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lunar-to-solar`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lunar_dates }),
        });

        return NextResponse.json({ message: "Lunar to solar conversion successful" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error converting lunar to solar" }, { status: 500 });
    }
}