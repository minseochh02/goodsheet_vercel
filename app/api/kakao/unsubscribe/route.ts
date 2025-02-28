import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { user_id } = await request.json();
    
    // make call to fastapi backend
    const response = await fetch("https://minseochh02-goodsheet.hf.space/kakao/unsubscribe", {
        method: "POST",
        body: JSON.stringify({ user_id }),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
    
    
}
