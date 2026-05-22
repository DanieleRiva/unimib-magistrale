---
title: Structural Testing
description: Teoria - testing strutturale / white-box (Cap. 12), control flow graph, criteri di copertura, MC/DC e relazione di subsume.
sidebar:
  order: 3
---

## Il problema da cui tutto nasce

Il testing funzionale (come il Category Partition) deriva i test dalla *specifica*: dice cosa il programma dovrebbe fare, ma è cieco rispetto a *come* è scritto. Può succedere che un ramo del codice - un `if` particolare, una gestione d'errore - non venga mai eseguito dai test funzionali, semplicemente perché la specifica non lo menzionava esplicitamente. Quel codice resta non collaudato, e lì può nascondersi un guasto.

Il **structural testing** ribalta il punto di vista: guarda *dentro* la scatola. Si parte dal codice sorgente e ci si chiede «i miei test hanno effettivamente percorso tutte le parti del programma?». Per questo si chiama anche **white-box** (o glass-box) testing: la struttura interna è visibile e la si usa come criterio per giudicare se una suite di test è "abbastanza completa".

:::tip[In una frase]
Il **structural testing** (Cap. 12) usa la **struttura del codice** - i suoi statement, i suoi rami, le sue condizioni - per definire dei **criteri di adeguatezza**: regole che dicono quanto a fondo una suite di test ha esplorato il programma.
:::

:::caution[Funzionale e strutturale non sono rivali]
Lo structural testing **non sostituisce** quello funzionale: lo *completa*. Da solo non sa cosa il programma *dovrebbe* fare (non ha un oracolo), e non scopre il codice mancante - può solo dirti se hai eseguito il codice che c'è. Si usa tipicamente *dopo* il testing funzionale, per misurare cosa è rimasto scoperto.
:::

## Il control flow graph

Quasi tutti i criteri strutturali si appoggiano a un modello del programma: il **control flow graph** (CFG). È un grafo in cui i **nodi** rappresentano blocchi di istruzioni eseguite in sequenza (i *basic block*) e gli **archi** rappresentano i possibili passaggi di controllo da un blocco all'altro - cioè i salti dovuti a `if`, cicli, `return`.

Tradurre i criteri in proprietà del grafo li rende precisi e misurabili: invece di parlare vagamente di "parti del codice", parliamo di *nodi* e *archi* da coprire.

## I criteri di copertura

Un **criterio di adeguatezza** è una regola che impone un certo insieme di "obblighi" di test. Eccone i principali, dal più debole al più forte.

**Statement (o line) coverage.** Eseguire tutti gli statement del programma, cioè **tutti i nodi** del CFG. È il criterio più intuitivo e più debole: se un'istruzione non viene mai eseguita da nessun test, non puoi sapere se funziona. Ma coprire ogni statement non garantisce di aver provato ogni *direzione* delle decisioni.

**Branch (o decision) coverage.** Eseguire tutti i rami, cioè **tutti gli archi** del CFG. Più forte del precedente: obbliga a percorrere sia il ramo "vero" sia quello "falso" di ogni `if`, anche quando uno dei due non contiene istruzioni. È qui che si scoprono i guasti legati ai casi-limite che lo statement coverage si lascia sfuggire.

**Condition coverage.** Quando una decisione è composta da più condizioni elementari unite da operatori logici (`&&`, `||`), branch coverage guarda solo il risultato *complessivo* della decisione. I criteri di condizione vanno più a fondo nelle singole condizioni:

- *Basic condition coverage*: ogni condizione elementare deve assumere almeno una volta valore vero e una volta falso.
- *Compound condition coverage*: si provano **tutte** le combinazioni di valori di verità delle condizioni elementari. È completissimo ma costosissimo: con n condizioni servono fino a 2^n test, ingestibile già con poche condizioni.

**MC/DC** è il compromesso intelligente tra questi due, e merita una sezione a parte.

## MC/DC - Modified Condition/Decision Coverage

L'idea di MC/DC è dimostrare che **ogni singola condizione elementare conta davvero**, cioè che da sola è capace di cambiare il risultato della decisione. Non basta che ogni condizione sia stata vera e falsa (basic condition); bisogna mostrare che, *tenendo ferme le altre*, cambiare quella condizione ribalta l'esito complessivo.

In pratica, per ogni condizione si cercano **due test case che differiscono solo per quella condizione** e che producono risultati opposti. Se esistono, quella condizione è "essenziale per la decisione finale": ne è stato dimostrato l'effetto indipendente.

:::tip[La formula da ricordare: n+1]
Per una decisione con **n condizioni elementari**, MC/DC richiede al massimo **n+1 test case** per la copertura completa. È molto meno di compound condition (2^n) ma molto più rigoroso di basic condition. Questo equilibrio è il motivo per cui MC/DC è **obbligatorio nello standard avionico RTCA/DO-178B** per il software safety-critical.
:::

**Come si costruisce in pratica.** Il metodo del corso parte dalla tabella di verità della decisione: ogni colonna è una possibile combinazione di valori. Per ciascuna condizione si aggiungono le colonne che differiscono in *una sola* riga di input e nell'esito, poi si **fondono le colonne compatibili** per arrivare al numero minimo di test (idealmente n+1).

