'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculateFinancing } from '@/lib/financing/calculator';
import { formatPrice, cn } from '@/lib/utils';
import type { Currency } from '@/lib/utils';
import { dataLayer } from '@/lib/tracking/data-layer';
import { FINANCING_DEFAULTS } from '@/lib/constants';

interface FinancingCalculatorProps {
  price: number;
  currency: Currency;
  defaultDownPayment?: number;
  defaultTerm?: number;
  productId: string;
}

export function FinancingCalculator({
  price,
  currency,
  defaultDownPayment = FINANCING_DEFAULTS.defaultDownPayment,
  defaultTerm = FINANCING_DEFAULTS.defaultTerm,
  productId,
}: FinancingCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(defaultDownPayment);
  const [termMonths, setTermMonths] = useState(defaultTerm);

  const result = useMemo(
    () => calculateFinancing({ price, downPaymentPercent, termMonths }),
    [price, downPaymentPercent, termMonths]
  );

  const handleDownPaymentChange = useCallback(
    (value: number) => {
      setDownPaymentPercent(value);
      const calc = calculateFinancing({ price, downPaymentPercent: value, termMonths });
      dataLayer.push({
        name: 'financing_calculator_interact',
        params: { product_id: productId, down_payment: value, term: termMonths, monthly_result: calc.monthlyPayment },
      });
    },
    [productId, price, termMonths]
  );

  const handleTermChange = useCallback(
    (value: number) => {
      setTermMonths(value);
      const calc = calculateFinancing({ price, downPaymentPercent, termMonths: value });
      dataLayer.push({
        name: 'financing_calculator_interact',
        params: { product_id: productId, down_payment: downPaymentPercent, term: value, monthly_result: calc.monthlyPayment },
      });
    },
    [productId, price, downPaymentPercent]
  );

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-surface-subtle bg-white p-4 shadow-card sm:p-6">
      <h2 className="text-xl font-bold text-text-primary">Calculá tu cuota</h2>
      <p className="mt-1 text-sm text-text-muted">Simulá el financiamiento de tu próxima Yamaha</p>

      <div className="mt-6 flex-1 space-y-6">
        {/* Down Payment */}
        <div>
          <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
            <label className="text-sm font-semibold text-text-secondary">Prima</label>
            <output className="min-w-0 text-right text-base font-bold text-primary-500">
              {downPaymentPercent}%
              <span className="ml-1.5 inline text-sm font-normal text-text-muted">
                ({formatPrice(result.downPayment, currency)})
              </span>
            </output>
          </div>
          <input
            type="range"
            min={FINANCING_DEFAULTS.minDownPayment}
            max={FINANCING_DEFAULTS.maxDownPayment}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
            className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-muted accent-secondary-500 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary-500 [&::-webkit-slider-thumb]:shadow-md"
            aria-label="Porcentaje de prima"
          />
          <div className="mt-1 flex justify-between text-xs text-text-muted">
            <span>{FINANCING_DEFAULTS.minDownPayment}%</span>
            <span>{FINANCING_DEFAULTS.maxDownPayment}%</span>
          </div>
        </div>

        {/* Term */}
        <div>
          <label className="text-sm font-semibold text-text-secondary">Plazo</label>
          <div className="mt-2 grid min-w-0 grid-cols-3 gap-1.5 sm:grid-cols-6">
            {FINANCING_DEFAULTS.termOptions.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleTermChange(term)}
                className={cn(
                  'min-w-0 rounded-lg border px-1.5 py-2 text-xs font-semibold transition-all sm:px-2 sm:text-sm',
                  term === termMonths
                    ? 'border-secondary-500 bg-secondary-50 text-secondary-700 shadow-sm'
                    : 'border-surface-subtle bg-white text-text-secondary hover:border-secondary-300'
                )}
              >
                {term}m
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="min-w-0 rounded-xl bg-primary-500 p-4 text-white sm:p-5">
          <div className="min-w-0 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-primary-200">Cuota mensual</span>
            <div className="mt-1 break-words text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl">
              {formatPrice(result.monthlyPayment, currency)}
            </div>
            <span className="text-sm text-primary-200">por {termMonths} meses</span>
          </div>

          <div className="mt-4 min-w-0 space-y-1.5 border-t border-primary-400 pt-3 text-sm">
            <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <span className="min-w-0 text-primary-200">Monto a financiar</span>
              <span className="min-w-0 break-words text-right font-semibold tabular-nums">
                {formatPrice(result.financedAmount, currency)}
              </span>
            </div>
            <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <span className="min-w-0 text-primary-200">Costo total</span>
              <span className="min-w-0 break-words text-right font-semibold tabular-nums">
                {formatPrice(result.totalCost, currency)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            dataLayer.push({
              name: 'financing_cta_click',
              params: { product_id: productId, monthly_result: result.monthlyPayment },
            });
          }}
          className="w-full rounded-xl bg-secondary-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-secondary-400 hover:shadow-glow-cta hover:-translate-y-0.5 active:translate-y-0"
        >
          Solicitar financiamiento
        </button>
        <p className="mx-auto max-w-full text-center text-xs leading-relaxed text-text-muted">
          Sujeto a aprobación crediticia. Tasa referencial {FINANCING_DEFAULTS.annualRate}% anual.
        </p>
      </div>
    </div>
  );
}
