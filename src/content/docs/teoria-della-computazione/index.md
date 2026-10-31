---
title: Teoria della Computazione
description: Appunti e materiale del corso di Teoria della Computazione - Magistrale UNIMIB.
---

Appunti del corso di **Teoria della Computazione** (*Modelli e Computazione*, codice F1801Q132) della magistrale in Informatica all'UNIMIB, A.A. 2026/2027. Docente: **Paola Bonizzoni**.

:::tip
Naviga le lezioni dalla **sidebar**.
:::

## Prima Parte: Pattern Matching

La prima parte del corso riguarda il **pattern matching su stringhe**: trovare le occorrenze di un pattern $P$ di lunghezza $m$ dentro un testo $T$ di lunghezza $n$.

| Lezione | Argomento | Risultato principale |
| --- | --- | --- |
| [1. Introduzione](./teoria/01-introduzione-al-pattern-matching/) | Definizioni, algoritmi banali, distanza di edit | Ricerca esatta $\mathcal{O}(nm)$, approssimata $\mathcal{O}(knm^2)$ |
| [2. ASF (Parte I)](./teoria/02-ricerca-esatta-con-asf-parte-1/) | Automi, bordo, funzione di transizione | Definizione di $\delta$ tramite i bordi |
| [3. ASF (Parte II)](./teoria/03-ricerca-esatta-con-asf-parte-2/) | Ricerca nel testo, significato degli stati | Ricerca $\Theta(n)$ con tabella $\Theta(m \lvert \Sigma \rvert)$ |
| [4. KMP](./teoria/04-algoritmo-kmp/) | Prefix function, regole di spostamento | Ricerca $\Theta(n)$ con pre-processing $\Theta(m)$ |
| [5. Bordi e costruzione](./teoria/05-bordi-e-costruzione-dell-automa/) | Definizione induttiva, algoritmi per $\pi$ e $\delta$ | Calcolo di $\pi$ in $\Theta(m)$ e di $\delta$ in $\Theta(m \lvert \Sigma \rvert)$ |

## Come Sono Organizzati gli Appunti

Ogni lezione segue le slide, con spiegazioni ed esempi svolti, e si chiude con un **Autotest** con soluzioni e un **Glossario**. La lezione 5 contiene anche il **riepilogo** di formule e complessità.

- I riquadri **Complemento** contengono materiale che **non è nelle slide** (dimostrazioni, l'algoritmo per la distanza di edit), utile per capire ma da verificare con il programma d'esame.
- I riquadri di attenzione intitolati **Slide N** segnalano i punti in cui le slide contengono un errore o un'imprecisione.

## Correzioni Rispetto alle Slide

Tabelle, esempi e algoritmi delle slide sono stati ricontrollati con un'implementazione di prova. Questi sono i punti che non tornano:

| Dove | Cosa dice la slide | Correzione |
| --- | --- | --- |
| Lezione 1, slide 12 | `while P[j] = T[i+j-1] and j ≤ m` | La condizione $j \le m$ va valutata per prima |
| Lezione 1, slide 14 | Secondo esempio con $X_1 = X_2$ e 3 operazioni | È il risultato del primo esempio dopo le 3 operazioni |
| Lezione 1, slide 15 | $i = 7$ è un'occorrenza approssimata | **Errore**: le occorrenze sono $i = 3, 4, 5$ |
| Lezione 2, slide 7-8 | Stato di raccordo con $k < i$ | Vale $k \le j$, come nella slide 10 |
| Lezione 4, slide 11 | Dopo un'occorrenza si legge $P[m+1]$ | Serve la convenzione che $P[m+1]$ non sia in $\Sigma$ |
| Lezione 5, slide 2 | $\lvert B(xc) \rvert = \epsilon$ | $B(xc) = \varepsilon$ |
| Lezione 5, slide 8 | Pseudocodice interrotto alla riga 14 | Completato negli appunti |
| Lezione 5, slide 9 | $O(m \cdot \Sigma)$ | $O(m \cdot \lvert \Sigma \rvert)$ |
