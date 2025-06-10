'use client';

import { useState } from 'react';
import Header         from '@/components/Header';
import Footer         from '@/components/Footer';
import ContactModal   from '@/components/ContactModal';
import TeamCard       from './TeamCard';
import { useLanguage, translations } from '@/components/LanguageProvider';

export default function OurTeamPage() {
  const [contactOpen, setContactOpen] = useState(false);
  const { language } = useLanguage();

  const team = [
    {
      name: translations[language].teamStephenName ?? 'Stephen Lin',
      role: translations[language].teamStephenRole ?? 'Founder & CEO',
      education: translations[language].teamStephenEducation ?? 'M.S. in Computer Science, Princeton University',
      headshot: '/img/team/stephen-color.jpg',
      headshotColor: '/img/team/stephen-color.jpg',
      bio: translations[language].teamStephenBio ??
           'Former Bloomberg engineering manager now helping businesses reach net‑zero.',
      linkedin: 'https://www.linkedin.com/in/yihsienlin',
      email: 'stephen.lin@lingcarbon.com',
    },
    {
      name: translations[language].teamWilliamName ?? 'William Lu',
      role: translations[language].teamWilliamRole ?? 'Principal Carbon Consultant',
      education: translations[language].teamWilliamEducation ?? 'M.S. in Occupational Safety and Health, China Medical University',
      headshot: '/img/team/william-color.jpg',
      headshotColor: '/img/team/william-color.jpg',
      bio: translations[language].teamWilliamBio ??
           'Experienced carbon management consultant with a decade of expertise in GHG inventories and carbon strategies.',
      linkedin: 'https://www.linkedin.com/in/william-lu-34938128a',
      email: 'william.lu@lingcarbon.com',
    },
  ];

  return (
    <>
      <Header onContactClick={() => setContactOpen(true)} />

      <section className="container mx-auto px-4 py-24 sm:py-32">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-center mb-14">{translations[language].ourTeamTitle ?? 'Our Team'}</h1>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 justify-center">
          {team.map(member => (
            <TeamCard key={member.name} {...member} />
          ))}
        </div>
      </section>

      <Footer />
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}