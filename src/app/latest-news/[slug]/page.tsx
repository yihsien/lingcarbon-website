import { notFound } from 'next/navigation';
import { allNews } from '@/lib/news-data';
import ArticleClient from '../ArticleClient';

/**
 * Pre‑generate static params so every slug in the JSON
 * gets a fully‑static page at build time.
 */
export async function generateStaticParams() {
  return allNews.map((n) => ({ slug: n.slug }));
}

/* ─────────────────────────────────────────────────────
   Server component: fetches the story and hands it off
   to a client component for language‑aware rendering.
   ──────────────────────────────────────────────────── */
export default function NewsPage({ params }: { params: { slug: string } }) {
  const storyExists = allNews.some((n) => n.slug === params.slug);
  if (!storyExists) notFound();

  return <ArticleClient slug={params.slug} />;
}