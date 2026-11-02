---
title: Stringhe, Array e Oggetti
description: Metodi di stringhe e array, oggetti con metodi, classi predefinite, for/of e for/in, forEach, map, filter e reduce.
sidebar:
  order: 5
---

## Le Stringhe

Una stringa è una sequenza di zero o più caratteri tra virgolette, singole o doppie. La sua lunghezza è nella proprietà `length`, e l'operatore `+` le concatena. Sommando numero e stringa si ottiene una **stringa**.

```javascript
let carName = "Volvo XC60";
carName.length;               // 10
"John" + " " + "Doe";         // "John Doe"
"John" + 35;                  // "John35"
```

| Metodo | Effetto | Esempio |
| --- | --- | --- |
| `indexOf(x)` | Posizione della **prima** occorrenza, `-1` se assente | |
| `lastIndexOf(x)` | Posizione dell'**ultima** occorrenza | |
| `indexOf(x, p)` | Cerca a partire dalla posizione `p` | |
| `startsWith(x, p)` | Inizia con `x`? Opzionale: da `p` | `text.startsWith("world", 6)` |
| `endsWith(x, n)` | Termina con `x`? Opzionale: nei primi `n` caratteri | `text.endsWith("world", 11)` |
| `slice(a, b)` | Estrae da `a` a `b` **escluso**. Senza `b`, fino alla fine | |
| `split(sep)` | Divide in un array in base al separatore | `"1,2".split(",")` |

```javascript
const str = "Please locate where 'locate' occurs!";
str.indexOf("locate");        // 7
str.lastIndexOf("locate");    // 21
str.indexOf("locate", 15);    // 21

const frutti = "Apple, Banana, Kiwi";
frutti.slice(7, 13);          // "Banana"
frutti.slice(7);              // "Banana, Kiwi"
```

Le posizioni partono da zero, e i confronti sono sensibili alle maiuscole: `text.startsWith("hello")` su `"Hello world"` è `false`.

## I Metodi degli Array

Tutti questi metodi **modificano l'array**, e funzionano anche su array `const`.

| Metodo | Effetto | Restituisce |
| --- | --- | --- |
| `push(x)` | Aggiunge in **fondo** | La nuova lunghezza |
| `pop()` | Toglie dal **fondo** | L'elemento tolto |
| `shift()` | Toglie dalla **testa** | L'elemento tolto |
| `unshift(x)` | Aggiunge in **testa** | La nuova lunghezza |
| `splice(p, n, ...nuovi)` | Dalla posizione `p` toglie `n` elementi e inserisce i nuovi | L'array degli elementi tolti |

```javascript
const fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.splice(2, 0, "Lemon", "Kiwi");
// ["Banana", "Orange", "Lemon", "Kiwi", "Apple", "Mango"]
```

:::caution[Slide 6-7: gli esempi non vanno letti in sequenza]
Nelle slide ogni esempio va inteso a partire dall'array originale. Eseguiti uno dopo l'altro darebbero altri risultati:

- `fruits.pop(); let y = fruits.pop();`: la prima `pop` toglie già `"Lemon"`, quindi `y` vale `"Mango"`.
- `fruits.shift(); let z = fruits.shift();`: allo stesso modo `z` vale `"Orange"`.
- `splice(2, 2, "Lemon", "Kiwi")` restituisce `["Apple", "Mango"]` solo se applicata all'array iniziale.

I commenti dicono inoltre "the value of x" anche quando la variabile è `y` o `z`.
:::

## Gli Oggetti

Un **oggetto** memorizza le proprietà, coppie nome-valore, di un'entità reale o virtuale.

```javascript
let car = {type: "Fiat", model: "500", color: "white"};
car.model;       // "500"
car["model"];    // "500"
```

:::caution[Slide 9]
La slide scrive `car[model]` senza virgolette: JavaScript cercherebbe una **variabile** `model`, dando un errore. Serve `car["model"]`.
:::

Una proprietà può essere una **funzione**, cioè un metodo. Dentro al metodo, `this` indica l'oggetto stesso.

