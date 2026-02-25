# FRONTEND

## PAGE D'ACCUEIL

- Creation page principale index
- Creation hyper-lien sur d'autres pages html (register, top games, team, historique)
- Creation lien jeu (PLAY)
- Fichier en html et style en CSS


## PAGE REGISTER

- LOGIN, EMAIL, PASSWORD, CONFIRM PASSWORD
- Sign up 
- *Emplacement* Message erreur

## DESIGN SYSTEM + TAILWIND (Static HTML)

### Setup

```bash
cd frontend
npm init -y
npm install -D tailwindcss postcss autoprefixer postcss-import
npx tailwindcss init -p
```

### Scripts

```bash
npm run dev
npm run build
```

### Build command

```bash
npx tailwindcss -i ./src/styles/tailwind.css -o ./assets/styles.css --minify
```

### Reusable components (10)

1. `btn` (+ variants/sizes/loading/disabled)
2. `card` / `card--glass`
3. `input` / `input--error` + field label/helper
4. `badge` variants
5. `modal` + overlay/content
6. `toast` variants
7. `tabs` (tablist/tab/active)
8. `dropdown`/select
9. `spinner`
10. `list-row` (leaderboard/history rows)
