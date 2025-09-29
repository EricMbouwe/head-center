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
3. Créer la table `posts` :
```sql
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  slug text unique not null,
  content text,
  published_at timestamptz default now(),
  status text check (status in ('draft','published')) default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```
4. Activer Row Level Security puis créer des policies :
```sql
alter table posts enable row level security;
create policy "Allow read published" on posts for select using (status = 'published');
create policy "Allow editor" on posts for all using (auth.role() = 'authenticated');
```
5. Configurer OAuth Google dans `Authentication > Providers`.
6. (Optionnel) Ajouter une Edge Function `sync-markdown` pour publier un article depuis un commit Git.
