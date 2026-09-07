---
title: Architetture Dati - Domande d'esame
description: Le 9 domande di teoria unificate uscite negli appelli passati, ordinate e arricchite con la frequenza di uscita.
sidebar:
  order: 1
  badge:
    text: Esame
    variant: tip
---

Di seguito la tabella riepilogativa con le frequenze di uscita negli appelli passati. Inizia a studiare dalle prime tre, che rappresentano i temi più ricorrenti.

| Argomento / Domanda | Frequenza negli appelli |
| :--- | :---: |
| **1. Cassandra: Scalabilità e gestione dei guasti** | **2** |
| **2. Two-Phase Commit (2PC): Gestione delle cadute** | **2** |
| **3. Metriche di Qualità dei Dati (e completezza)** | **2** |
| 4. Query plan distribuiti vs centralizzati | 1 |
| 5. Conflitti a livello di istanza | 1 |
| 6. Data exploration in un sistema di ML | 1 |
| 7. Modello documentale vs modello a grafo | 1 |
| 8. Protocollo ROWA | 1 |
| 9. Teorema CAP e MongoDB | 1 |

---

## 1. Cassandra: Scalabilità e gestione dei guasti

> Si illustri come Cassandra gestisce la scalabilità, la scoperta di un nodo caduto e la sua sostituzione. *(Unione di due domande)*

Cassandra garantisce altissima disponibilità e scalabilità implementando un'architettura rigorosamente peer-to-peer ad anello, eliminando ogni Single Point of Failure[cite: 5]. Scalare orizzontalmente è semplice e trasparente: un nuovo nodo può essere aggiunto o rimosso dall'anello tramite il meccanismo di hashing senza che l'intero sistema vada offline[cite: 5].

Per rilevare un nodo caduto, mancando un controllore centrale, i nodi si monitorano a vicenda tramite il protocollo Gossip, comunicando tra vicini in modo epidemico per condividere lo stato della rete[cite: 5]. Cassandra si affida all'Accrual Failure Detector, che non restituisce un semplice verdetto booleano (vivo/morto) o un timeout rigido, ma assegna una probabilità di guasto calcolata dinamicamente sulle condizioni e i ritardi del traffico di rete[cite: 5]. Quando il valore supera la soglia, il nodo viene considerato offline[cite: 5].

Per gestire il successivo riallineamento (anti-entropia) e la sostituzione senza dover trasferire l'intero dataset, Cassandra utilizza un albero di hashing crittografico chiamato Merkle Tree[cite: 5]. I nodi si passano solo il "top hash" e scendono nell'albero gerarchico solo se trovano discrepanze, localizzando così rapidamente l'origine del problema per risincronizzare esclusivamente le repliche mancanti[cite: 5].

---

## 2. Two-Phase Commit (2PC): Gestione delle cadute

> Cosa succede nel protocollo Two Phase Commit (2PC) in caso di caduta del Transaction Manager (TM) o di un Resource Manager (RM)? *(Unione di due domande)*

Nel protocollo 2PC ogni entità scrive la propria intenzione di agire sul log persistente prima di eseguire l'azione[cite: 11]. Le conseguenze di un guasto dipendono da chi cade e in quale fase[cite: 11].

