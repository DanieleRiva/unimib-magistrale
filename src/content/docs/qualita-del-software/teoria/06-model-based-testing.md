---
title: Model-Based Testing
description: Teoria - Test basato su modelli (Cap. 14), Decision Tables, Macchine a Stati Finiti e Grammatiche.
sidebar:
  order: 10
---

## Il problema da cui tutto nasce

Fino ad ora abbiamo estratto i casi di test guardando il codice sorgente (Structural Testing / DFA) o la logica interna dei singoli metodi. Tuttavia, i software reali devono rispettare **regole di business complesse**, come ad esempio: *se il cliente è VIP, ed è martedì, e ha comprato 3 articoli, applica il 10% di sconto, a meno che...*

Testare queste regole andando a tentoni o leggendo solo il codice è pericolosissimo. Se il programmatore si è dimenticato di implementare una regola prevista dalle specifiche (un bug di omissione), ispezionare il codice non rivelerà mai l'errore. La soluzione è il **Model-Based Testing**: si prendono le specifiche funzionali (i requisiti scritti in linguaggio naturale o nei documenti aziendali), le si traduce in un modello matematico/logico rigoroso, e da quel modello si estraggono sistematicamente i casi di test prima ancora di scrivere il codice.

:::tip[In sintesi]
Il Model-Based testing sposta l'attenzione dal codice ai requisiti. Si costruisce un modello astratto (una tabella, un grafo o una grammatica) che descrive rigorosamente "cosa" il sistema deve fare, e lo si usa per generare test che verifichino che il sistema lo faccia davvero, coprendo tutte le casistiche aziendali.
:::

## Tre modelli per tre scenari

A seconda della natura dei requisiti, si utilizzano tre tipologie principali di modelli per derivare i casi di test.

### 1. Decision Tables (Tabelle di Decisione)
Si usano quando le specifiche descrivono regole di business basate su complesse combinazioni di condizioni logiche (tipico dei sistemi di calcolo prezzi, assicurazioni, sconti e idoneità).

- **Come si legge una Decision Table:** 
  A differenza di un normale foglio Excel, una Decision Table **si legge esclusivamente in verticale, dall'alto verso il basso**. 
  - La prima colonna a sinistra elenca le "domande" (Condizioni) e il risultato atteso (Azione/Output).
  - Le colonne successive (C1, C2, C3...) rappresentano i **Singoli Casi di Test**. Ogni colonna è un "Cliente Immaginario" indipendente con una sua specifica combinazione di risposte. La riga in fondo alla colonna è "la fattura" calcolata per quel cliente.

