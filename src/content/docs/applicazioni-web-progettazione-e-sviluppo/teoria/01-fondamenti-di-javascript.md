---
title: Fondamenti di JavaScript
description: Programmazione algoritmica, variabili, espressioni, condizioni, array, cicli, oggetti, var, let e const.
sidebar:
  order: 1
---

## Il Codice È Comunicazione

Il corso parte da un'idea di George Neville-Neil: il codice è una **forma di comunicazione** tra le persone che lo scrivono e lo mantengono, ed è solo incidentalmente eseguibile da una macchina. Lo scopo di chi scrive è formare nella mente di chi legge la stessa immagine che aveva lui. Un codice che funziona ma non si capisce ha fallito metà del suo compito.

## Programmazione Algoritmica

**Programmare** significa definire una o più sequenze di azioni, gli **algoritmi**, che determinano la soluzione a un problema. Un **programma** è la codifica di queste azioni in un linguaggio comprensibile al computer: riceve dati in ingresso e produce dati in uscita.

I concetti di base, che la presentazione di Protobject introduce in modo concreto:

| Concetto | Significato |
| --- | --- |
| **Algoritmo** | Insieme di istruzioni dettagliate, da seguire passo dopo passo per risolvere un problema |
| **Variabile** | Contenitore con un nome in cui mettere informazioni |
| **Ciclo** | Azione ripetuta più volte, senza doverla riscrivere |
| **Condizionale** | Espressione che valuta se una situazione è vera o falsa, determinando il flusso del programma |
| **Evento** | Qualcosa che accade (un clic, un tasto) e che può attivare azioni |

:::note[Protobject]
**Protobject** è una piattaforma per insegnare la programmazione attraverso lo smartphone, con esperienze tangibili: un semaforo, un visualizzatore di rumore, un sensore di inclinazione per quadri. La presentazione del corso la usa con l'esercizio "Luci di festa".
:::

Le istruzioni fondamentali sono: dichiarazione di variabili (semplici e composte), assegnamento, scelta condizionale, ripetizione, espressione, funzione, lettura e scrittura.

## Che Cos'è JavaScript

**JavaScript** è un linguaggio di scripting **interpretato** da un engine, di solito quello del browser. Con Node.js gira anche sul server. Permette di rendere dinamiche le pagine HTML. È importante perché può fare richieste HTTP al server in modo trasparente per l'utente e rende **asincrona** la comunicazione tra browser e server. I dati possono viaggiare come testo puro o XML, ma oggi il formato più diffuso è **JSON**.

