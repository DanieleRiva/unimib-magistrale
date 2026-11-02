---
title: JavaScript nella Pagina Web
description: Inserire JavaScript in HTML, output con console, innerHTML, alert e document.write, input da tag e form.
sidebar:
  order: 2
---

## JavaScript e HTML

Una pagina web ha due mondi: **HTML** contiene il contenuto, l'interfaccia e lo spazio di input e output, **JavaScript** contiene il codice dentro al tag `<script>`.

```html
<!DOCTYPE html>
<html>
<body>
    <!-- contenuto, interfaccia, input e output -->
    <script>
        // codice JavaScript
    </script>
</body>
</html>
```

Lo script si potrebbe mettere nell'`head`, ma è buona pratica metterlo **alla fine del `body`**: la pagina viene elaborata in sequenza, e uno script in testa cercherebbe elementi non ancora creati.

Restano due domande: come si visualizzano i risultati, e come comunicano HTML e JavaScript?

## Output

JavaScript **non ha funzioni di stampa** integrate, ma può "mostrare" dati in quattro modi:

| Metodo | Effetto | Uso |
| --- | --- | --- |
| `console.log()` | Scrive nella console del browser | Debug |
| `elemento.innerHTML` | **Sostituisce il contenuto** di un elemento con un identificatore | Il modo normale |
| `window.alert()` | Apre una finestra con il testo | Avvisi |
| `document.write()` | A pagina caricata **sostituisce l'intera pagina**. Durante il caricamento scrive nel punto in cui si trova lo script | Da evitare |

Il metodo fondamentale è `innerHTML`, che collega i due mondi tramite l'attributo `id`:

```html
<p>Posso bere? <span id="demo"></span></p>
<script>
    let age = 35;
    let drinkAlcohol = false;
    if (age >= 18) {
        drinkAlcohol = true;
    }
    document.getElementById("demo").innerHTML = drinkAlcohol;
</script>
```

`document.getElementById("demo")` restituisce l'elemento con quell'`id`. Il tag `<span>` è comodo perché è un contenitore inline, senza effetti sul testo.

:::caution[Slide 4]
La slide scrive `Console.log`, con la maiuscola. JavaScript distingue maiuscole e minuscole: il nome corretto è `console.log`.
:::

## Input

Come si scrive in un elemento, così se ne può **leggere** il contenuto. La proprietà dipende dal tipo di elemento:

| Elemento | Proprietà | Esempio |
| --- | --- | --- |
| Tag con testo (`<span>`, `<p>`) | `textContent` | `document.getElementById("in").textContent` |
| Campo di input | `value` | `document.getElementById("in").value` |

```html
<p>Testo da leggere: <input type="text" id="in" value="Hello World!"></p>
<p>Testo letto: <span id="out"></span></p>
<script>
    document.getElementById("out").innerHTML = document.getElementById("in").value;
</script>
```

Questo codice ha però un problema: lo script gira **subito**, al caricamento, quindi l'utente non ha tempo di scrivere nulla. Come si può avviare il programma su richiesta? La risposta sono gli [eventi](../03-funzioni-ed-eventi/).

## Esercizio Svolto: le Date di Nascita

**Consegna**: invece delle età si conoscono gli anni di nascita. Come cambia il programma?

```javascript
let birthYear = [2003, 1983, 1990, 2000];
let thisYear = 2018;
let drinkAlcohol = [false, false, false, false];  // valore conservativo

for (let i = 0; i < birthYear.length; i++) {
    if (thisYear - birthYear[i] >= 18) {
        drinkAlcohol[i] = true;                   // cambio solo quando serve
    }
}
```

Assegnare all'inizio un valore **conservativo** è una tecnica utile: si modifica il valore solo nei casi che lo richiedono.

## Esercizio Svolto: il Minimo di un Array

**Consegna**: dato un array di interi non ordinato, trovare il valore più piccolo. È l'esercizio guida della parte di programmazione, e insegna il metodo di lavoro:

1. Scrivere **a parole** l'algoritmo.
2. Individuare le **variabili** principali.
3. Tradurre in **codice**.
4. Inserire il codice in una **pagina HTML**.

L'algoritmo a parole è:

1. Considero il primo elemento come minimo provvisorio.
2. Lo confronto con il secondo: se questo è più piccolo, diventa il nuovo minimo.
3. Continuo così con gli elementi rimanenti.
4. Mi fermo alla fine dell'array.

Il codice:

```html
<h2>Cerca il valore minimo in un array</h2>
<p>Array: <span id="array"></span></p>
<p>Valore minimo: <span id="minVal"></span></p>
<script>
    const array = [15, 35, 21, 8, 43, 67, 5];
    let minimo = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] < minimo) {
            minimo = array[i];
        }
    }
    document.getElementById("array").innerHTML = array;
    document.getElementById("minVal").innerHTML = minimo;
</script>
```

Il ciclo parte da 1 perché `array[0]` è già il minimo provvisorio. Le versioni complete dell'esercizio sono nella pagina sul [calcolo del minimo](../../esercizi/01-calcolo-del-minimo/).

## Autotest

**1.** Perché conviene mettere lo script alla fine del `body`?

<details>
<summary>Soluzione</summary>

Perché la pagina viene elaborata in sequenza: uno script in testa cercherebbe elementi non ancora creati.

</details>

**2.** Quali sono i quattro modi di visualizzare dati, e quale evitare?

<details>
<summary>Soluzione</summary>

`console.log`, `innerHTML`, `window.alert`, `document.write`. Va evitato `document.write`, perché a pagina caricata sostituisce l'intero contenuto.

</details>

**3.** Come leggi il testo inserito in un `<input>`? E quello in uno `<span>`?

<details>
<summary>Soluzione</summary>

Con `.value` per l'input, con `.textContent` per lo span.

</details>

**4.** Qual è il problema di leggere un campo di input direttamente nello script?

<details>
<summary>Soluzione</summary>

Lo script viene eseguito al caricamento della pagina, prima che l'utente possa scrivere. Serve un evento, ad esempio il clic su un bottone.

</details>

**5.** Perché il ciclo del minimo parte da `i = 1`?

<details>
<summary>Soluzione</summary>

Perché `array[0]` è già stato preso come minimo provvisorio: confrontarlo con se stesso sarebbe inutile.

</details>

## Glossario

- **`<script>`** - Tag che contiene il codice JavaScript.
- **`id`** - Attributo che identifica un elemento HTML.
- **`getElementById`** - Funzione che restituisce l'elemento con un dato `id`.
- **`innerHTML`** - Proprietà con il contenuto HTML di un elemento.
- **`textContent`** - Proprietà con il testo di un elemento.
- **`value`** - Proprietà con il valore di un campo di input.
- **`<span>`** - Contenitore inline.
