import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, user_id } = await request.json();

    if (!code || !user_id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Forward the authorization code to your backend
    const response = await fetch('https://minseochh02-goodsheet.hf.space/kakao/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, user_id }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
		return NextResponse.json(
			{ error: "Failed to process callback" },
			{ status: 500 }
		);
	}
}
    