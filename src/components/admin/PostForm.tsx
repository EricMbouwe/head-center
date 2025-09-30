import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNotifications } from '../providers/NotificationProvider';

export type PostStatus = 'draft' | 'published' | 'in_review';

export type PostFormValues = {
  title: string;
  slug: string;
  description: string;
  content: string;
  status: PostStatus;
  cover_image: string | null;
  gallery_images: string[];
  video_url: string | null;
  published_at: string | null;
};

export type PostFormProps = {
  initialValue?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSaving: boolean;
  onUploadCover: (file: File) => Promise<string>;
  onUploadGallery: (files: FileList) => Promise<string[]>;
};

const STATUS_OPTIONS: { value: PostStatus; label: string }[] = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'in_review', label: 'En revue' },
  { value: 'published', label: 'Publié' }
];

const defaultValues: PostFormValues = {
  title: '',
  slug: '',
  description: '',
  content: '',
  status: 'draft',
  cover_image: null,
  gallery_images: [],
  video_url: null,
  published_at: null
};

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

const toInputDateTime = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const fromInputDateTime = (value: string) => {
  if (!value) return null;
  const date = new Date(value);
  return date.toISOString();
};

export default function PostForm({ initialValue, onSubmit, onCancel, isSaving, onUploadCover, onUploadGallery }: PostFormProps) {
  const [values, setValues] = useState<PostFormValues>({ ...defaultValues, ...initialValue });
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const notifications = useNotifications();

  useEffect(() => {
    setValues({ ...defaultValues, ...initialValue });
  }, [initialValue]);

  const galleryPreview = useMemo(() => values.gallery_images ?? [], [values.gallery_images]);

  const handleChange = (field: keyof PostFormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value } = event.target;
    if (field === 'published_at') {
      setValues((prev) => ({ ...prev, published_at: fromInputDateTime(value) }));
      return;
    }
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateSlug = () => {
    setValues((prev) => ({ ...prev, slug: slugify(prev.title) }));
  };

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const file = event.target.files[0];
    setIsUploadingCover(true);
    try {
      const url = await notifications.promise(onUploadCover(file), {
        loading: 'Téléversement de la couverture...',
        success: 'Image de couverture ajoutée.',
        error: (err) => (err instanceof Error ? err.message : "Échec du téléversement de la couverture.")
      });
      setValues((prev) => ({ ...prev, cover_image: url }));
    } catch {
      // handled by toast promise
    } finally {
      setIsUploadingCover(false);
      event.target.value = '';
    }
  };

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setIsUploadingGallery(true);
    try {
      const urls = await notifications.promise(onUploadGallery(event.target.files), {
        loading: 'Ajout des images en galerie...',
        success: 'Images ajoutées à la galerie.',
        error: (err) => (err instanceof Error ? err.message : 'Échec de l’envoi des images de galerie.')
      });
      setValues((prev) => ({ ...prev, gallery_images: [...(prev.gallery_images ?? []), ...urls] }));
    } catch {
      // handled by toast promise
    } finally {
      setIsUploadingGallery(false);
      event.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (url: string) => {
    setValues((prev) => ({ ...prev, gallery_images: (prev.gallery_images ?? []).filter((image) => image !== url) }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ ...values, gallery_images: values.gallery_images ?? [] });
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{initialValue?.title ? "Modifier l'article" : 'Nouvel article'}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Fermer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura">Titre</span>
          <input
            required
            value={values.title}
            onChange={handleChange('title')}
            className="w-full rounded-xl border border-white/10 bg-midnight/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyanAura/70"
            placeholder="Titre accrocheur"
          />
        </label>
        <label className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura">
            <span>Slug</span>
            <button type="button" onClick={handleGenerateSlug} className="text-[10px] font-semibold text-slate-200 hover:text-white">
              Générer
            </button>
          </div>
          <input
            required
            value={values.slug}
            onChange={handleChange('slug')}
            className="w-full rounded-xl border border-white/10 bg-midnight/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyanAura/70"
            placeholder="titre-accrocheur"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura">Description</span>
        <textarea
          required
          value={values.description}
          onChange={handleChange('description')}
          className="min-h-[96px] w-full rounded-xl border border-white/10 bg-midnight/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyanAura/70"
          placeholder="Résumé court et impactant"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura">Contenu</span>
        <textarea
          required
          value={values.content}
          onChange={handleChange('content')}
          className="min-h-[160px] w-full rounded-xl border border-white/10 bg-midnight/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyanAura/70"
          placeholder="Markdown ou contenu riche"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura">Statut</span>
          <select
            value={values.status}
            onChange={handleChange('status')}
            className="w-full rounded-xl border border-white/10 bg-midnight/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyanAura/70"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-midnight text-slate-900">
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura">Publication</span>
          <input
            type="datetime-local"
            value={toInputDateTime(values.published_at)}
            onChange={handleChange('published_at')}
            className="w-full rounded-xl border border-white/10 bg-midnight/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyanAura/70"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-midnight/60 p-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura">
            <span>Image de couverture</span>
            <span className="text-[10px] text-slate-400">1200x630 recommandé</span>
          </div>
          <div className="flex flex-col gap-3">
            {values.cover_image ? (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <img src={values.cover_image} alt="Couverture" className="h-32 w-full object-cover" />
              </div>
            ) : (
              <p className="text-xs text-slate-300">Aucune image sélectionnée pour l'instant.</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="text-xs text-slate-200"
            />
            {isUploadingCover && <p className="text-xs text-cyanAura">Téléversement en cours...</p>}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-midnight/60 p-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura">
            <span>Galerie d'images</span>
            <span className="text-[10px] text-slate-400">Jusqu'à 10 images</span>
          </div>
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="text-xs text-slate-200" />
          {isUploadingGallery && <p className="text-xs text-cyanAura">Téléversement en cours...</p>}
          <div className="grid grid-cols-2 gap-3">
            {galleryPreview.map((image) => (
              <div key={image} className="relative overflow-hidden rounded-xl border border-white/10">
                <img src={image} alt="Galerie" className="h-20 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(image)}
                  className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white"
                >
                  Retirer
                </button>
              </div>
            ))}
            {galleryPreview.length === 0 && <p className="col-span-2 text-xs text-slate-300">Aucune image dans la galerie.</p>}
          </div>
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyanAura">Vidéo</span>
        <input
          value={values.video_url ?? ''}
          onChange={(event) => setValues((prev) => ({ ...prev, video_url: event.target.value || null }))}
          placeholder="URL Vimeo, YouTube ou lecteur natif"
          className="w-full rounded-xl border border-white/10 bg-midnight/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyanAura/70"
        />
      </label>

      <div className="mt-auto flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSaving || isUploadingCover || isUploadingGallery}
          className="rounded-full bg-indigoGlow px-5 py-2 text-xs font-semibold text-white shadow-card transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
