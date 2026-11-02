---
title: Calcolo del Minimo con Lettura dei Dati
description: Esercizio guidato - leggere un array da un campo di testo e trovare il minimo, analizzando gli errori passo dopo passo.
sidebar:
  order: 1
---

## Consegna

Riprendendo la ricerca del minimo, inserire un campo di lettura per i valori dell'array e un bottone che faccia partire il calcolo e la visualizzazione.

La struttura della pagina è questa:

```html
<h2>Cerca il valore più piccolo in un array</h2>
<p>Inserire i dati da ordinare separati da ','</p>
<p><input type="text" id="in" value="12,4,71,2,45"></p>
<p><button id="go">Go!</button></p>
<p>Array: <span id="array"></span></p>
<p>Il valore minimo è: <span id="minVal"></span></p>
```

La funzione del minimo è sempre la stessa:

```javascript
function calcolaMinimo(array) {
    let minimo = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] < minimo) {
            minimo = array[i];
        }
    }
    return minimo;
}

const test = document.getElementById("go");
test.addEventListener("click", leggiRispondi);
```

L'esercizio è interessante perché la prima soluzione naturale non funziona, e ogni tentativo insegna qualcosa.

## Tentativo 1: Metto il Valore in un Array

```javascript
function leggiCalcolo() {
    const valori = document.getElementById("in").value;
    const array = [valori];
    document.getElementById("array").innerHTML = array;
    document.getElementById("minVal").innerHTML = calcolaMinimo(array);
}
```

**Risultato**: il minimo mostrato è `12,4,71,2,45`.

**Perché**: `value` restituisce **una sola stringa**. `[valori]` è un array di **un elemento**, che è tutta la stringa, e il minimo è quell'unico elemento.

## Tentativo 2: Separo i Valori

Si scorre la stringa carattere per carattere, accumulando in `temp` fino a una virgola.

```javascript
function leggiRispondi() {
    const valori = document.getElementById("in").value;
    let array = [];
    let temp = '';
    for (let i = 0; i < valori.length; i++) {
        if (valori[i] === ',') {
            array.push(temp);
            temp = '';
        } else {
            temp += valori[i];
        }
    }
    document.getElementById("array").innerHTML = array;
    document.getElementById("minVal").innerHTML = calcolaMinimo(array);
}
```

**Risultato**: l'array è `12,4,71,2`, e il minimo è `12`. Ci sono due errori:

1. **L'ultimo numero non viene letto**: `45` non è seguito da una virgola, quindi non viene mai aggiunto.
2. **Il minimo è sbagliato**: gli elementi sono **stringhe**, che si confrontano in ordine alfabetico, carattere per carattere. `"12"` viene prima di `"2"`, perché `"1"` viene prima di `"2"`.

## Tentativo 3: Gestisco l'Ultimo Elemento

```javascript
for (let i = 0; i < valori.length; i++) {
    if (valori[i] === ',') {
        array.push(temp);
        temp = '';
    } else {
        temp += valori[i];
        if (i === valori.length - 1) {
            array.push(temp);
        }
    }
}
```

**Risultato**: l'array è completo, ma il minimo è ancora `12`.

## Soluzione: Converto in Numeri

```javascript
function leggiRispondi() {
    const valori = document.getElementById("in").value;
    let array = [];
    let temp = '';
    for (let i = 0; i < valori.length; i++) {
        if (valori[i] === ',') {
            array.push(Number(temp));
            temp = '';
        } else {
            temp += valori[i];
            if (i === valori.length - 1) {
                array.push(Number(temp));
            }
        }
    }
    document.getElementById("array").innerHTML = array;
    document.getElementById("minVal").innerHTML = calcolaMinimo(array);
}
```

**Risultato**: il minimo è `2`.

:::tip[La lezione dell'esercizio]
Ogni errore viene da aver dimenticato che **i dati letti da HTML sono testo**: una stringa non è un array, e una stringa non è un numero. Vedi [Lettura e Scrittura dei Dati](../../teoria/06-lettura-e-scrittura-dati/).
:::

## Versione con slice

Una versione alternativa evita la variabile temporanea, e usa le posizioni per estrarre i pezzi:

```javascript
function leggiRispondi() {
    const valori = document.getElementById("in").value;
    const array = [];
    let previous = 0;
    for (let current = 0; current < valori.length; current++) {
        if (valori[current] === ";") {
            array.push(parseInt(valori.slice(previous, current)));
            previous = current + 1;
        } else if (current === valori.length - 1) {
            array.push(parseInt(valori.slice(previous)));
        }
    }
    document.getElementById("array").innerHTML = array;
    document.getElementById("minVal").innerHTML = calcolaMinimo(array);
}
```

Funziona sia con `12;4;71;2;45;` sia con `12;4;71;2;45`, con o senza separatore finale.

:::note[Il modo più compatto]
Con gli strumenti della [Parte IV](../../teoria/05-stringhe-array-e-oggetti/) tutto si riduce a due righe:

```javascript
const array = valori.split(",").map(Number);
const minimo = array.reduce((min, value) => (value < min ? value : min));
```
:::

## Esercizi Aggiuntivi

**1.** Ordinare l'array in senso crescente, creando un nuovo array `valoriOrdinati` e mostrando entrambi.

<details>
<summary>Soluzione</summary>

```javascript
const valoriOrdinati = [...valori].sort((a, b) => a - b);
```

La funzione di confronto è necessaria, perché `sort` senza parametri ordina come stringhe. `[...valori]` crea una copia, dato che `sort` modifica l'array.

</details>

**2.** Far scegliere all'utente l'ordine crescente o decrescente.

<details>
<summary>Soluzione</summary>

Si passa una funzione di confronto diversa:

```javascript
function confronto(crescente) {
    return crescente ? (a, b) => a - b : (a, b) => b - a;
}
const ordinati = [...valori].sort(confronto(scelta));
```

</details>

**3.** Che cosa succede se l'utente inserisce un valore non numerico, come `12,abc,3`?

<details>
<summary>Soluzione</summary>

`Number("abc")` vale `NaN`, e ogni confronto con `NaN` è falso: se fosse il primo elemento il minimo resterebbe `NaN`. Andrebbe controllato con `Number.isNaN`.

</details>
