---
title: Category Partition
description: Teoria - testing funzionale black-box (Cap. 11), principio, metodo, vincoli ed esempio del prof (mutuo).
sidebar:
  order: 1
---

## Il problema da cui tutto nasce

Testare un programma vorrebbe dire, idealmente, provarlo con *tutti* i possibili input e controllare che si comporti bene su ciascuno. È impossibile: lo spazio degli input è enorme, spesso infinito. Un solo campo di testo lungo 4096 caratteri ha più combinazioni possibili degli atomi dell'universo. Quindi un tester deve per forza scegliere un **sottoinsieme** di input da provare, e la domanda vera diventa: *quali?*

La risposta sbagliata è "a caso". I guasti non sono sparsi uniformemente: tendono ad addensarsi. Se una funzione gestisce male i numeri negativi, fallirà per *tutti* i negativi, non per uno solo a caso. Il **Category Partition** è un metodo sistematico per scegliere input rappresentativi, sfruttando proprio il modo in cui i guasti si raggruppano.

:::tip[In una frase]
Il **Category Partition** è una tecnica di testing **funzionale / black-box** (Cap. 11) che parte dalla *specifica* di una funzione, divide lo spazio degli input in **classi di valori che ci aspettiamo si comportino allo stesso modo**, e poi combina queste classi in modo controllato per ottenere un insieme gestibile di test case.
:::

"Funzionale" e "black-box" sono due nomi per la stessa idea: i test si derivano da *cosa la funzione dovrebbe fare* (la specifica), non da *com'è scritto il codice*. Non guardiamo dentro la scatola. Il metodo, con le sue annotazioni `[property]`, `[if]`, `[error]`, `[single]`, è stato formalizzato da Ostrand & Balcer nel 1988.

## Perché funziona - il principio della partizione

L'intuizione di fondo è semplice: se due input fanno scattare lo stesso comportamento del programma, testarli entrambi è ridondante. Provarne uno equivale a provare l'altro. Quindi conviene raggruppare gli input in **classi di equivalenza** - insiemi di valori che "secondo la specifica" il programma tratta allo stesso modo - e poi pescare un solo rappresentante per classe.

Pezzè lo formula con due idee collegate:

- Il **partition principle** dice di scegliere i campioni dove è più probabile incontrare guasti. I bug sono *radi* se guardi l'intero spazio di input, ma esistono regioni in cui diventano *densi*: tutto sta nel costruire le classi in modo che ciascuna corrisponda a una di queste regioni.
- Il **(quasi-)partition testing** divide lo spazio di input in classi la cui unione copre l'intero spazio. Lo scenario ideale è quello in cui ogni possibile guasto provoca fallimenti *densi* dentro almeno una classe: in quel caso un singolo campione per classe basta a stanarlo.

:::note[Perché si dice *"quasi"* partizione]
Una partizione in senso matematico è perfetta: le classi non si sovrappongono e insieme coprono tutto. Qui invece le classi sono **ipotesi** su dove si nascondono i guasti, costruite a intuito dalla specifica. Possono sovrapporsi un po', possono non essere esatte. È un'approssimazione utile, non un teorema - da qui il "quasi".
:::

:::note[Dove si colloca nel corso]
Il testing funzionale del corso segue una catena: *Functional Specification → Independently Testable Features → Representative Values → Test Case Specifications → Test Cases*. Il Category Partition è il modo **manuale e combinatorio** di percorrere questa catena. L'alternativa sarebbe il *brute force* - provare ogni combinazione possibile - che è esattamente ciò che vogliamo evitare.
:::

## I mattoni del metodo

Prima di vedere i passi, bisogna avere chiari cinque termini, perché il professore parte quasi sempre da qui per capire se hai davvero afferrato il metodo o se hai solo riempito una tabella.

