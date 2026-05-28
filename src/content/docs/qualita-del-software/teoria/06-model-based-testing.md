---
title: Model-Based Testing
description: Teoria - Test basato su modelli (Cap. 14), Decision Tables, Macchine a Stati Finiti e Grammatiche.
sidebar:
  order: 10
---

## Il problema da cui tutto nasce

Fino ad ora abbiamo estratto i casi di test guardando il codice sorgente (Structural Testing / DFA) o la logica dei singoli metodi. Tuttavia, i software reali devono rispettare regole di business complesse: *se il cliente è VIP, ed è martedì, e ha comprato 3 articoli, applica il 10% di sconto, a meno che...*

Testare queste regole andando a tentoni o leggendo il codice è pericolosissimo, perché se il programmatore si è dimenticato di implementare una regola, guardando il codice non ce ne accorgeremo mai. La soluzione è il **Model-Based Testing**: si prendono le specifiche funzionali (i requisiti scritti in linguaggio naturale), le si traduce in un modello matematico/logico rigoroso, e da quel modello si estraggono sistematicamente i casi di test.

:::tip[In sintesi]
Il Model-Based testing sposta l'attenzione dal codice ai requisiti. Si costruisce un modello astratto (una tabella, un grafo o una grammatica) che descrive "cosa" il sistema deve fare, e lo si usa per generare test che verifichino che il codice lo faccia davvero.
:::

## Tre modelli per tre scenari

A seconda di come sono scritti i requisiti, il professore identifica tre modelli principali per derivare i test.

### 1. Decision Tables (Tabelle di Decisione)
Si usano quando le specifiche descrivono regole di business basate su combinazioni di condizioni logiche (tipico dei sistemi di e-commerce, calcolo prezzi, sconti).

- **Come funzionano:** Si elencano in verticale le "Condizioni" (gli input) e in basso le "Azioni" (gli output attesi). Ogni colonna rappresenta una regola, ovvero una combinazione specifica di condizioni che porta a un certo output.
- **I Vincoli (Constraints):** Spesso le condizioni non possono verificarsi tutte insieme. Ad esempio, un cliente non può essere contemporaneamente "VIP" e "Nuovo Registrato". Si usano vincoli formali per pulire la tabella dalle combinazioni impossibili:
  - `exactly-one(A, B, C)`: solo uno può essere vero.
  - `at-most-one(A, B)`: o uno, o nessuno, ma non entrambi.
  - `A -> B`: se è vero A, allora deve essere vero anche B.
- **Criteri di copertura:**
  - *Basic condition adequacy:* Almeno un caso di test per ogni colonna della tabella.
  - *Compound condition / MC/DC:* Si espandono le colonne testando le variazioni di singole condizioni che fanno cambiare il risultato.

### 2. Finite State Machines (Macchine a Stati Finiti)
Si usano quando le specifiche descrivono il ciclo di vita di un'entità, dove il comportamento cambia a seconda dello stato in cui si trova (es. un carrello acquisti, una prenotazione, un processo di riparazione in garanzia).

- **Come funzionano:** I nodi sono gli Stati (es. "In attesa", "Riparato"), gli archi sono le Transizioni scatenate da eventi (es. "Accetta preventivo").
- **Criteri di copertura:**
  - *State coverage:* I test devono visitare almeno una volta tutti i nodi.
  - *Transition coverage:* I test devono percorrere almeno una volta tutti gli archi (più forte dello state coverage).

### 3. Grammar-based Testing (Test su Grammatiche)
Si usa quando il sistema deve accettare e validare input testuali o strutturati complessi (es. file XML, HTML, file di configurazione, JSON).

- **Come funzionano:** Si definisce una grammatica formale (in formato BNF, con produzioni del tipo `<Elemento> ::= <SottoElemento>`). I casi di test sono le stringhe generate seguendo le regole della grammatica.
- **Criteri di copertura:**
  - *Production coverage:* Ogni regola di produzione della grammatica deve essere usata per generare almeno un frammento di test case.
  - *Boundary conditions sulle produzioni ricorsive:* È la metrica più importante all'esame. Quando un elemento può ripetersi N volte (es. una lista di progetti), bisogna testare i confini. Si annota la produzione con un min e un max (es. `[0, 10]`) e si generano stringhe lunghe:
    - Minimo (0)
    - Minimo + 1 (1)
    - Massimo - 1 (9)
    - Massimo (10)

## Trappole d'esame

:::caution[Gli errori che il professore va a cercare]
- **Dimenticare i vincoli (Constraints) nella Decision Table:** Se generi combinazioni illogiche (es. un'auto che è contemporaneamente un SUV e un'Economy), dimostri di non aver ripulito il modello prima di estrarre i test.
- **Fare la somma degli sconti invece di moltiplicarli:** Negli assignment sui prezzi (vedi Car Rental), se i requisiti dicono che gli sconti si applicano "in sequenza" (stack), non devi fare 10% + 5% = 15%, ma devi moltiplicarli: prezzo * 0.90 * 0.95.
- **Ignorare i "Boundary" nella grammatica:** Se una lista XML non ha un limite massimo definito (`unbounded`), per poter applicare il Boundary Testing devi imporre tu un limite convenzionale ragionevole (es. 10) e dichiararlo apertamente.
:::

## Autotest

1. Qual è lo scopo primario del Model-Based testing rispetto alle tecniche strutturali?
2. In una Decision Table, a cosa servono i vincoli logici come `at-most-one` o le implicazioni logiche?
3. Fai un esempio di sistema reale in cui useresti una Macchina a Stati Finiti per derivare i test anziché una Decision Table.
4. Quali sono i quattro valori da testare secondo il criterio delle boundary conditions nel Grammar-based testing?
5. Se un elemento XML ha l'attributo `maxOccurs="unbounded"`, come puoi applicare il test dei confini alla grammatica?

## Glossario

- **Model-based Testing** - Tecnica in cui i test vengono derivati sistematicamente da un modello astratto del software, costruito a partire dai requisiti funzionali.
- **Decision Table** - Modello tabellare che mappa una serie di condizioni booleane in azioni o output specifici.
- **Constraints (Vincoli)** - Regole logiche applicate a una Decision Table per eliminare le combinazioni di input impossibili nel dominio reale.
- **Finite State Machine (FSM)** - Modello matematico del ciclo di vita di un sistema, composto da stati e transizioni scatenate da eventi.
- **Grammar-based Testing** - Tecnica che modella gli input complessi come regole grammaticali (BNF) per generare sistematicamente stringhe di test valide e ai limiti.
- **Production (Produzione)** - Singola regola di derivazione all'interno di una grammatica formale.
- **Boundary Condition (Grammatica)** - Test sistematico dei limiti di ripetizione per le regole grammaticali ricorsive (min, min+1, max-1, max).