---
title: Fault-based Testing (Mutation)
description: Teoria - Fault-based testing, la metafora dei pesci, operatori di mutazione e mutanti equivalenti (Cap. 16).
sidebar:
  order: 8
---

## Il problema da cui tutto nasce

Fino ad ora abbiamo valutato i test misurando quanto codice coprono (Statement Coverage, Branch Coverage). Ma coprire una riga di codice non significa averla testata bene: potrei eseguire una riga che calcola uno stipendio sbagliato senza mai fare un'asserzione (un `assertEquals`) sul risultato. Il test passerebbe con il 100% di copertura, ma il bug rimarrebbe.

Il **Fault-based testing** ribalta la prospettiva. Invece di chiederci *"Quali righe ho eseguito?"*, ci chiediamo: *"Se in questo codice ci fosse un bug, la mia test suite se ne accorgerebbe? I miei test fallirebbero?"*. 
Per scoprirlo, inseriamo volontariamente dei bug nel codice e vediamo se i test "suonano l'allarme".

## La metafora dei pesci nel lago (Capture-Recapture)

Il professore introduce l'argomento con una famosa analogia statistica. Supponiamo di voler sapere quanti pesci ci sono in un lago. È impossibile contarli tutti. Come facciamo?
1. Catturiamo un certo numero di pesci ($M$), li marchiamo con un bollino colorato e li ributtiamo nel lago.
2. Il giorno dopo gettiamo di nuovo le reti e peschiamo $N$ pesci.
3. Contiamo quanti di questi $N$ pesci hanno il nostro bollino colorato ($N1$).

Con una semplice proporzione possiamo stimare il totale dei pesci nel lago:
$$Total = \frac{N \cdot M}{N1}$$

**Cosa c'entra col software?**
- **I pesci totali** sono i bug totali presenti nel nostro programma (che non conosciamo).
- **I pesci marchiati ($M$)** sono i bug "finti" (fault) che noi inseriamo volontariamente nel codice.
- **I pesci catturati ($N$)** sono tutti i bug scoperti dalla nostra test suite (sia veri che finti).
- **I pesci marchiati e catturati ($N1$)** sono i bug finti che la nostra test suite è riuscita a scoprire (uccidere).

Se i nostri test scoprono tutti i bug finti che abbiamo inserito, possiamo avere fiducia che scopriranno anche quelli veri. **Assunzione fondamentale:** questo calcolo funziona solo se i bug finti che inseriamo si comportano in modo molto simile ai bug reali.

## Mutation Testing: il metodo in pratica

Il **Mutation Testing** è l'implementazione pratica del fault-based testing. Si prende il programma originale e se ne creano tante copie (i **mutanti**). In ogni copia viene introdotta una singola, minuscola alterazione sintattica.

A questo punto si esegue la propria test suite contro ogni singolo mutante.
- Se la test suite passa (verde), significa che i test non si sono accorti del bug. Il mutante è **sopravvissuto**.
- Se la test suite fallisce (rosso), significa che un test si è accorto della modifica anomala. Il mutante è stato **ucciso**.

L'obiettivo è scrivere una test suite che ottenga un **Mutation Score** del 100%, ovvero che uccida tutti i mutanti.

### I due pilastri logici (Le ipotesi)

Perché perdere tempo a inserire errori minuscoli? Non rischiamo di ignorare i bug macroscopici e complessi? No, grazie a due ipotesi fondamentali della ricerca:

1. **Competent Programmer Hypothesis:** I programmatori non scrivono codice totalmente a caso. Di solito sanno quello che fanno. I bug reali sono quasi sempre minuscoli errori di distrazione o di battitura (es. scrivere `<` invece di `<=`, o `+` invece di `-`) in un programma altrimenti corretto. Quindi, i mutanti sono ottime simulazioni della realtà.
2. **Coupling Effect Hypothesis:** L'effetto accoppiamento. Gli studi dimostrano che una test suite talmente minuziosa e sensibile da riuscire a scovare (uccidere) bug minuscoli, sarà automaticamente in grado di intercettare e far fallire anche i bug logici molto più complessi.

### Gli Operatori di Mutazione

