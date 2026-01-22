'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: Array<{ name: string; value: number }>;
  color?: string;
}

export default function ChartCard({ title, subtitle, data, color = '#3b82f6' }: ChartCardProps) {
  return (
    <div className="bg-white rounded border border-gray-300 p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-gray-900">{title}</h3>
        {subtitle && (
          <p className="text-[10px] text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 9 }}
            stroke="#9ca3af"
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9 }}
            stroke="#9ca3af"
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              fontSize: '11px',
              padding: '4px 8px'
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
