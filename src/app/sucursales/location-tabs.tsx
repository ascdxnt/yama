'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { Location } from '@/lib/locations';

interface LocationTabsProps {
  agencias: Location[];
  distribuidores: Location[];
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.228-2.01l-.436-.326-2.641.885.885-2.641-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

type Tab = 'agencias' | 'distribuidores';

export function LocationTabs({ agencias, distribuidores }: LocationTabsProps) {
  const [tab, setTab] = useState<Tab>('agencias');
  const [province, setProvince] = useState<string>('Todas');

  const data = tab === 'agencias' ? agencias : distribuidores;

  const provinces = useMemo(() => {
    const set = new Set(data.map((l) => l.provincia));
    return ['Todas', ...Array.from(set).sort()];
  }, [data]);

  const filtered = province === 'Todas' ? data : data.filter((l) => l.provincia === province);

  // Reset province when switching tabs
  function handleTabChange(newTab: Tab) {
    setTab(newTab);
    setProvince('Todas');
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-surface-ghost p-1">
        <button
          onClick={() => handleTabChange('agencias')}
          className={cn(
            'flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all',
            tab === 'agencias'
              ? 'bg-white text-primary-500 shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          Agencias ({agencias.length})
        </button>
        <button
          onClick={() => handleTabChange('distribuidores')}
          className={cn(
            'flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all',
            tab === 'distribuidores'
              ? 'bg-white text-primary-500 shadow-sm'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          Distribuidores ({distribuidores.length})
        </button>
      </div>

      {/* Province filter */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {provinces.map((p) => (
          <button
            key={p}
            onClick={() => setProvince(p)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
              p === province
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-surface-ghost text-text-secondary hover:bg-surface-muted'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="mt-5 text-sm text-text-muted">
        {filtered.length} {tab === 'agencias' ? 'agencia' : 'distribuidor'}{filtered.length !== 1 ? (tab === 'agencias' ? 's' : 'es') : ''}
        {province !== 'Todas' && <> en <span className="font-semibold text-text-primary">{province}</span></>}
      </p>

      {/* Cards */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((loc) => (
          <div
            key={`${loc.name}-${loc.phone}`}
            className="rounded-2xl border border-surface-subtle bg-white p-5 shadow-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-text-primary">{loc.name}</h3>
                <span className="mt-0.5 inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                  {loc.provincia}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-sm text-text-secondary">
              <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
              <span>{loc.address}</span>
            </div>

            <div className="mt-4 space-y-2">
              <a
                href={`tel:${loc.phoneRaw}`}
                className="flex items-center gap-2.5 text-sm transition-colors hover:text-secondary-500"
              >
                <PhoneIcon className="h-3.5 w-3.5 text-text-muted" />
                <span className="font-medium text-text-primary">{loc.phone}</span>
              </a>

              {loc.whatsapp && (
                <a
                  href={`https://wa.me/${loc.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm transition-colors"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                  <span className="font-medium text-[#25D366]">{loc.whatsapp}</span>
                </a>
              )}

              <a
                href={`mailto:${loc.email}`}
                className="flex items-center gap-2.5 text-sm transition-colors hover:text-secondary-500"
              >
                <MailIcon className="h-3.5 w-3.5 text-text-muted" />
                <span className="font-medium text-text-primary truncate">{loc.email}</span>
              </a>
            </div>

            {/* Quick actions */}
            <div className="mt-4 flex gap-2">
              {loc.whatsapp ? (
                <a
                  href={`https://wa.me/${loc.whatsappRaw}?text=${encodeURIComponent(`Hola, me comunico con la ${tab === 'agencias' ? 'agencia' : 'distribuidora'} ${loc.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] text-xs font-bold text-white transition-all hover:bg-[#20bd5a]"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              ) : (
                <a
                  href={`tel:${loc.phoneRaw}`}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-500 text-xs font-bold text-white transition-all hover:bg-primary-400"
                >
                  <PhoneIcon className="h-3.5 w-3.5" />
                  Llamar
                </a>
              )}
              <a
                href={`mailto:${loc.email}`}
                className="flex h-9 flex-1 items-center justify-center rounded-lg border border-surface-border text-xs font-bold text-text-primary transition-all hover:border-secondary-500 hover:text-secondary-500"
              >
                Email
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
