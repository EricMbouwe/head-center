import { createClient } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Button, { ButtonLink } from '@components/ui/Button';
import QueryProvider from '../providers/QueryProvider';
import { NotificationProvider, useNotifications } from '../providers/NotificationProvider';
import PostForm, { type PostFormValues, type PostStatus } from './PostForm';

type Post = {
  id: string;
  title: string;
  description: string;
  slug: string;
  content: string;
  published_at: string | null;
  status: PostStatus;
  read_count: number;
  cover_image: string | null;
  gallery_images: string[];
  video_url: string | null;
  created_at?: string;
  updated_at?: string;
};

type Session = {
  user: {
    email: string;
  };
};

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
const MEDIA_BUCKET = 'post-media';

function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session as Session | null));
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession as Session | null));
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return session;
}

async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((post) => ({
    ...post,
    read_count: post.read_count ?? 0,
    gallery_images: post.gallery_images ?? []
  })) as Post[];
}

const statusLabels: Record<PostStatus, string> = {
  draft: 'Brouillon',
  in_review: 'En revue',
  published: 'Publié'
};

const statusVariants: Record<PostStatus, 'outline' | 'warning' | 'success'> = {
  draft: 'outline',
  in_review: 'warning',
  published: 'success'
};

const filterOptions: { value: PostStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'draft', label: 'Brouillons' },
  { value: 'in_review', label: 'En revue' },
  { value: 'published', label: 'Publiés' }
];

function statusBadge(status: PostStatus) {
  return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
}

async function createPost(values: PostFormValues) {
  const payload = {
    title: values.title,
    slug: values.slug,
    description: values.description,
    content: values.content,
    status: values.status,
    cover_image: values.cover_image,
    gallery_images: values.gallery_images,
    video_url: values.video_url,
    published_at: values.status === 'published' ? values.published_at ?? new Date().toISOString() : null
  };
  const { data, error } = await supabase.from('posts').insert(payload).select('*').single();
  if (error) throw error;
  return data as Post;
}

async function updatePost(id: string, values: Partial<Post>) {
  const { data, error } = await supabase.from('posts').update(values).eq('id', id).select('*').single();
  if (error) throw error;
  return data as Post;
}

async function deletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

async function uploadMedia(file: File, folder: string) {
  const extension = file.name.split('.').pop();
  const fallbackId = Math.random().toString(36).slice(2, 10);
  const fileName = (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : fallbackId) +
    (extension ? `.${extension}` : '');
  const path = `${folder}/${fileName}`;
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  const { data: publicData, error: publicError } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(data.path);
  if (publicError) throw publicError;
  return publicData.publicUrl;
}

