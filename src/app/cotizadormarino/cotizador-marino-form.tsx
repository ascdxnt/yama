'use client';

import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { dataLayer } from '@/lib/tracking/data-layer';
import { COTIZADOR_BRANCH_OPTIONS } from '@/lib/cotizador-form-options';
import {
  COTIZADOR_MARINO_MOTOR_TYPE_OPTIONS,
  COTIZADOR_MARINO_MODELS_2T,
  COTIZADOR_MARINO_MODELS_4T,
} from '@/lib/cotizador-marino-form-options';

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
    motorType: z.enum(['2_tiempos', '4_tiempos'], { message: 'Elegí un tipo de motor' }),
    model2t: z.string().optional(),
    model4t: z.string().optional(),
    preferredBranch: z.string().min(1, 'Elegí una sucursal'),
    comments: z.string().optional(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: 'Debés aceptar para poder enviar la cotización',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.motorType === '2_tiempos' && !data.model2t) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['model2t'],
        message: 'Elegí un modelo 2 tiempos',
      });
    }
    if (data.motorType === '4_tiempos' && !data.model4t) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['model4t'],
        message: 'Elegí un modelo 4 tiempos',
      });
    }
  });

type FormData = z.infer<typeof schema>;

const inputClass =
  'mt-1.5 flex h-11 w-full rounded-xl border bg-white px-4 text-sm text-text-primary transition-colors focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20';
const labelClass = 'block text-sm font-semibold text-text-secondary';

export function CotizadorMarinoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      motorType: '2_tiempos',
      model2t: '',
      model4t: '',
      preferredBranch: '',
      comments: '',
      acceptTerms: false,
    },
  });

  const motorType = watch('motorType');
  const selectedModel = useMemo(() => (motorType === '2_tiempos' ? watch('model2t') : watch('model4t')), [motorType, watch]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const model = data.motorType === '2_tiempos' ? data.model2t : data.model4t;
      const name = `${data.firstName} ${data.lastName}`.trim();
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'cotizadormarino',
          name,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone.replace(/\D/g, ''),
          model,
          preferredBranch: data.preferredBranch,
          message: data.comments,
          acceptTerms: true,
          productName: 'Cotizador Marino',
        }),
      });
      dataLayer.push({ name: 'quote_request_submit', params: { source: 'cotizadormarino' } });
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
        <h2 className="mt-4 text-xl font-bold text-text-primary">¡Solicitud enviada!</h2>
        <p className="mt-2 text-text-secondary">Recibimos tu consulta de Yamaha Marino. Te contactaremos pronto.</p>
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
        <label htmlFor="motorType" className={labelClass}>
          Tipo de Motor *
        </label>
        <select
          {...register('motorType')}
          id="motorType"
          className={cn(inputClass, errors.motorType ? 'border-error' : 'border-surface-border')}
        >
          {COTIZADOR_MARINO_MOTOR_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="model2t" className={labelClass}>
          Modelo 2 Tiempos {motorType === '2_tiempos' ? '*' : ''}
        </label>
        <select
          {...register('model2t')}
          id="model2t"
          disabled={motorType !== '2_tiempos'}
          className={cn(inputClass, errors.model2t ? 'border-error' : 'border-surface-border', motorType !== '2_tiempos' && 'opacity-50')}
        >
          <option value="">Elige una opción</option>
          {COTIZADOR_MARINO_MODELS_2T.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        {errors.model2t && <p className="mt-1 text-sm text-error">{errors.model2t.message}</p>}
      </div>

      <div>
        <label htmlFor="model4t" className={labelClass}>
          Modelo 4 Tiempos {motorType === '4_tiempos' ? '*' : ''}
        </label>
        <select
          {...register('model4t')}
          id="model4t"
          disabled={motorType !== '4_tiempos'}
          className={cn(inputClass, errors.model4t ? 'border-error' : 'border-surface-border', motorType !== '4_tiempos' && 'opacity-50')}
        >
          <option value="">Elige una opción</option>
          {COTIZADOR_MARINO_MODELS_4T.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        {errors.model4t && <p className="mt-1 text-sm text-error">{errors.model4t.message}</p>}
      </div>

      <div>
        <label htmlFor="preferredBranch" className={labelClass}>
          Sucursal de Preferencia *
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

      <div>
        <label htmlFor="comments" className={labelClass}>
          Comentarios
        </label>
        <textarea
          {...register('comments')}
          id="comments"
          rows={4}
          className={cn(inputClass, 'h-auto py-3')}
          placeholder={`Consulta por modelo ${selectedModel || ''}`.trim()}
        />
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
        {submitting ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
