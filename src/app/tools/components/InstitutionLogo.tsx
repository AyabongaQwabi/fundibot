'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  logo: string | null;
  name: string;
  className?: string;
};

export function InstitutionLogo({ logo, name, className = '' }: Props) {
  const [failed, setFailed] = useState(false);

  const initials = name
    .split(' ')
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  if (!logo || failed) {
    return (
      <div
        className={`flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`relative h-10 w-24 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200 ${className}`}
    >
      <Image
        src={logo}
        alt={`${name} logo`}
        fill
        className="object-contain p-1.5"
        sizes="96px"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
