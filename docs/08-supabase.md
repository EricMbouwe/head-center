# Supabase (BaaS) Setup

## Pourquoi Supabase ?
- Postgres managé + API REST/Realtime.
- Auth prête à l’emploi (Google, GitHub).
- Stockage et Edge Functions intégrés.

## Comment configurer ?
1. Créer un projet Supabase (`Region EU`).
2. Définir les variables d’environnement :
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - Prévoir deux jeux de clefs (staging & production) et les renseigner dans `terraform/*.tfvars` pour que chaque namespace Kubernetes injecte les bonnes valeurs.
3. Créer la table `posts` et sa structure enrichie :
```sql
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  slug text unique not null,
  content text,
  published_at timestamptz,
  status text check (status in ('draft','in_review','published')) default 'draft',
  read_count integer default 0,
  cover_image text,
  gallery_images text[] default '{}',
  video_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger posts_updated_at
  before update on posts
  for each row
  execute procedure moddatetime(updated_at);
```
4. Activer Row Level Security puis créer des policies :
```sql
alter table posts enable row level security;
create policy "Allow read published" on posts for select using (status = 'published');
create policy "Allow editor" on posts
  for all
  using (auth.role() = 'authenticated');
```
5. Créer un bucket de stockage public `post-media` et l’associer à la politique suivante pour autoriser les uploads depuis l’admin :
```sql
insert into storage.buckets (id, name, public) values ('post-media', 'post-media', true);
create policy "Allow authenticated uploads" on storage.objects
  for insert
  with check (bucket_id = 'post-media' and auth.role() = 'authenticated');
create policy "Allow public read" on storage.objects
  for select using (bucket_id = 'post-media');
```
6. Configurer OAuth Google dans `Authentication > Providers`.
7. (Optionnel) Ajouter une Edge Function `sync-markdown` pour publier un article depuis un commit Git.
