---
title: Data Flow Analysis
description: Teoria - Analisi del flusso di dati (Cap. 6.2, 6.3), Reach, Avail, Live analysis e i set Gen/Kill.
sidebar:
  order: 6
---

## Il problema da cui tutto nasce

Mentre l'analisi delle dipendenze (Data e Control Dependence) ci aiuta a capire quali istruzioni influenzano altre istruzioni specifiche, la **Data Flow Analysis** (DFA) si pone domande più globali sulla validità dei dati lungo i cammini di esecuzione di un programma.

I compilatori e i tool di testing hanno costantemente bisogno di rispondere a domande come: *Questa variabile viene sempre inizializzata prima di essere letta?* *Il valore calcolato in questa espressione verrà mai utilizzato in futuro, o è codice morto?* *Posso riutilizzare il risultato di questo calcolo senza doverlo rifare?*

Poiché un programma può avere infiniti cammini di esecuzione a causa di cicli e diramazioni, non possiamo testarli tutti dinamicamente. La DFA risolve il problema staticamente, propagando insiemi di informazioni (chiamati convenzionalmente "fatti") lungo il Control Flow Graph (CFG) finché non si raggiunge uno stato di equilibrio (punto fisso).

:::tip[In sintesi]
La Data Flow Analysis calcola quali proprietà dello stato del programma sono matematicamente garantite in determinati punti del codice, a prescindere dallo specifico cammino di esecuzione che il programma seguirà a runtime.
:::

## Il motore della DFA: i set Gen e Kill

Tutte le classiche analisi data-flow funzionano con la stessa logica di base. Immagina che l'analizzatore statico abbia in mano una lavagna mentre cammina attraverso un nodo (un'istruzione o un basic block). Questo nodo può fare due cose rispetto alle informazioni che stiamo tracciando:

- **Generare (gen):** Creare un nuovo "fatto" valido. Ad esempio, assegnare un valore a una variabile genera una nuova definizione. È come scrivere col gesso sulla lavagna.
- **Uccidere (kill):** Invalidare un "fatto" precedente. Ad esempio, riassegnare una variabile sovrascrive e annulla la definizione precedente. È come usare il cancellino.

Ogni nodo riceve un insieme di informazioni in ingresso, rimuove ciò che uccide, aggiunge ciò che genera e produce un insieme di informazioni in uscita. L'equazione fondamentale di trasferimento di un nodo è un banale aggiornamento di stato (simile al calcolo del saldo del conto corrente: Saldo Iniziale meno le Spese più le Entrate).

## Le coordinate fondamentali: Direzione e Bivi

Per capire a fondo le analisi d'esame devi saper padroneggiare la combinazione di due movimenti fondamentali.

