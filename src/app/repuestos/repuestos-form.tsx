'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const SUBJECTS = [
  'Repuesto para moto',
  'Repuesto para cuadraciclo',
  'Repuesto para producto marino',
  'Cotización general',
  'Otro',
] as const;

export function RepuestosForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-bold text-text-primary">Solicitud enviada</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Revisaremos disponibilidad y te contactaremos con precio y tiempo de entrega.
        </p>
      </div>
    );
  }

  const inputClasses =
    'mt-1.5 block w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="rp-name" className="block text-sm font-semibold text-text-primary">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          id="rp-name"
          name="name"
          type="text"
          required
          placeholder="Tu nombre completo"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="rp-email" className="block text-sm font-semibold text-text-primary">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="rp-email"
          name="email"
          type="email"
          required
          placeholder="correo@ejemplo.com"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="rp-phone" className="block text-sm font-semibold text-text-primary">
          Teléfono
        </label>
        <input
          id="rp-phone"
          name="phone"
          type="tel"
          placeholder="+506 8888-8888"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="rp-subject" className="block text-sm font-semibold text-text-primary">
          Asunto
        </label>
        <select
          id="rp-subject"
          name="subject"
          className={cn(inputClasses, 'appearance-none')}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="rp-message" className="block text-sm font-semibold text-text-primary">
          Detalle del repuesto
        </label>
        <textarea
          id="rp-message"
          name="message"
          rows={4}
          placeholder="Número de parte, modelo del vehículo, año, descripción de la pieza..."
          className={cn(inputClasses, 'resize-none')}
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className={cn(
          'flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold text-white shadow-md transition-all',
          sending
            ? 'cursor-not-allowed bg-secondary-300'
            : 'bg-secondary-500 hover:bg-secondary-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
        )}
      >
        {sending ? 'Enviando...' : 'Solicitar Repuesto'}
      </button>
    </form>
  );
}