**Caduta del Resource Manager (RM):**
Non blocca il sistema a tempo indeterminato[cite: 11]. Si distinguono tre casi[cite: 11]:
1. **Fase 1 (Prima di rispondere):** Cade prima di poter salvare "READY" sul log[cite: 11]. Il TM fa scattare il timeout, lancia un Global-Abort e la transazione fallisce in sicurezza[cite: 11].
2. **Finestra di Incertezza:** Cade dopo aver scritto "READY" sul log e votato affermativamente, ma prima della "Global Decision"[cite: 11]. Al riavvio, il nodo ritrova il record READY, ristabilisce i lock e cerca il TM (o interroga gli altri RM) per conoscere l'esito perso durante il downtime e completarlo[cite: 11].
3. **Fase 2 (Dopo l'ordine):** Cade durante o dopo aver eseguito il commit/abort[cite: 11]. Al riavvio, il log riporterà le azioni eseguite[cite: 11]. Essendo operazioni ripetibili (idempotenti), si rimetterà in pari e rinvierà l'ACK di conferma al TM[cite: 11].

**Caduta del Transaction Manager (TM):**
La "global decision" (Commit o Abort) avviene quando il TM la scrive sul proprio log, rendendola irrevocabile[cite: 11]. Se il TM cade subito dopo questa scrittura, ma prima di averne effettuato il broadcast, si entra nella "finestra di incertezza"[cite: 11]. Gli RM hanno i lock locali attivi e hanno scritto "Ready", ma non potendo agire autonomamente rimangono bloccati (il 2PC è *bloccante* per design)[cite: 11]. La situazione si sblocca solo al riavvio del TM, che leggendo il log nota la decisione presa ma priva del record "complete"[cite: 11]. A quel punto il TM ritrasmette la decisione globale recuperata dal log agli RM, forzandoli a chiudere la transazione e liberare i lock[cite: 11].

---

## 3. Metriche di Qualità dei Dati

> Spiegare le metriche per definire la qualità di un dato, definendo accuratezza, consistenza (con esempio) e completezza. *(Unione di due domande)*

La qualità del dato valuta la sua capacità di essere "fit for use" (adatto allo scopo) tramite metriche oggettive e soggettive[cite: 8, 10]. Le metriche primarie sono[cite: 9, 10]:

* **Accuratezza:** La vicinanza del dato al valore del mondo reale[cite: 9]. Si divide in *sintattica* (il rispetto del dominio o vocabolario, es. "Marco" è corretto, "Mrtin" no) e *semantica* (se descrive il vero stato della realtà)[cite: 9].
* **Consistenza:** Il rispetto di regole e vincoli intra-tupla o relazionali (business rules)[cite: 9]. Un dato può essere sintatticamente accurato ma inconsistente: immaginiamo la tupla "Città: Roma" e "CAP: 20121"[cite: 9]. Presi singolarmente i valori sono perfetti, ma inseriti nella tupla diventano inconsistenti perché collidono logicamente (20121 è un CAP di Milano)[cite: 9].
* **Currency e Tempestività:** La velocità di aggiornamento di un dato rispetto alla realtà e quanto rapidamente è disponibile per il processo che lo richiede[cite: 10].

La **Completezza** valuta se i dati coprono tutti gli aspetti della realtà di interesse (su cella, tupla o relazione)[cite: 9, 10]. Il calcolo dipende dal significato del valore NULL (non applicabile, esiste ma non è noto, o non si sa se esista)[cite: 9]. L'approccio cambia in base all'assunzione di mondo[cite: 9]:
* **Closed World Assumption:** Standard nei DBMS centralizzati, si assume che tutto ciò che non è nel DB sia falso. Si misura banalmente contando i nulli[cite: 9].
* **Open World Assumption:** Tipica dei DDBMS e del web; ciò che manca semplicemente "non si sa se esista"[cite: 9]. La completezza oggettiva dei record si stima derivando l'*Object Completeness*, appoggiandosi su reference relation esterne[cite: 9].

---

## 4. Query plan distribuiti vs centralizzati

> Si descrivono le principali differenze nell'esecuzione dei Query plan distribuiti rispetto a quelli centralizzati.

Nel caso centralizzato, il DBMS parserizza la query SQL per produrre un query tree astratto e genera un piano logico ottimizzato basandosi sulle statistiche del data catalog (es. dimensioni delle tabelle, per eseguire le JOIN il più tardi possibile)[cite: 13]. Il costo principale considerato è quello di I/O dalla memoria secondaria[cite: 13].

In un Database Distribuito (DDBMS), il query processing si divide in quattro fasi[cite: 13]:
1. **Query decomposition:** opera sullo schema logico globale applicando ottimizzazioni algebriche classiche, ignorando la distribuzione dei dati[cite: 13].
2. **Data localisation:** il sistema mappa le tabelle globali sui frammenti distribuiti e riduce la query in base alle regole di frammentazione[cite: 13].
3. **Ottimizzazione globale:** all'albero vengono aggiunti gli operatori di comunicazione (send/receive)[cite: 13]. Il modello di costo cambia: su reti geografiche il costo dominante è la trasmissione dati, costringendo l'ottimizzatore a bilanciare la minimizzazione del costo totale (meno trasmissioni) con il tempo di risposta (più parallelismo)[cite: 13].
4. **Local query optimization:** ciascun nodo riceve la sua fragment query e la ottimizza localmente[cite: 13].

Una tecnica specifica dell'ambiente distribuito è il **Semijoin**[cite: 13]. Poiché trasferire intere tabelle per fare JOIN su nodi diversi è costosissimo, il Semijoin proietta solo gli attributi di join di una tabella e li trasferisce[cite: 13]. Conviene quando il costo del suo calcolo e trasferimento è inferiore a quello dell'intera relazione[cite: 13].

---

## 5. Conflitti a livello di istanza

> Si descrivono le tecniche e le strategie per la risoluzione dei conflitti a livello di istanza nell'integrazione dati.

Quando si integrano schemi diversi o dati distribuiti, dopo aver risolto le eterogeneità di modello o di nomi (schema matching), si possono verificare conflitti a livello di istanza, come dati duplicati o diversi per la medesima entità reale[cite: 7].

Il primo step è la deduplicazione: identificare se due tuple diverse si riferiscono allo stesso oggetto reale[cite: 7]. Le tecniche per l'identificazione possono essere[cite: 7]:
* **Empiriche:** controllano similarità dirette (es. distanza alfabetica)[cite: 7].
* **Probabilistiche:** sfruttano le frequenze delle distanze tra tuple in un campione per stabilire delle soglie di *match*, *unmatch* e di potenziale match (area grigia)[cite: 7].
* **Knowledge-based e ML:** basate su regole precise o modelli addestrati per riconoscere i record[cite: 7].

Per rendere questi calcoli scalabili si utilizzano algoritmi di *blocking* o di *sorted neighborhood*, che raggruppano o ordinano le tuple su un attributo chiave per confrontare solo i record nel medesimo blocco[cite: 7]. Le stringhe lunghe possono essere confrontate anche a livello di *token* tramite metriche come la Edit Distance[cite: 9].

Rilevato il conflitto di attributo (es. stipendio diverso in due tabelle per la stessa persona), la risoluzione si effettua a design time definendo policy esplicite nel codice, come prendere tutti i dati da una tabella o applicare funzioni matematiche (minimo, massimo, valore medio) documentandone il motivo[cite: 7].

---

## 6. Data exploration in un sistema di ML

> Nello sviluppo di un sistema di ML quali sono gli obiettivi della data exploration e come è possibile realizzarla?

La Data Understanding ed Exploration è un passaggio fondamentale prima e durante l'uso di modelli di ML, perché i dati, e la loro qualità, impattano massicciamente i risultati dell'algoritmo[cite: 6]. L'obiettivo primario è eseguire dei "sanity checks" (controlli di qualità) per valutare quali feature siano continue, categoriche o assenti, e verificare che i valori rientrino nei range previsti dal dominio (es. latitudini impossibili)[cite: 6]. L'esplorazione rileva anche l'eventuale *data drift* (cambiamento della distribuzione nel tempo), i bias e le feature con maggiore potere predittivo[cite: 6].

L'esplorazione si effettua calcolando misure di dispersione, ma soprattutto tramite visualizzazioni grafiche[cite: 6]. A lezione sono stati presentati strumenti come:
* **Box plot:** mostrano quartili e limiti, utilissimi per identificare visivamente gli outlier[cite: 6].
* **Scatter plot:** evidenziano la relazione e la correlazione tra due variabili (positiva, negativa, zero o curvilinea)[cite: 6].
* **QQ plot:** usati per verificare se una distribuzione reale deriva da una distribuzione teorica (es. normale)[cite: 6].
* **Swarmplot:** variante dello scatter plot usata specificamente per le variabili categoriche[cite: 6].

---

## 7. Modello documentale vs modello a grafo

> Si vuole modellare che gli utenti possono comprare una certa quantità di determinati prodotti di una specifica tipologia merceologica. Si mostrino possibili modellazioni usando il modello documentale e quello a grafo discutendo i vantaggi e gli svantaggi di tali modellazioni.

**Modello Documentale (es. MongoDB)**
L'approccio principale è l'*embedding* (annidamento): le informazioni relative agli acquisti e ai prodotti vengono incorporate all'interno del documento JSON dell'Utente stesso[cite: 2].
*Vantaggi:* Non richiedendo JOIN, il recupero dei dati dell'utente e di tutti i suoi acquisti è immediato e altamente performante quando vi si accede a partire dalle radici dell'albero[cite: 2].
*Svantaggi:* La ridondanza dei dati porta ad anomalie di aggiornamento (se cambia il nome di una categoria, bisogna aggiornare ogni utente)[cite: 2]. Inoltre, il modello documentale fatica a percorrere i rami per query analitiche trasversali (es. scoprire quali utenti hanno comprato un prodotto) senza ricorrere a costosi operatori per destrutturare gli array[cite: 2].

**Modello a Grafo (es. Neo4j)**
I dati sono modellati tramite nodi (es. Utente, Prodotto, Categoria) e archi (relazioni)[cite: 3]. L'utente ha un arco "Compra" verso il prodotto su cui si inserisce la proprietà "Quantità"[cite: 3]. Il prodotto ha un arco verso la Categoria[cite: 3].
*Vantaggi:* Utilizza lo storage nativo detto *index-free adjacency*, ovvero i nodi semanticamente vicini sono salvati fisicamente vicini; questo permette di saltare da un nodo all'altro a costo quasi costante, rendendo le query su percorsi complessi molto fluide[cite: 3].
*Svantaggi:* I grafi mal si prestano alla distribuzione geografica (sharding). Dividere un grafo denso su più nodi server degrada le prestazioni a causa delle query che devono transitare in rete tra i nodi[cite: 3].

---

## 8. Protocollo ROWA

> Si descriva il protocollo ROWA e i suoi vantaggi e svantaggi nell'ambito della gestione dei dati distribuiti.

Il protocollo ROWA (Read Once Write All) è un meccanismo per la gestione delle repliche nei database distribuiti[cite: 13]. La sua logica è: una transazione può leggere (Read) prelevando il dato da una qualsiasi replica fisica disponibile, ma in scrittura (Write) il dato deve essere scritto simultaneamente su tutte le repliche esistenti[cite: 13].

Il suo vantaggio principale risiede nelle prestazioni di lettura: velocissime e senza necessità di coordinamento remoto, poiché ci si limita a contattare il nodo più vicino[cite: 13]. Il secondo vantaggio è che garantisce la mutua consistenza, assicurando che tutte le copie possiedano il medesimo valore ed evitando conflitti[cite: 13].

Lo svantaggio enorme è il collasso delle prestazioni e dell'affidabilità in scrittura. Scrivere ovunque richiede overhead di comunicazione e azzera la *Fault Tolerance* in scrittura: se anche una singola replica risulta non disponibile, l'intera operazione Write fallisce[cite: 13]. È utile in scenari (come quello bancario) dove si preferisce paralizzare la scrittura piuttosto che perdere l'assoluta consistenza tra le copie[cite: 11, 13].

---

## 9. Teorema CAP e MongoDB

> Spiegare il teorema CAP e dove si piazza MongoDB in questa classificazione.

Il Teorema CAP regola i sistemi distribuiti affermando che è possibile soddisfare al massimo due di tre proprietà: **Consistency** (tutti i nodi vedono lo stesso dato allo stesso momento), **Availability** (il sistema risponde sempre) e **Partition Tolerance** (il sistema funziona anche in caso di partizioni nella rete)[cite: 4].

Nei database moderni, essendo la partizione di rete (P) un evento fisico inevitabile, la vera scelta di design è decidere cosa sacrificare tra Consistenza (sistemi AP come Cassandra) e Disponibilità (sistemi CP)[cite: 4, 5].

MongoDB è un database **CP**[cite: 5]. Adotta un'architettura in replica-set con un nodo primario master[cite: 5]. Se una partizione di rete divide il sistema e il nodo master cade, MongoDB lancia un'elezione a maggioranza tra i secondari per eleggere un nuovo primario[cite: 5]. Durante l'elezione e il riallineamento, MongoDB non accetterà nuove scritture (non potendo garantire la Consistenza)[cite: 5]. Il sistema diventa quindi parzialmente non disponibile pur di assicurare l'integrità totale[cite: 5]. La tolleranza sulle letture/scritture è regolabile tramite il *Read / Write Concern* (es. w=1 per la conferma solo dal primario, o w=majority per la certezza assoluta dalla maggioranza dei nodi)[cite: 6].