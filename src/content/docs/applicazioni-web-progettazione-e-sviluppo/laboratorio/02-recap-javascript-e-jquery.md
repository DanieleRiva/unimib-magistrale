---
title: Recap di JavaScript e jQuery
description: Ripasso di JavaScript dal laboratorio, conversioni di tipo, == e ===, debugging, FAQ dinamica e introduzione a jQuery.
sidebar:
  order: 2
---

:::note[Cosa c'è qui]
Questa lezione ripassa argomenti già visti nella [teoria](../../teoria/01-fondamenti-di-javascript/). Qui trovi solo ciò che è **nuovo o spiegato in modo diverso**: tipi dinamici, confronti, `null`, debugging, la FAQ dinamica e jQuery.
:::

## Hello World

Il codice può stare nell'`head` o nel `body`. `alert` mostra una finestra, mentre `document.write` scrive nella pagina nel punto in cui si trova lo script, finché la pagina è in caricamento.

```html
<div class="main">
    <h1>Writing to the Document Window</h1>
    <script>
        document.write('<p>Hello world!</p>');
    </script>
</div>
```

`prompt` chiede un valore all'utente e lo restituisce **come stringa**:

```javascript
var name = prompt('What is your name?', '');
document.write('<p>Welcome ' + name + '</p>');
```

## Debugging: la Console

Quando qualcosa non funziona, la prima cosa da guardare è la **console del browser**. Nell'esempio delle slide manca la virgoletta di chiusura:

```text
$('body').hide().fadeIn('slow);
```

La console segnala un `SyntaxError` indicando file e riga. Un errore di sintassi blocca **l'intero script**, non solo quell'istruzione.

## Variabili e Tipi

Le variabili **non hanno un tipo**: lo ha il valore, e può cambiare.

```javascript
var lastName = 'Monster';
lastName = 3;                // nessun problema
```

Attenzione al significato degli operatori, che dipende dal contenuto delle variabili:

```javascript
var numshoes = '2';
var numsocks = 4;
numshoes + numsocks;      // "24": il + concatena
+numshoes + numsocks;     // 6: il + unario converte in numero
```

Gli operatori matematici sono quelli consueti, comprese le forme compatte. Il prefisso `--` decrementa **prima** di usare il valore:

```javascript
var numsocks = 4;
var numshoes = 2;
numsocks = (numsocks / 2) + numshoes;   // 4
numsocks += --numshoes;                 // numshoes diventa 1, numsocks 5
numshoes /= 2;                          // 0.5
```

### == e ===

| Operatore | Comportamento |
| --- | --- |
| `==`, `!=` | Se i tipi sono diversi **cercano di convertire**, con effetti sorprendenti |
| `===`, `!==` | Non convertono: valori di tipo diverso sono sempre diversi |

```javascript
0 == '0';     // true
0 === '0';    // false
```

Per evitare errori, molti programmatori esperti, come Douglas Crockford, suggeriscono di usare sempre `===` e `!==`.

## Array e Oggetti

Gli array sono **dinamici** e non vanno inizializzati. `push` equivale a scrivere in fondo:

```javascript
authors.push('Umberto Eco');
authors[authors.length] = 'Umberto Eco';
```

:::caution[Slide 14]
La slide scrive `authors[length]`, ma `length` è una proprietà dell'array: serve `authors[authors.length]`.
:::

`join` e `split` passano da array a stringa e viceversa:

```javascript
var myarr = ["Mack", "the", "Knife"];
var flattened = myarr.join(" ");      // "Mack the Knife"
var newarr = flattened.split(" ");    // ["Mack", "the", "Knife"]
```

Gli oggetti sono strutture **dinamiche e non tipizzate**: si possono aggiungere e rimuovere proprietà in qualsiasi momento.

```javascript
var cat = {colour: "grey", name: "Spot", size: 46};
cat.size = 47;
delete cat.size;     // ora cat.size è undefined
cat.weight = 5.5;
```

### null e undefined

| Valore | Significato |
| --- | --- |
| `null` | Variabile definita, con valore "vuoto" |
| `undefined` | Variabile non definita |

```javascript
null == undefined;    // true
null === undefined;   // false
```

:::caution[Slide 16]
La slide dice che `null` e `undefined` sono "oggetti veri e propri". In realtà sono valori **primitivi**, come ricordava la [Parte IV](../../teoria/05-stringhe-array-e-oggetti/#classi-e-oggetti-predefiniti). A confondere è `typeof null`, che restituisce `"object"` per un errore storico del linguaggio.
:::

## Controllo di Flusso

Oltre a `if` e `for`, le slide mostrano due strutture:

```javascript
// do-while: il corpo viene eseguito almeno una volta
do {
    var luckyNumber = prompt('What is your lucky number?', '');
    luckyNumber = parseInt(luckyNumber, 10);
} while (isNaN(luckyNumber));

// switch: sceglie in base al valore
switch (luckyNumber) {
    case 7:
        document.write('<p>Hey, 7 is my lucky number too!</p>');
        break;
    default:
        document.write('<p>The number ' + luckyNumber + ' is lucky for you!</p>');
}
```

Il `do-while` è perfetto per l'input: chiede finché il valore non è valido. Il secondo argomento di `parseInt` è la **base**. Senza `break`, uno `switch` prosegue nel caso successivo.

### Scoping

```javascript
var message = 'Global variable...';

function warningA() {
    var message = 'Local variable...';
    alert(message);       // Local variable...
}
function warningB() {
    alert(message);       // Global variable...
}

warningA();
warningB();
alert(message);           // Global variable...
```

La variabile locale **oscura** quella globale, che però non cambia.

## Esempio: FAQ Dinamica

**Obiettivo**: una pagina di domande e risposte in cui le risposte sono nascoste, e cliccando su una domanda compare la risposta.

```html
<h2 class="menu">Can JavaScript really solve all of my problems?</h2>
<div class="answer">
    <p>Why, yes it can!</p>
</div>
```

```javascript
document.addEventListener('DOMContentLoaded', function () {
    // nasconde tutte le risposte
    const answers = document.getElementsByClassName("answer");
    for (let i = 0; i < answers.length; i++) {
        answers[i].style.display = 'none';
    }

    // associa un gestore a ogni domanda
    const collection = document.getElementsByClassName("menu");
    for (let i = 0; i < collection.length; i++) {
        collection[i].addEventListener("click", function () {
            if (this.nextElementSibling.style.display == 'none') {
                this.classList.add('close');
                this.nextElementSibling.style.display = 'block';
            } else {
                this.classList.remove('close');
                this.nextElementSibling.style.display = 'none';
            }
        });
    }
});
```

Dentro al gestore, `this` è l'elemento cliccato, e `nextElementSibling` il fratello successivo, cioè la risposta. La classe `close` cambia l'icona, tramite una regola CSS.

:::caution[Slide 21, 25 e 27]
- Il codice cerca la classe `menu`, ma nell'HTML della slide 21 gli `h2` non ce l'hanno: va aggiunta, come nell'esempio qui sopra.
- Nella slide 27 il commento del ramo `else` dice "a block", ma il codice imposta `none`, ed è il codice a essere corretto.
:::

Da qui in avanti il corso usa sempre `const` e `let` invece di `var`.

## jQuery

**jQuery** è un framework JavaScript che semplifica manipolazione del DOM e CSS, eventi, animazioni e AJAX. Lo si vede prima di React perché è didatticamente **"antitetico"**: si interviene direttamente sulla pagina, mentre React è dichiarativo. È diffuso, open source e compatto.

La sintassi di base è:

```text
$(selector).action()
```

| Parte | Significato |
| --- | --- |
| `$` | Accede alle funzionalità di jQuery |
| `selector` | Una sorta di query che seleziona una parte del documento |
| `action` | L'azione da effettuare sugli elementi selezionati |

La stessa FAQ con jQuery:

```javascript
$(document).ready(function () {
    $('.answer').hide();
    $('.main h2').toggle(
        function () {
            $(this).next('.answer').slideDown();
            $(this).addClass('close');
        },
        function () {
            $(this).next('.answer').fadeOut();
            $(this).removeClass('close');
        }
    );
});
```

- `$(document).ready(...)` esegue la funzione quando il documento è pronto.
- `$('.answer').hide()` nasconde **tutti** gli elementi di classe `answer`, senza un ciclo esplicito.
- `$('.main h2')` seleziona gli `h2` dentro a `.main`, con la sintassi dei selettori CSS.
- `toggle` associa due funzioni, chiamate ai clic dispari e pari.

:::caution[Slide 32 e versione di jQuery]
- La slide dice che anche la seconda funzione "aggiunge" la classe `close`: in realtà la **rimuove**.
- Questa forma di `toggle`, con due funzioni, funziona con la versione 1.7 usata negli esempi, ma è stata **rimossa da jQuery 1.9**.
:::

### Serve jQuery?

**No.** JavaScript puro risolve il problema senza particolari difficoltà, e da ES6 ha incorporato molte funzioni nate con jQuery. Resta però compatto, comodo per attraversare il DOM e assorbe le incompatibilità dei vecchi browser. Le slide avvertono che **qualche domanda sul tema è possibile**.

| Operazione | JavaScript | jQuery |
| --- | --- | --- |
| Attendere il caricamento | `addEventListener('DOMContentLoaded', f)` | `$(document).ready(f)` |
| Selezionare per classe | `getElementsByClassName('x')` | `$('.x')` |
| Nascondere | `el.style.display = 'none'` | `$(el).hide()` |
| Aggiungere una classe | `el.classList.add('x')` | `$(el).addClass('x')` |
| Fratello successivo | `el.nextElementSibling` | `$(el).next()` |

Gli esercizi vengono dal libro *JavaScript & jQuery: The Missing Manual* di David Sawyer McFarland.

## Autotest

**1.** Che cosa producono `'2' + 4` e `+'2' + 4`?

<details>
<summary>Soluzione</summary>

`"24"` e `6`: il `+` unario converte la stringa in numero.

</details>

**2.** Che differenza c'è tra `==` e `===`?

<details>
<summary>Soluzione</summary>

`==` converte i tipi se sono diversi, `===` no: valori di tipo diverso sono sempre diversi.

</details>

**3.** Quando conviene `do-while` invece di `while`?

<details>
<summary>Soluzione</summary>

Quando il corpo va eseguito almeno una volta, come per chiedere un input e controllarlo.

</details>

**4.** Che differenza c'è tra `null` e `undefined`?

<details>
<summary>Soluzione</summary>

`null` è un valore vuoto assegnato a una variabile definita, `undefined` indica una variabile o proprietà non definita. Si ha `null == undefined`, ma `null !== undefined`.

</details>

**5.** Nella FAQ, che cosa fa `this.nextElementSibling`?

<details>
<summary>Soluzione</summary>

Restituisce l'elemento fratello successivo di quello cliccato, cioè il `div` con la risposta.

</details>

**6.** Traduci in jQuery: nascondere tutti gli elementi di classe `nota`.

<details>
<summary>Soluzione</summary>

`$('.nota').hide();`

</details>

**7.** Perché le slide definiscono jQuery "antitetico" rispetto a React?

<details>
<summary>Soluzione</summary>

Perché con jQuery si seleziona e si modifica direttamente il DOM, in stile imperativo, mentre con React si descrive l'interfaccia in funzione dello stato.

</details>

## Glossario

- **`prompt`** - Finestra che chiede un valore all'utente.
- **Tipizzazione dinamica** - Il tipo dipende dal valore, non dalla variabile.
- **`===`** - Uguaglianza senza conversione di tipo.
- **`undefined` / `null`** - Valore non definito e valore vuoto.
- **`nextElementSibling`** - Elemento fratello successivo.
- **jQuery** - Libreria per semplificare DOM, eventi e AJAX.
- **Selettore** - Espressione che individua elementi del documento.
