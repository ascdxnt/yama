import { SpecTable } from '@/components/composites';
import type { SpecGroup } from '@/types';

interface FullSpecsProps {
  specGroups: SpecGroup[];
}

export function FullSpecs({ specGroups }: FullSpecsProps) {
  if (specGroups.length === 0) return null;

  return (
    <div className="min-w-0">
      <h2 className="text-2xl font-bold text-text-primary">Especificaciones completas</h2>
      <div className="mt-6">
        <SpecTable specGroups={specGroups} />
      </div>
    </div>
  );
}
