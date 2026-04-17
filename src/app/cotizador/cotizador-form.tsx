'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { dataLayer } from '@/lib/tracking/data-layer';
import { COTIZADOR_BRANCH_OPTIONS } from '@/lib/cotizador-form-options';
import type { CotizadorSelectEntry } from '@/lib/cotizador-form-options';

const schema = z
  .object({
    firstName: z.string().min(1, 'Nombre requerido'),
    lastName: z.string().min(1, 'Apellido requerido'),
    email: z.string().min(1, 'Email requerido').email('Email inválido'),
    phone: z
      .string()
      .min(1, 'Teléfono requerido')
      .refine((s) => {
        const d = s.replace(/\D/g, '');
        return d.length === 8 && /^[2467]/.test(d);
      }, 'Ingresá 8 dígitos (celular CR, sin código de país)'),
    cedula: z
      .string()
      .min(1, 'Cédula requerida')
      .regex(/^[\d\-]+$/, 'Solo números y guiones')
      .min(5, 'Cédula inválida'),
    model: z.string().min(1, 'Elegí un modelo'),
    preferredBranch: z.string().min(1, 'Elegí una sucursal'),
    financing: z.string(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: 'Debés aceptar para poder enviar la cotización',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.financing !== 'quiero financiar' && data.financing !== 'pago de contado') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['financing'],
        message: 'Elegí una opción de financiamiento',
      });
    }
  });

type FormData = z.infer<typeof schema>;

const inputClass =
  'mt-1.5 flex h-11 w-full rounded-xl border bg-white px-4 text-sm text-text-primary transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20';
const labelClass = 'block text-sm font-semibold text-text-secondary';

interface CotizadorFormProps {
  modelEntries: CotizadorSelectEntry[];
}

export function CotizadorForm({ modelEntries }: CotizadorFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      model: '',
      preferredBranch: '',
      financing: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const name = `${data.firstName} ${data.lastName}`.trim();
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'cotizador',
          name,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone.replace(/\D/g, ''),
          cedula: data.cedula,
          model: data.model,
          preferredBranch: data.preferredBranch,
          financing: data.financing,
          acceptTerms: true,
        }),
      });
      dataLayer.push({ name: 'quote_request_submit', params: { source: 'cotizador' } });
      setSubmitted(true);
    } catch {
      // Silently handle — the lead API logs server-side
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-surface-subtle bg-surface-ghost p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-bold text-text-primary">¡Cotización enviada!</h2>
        <p className="mt-2 text-text-secondary">
          Recibimos tu solicitud. Te contactaremos pronto con una cotización personalizada.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            Nombre *
          </label>
          <input
            {...register('firstName')}
            id="firstName"
            type="text"
            autoComplete="given-name"
            className={cn(inputClass, errors.firstName ? 'border-error' : 'border-surface-border')}
          />
          {errors.firstName && <p className="mt-1 text-sm text-error">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Apellido *
          </label>
          <input
            {...register('lastName')}
            id="lastName"
            type="text"
            autoComplete="family-name"
            className={cn(inputClass, errors.lastName ? 'border-error' : 'border-surface-border')}
          />
          {errors.lastName && <p className="mt-1 text-sm text-error">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email *
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          autoComplete="email"
          placeholder="email@ejemplo.com"
          className={cn(inputClass, errors.email ? 'border-error' : 'border-surface-border')}
        />
        {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Teléfono *
        </label>
        <input
          {...register('phone')}
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="88888888"
          className={cn(inputClass, errors.phone ? 'border-error' : 'border-surface-border')}
        />
        {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="cedula" className={labelClass}>
          Cédula *
        </label>
        <input
          {...register('cedula')}
          id="cedula"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="0-0000-0000"
          className={cn(inputClass, errors.cedula ? 'border-error' : 'border-surface-border')}
        />
        {errors.cedula && <p className="mt-1 text-sm text-error">{errors.cedula.message}</p>}
      </div>

      <div>
        <label htmlFor="model" className={labelClass}>
          Modelo *
        </label>
        <select
          {...register('model')}
          id="model"
          className={cn(inputClass, errors.model ? 'border-error' : 'border-surface-border')}
        >
          <option value="" disabled>
            Elige una opción
          </option>
          {modelEntries.map((entry, i) =>
            entry.kind === 'separator' ? (
              <option key={`sep-${i}`} value={`__sep_${i}`} disabled className="text-text-muted">
                ————————————
              </option>
            ) : (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            )
          )}
        </select>
        {errors.model && <p className="mt-1 text-sm text-error">{errors.model.message}</p>}
      </div>

      <div>
        <label htmlFor="preferredBranch" className={labelClass}>
          Sucursal de Preferencia: *
        </label>
        <select
          {...register('preferredBranch')}
          id="preferredBranch"
          className={cn(inputClass, errors.preferredBranch ? 'border-error' : 'border-surface-border')}
        >
          <option value="" disabled>
            Elige una opción
          </option>
          {COTIZADOR_BRANCH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.preferredBranch && <p className="mt-1 text-sm text-error">{errors.preferredBranch.message}</p>}
      </div>

      <div className="rounded-xl border border-surface-subtle bg-surface-ghost/60 p-5">
        <p className="text-sm font-medium text-text-primary">
          Complete los siguientes espacios si desea aplicar a un financiamiento
        </p>
        <div className="mt-4">
          <label htmlFor="financing" className={labelClass}>
            Financiamiento *
          </label>
          <select
            {...register('financing')}
            id="financing"
            className={cn(inputClass, errors.financing ? 'border-error' : 'border-surface-border')}
          >
            <option value="" disabled>
              Elige una opción
            </option>
            <option value="quiero financiar">Sí</option>
            <option value="pago de contado">No</option>
          </select>
          {errors.financing && <p className="mt-1 text-sm text-error">{errors.financing.message}</p>}
        </div>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-surface-border bg-white p-4 transition-colors hover:border-secondary-500/30">
          <Controller
            control={control}
            name="acceptTerms"
            render={({ field }) => (
              <input
                type="checkbox"
                checked={field.value}
                onBlur={field.onBlur}
                ref={field.ref}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-surface-border text-secondary-500 focus:ring-secondary-500"
              />
            )}
          />
          <span className="text-sm leading-snug text-text-primary">
            Acepto que Yamaha Costa Rica, me contacte para recibir la información que estoy solicitando. *
          </span>
        </label>
        {errors.acceptTerms && <p className="mt-1 text-sm text-error">{errors.acceptTerms.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-secondary-500 text-sm font-bold text-white shadow-md transition-all hover:bg-secondary-400 hover:shadow-glow-cta disabled:pointer-events-none disabled:opacity-50"
      >
        {submitting ? 'Enviando...' : 'Enviar cotización'}
      </button>
    </form>
  );
}
