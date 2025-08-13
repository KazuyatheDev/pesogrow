'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorInputs } from '@/types';

interface CalculatorProps {
  onInputChange: (inputs: CalculatorInputs) => void;
}

const timePeriods = [
  { value: 6, label: '6 months' },
  { value: 12, label: '1 year' },
  { value: 24, label: '2 years' },
  { value: 36, label: '3 years' },
  { value: 48, label: '4 years' },
  { value: 60, label: '5 years' },
];

export default function Calculator({ onInputChange }: CalculatorProps) {
  const [amount, setAmount] = useState<number>(100000);
  const [timePeriod, setTimePeriod] = useState<number>(12);

  useEffect(() => {
    onInputChange({ amount, timePeriod });
  }, [amount, timePeriod, onInputChange]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numValue = parseInt(value) || 0;
    setAmount(numValue);
  };

  return (
    <div className="calculator-container rounded-2xl p-6 text-white shadow-2xl">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-3">PesoGrow Calculator</h1>
          <p className="text-lg opacity-90">
            Enter your amount below to see how much you'll earn with each bank
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Initial Deposit Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-semibold text-gray-700">
                  ₱
                </span>
                <input
                  type="text"
                  value={amount.toLocaleString('en-US')}
                  onChange={handleAmountChange}
                  className="w-full pl-10 pr-4 py-4 text-2xl font-semibold text-gray-800 bg-white rounded-lg border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                  placeholder="100,000"
                />
              </div>
              <p className="text-sm opacity-75 mt-2">
                Enter your initial deposit amount in PHP
              </p>
            </div>

            {/* Time Period Selector */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Investment Period
              </label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(parseInt(e.target.value))}
                className="w-full px-4 py-4 text-xl font-semibold text-gray-800 bg-white rounded-lg border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none"
              >
                {timePeriods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
              <p className="text-sm opacity-75 mt-2">
                How long will you keep your money saved?
              </p>
            </div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[10000, 50000, 100000, 500000, 1000000].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                amount === quickAmount
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {formatCurrency(quickAmount)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}