```javascript
let person = {
    firstName: "Anna",
    lastName: "Brown",
    fullName: function () { return this.firstName + " " + this.lastName; }
};
person.fullName();   // "Anna Brown"
```

Le parentesi sono obbligatorie: `person.fullName` è la funzione, `person.fullName()` è il suo risultato. La nota della slide 9, secondo cui la proprietà assume il valore restituito, va intesa così: la proprietà contiene la funzione, il valore arriva chiamandola.

## Classi e Oggetti Predefiniti

ES6 ha introdotto le **classi**, prototipi per dichiarare più oggetti dello stesso tipo. Per ora basta saper usare quelle predefinite. La creazione avviene con **`new`**, e per convenzione i nomi delle classi iniziano con la maiuscola.

```javascript
new Date();                              // ora corrente
new Date(year, month, day, hours, minutes, seconds, milliseconds);
new Date(milliseconds);
new Date("2024-03-01");

new Date().getFullYear();                // anno corrente
```

Tutti i valori in JavaScript sono oggetti, tranne quelli dei **tipi primitivi**: `string`, `number`, `boolean`, `null` e `undefined`. Un array è un oggetto di tipo `Array`.

:::caution[Slide 10: una data non è un anno]
Nello *step 5* la slide scrive `let this_year = new Date()` e poi sottrae l'anno di nascita. Il risultato non è un'età, ma un numero enorme, perché una data viene convertita in millisecondi. Serve `new Date().getFullYear()`.
:::

## Scorrere Array e Oggetti

ES6 offre forme compatte del `for`:

| Forma | Su cosa itera | `x` contiene |
| --- | --- | --- |
| `for (let x of array)` | Strutture iterabili: array, stringhe | Il **valore** |
| `for (let x in oggetto)` | Proprietà di un oggetto | La **chiave** |

```javascript
const numbers = [1, 2, 3, 4, 5, 6];
let sum = 0;
for (let x of numbers) {
    sum = sum + x;
}
// sum vale 21

const person = {fname: "John", lname: "Doe", age: 25};
let str = "";
for (let x in person) {
    str += x + ": " + person[x] + "<br>";
}
```

:::caution[Slide 13]
La slide dice che in entrambi gli esempi `x` contiene "il valore corrente dell'indice". È impreciso: con **`of`** `x` è il **valore**, con **`in`** è la **chiave**.
:::

### Esempio: una Tabella da Dati

Questo schema, generare HTML a partire dai dati, è quello tipico.

```javascript
const list = [
    {Name: "Alfreds Futterkiste", City: "Berlin", Country: "Germany"},
    {Name: "Berglunds snabbköp", City: "Luleå", Country: "Sweden"}
];

let out = "<table>";
for (let customer of list) {
    out += "<tr>";
    for (let field in customer) {
        out += "<td>" + customer[field] + "</td>";
    }
    out += "</tr>";
}
out += "</table>";
document.getElementById("id01").innerHTML = out;
```

Il secondo `for` rende il codice indipendente dai campi. La formattazione è nel CSS, ad esempio `table tr:nth-child(odd)` per colorare le righe alterne.

## I Metodi di Iterazione

Applicano una funzione di **callback** a ogni elemento. La callback riceve **valore, indice e array**, e gli ultimi due si possono omettere.

| Metodo | Scopo | Restituisce | Modifica l'originale |
| --- | --- | --- | --- |
| `forEach(f)` | Esegue `f` per ogni elemento | Nulla | No |
| `map(f)` | **Trasforma** ogni elemento | Nuovo array, stessa lunghezza | No |
| `filter(f)` | **Seleziona** gli elementi che passano il test | Nuovo array | No |
| `reduce(f, iniziale)` | **Riduce** l'array a un singolo valore | Un valore | No |

```javascript
const numbers = [45, 4, 9, 16, 25];

numbers.forEach((value) => console.log(value));

numbers.map((value) => value * 2);        // [90, 8, 18, 32, 50]
numbers.filter((value) => value > 18);    // [45, 25]
numbers.reduce((total, value) => total + value);        // 99
numbers.reduce((total, value) => total + value, 100);   // 199
```

