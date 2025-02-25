import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { user_id, sheet_id, script_id } = await req.json();
    
    const body = {
        user_id: user_id,
        sheet_id: sheet_id,
        script_id: script_id
    }

	 try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/new-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
		});

		return NextResponse.json({ message: "User created" });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error creating user" }, { status: 500 });
	}
}