Una **funzione** ha dei **parametri**: gli input espliciti che le passi (l'importo di un mutuo, il testo di un messaggio). Ma il comportamento dipende anche da fattori che non passi direttamente come argomenti - lo stato del sistema, una configurazione, il contesto: questi sono gli **elementi d'ambiente** (*environment*). Tenerli distinti dai parametri non è pedanteria: riflette dove passa il *confine* del sistema che stai testando.

Per ogni parametro o elemento d'ambiente individui poi le sue **categorie**. Una categoria è una **caratteristica** di quell'input che ha senso far variare nei test - non il valore, ma la *dimensione* lungo cui il valore può cambiare. La lunghezza di un testo è una categoria; il suo contenuto può essere un'altra. Infine, dentro ogni categoria, scegli le **choice** (classi di valori): i casi rappresentativi su quella dimensione, tipicamente un valore valido "normale", i valori di confine (*boundary*), e i casi erronei.

| Concetto | Che cos'è | Esempio (mutuo) |
|---|---|---|
| **Parameter** | Input *esplicito* della funzione | importo, durata, età del richiedente |
| **Environment** | Fattore di *contesto* che influenza il comportamento ma non è passato come argomento | stato occupazionale (self-employed) |
| **Category** | Una *caratteristica* del parametro/ambiente, cioè una dimensione da far variare | per la durata → l'intervallo di validità |
| **Choice** | Una *classe rappresentativa* di valori su quella dimensione (valido / boundary / errore) | durata: `1`, `1<n<40`, `40`, `0`, `>40` |
| **Constraint** | Annotazione che condiziona o riduce le combinazioni | `[property]`, `[if]`, `[error]`, `[single]` |

:::caution[Categoria ≠ Choice - la confusione che ti chiedono per prima]
Pensa alla categoria come a una **domanda** e alle choice come alle **risposte possibili** raggruppate. Per il parametro "testo", la categoria *lunghezza* pone la domanda «quanto è lungo?», e le choice sono le risposte interessanti: vuoto, un carattere, lunghezza normale, al limite massimo, oltre il limite. La categoria descrive *cosa stai testando*; la choice è *il caso concreto che provi*. Se ti accorgi di aver chiamato una categoria "Value", quasi sempre hai saltato il ragionamento: stai nominando il campo invece della sua caratteristica.
:::

## Come si applica, passo per passo

Il metodo è una procedura in cinque tappe (il professore le numera da 0 a 4, vale la pena saperle nell'ordine).

Si parte (**passo 0**) **decomponendo la specifica** in funzionalità testabili in modo indipendente: se una funzione fa tre cose scollegate, conviene trattarle separatamente. Per ciascuna funzionalità (**passo 1**) si **elencano parametri ed elementi d'ambiente**, tenendoli ben distinti. Poi (**passo 2**), per ogni parametro e ambiente, si **individuano le categorie**, cioè le caratteristiche rilevanti. A questo punto (**passo 3**) per ogni categoria si **scelgono le classi di valori** (le choice), avendo cura di includere il caso valido, i confini e gli errori.

L'ultima tappa (**passo 4**) è quella che distingue un modello ingenuo da uno buono: si **introducono i vincoli**. E si fa in due momenti distinti, perché hanno scopi opposti:

- **Passo 4a - i vincoli di dipendenza** (`[property]` e `[if]`) servono a dire al modello che certe choice hanno senso *solo in presenza di* altre. Modellano la realtà.
- **Passo 4b - i vincoli di riduzione** (`[single]` e `[error]`) servono invece ad accorciare la lista di test, evitando di moltiplicare casi che non ha senso combinare.

Il risultato finale sono le **test case specification**: l'elenco delle combinazioni di choice ammesse dai vincoli. Da queste, riempiendole con valori concreti, si ottengono i **test case** veri e propri.

## I vincoli, spiegati uno per uno

Il motivo per cui i vincoli esistono è il **rischio di esplosione combinatoria**. Senza vincoli, il numero di test è il *prodotto* del numero di choice di ogni categoria: bastano cinque o sei categorie con quattro choice ciascuna per arrivare a migliaia di casi. I vincoli tengono questo numero sotto controllo. Ce ne sono di due famiglie.

**Le dipendenze** descrivono come i parametri si influenzano a vicenda:

- **`[property X]`** si attacca a una choice e dice: «quando scegli questo valore, è vera la proprietà X». In pratica quella choice *accende una bandierina* di nome X.
- **`[if X]`** si attacca a un'*altra* choice e dice: «considera questo caso **solo se** la bandierina X è accesa». Così leghi due parametri: una scelta su uno abilita o disabilita le scelte sull'altro. È il modo per esprimere frasi del tipo «se l'utente è un'azienda, allora il campo patrimonio diventa rilevante».

**Le riduzioni** tagliano il numero di combinazioni:

- **`[error]`** marca una choice che rappresenta un input *sbagliato*. Quando un input è errato, il programma in genere lo rifiuta subito, senza guardare il resto: quindi non ha senso combinarlo con tutte le varianti degli altri parametri. `[error]` dice «genera **un solo** test con questo errore, tenendo gli altri valori validi, e fermati lì».
- **`[single]`** fa una cosa simile ma per un motivo diverso: si usa sui valori di confine *validi*. Un boundary va provato, ma una volta sola - non serve incrociarlo con ogni altra combinazione. `[single]` dice «**un solo** test con questa choice», togliendola dal grande prodotto combinatorio.

:::tip[L'intuizione che fa scattare tutto]
`[property]` e `[if]` agiscono sui **fattori** della moltiplicazione: tagliano via le combinazioni impossibili, quindi *riducono i numeri che moltiplichi*.
`[error]` e `[single]` invece non moltiplicano affatto: aggiungono **un test ciascuno** alla fine, come degli *addendi*.
Tieni a mente questa distinzione tra "fattori" e "addendi": è la chiave per leggere il conteggio dell'esempio qui sotto.
:::

## L'esempio del professore - idoneità al mutuo

Questo è l'esempio canonico che il professore usa a lezione, ed è il più utile da saper rifare perché mostra il conteggio dei test in modo concreto.

**La specifica.** Si valuta se una richiesta di mutuo per la casa è accettabile. Gli argomenti sono il *richiedente* (con la sua età e il suo patrimonio personale), l'*immobile* (con il suo valore) e il *mutuo richiesto* (importo e durata, da 1 a 40 anni). La richiesta è idonea se l'importo non supera l'80% del valore dell'immobile **e** se la somma tra età del richiedente e durata del mutuo non supera gli 80 anni. In più, se il richiedente è un *lavoratore autonomo* (self-employed), deve avere un patrimonio pari ad almeno metà dell'importo richiesto.

**Il modello (in estratto).** Trasformando la specifica in categorie e choice:

- *Richiedente* → età con choice `<80−durata`, `=80−durata`, `>80−durata`; patrimonio con choice `<50% mutuo [if SE]`, `=50% mutuo`, `>50% mutuo [if SE]`
- *Immobile* → valore con choice `<patrimonio`, `=patrimonio`, `>patrimonio`
- *Mutuo* → importo con choice `<80% valore`, `=80% valore`, `>80% valore`; durata con choice `0 [error]`, `1`, `1<n<40`, `40`, `>40 [error]`
- **Ambiente** → stato occupazionale: `self-employed Sì [property SE]`, `No`

Nota come la proprietà `SE` (self-employed) viene *accesa* dalla scelta sullo stato occupazionale, e poi le choice del patrimonio marcate `[if SE]` esistono solo quando quella proprietà è vera. Questo perché il patrimonio conta solo per i lavoratori autonomi: per gli altri, quel vincolo non si applica e quelle choice semplicemente non vanno generate.

**Il conteggio.** Considerando per ora i soli vincoli di dipendenza, il numero di test specification è:

```text
3*3*3*3*3*1  +  3*2*3*3*3*1  +  2  =  407
```

Questa formula si legge così. I **due prodotti che vengono sommati** corrispondono ai due scenari della proprietà `SE`. Nel ramo "self-employed sì" il patrimonio ha tutte e tre le sue choice disponibili; nel ramo "no", invece, le due choice marcate `[if SE]` spariscono e ne resta solo una - ecco perché in quel prodotto un fattore passa da `3` a `2`. Il **`+2`** finale sono i due casi `[error]` della durata (`0` e `>40`): ciascuno genera un unico test e non viene moltiplicato per nulla, esattamente come dicevamo (gli errori sono *addendi*).

Se ora aggiungiamo anche i vincoli di riduzione - marcando come `[single]` i due valori di confine validi della durata, cioè `1` e `40` - quelle due choice escono dal prodotto combinatorio e diventano test isolati. Il totale **scende a 304**. Stesso meccanismo: `[single]` toglie dei fattori dal prodotto e li trasforma in addendi.

:::tip[La frase da dire all'orale]
«I vincoli di dipendenza, `property` e `if`, agiscono sui fattori del prodotto perché eliminano combinazioni impossibili; i vincoli di riduzione, `error` e `single`, aggiungono invece un solo test ciascuno. È così che si passa dalle migliaia di combinazioni teoriche a poche centinaia di test sensati.»
:::

## Le trappole tipiche d'esame

:::caution[Gli errori che il professore va a cercare]
- **Confondere categoria e choice**: la categoria è la dimensione, la choice è il valore. Se le tue categorie si chiamano tutte "Value", non hai partizionato - hai solo elencato i campi.
- **Dimenticare i boundary**: i valori di confine (uno, il massimo, il massimo±1, il vuoto) sono il cuore del metodo, non un extra opzionale. È lì che si annidano i guasti.
- **Combinare gli errori con tutto il resto**: gli input errati vanno provati una volta sola; per questo esistono `[error]` e `[single]`. Combinarli esaustivamente è proprio l'esplosione che il metodo vuole evitare.
- **Non modellare le dipendenze**: se due parametri interagiscono e non lo esprimi con `[property]`/`[if]`, il modello genera test impossibili o ne perde di importanti.
- **Mischiare parametri e ambiente**: tenere separato l'environment riflette il confine del sistema.
- **Non saper spiegare *perché* il metodo riduce i test**: se ti chiede il conteggio del mutuo e non sai da dove esce il `407`, si capisce che hai imparato la procedura ma non l'idea.
:::

## Autotest

Prova a rispondere a voce, a memoria, e solo dopo rileggi le sezioni sopra per confrontare.

1. Enuncia il **principio della (quasi-)partition**: perché scegliere pochi valori rappresentativi permette comunque di trovare i guasti?
2. Ripercorri i **passi da 0 a 4** del metodo, spiegando cosa si fa in ciascuno.
3. Spiega la differenza tra **categoria** e **choice** con un esempio tuo, e di' perché una categoria chiamata "Value" è quasi sempre un campanello d'allarme.
4. Cosa fa `[error]` al **numero** di test generati, e perché è diverso dal semplice elencare un valore non valido tra le choice?
5. Qual è la differenza di *scopo* tra i vincoli `[property]/[if]` (passo 4a) e i vincoli `[error]/[single]` (passo 4b)?
6. Nell'esempio del mutuo: da dove vengono i due prodotti che si sommano? E il `+2`? E perché aggiungere i `[single]` fa scendere il totale da 407 a 304?

## Glossario

- **Functional / black-box testing** - test derivati dalla specifica, senza guardare il codice.
- **Independently testable feature** - una funzionalità che si può testare in isolamento dalle altre.
- **(quasi-)partition** - divisione dello spazio di input in classi la cui unione copre l'intero spazio.
- **Category** - una caratteristica (dimensione) di un parametro o ambiente, lungo cui far variare i test.
- **Choice / classe di valori** - una classe rappresentativa di valori dentro una categoria.
- **TSL (Test Specification Language)** - la notazione delle annotazioni `[property] [if] [error] [single]`.
- **Test case specification** - una combinazione di choice ammessa dai vincoli.
- **Test case** - l'istanza concreta, con valori reali, di una specification.