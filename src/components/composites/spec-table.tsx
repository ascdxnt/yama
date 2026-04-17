'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { SpecGroup } from '@/types';

interface SpecTableProps {
  specGroups: SpecGroup[];
}

export function SpecTable({ specGroups }: SpecTableProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(specGroups[0]?.group || null);

  return (
    <div className="min-w-0 divide-y divide-surface-subtle overflow-hidden rounded-2xl border border-surface-subtle">
      {specGroups.map((group) => {
        const isOpen = openGroup === group.group;
        return (
          <div key={group.group} className="min-w-0">
            <button
              type="button"
              onClick={() => setOpenGroup(isOpen ? null : group.group)}
              className="flex w-full min-w-0 items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-ghost sm:px-6 sm:py-4"
            >
              <span className="min-w-0 flex-1 break-words text-sm font-bold uppercase tracking-wider text-text-primary">
                {group.group}
              </span>
              <svg
                className={cn('h-5 w-5 shrink-0 text-text-muted transition-transform duration-200', isOpen && 'rotate-180')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={cn(
                'grid transition-all duration-300',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <dl className="divide-y divide-surface-subtle">
                  {group.specs.map((spec) => (
                    <div
                      key={spec.name}
                      className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4 sm:gap-y-0 sm:px-6"
                    >
                      <dt className="min-w-0 text-sm text-text-muted sm:max-w-[48%] sm:break-words">
                        {spec.name}
                      </dt>
                      <dd className="min-w-0 text-sm font-semibold break-words text-text-primary sm:max-w-[52%] sm:text-right">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
