import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    publishedAt: z.string().transform((val) => new Date(val)),
    author: z.string(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    client: z.string(),
    excerpt: z.string(),
    industry: z.string(),
    services: z.array(z.string()),
    techStack: z.array(z.string()),
    documentationUrl: z.string().url(),
    demoUrl: z.string().url(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    publishedAt: z.string().transform((val) => new Date(val))
  })
});

export const collections = { blog, portfolio };
