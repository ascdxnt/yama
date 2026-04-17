'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AppointmentFormProps {
  workshops: readonly string[] | string[];
}

const SERVICES = [
  'Mantenimiento preventivo',
  'Reparación',
  'Diagnóstico',
  'Garantía',
  'Otro',
] as const;

export function AppointmentForm({ workshops }: AppointmentFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);

    // Simulate form submission — replace with real API call
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
          Nos pondremos en contacto para confirmar tu cita. Revisá tu correo o WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-text-primary">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Tu nombre completo"
          className="mt-1.5 block w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-text-primary">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="correo@ejemplo.com"
          className="mt-1.5 block w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-text-primary">
          Teléfono
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+506 8888-8888"
          className="mt-1.5 block w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="workshop" className="block text-sm font-semibold text-text-primary">
            Ubicación
          </label>
          <select
            id="workshop"
            name="workshop"
            className="mt-1.5 block w-full appearance-none rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-text-primary transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
          >
            {workshops.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-semibold text-text-primary">
            Servicio
          </label>
          <select
            id="service"
            name="service"
            className="mt-1.5 block w-full appearance-none rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-text-primary transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
          >
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-text-primary">
          Mensaje / Detalles adicionales
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Modelo de vehículo, descripción del problema, horario preferido..."
          className="mt-1.5 block w-full resize-none rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
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
        {sending ? 'Enviando...' : 'Solicitar Cita'}
      </button>
    </form>
  );
}