:::note[Attenzione al "masking"]
Quando si dimostra l'effetto di una condizione, le *altre* devono essere messe in uno stato che lascia "passare" il suo effetto fino al risultato finale. In una decisione `(A || B)`, per testare A bisogna tenere B falso (se B fosse vero, l'OR sarebbe già vero e A non conterebbe). Tenere ferme le altre condizioni nel modo giusto è il cuore della costruzione MC/DC.
:::

## La relazione di subsume

I criteri non sono indipendenti: alcuni sono *più forti* di altri in senso preciso.

:::note[Definizione di subsume]
Un criterio **A subsume B** se e solo se, per **ogni** programma P, **ogni** test suite che soddisfa A soddisfa anche B su P. In altre parole: soddisfare A ti regala automaticamente B.
:::

L'esempio canonico: **branch coverage subsume statement coverage**. Se hai percorso tutti gli archi del grafo, hai necessariamente toccato tutti i nodi (per raggiungere un arco devi passare dai nodi che collega). Il viceversa non vale: puoi coprire ogni statement senza percorrere ogni ramo.

I criteri si organizzano così in una **gerarchia** (dai più forti ai più deboli): path testing in cima, poi i vari criteri di condizione e MC/DC, poi branch, infine statement. Più sali, più test richiede il criterio e più guasti potenziali scopre - ma più costa.

## Quando un obbligo è impossibile - l'insoddisfacibilità

A volte un criterio chiede di coprire qualcosa che *non si può* coprire: codice morto, un ramo logicamente irraggiungibile, una combinazione di condizioni contraddittoria. Si dice che l'obbligo è **insoddisfacibile** (unsatisfiable). Ci sono due modi pratici di conviverci:

- **Approccio A - escludere gli obblighi impossibili dal criterio.** Per esempio si ridefinisce lo statement coverage come "eseguire tutti gli statement *raggiungibili*". Il criterio resta soddisfabile al 100%.
- **Approccio B - misurare il grado di adeguatezza.** Invece di pretendere il 100%, si riporta la percentuale: "copertura all'85%". È l'approccio dei tool di coverage reali.

## La cyclomatic complexity

Una misura collegata, utile a stimare quanti test servono: la **complessità ciclomatica** è il **numero di cammini indipendenti** nel control flow graph, calcolabile come `#archi − #nodi + 2`. La **cyclomatic coverage** misura quanti di questi cammini indipendenti sono stati testati. È un indicatore sia della complessità del codice sia dello sforzo di test richiesto.

## Trappole d'esame

:::caution[Gli errori che il professore va a cercare]
- **Confondere statement e branch coverage**: coprire ogni istruzione non significa coprire ogni ramo. Il ramo "else vuoto" non ha statement ma è un arco da percorrere.
- **Pensare che MC/DC = basic condition**: non basta che ogni condizione sia vera e falsa; va dimostrato il suo effetto *indipendente* (la coppia di test che ribalta l'esito).
- **Sbagliare il conteggio n+1**: vale per n condizioni *elementari*, da contare con attenzione (vedi la difesa del W4.A2).
- **Dimenticare il masking**: per isolare una condizione, le altre vanno messe nello stato che ne lascia passare l'effetto.
- **Invertire il subsume**: è branch che subsume statement, non il contrario.
- **Credere che lo strutturale trovi il codice mancante**: misura solo ciò che c'è; serve l'oracolo funzionale per sapere se il risultato è giusto.
:::

## Autotest

Rispondi a voce, a memoria, poi confronta.

1. Qual è la differenza di fondo tra testing funzionale e strutturale, e perché lo strutturale *completa* ma non sostituisce il funzionale?
2. Cosa sono nodi e archi del control flow graph, e a quali criteri corrispondono statement e branch coverage?
3. Spiega l'idea di MC/DC: cosa vuol dire dimostrare l'effetto *indipendente* di una condizione?
4. Perché MC/DC richiede n+1 test e non 2^n? In quale contesto è obbligatorio e perché?
5. Cos'è il "masking" e perché è necessario nella costruzione delle coppie MC/DC?
6. Enuncia la relazione di subsume e dimostra perché branch subsume statement (ma non viceversa).
7. Cos'è un obbligo insoddisfacibile e quali sono i due approcci per gestirlo?

## Glossario

- **Structural / white-box testing** - test basati sulla struttura interna del codice.
- **Control flow graph (CFG)** - grafo con basic block (nodi) e passaggi di controllo (archi).
- **Statement coverage** - eseguire tutti i nodi del CFG.
- **Branch / decision coverage** - eseguire tutti gli archi del CFG.
- **Basic condition coverage** - ogni condizione elementare vera e falsa almeno una volta.
- **Compound condition coverage** - tutte le combinazioni di verità delle condizioni (2^n).
- **MC/DC** - ogni condizione mostra il suo effetto indipendente sull'esito (n+1 test).
- **Masking** - mettere le altre condizioni nello stato che lascia passare l'effetto di quella sotto test.
- **Subsume** - A subsume B se ogni suite che soddisfa A soddisfa anche B.
- **Cyclomatic complexity** - numero di cammini indipendenti, `#archi − #nodi + 2`.
- **Unsatisfiable obligation** - obbligo di copertura impossibile da soddisfare (codice morto, contraddizioni).