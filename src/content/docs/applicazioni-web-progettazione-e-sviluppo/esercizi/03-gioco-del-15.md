---
title: Il Gioco del 15
description: Assegnamento - realizzare il gioco del 15 con bottoni in una tabella, generazione di sequenze risolvibili e conteggio delle inversioni.
sidebar:
  order: 3
---

## Consegna

Progettare e realizzare il gioco del 15: 15 tessere numerate in una griglia 4x4, con uno spazio vuoto. Cliccando una tessera vicina allo spazio la si sposta, fino a riordinarle.

:::note[Assegnamento]
Il materiale del corso contiene la consegna e il programma di partenza, ma non una soluzione. Questa pagina riporta la traccia, chiarisce i passaggi e propone una possibile soluzione del passo centrale.
:::

## L'Idea di Fondo

- Le tessere sono **bottoni** dentro a una `<table>`, e le dimensioni quadrate danno l'effetto tessera.
- Le **label** dei bottoni sono da `"1"` a `"15"`, più uno spazio `" "`.
- `style.visibility = 'hidden'` o `'visible'` crea lo spazio vuoto.
- **Non si spostano le tessere**: si scambiano le **label** e la visibilità.
- Ogni bottone ha un `id` da 0 a 15, per iterare su tutti.
- Ogni bottone ha un `name` `"rc"` con riga e colonna, per capire chi sono i vicini.

| | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| **0** | 00 | 01 | 02 | 03 |
| **1** | 10 | 11 | 12 | 13 |
| **2** | 20 | 21 | 22 | 23 |
| **3** | 30 | 31 | 32 | 33 |

## Sviluppo per Passi

1. Disegnare e popolare la tabella con JavaScript.
2. Assegnare un listener `click` a ogni bottone. Se accanto c'è la label `" "`, scambiare label e visibilità.
3. Assegnare al bottone *New Game* una funzione `init()`, che genera una sequenza casuale.
4. Aggiungere il contatore di mosse.

### Passo 1: la Tabella

Il programma di partenza genera l'HTML con due cicli annidati.

```javascript
let label = 0;
let board = '<table>';
for (let i = 0; i < 4; i++) {
    board += '<tr>';
    for (let j = 0; j < 4; j++) {
        const buttonName = '' + i + j;
        board += '<td><button class="tile" id="' + label + '" name="' + buttonName + '">'
              + (label + 1) + '</button></td>';
        label++;
    }
    board += '</tr>';
}
board += '</table>';
document.getElementById("board").innerHTML = board;
document.getElementById("15").innerHTML = ' ';               // etichetta della 16a tessera
document.getElementById("15").style.visibility = 'hidden';   // nasconde la 16a tessera
```

Ho semplificato il calcolo di `buttonName` rispetto alla slide, che usa un operatore ternario dentro a un `if` per aggiungere lo zero iniziale.

:::note[Il CSS]
```css
table { border: 3px solid black; }
.tile { width: 35px; height: 35px; }
```
:::

### Passo 2: lo Spostamento

Una possibile soluzione: dai `name` si ricavano riga e colonna, e si guarda se uno dei quattro vicini è vuoto.

```javascript
function clickTile(event) {
    const tile = event.target;
    const r = Number(tile.name[0]);
    const c = Number(tile.name[1]);
    const vicini = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];

    for (const [vr, vc] of vicini) {
        const vicino = document.getElementsByName('' + vr + vc)[0];
        if (vicino && vicino.innerHTML === ' ') {
            vicino.innerHTML = tile.innerHTML;
            vicino.style.visibility = 'visible';
            tile.innerHTML = ' ';
            tile.style.visibility = 'hidden';
            mosse++;
            document.getElementById("moves").innerHTML = mosse;
            return;
        }
    }
}

let mosse = 0;
for (const tile of document.getElementsByClassName("tile")) {
    tile.addEventListener("click", clickTile);
}
```

`event.target` è il bottone cliccato. Fuori dalla griglia `getElementsByName` non trova nulla, e `vicino` è `undefined`: il controllo `vicino &&` gestisce i bordi.

### Passo 3: Generare una Sequenza

Un numero intero casuale tra 1 e 15 si ottiene con:

```javascript
const maxValue = 15;
let temp = Math.trunc(Math.random() * maxValue + 1);
```

Ma **non tutte le sequenze sono risolvibili**.

## La Risolvibilità

Una coppia di tessere forma un'**inversione** se i loro valori sono in ordine inverso rispetto alla posizione nella soluzione.

:::tip[La regola]
Una sequenza di 15 numeri, con il 16° posto vuoto, è risolvibile se il **numero di inversioni è pari**.
:::

| Sequenza | Inversioni | Risolvibile |
| --- | --- | --- |
| `2 1 3 4 5 6 7 8 9 10 11 12 13 14 15 X` | 1 | No |
| `2 5 9 13 12 7 4 6 15 8 11 1 10 14 3 X` | 48 | Sì |

```javascript
function isSolvable(game) {
    let inversionCount = 0;
    for (let i = 0; i < game.length - 1; i++) {
        for (let j = i + 1; j < game.length; j++) {
            if (game[i] > game[j]) inversionCount++;
        }
    }
    return inversionCount % 2 === 0;
}
```

La regola vale con lo spazio vuoto **nell'ultima posizione**, com'è qui.

Per generare una sequenza valida, una possibile `init` mescola e controlla:

```javascript
function init() {
    let game;
    do {
        game = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        for (let i = game.length - 1; i > 0; i--) {
            const j = Math.trunc(Math.random() * (i + 1));
            [game[i], game[j]] = [game[j], game[i]];
        }
    } while (!isSolvable(game));

    for (let id = 0; id < 15; id++) {
        const tile = document.getElementById('' + id);
        tile.innerHTML = game[id];
        tile.style.visibility = 'visible';
    }
    document.getElementById("15").innerHTML = ' ';
    document.getElementById("15").style.visibility = 'hidden';
    mosse = 0;
    document.getElementById("moves").innerHTML = mosse;
}
```

Il mescolamento evita i duplicati, che si avrebbero estraendo ogni numero a caso. In un caso su due la sequenza è risolvibile, quindi bastano pochi tentativi.

## Esercizi Aggiuntivi

**1.** Controllare la vittoria dopo ogni mossa.

<details>
<summary>Soluzione</summary>

Basta verificare che ogni bottone abbia la label giusta:

```javascript
function haiVinto() {
    for (let id = 0; id < 15; id++) {
        if (document.getElementById('' + id).innerHTML !== String(id + 1)) {
            return false;
        }
    }
    return true;
}
```

</details>

**2.** Quante inversioni ci sono in `3 1 2`?

<details>
<summary>Soluzione</summary>

Due: `(3, 1)` e `(3, 2)`.

</details>
