---
title: W4.A2 - La mia soluzione (MovieTicketDiscount)
description: Perché la mia tabella MC/DC del programma MovieTicketDiscount è strutturata così - difesa orale.
sidebar:
  order: 4
---

> **Soluzione e difesa - Assignment W4.A2.**
> Argomento → vedi [Structural Testing](/qualita-software/structural-testing/). Traccia → screenshot `W4_A2.png`.
> Qui sta il *perché* di ogni scelta: è quello che devo saper dire a voce. Voto: **9/10**.

## La traccia in breve

Definire al massimo 10 combinazioni di valori booleani che soddisfano il criterio **MC/DC** per le condizioni dell'`if` del programma `MovieTicketDiscount`, e generare i **valori concreti** che eseguono quelle combinazioni. Consegna: una tabella booleana (condizioni in colonna, test in riga, esito nell'ultima colonna, celle MC/DC in grassetto) + una tabella di valori concreti. Più la parte di critica al GAI.

## Il codice sotto test

```java
if ((age < 13 && movieRating <= 8 && !isMember) ||      // blocco 1: C1 C2 C3
    (isWeekday && ticketPrice > 12 && hasStudentID) ||  // blocco 2: C4 C5 C6
    (age >= 60 && !isWeekday && movieRating > 6)) {      // blocco 3: C7 C8 C9
    // "qualifies for discount"
} else {
    // "does not qualify"
}
```

La decisione è una **disgiunzione di tre congiunzioni**: `(C1∧C2∧C3) ∨ (C4∧C5∧C6) ∨ (C7∧C8∧C9)`, per un totale di **9 condizioni elementari**.

| | Condizione |
|---|---|
| C1 | `age < 13` |
| C2 | `movieRating <= 8` |
| C3 | `!isMember` |
| C4 | `isWeekday` |
| C5 | `ticketPrice > 12` |
| C6 | `hasStudentID` |
| C7 | `age >= 60` |
| C8 | `!isWeekday` |
| C9 | `movieRating > 6` |

## La mia tabella booleana (le celle in grassetto sono le coppie MC/DC)

| Test | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | Esito |
|---|---|---|---|---|---|---|---|---|---|---|
| TC1 | T | T | T | T | F | T | F | F | T | **TRUE** |
| TC2 | F | T | T | T | T | T | F | F | T | TRUE |
| TC3 | F | T | T | F | F | T | T | T | T | TRUE |
| TC4 | F | T | T | T | F | T | F | F | T | FALSE |
| TC5 | T | F | T | T | F | T | F | F | T | FALSE |
| TC6 | T | T | F | T | F | T | F | F | T | FALSE |
| TC7 | F | T | T | F | T | T | F | T | T | FALSE |
| TC8 | F | T | T | T | T | F | F | F | T | FALSE |
| TC9 | F | T | T | T | F | T | T | F | T | FALSE |
| TC10 | F | T | T | F | F | T | T | T | F | FALSE |

**Valori concreti** (estratto): TC1 → age 10, rating 7, isMember F, isWeekday T, price 10, student T → TRUE; TC5 → age 10, rating 9 (così C2 diventa F), … → FALSE; e così via, ogni riga booleana mappata su valori reali coerenti.

## Perché è strutturata così

1. **10 test per 9 condizioni (n+1).**
   *Cosa dire:* MC/DC richiede al massimo n+1 test per una decisione con n condizioni elementari; con 9 condizioni il bersaglio è 10. Le tre righe TRUE (TC1–TC3) attivano ciascuna **uno** dei tre blocchi OR; le sette righe FALSE servono a costruire, per ogni condizione, la coppia che ne dimostra l'effetto indipendente.

2. **Una coppia per condizione, con gli altri blocchi "spenti".**
   *Cosa dire:* per isolare l'effetto di una condizione del blocco 1, gli altri due blocchi OR vanno tenuti **falsi** (altrimenti l'OR sarebbe già vero e quella condizione non conterebbe). Questo è il **masking**: tengo ferme le altre condizioni nello stato che lascia passare l'effetto di quella sotto test, e cambio solo lei verificando che l'esito si ribalti.

3. **Valori concreti coerenti con la tabella booleana.**
   *Cosa dire:* ogni riga booleana è stata istanziata con numeri reali che la rendono effettivamente eseguibile (es. rating 7 per avere C2=`≤8` vero **e** C9=`>6` vero allo stesso tempo). La coerenza booleano↔concreto è uno dei punti su cui la GAI ha fallito.

