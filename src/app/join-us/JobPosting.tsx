'use client';

import Link from 'next/link';
import { useLanguage, translations } from '@/components/LanguageProvider';

export interface JobPostingProps {
  /** Job title, e.g. "Senior Carbon Consultant" */
  title: string;
  /** Office location or "Remote" (optional) */
  location?: string;
  /** Employment type, e.g. "Full‑time" (optional) */
  type?: string;
  /** Short description or teaser text (optional) */
  description?: string;
  /** External or internal URL to the application form (optional) */
  applyLink?: string;
}

/**
 * Renders a single job posting card with modern minimalist design.
 * Usage:
 *   <JobPosting
 *     title="Senior Carbon Consultant"
 *     location="Taipei, Taiwan"
 *     type="Full‑time"
 *     description="Lead GHG inventory projects and coach junior consultants…"
 *     applyLink="https://jobs.lever.co/lingcarbon/123"
 *   />
 */
export default function JobPosting({
  title,
  location,
  type,
  description,
  applyLink,
}: JobPostingProps) {
  const { language } = useLanguage();
  const viewLabel =
    translations[language]?.joinUsViewPosting ??
    (language === 'zh' ? '查看職缺' : 'View Posting');
  
  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 rounded-3xl p-8 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-black/30 hover:-translate-y-3 hover:scale-[1.02]">
      
      {/* Enhanced gradient overlay on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-50/80 via-white/20 to-transparent dark:from-slate-800/50 dark:via-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative space-y-6">
        
        {/* Header section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-medium text-slate-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h3>

          {/* Stylish pill badges with icons */}
          {(location || type) && (
            <div className="flex items-center gap-3">
              {location && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors duration-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location}
                </span>
              )}
              {type && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors duration-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {type}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Description with better typography */}
        {description && (
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base line-clamp-3 font-light">
            {description}
          </p>
        )}

        {/* Minimalist CTA */}
        {applyLink && (
          <div className="pt-2">
            <Link
              href={applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white hover:text-[var(--color-companyBlue)] transition-all duration-300"
            >
              <span className="relative">
                {viewLabel}
                <div className="absolute inset-x-0 -bottom-0.5 h-px bg-slate-900 dark:bg-white group-hover/link:bg-[var(--color-companyBlue)] scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left" />
              </span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </Link>
          </div>
        )}
        
      </div>
      
      {/* Enhanced hover accent line */}
      <div className="absolute left-0 top-8 w-1.5 h-0 bg-gradient-to-b from-[var(--color-companyBlue)] via-[var(--color-companyBlue)]/80 to-transparent rounded-full group-hover:h-20 transition-all duration-500 ease-out shadow-lg shadow-[var(--color-companyBlue)]/20" />
      
    </div>
  );
}