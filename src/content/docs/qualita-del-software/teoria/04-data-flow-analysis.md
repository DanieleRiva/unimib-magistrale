---
title: Data Flow Analysis
description: Teoria - Analisi del flusso di dati (Cap. 6.2, 6.3), Reach, Avail, Live analysis e i set Gen/Kill.
sidebar:
  order: 6
---

## Il problema da cui tutto nasce

Mentre l'analisi delle dipendenze (Data e Control Dependence) ci aiuta a capire quali istruzioni influenzano altre istruzioni specifiche, la **Data Flow Analysis** (DFA) si pone domande più globali sulla validità dei dati lungo i cammini di esecuzione di un programma. 

I compilatori e i tool di testing hanno costantemente bisogno di rispondere a domande come: *Questa variabile viene sempre inizializzata prima di essere letta?* *Il valore calcolato in questa espressione verrà mai utilizzato in futuro, o è codice morto?* *Posso riutilizzare il risultato di questo calcolo senza doverlo rifare?*

Poiché un programma può avere infiniti cammini di esecuzione a causa di cicli e diramazioni, non possiamo testarli tutti dinamicamente. La DFA risolve il problema staticamente, propagando insiemi di informazioni lungo il Control Flow Graph (CFG) finché non si raggiunge uno stato di equilibrio.

:::tip[In sintesi]
La Data Flow Analysis calcola quali "fatti" (definizioni di variabili, espressioni, o usi) sono veri in determinati punti del programma, a prescindere dallo specifico cammino di esecuzione che il programma seguirà a runtime.
:::

## Il motore della DFA: i set Gen e Kill