- **T, F e i Trattini (Don't Care):**
  Nelle celle inseriamo:
  - `T` (True) se quella condizione è attiva per quel cliente.
  - `F` (False) se la condizione non è attiva.
  - `-` (**Don't Care Condition**). Questo è il segreto delle tabelle. Il trattino significa: *"Per questo specifico test, non mi interessa il valore di questa variabile, il risultato sarà lo stesso"*. Serve a comprimere la tabella evitando centinaia di colonne inutili o ridondanti. Quando devi scrivere il codice Java per una colonna con un trattino, sei libero di scegliere a tuo piacimento se passare `T` o `F`.

- **L'importanza dei Vincoli (Constraints):** Se abbiamo 5 condizioni booleane, le combinazioni matematiche sarebbero $2^5 = 32$. Tuttavia, spesso le condizioni non possono verificarsi tutte insieme. Ad esempio, un'auto noleggiata non può essere contemporaneamente un "SUV" e un'"Economy". Si usano i vincoli formali per sfoltire la tabella ed eliminare le colonne illogiche:
  - `exactly-one(A, B, C)`: solo uno degli elementi può essere vero.
  - `at-most-one(A, B)`: o uno, o nessuno, ma mai entrambi.
  - `A -> B`: se è vero A, allora deve per forza essere vero anche B (Implicazione).

- **Criteri di copertura:**
  - *Basic condition adequacy criterion:* Richiede almeno un caso di test per ogni colonna valida e sensata della tabella (dopo aver rimosso quelle rese impossibili dai constraints).

### 2. Finite State Machines (Macchine a Stati Finiti)
Si usano quando le specifiche descrivono il ciclo di vita di un'entità, in cui il comportamento o le azioni disponibili cambiano a seconda dello stato in cui l'entità si trova (es. il carrello di un e-commerce, un ordine di spedizione, un processo di prenotazione).

- **Come funzionano:** I nodi del grafo rappresentano gli Stati del sistema (es. "In attesa di pagamento", "Spedito"), mentre gli archi direzionali rappresentano le Transizioni, scatenate da determinati Eventi (es. "Utente paga l'ordine").
- **Criteri di copertura:**
  - *State coverage:* La test suite deve generare sequenze di eventi tali da visitare almeno una volta tutti i nodi (stati) possibili.
  - *Transition coverage:* Criterio più forte; la test suite deve percorrere almeno una volta tutti gli archi (transizioni) del grafo, per verificare che il sistema sappia passare da uno stato all'altro correttamente per ogni evento ammissibile.

### 3. Grammar-based Testing (Test su Grammatiche)
Si usa quando il sistema deve accettare, interpretare e validare input testuali o strutturati complessi (es. file XML, JSON, frammenti HTML, file di configurazione proprietari). Non puoi testare questi sistemi passandogli testo a caso; devi usare un generatore che parli la loro lingua.

- **Come funzionano le regole (BNF):** Si definisce una grammatica formale (Backus-Naur Form). È una "ricetta" che insegna al generatore come costruire stringhe valide.
  - `<nome>`: Le parole tra parentesi angolari (Non-terminali) sono i "contenitori" astratti da espandere (es. `<pasto>`).
  - `::=`: Si legge "è composto da" o "si espande in".
  - `|`: È l'OR logico. Significa "oppure". Esempio: `<pasto> ::= <pizza> | <hamburger>`.

- **Il trucco della Ricorsione:** I file XML contengono spesso liste (es. lista di dipartimenti). Nelle grammatiche non esistono i cicli `for`, quindi per generare una lista si usa la ricorsione. Si dice che una `<lista>` è composta da un singolo `<elemento>` attaccato a un'altra `<lista>`, *oppure* da un singolo `<elemento>` che chiude la catena.
  Esempio: `<departmentList> ::= <department> <departmentList> | <department>`

- **Criteri di copertura e "Bounds":**
  - *Boundary conditions sulle produzioni ricorsive:* È la metrica più critica per l'esame. Se una lista XML non ha limiti (`unbounded`), l'unico modo per fare test ingegneristici è imporre un limite convenzionale (Bound) scrivendolo tra parentesi quadre prima della regola (es. `[10] <departmentList>`). Questo dice al tester di generare casi limite per stressare la struttura:
    - Minimo (0 ripetizioni)
    - Minimo + 1 (1 ripetizione)
    - Massimo - 1 (9 ripetizioni)
    - Massimo (10 ripetizioni)

## Trappole d'esame

:::caution[Gli errori classici da evitare all'orale]
- **Dimenticare i vincoli (Constraints) nella Decision Table:** Se consegni una tabella con combinazioni illogiche (es. un cliente ha noleggiato un SUV ma la classe dell'auto è contemporaneamente Economy), dimostri di aver fatto un mero prodotto cartesiano senza applicare la logica di business. I constraints servono proprio a pulire il modello.
- **Fare la somma degli sconti invece di moltiplicarli:** Negli assignment sui prezzi (vedi Car Rental), se i requisiti dicono che gli sconti si applicano in sequenza in modo moltiplicativo (*"Discounts stack multiplicatively"*), è un errore grave sommarli brutalmente (es. 10% + 5% = 15%). Bisogna applicare la formula: $(1 - 0.10) \times (1 - 0.05)$, ovvero calcolare lo sconto percentuale cumulato.
- **Leggere le Decision Tables in orizzontale:** È un errore concettuale grave. Ricorda: si scende colonna per colonna, calcolando la fattura finale (l'Azione) in base alle "T" e alle "F" incontrate durante la discesa.
:::

## Autotest

1. Qual è lo scopo primario del Model-Based testing rispetto alle tecniche di Structural Testing basate sul codice?
2. Nelle Decision Tables, come si leggono i dati e cosa rappresenta ogni colonna?
3. A cosa serve il trattino `-` (Don't Care condition) in una colonna e che vantaggio pratico porta?
4. Fai un esempio pratico in cui useresti una Macchina a Stati Finiti (FSM) per derivare i test anziché una Decision Table.
5. In una grammatica BNF, come fai a dire al generatore di test di creare un elemento ripetuto al massimo 5 volte?
6. Quali sono i quattro valori di confine da testare secondo il criterio delle *boundary conditions* per una produzione ricorsiva in una grammatica?

## Glossario

- **Model-based Testing** - Tecnica formale che deriva sistematicamente i test da modelli astratti del software, partendo dai requisiti.
- **Decision Table** - Modello tabulare utile per analizzare complesse regole di business combinando condizioni e azioni risultanti. Si legge verticalmente.
- **Don't Care Condition (`-`)** - Simbolo che indica l'irrilevanza di una specifica condizione in un caso di test, utile per comprimere la tabella riducendo le colonne duplicate.
- **Constraints (Vincoli)** - Regole matematico-logiche applicate alle tabelle di decisione per invalidare e rimuovere combinazioni di input impossibili nel dominio reale.
- **Finite State Machine (FSM)** - Modello matematico che descrive il ciclo di vita di un sistema tramite stati e transizioni azionate da eventi.
- **Grammar-based Testing** - Tecnica per modellare gli input di un sistema come regole grammaticali formali (BNF), usate per generare stringhe di test valide e stressare i limiti strutturali.
- **Production (Produzione)** - Singola regola formale di derivazione all'interno di una grammatica (es. `::=`).
- **Boundary Condition (Grammatica)** - Test sistematico dei limiti estremi di ripetizione per le regole grammaticali ricorsive chiuse da un Bound numerico (es. `[10]`).