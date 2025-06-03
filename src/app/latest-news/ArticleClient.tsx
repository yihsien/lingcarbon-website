// src/app/latest-news/ArticleClient.tsx
'use client';

import Image from 'next/image';
import { allNews } from '@/lib/news-data';
import { useLanguage } from '@/components/LanguageProvider';

/** String or locale-map helper */
type Localized = string | Record<string, string>;

export default function ArticleClient({ slug }: { slug: string }) {
  const { language } = useLanguage();

  const story = allNews.find((n) => n.slug === slug);
  if (!story) return null;

  const getField = (field: Localized) =>
    typeof field === 'string' ? field : field[language] ?? field.en ?? '';

  const title = getField(story.title as Localized);
  const body  = story.bodyHtml ?? '';

  return (
    <article className="prose dark:prose-invert mx-auto px-4 py-24">
      <h1>{title}</h1>
      <time className="text-sm opacity-70">{story.date}</time>

      {story.hero && (
        <Image
          src={story.hero}
          alt=""
          width={1200}
          height={600}
          priority
          className="rounded-xl my-8"
        />
      )}

      {/* eslint-disable-next-line react/no-danger */}
      <section dangerouslySetInnerHTML={{ __html: body }} />
    </article>
  );
}