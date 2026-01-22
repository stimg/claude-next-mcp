import { NextResponse } from 'next/server';
import { fetchLast5Years, FRED_SERIES } from '@/app/lib/fredApi';

export async function GET(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_FRED_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'FRED API key not configured. Please set NEXT_PUBLIC_FRED_API_KEY in .env.local' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const series = searchParams.get('series');

  if (!series) {
    return NextResponse.json(
      { error: 'Series parameter is required' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchLast5Years(series, apiKey);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching FRED data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FRED data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Export series IDs for client use
export { FRED_SERIES };