Per creare i mutanti si usano regole standard chiamate Operatori di Mutazione, che dipendono dal linguaggio di programmazione. Quelli fondamentali sono:
- **ROR (Relational Operator Replacement):** Sostituisce gli operatori relazionali. Es. trasforma `x < 5` in `x <= 5` oppure `x == 5`.
- **AOR (Arithmetic Operator Replacement):** Sostituisce calcoli matematici. Es. trasforma `x = y + z` in `x = y - z`.
- **CRP (Constant Replacement):** Cambia i numeri hardcodati. Es. trasforma `x = 10` in `x = 11`.
- **LCR (Logical Connector Replacement):** Cambia gli operatori logici. Es. trasforma `A && B` in `A || B`.
- **SDL (Statement Deletion):** Cancella un'intera istruzione.

## Trappole d'esame: I Mutanti Equivalenti

:::caution[Attenzione all'orale]
Il concetto di mutante equivalente è la domanda più gettonata. Devi saperlo spiegare con un esempio.
:::

Un mutante sopravvive per due motivi:
1. **La test suite è scarsa:** Non hai scritto un test che passa per quella riga, o non hai fatto le giuste `assert` sul risultato.
2. **È un Mutante Equivalente:** Hai modificato il codice in modo sintattico, ma il comportamento semantico del programma è rimasto *identico*.

Se il comportamento è identico, nessun test al mondo potrà mai accorgersi della differenza, perché non c'è nessuna differenza nel risultato. I mutanti equivalenti sono la rovina del mutation testing perché abbassano il punteggio (non puoi ucciderli) e costringono il programmatore a ispezionarli a mano uno per uno per capire se sono equivalenti o se manca un test.

*Esempio classico:* Un ciclo `for (int i = 0; i < 10; i++)`. Se applichi il ROR e lo muti in `for (int i = 0; i != 10; i++)`, hai cambiato il codice sintatticamente. Ma l'esecuzione farà esattamente gli stessi 10 giri, senza mai sballare. Questo è un mutante equivalente.

## Ottimizzazioni

Il difetto enorme del mutation testing è che genera migliaia di mutanti per programmi anche piccoli, e bisogna far girare l'intera test suite per ciascuno di essi. È lentissimo. Si usano due soluzioni:
- **Statistical Mutation:** Invece di usare tutti i mutanti generati, se ne prende un campione casuale (es. il 10%) per stimare la qualità dei test.
- **Weak Mutation:** Invece di aspettare la fine dell'esecuzione del programma per vedere se l'output finale cambia, l'infrastruttura di test controlla lo stato della memoria interna *subito dopo* l'esecuzione della riga mutata. Se in quel millisecondo lo stato è diverso dal programma originale, il mutante viene dichiarato "ucciso" e si ferma l'esecuzione risparmiando tempo.

## Autotest

1. Spiega l'analogia dei pesci: a cosa corrispondono i pesci marchiati catturati rispetto al codice?
2. Che differenza c'è tra la Competent Programmer Hypothesis e la Coupling Effect Hypothesis?
3. Se un mutante sopravvive alla tua test suite, significa sempre che devi scrivere un nuovo test?
4. Cos'è un mutante equivalente? Fai un esempio (es. l'inizializzazione di un booleano in Java).
5. Definisci gli operatori ROR e AOR.
6. Quale problema risolve la Weak Mutation rispetto alla mutazione tradizionale (Strong Mutation)?

## Glossario

- **Fault-based testing** - Tecnica che valuta l'efficacia dei test iniettando difetti artificiali nel codice.
- **Mutant (Mutante)** - Una copia del programma originale con una singola modifica sintattica (un bug finto).
- **Killed (Ucciso)** - Un mutante che produce un fallimento in almeno uno dei test della suite.
- **Survived (Sopravvissuto)** - Un mutante che non viene rilevato dalla test suite (tutti i test passano).
- **Equivalent Mutant** - Un mutante alterato sintatticamente ma il cui comportamento a runtime è identico all'originale.
- **Mutation Score** - La percentuale di mutanti uccisi rispetto al totale dei mutanti non-equivalenti.
- **Weak Mutation** - Variante ottimizzata che verifica i cambiamenti di stato interni immediatamente dopo l'istruzione mutata.