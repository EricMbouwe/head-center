import { create } from 'zustand';

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  tags?: string[];
  author?: string;
};

type BlogFilters = {
  posts: BlogPost[];
  searchTerm: string;
  activeTag: string | null;
  activeCategory: string | null;
};

type BlogStore = BlogFilters & {
  setPosts: (posts: BlogPost[]) => void;
  setSearchTerm: (term: string) => void;
  setActiveTag: (tag: string | null) => void;
  setActiveCategory: (category: string | null) => void;
  clearFilters: () => void;
  filteredPosts: () => BlogPost[];
  reset: () => void;
};

const initialFilters: BlogFilters = {
  posts: [],
  searchTerm: '',
  activeTag: null,
  activeCategory: null
};

const matchesSearch = (post: BlogPost, searchTerm: string) => {
  if (!searchTerm.trim()) {
    return true;
  }

  const normalizedTerm = searchTerm.trim().toLowerCase();
  return (
    post.title.toLowerCase().includes(normalizedTerm) ||
    post.description.toLowerCase().includes(normalizedTerm) ||
    (post.tags ?? []).some((tag) => tag.toLowerCase().includes(normalizedTerm))
  );
};

const matchesTag = (post: BlogPost, activeTag: string | null) => {
  if (!activeTag) {
    return true;
  }

  return (post.tags ?? []).some((tag) => tag === activeTag);
};

const matchesCategory = (post: BlogPost, activeCategory: string | null) => {
  if (!activeCategory) {
    return true;
  }

  return post.category === activeCategory;
};

export const useBlogStore = create<BlogStore>((set, get) => ({
  ...initialFilters,
  setPosts: (posts) => set({ posts }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setActiveTag: (tag) => set({ activeTag: tag }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  clearFilters: () => set({ searchTerm: '', activeTag: null, activeCategory: null }),
  filteredPosts: () => {
    const { posts, searchTerm, activeTag, activeCategory } = get();
    return posts.filter(
      (post) => matchesSearch(post, searchTerm) && matchesTag(post, activeTag) && matchesCategory(post, activeCategory)
    );
  },
  reset: () => set({ ...initialFilters })
}));

export const blogSelectors = {
  selectSearchTerm: (state: BlogStore) => state.searchTerm,
  selectActiveTag: (state: BlogStore) => state.activeTag,
  selectActiveCategory: (state: BlogStore) => state.activeCategory,
  selectFilteredPosts: (state: BlogStore) => state.filteredPosts(),
  selectAvailableTags: (state: BlogStore) => Array.from(new Set(state.posts.flatMap((post) => post.tags ?? []))),
  selectAvailableCategories: (state: BlogStore) => Array.from(new Set(state.posts.map((post) => post.category)))
};
