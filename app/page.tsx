'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Calculator from '@/components/Calculator';
import BankCard from '@/components/BankCard';
import { BankData, CalculatorInputs, EarningsCalculation } from '@/types';

export default function HomePage() {
  const [banks, setBanks] = useState<BankData[]>([]);
  const [calculations, setCalculations] = useState<EarningsCalculation[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<EarningsCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [inputs, setInputs] = useState<CalculatorInputs>({ amount: 100000, timePeriod: 12 });
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedBank, setSelectedBank] = useState<BankData | null>(null);

  const calculateEarnings = useCallback((banks: BankData[], inputs: CalculatorInputs): EarningsCalculation[] => {
    const { amount, timePeriod } = inputs;
    const years = timePeriod / 12;

    return banks.map(bank => {
      const rate = bank.baseInterestRate / 100;
      
      // Compound interest calculation: A = P(1 + r/n)^(nt)
      // Assuming quarterly compounding (n=4) for most Philippine banks
      const n = 4;
      const totalAmount = amount * Math.pow(1 + rate / n, n * years);
      const grossInterest = totalAmount - amount;
      
      // 20% withholding tax on interest earnings in Philippines (except Pag-IBIG MP2 which is tax-free)
      const taxAmount = bank.bankId === 'pag-ibig-mp2' ? 0 : grossInterest * 0.20;
      const netInterest = grossInterest - taxAmount;
      const netTotalAmount = amount + netInterest;
      
      // Monthly earnings calculation
      const monthlyEarnings = netInterest / timePeriod;

      return {
        bank,
        principal: amount,
        interestEarned: netInterest,
        totalAmount: netTotalAmount,
        effectiveRate: bank.baseInterestRate,
        monthlyEarnings,
        grossInterest,
        taxAmount,
        netInterest
      };
    }).sort((a, b) => {
      // First prioritize Licensed Digital Banks
      if (a.bank.category === 'Licensed Digital Bank' && b.bank.category !== 'Licensed Digital Bank') return -1;
      if (b.bank.category === 'Licensed Digital Bank' && a.bank.category !== 'Licensed Digital Bank') return 1;
      
      // Then sort by base interest rate (highest to lowest)
      return b.bank.baseInterestRate - a.bank.baseInterestRate;
    });
  }, []);

  useEffect(() => {
    async function fetchBanks() {
      try {
        setLoading(true);
        const response = await fetch('/api/banks');
        const data = await response.json();
        
        if (data.banks) {
          setBanks(data.banks);
          setLastUpdated(data.lastUpdated);
          setCalculations(calculateEarnings(data.banks, inputs));
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBanks();
  }, []);

  useEffect(() => {
    if (banks.length > 0) {
      const calcs = calculateEarnings(banks, inputs);
      setCalculations(calcs);
    }
  }, [banks, inputs, calculateEarnings]);

  useEffect(() => {
    let filtered = [...calculations];
    
    // Filter by category
    if (filterCategory !== 'All') {
      filtered = filtered.filter(calc => calc.bank.category === filterCategory);
    }
    
    // Sort Licensed Digital Banks first, then by base interest rate
    filtered.sort((a, b) => {
      // First prioritize Licensed Digital Banks
      if (a.bank.category === 'Licensed Digital Bank' && b.bank.category !== 'Licensed Digital Bank') return -1;
      if (b.bank.category === 'Licensed Digital Bank' && a.bank.category !== 'Licensed Digital Bank') return 1;
      
      // Then sort by base interest rate (highest to lowest)
      return b.bank.baseInterestRate - a.bank.baseInterestRate;
    });
    
    setFilteredCalculations(filtered);
  }, [calculations, filterCategory]);

  const handleInputChange = useCallback((newInputs: CalculatorInputs) => {
    setInputs(newInputs);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBookmark = () => {
    if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
      // Try to add to bookmarks/favorites
      alert('Press Ctrl+D (Windows/Linux) or Cmd+D (Mac) to bookmark this page!');
    } else {
      // Fallback for mobile or other browsers
      if (confirm('Would you like to bookmark this page? Press OK to copy the URL.')) {
        navigator.clipboard.writeText(window.location.href);
        alert('URL copied to clipboard!');
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
                <img 
                  src="/logos/pesogrow.jpg" 
                  alt="PesoGrow Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  PesoGrow
                </div>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">Your Peso Growth Buddy</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleBookmark}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors shadow-md"
                title="Bookmark Me!"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <a 
                href="https://www.facebook.com/pesogrowph" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Calculator Section */}
      <section id="calculator" className="py-4">
        <Calculator onInputChange={handleInputChange} />
      </section>

      {/* Results Section */}
      <section id="banks" className="py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div className="flex-1 flex justify-center">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  As of {formatDate(lastUpdated)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="All">All</option>
                <option value="Licensed Digital Bank">Licensed Banks</option>
                <option value="Digital Banking Service">Digital Services</option>
                <option value="Rural Bank">Rural Banks</option>
                <option value="Government Savings">Government</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading bank rates...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCalculations.map((calculation, index) => (
                <BankCard
                  key={calculation.bank.bankId}
                  calculation={calculation}
                  isSelected={selectedBank?.bankId === calculation.bank.bankId}
                  onSelect={(bank) => setSelectedBank(bank)}
                  timePeriod={inputs.timePeriod}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600">
                <img 
                  src="/logos/pesogrow.jpg" 
                  alt="PesoGrow Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-2xl font-bold">PesoGrow</div>
            </div>
            <p className="text-gray-400 text-base mb-6 max-w-2xl mx-auto">
              Helping Filipinos make informed decisions about their digital banking choices.
            </p>
            
            {/* Social Media */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-3">Follow us:</p>
              <div className="flex justify-center">
                <a 
                  href="https://www.facebook.com/pesogrowph" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm font-medium">Follow us on Facebook</span>
                </a>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="border-t border-gray-800 pt-6">
              <div className="mb-4">
                <p className="text-yellow-400 text-sm font-semibold mb-2">⚠️ Important Disclaimer</p>
                <p className="text-gray-400 text-xs max-w-4xl mx-auto leading-relaxed">
                  All interest rates, fees, and terms displayed are subject to change without notice and may vary based on individual qualifications. 
                  The calculations provided are estimates for informational purposes only and do not guarantee actual returns. 
                  Please verify current rates, terms, and conditions directly with the respective financial institutions before making any financial decisions. 
                  PesoGrow is not responsible for any financial decisions made based on the information provided.
                </p>
              </div>
              <p className="text-gray-500 text-xs">
                © 2024 PesoGrow. Made with ❤️ for Filipino savers.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}