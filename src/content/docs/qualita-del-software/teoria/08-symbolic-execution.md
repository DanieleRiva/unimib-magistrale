---
title: Symbolic Execution
description: Teoria sull'Esecuzione Simbolica (Cap. 7), Path Condition, SMT Solvers e Sostituzione all'indietro.
sidebar:
  order: 14
---

## Il salto di qualità: Dai Numeri all'Algebra

Nel testing tradizionale (esecuzione concreta), noi diamo al programma dei numeri reali (es. `x = 5`, `y = 10`) e guardiamo cosa esce. Il problema è che un programma con tanti `if` ha un numero astronomico di cammini. Se andiamo a tentativi, potremmo non trovare mai la combinazione esatta di numeri per far crashare il software.

L'**Esecuzione Simbolica (Symbolic Execution)** risolve questo problema trattando il programma non come una calcolatrice, ma come un sistema di equazioni. Invece di usare numeri, il motore assegna agli input dei **simboli algebrici** (es. `X` e `Y`). Eseguendo il codice con le lettere, il motore è in grado di esplorare *tutti* i cammini logici contemporaneamente, calcolando l'esatta formula matematica necessaria per raggiungere ogni singola riga.

## L'Anatomia del Motore Simbolico

Mentre scorre il codice, il motore simbolico mantiene in memoria due strutture dati fondamentali. Capire come interagiscono è la chiave per superare l'esame.

### 1. Lo Stato Simbolico (Symbolic State)
È la "memoria RAM" dell'esecuzione simbolica. È una tabella che associa ogni variabile locale alla sua formula matematica corrente, basata sugli input originali (`X`, `Y`).
* All'avvio: `x` vale `X`, `y` vale `Y`.
* Se il programma esegue `x = x + y`, lo stato della variabile `x` viene sovrascritto. La nuova formula non è `x + y`, ma viene calcolata prendendo i valori *attuali* dalla memoria. Diventa `X + Y`.
* Questo meccanismo si chiama **Sostituzione all'indietro (Back-substitution)** ed è fondamentale per evitare di avere variabili dipendenti da altre variabili locali.

### 2. La Path Condition (PC)
È il "diario di bordo" delle decisioni prese. È un'enorme equazione booleana che accumula tutte le condizioni superate per arrivare in quel punto.
* Parte vuota: `true`.
* Ogni volta che si incontra un `if (condizione)`, l'albero si sdoppia.
* Nel ramo in cui l'`if` è vero, il motore prende la condizione, *sostituisce le variabili con il loro stato simbolico attuale*, e la aggiunge alla PC con un `AND`.
* Nel ramo in cui l'`if` è falso, aggiunge la *negazione* della condizione.

## L'Incubo dei Motori Simbolici: Gli Infeasible Paths

La matematica generata dal codice può essere contraddittoria. 
Se ho un codice che fa: 
```java
if (a > 10) { 
    if (a < 5) { /* BOOM */ } 
}
```
La Path Condition per entrare nel secondo `if` sarebbe `A > 10 AND A < 5`. Questa espressione è un'assurdità matematica. 
Questi percorsi "fantasma" si chiamano **Infeasible Paths (Cammini Infattibili)**. Il codice è scritto così, ma nella realtà fisica nessuna CPU eseguirà mai il blocco interno.

Per scovarli, i motori simbolici si appoggiano a dei cervelloni matematici chiamati **SMT Solvers** (Satisfiability Modulo Theories, come il famoso *Z3* di Microsoft). A ogni passo, il motore invia la PC all'SMT Solver e gli chiede: *"Esiste almeno un numero nell'universo che rende vera questa formula?"*. 
* Se il solver dice `SAT` (Satisfiable), il cammino esiste e l'analisi continua.
* Se il solver dice `UNSAT` (Unsatisfiable), significa che la PC è una contraddizione. Il motore "pota" immediatamente quel ramo dell'albero (Pruning) e smette di esplorarlo per risparmiare tempo e memoria.

## Autotest

1. Spiega la differenza tra Symbolic State e Path Condition.
2. Perché, quando si valuta un'istruzione `if (x > y)`, non si scrive semplicemente `x > y` nella Path Condition?
3. Qual è il ruolo dell'SMT Solver durante l'esecuzione simbolica?
4. Definisci cos'è un Infeasible Path e fai un esempio algebrico.

## Glossario

- **Symbolic Execution** - Analisi del software che utilizza valori simbolici per gli input, costruendo equazioni che descrivono i cammini del programma.
- **Symbolic State** - Mappa aggiornata in tempo reale che lega ogni variabile di programma a un'espressione algebrica in funzione dei simboli di input.
- **Path Condition (PC)** - Formula booleana cumulativa che rappresenta i vincoli matematici necessari per percorrere un determinato ramo del codice.
- **SMT Solver** - Risolutore di equazioni e disuguaglianze logiche; valuta se una Path Condition è `SAT` o `UNSAT`.
- **Infeasible Path** - Un cammino di esecuzione impossibile da raggiungere nella realtà a causa di vincoli logici mutuamente esclusivi nella sua Path Condition.