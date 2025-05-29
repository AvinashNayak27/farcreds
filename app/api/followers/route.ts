import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fid = searchParams.get('fid')

  if (!fid) {
    return NextResponse.json({ error: 'FID is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://client.farcaster.xyz/v2/followers?fid=${fid}&limit=100`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch following' },
      { status: 500 }
    )
  }
}
