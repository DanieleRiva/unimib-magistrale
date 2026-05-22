# UNIMIB Magistrale - Appunti

Libreria di appunti e materiale dei corsi della magistrale in Informatica all'UNIMIB.

Realizzata con [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

## Aggiungere un nuovo corso

1. Crea la cartella `src/content/docs/<slug-corso>/` (es. `src/content/docs/reti/`).
2. Aggiungi una riga all'array `corsi` in `astro.config.mjs`:
   ```js
   { label: 'Nome Mostrato', dir: 'slug-corso' },
   ```
3. Crea un `index.md` come pagina di copertina del corso (opzionale ma consigliato) e scrivi gli `.md` delle lezioni.
4. La sidebar si autogenera dalla cartella - niente altro da configurare.

## Comandi

| Comando            | Cosa fa                                       |
| ------------------ | --------------------------------------------- |
| `pnpm install`     | Installa le dipendenze                        |
| `pnpm dev`         | Avvia il dev server su `localhost:4321`       |
| `pnpm build`       | Builda il sito statico in `./dist/`           |
| `pnpm preview`     | Anteprima del sito buildato                   |

## Deploy

Push su `master` → GitHub Actions builda e pubblica su GitHub Pages
(vedi `.github/workflows/deploy.yml`).
