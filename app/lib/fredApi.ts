// FRED API utility functions
// API Documentation: https://fred.stlouisfed.org/docs/api/fred/

const FRED_API_BASE = 'https://api.stlouisfed.org/fred';

// FRED Series IDs for common economic indicators
export const FRED_SERIES = {
  CPI: 'CPIAUCSL', // Consumer Price Index for All Urban Consumers
  UNEMPLOYMENT: 'UNRATE', // Unemployment Rate
  TREASURY_10Y: 'GS10', // 10-Year Treasury Constant Maturity Rate
  TREASURY_3M: 'TB3MS', // 3-Month Treasury Bill Secondary Market Rate
} as const;

interface FredObservation {
  date: string;
  value: string;
}

interface FredApiResponse {
  observations: FredObservation[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

/**
 * Fetches series observations from FRED API
 * @param seriesId - The FRED series ID (e.g., 'CPIAUCSL')
 * @param apiKey - Your FRED API key
 * @param options - Optional parameters for the request
 */
export async function fetchFredSeries(
  seriesId: string,
  apiKey: string,
  options: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  } = {}
): Promise<ChartDataPoint[]> {
  const { startDate, endDate, limit } = options;

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
  });

  if (startDate) params.append('observation_start', startDate);
  if (endDate) params.append('observation_end', endDate);
  if (limit) params.append('limit', limit.toString());

  const url = `${FRED_API_BASE}/series/observations?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status} ${response.statusText}`);
    }

    const data: FredApiResponse = await response.json();

    return data.observations
      .filter(obs => obs.value !== '.')
      .map(obs => ({
        name: obs.date,
        value: parseFloat(obs.value),
      }));
  } catch (error) {
    console.error(`Error fetching FRED series ${seriesId}:`, error);
    throw error;
  }
}

/**
 * Fetches the last 5 years of data for a series
 */
export async function fetchLast5Years(
  seriesId: string,
  apiKey: string
): Promise<ChartDataPoint[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 5);

  return fetchFredSeries(seriesId, apiKey, {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  });
}
