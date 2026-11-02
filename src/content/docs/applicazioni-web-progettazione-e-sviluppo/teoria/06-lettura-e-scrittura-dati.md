---
title: Lettura e Scrittura dei Dati
description: Approfondimento su acquisizione e visualizzazione dei dati, conversione da testo a numeri, array di numeri e di oggetti.
sidebar:
  order: 6
---

## Il Concetto Chiave: in HTML È Tutto Testo

:::tip[La regola]
I dati scritti in HTML e letti da HTML sono **solo testo**. I numeri vanno **convertiti** quando vengono letti, e tag e contenuti devono diventare **testo** quando vengono scritti.
:::

Lo schema è questo:

| Direzione | Cosa succede |
| --- | --- |
| Da JavaScript a HTML | Tag e valori diventano stringhe, e il browser le interpreta |
| Da HTML a JavaScript | Si riceve una stringa, da convertire se serve un numero |

Ad esempio, anche il tag è testo:

```javascript
document.getElementById("demo").innerHTML = "<h1>Hello world!</h1>";
```

## Esempio: Array di Numeri

La pagina contiene `<p id="leggo">70,1,12,3,24,5,67,7,8,99</p>`. La lettura restituisce **una sola stringa**, non dieci numeri: bisogna separare i valori tra le virgole.

### Versione 1: Senza Conversione

```javascript
const datiLetti = document.getElementById("leggo").innerHTML;
const arrayLetto = [];
let start = 0;

for (let i = 0; i <= datiLetti.length; i++) {
    if (datiLetti[i] === ',' || i === datiLetti.length) {
        let nuovoValore = datiLetti.slice(start, i);
        arrayLetto.push(nuovoValore);
        start = i + 1;
    }
}
```

Il ciclo cerca le virgole, e usa `start` per ricordare dove inizia il valore corrente. La condizione `i <= datiLetti.length` serve per l'ultimo valore, che non ha virgola dopo.

L'array viene visualizzato correttamente, ma la somma è sbagliata:

```javascript
let somma = 0;
for (let i = 0; i < arrayLetto.length; i++) {
    somma += arrayLetto[i];
}
// somma = "0701123245677899"
```

Gli elementi sono **stringhe**, quindi `+` concatena invece di sommare.

### Versione 2: Con Conversione

Basta convertire ogni valore:

```javascript
let nuovoValore = Number(datiLetti.slice(start, i));
```

Ora `arrayLetto` contiene numeri, e la somma vale `296`.

| Funzione | `"12"` | `"12abc"` | `""` |
| --- | --- | --- | --- |
| `Number(x)` | `12` | `NaN` | `0` |
| `parseInt(x)` | `12` | `12` | `NaN` |

`Number` converte l'intera stringa, `parseInt` legge finché trova cifre.

:::note[Visualizzare in colonna]
Per andare a capo si costruisce una stringa con `<br>`, che è un tag, quindi testo:

```javascript
let colonna = "";
for (let i = 0; i < arrayLetto.length; i++) {
    colonna += "posizione " + i + " -> " + arrayLetto[i] + "<br>";
}
document.getElementById("colonna").innerHTML = colonna;
```
:::

## Esempio: Array di Oggetti

**Consegna**: leggere elenchi di nomi e anni, e creare un array di oggetti `{nome, annoDiNascita}`.

```html
<p>Anni da leggere: <span id="anni">2002,1998,2015</span></p>
<p>Nomi da leggere: <span id="nomi">Mario,Sara,Elena</span></p>
```

Questa volta si usa `split`, che fa in un'istruzione ciò che prima richiedeva il ciclo:

```javascript
function creaArrayOggetti() {
    const anni = document.getElementById("anni").innerText;
    const nomi = document.getElementById("nomi").innerText;
    const arrayAnni = anni.split(",");
    const arrayNomi = nomi.split(",");

    const arrayLetto = [];
    for (let i = 0; i < arrayNomi.length; i++) {
        const oggetto = {
            nome: arrayNomi[i],
            annoDiNascita: parseInt(arrayAnni[i])
        };
        arrayLetto.push(oggetto);
    }
    return arrayLetto;
}
```

Provando a stampare direttamente l'array di oggetti, il risultato è:

```text
[object Object],[object Object],[object Object]
```

Il browser converte ogni elemento in stringa, e un oggetto non ha una rappresentazione utile. Un array di **numeri** si stampa bene, uno di **oggetti** no. Bisogna visualizzare **ogni singolo valore**:

```javascript
function visualizzaColonna() {
    const arrayLetto = creaArrayOggetti();
    let output = "";
    for (let i = 0; i < arrayLetto.length; i++) {
        output += arrayLetto[i].nome + ", " + arrayLetto[i].annoDiNascita + "<br>";
    }
    document.getElementById("colonna").innerHTML = output;
}
```

:::note[Complemento]
Per il debug o per scambiare dati, `JSON.stringify(arrayLetto)` trasforma l'array di oggetti in una stringa leggibile.
:::

## Autotest

**1.** Che cosa produce `"5" + 3`? E `"5" - 3`?

<details>
<summary>Soluzione</summary>

`"53"`, perché `+` concatena se c'è una stringa, e `2`, perché `-` converte in numeri.

</details>

**2.** Perché la somma della versione 1 è sbagliata?

<details>
<summary>Soluzione</summary>

Perché gli elementi dell'array sono stringhe e `+` le concatena.

</details>

**3.** Che differenza c'è tra `Number("12abc")` e `parseInt("12abc")`?

<details>
<summary>Soluzione</summary>

`Number` restituisce `NaN`, `parseInt` restituisce `12`, fermandosi al primo carattere non numerico.

</details>

**4.** Perché il ciclo della versione 1 usa `i <= datiLetti.length`?

<details>
<summary>Soluzione</summary>

Per gestire l'ultimo valore, che non è seguito da una virgola: quando `i` arriva alla lunghezza, la condizione `i === datiLetti.length` lo cattura.

</details>

**5.** Perché stampando un array di oggetti compare `[object Object]`?

<details>
<summary>Soluzione</summary>

Perché ogni oggetto viene convertito in stringa con la rappresentazione predefinita. Bisogna stampare le singole proprietà.

</details>

**6.** Riscrivi la lettura dei numeri con `split` e `map`.

<details>
<summary>Soluzione</summary>

```javascript
const arrayLetto = datiLetti.split(",").map(Number);
```

</details>

## Glossario

- **`Number`** - Converte un'intera stringa in numero.
- **`parseInt`** - Legge un intero dall'inizio di una stringa.
- **`NaN`** - *Not a Number*, risultato di una conversione non riuscita.
- **`split`** - Divide una stringa in un array.
- **Concatenazione** - Unione di stringhe con `+`.
- **`innerText`** - Testo visibile di un elemento.
