import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

	try {
		const response = await fetch(
			"https://minseochh02-goodsheet.hf.space/authorize-subscription?user_id=" + user_id,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
		return NextResponse.json(
			{ error: "Failed to get authorization URL" },
			{ status: 500 }
		);
	}
}