Per provare il codice ci sono la sandbox di [Eloquent JavaScript](https://eloquentjavascript.net/code/) e la console del browser. L'istruzione `console.log(variabile)` mostra un valore.

## Variabili e Assegnamento

Una **variabile** memorizza un valore. I tipi elementari sono numeri, caratteri e booleani, e in JavaScript **il tipo non si dichiara**.

```javascript
let age;                 // dichiarazione
let drinkAlcohol;
age = 35;                // assegnamento
age = annoCorrente - annoNascita;  // assegno il risultato di un'espressione
drinkAlcohol = false;    // booleano
```

## Scelta Condizionale

Definisce due percorsi alternativi. La parte `else` è facoltativa.

```javascript
if (age < 18) {
    drinkAlcohol = false;
} else {
    drinkAlcohol = true;
}
```

Si può semplificare: assegnando un valore iniziale, basta gestire il caso che lo cambia. Meno istruzioni significa più efficienza e meno errori.

```javascript
let drinkAlcohol = true;
if (age < 18) {
    drinkAlcohol = false;
} // else non serve perché è già true
```

## Espressioni e Operatori

Un'**espressione** è una combinazione di valori, variabili e operatori che genera un nuovo valore. Gli operatori sono **unari, binari o ternari**, a seconda di quanti valori combinano.

| Tipo | Operatori | Esempi |
| --- | --- | --- |
| **Aritmetici** | `+`, `-`, `*`, `/`, `%` (resto) | `9 % 4 + 5` vale `6`, `9 / 4 + 5` vale `7.25`, `4 + 5 * 6 + 7` vale `41`, `(4 + 5) * (6 + 7)` vale `117` |
| **Relazionali** | `>`, `>=`, `<`, `<=`, `===`, `!==` | `4 > 2` è `true`, `5 !== 4 + 1` è `false` |
| **Logici** | `&&` (and), `\|\|` (or), `!` (not) | `5 > 2 && 3 !== 4` è `true` |

La precedenza decrescente è: aritmetici, relazionali, logici. Usare le parentesi evita errori.

:::caution[Slide 11: due attenzioni]
- `(4 >== 6)` è un **errore di sintassi**: l'operatore è `>=`.
- `!5 === 5` e `!(5 === 5)` valgono entrambe `false`, ma **per motivi diversi**. La prima calcola prima `!5`, che è `false`, poi `false === 5`. Per questo le parentesi sono importanti.
:::

Le **parole riservate** (`break`, `continue`, `do`, `for`, `function`, `if`, `return`, `switch`, `try`, `var`, `let`, `const`) non si possono usare come nomi di variabili.

## Array e Cicli

Un **array** è una variabile composta che memorizza una sequenza di valori. Gli indici vanno **da 0 a `length - 1`**.

```javascript
let names = ["Anna", "Brittany", "Cinderella", "Diana"];
let ages = [15, 35, 28, 18];

ages[2] = 28;              // assegna 28 al terzo elemento
names[0] === "Anna";       // true
```

Il **ciclo `for`** esegue più volte un blocco di istruzioni:

```javascript
let drinkAlcohol = [];
for (let i = 0; i < ages.length; i++) {
    if (ages[i] < 18) {
        drinkAlcohol[i] = false;
    } else {
        drinkAlcohol[i] = true;
    }
}
```

Le tre parti sono inizializzazione, condizione e passo.

:::caution[Dichiara sempre l'indice]
Molte slide scrivono `for (i = 0; ...)` senza `let`. Funziona, ma crea una variabile **globale** implicita. Va scritto `for (let i = 0; ...)`, come nelle slide successive.
:::

## Oggetti

Un **oggetto** è una variabile composta che memorizza coppie **chiave-valore**.

```javascript
let person = {name: "Anna", age: 15};

person["name"] === "Anna";   // true
person.name === "Anna";      // true
person.age = person.age + 1; // assegna 16

let key = "name";
person[key] === "Anna";      // uso una variabile per il nome della chiave
```

Oggetti e array si combinano. Invece di due array paralleli, si usa un array di oggetti, che tiene insieme i dati di ogni persona:

```javascript
let people = [{name: "Anna", age: 15}, {name: "Brittany", age: 35}];
let drinkAlcohol = [];
for (let i = 0; i < people.length; i++) {
    if (people[i].age < 18) {
        drinkAlcohol[i] = people[i].name + " cannot drink";
    } else {
        drinkAlcohol[i] = people[i].name + " can drink";
    }
}
```

## var, let e const

| | Ambito | Riassegnabile | Introdotta in |
| --- | --- | --- | --- |
| `var` | **Globale o di funzione** | Sì | ES5 |
| `let` | **Di blocco** | Sì | ES6 |
| `const` | **Di blocco** | **No** | ES6 |

```javascript
var x = 10;
{
    let x = 2;    // qui x vale 2
    let y = 5;
    var z = 8;
}
// qui x vale 10
// y NON è utilizzabile
// z è utilizzabile
```

:::caution[const non rende immutabile il contenuto]
`const` rende costante il **contenitore**, non i valori dentro. Il contenuto di array e oggetti si può modificare, ma non si può riassegnare la variabile.

```javascript
const ages = [15, 35, 28, 18];
ages[0] = 16;        // ammesso
ages[4] = 56;        // ammesso
ages = [43, 26];     // ERRORE
```
:::

Le regole delle slide: usare `var` solo per le variabili globali, e **`const` in tutti i casi possibili**.

## Esercizio Svolto: il Parallelogramma

**Consegna**: date le misure dei quattro lati, verificare se un quadrilatero è un parallelogramma, cioè se i lati opposti sono uguali.

**Con 4 variabili** è immediato:

```javascript
let lato0 = 25, lato1 = 15, lato2 = 35, lato3 = 15;
let isParallelogramma = true;
if (lato0 !== lato2) {
    isParallelogramma = false;
} else {
    if (lato1 !== lato3) {
        isParallelogramma = false;
    }
}
```

**Con un array**, le slide propongono un algoritmo in tre passi: cercare un lato uguale a `lati[0]`, e poi distinguere se è adiacente o opposto.

```javascript
let lati = [15, 35, 15, 88];
let isParallelogramma = false;
let posizione = 0;
for (let i = 1; i < lati.length; i++) {   // parto da 1: mi servono gli altri lati
    if (lati[0] === lati[i]) {
        posizione = i;
    }
}
if (posizione !== 0) {
    if (posizione === 1) {
        if (lati[1] === lati[2] && lati[1] === lati[3]) { isParallelogramma = true; }
    }
    if (posizione === 2) {
        if (lati[1] === lati[3]) { isParallelogramma = true; }
    }
    if (posizione === 3) {
        if (lati[3] === lati[2] && lati[3] === lati[1]) { isParallelogramma = true; }
    }
}
```

Se `posizione` resta 0, nessun lato è uguale a `lati[0]`, e il risultato resta `false`.

:::tip[Si può fare di meglio]
Dato che il criterio è "lati opposti uguali", con gli array basta una riga, che dà sempre lo stesso risultato della soluzione lunga:

```javascript
let isParallelogramma = lati[0] === lati[2] && lati[1] === lati[3];
```

Il ramo `posizione === 1` della soluzione lunga, in particolare, non è mai vero: se `posizione` vale 1, né `lati[2]` né `lati[3]` sono uguali a `lati[0]`, e quindi al lato uguale `lati[1]`.
:::

## Autotest

**1.** Quanto vale `9 / 4 + 5`? E `7 % 3 * 2`?

<details>
<summary>Soluzione</summary>

`7.25` e `2`, perché `7 % 3` vale 1 e viene moltiplicato per 2.

</details>

**2.** Scrivi il codice che calcola il perimetro di un rettangolo.

<details>
<summary>Soluzione</summary>

```javascript
let lato1 = 10;
let lato2 = 5;
let perimetro = 2 * (lato1 + lato2);
```

</details>

**3.** Che differenza c'è tra `let` e `var`?

<details>
<summary>Soluzione</summary>

`let` ha ambito di **blocco**, `var` ha ambito **globale o di funzione**: una `var` dichiarata in un blocco è visibile anche fuori.

</details>

**4.** Che cosa stampa questo codice?

```javascript
const a = [1, 2];
a.push(3);
console.log(a);
```

<details>
<summary>Soluzione</summary>

`[1, 2, 3]`. `const` impedisce di riassegnare `a`, non di modificarne il contenuto.

</details>

**5.** Perché il valore finale di `drinkAlcohol` nel ciclo con gli array non indica se può bere `ages[0]`, se fosse una variabile semplice?

<details>
<summary>Soluzione</summary>

Perché una variabile semplice verrebbe sovrascritta a ogni giro, e resterebbe il valore dell'ultimo elemento. Per ricordare ogni risultato serve un array.

</details>

**6.** Quali sono i due modi per accedere a una proprietà? Quando serve il secondo?

<details>
<summary>Soluzione</summary>

`person.name` e `person["name"]`. Le parentesi quadre servono quando il nome della chiave sta in una variabile.

</details>

## Glossario

- **Algoritmo** - Sequenza di azioni che risolve un problema.
- **Variabile** - Spazio in memoria con un nome, che contiene un valore.
- **Espressione** - Combinazione di valori e operatori che produce un valore.
- **Array** - Sequenza di valori con indici da 0.
- **Oggetto** - Insieme di coppie chiave-valore.
- **Scope** - Ambito in cui una variabile è valida.
- **ES5 / ES6** - Versioni dello standard di JavaScript.
- **Sandbox** - Ambiente per provare il codice.
