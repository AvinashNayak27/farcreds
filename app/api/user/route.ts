import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  const username = searchParams.get("username");

  if (!fid && !username) {
    return NextResponse.json(
      { error: "FID or username is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      fid
        ? `https://client.farcaster.xyz/v2/user?fid=${fid}`
        : `https://client.farcaster.xyz/v2/user-by-username?username=${username}`
    );
    const data = await response.json();
    return NextResponse.json(data.result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
