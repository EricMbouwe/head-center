import type { FC } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface HeroProps {
  ctaHref: string;
}

export const Hero: FC<HeroProps> = ({ ctaHref }) => {
  return (
    <section className="relative isolate overflow-hidden px-6 pt-24 pb-32 sm:px-12 lg:px-24">
      <div className="absolute inset-0 -z-10 bg-hero opacity-60" />
      <div className="mx-auto max-w-6xl text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cyanAura"
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          Livraison en 5 jours garantie
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={clsx('mt-8 text-4xl font-heading font-semibold text-white sm:text-6xl lg:text-7xl')}
        >
          Votre site professionnel en <span className="text-indigoGlow">5 jours</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-slate-300"
        >
          Une agence produit-first qui conçoit et développe des expériences digitales rapides, élégantes et mesurables.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            className="inline-flex items-center justify-center rounded-full bg-indigoGlow px-8 py-3 text-base font-semibold text-white shadow-card transition hover:bg-indigo-500"
            href={ctaHref}
          >
            Commander mon site maintenant
          </a>
          <a
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            href="#portfolio"
          >
            Voir nos réalisations
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
