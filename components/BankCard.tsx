'use client';

import React, { useState } from 'react';
import { EarningsCalculation, BankData } from '@/types';

interface BankCardProps {
  calculation: EarningsCalculation;
  isSelected?: boolean;
  onSelect: (bank: BankData) => void;
  timePeriod: number;
}

export default function BankCard({ calculation, isSelected, onSelect, timePeriod }: BankCardProps) {
  const { bank, principal, interestEarned, totalAmount, effectiveRate, monthlyEarnings, grossInterest, taxAmount, netInterest } = calculation;
  const [isTaxBreakdownOpen, setIsTaxBreakdownOpen] = useState(true);
  const [isBankDetailsOpen, setIsBankDetailsOpen] = useState(true);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div 
      onClick={() => onSelect(bank)}
      className={`bank-card relative bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border border-gray-200 cursor-pointer h-fit min-h-[500px] flex flex-col ${
        isSelected ? 'ring-4 ring-blue-400 bg-gradient-to-br from-blue-50 to-white border-blue-300' : 'hover:border-gray-300'
      }`}
    >

      {/* Bank Header */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-sm">
          <img
            src={bank.logoUrl}
            alt={`${bank.bankName} logo`}
            className="w-20 h-20 object-contain rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(bank.bankName)}&background=2563eb&color=ffffff&size=64&font-size=0.4&bold=true`;
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-xl text-gray-900">{bank.bankName}</h3>
          <p className="text-sm text-gray-700 font-medium">{bank.bankType}</p>
        </div>
      </div>

      {/* Interest Rate - Base rate inline with promo */}
      <div className="mb-4">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-3xl font-bold text-blue-600">
            {formatPercent(bank.baseInterestRate)}
          </span>
          <span className="text-sm text-gray-700 font-medium">Interest (p.a.)</span>
          
          {bank.promoInterestRate && bank.promoInterestRate !== bank.baseInterestRate && (
            <>
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                Up to
              </div>
              <span className="text-xl font-bold text-blue-500">
                {formatPercent(bank.promoInterestRate)}
              </span>
            </>
          )}
        </div>
        
        {/* Time Deposit Rate on separate line */}
        <div className="flex items-baseline gap-2 flex-wrap">
          {bank.timeDepositRate ? (
            <>
              <span className="text-lg font-bold text-green-600">
                {formatPercent(bank.timeDepositRate)}
              </span>
              <span className="text-sm text-gray-600 font-medium">Time Deposit Rate</span>
            </>
          ) : (
            <span className="text-sm text-gray-500 font-medium">No Time Deposit offer</span>
          )}
        </div>
      </div>

      {/* Earnings Calculation */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium">Principal</span>
          <span className="font-bold text-lg">{formatCurrency(principal)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium">Monthly Earnings</span>
          <span className="font-bold text-lg text-gray-700">
            {formatCurrency(monthlyEarnings)}
          </span>
        </div>
        
        {/* Collapsible Tax Breakdown */}
        <div className="bg-gray-50 rounded-lg">
          <button
            onClick={() => setIsTaxBreakdownOpen(!isTaxBreakdownOpen)}
            className="w-full flex items-center justify-between p-3 text-left"
          >
            <span className="text-sm text-gray-700 font-bold">
              {bank.bankId === 'pag-ibig-mp2' ? 'Tax-Free Benefits' : 'Tax Breakdown'}
            </span>
            <svg
              className={`w-5 h-5 transition-transform font-bold ${isTaxBreakdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isTaxBreakdownOpen && (
            <div className="px-3 pb-3">
              {bank.bankId === 'pag-ibig-mp2' ? (
                <div className="space-y-2 text-sm border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-green-700 font-medium">Gross Interest ({formatPercent(effectiveRate)} p.a.)</span>
                    <span className="font-bold">{formatCurrency(grossInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700 font-medium">Tax</span>
                    <span className="text-green-600 font-bold">₱0 (Tax-Free)</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                    <span className="text-gray-900">Net Interest ({timePeriod} Mo.)</span>
                    <span className="text-gray-700">{formatCurrency(netInterest)}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Gross Interest ({formatPercent(effectiveRate)} p.a.)</span>
                    <span className="font-bold">{formatCurrency(grossInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Tax (20%)</span>
                    <span className="text-gray-700 font-medium">-{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                    <span className="text-gray-900">Net Interest ({timePeriod} Mo.)</span>
                    <span className="text-gray-700">{formatCurrency(netInterest)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
        
        {/* Bank Features Dropdown */}
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBankDetailsOpen(!isBankDetailsOpen);
            }}
            className="w-full flex justify-between items-center text-left p-3"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-700 font-bold">Features:</span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform font-bold ${isBankDetailsOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isBankDetailsOpen && (
            <div className="px-3 pb-3">
              <div className="space-y-3 text-sm border-t pt-3">
                <div>
                  <span className="font-medium text-gray-700">Min. Deposit:</span>
                  <span className="ml-2 text-gray-900">
                    {bank.minimumDeposit === 0 ? 'No minimum' : formatCurrency(bank.minimumDeposit)}
                  </span>
                </div>
                
                {bank.promoDetails && (
                  <div>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li><strong>Promo:</strong> {bank.promoDetails}</li>
                    </ul>
                  </div>
                )}
                
                {bank.specialFeatures && bank.specialFeatures.length > 0 && (
                  <div>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {bank.specialFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>{bank.description}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spacer to push button to bottom */}
      <div className="flex-1"></div>

      {/* Apply Button & Bank Info */}
      <div className="mb-2">        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            window.open(bank.website, '_blank', 'noopener,noreferrer');
          }}
          title={bank.website}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="text-base font-semibold">Learn More</span>
        </button>
        
        <div className="text-center mt-2">
          <span className="text-xs text-gray-400">pesogrow.com</span>
        </div>
      </div>
    </div>
  );
}