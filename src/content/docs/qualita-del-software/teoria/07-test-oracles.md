---
title: Test Oracles
description: Teoria sui Test Oracles (Cap. 17), l'oracolo, i falsi positivi e la logica assiomatica.
sidebar:
  order: 12
---

## Il problema da cui tutto nasce

Fino ad ora, con tecniche come lo Structural Testing o il Model-Based Testing, abbiamo risposto a una singola domanda: *"Quali input devo fornire al programma per testarlo a fondo?"*. 
Ma una volta che il programma ha girato e ha "sputato" fuori un risultato, si pone un problema enorme: **chi decide se quel risultato è giusto o sbagliato?**

Se devi eseguire 10.000 casi di test automatizzati, non puoi metterti a leggere l'output a schermo uno per uno. Ti serve un "giudice" automatico che osservi l'esecuzione e decreti un "Pass" (tutto ok) o un "Fail" (c'è un bug). Questo giudice algoritmico si chiama **Test Oracle** (Oracolo di Test).

L'Oracolo è il meccanismo che separa l'esecuzione del test dalla sua validazione. Senza un oracolo, un test non serve a nulla, perché il codice viene eseguito ma gli errori passano inosservati.

## I 6 Tipi di Oracoli (Dal più "stupido" al più "intelligente")

Gli oracoli si dividono in categorie basate su quanta "intelligenza" (o documentazione) hanno a disposizione per giudicare il sistema.

### 1. Implicit Oracles (Oracoli Impliciti)
Sono i giudici di base. Non conoscono nulla di quello che il tuo programma dovrebbe fare (non sanno se calcola tasse o prenota aerei), ma conoscono le regole "universali" dell'informatica.
* **Come giudicano:** Il test fallisce se il sistema va in crash, va in loop infinito, o lancia un'eccezione non gestita (es. `NullPointerException`, `SegFault`).
* **Pro & Contro:** Costano zero fatica e si ottengono gratis. Tuttavia generano molti falsi positivi e, soprattutto, non si accorgeranno mai di un bug logico (es. se calcoli il 22% di IVA ed esce il 10%, il programma non crasha, quindi l'oracolo implicito dirà "Pass").

### 2. Heuristic-based Oracles (Oracoli Euristici)
Sono un piccolo upgrade di quelli impliciti. Usano delle regole empiriche per indovinare se c'è un problema, senza però certezze assolute. (Es. se la risposta di una query a un DB vuoto pesa 5GB, l'oracolo euristico "sospetta" un'anomalia, anche se non c'è un crash).

### 3. Regression Oracles (Oracoli di Regressione)
Sono i giudici con la "memoria". Non sanno quale sia il risultato matematicamente corretto, ma si fidano ciecamente del passato.
* **Come giudicano:** Prendono la versione 1.0 del software (che si assume funzionante), registrano l'output per l'input `X`, e lo confrontano con l'output della versione 2.0. Se cambia, l'oracolo urla al fallimento.
* **Pro & Contro:** Straordinari per le attività di refactoring, ma completamente inutili se stai sviluppando una funzionalità totalmente nuova (perché non esiste un "passato" con cui confrontarsi).

### 4. Metamorphic Oracles (Oracoli Metamorfici)
Si usano per software così complessi che è impossibile sapere a priori il risultato esatto (es. motori di ricerca, calcoli scientifici o crittografia).
* **Come giudicano:** Sfruttano proprietà matematiche (relazioni metamorfiche). Non so dirti se il risultato di `sin(x)` sia corretto fino all'ultimo decimale, ma so per certo che in trigonometria `sin(x) == sin(x + 2π)`. Se i due output differiscono, l'oracolo segnala l'errore.

### 5. Specified Oracles (Oracoli a Specifica Formale)
Derivano da documenti matematici o grafici rigorosissimi (Macchine a Stati Finiti, diagrammi UML rigorosi, modelli Alloy). Il giudice ha in mano letteralmente la mappa del sistema. Sono potentissimi ma rarissimi nell'industria comune per via dell'altissimo costo di stesura dei modelli.

### 6. Property-based Assertion Oracles (Oracoli Assiomatici / Design by Contract)
È il cuore del tuo assignment W9.A7. Si basa sull'inserimento di "Asserzioni" direttamente nel codice o nei test, sfruttando la filosofia del *Design by Contract*.
Il contratto tra chi chiama il metodo (il Client) e il metodo stesso è composto da tre assiomi formali:
1. **Pre-condition (Precondizione):** I vincoli sull'input. È responsabilità del chiamante. (Es. "L'array non deve essere nullo").
2. **Post-condition (Postcondizione):** L'output garantito. È responsabilità del metodo. (Es. "Ti restituirò sempre un numero > 0").
3. **Exceptional Condition (Condizione Eccezionale):** Come reagisce il sistema se il contratto salta (es. "Se la stringa è vuota, lancio `IllegalArgumentException`").

## Trappole d'esame

:::caution[Cosa ti chiederà il professore all'orale]
**La differenza logica tra Post-condition e l'implicazione matematica.** La Postcondizione non è un'affermazione assoluta, ma *condizionata*. Il metodo garantisce l'output corretto **SOLO SE** la precondizione è stata rispettata. 
In logica si scrive: $Precondizione \rightarrow Postcondizione$. 
Se l'input fa schifo (Precondizione = Falsa), il contratto decade, e la Postcondizione viene valutata "banalmente vera" (vacuous truth) senza fare controlli sull'output, passando la palla alle Exceptional Conditions.
:::

## Autotest

1. Perché gli Implicit Oracles non sono sufficienti per testare la corretta implementazione delle regole di business?
2. Fai un esempio pratico in cui useresti un Oracolo di Regressione.
3. In cosa consiste un Oracolo Metamorfico? (Ricorda l'esempio matematico).
4. Nel paradigma degli Oracoli Assiomatici, di chi è la responsabilità di rispettare le Precondizioni?
5. Qual è l'utilità delle Exceptional conditions se abbiamo già stabilito le Precondizioni?

## Glossario

- **Test Oracle** - Meccanismo o algoritmo che determina se il risultato dell'esecuzione di un test corrisponde al comportamento atteso.
- **False Positive** - Quando un oracolo segnala un fallimento, ma il programma è in realtà corretto (spesso dovuto a oracoli impliciti troppo rigidi).
- **Design by Contract (DbC)** - Metodologia in cui i componenti software collaborano in base a obblighi reciproci rigorosamente definiti (precondizioni e postcondizioni).
- **Precondition** - Condizione che deve essere vera prima dell'esecuzione del metodo.
- **Postcondition** - Condizione che il metodo garantisce essere vera dopo la sua esecuzione, assumendo che la precondizione fosse valida.
- **Exceptional Condition** - Condizione di input (solitamente la violazione di una precondizione) che impone al metodo di terminare sollevando un'eccezione intenzionale.