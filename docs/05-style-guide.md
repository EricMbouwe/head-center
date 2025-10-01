# Guide de style & charte graphique

## Pourquoi ?
Assurer une cohérence visuelle premium inspirée de la référence fournie.

## Comment ?
- **Couleurs principales** :
  - Midnight `#0C1231`
  - Indigo Glow `#4D5DFB`
  - Cyan Aura `#5CE1E6`
  - Sunset `#FF6B6B`
- **Typographies** :
  - Titres : Space Grotesk (poids 500-700)
  - Corps : Plus Jakarta Sans (poids 400-600)
- **Effets** :
  - Ombres douces (`shadow-card`), fonds blur (`backdrop-blur`).
  - Dégradés radiaux (cf. `bg-hero`).
- **Composants** :
  - Boutons CTA arrondis, contrastés.
  - Cartes portfolio et blog en `bg-white/5` avec `border-white/5`.

## Accessibilité & Performance
- Contraste élevé (texte blanc sur midnight).
- Animations via `framer-motion` avec préférences réduites à ajouter.
- Images optimisées (Astro `<Image>` à utiliser lors de l’intégration réelle).
