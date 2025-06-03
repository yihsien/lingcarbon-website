'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import JobPosting from './JobPosting';
import { useLanguage, translations } from '@/components/LanguageProvider';

export default function JoinUsPage() {
  const [contactOpen, setContactOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <>
      {/* Top navigation */}
      <Header onContactClick={() => setContactOpen(true)} />

      {/* Main hero – we’ll add job cards here next */}
      <section className="container mx-auto px-4 py-24 sm:py-32">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-center">
          {translations[language].joinUsTitle ?? 'Join Us'}
        </h1>

        {/* Job postings */}
        <div className="mt-12 grid gap-8 mx-auto max-w-3xl">
          <JobPosting
            title={translations[language].joinUsPostingTitle1}
            location={translations[language].joinUsPostingLocation1}
            type={translations[language].joinUsPostingType1}
            description={translations[language].joinUsPostingDescription1}
            applyLink="https://www.104.com.tw/job/8hi4h?jobsource=vipshare&utm_source=vip&utm_medium=share_copy"
          />
          <JobPosting
            title={translations[language].joinUsPostingTitle2}
            location={translations[language].joinUsPostingLocation2}
            type={translations[language].joinUsPostingType2}
            description={
              translations[language].joinUsPostingDescription2}
            applyLink="https://www.104.com.tw/job/8kj5d?jobsource=vipshare&utm_source=vip&utm_medium=share_copy"
          />
          <JobPosting
            title={translations[language].joinUsPostingTitle3}
            location={translations[language].joinUsPostingLocation3}
            type={translations[language].joinUsPostingType3}
            description={
              translations[language].joinUsPostingDescription3}
            applyLink="https://www.104.com.tw/job/8mxsa?jobsource=vipshare&utm_source=vip&utm_medium=share_copy"
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Contact modal */}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}