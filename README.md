# Improvisator

A phone web app that draws a random improv character before you go on stage:

- a **job or hobby** (blue)
- a **physical trait** (orange)
- an **emotion** (pink)
- a **relationship** with the other actor (green)

French by default, with an EN switch. Tap **Relancer** to draw a new character, or tap one card to change only that card.
After the first visit it works offline, and you can add it to your home screen like an app.

## Editing the values

All values live in [`valeurs.txt`](valeurs.txt):

```
[METIER]
# comment lines start with #
Mécanicien·ne | Mechanic
```

- `[METIER]`, `[PHYSIQUE]`, `[EMOTION]` and `[RELATION]` start each section.
- Write one value per line as `français | English`. If the English part is missing, the app shows the French in both languages.
- Lines starting with `#` and blank lines are ignored.

Edit the file (directly on github.com works), commit, and the site updates within about a minute. Phones that already have the app pick up the change the next time they open it with a connection.

## Files

| File | Role |
|---|---|
| `index.html` | The whole app (layout, styles, script) |
| `valeurs.txt` | The value lists, in French and English |
| `sw.js` | Service worker that caches the app for offline use |
| `manifest.webmanifest`, `icons/` | Home-screen install (name, colours, icons) |

## Running locally

The app loads `valeurs.txt` with `fetch`, so it needs a web server; opening `index.html` from disk won't work. For example:

```
npx serve .
```

## Publishing on GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then branch `main` and folder `/ (root)`.
3. The site appears at `https://<your-user>.github.io/<repo-name>/`.
