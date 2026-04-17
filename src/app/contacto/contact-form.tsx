'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const SUBJECTS = [
  'Consulta general',
  'Cotización de vehículo',
  'Repuestos',
  'Servicio de taller',
  'Productos marinos',
  'Otro',
] as const;

export function ContactForm() {
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
        <h3 className="mt-4 text-xl font-bold text-text-primary">Mensaje enviado</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Nos pondremos en contacto a la brevedad. Revisá tu correo o WhatsApp.
        </p>
      </div>
    );
  }

  const inputClasses =
    'mt-1.5 block w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className="block text-sm font-semibold text-text-primary">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="ct-name"
            name="name"
            type="text"
            required
            placeholder="Tu nombre"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="ct-email" className="block text-sm font-semibold text-text-primary">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="ct-email"
            name="email"
            type="email"
            required
            placeholder="correo@ejemplo.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-phone" className="block text-sm font-semibold text-text-primary">
            Teléfono
          </label>
          <input
            id="ct-phone"
            name="phone"
            type="tel"
            placeholder="+506 8888-8888"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="ct-subject" className="block text-sm font-semibold text-text-primary">
            Asunto
          </label>
          <select
            id="ct-subject"
            name="subject"
            className={cn(inputClasses, 'appearance-none')}
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ct-message" className="block text-sm font-semibold text-text-primary">
          Mensaje
        </label>
        <textarea
          id="ct-message"
          name="message"
          rows={4}
          placeholder="¿En qué podemos ayudarte?"
          className={cn(inputClasses, 'resize-none')}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={sending}
          className={cn(
            'flex h-12 items-center justify-center rounded-xl px-8 text-sm font-bold text-white shadow-md transition-all',
            sending
              ? 'cursor-not-allowed bg-secondary-300'
              : 'bg-secondary-500 hover:bg-secondary-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
          )}
        >
          {sending ? 'Enviando...' : 'Enviar mensaje'}
        </button>
        <a
          href="/cotizador"
          className="text-sm font-bold text-primary-500 transition-colors hover:text-secondary-500"
        >
          Cotizar un vehículo
        </a>
      </div>
    </form>
  );
}
