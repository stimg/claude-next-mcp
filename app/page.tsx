'use client';

import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ChartCard from './components/ChartCard';

interface ChartDataPoint {
  name: string;
  value: number;
}

// FRED Series IDs
const FRED_SERIES = {
  CPI: 'CPIAUCSL',
  UNEMPLOYMENT: 'UNRATE',
  TREASURY_10Y: 'GS10',
  TREASURY_3M: 'TB3MS',
};

export default function Home() {
  const [cpiData, setCpiData] = useState<ChartDataPoint[]>([]);
  const [unemploymentData, setUnemploymentData] = useState<ChartDataPoint[]>([]);
  const [bondYieldData, setBondYieldData] = useState<ChartDataPoint[]>([]);
  const [shortTermRatesData, setShortTermRatesData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        setError(null);

        const [cpi, unemployment, treasury10y, treasury3m] = await Promise.all([
          fetchFredData(FRED_SERIES.CPI),
          fetchFredData(FRED_SERIES.UNEMPLOYMENT),
          fetchFredData(FRED_SERIES.TREASURY_10Y),
          fetchFredData(FRED_SERIES.TREASURY_3M),
        ]);

        setCpiData(cpi);
        setUnemploymentData(unemployment);
        setBondYieldData(treasury10y);
        setShortTermRatesData(treasury3m);
      } catch (err) {
        console.error('Error fetching FRED data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  async function fetchFredData(series: string): Promise<ChartDataPoint[]> {
    const response = await fetch(`/api/fred?series=${series}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch data');
    }

    const { data } = await response.json();
    return data;
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-[#f3f4f6]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading economic data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-[#f3f4f6]">
          <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h2>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <div className="text-xs text-gray-600 bg-white p-3 rounded border border-gray-200">
              <p className="font-medium mb-2">To fix this:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Get a free API key at <a href="https://fredaccount.stlouisfed.org/apikeys" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">fredaccount.stlouisfed.org/apikeys</a></li>
                <li>Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in the project root</li>
                <li>Add: <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_FRED_API_KEY=your_key_here</code></li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto bg-[#f3f4f6]">
        <div className="max-w-[1400px] mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Economic Indicators Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time economic data from the Federal Reserve Economic Data (FRED) system
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard
              title="CPI - last five years"
              subtitle="FRED"
              data={cpiData}
              color="#3b82f6"
            />

            <ChartCard
              title="Intra-Annual Labor Statistics: Unemployment Rate Total"
              subtitle="FRED"
              data={unemploymentData}
              color="#3b82f6"
            />

            <ChartCard
              title="Interest Rates: Long-Term Government Bond Yields: 10-Year"
              subtitle="FRED"
              data={bondYieldData}
              color="#3b82f6"
            />

            <ChartCard
              title="Interest Rates: 3-Month or 90-Day Rates and Yields"
              subtitle="FRED"
              data={shortTermRatesData}
              color="#3b82f6"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
