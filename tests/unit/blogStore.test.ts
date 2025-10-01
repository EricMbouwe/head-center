import { beforeEach, describe, expect, it } from 'vitest';
import { blogSelectors, type BlogPost, useBlogStore } from '../../src/store/blogStore';

const samplePosts: BlogPost[] = [
  {
    slug: 'astro-supabase',
    title: 'Construire un blog Astro + Supabase',
    description: 'Un guide pratique pour combiner Astro et Supabase.',
    category: 'Engineering',
    publishedAt: '2024-07-01',
    tags: ['astro', 'supabase']
  },
  {
    slug: 'design-system',
    title: 'Créer un design system durable',
    description: 'Principes et bonnes pratiques pour des interfaces cohérentes.',
    category: 'Design',
    publishedAt: '2024-06-15',
    tags: ['design', 'ux']
  }
];

describe('useBlogStore', () => {
  beforeEach(() => {
    useBlogStore.getState().reset();
    useBlogStore.getState().setPosts(samplePosts);
  });

  it('returns all posts by default', () => {
    const posts = blogSelectors.selectFilteredPosts(useBlogStore.getState());
    expect(posts).toHaveLength(2);
  });

  it('filters posts by search term', () => {
    useBlogStore.getState().setSearchTerm('design');
    const posts = blogSelectors.selectFilteredPosts(useBlogStore.getState());

    expect(posts).toHaveLength(1);
    expect(posts[0]?.slug).toBe('design-system');
  });

  it('filters posts by active tag and category', () => {
    const store = useBlogStore.getState();
    store.setActiveTag('astro');
    store.setActiveCategory('Engineering');

    const posts = blogSelectors.selectFilteredPosts(useBlogStore.getState());

    expect(posts).toHaveLength(1);
    expect(posts[0]?.slug).toBe('astro-supabase');
  });

  it('clears filters', () => {
    const store = useBlogStore.getState();
    store.setSearchTerm('ux');
    store.setActiveTag('ux');
    store.clearFilters();

    expect(store.searchTerm).toBe('');
    expect(store.activeTag).toBeNull();
    expect(store.activeCategory).toBeNull();
  });
});
