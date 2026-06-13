import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  /** Color of the wordmark text. */
  variant?: 'dark' | 'light';
  /** Show the "college in your pocket" tagline. */
  withTagline?: boolean;
  className?: string;
  iconSize?: number;
};

/**
 * Fundibot brand lockup: the friendly bot mascot + the rounded "fundibot" wordmark.
 * Uses the cropped mascot from the official logo (public/brand/bot-icon.png).
 */
export function Logo({ variant = 'dark', withTagline = false, className = '', iconSize = 36 }: LogoProps) {
  const wordColor = variant === 'light' ? 'text-white' : 'text-brand-blue';

  return (
    <Link href='/' className={`group flex items-center gap-2.5 ${className}`} aria-label='Fundibot home'>
      <Image
        src='/brand/bot-icon.png'
        alt='Fundibot mascot'
        width={iconSize}
        height={iconSize}
        priority
        className='transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110'
      />
      <span className='flex flex-col leading-none'>
        <span className={`font-display text-xl font-extrabold lowercase tracking-tight ${wordColor}`}>
          fundibot
        </span>
        {withTagline && (
          <span className='mt-0.5 text-[10px] font-bold lowercase tracking-wide text-brand-gold-dark'>
            college in your pocket
          </span>
        )}
      </span>
    </Link>
  );
}