### La Direzione (Forward vs Backward)
Rappresenta il senso di marcia dell'analizzatore lungo i tubi del flusso di controllo.
- **Forward (In avanti):** L'analisi segue il flusso naturale del codice, dall'alto verso il basso. Ti posizioni dove viene creato un dato e ti chiedi quali saranno i suoi effetti procedendo verso la fine del programma.
- **Backward (All'indietro):** L'analisi viaggia controcorrente, dal basso verso l'alto. Ti posizioni dove un dato viene richiesto (es. un return) e risali il codice per verificare se quel calcolo sia effettivamente utile o se sia codice morto che nessuno leggerà mai.

### I Bivi (Any-path vs All-paths)
Rappresenta il comportamento dell'analizzatore quando due o più cammini si ricongiungono (ad esempio alla fine di un costrutto if-else). L'analizzatore si ritrova con due lavagne diverse provenienti dai due rami e deve fonderle insieme:
- **Any-path (Unione):** L'analizzatore adotta un approccio ottimista. Se un'informazione è vera anche in uno solo dei rami precedenti, la conserva nella lavagna finale usando l'operatore di Unione ($\cup$). Si usa quando basta che esista *almeno un cammino* valido.
- **All-paths (Intersezione):** L'analizzatore adotta un approccio paranoico e rigoroso. Tiene sulla lavagna finale solo le informazioni che compaiono su *tutti* i rami di provenienza, usando l'operatore di Intersezione ($\cap$). Se anche un solo cammino non garantisce quella proprietà, l'informazione viene scartata. Si usa per controlli critici di sicurezza.

## Le tre analisi classiche

### Reach Analysis (Reaching Definitions)
L'analisi valuta se un assegnamento fatto in un punto raggiunge un determinato uso senza essere intercettato e sovrascritto.
- **Classificazione:** Forward, Any-path.
- **Domanda chiave:** Esiste almeno un cammino lungo il quale la definizione della variabile raggiunge intatta questo punto del programma?

L'equazione di fusione raccoglie i dati aggregandoli dai predecessori tramite unione:
$$Reach(n) = \bigcup_{m \in pred(n)} ReachOut(m)$$

L'equazione di trasferimento aggiorna lo stato del nodo:
$$ReachOut(n) = (Reach(n) \setminus kill(n)) \cup gen(n)$$

I set interni sono definiti come:
- $gen(n) = \{v_n \mid v \text{ viene definita o modificata nel nodo } n\}$
- $kill(n) = \{v_x \mid v \text{ viene definita o modificata in un altro nodo } x \text{ del programma, con } x \neq n\}$

### Avail Analysis (Available Expressions)
L'analisi verifica se il calcolo di un'espressione è ancora valido o se i suoi operandi sono cambiati nel frattempo.
- **Classificazione:** Forward, All-paths.
- **Domanda chiave:** Posso evitare di ricalcolare questa espressione perché è stata sicuramente calcolata in passato su tutti i cammini possibili e nessuna delle sue variabili è stata modificata?

L'equazione di fusione esegue un controllo paranoico tramite intersezione:
$$Avail(n) = \bigcap_{m \in pred(n)} AvailOut(m)$$

L'equazione di trasferimento aggiorna le espressioni disponibili:
$$AvailOut(n) = (Avail(n) \setminus kill(n)) \cup gen(n)$$

I set interni sono definiti come:
- $gen(n) = \{exp \mid \text{l'espressione } exp \text{ viene calcolata nel nodo } n\}$
- $kill(n) = \{exp \mid \text{l'espressione } exp \text{ contiene una variabile che viene modificata o assegnata nel nodo } n\}$

### Live Analysis (Live Variables)
L'analisi risale il codice per determinare l'utilità futura delle variabili in essere.
- **Classificazione:** Backward, Any-path.
- **Domanda chiave:** Il valore attualmente contenuto in questa variabile verrà letto in futuro lungo almeno un cammino prima di essere sovrascritto?

L'equazione di fusione raccoglie i dati dai successori poiché si viaggia all'indietro:
$$Live(n) = \bigcup_{m \in succ(n)} LiveOut(m)$$

L'equazione di trasferimento aggiorna la vitalità risalendo il nodo:
$$LiveOut(n) = (Live(n) \setminus kill(n)) \cup gen(n)$$

I set interni sono definiti come:
- $gen(n) = \{v \mid v \text{ viene letta e usata nel nodo } n \text{ (un uso genera vitalità)}\}$
- $kill(n) = \{v \mid v \text{ viene sovrascritta e modificata nel nodo } n \text{ (l'assegnamento uccide il vecchio valore)}\}$

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

Analisi dei punti chiave per l'orale:
- **Al nodo 6** (`x = 1`): L'istruzione genera una definizione specifica per `x`, quindi $gen(6) = \{x_6\}$. Di conseguenza, questa istruzione uccide tutte le altre definizioni della variabile `x` presenti nel resto del programma, ovvero quelle alle righe 8 e 12. Avremo quindi $kill(6) = \{x_8, x_{12}\}$.
- **Al nodo 12** (`x = z * y`): Genera la sua definizione locale $gen(12) = \{x_{12}\}$ e uccide le definizioni alternative della stessa variabile poste altrove, determinando $kill(12) = \{x_6, x_8\}$.
- **Ai nodi di controllo come il nodo 3** (`if (n <= 0)`): Non avviene nessuna definizione o modifica di variabili locali, l'istruzione si limita a leggere. Nello schema della Reach Analysis, questo comporta che i suoi set siano completamente vuoti: $gen(3) = \emptyset$ e $kill(3) = \emptyset$.

## Trappole d'esame

:::caution[Gli errori che il professore va a cercare]
- **Sbagliare l'operatore matematico nei nodi di join:** Ricordati che le analisi *Any-path* (Reach, Live) fondono i dati con l'**Unione** ($\cup$), perché basta un solo cammino. Le analisi *All-paths* (Avail) fondono i dati con l'**Intersezione** ($\cap$), perché la proprietà deve essere garantita da tutte le provenienze.
- **Confondere l'uso con l'assegnamento:** Nel definire il set *Kill*, un'assegnazione (`x = 5`) uccide definizioni precedenti. Un semplice uso (`if (x > 0)`) non uccide nulla.
- **Confondere Reach e Live:** Reach viaggia in avanti (trova dove va a finire un dato). Live viaggia all'indietro (trova da dove servirà un dato).
:::

## Autotest

1. Spiega con parole tue cosa fa l'equazione `Out = (In \ Kill) U Gen`.
2. Perché la Reach Analysis usa l'Unione mentre l'Avail Analysis usa l'Intersezione?
3. Perché la Live Analysis si definisce "Backward"? Quali informazioni ricava dai successori?
4. Nel caso di una Live Analysis, cosa "uccide" il fatto che una variabile sia viva?
5. Qual è la differenza sostantiva tra ciò che popola i set Gen nella Reach (variabili) rispetto all'Avail (espressioni)?

## Glossario

- **Data Flow Analysis (DFA)** - Tecnica statica per calcolare la validità di informazioni e proprietà lungo i cammini di esecuzione del programma senza eseguirne il codice.
- **Reach Analysis** - Analisi di tipo forward e any-path utilizzata per tracciare quali definizioni di variabili raggiungono determinati punti d'uso nel codice.
- **Avail Analysis** - Analisi di tipo forward e all-paths utilizzata per determinare se un'espressione è stata calcolata e non modificata lungo tutti i cammini.
- **Live Analysis** - Analisi di tipo backward e any-path volta a determinare se il valore attuale di una variabile sarà letto in futuro prima di una ridefinizione.
- **Gen set** - Insieme delle informazioni o dei fatti di stato generati ex novo dall'esecuzione delle istruzioni contenute in un determinato nodo.
- **Kill set** - Insieme delle informazioni preesistenti che vengono invalidate o sovrascritte dall'esecuzione delle istruzioni di un determinato nodo.
- **Forward** - Direzione di analisi che si muove in avanti seguendo il normale flusso di esecuzione del programma dai predecessori ai successori.
- **Backward** - Direzione di analisi che si muove all'indietro risalendo il flusso di esecuzione del programma dai successori ai predecessori.
- **Any-path** - Quantificatore di percorso che richiede che una proprietà sia valida lungo almeno un cammino di esecuzione, implementato tramite unione.
- **All-paths** - Quantificatore di percorso che richiede che una proprietà sia tassativamente valida lungo tutti i cammini di esecuzione, implementato tramite intersezione.