`reduce` riceve in più, come **primo** parametro, il totale accumulato. Se manca il valore iniziale, si parte da `array[0]` e la funzione viene chiamata dal secondo elemento.

:::danger[Slide 25: esempio di reduce errato]
La slide calcola il minimo in questo modo:

```javascript
function calcolaMinimo(minVal, value, index, array) {
    if (index < array.length) {
        if (array[index + 1] < minVal) {
            return array[index + 1];
        }
    }
    return minVal;
}
array.reduce(calcolaMinimo);
```

**Il codice non funziona**: senza valore iniziale, `reduce` parte con `minVal = array[0]` e `index = 1`, quindi guarda subito `array[2]` e **non confronta mai il secondo elemento**. Con `[5, 1, 3]` restituisce `3` invece di `1`. Verificato eseguendolo.

La versione corretta usa il parametro `value`:

```javascript
const calcolaMinimo = (minVal, value) => (value < minVal ? value : minVal);
array.reduce(calcolaMinimo);
```
:::

### Esempio con gli Oggetti

**Consegna**: riscrivere la verifica della maggiore età con `filter`.

```javascript
const thisYear = new Date().getFullYear();
const people = [
    {name: "Anna", birthYear: 2003},
    {name: "Brittany", birthYear: 1983},
    {name: "Cinderella", birthYear: 1990},
    {name: "Diana", birthYear: 2000}
];

const canDrink = people.filter((person) => thisYear - person.birthYear >= 18);
const nomi = canDrink.map((person) => person.name);
```

Combinando `filter` e `map` si esprime il **cosa**, non il **come**. Le slide usano `> 18`, che esclude chi ha esattamente 18 anni, mentre negli esempi precedenti si era usato `>= 18`.

## Autotest

**1.** Che cosa restituisce `"Hello".slice(1, 3)`?

<details>
<summary>Soluzione</summary>

`"el"`: dalla posizione 1 alla 3 esclusa.

</details>

**2.** Dato `const a = [1, 2, 3];`, che valori hanno `a` e `x` dopo `const x = a.pop();`?

<details>
<summary>Soluzione</summary>

`a` vale `[1, 2]`, `x` vale `3`.

</details>

**3.** Che differenza c'è tra `for...of` e `for...in`?

<details>
<summary>Soluzione</summary>

`for...of` scorre i **valori** di un iterabile, `for...in` scorre le **chiavi** di un oggetto.

</details>

**4.** Che differenza c'è tra `forEach` e `map`?

<details>
<summary>Soluzione</summary>

`forEach` esegue una funzione e non restituisce nulla. `map` restituisce un nuovo array con i risultati.

</details>

**5.** Usa `reduce` per trovare il massimo di un array.

<details>
<summary>Soluzione</summary>

```javascript
array.reduce((max, value) => (value > max ? value : max));
```

</details>

**6.** Da un array di studenti `{nome, voto}`, ottieni i nomi di chi ha almeno 18.

<details>
<summary>Soluzione</summary>

```javascript
studenti.filter((s) => s.voto >= 18).map((s) => s.nome);
```

</details>

**7.** Perché `person.fullName` senza parentesi non restituisce il nome?

<details>
<summary>Soluzione</summary>

Perché senza parentesi si accede alla funzione, senza eseguirla.

</details>

**8.** Quanto vale `[1, 2, 3].reduce((t, v) => t + v, 10)`?

<details>
<summary>Soluzione</summary>

`16`.

</details>

## Glossario

- **`length`** - Lunghezza di stringhe e array.
- **`slice`** - Estrae una porzione, con il secondo indice escluso.
- **`splice`** - Rimuove e inserisce elementi in un array.
- **Metodo** - Funzione che è proprietà di un oggetto.
- **`this`** - Riferimento all'oggetto corrente.
- **`new`** - Crea un nuovo oggetto da una classe.
- **Tipo primitivo** - Valore che non è un oggetto.
- **`map` / `filter` / `reduce`** - Trasformazione, selezione e riduzione di un array.