Tutte le classiche analisi data-flow funzionano con la stessa logica di base. Quando l'esecuzione passa attraverso un nodo (un'istruzione o un basic block), questo nodo può generare o invalidare informazioni:
- **Generare (gen):** creare un nuovo "fatto" valido (es. definire una variabile o calcolare un'espressione).
- **Uccidere (kill):** invalidare un "fatto" precedente (es. riassegnare una variabile sovrascrivendo la definizione precedente).

Ogni nodo riceve un insieme di informazioni in ingresso, rimuove ciò che uccide, aggiunge ciò che genera e produce un insieme di informazioni in uscita. 

## Le tre analisi classiche

Il corso si concentra su tre tipi principali di analisi, classificate in base alla direzione (Forward/Backward) e alla quantificazione dei cammini (Any-path/All-paths).

### 1. Reach Analysis (Reaching Definitions)
- **Classificazione:** Forward, Any-path.
- **Domanda:** La definizione di una variabile `v` al punto `d` *raggiunge* l'uso al punto `u`? Ovvero, esiste **almeno un cammino** da `d` a `u` senza ridefinizioni intermedie?
- **A cosa serve:** Verificare la validità in avanti dei valori, identificando ad esempio definizioni morte.
- **Formule formali**:
  L'equazione di fusione unisce gli output dei predecessori:
  $$Reach(n) = \bigcup_{m \in pred(n)} ReachOut(m)$$
  Il calcolo del singolo nodo:
  $$ReachOut(n) = (Reach(n) \setminus kill(n)) \cup gen(n)$$
  I set Gen e Kill:
  $gen(n) = \{v_n \mid v \text{ is defined or modified at } n\}$
  $kill(n) = \{v_x \mid v \text{ is defined or modified at } x, x \neq n\}$

### 2. Avail Analysis (Available Expressions)
- **Classificazione:** Forward, All-paths.
- **Domanda:** Un'espressione è già stata calcolata e il suo valore non è stato successivamente modificato lungo **tutti i cammini** che portano a questo punto?
- **A cosa serve:** Riutilizzare valori di sotto-espressioni (ottimizzazione) o verificare inizializzazioni sicure.
- **Formule formali**:
  L'equazione di fusione interseca gli output dei predecessori:
  $$Avail(n) = \bigcap_{m \in pred(n)} AvailOut(m)$$
  Il calcolo del singolo nodo:
  $$AvailOut(n) = (Avail(n) \setminus kill(n)) \cup gen(n)$$
  I set Gen e Kill:
  $gen(n) = \{exp \mid exp \text{ is computed at } n\}$
  $kill(n) = \{exp \mid exp \text{ in } m \neq n \text{ has variable assigned at } n\}$

### 3. Live Analysis (Live Variables)
- **Classificazione:** Backward, Any-path.
- **Domanda:** Una variabile è "viva"? Ovvero, esiste **almeno un cammino** futuro su cui verrà utilizzata prima di essere sovrascritta?
- **A cosa serve:** Trovare assegnamenti inutili o valori che non verranno mai usati.
- **Formule formali**:
  L'equazione di fusione unisce gli input dei successori:
  $$Live(n) = \bigcup_{m \in succ(n)} LiveOut(m)$$
  Il calcolo del singolo nodo:
  $$LiveOut(n) = (Live(n) \setminus kill(n)) \cup gen(n)$$
  I set Gen e Kill:
  $gen(n) = \{v \mid v \text{ is used at } n\}$
  $kill(n) = \{v \mid v \text{ is modified at } n\}$

## Esempio del Prof: Reach Analysis passo-passo

Nelle slide viene analizzato il calcolo di `gen` e `kill` per il seguente frammento di codice:

```java
1  public int compute(int n) {
2    int x, y, z;
3    if (n <= 0) {
4      return 0;
5    } else if (n == 1) {
6      x = 1;
7    } else {
8      x = 1;
9      y = 2;
10     while (x <= n) {
11       z = x;
12       x = z * y;
13       y = z;
14       if (x == y * z) {
15         return x;
16       }
17     }
18   }
19   return x;
20 }
```

*Analisi chiave da ricordare all'orale*:
- Al nodo **6** (`x = 1`), il generatore è la variabile stessa: $gen(6) = \{x_6\}$. Il kill set include tutte le altre definizioni di `x` nel programma: $kill(6) = \{x_8, x_{12}\}$.
- Al nodo **12** (`x = z * y`), similmente: $gen(12) = \{x_{12}\}$, e uccide le altre definizioni $kill(12) = \{x_6, x_8\}$.
- Nei nodi di controllo come **3** (`if(n <= 0)`), non c'è definizione o modifica di variabili locali, quindi $gen(3) = \emptyset$ e $kill(3) = \emptyset$.

## Trappole d'esame

:::caution[Gli errori che il professore va a cercare]
- **Sbagliare l'operatore matematico nei nodi di join:** Ricordati che le analisi *Any-path* (Reach, Live) fondono i dati con l'**Unione** ($\cup$), perché basta un solo cammino. Le analisi *All-paths* (Avail) fondono i dati con l'**Intersezione** ($\cap$), perché la proprietà deve essere garantita da tutte le provenienze.
- **Confondere l'uso con l'assegnamento:** Nel definire il set *Kill*, un'assegnazione (`x = 5`) uccide definizioni precedenti. Un semplice uso (`if (x > 0)`) non uccide nulla.
- **Confondere Reach e Live:** Reach viaggia in avanti (trova dove va a finire un dato). Live viaggia all'indietro (trova da dove servirà un dato).
:::

## Autotest

1. Qual è la differenza strutturale tra un'analisi Any-path e un'analisi All-paths quando due flussi di controllo si uniscono?
2. Scrivi a memoria l'equazione di un nodo per l'analisi Avail.
3. Perché l'analisi Live si dice "Backward"? Quali informazioni ricava dai successori?
4. Nel caso di una Live Analysis, cosa "uccide" il fatto che una variabile sia viva?
5. Qual è la differenza sostantiva tra ciò che popola i set Gen nella Reach (variabili) rispetto all'Avail (espressioni)?

## Glossario

- **Data Flow Analysis (DFA)** - tecnica statica per calcolare la validità di informazioni lungo i cammini di esecuzione.
- **Reach Analysis** - analisi forward/any-path per tracciare quali definizioni raggiungono determinati punti del programma.
- **Avail Analysis** - analisi forward/all-paths per determinare se un'espressione o una variabile è stata sicuramente calcolata su tutti i cammini.
- **Live Analysis** - analisi backward/any-path per determinare se il valore attuale di una variabile verrà mai usato in futuro prima di essere modificato.
- **Gen set** - insieme di fatti creati in un nodo.
- **Kill set** - insieme di fatti invalidati (sovrascritti) in un nodo.
- **Forward / Backward** - direzione di propagazione delle equazioni (dai predecessori o dai successori).
- **Any-path / All-paths** - quantificatore dell'analisi (esiste almeno un cammino vs vale per tutti i cammini).
```