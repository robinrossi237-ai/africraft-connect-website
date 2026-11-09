# Africraft Connect — site public

Site vitrine (React 18 + Vite), en français et en anglais, thème clair et sombre.

## Lancer

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # site prêt à publier dans dist/
```

## Avant la mise en ligne

Remplir `src/config.js` :

- `androidUrl` : lien de téléchargement Android (APK ou Google Play). Vide : « bientôt disponible ».
- `contactEmail`, `whatsappNumber` : contact de l'équipe. Vides : la colonne Contact est cachée.
- `PRICES` : les prix affichés (les mêmes que dans l'app).

Les textes sont dans `src/i18n.js`, les captures d'écran de l'app dans `public/screens/fr` et `public/screens/en`.
