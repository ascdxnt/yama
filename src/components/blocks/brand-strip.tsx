import Image from 'next/image';

export function BrandStrip() {
  return (
    <div className="w-full">
      <Image
        src="/YAMAHA_CostaRica_cintilloazul.avif"
        alt="Yamaha Costa Rica — Marcas aliadas y respaldo"
        width={1920}
        height={80}
        className="h-auto w-full object-cover"
        sizes="100vw"
        loading="lazy"
      />
    </div>
  );
}
