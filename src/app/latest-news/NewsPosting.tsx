'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

interface NewsPostingProps {
  slug: string;   // URL-friendly identifier for the detail page
  
  /** Headline of the news article */
  title: string;
  /** Short teaser / summary sentence */
  summary: string;
  /** Publish date in readable form (e.g. 2025‑06‑02) */
  date: string;
  /** Optional cover image (optimised through next‑image) */
  imageSrc?: string;
  /**
   * Extra Tailwind classes for controlling the
   * grid spans – e.g. "md:col-span-2 md:row-span-2".
   * This lets the parent <BentoGrid> decide the layout.
   */
  className?: string;
}

/**
 * Single news card designed for a Bento‑grid layout.
 * Keeps image, gradient overlay, and slick hover ring.
 */
export default function NewsPosting({
  title,
  summary,
  date,
  slug,
  imageSrc,
  className,
}: NewsPostingProps) {
  return (
    <Link
      href={`/latest-news/${slug}`}
      className={clsx(
        'group relative flex overflow-hidden rounded-2xl ring-1 ring-slate-900/10 dark:ring-white/10',
        'transition hover:ring-primary-500/60 dark:hover:ring-primary-400/60',
        className,
      )}
    >
      {/* Cover image (optional) */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Dark overlay for legibility when image present */}
      {imageSrc && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      )}

      {/* Text block */}
      <div
        className={clsx(
          'relative z-10 flex flex-col justify-end p-6',
          !imageSrc && 'bg-slate-50/40 dark:bg-slate-800/40',
        )}
      >
        <time className="text-xs uppercase tracking-widest opacity-80">
          {date}
        </time>
        <h3 className="mt-1 text-lg font-semibold leading-tight">{title}</h3>
        <p className="mt-2 text-sm opacity-90 line-clamp-3">{summary}</p>
      </div>
    </Link>
  );
}