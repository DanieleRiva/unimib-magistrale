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

- **Come funzionano:** Costruiscono una griglia in cui si elencano in verticale le "Condizioni" (le variabili di input) e le "Azioni" (gli output o risultati attesi). Ogni colonna rappresenta una singola regola o caso di test, ovvero una combinazione specifica di condizioni che scaturisce in un determinato output.
- **L'importanza dei Vincoli (Constraints):** Se abbiamo 5 condizioni booleane, le combinazioni matematiche sarebbero $2^5 = 32$. Tuttavia, spesso le condizioni non possono verificarsi tutte insieme nella realtà. Ad esempio, un cliente non può essere contemporaneamente "VIP" e "Utente Guest". Si usano i vincoli formali per sfoltire la tabella ed eliminare le combinazioni impossibili o illogiche:
  - `exactly-one(A, B, C)`: solo uno degli elementi può essere vero (es. la classe dell'auto noleggiata).
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
Si usa quando il sistema deve accettare, interpretare e validare input testuali o strutturati complessi (es. file XML, JSON, frammenti HTML, file di configurazione proprietari).

- **Come funzionano:** Si definisce una grammatica formale (solitamente in formato BNF - Backus Naur Form), con regole di produzione del tipo `<Elemento> ::= <SottoElemento>`. I casi di test sono le stringhe valide (e invalide) generate seguendo queste regole grammaticali.
- **Criteri di copertura:**
  - *Production coverage:* Ogni regola di produzione definita nella grammatica deve essere utilizzata per generare almeno un frammento di input nei casi di test.
  - *Boundary conditions sulle produzioni ricorsive:* È la metrica più critica per l'esame. Quando un elemento grammaticale può ripetersi $N$ volte (es. una lista di certificazioni di un dipendente), occorre testare i limiti di ripetizione. Si annota la produzione ricorsiva con un vincolo numerico $[min, max]$ (es. `[0, 5]`) e si generano input testuali che stressano questi confini:
    - Minimo (0)
    - Minimo + 1 (1)
    - Massimo - 1 (4)
    - Massimo (5)

## Trappole d'esame

:::caution[Gli errori classici da evitare all'orale]
- **Dimenticare i vincoli (Constraints) nella Decision Table:** Se consegni una tabella con combinazioni illogiche (es. un cliente ha noleggiato un SUV ma la classe dell'auto è contemporaneamente Economy), dimostri di aver fatto un mero prodotto cartesiano senza applicare la logica di business. I constraints servono proprio a pulire il modello.
- **Fare la somma degli sconti invece di moltiplicarli:** Negli assignment sui prezzi (vedi Car Rental), se i requisiti dicono che gli sconti si applicano in sequenza in modo moltiplicativo (*"Discounts stack multiplicatively"*), è un errore grave sommarli brutalmente (es. 10% + 5% = 15%). Bisogna applicare la formula: $(1 - 0.10) \times (1 - 0.05)$, ovvero calcolare lo sconto percentuale cumulato.
- **Ignorare i "Boundary" infiniti nella grammatica:** Se un elemento XML ha un attributo `maxOccurs="unbounded"` (ovvero può ripetersi all'infinito), il testing formale dei limiti diventa impossibile. Per procedere, è necessario imporre un limite **convenzionale** (es. 10) e dichiararlo esplicitamente per generare i test di confine.
:::

## Autotest

1. Qual è lo scopo primario del Model-Based testing rispetto alle tecniche di Structural Testing basate sul codice?
2. In una Decision Table, a cosa servono i vincoli logici come `exactly-one` o le implicazioni (`->`)?
3. Fai un esempio di sistema reale in cui useresti una Macchina a Stati Finiti (FSM) per derivare i test anziché una Decision Table.
4. Quali sono i quattro valori di confine da testare secondo il criterio delle *boundary conditions* per una produzione ricorsiva in una grammatica?
5. Se un elemento in uno schema XML è definito come `maxOccurs="unbounded"`, come adatti la grammatica per soddisfare i test sui limiti?

## Glossario

- **Model-based Testing** - Tecnica formale che deriva sistematicamente i test da modelli astratti del software, partendo dai requisiti.
- **Decision Table** - Modello tabulare utile per analizzare complesse regole di business combinando condizioni e azioni risultanti.
- **Constraints (Vincoli)** - Regole matematico-logiche applicate alle tabelle di decisione per invalidare combinazioni di input impossibili nel dominio reale.
- **Finite State Machine (FSM)** - Modello matematico che descrive il ciclo di vita di un sistema tramite stati e transizioni azionate da eventi.
- **Grammar-based Testing** - Tecnica per modellare gli input di un sistema come regole grammaticali formali (BNF), usate per generare stringhe di test valide e stressare i limiti strutturali.
- **Production (Produzione)** - Singola regola formale di derivazione all'interno di una grammatica.
- **Boundary Condition (Grammatica)** - Test sistematico dei limiti estremi di ripetizione per le regole grammaticali ricorsive.