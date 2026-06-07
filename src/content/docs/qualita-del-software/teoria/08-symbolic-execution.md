---
title: Symbolic Execution
description: Teoria approfondita sull'Esecuzione Simbolica (Cap. 7), lo Stato, la Path Condition e gli SMT Solvers.
sidebar:
  order: 14
---

## Il limite del Testing Tradizionale (Esecuzione Concreta)

Nel testing tradizionale, noi eseguiamo il software fornendo degli input **concreti** (ovvero numeri o stringhe reali, come `count = 2` o `x = 5`)[cite: 109]. Questo approccio prende il nome di *Concrete Execution*[cite: 121]. Il suo limite fondamentale è che una singola esecuzione concreta può percorrere **un solo cammino alla volta** all'interno del grafo di controllo del programma[cite: 109]. 

Se il software contiene molteplici decisioni nidificate o regole di business complesse, trovare un bug nascosto in un ramo profondo diventa un gioco di fortuna: dobbiamo sperare di indovinare la combinazione numerica esatta in grado di superare tutti i blocchi condizionali.

## Cos'è l'Esecuzione Simbolica (Symbolic Execution)

L'**Esecuzione Simbolica** risolve questo problema sostituendo i valori numerici concreti con dei **simboli algebrici astratti** (solitamente indicati con lettere maiuscole come `X`, `Y`, `C`, `A`)[cite: 109]. Invece di calcolare un risultato numerico, il programma viene eseguito manipolando espressioni matematiche[cite: 109]. 



### La Metafora del Labirinto e della Mappa
* **Esecuzione Concreta:** È come esplorare un labirinto bendati, camminando fisicamente lungo i corridoi. Se trovi un vicolo cieco, devi tornare indietro e riprovare un altro corridoio a tentoni. Puoi scoprire cosa c'è in fondo a un percorso solo andandoci di persona.
* **Esecuzione Simbolica:** È come stare fermi all'ingresso del labirinto, far volare un drone che mappa tutti i corridoi contemporaneamente e calcolare matematicamente sulla carta geografica: *"Quali requisiti deve avere la chiave per aprire la porta numero 4?"*. Non hai bisogno di camminare; risolvi il labirinto risolvendo un sistema di equazioni.

## I due pilastri: Stato Simbolico e Path Condition

Durante il tracciamento di un programma, il motore di esecuzione simbolica mantiene aggiornate due strutture dati vitali per ogni cammino esplorato[cite: 109]:

### 1. Lo Stato Simbolico (Symbolic State)
È un registro (un quaderno algebrico) che mappa ogni variabile interna del programma a un'espressione matematica espressa in funzione degli input simbolici iniziali[cite: 109]. 
* All'inizio del programma, se i parametri di input sono `int x` e `int y`, lo stato iniziale sarà: `x = X`, `y = Y`[cite: 109].
* Se il programma esegue l'istruzione `x = x + 5;`, lo stato si aggiorna in `x = X + 5`.
* Se successivamente esegue `y = x * 2;`, il motore applica la **Sostituzione all'indietro (Back-substitution)** leggendo il valore corrente di `x` dallo stato. Il nuovo stato di `y` diventerà quindi: `y = (X + 5) * 2`.

### 2. La Path Condition (PC)
La Path Condition è un'equazione booleana globale che accumula tutti i vincoli che gli input simbolici devono obbligatoriamente soddisfare per poter percorrere un determinato cammino[cite: 109].
* All'inizio del programma, la PC è impostata a `true` (nessun vincolo)[cite: 109].
* Ogni volta che il flusso incontra una struttura di controllo (un `if` o un `while`), l'esecuzione simbolica si sdoppia (biforcazione)[cite: 109].
* Nel ramo **True**, la condizione dell'`if` viene presa, le sue variabili vengono sostituite con le loro espressioni correnti prese dallo *Stato Simbolico*, e il risultato viene concatenato alla PC tramite l'operatore logico `AND` (`&&`)[cite: 109].
* Nel ramo **False**, viene concatenata la *negazione* della condizione[cite: 109].

## Un esempio pratico di sdoppiamento

Consideriamo questo frammento di codice con input simbolico `x = X`:
```java
int y = x * 2;
if (y > 10) {
    // Ramo A
} else {
    // Ramo B
}
```
Il motore simbolico si comporta così:
1. Dopo la prima riga, lo Stato Simbolico è: `x = X, y = 2X`. La PC è `true`.
2. All'altezza dell'`if`, l'esecuzione si divide in due mondi paralleli:
   * **Mondo Ramo A (True):** La PC diventa `true && 2X > 10`, che semplificata è `X > 5`.
   * **Mondo Ramo B (False):** La PC diventa `true && !(2X > 10)`, che semplificata è `X <= 5`.



