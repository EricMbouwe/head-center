import { useEffect, useMemo } from 'react';
import { clsx } from 'clsx';
import type { BlogPost } from '@store/blogStore';
import { blogSelectors, useBlogStore } from '@store/blogStore';

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('fr-FR');
};

type BlogViewProps = {
  posts: BlogPost[];
};

const BlogView = ({ posts }: BlogViewProps) => {
  const setPosts = useBlogStore((state) => state.setPosts);
  const filteredPosts = useBlogStore(blogSelectors.selectFilteredPosts);
  const searchTerm = useBlogStore(blogSelectors.selectSearchTerm);
  const activeTag = useBlogStore(blogSelectors.selectActiveTag);
  const activeCategory = useBlogStore(blogSelectors.selectActiveCategory);
  const setSearchTerm = useBlogStore((state) => state.setSearchTerm);
  const setActiveTag = useBlogStore((state) => state.setActiveTag);
  const setActiveCategory = useBlogStore((state) => state.setActiveCategory);
  const clearFilters = useBlogStore((state) => state.clearFilters);

  useEffect(() => {
    setPosts(posts);
  }, [posts, setPosts]);

  const availableTags = useMemo(() => {
    return Array.from(new Set(posts.flatMap((post) => post.tags ?? [])));
  }, [posts]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(posts.map((post) => post.category)));
  }, [posts]);

  return (
    <div className="space-y-12">
      <div className="grid gap-6 rounded-3xl border border-white/5 bg-white/5 p-8 shadow-card md:grid-cols-[1fr,2fr] md:items-center">
        <div>
          <h2 className="text-2xl font-heading text-white">Affinez votre lecture</h2>
          <p className="mt-2 text-sm text-slate-300">
            Recherchez un mot-clé, sélectionnez une catégorie ou un tag pour filtrer les articles sans recharger la page.
          </p>
        </div>
        <div className="grid gap-4">
          <label className="flex flex-col text-sm text-slate-300">
            Mot-clé
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Rechercher un sujet, un tag, une techno..."
              className="mt-1 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-white outline-none transition focus:border-cyanAura focus:ring-2 focus:ring-cyanAura/40"
              type="search"
            />
          </label>
          <div className="flex flex-wrap gap-3 text-sm">
            {availableCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                className={clsx(
                  'rounded-full border px-4 py-1 transition',
                  activeCategory === category
                    ? 'border-cyanAura bg-cyanAura/20 text-cyanAura'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyanAura/40 hover:text-white'
                )}
              >
                {category}
              </button>
            ))}
          </div>
          {availableTags.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-xs">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={clsx(
                    'rounded-full border px-3 py-1 uppercase tracking-wide transition',
                    activeTag === tag
                      ? 'border-indigoGlow bg-indigoGlow/20 text-indigoGlow'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-indigoGlow/60 hover:text-white'
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {filteredPosts.length === 0 ? (
          <p className="rounded-3xl border border-white/5 bg-white/5 p-10 text-center text-slate-300">
            Aucun article ne correspond à votre recherche pour le moment.
          </p>
        ) : (
          filteredPosts.map((post) => (
            <article key={post.slug} className="rounded-3xl border border-white/5 bg-white/5 p-10 shadow-card">
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-indigoGlow">
                <span className="rounded-full bg-indigoGlow/20 px-3 py-1">{post.category}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-white">{formatDate(post.publishedAt)}</span>
              </div>
              <h2 className="mt-5 text-3xl font-heading text-white">
                <a className="hover:text-cyanAura" href={`/blog/${post.slug}`}>
                  {post.title}
                </a>
              </h2>
              <p className="mt-4 text-base text-slate-300">{post.description}</p>
              {post.tags && post.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-300">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogView;
