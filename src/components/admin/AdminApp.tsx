import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import QueryProvider from '../providers/QueryProvider';

type Post = {
  id: string;
  title: string;
  description: string;
  slug: string;
  published_at: string;
  status: 'draft' | 'published';
};

type Session = {
  user: {
    email: string;
  };
};

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_ANON_KEY);

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

async function fetchPosts() {
  const { data, error } = await supabase.from('posts').select('*').order('published_at', { ascending: false });
  if (error) throw error;
  return data as Post[];
}

function AdminAppInner() {
  const queryClient = useQueryClient();
  const session = useSession();

  const { data: posts, isLoading, isError, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    enabled: Boolean(session)
  });

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
  };

  return (
    <div className="flex flex-col gap-6">
      {!session ? (
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-heading text-white">Connexion requise</h2>
          <p className="text-sm text-slate-300">
            Connectez-vous avec votre compte d&apos;agence pour gérer les articles en base Supabase.
          </p>
          <button onClick={handleLogin} className="inline-flex items-center justify-center rounded-full bg-indigoGlow px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-indigo-500">
            Se connecter avec Google
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6">
            <div>
              <p className="text-sm text-slate-300">Connecté en tant que</p>
              <p className="text-lg font-semibold text-white">{session.user.email}</p>
            </div>
            <button onClick={handleLogout} className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white/10">
              Déconnexion
            </button>
          </div>
          <div>
            <h2 className="text-xl font-heading text-white">Articles</h2>
            {isLoading && <p className="mt-3 text-sm text-slate-300">Chargement des articles...</p>}
            {isError && <p className="mt-3 text-sm text-red-400">{(error as Error).message}</p>}
            {posts && posts.length === 0 && <p className="mt-3 text-sm text-slate-400">Aucun article pour le moment.</p>}
            <div className="mt-6 space-y-4">
              {posts?.map((post) => (
                <div key={post.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-midnight/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyanAura">{post.status}</p>
                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                    <p className="text-sm text-slate-300">{post.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                      href={`/blog/${post.slug}`}
                    >
                      Voir
                    </a>
                    <button className="rounded-full bg-indigoGlow px-4 py-2 text-xs font-semibold text-white shadow-card transition hover:bg-indigo-500">
                      Modifier
                    </button>
                    <button className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export default function AdminApp() {
  return (
    <QueryProvider>
      <AdminAppInner />
    </QueryProvider>
  );
}
