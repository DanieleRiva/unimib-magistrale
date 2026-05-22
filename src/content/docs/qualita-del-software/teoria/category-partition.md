---
title: Category Partition
description: Teoria — testing funzionale black-box (Cap. 11), principio, metodo 0–4, vincoli ed esempio del prof (mutuo).
sidebar:
  order: 1
---

> **Teoria — Qualità del Software (Pezzè), Capitolo 11.**
> Questo file spiega *il metodo*. La tua soluzione W3.A1 e il "perché" stanno nel file separato della soluzione.

## 1. In una frase

Il **Category Partition** è una tecnica di testing **funzionale / black-box** (Cap. 11, *Test case selection and adequacy criteria*) che trasforma una *specifica* in test case: partiziona lo spazio degli input in **classi rappresentative** e le combina in modo **controllato dai vincoli**, evitando l'esplosione combinatoria.

Black-box = si lavora dalla specifica, **non** dal codice. Origine: Ostrand & Balcer (1988), che introducono anche il linguaggio TSL (Test Specification Language) con le annotazioni [property], [if], [error], [single].

## 2. Perché funziona: il principio della (quasi-)partition

- **Partition principle**: scegliere campioni con più probabilità di colpire le *regioni problematiche*. I guasti sono *radi* nell'intero spazio di input, ma esistono regioni (come i bordi dei domini) in cui sono *densi*.
- **(quasi-)partition testing**: si separa lo spazio di input in **classi la cui unione è l'intero spazio**. Caso desiderabile: ogni fault produce failure *dense* in qualche classe → basta un campione per classe per scovarlo.
- È *"quasi"* perché non è una partizione matematica perfetta (euristica, classi non necessariamente disgiunte): l'obiettivo pratico è coprire ogni classe rappresentativa.

> Collocazione: testing funzionale → *Functional Specification → Independently Testable Features → Representative Values → Test Case Specifications → Test Cases*. Il Category Partition è l'**applicazione metodologica e sistematica** di quel percorso (alternativa al brute force, cioè a tutte le combinazioni).

## 3. I concetti chiave (non confonderli — è la prima cosa che chiedono)

| Concetto | Definizione | Esempio (mutuo) |
|---|---|---|
| **Parameter** | Input *esplicito* della funzione | importo, durata, età del richiedente |
| **Environment** | Elemento del *contesto* da cui il comportamento dipende, ma che **non** è input diretto | stato occupazionale (self-employed) |
| **Category** | La *caratteristica elementare sotto test* di un parametro/ambiente. **NON è il valore** | per la durata → l'intervallo di validità |
| **Choice** (classe di valori) | *Classe rappresentativa* di valori in una categoria (valido / boundary / errore) | durata: 1, 1<n<40, 40, 0, >40 |
| **Constraint** | Annotazione che condiziona/riduce le combinazioni | [property], [if], [error], [single] |

> **Domanda classica:** *differenza tra categoria e choice?* → La **categoria** è la dimensione/caratteristica; le **choice** sono i valori rappresentativi su quella dimensione. Una buona categoria dice *quale proprietà* stai testando.

## 4. Il metodo del prof, passi 0–4 (numerazione da sapere)

0. **Decomporre la specifica** in *independently testable features*.
1. Per ogni feature, **identificare parametri ed elementi d'ambiente** (environment).
2. Per ogni parametro/ambiente, **identificare le categorie** (caratteristiche elementari).
3. Per ogni categoria, **identificare le (classi di) valori** (le choice): valido, boundary, errore.
   * *Nota sui boundary:* I limiti si testano sempre (es. 1, max, max+1) perché i fault tendono ad addensarsi ai margini dei domini (es. classici errori off-by-one, come usare < invece di <=).
4. **Introdurre i vincoli**, in due momenti:
   - **4a. Property constraints** — modellano le *dipendenze* tra choice ([property] + [if]).
   - **4b. Single / error constraints** — *riducono* il numero di test ([single], [error]).

**L'Output del metodo:**
Il metodo non genera subito test eseguibili, ma produce **Test Case Specification**, che andranno poi convertite.
*   *Test Case Specification:* [età: >80-durata, patrimonio: >50%, importo: =80%, durata: 1<n<40] (Definisce le classi di equivalenza).
*   *Test Case Istance (Concreto):* [età: 65, patrimonio: 100.000€, importo: 80.000€, durata: 20 anni] (Valori reali passati al sistema).

## 5. I vincoli / annotazioni (Il linguaggio TSL) — la parte che scavano di più

**Prima le dipendenze (4a):**

1. **[property X]** — una choice **dichiara** una proprietà, che abilita/disabilita choice altrove.
2. **[if X]** (selettore) — una choice è considerata **solo se** X vale. Modella le **dipendenze tra parametri**.

**Poi la riduzione (4b):**

3. **[error]** — choice erronea: **un solo** test (con valori validi per il resto), non incrociata con tutto. Effetto: **+1** test.
4. **[single]** — **un solo** test con quella choice, senza combinarla. Tipico per i **boundary**. Effetto: **+1** test e *toglie* la choice dal prodotto combinatorio.

