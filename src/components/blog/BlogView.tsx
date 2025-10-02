import { useEffect, useMemo } from 'react';
import Card from '@components/ui/Card.tsx';
import Badge from '@components/ui/Badge.tsx';
import Button from '@components/ui/Button.tsx';
import Input from '@components/ui/Input.tsx';
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
      <Card className="grid gap-6 md:grid-cols-[1fr,2fr] md:items-center">
        <div>
          <h2 className="text-2xl font-heading text-white">Affinez votre lecture</h2>
          <p className="mt-2 text-sm text-slate-300">
            Recherchez un mot-clé, sélectionnez une catégorie ou un tag pour filtrer les articles sans recharger la page.
          </p>
        </div>
        <div className="grid gap-4">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura">Mot-clé</span>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Rechercher un sujet, un tag, une techno..."
              type="search"
              className="rounded-full"
            />
          </label>
          <div className="flex flex-wrap gap-3 text-sm">
            {availableCategories.map((category) => (
              <Button
                key={category}
                type="button"
                size="sm"
                variant={activeCategory === category ? 'subtle' : 'ghost'}
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              >
                {category}
              </Button>
            ))}
          </div>
          {availableTags.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-xs">
              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  variant={activeTag === tag ? 'primary' : 'ghost'}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className="uppercase tracking-wide"
                >
                  #{tag}
                </Button>
              ))}
            </div>
          ) : null}
          <div className="flex justify-end">
            <Button type="button" size="sm" variant="secondary" onClick={clearFilters}>
              Réinitialiser
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-8">
        {filteredPosts.length === 0 ? (
          <Card className="p-10 text-center text-slate-300">
            Aucun article ne correspond à votre recherche pour le moment.
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.slug} className="p-10">
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-indigoGlow">
                <Badge variant="accent">{post.category}</Badge>
                <Badge variant="outline" className="text-white">
                  {formatDate(post.publishedAt)}
                </Badge>
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
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogView;
