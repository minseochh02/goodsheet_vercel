import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { user_id, sheet_id, script_id } = await req.json();

	console.log(user_id, sheet_id, script_id);

	return NextResponse.json({ message: "User created" });
}
