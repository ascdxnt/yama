export interface FinancingInput {
  price: number;
  downPaymentPercent: number;
  termMonths: number;
  annualRate?: number;
}

export interface FinancingOutput {
  downPayment: number;
  financedAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

export function calculateFinancing({
  price,
  downPaymentPercent,
  termMonths,
  annualRate = 12.5,
}: FinancingInput): FinancingOutput {
  const downPayment = price * (downPaymentPercent / 100);
  const financedAmount = price - downPayment;
  const monthlyRate = annualRate / 100 / 12;

  const monthlyPayment =
    financedAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const totalCost = downPayment + monthlyPayment * termMonths;
  const totalInterest = totalCost - price;

  return {
    downPayment: Math.round(downPayment),
    financedAmount: Math.round(financedAmount),
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
    totalCost: Math.round(totalCost),
  };
}
