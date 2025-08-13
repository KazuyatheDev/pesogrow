export interface BankData {
  bankId: string;
  bankName: string;
  logoUrl: string;
  bankType: string;
  category: 'Licensed Digital Bank' | 'Digital Banking Service' | 'Rural Bank' | 'Government Savings';
  baseInterestRate: number;
  promoInterestRate?: number;
  minimumDeposit: number;
  website: string;
  isActive: boolean;
  description?: string;
  isPhilippinesLicensed?: boolean;
}

export interface CalculatorInputs {
  amount: number;
  timePeriod: number; // in months
}

export interface EarningsCalculation {
  bank: BankData;
  principal: number;
  interestEarned: number;
  totalAmount: number;
  effectiveRate: number;
  monthlyEarnings: number;
  grossInterest: number;
  taxAmount: number;
  netInterest: number;
}