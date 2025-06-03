'use client';

import { useState } from 'react';
import Header        from '@/components/Header';
import Footer        from '@/components/Footer';
import ContactModal  from '@/components/ContactModal';
import NewsPosting   from './NewsPosting';
import { allNews }   from '@/lib/news-data';

export default function LatestNewsPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <Header onContactClick={() => setContactOpen(true)} />

      {/* Bento‑grid news section */}
      <main className="container mx-auto px-4 py-24 sm:py-32">
        <h1 className="mb-12 text-center text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Latest News
        </h1>

        <div className="grid auto-rows-[14rem] gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allNews.map((item) => (
            <NewsPosting key={item.slug} {...item} />
          ))}
        </div>
      </main>

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