## Cammini Infattibili (Infeasible Paths) e SMT Solvers

Sdoppiandosi a ogni bivio, l'esecuzione simbolica genera un **Albero di Esecuzione** (Execution Tree)[cite: 109]. Molti di questi cammini, tuttavia, sono dei "fantasmi" generati dalla struttura sintattica del codice, ma matematicamente impossibili da percorrere.
Prendiamo questo esempio:
```java
if (x < 0) {
    if (x > 5) {
        // Linea Orfana
    }
}
```
Per raggiungere la *Linea Orfana*, la Path Condition accumulata dovrebbe essere `X < 0 && X > 5`. È evidente che nessun numero intero può essere contemporaneamente minore di zero e maggiore di cinque. Questo cammino viene definito **Infeasible Path (Cammino Infattibile)**.

Per evitare di sprecare memoria esplorando rami impossibili, i motori di esecuzione simbolica moderni (come *Java Pathfinder* o *KLEE*) lavorano in simbiosi con un **SMT Solver** (Satisfiability Modulo Theories, come *Z3*)[cite: 116]. A ogni bivio, la PC aggiornata viene inviata all'SMT Solver:
* Se il solver risponde `SAT` (Soddisfacibile), significa che il cammino è reale e fornisce un esempio di input concreto per raggiungerlo.
* Se il solver risponde `UNSAT` (Insoddisfacibile), il motore simbolico applica immediatamente il **Pruning** (potatura): taglia quel ramo dall'albero e smette di analizzarlo[cite: 109].

## I tre grandi limiti teorici

Nonostante la sua potenza nel trovare bug di sicurezza e vulnerabilità, l'esecuzione simbolica pura soffre di tre limitazioni strutturali:
1. **Path Explosion (Esplosione dei Cammini):** Se il codice contiene cicli (`for` o `while`) la cui terminazione dipende da un input simbolico, l'albero si sdoppia all'infinito (un ramo per fare 1 giro, uno per farne 2, uno per farne 3, ecc.). Questo rende l'analisi incompleta a meno di non imporre un tetto massimo di iterazioni.
2. **Black-Box e Codice Nativo:** Se il programma interagisce con l'esterno (chiamate al sistema operativo, query a DB, librerie di terze parti non analizzabili), il motore non può calcolare lo stato simbolico di quelle funzioni e l'analisi si interrompe.
3. **Matematica Non Lineare:** Se il codice esegue operazioni algebriche complesse (moltiplicazioni tra variabili simboliche, funzioni trigonometriche o hash crittografici), gli SMT Solver vanno in stallo e non riescono a determinare se la PC sia `SAT` o `UNSAT`.

## Autotest

1. Qual è la differenza fondamentale tra lo scenario documentato dallo Stato Simbolico e quello documentato dalla Path Condition?
2. Perché l'Esecuzione Simbolica riesce a identificare i "bug di omissione" (regole dimenticate dal programmatore) che lo Structural Testing basato sul codice non vede?
3. Spiega la relazione che intercorre tra una Path Condition definita `UNSAT` dall'SMT Solver e il concetto di *Infeasible Path*.
4. In quale modo il meccanismo della *Back-substitution* impedisce che lo Stato Simbolico contenga variabili locali al posto delle sole variabili di input?

## Glossario

- **Symbolic Execution** - Tecnica statica/dinamica avanzata che analizza i programmi inserendo simboli algebrici al posto di valori numerici discreti[cite: 109].
- **Symbolic State** - Registro logico che mappa le variabili di programma in espressioni matematiche modellate sulle variabili di input[cite: 109].
- **Path Condition (PC)** - Formula booleana cumulativa che raccoglie i vincoli geometrici e logici necessari per convalidare un determinato percorso di esecuzione[cite: 109].
- **SMT Solver** - Programma di calcolo logico incaricato di verificare la soddisfacibilità matematica di un sistema di vincoli (Path Condition)[cite: 116].
- **Pruning (Potatura)** - Azione di interruzione e scarto di un ramo dell'albero di esecuzione simbolica non appena la sua PC viene dichiarata irrisolvibile (`UNSAT`).
- **Path Explosion** - Fenomeno di saturazione della memoria dovuto alla crescita esponenziale dei rami dell'albero di esecuzione, tipicamente causato da cicli iterativi.