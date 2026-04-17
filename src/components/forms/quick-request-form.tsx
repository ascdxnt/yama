'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface QuickRequestFormProps {
  submitLabel: string;
}

export function QuickRequestForm({ submitLabel }: QuickRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSending(false);
    setSubmitted(true);
  }

  const inputClasses =
    'mt-1.5 block h-11 w-full rounded-xl border border-surface-border bg-white px-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20';

  if (submitted) {
    return (
      <div className="rounded-2xl border border-surface-subtle bg-surface-ghost p-6 text-center">
        <h3 className="text-lg font-bold text-text-primary">Solicitud enviada</h3>
        <p className="mt-1.5 text-sm text-text-secondary">Te contactaremos pronto para ayudarte.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="rq-name" className="block text-sm font-semibold text-text-primary">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input id="rq-name" name="name" type="text" required className={inputClasses} />
      </div>

      <div>
        <label htmlFor="rq-email" className="block text-sm font-semibold text-text-primary">
          Email <span className="text-red-500">*</span>
        </label>
        <input id="rq-email" name="email" type="email" required placeholder="email@ejemplo.com" className={inputClasses} />
      </div>

      <div>
        <label htmlFor="rq-phone" className="block text-sm font-semibold text-text-primary">
          Teléfono
        </label>
        <input id="rq-phone" name="phone" type="tel" placeholder="88888888" className={inputClasses} />
      </div>

      <div>
        <label htmlFor="rq-subject" className="block text-sm font-semibold text-text-primary">
          Asunto
        </label>
        <input id="rq-subject" name="subject" type="text" className={inputClasses} />
      </div>

      <button
        type="submit"
        disabled={sending}
        className={cn(
          'flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold text-white shadow-md transition-all',
          sending ? 'cursor-not-allowed bg-secondary-300' : 'bg-secondary-500 hover:bg-secondary-400 hover:shadow-lg hover:-translate-y-0.5'
        )}
      >
        {sending ? 'Enviando...' : submitLabel}
      </button>
    </form>
  );
}
