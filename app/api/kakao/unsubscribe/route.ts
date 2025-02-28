import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const user_id = request.nextUrl.searchParams.get("user_id");
    
    // make call to fastapi backend
    const response = await fetch("https://minseochh02-goodsheet.hf.space/kakao/authorize-unsubscribe?user_id=" + user_id, {
        method: "POST",
        body: JSON.stringify({ user_id }),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
    
    
}