function computeStats(posts: Post[]) {
  const totalReads = posts.reduce((acc, post) => acc + (post.read_count ?? 0), 0);
  const statuses: Record<PostStatus, number> = { draft: 0, in_review: 0, published: 0 };
  posts.forEach((post) => {
    statuses[post.status] += 1;
  });
  const publishedThisMonth = posts.filter((post) => {
    if (post.status !== 'published' || !post.published_at) return false;
    const date = new Date(post.published_at);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  const topRead = [...posts]
    .sort((a, b) => (b.read_count ?? 0) - (a.read_count ?? 0))
    .slice(0, 3)
    .map((post) => ({ title: post.title, read_count: post.read_count }));

  return { totalReads, statuses, publishedThisMonth, topRead };
}

function AdminAppInner() {
  const queryClient = useQueryClient();
  const session = useSession();
  const [activeFilter, setActiveFilter] = useState<PostStatus | 'all'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const notifications = useNotifications();

  const { data: posts = [], isLoading, isError, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    enabled: Boolean(session)
  });

  useEffect(() => {
    if (isError && error) {
      notifications.error((error as Error).message);
    }
  }, [isError, error, notifications]);

  const stats = useMemo(() => computeStats(posts), [posts]);

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      notifications.success('Article créé avec succès.');
      setIsCreating(false);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (mutationError: unknown) => {
      notifications.error((mutationError as Error).message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<Post> }) => updatePost(id, values),
    onSuccess: () => {
      notifications.success('Article mis à jour.');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (mutationError: unknown) => {
      notifications.error((mutationError as Error).message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      notifications.success('Article supprimé.');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setSelectedPost(null);
    },
    onError: (mutationError: unknown) => {
      notifications.error((mutationError as Error).message);
    }
  });

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts;
    return posts.filter((post) => post.status === activeFilter);
  }, [activeFilter, posts]);

  const handleCreate = async (values: PostFormValues) => {
    await createMutation.mutateAsync(values);
  };

  const handleUpdate = async (values: PostFormValues) => {
    if (!selectedPost) return;
    await updateMutation.mutateAsync({
      id: selectedPost.id,
      values: {
        title: values.title,
        slug: values.slug,
        description: values.description,
        content: values.content,
        status: values.status,
        cover_image: values.cover_image,
        gallery_images: values.gallery_images,
        video_url: values.video_url,
        published_at: values.status === 'published' ? values.published_at ?? new Date().toISOString() : null
      }
    });
  };

  const handleStatusChange = async (post: Post, status: PostStatus) => {
    await updateMutation.mutateAsync({
      id: post.id,
      values: {
        status,
        published_at: status === 'published' ? post.published_at ?? new Date().toISOString() : null
      }
    });
  };

  const handleDelete = async (post: Post) => {
    if (!confirm(`Supprimer définitivement "${post.title}" ?`)) return;
    await deleteMutation.mutateAsync(post.id);
  };

  const handleUploadCover = useCallback((file: File) => uploadMedia(file, 'covers'), []);
  const handleUploadGallery = useCallback(
    (files: FileList) => Promise.all(Array.from(files).map((file) => uploadMedia(file, 'gallery'))),
    []
  );

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const displayedFormValues: Partial<PostFormValues> | undefined = isCreating
    ? undefined
    : selectedPost
    ? {
        title: selectedPost.title,
        slug: selectedPost.slug,
        description: selectedPost.description,
        content: selectedPost.content,
        status: selectedPost.status,
        cover_image: selectedPost.cover_image,
        gallery_images: selectedPost.gallery_images,
        video_url: selectedPost.video_url,
        published_at: selectedPost.published_at
      }
    : undefined;

  return (
    <div className="flex flex-col gap-8">
      {!session ? (
        <Card padding="lg" className="space-y-4 text-center">
          <h2 className="text-2xl font-heading text-white">Connexion requise</h2>
          <p className="text-sm text-slate-300">
            Connectez-vous avec votre compte d'agence pour gérer les articles en base Supabase.
          </p>
          <Button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
            Se connecter avec Google
          </Button>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-slate-300">Connecté en tant que</p>
              <p className="text-lg font-semibold text-white">{session.user.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                variant="subtle"
                onClick={() => {
                  setIsCreating(true);
                  setSelectedPost(null);
                }}
              >
                Nouvel article
              </Button>
              <Button size="sm" variant="ghost" onClick={() => supabase.auth.signOut()}>
                Déconnexion
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card padding="md">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Lectures cumulées</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.totalReads}</p>
              <p className="mt-1 text-xs text-slate-400">Somme des lectures reportées par Supabase</p>
            </Card>
            <Card padding="md">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Articles ce mois-ci</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.publishedThisMonth}</p>
              <p className="mt-1 text-xs text-slate-400">Publications confirmées sur les 30 derniers jours</p>
            </Card>
            <Card padding="md">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Répartition</p>
              <div className="mt-3 space-y-2 text-sm text-white">
                {Object.entries(stats.statuses).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span>{statusLabels[key as PostStatus]}</span>
                    <span className="text-slate-300">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {filterOptions.map((filter) => (
                  <Button
                    key={filter.value}
                    size="sm"
                    variant={activeFilter === filter.value ? 'primary' : 'ghost'}
                    onClick={() => setActiveFilter(filter.value)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                {isLoading && <p className="text-sm text-slate-300">Chargement des articles...</p>}
                {isError && <p className="text-sm text-red-400">{(error as Error).message}</p>}
                {!isLoading && filteredPosts.length === 0 && (
                  <p className="text-sm text-slate-400">Aucun article pour cette sélection.</p>
                )}
                {filteredPosts.map((post) => (
                  <Card key={post.id} padding="md" className="space-y-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                      <div className="space-y-2">
                        {statusBadge(post.status)}
                        <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                        <p className="text-sm text-slate-300">{post.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                          <span>Slug: {post.slug}</span>
                          <span>Lectures: {post.read_count ?? 0}</span>
                          {post.published_at && <span>Publié le {new Date(post.published_at).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      {post.cover_image && (
                        <img src={post.cover_image} alt="Couverture" className="h-24 w-40 rounded-xl object-cover" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPost(post);
                          setIsCreating(false);
                        }}
                      >
                        Modifier
                      </Button>
                      <Button size="sm" variant="success" onClick={() => handleStatusChange(post, 'published')}>
                        Publier
                      </Button>
                      <Button size="sm" variant="warning" onClick={() => handleStatusChange(post, 'draft')}>
                        Dépublier
                      </Button>
                      <Button size="sm" variant="subtle" onClick={() => handleStatusChange(post, 'in_review')}>
                        Marquer en revue
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(post)}>
                        Supprimer
                      </Button>
                      <ButtonLink
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        variant="ghost"
                      >
                        Voir l'article
                      </ButtonLink>
                    </div>
                  </Card>
                ))}
              </div>

              <Card padding="md">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Top lectures</p>
                <ul className="mt-3 space-y-2 text-sm text-white">
                  {stats.topRead.map((entry) => (
                    <li key={entry.title} className="flex items-center justify-between">
                      <span>{entry.title}</span>
                      <span className="text-slate-300">{entry.read_count}</span>
                    </li>
                  ))}
                  {stats.topRead.length === 0 && <li className="text-xs text-slate-400">Pas encore de statistiques.</li>}
                </ul>
              </Card>
            </div>

            <Card padding="md">
              {isCreating || selectedPost ? (
                <PostForm
                  key={selectedPost?.id ?? (isCreating ? 'create' : 'empty')}
                  initialValue={displayedFormValues}
                  onSubmit={isCreating ? handleCreate : handleUpdate}
                  onCancel={() => {
                    setIsCreating(false);
                    setSelectedPost(null);
                  }}
                  isSaving={isSaving}
                  onUploadCover={handleUploadCover}
                  onUploadGallery={handleUploadGallery}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-slate-300">
                  <p className="text-base font-semibold text-white">Sélectionnez un article</p>
                  <p>
                    Sélectionnez un article pour l'éditer ou cliquez sur "Nouvel article" pour en créer un.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsCreating(true);
                      setSelectedPost(null);
                    }}
                  >
                    Commencer
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminApp() {
  return (
    <QueryProvider>
      <NotificationProvider>
        <AdminAppInner />
      </NotificationProvider>
    </QueryProvider>
  );
}
