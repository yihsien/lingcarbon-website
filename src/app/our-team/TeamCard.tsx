// src/app/our-team/TeamCard.tsx
'use client';

import Image from 'next/image';
import { Mail, Linkedin } from 'lucide-react';

export interface TeamCardProps {
  name: string;
  role: string;
  education?: string;
  headshot: string;          // e.g. '/img/team/stephen.jpg'
  headshotColor?: string;    // optional color version
  bio?: string;
  linkedin?: string;         // full URL
  email?: string;            // plain address, no "mailto:"
}

export default function TeamCard({
  name,
  role,
  education,
  headshot,
  headshotColor,
  bio,
  linkedin,
  email,
}: TeamCardProps) {
  return (
    <article className="group relative">
      {/* Main container */}
      <div className="relative p-8 transition-all duration-300 hover:transform hover:scale-[1.1]">
        {/* Profile image container */}
        <div className="relative mb-6">
          <div className="relative w-32 h-32 mx-auto">
            {/* Animated border ring */}
            <div className="absolute inset-0 rounded-full p-[3px] group-hover:animate-pulse">
              {/* Base ring */}
              <div className="w-full h-full rounded-full bg-[var(--color-companyBlue)]"></div>
              
              {/* Running light effect on hover */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-full rounded-full animate-spin" style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, var(--color-companyBlue) 60deg, transparent 120deg, transparent 240deg, var(--color-companyBlue) 300deg, transparent 360deg)`,
                  mask: 'radial-gradient(circle, transparent 65%, black 65%, black 100%)',
                  WebkitMask: 'radial-gradient(circle, transparent 65%, black 65%, black 100%)'
                }}></div>
              </div>
              
              {/* Inner circle */}
              <div className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full bg-gray-900"></div>
            </div>
            
            {/* Profile image */}
            <div className="absolute inset-[3px] rounded-full overflow-hidden">
              <Image
                src={headshotColor || headshot}
                fill
                sizes="480px"
                alt={`${name} headshot`}
                quality={100}
                className="object-cover transition-all duration-300"
                priority
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-3">
          {/* Name */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[var(--color-companyBlue)] transition-colors duration-300">
            {name}
          </h3>
          
          {/* Role */}
          <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-companyBlue)]/10 border-2 border-[var(--color-companyBlue)]/50">
            <p className="text-sm font-medium text-[var(--color-companyBlue)] transition-colors">
              {role}
            </p>
          </div>
          
          {/* Education */}
          {education && (
            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
              {education}
            </p>
          )}

          {/* Bio */}
          {bio && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto transition-opacity">
              {bio}
            </p>
          )}

          {/* Social links */}
          {(linkedin || email) && (
            <div className="flex justify-center space-x-4 pt-2">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on LinkedIn`}
                  className="p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-[var(--color-companyBlue)] hover:bg-slate-200 dark:hover:bg-white/10 hover:border-[var(--color-companyBlue)]/30 transition-all duration-200 hover:scale-110"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  aria-label={`Email ${name}`}
                  className="p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-[var(--color-companyBlue)] hover:bg-slate-200 dark:hover:bg-white/10 hover:border-[var(--color-companyBlue)]/30 transition-all duration-200 hover:scale-110"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}