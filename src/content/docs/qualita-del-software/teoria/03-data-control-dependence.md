---
title: Data & Control Dependence
description: Teoria - dipendenze di dati e di controllo (Cap. 6.1), def-use, def-clear path, dominator e post-dominator, grafi di dipendenza.
sidebar:
  order: 5
---

## Il problema da cui tutto nasce

Quando si analizza un programma, una domanda ricorrente è: *quali istruzioni influenzano quali altre?* Se cambio il valore calcolato a riga 5, quali righe più avanti ne risentono? E quali istruzioni decidono *se* una certa riga verrà eseguita? Rispondere serve per tantissime cose: ottimizzazione del compilatore, slicing, individuazione di codice morto, e - nel nostro corso - per capire la struttura profonda di un programma al di là del semplice flusso di controllo.

Le **dipendenze** formalizzano queste relazioni. Ce ne sono di due tipi, e tenerle distinte è il cuore di questo capitolo: la **dipendenza di dati** (chi usa un valore prodotto da chi) e la **dipendenza di controllo** (chi decide se qualcosa viene eseguito).

:::tip[In una frase]
La **dipendenza di dati** lega un'istruzione che *usa* una variabile all'istruzione che ne ha *prodotto* il valore; la **dipendenza di controllo** lega un'istruzione alla decisione (`if`, `while`) che determina se viene eseguita. Si rappresentano con due grafi distinti costruiti sopra il control flow graph.
:::

## Definizioni e usi - il vocabolario di base

Tutto parte da due concetti elementari riferiti a una variabile in un punto del programma:

- una **definizione** (def) di una variabile `v` è un punto in cui `v` *riceve un valore* (un assegnamento, un parametro, un input);
- un **uso** (use) di `v` è un punto in cui il suo valore *viene letto* (in un'espressione, in una condizione, in un `return`).

Una stessa riga può fare entrambe le cose: `tmp = x % y` **definisce** `tmp` e **usa** `x` e `y`.

## Dipendenza di dati

L'idea è intuitiva: se un'istruzione usa una variabile, *dipende dai dati* dell'istruzione che ha prodotto quel valore. Ma con una condizione precisa, perché tra la definizione e l'uso non deve esserci stata una ridefinizione che "sovrascrive" il valore.

:::note[Def-clear path]
Una definizione di `v` a un punto A **raggiunge** un uso di `v` a un punto C se esiste almeno un cammino nel control flow graph da A a C **lungo il quale `v` non viene ridefinita**. Quel cammino si dice *def-clear* (libero da definizioni) rispetto a `v`. Se nel mezzo, in un punto B, c'è un nuovo assegnamento a `v` (un *kill*), quella ridefinizione "uccide" la definizione precedente: A non raggiunge più C lungo quel cammino.
:::

Quando una definizione raggiunge un uso si forma una **coppia def-use (du-pair)**, ed è proprio questa coppia a rappresentare la dipendenza di dati.

### Il data dependence graph

Si costruisce così:

- **Nodi**: gli stessi del control flow graph (le istruzioni / basic block).
- **Archi**: una freccia da ogni *definizione* al corrispondente *uso* che essa raggiunge (le du-pair), **etichettata con il nome della variabile**.

L'etichetta sulla variabile è importante: dice *quale* dato fluisce lungo quella dipendenza. Nell'esempio classico del GCD di Euclide, l'arco da `tmp = x % y` (che definisce `tmp`) verso `y = tmp` (che usa `tmp`) porta l'etichetta `tmp`.

## Dipendenza di controllo

La dipendenza di controllo cattura una relazione diversa: non "da dove viene il valore", ma "chi decide se questa istruzione viene eseguita". L'istruzione dentro il corpo di un `if` dipende dalla condizione dell'`if`; le istruzioni dentro un `while` dipendono dal test del ciclo.

Per definirla in modo rigoroso servono i concetti di dominator e post-dominator.

:::note[Dominator (pre-dominator)]
Un nodo **M domina** un nodo **N** se *ogni* cammino dalla radice (l'ingresso del programma) a N passa per M. Tra tutti i dominatori di N, l'**immediate dominator** è quello più vicino a N. La relazione di dominanza immediata forma un **albero** (il dominator tree).
:::

:::note[Post-dominator]
È il concetto speculare: un nodo **M post-domina N** se ogni cammino da N all'**uscita** del programma passa per M. Equivale a calcolare i dominatori sul *control flow graph rovesciato*, usando un nodo "exit" come radice.
:::

L'intuizione che lega i due: un nodo N **è control-dependent** da una decisione D quando l'esito di D determina se N verrà eseguito - formalmente, quando seguendo un ramo di D si è obbligati a passare per N (N post-domina quel ramo) ma seguendo l'altro no (N non post-domina D stessa). In parole povere: D può "scegliere" se far eseguire N.

### Il control dependence graph

- **Nodi**: le istruzioni / basic block.
- **Archi**: da ogni decisione verso le istruzioni che essa controlla direttamente.

Tipicamente questo grafo ha una forma **ad albero** (o quasi): la radice è l'ingresso del metodo, e ogni `if`/`while` diventa un nodo da cui pendono le istruzioni del suo corpo. Le istruzioni che vengono sempre eseguite (non dentro nessuna condizione) dipendono direttamente dalla radice.

## Perché due grafi separati

Vale la pena tenerli distinti perché catturano informazioni complementari. Il grafo di controllo ti dice la *struttura di annidamento* (cosa sta dentro cosa); il grafo dei dati ti dice il *flusso dei valori* (cosa alimenta cosa) e può collegare istruzioni anche molto lontane nel testo del programma, scavalcando la struttura a blocchi. Uniti insieme formano il *program dependence graph*, base di molte analisi avanzate.

## Trappole d'esame

:::caution[Gli errori che il professore va a cercare]
- **Confondere i due tipi di dipendenza**: "usa il valore di" (dati) ≠ "viene eseguito se" (controllo).
- **Dimenticare il def-clear path**: una definizione raggiunge un uso solo se non c'è una ridefinizione (kill) nel mezzo. Una definizione successiva interrompe la dipendenza.
- **Non etichettare gli archi dati con la variabile**: l'etichetta è parte dell'informazione, non un abbellimento.
- **Sbagliare la direzione degli archi**: nel grafo dati la freccia va dalla definizione all'uso.
- **Invertire dominator e post-dominator**: il primo guarda verso l'ingresso, il secondo verso l'uscita.
- **Mettere nel grafo di controllo istruzioni che dipendono solo da dati**: un assegnamento che usa una variabile prodotta altrove ha una dipendenza *di dati*, non di controllo, con quella sorgente.
:::

## Autotest

Rispondi a voce, a memoria, poi confronta.

1. Differenza tra dipendenza di dati e dipendenza di controllo, con un esempio di ciascuna.
2. Cos'è una def? Cos'è un use? Fai un esempio di riga che è entrambe.
3. Spiega il def-clear path: quando una definizione raggiunge un uso, e cosa lo impedisce?
4. Come si costruisce il data dependence graph (nodi, archi, etichette)?
5. Definisci dominator e post-dominator; in cosa differiscono.
6. Quando un nodo è control-dependent da una decisione?
7. Perché il control dependence graph ha tipicamente forma ad albero?

## Glossario

- **Definition (def)** - punto in cui una variabile riceve un valore.
- **Use** - punto in cui il valore di una variabile viene letto.
- **du-pair (def-use pair)** - coppia (definizione, uso) collegata da un cammino def-clear.
- **Def-clear path** - cammino tra una def e un use lungo cui la variabile non è ridefinita.
- **Kill** - ridefinizione che annulla una definizione precedente.
- **Data dependence** - relazione "l'uso dipende dal valore prodotto dalla definizione".
- **Control dependence** - relazione "l'esecuzione di N è decisa da una decisione D".
- **Dominator** - M domina N se ogni cammino dall'ingresso a N passa per M.
- **Post-dominator** - M post-domina N se ogni cammino da N all'uscita passa per M.
- **Data / Control dependence graph** - i due grafi che rappresentano rispettivamente le due dipendenze.