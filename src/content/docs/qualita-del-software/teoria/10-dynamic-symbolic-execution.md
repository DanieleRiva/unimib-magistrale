---
title: Dynamic Symbolic Execution
description: Teoria sul Concolic Testing, limiti dell'esecuzione simbolica pura e la potenza della concretizzazione.
sidebar:
  order: 16
---

## L'Esecuzione Simbolica Pura non basta

Nel capitolo precedente abbiamo visto l'Esecuzione Simbolica Pura: un approccio matematico potentissimo che usa l'algebra per analizzare tutti i cammini di un programma. Tuttavia, nel mondo reale, questo approccio finisce per schiantarsi contro un muro invalicabile composto da tre enormi ostacoli:

1. **Matematica non lineare e Black-Box:** Se il codice esegue una funzione complessa (come un hash crittografico, un calcolo trigonometrico, o una chiamata di rete a un database esterno), il motore simbolico non può convertire queste operazioni in formule logiche. L'SMT Solver va in stallo e il ramo di esecuzione muore lì.
2. **Path Explosion:** Un semplice ciclo `while` che dipende da una variabile di input può generare infiniti cammini logici, esaurendo la memoria (RAM) dell'analizzatore in pochi secondi.
3. **Falsi allarmi nell'ambiente:** Senza un contesto reale di memoria e sistema operativo, l'engine può esplorare cammini che fisicamente non potrebbero mai verificarsi nell'architettura vera.

## La soluzione: Il Concolic Testing (DSE)

L'ingegneria del software moderna ha fuso l'esecuzione **CONCreta** e quella simb**OLICa** creando il **Concolic Testing**, tecnicamente noto come **Dynamic Symbolic Execution (DSE)**.

### La Metafora dell'Esploratore nel Labirinto
* **Esecuzione Simbolica Pura:** È come un matematico che si siede all'ingresso di un labirinto e cerca di risolverlo guardando la planimetria e scrivendo equazioni per ogni singola porta. Se trova una porta la cui mappa è illeggibile (una Black-Box), si blocca e non può più andare avanti.
* **Concolic Testing:** È un esploratore che *cammina fisicamente* dentro il labirinto. Mentre cammina, tiene un quaderno su cui annota la planimetria (lo Stato Simbolico). Se trova una porta incomprensibile, smette di fare calcoli, guarda semplicemente qual è il numero scritto sulla maniglia in quel momento, lo appunta sul quaderno (Concretizzazione) e continua a camminare in base alla realtà dei fatti.

## Come funziona il DSE (L'algoritmo)

L'engine DSE lavora in un loop di scoperta continua:

1. **Seme Concreto (Concrete Seed):** Si lancia il programma con degli input numerici reali casuali o forniti dal tester (es. `x = 10`). Il programma gira fisicamente sulla CPU a velocità normale.
2. **Tracciamento Ombra (Shadow Tracking):** Mentre il programma gira concretamente, l'engine traccia parallelamente lo Stato Simbolico e costruisce la Path Condition (PC) seguendo solo ed esclusivamente il cammino che i numeri concreti stanno percorrendo.
3. **La Negazione Strategica:** Arrivato in fondo al programma, l'engine ha in mano una PC, per esempio: `X > 0 AND Y < 5`. Per scoprire una nuova area del codice, l'engine prende quest'ultima condizione e la **nega**: `X > 0 AND NOT(Y < 5)`.
4. **La Chiamata al Solver:** Invia la PC negata all'SMT Solver e gli dice: *"Dammi dei nuovi numeri concreti che rispettino questa nuova equazione"*. Il solver sputa fuori un nuovo input (es. `x = 10, y = 8`).
5. **Nuovo Giro:** L'engine riavvia il programma con i nuovi numeri. Questa volta, arrivato al bivio, il programma prenderà un cammino diverso, scoprendo nuovo codice. Il loop si ripete finché tutti i cammini non sono stati esplorati o scade il tempo.

## Il superpotere: La Concretizzazione (Concretization)

Cosa fa il DSE se l'SMT Solver si arrende davanti a un'espressione matematica troppo complessa per l'algebra?
Semplicemente, **bara a fin di bene**. L'engine sospende il calcolo simbolico, guarda la memoria RAM del computer per vedere quanto vale *concretamente* quella variabile in quel preciso istante, e sostituisce il simbolo algebrico con quel numero fisso. 
Trasformando un'equazione complessa in una costante numerica, l'engine riesce a bypassare l'ostacolo e proseguire l'analisi del resto del programma.

## Autotest

1. Qual è il significato della parola "Concolic" e perché rappresenta un'evoluzione?
2. Spiega con parole tue in cosa consiste l'operazione di "Negazione" al termine di un'esecuzione Concolic.
3. Come reagisce l'Esecuzione Simbolica pura di fronte a una chiamata di rete, e come reagisce invece la Dynamic Symbolic Execution?
4. Cos'è la "Concretizzazione" in questo ambito?

## Glossario

- **DSE (Dynamic Symbolic Execution)** - Analisi dinamica che esegue il software con input concreti, calcolando parallelamente i vincoli simbolici per generare nuovi test.
- **Concolic Testing** - Il nome industriale e più diffuso della DSE. Deriva dalla fusione di *Concrete* e *Symbolic*.
- **Concrete Seed** - I valori iniziali reali (es. array, interi) forniti all'engine per avviare il primo giro di esecuzione.
- **Concretization** - Il processo in cui un'espressione simbolica irrisolvibile viene sovrascritta con il suo valore numerico campionato a runtime.