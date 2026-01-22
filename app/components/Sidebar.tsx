'use client';

import { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  TrendingDown,
  BarChart3,
  ArrowLeftRight,
  Home,
  ShoppingCart
} from 'lucide-react';

const navItems = [
  { id: 'key-indicators', label: 'Key Indicators', icon: TrendingUp },
  { id: 'inflation', label: 'Inflation', icon: TrendingDown },
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'interest-rates', label: 'Interest Rates', icon: DollarSign },
  { id: 'economic-growth', label: 'Economic Growth', icon: BarChart3 },
  { id: 'exchange-rates', label: 'Exchange Rates', icon: ArrowLeftRight },
  { id: 'housing', label: 'Housing', icon: Home },
  { id: 'consumer-spending', label: 'Consumer Spending', icon: ShoppingCart },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('key-indicators');

  return (
    <div className="w-[200px] h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-sm font-bold text-gray-900">FRED Indicators</h1>
        <p className="text-xs text-gray-600 mt-0.5">Economic Data Dashboard</p>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </div>
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <p className="text-[10px] text-gray-500 leading-tight">
          Data provided by Federal Reserve Economic Data (FRED)
        </p>
      </div>
    </div>
  );
}
