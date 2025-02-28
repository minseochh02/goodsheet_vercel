import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Get the authorization code from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // This contains the user_id from the sender
    
    if (!code || !state) {
        return NextResponse.redirect(new URL("/error?message=Missing+required+parameters", request.url));
    }
    
    try {
        // Exchange the code for Kakao tokens and get subscriber info
        const tokenResponse = await fetch(`https://minseochh02-goodsheet.hf.space/auth/callback/subscription?code=${code}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        if (!tokenResponse.ok) {
            throw new Error("Failed to authenticate with Kakao");
        }
        
        const tokenData = await tokenResponse.json();
        
        // Get the subscriber ID from the token response
        const subscriberId = tokenData.id;
        
        if (!subscriberId) {
            throw new Error("Failed to get subscriber ID");
        }
        
        // Now make the unsubscribe API call with both user_id and subscriber_id
        const unsubscribeResponse = await fetch("https://minseochh02-goodsheet.hf.space/kakao/unsubscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: state, // The sender's user_id from the state parameter
                subscriber_id: subscriberId, // The subscriber's ID from Kakao
            }),
        });
        
        if (!unsubscribeResponse.ok) {
            throw new Error("Failed to unsubscribe");
        }
        
        // Redirect to success page
        return NextResponse.redirect(new URL("/kakao/unsubscribe-success", request.url));
    } catch (error) {
        console.error("Error in unsubscribe callback:", error);
        return NextResponse.redirect(new URL("/error?message=Failed+to+unsubscribe", request.url));
    }
} 