## La critica all'output GAI (parte richiesta dalla traccia)

Ho confrontato la mia soluzione con quella di **ChatGPT** (prompt = traccia copiata). I quattro difetti:

1. **Matematico**: con 9 condizioni servono 10 test (n+1), ma il GAI ne ha generati solo **9** → copertura incompleta in partenza.
2. **Contraddizioni logiche**: ha trattato variabili dipendenti come isolate, creando casi impossibili. Es. nel suo T3: `movieRating <= 8` = falso (rating > 8) **e** `movieRating > 6` = falso (rating ≤ 6) → un rating non può essere insieme > 8 e ≤ 6.
3. **Incoerenza booleano/concreto**: nella stessa riga T3 dichiara `movieRating > 6` = falso, ma poi nei valori concreti assegna `movieRating = 9`, che è > 6 (vero).
4. **Coppie di indipendenza mancanti**: per alcune variabili non ha costruito la coppia che dimostra l'effetto indipendente (es. `hasStudentID` non ha il caso negativo con gli altri blocchi mascherati a falso) → quella condizione di fatto non è testata.

*Conclusione difendibile:* il GAI riempie una tabella che *sembra* MC/DC, ma viola sia il vincolo numerico sia la coerenza logica tra le condizioni accoppiate.

## ⚠️ Il punto delicato - le condizioni accoppiate (probabile motivo del −1)

Questo è l'aspetto più sofisticato della consegna ed è **quasi certamente ciò che l'esaminatore andrà a toccare**. Tre coppie di condizioni condividono la stessa variabile:

- **C4 = `isWeekday`** e **C8 = `!isWeekday`** → C8 è *esattamente la negazione* di C4. Non sono indipendenti: fissato C4, C8 è determinato.
- **C1 = `age < 13`** e **C7 = `age >= 60`** → mutuamente esclusive (non possono essere entrambe vere).
- **C2 = `movieRating <= 8`** e **C9 = `movieRating > 6`** → range *sovrapposti* (rating 7 o 8 le rende entrambe vere).

:::caution[Cosa significa per MC/DC]
MC/DC nella sua forma classica assume condizioni **indipendenti**: per ogni condizione devi poterla cambiare *tenendo ferme tutte le altre*. Ma se C8 = ¬C4, non puoi cambiare C4 lasciando C8 fermo - cambiano insieme. Questo è il problema noto delle **strongly coupled conditions**, su cui MC/DC ha difficoltà riconosciute in letteratura. Trattare C4 e C8 come 9 condizioni del tutto indipendenti (e quindi imporre n+1 = 10) è una **semplificazione**: il numero "vero" di condizioni *indipendenti* è inferiore, perché alcune sono legate.
:::

**Come gestirlo all'orale (onestà + consapevolezza).** Non difendere il "10" come dogma. La risposta forte è: *"Ho applicato il criterio n+1 come da lezione contando le 9 condizioni sintattiche; sono però consapevole che C4 e C8 sono accoppiate (C8 = ¬C4) e che C1/C7 e C2/C9 condividono la variabile. In presenza di condizioni fortemente accoppiate MC/DC va trattato con cura, perché non si possono variare in modo davvero indipendente; un'analisi più rigorosa ragionerebbe sul numero di condizioni effettivamente indipendenti."* Mostrare di **vedere** l'accoppiamento vale più del numero in sé.

> Nota onesta: il commento di valutazione non riporta la motivazione scritta del −1, quindi questa è la spiegazione *più probabile*, non una certezza. Vale comunque la pena padroneggiarla, perché è il cuore tecnico dell'assignment.

## Domande di difesa probabili

1. Quante condizioni elementari ha l'`if`? Come le hai contate?
2. Spiega il masking sulla tua TC5: quale condizione stai isolando e perché gli altri due blocchi sono falsi?
3. C8 è `!isWeekday` e C4 è `isWeekday`: sono davvero due condizioni indipendenti? Cosa implica per MC/DC? *(la domanda chiave)*
4. Perché MC/DC e non compound condition coverage su questo codice? Quanti test servirebbero con compound? (2⁹ = 512)
5. Perché il rating concreto `7` compare spesso? (Rende C2 e C9 entrambe vere, stato "neutro" per mascherare quel ramo.)
6. Il GAI ha prodotto un caso con rating insieme >8 e ≤6: perché è impossibile e come lo hai evitato tu?
7. MC/DC subsume branch coverage: questa tua suite copre quindi anche tutti i rami? Perché?