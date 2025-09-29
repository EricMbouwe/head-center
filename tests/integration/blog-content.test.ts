import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';

import '../vitest.astro.mjs';

describe('Blog collection', () => {
  it('contains published articles with required fields', async () => {
    const posts = await getCollection('blog');
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((post) => {
      expect(post.data.title).toBeTruthy();
      expect(post.data.description).toBeTruthy();
      expect(post.data.author).toBeTruthy();
    });
  });
});
