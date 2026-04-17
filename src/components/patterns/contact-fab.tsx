'use client';

import { useState, useEffect } from 'react';
import { CONTACT, SOCIALS } from '@/lib/constants';

const facebookPageUrl = SOCIALS.find((s) => s.name === 'Facebook')?.href ?? 'https://www.facebook.com/yamahacr';
const facebookMessengerUrl = `https://www.facebook.com/messages/t/${facebookPageUrl.split('/').filter(Boolean).pop()}`;

const CHANNELS = [
  {
    label: 'Chatear en WhatsApp',
    href: `https://wa.me/${CONTACT.whatsappRaw}?text=${encodeURIComponent('Hola, me gustaría recibir información sobre sus productos.')}`,
    color: 'bg-emerald-500',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.228-2.01l-.436-.326-2.641.885.885-2.641-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    label: 'Chatear en Messenger',
    href: facebookMessengerUrl,
    color: 'bg-[#0084FF]',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.193 14.963l-3.056-3.26-5.963 3.26L10.733 8.2l3.13 3.26 5.889-3.26-6.559 6.763z" />
      </svg>
    ),
  },
  {
    label: 'Chatear en Instagram',
    href: 'https://ig.me/m/yamahacostarica',
    color: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'Escríbenos un email',
    href: `mailto:${CONTACT.email}`,
    color: 'bg-primary-500',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export function ContactFab() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  function dismissBubble() {
    setBubbleDismissed(true);
    setShowBubble(false);
  }

  return (
      <div className="z-fab fixed bottom-6 right-6 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      {/* Channel options — align to same right edge as FAB so the round button never shifts */}
      {open && (
        <div className="flex w-[min(100vw-3rem,22rem)] flex-col gap-2">
          {CHANNELS.map((ch, i) => (
            <a
              key={ch.label}
              href={ch.href}
              target={ch.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={ch.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-elevated ring-1 ring-black/[0.06] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
              style={{
                animation: `fadeSlideUp 200ms ${i * 50}ms both`,
              }}
            >
              <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white ${ch.color}`}>
                {ch.icon}
              </span>
              <span className="text-sm font-semibold text-text-primary">{ch.label}</span>
            </a>
          ))}

          <style>{`
            @keyframes fadeSlideUp {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      {/* Bubble message */}
      {showBubble && !bubbleDismissed && !open && (
          <div className="absolute bottom-16 right-0 mb-2 flex items-start gap-2">
          <button
            onClick={dismissBubble}
            className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black/10 text-text-muted transition-colors-premium hover:bg-black/20"
            aria-label="Cerrar"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative rounded-xl bg-white px-4 py-3 shadow-elevated ring-1 ring-black/[0.06]">
            <p className="text-sm font-bold text-text-primary">Yamaha</p>
            <p className="text-[13px] text-text-secondary">Cuando Elegís Bien</p>
            <div className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 bg-white ring-1 ring-black/[0.06]" />
          </div>
        </div>
      )}

      {/* FAB — fixed 56×56; icons stacked in same box so open/close stay visually centered */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (showBubble) dismissBubble();
        }}
        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-primary-500 text-white shadow-xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary-600 hover:scale-110 hover:shadow-2xl active:scale-100"
        aria-label={open ? 'Cerrar opciones de contacto' : 'Abrir opciones de contacto'}
      >
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {open ? (
            <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
