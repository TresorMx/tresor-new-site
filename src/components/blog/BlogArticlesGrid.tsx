'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  image: string;
  readTime: string;
  date: string;
}

const PAGE_SIZE = 6;
// Duración puramente cosmética del loader al pedir más artículos — no hay
// fetch real (el arreglo completo ya llega del server component), pero un
// reveal instantáneo se siente roto en un grid de este tamaño.
const LOAD_DELAY_MS = 500;

export default function BlogArticlesGrid({ articles }: { articles: BlogArticle[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const visible = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  function handleLoadMore() {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((c) => c + PAGE_SIZE);
      setLoading(false);
    }, LOAD_DELAY_MS);
  }

  return (
    <section
      data-nav="light"
      className="relative z-10 -mt-10 rounded-[2.5rem] py-20 md:py-28"
      style={{ backgroundImage: 'linear-gradient(180deg, #f7f8fa 0%, #f2f3f5 55%, #eceef1 100%)' }}
    >
      <div className="container-wrap">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((article) => (
            <div key={article.slug} className="grid grid-cols-1 gap-3 rounded-[28px] bg-white p-3">
              <Link href={`/blog/${article.slug}`} className="group relative aspect-video overflow-hidden rounded-[20px]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </Link>
              <div className="flex flex-col px-5 py-6">
                <div className="flex items-center gap-2 text-xs text-ink-3">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readTime} de lectura</span>
                </div>
                <h2 className="mt-3 font-sans text-[clamp(18px,1.8vw,28px)] font-medium leading-[1.15] text-ink">
                  <Link href={`/blog/${article.slug}`} className="hover:text-accent transition-colors">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-3 text-[13px] font-light leading-relaxed text-ink-2">
                  {article.description}
                </p>
                <Link
                  href={`/blog/${article.slug}`}
                  className="mt-5 inline-flex w-fit items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-all hover:brightness-95"
                >
                  Leer artículo
                </Link>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-14 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-all hover:border-ink/30 disabled:opacity-60"
            >
              {loading && <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />}
              {loading ? 'Cargando…' : 'Ver más artículos'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
