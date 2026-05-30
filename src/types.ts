export interface CPIItem {
  year: number;
  rate: number;
  label: string;
  ref: string;
}

export interface UserInputs {
  currentExpenses: number;    // Annual, e.g. 120000
  yearsToRetire: number;       // e.g. 10
  withdrawalRate: number;      // e.g. 4%
  inflationRate: number;       // e.g. 1.492% (from 10-year average)
  investmentReturn: number;    // Annual investment return during accumulation, e.g. 6%
  initialSavings: number;      // Current existing assets, e.g. 0
}

export interface CalculationResults {
  futureExpenses: number;      // Adjusted for inflation
  targetFund: number;          // Safe withdrawal amount in 10 years
  nominalTargetFund: number;   // Target amount ignoring inflation (for comparison)
  requiredMonthlySavings: number; // Monthly saving goal to reach the target
  totalInterestEarned: number; // Compound interest during accumulation period
  cumulativeInflationFactor: number; // Multiplier of cost of living
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}