> **Intuizione combinatoria:** senza vincoli i test sono il *prodotto* delle choice di tutte le categorie (esplode). [property]/[if] **tagliano** le combinazioni incompatibili (cambiano i *fattori*); [error]/[single] **non moltiplicano**: aggiungono un test ciascuno (sono *addendi*).

*Nota Integrativa (Base Choice):* Se i vincoli TSL non bastano a ridurre l'esplosione, un'altra tecnica euristica è il **Base Choice Coverage**: si definisce un test case "base" con tutte le choice nominali/più comuni, e si generano nuovi test variando una singola choice alla volta mantenendo le altre al valore base.

## 6. Esempio del prof: *mortgage eligibility* (con il conteggio)

**Specifica.** Valuta l'idoneità di una richiesta di mutuo. Argomenti: *requester* (età, patrimonio), *property* (valore), *requested mortgage* (importo, durata 1–40 anni). Idoneo se importo ≤ 80% del valore immobile **e** (età + durata) ≤ 80 anni. Se *self-employed*, serve patrimonio ≥ metà dell'importo richiesto.

**Modello (estratto e corretto per il calcolo).**
- *Requester* → età: <80−durata, =80−durata, >80−durata (3 choice)
- *Requester* → patrimonio: <50% mutuo [if SE], =50% mutuo, >50% mutuo (3 choice, di cui 1 condizionata)
- *Property* → valore: <asset, =asset, >asset (3 choice)
- *Mortgage* → importo: <80% val, =80% val, >80% val (3 choice)
- *Mortgage* → durata: 0 [error], 1, 1<n<40, 40, >40 [error] (3 choice attive nel prodotto combinatorio, 2 aggiungono test singoli)
- **ENVIRONMENT** → employment: self-employed Y [property SE], N (1 choice per ramo della proprietà)

**Il conteggio.** Con i soli *property constraints*:

    (3*3*3*3*3*1)  +  (3*2*3*3*3*1)  +  2  =  407

Spiegazione dei fattori associati alle categorie: [età * patrimonio * val. imm. * imp. mutuo * durata * employment]
- **Il primo prodotto (243):** È il ramo in cui employment = Y. La proprietà SE è attiva, quindi il patrimonio ha tutte e **3** le choice disponibili.
- **Il secondo prodotto (162):** È il ramo in cui employment = N. La proprietà SE non è attiva, la choice del patrimonio <50% mutuo [if SE] viene scartata dal prodotto, e il fattore passa a **2**.
- **Il +2 finale:** Sono i due [error] della durata (0 e >40): generano un test ciascuno, non si moltiplicano con nient'altro.

Aggiungendo i *single constraints* (i boundary 1 e 40 diventano [single]), il prodotto si restringe e il totale **scende a 304**: [single] toglie i boundary dal prodotto principale e li trasforma in test singoli additivi.

> Morale: *property/if* cambiano i **fattori** della moltiplicazione; *error/single* aggiungono **addendi**. Ecco perché si passa da numeri enormi a poche centinaia (o decine, su API piccole).

## 7. Errori tipici / trappole d'esame

- Chiamare "categoria" un valore: la categoria è la **dimensione**, la choice è il **valore**.
- Dimenticare i **boundary** (1, max, max±1, vuoto): sono il cuore della partizione. I fault sono spesso legati a errori di limite (es. off-by-one nel codice).
- Combinare gli errori con tutto: per questo esistono [error] e [single].
- Non modellare le **dipendenze** ([property]/[if]).
- Confondere parametro ed environment.
- Non saper spiegare *perché* la partition riduce i test (è cruciale saper spiegare matematicamente l'impatto dei vincoli come mostrato per il mutuo).

## 8. Autotest (rispondi a memoria, poi confronta)

1. Enuncia il **principio della (quasi-)partition**: perché scegliere valori rappresentativi trova i guasti?
2. Elenca i **passi 0–4** del metodo.
3. Differenza tra **categoria** e **choice**, con esempio.
4. Qual è la differenza visiva e concettuale tra una *Test Case Specification* e un *Test Case Istance*?
5. Cosa fa [error] al **numero** di test, e perché è diverso dall'elencare un valore non valido senza vincoli?
6. Differenza di scopo tra [property]/[if] (4a) e [error]/[single] (4b)?
7. Nell'esempio del mutuo: a quali parametri corrispondono i fattori dei due prodotti sommati? Perché aggiungere i [single] fa scendere il totale?

## 9. Glossario rapido

- **Functional / black-box testing** — test derivati dalla specifica, non dal codice.
- **Independently testable feature** — funzionalità testabile in isolamento.
- **(quasi-)partition** — divisione dello spazio di input in classi la cui unione è l'intero spazio.
- **Category** — caratteristica elementare di un parametro/ambiente, sotto test.
- **Choice / classe di valori** — classe rappresentativa di valori in una categoria.
- **TSL (Test Specification Language)** — notazione originale di Ostrand & Balcer con [property] [if] [error] [single].
- **Test case specification** — combinazione di choice ammessa dai vincoli (definisce classi di equivalenza).
- **Test case** — istanza concreta con valori reali pronta per l'esecuzione.