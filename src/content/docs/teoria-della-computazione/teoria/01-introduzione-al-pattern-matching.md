---
title: Introduzione al Pattern Matching
description: Il problema dello string matching, notazioni sulle stringhe, algoritmi banali per la ricerca esatta e approssimata, distanza di edit.
sidebar:
  order: 1
---

## Perché Studiare il Pattern Matching

Il **pattern matching** su stringhe è uno dei problemi più comuni dell'informatica, anche se spesso non ce ne accorgiamo:

- **Ricerca sul web e nei documenti**: i motori di ricerca, il classico `Ctrl+F` e la ricerca di una parola dentro un PDF devono tutti trovare una stringa dentro un testo molto più lungo.
- **Bioinformatica**: una sequenza di DNA è una stringa sull'alfabeto $\{A, C, G, T\}$. Cercare geni, mutazioni o contare **k-mer** (tutte le sottostringhe di lunghezza $k$ di una sequenza) è pattern matching.

:::note[Esempio: i k-mer]
La sequenza `ACGAGGTACGA` contiene otto 4-mer: `ACGA`, `CGAG`, `GAGG`, `AGGT`, `GGTA`, `GTAC`, `TACG`, `ACGA`. `ACGA` compare due volte, tutti gli altri una sola.
:::

La bioinformatica fa capire bene anche perché la ricerca **esatta** non basta sempre. Nell'esempio delle slide sull'anemia falciforme, il cambiamento di **un solo nucleotide** nella sequenza del DNA sostituisce un amminoacido (acido glutammico → valina) e deforma i globuli rossi. Due sequenze quasi identiche possono essere biologicamente legate, e quindi vogliamo poterle trovare anche se non coincidono perfettamente. Da qui nascono le due varianti del problema: **matching esatto** e **matching approssimato**.

## Il Problema

:::tip[Definizione]
Il **Pattern Matching su Stringhe** consiste nel cercare all'interno di una stringa $T$ (il **testo**) le occorrenze di una stringa $P$ (il **pattern**).
:::

:::note[Esempio]
Con testo $T$ = `achbbieadctrn` e pattern $P$ = `biea`, il pattern compare a partire dalla posizione 5 del testo.
:::

## Stringhe: Definizioni e Notazioni

Una **stringa** è una giustapposizione di simboli appartenenti a un **alfabeto** $\Sigma$:

$$
X = x_1 x_2 \dots x_n \quad \text{con } 1 \le i \le n, \; x_i \in \Sigma
$$

| Notazione | Significato |
| --- | --- |
| $\varepsilon$ | **Stringa vuota** |
| $\lvert X \rvert$ | **Lunghezza** di $X$ |
| $X[i]$ | Simbolo in **posizione** $i$, cioè $x_i$ |
| $X[i:j]$ | **Sottostringa** $x_i x_{i+1} \dots x_j$ |
| $X[1:j] = X[:j]$ | **Prefisso** $x_1 x_2 \dots x_j$, di lunghezza $j$ |
| $X[j:\lvert X \rvert] = X[j:]$ | **Suffisso** $x_j x_{j+1} \dots x_{\lvert X \rvert}$, di lunghezza $\lvert X \rvert - j + 1$ |

:::caution[Indici]
In tutto il corso le posizioni partono da **1** e $X[i:j]$ **include entrambi gli estremi**. Non è lo slicing di Python: se $X$ = `abcde`, allora $X[2:4]$ = `bcd`, e ha lunghezza $j - i + 1 = 3$.
:::

Per convenzione $X[:0] = \varepsilon$. Un prefisso è **proprio** se è diverso da $X$ stessa: questa distinzione diventerà fondamentale con il concetto di [bordo](../02-ricerca-esatta-con-asf-parte-1/#il-bordo).

## String Matching Esatto

- **Input**: un testo $T$ di lunghezza $n$ e un pattern $P$ di lunghezza $m$, entrambi su un alfabeto $\Sigma$.
- **Output**: ogni posizione $i$, con $1 \le i \le n - m + 1$, tale che $T[i : i + m - 1] = P$.

Il limite $n - m + 1$ è semplicemente l'ultima posizione in cui il pattern ci sta ancora: oltre, sforerebbe la fine del testo.

:::note[Esempio]
Con $T$ = `bbaccbbaac` e $P$ = `ccbb` c'è un'occorrenza in posizione $i = 4$, infatti $T[4:7]$ = `ccbb`.
:::

### Algoritmo Banale

L'idea più semplice è far scorrere una **finestra** $W$ lunga quanto il pattern lungo il testo:

1. La finestra è $W = [i : i + m - 1]$, con $1 \le i \le n - m + 1$, e parte da $i = 1$.
2. Ogni simbolo di $P$ viene confrontato con il corrispondente simbolo di $T$ dentro $W$.
3. Se $P = T[i : i + m - 1]$, allora $i$ è un'occorrenza esatta.
4. $W$ viene spostata di **una** posizione verso destra e il confronto si ripete.

Ecco lo scorrimento della finestra sull'esempio di prima:

```text
Posizione:  1 2 3 4 5 6 7 8 9 10
T:          b b a c c b b a a c

i = 1       c c b b                  nessuna corrispondenza
i = 2         c c b b                nessuna corrispondenza
i = 3           c c b b              nessuna corrispondenza
i = 4             c c b b            corrispondenza esatta!
```

La procedura completa:

```text
procedura trivial_exact_matching(T, P)
    n ← |T|
    m ← |P|
    i ← 1
    while i ≤ n-m+1 do
        j ← 1
        while P[j] = T[i+j-1] and j ≤ m do
            j ← j+1
        if j = m+1 then
            output i
        i ← i+1
```

Il ciclo interno avanza finché i simboli coincidono: se arriva a $j = m + 1$ significa che tutti gli $m$ simboli di $P$ hanno trovato corrispondenza.

:::caution[Ordine della condizione]
Nel ciclo interno la condizione $j \le m$ va valutata **prima** di $P[j] = T[i+j-1]$: se la si implementa così com'è scritta, con $j = m + 1$ si legge fuori dal pattern. Nello pseudocodice è un dettaglio, in un programma vero è un bug.
:::

**Tempo computazionale**: $\mathcal{O}(nm)$. Ci sono $n - m + 1$ finestre e per ognuna servono al massimo $m$ confronti. Il caso peggiore si ha ad esempio con $T = a^n$ e $P = a^m$, dove ogni finestra richiede esattamente $m$ confronti.

Il difetto di questo algoritmo è che dopo ogni spostamento **dimentica tutto** quello che ha appena letto. Gli algoritmi delle prossime lezioni nascono proprio per non sprecare queste informazioni.

## String Matching Approssimato

- **Input**: un testo $T$ di lunghezza $n$, un pattern $P$ di lunghezza $m$ (su un alfabeto $\Sigma$) e una **soglia** massima $k$ di differenze/errori.
- **Output**: ogni posizione $i$ del testo $T$ in cui inizia una sottostringa uguale a $P$ **a meno di $k$ differenze/errori**.

Per dare un senso preciso a "differenze" serve una distanza tra stringhe.

### Distanza di Edit

:::tip[Definizione]
La **distanza di edit** $ED(X_1, X_2)$ è il **minimo** numero di **sostituzioni**, **cancellazioni** e **inserimenti** di un simbolo che trasformano la stringa $X_1$ nella stringa $X_2$.
:::

Prendiamo l'esempio delle slide, $X_1$ = `AGTGCGT` e $X_2$ = `ATGTGAT`. Tre operazioni bastano:

```text
A G T G C G T          X1
A T G T G C G T        inserisco T dopo la prima A
A T G T G G T          cancello C
A T G T G A T          sostituisco G con A: ho ottenuto X2
```

Si può vedere la stessa cosa come un **allineamento** delle due stringhe:

```text
X1:  A - G T G C G T
X2:  A T G T G - A T
       ^       ^ ^
      ins    del sub
```

Quindi $ED(X_1, X_2) = 3$: con meno operazioni non si riesce.

:::caution[Slide 14]
Il secondo esempio della slide mostra $X_1$ e $X_2$ **identiche**, entrambe `ATGTGAT`, accanto a "# OPERAZIONI = 3". Letto così sarebbe sbagliato, perché la distanza di una stringa da se stessa è $0$. Va interpretato come il risultato del primo esempio: è $X_1$ **dopo** aver applicato le tre operazioni.
:::

:::note[Complemento: come si calcola la distanza di edit]
Le slide usano $ED$ come una scatola nera. Si calcola con la programmazione dinamica: sia $D[i,j]$ la distanza tra $X_1[:i]$ e $X_2[:j]$, allora $D[i,0] = i$, $D[0,j] = j$ e

$$
D[i,j] = \min \begin{cases} D[i-1, j] + 1 & \text{cancellazione} \\ D[i, j-1] + 1 & \text{inserimento} \\ D[i-1, j-1] + c & c = 0 \text{ se } X_1[i] = X_2[j], \text{ altrimenti } 1 \end{cases}
$$

Il costo è $\mathcal{O}(\lvert X_1 \rvert \cdot \lvert X_2 \rvert)$, ed è il dato che serve per calcolare la complessità dell'algoritmo banale qui sotto.
:::

### Occorrenza Approssimata

:::tip[Definizione]
Data una soglia di errore $k$, una posizione $i$ del testo $T$ è un'**occorrenza approssimata** di $P$ se esiste almeno una sottostringa $S = T[i : i + L - 1]$ tale che $ED(P, S) \le k$.
:::

Attenzione: la lunghezza $L$ di $S$ non è fissata, perché inserimenti e cancellazioni cambiano la lunghezza. Però non può essere qualunque. Ogni operazione cambia la lunghezza al massimo di 1, quindi con al più $k$ operazioni due stringhe possono differire in lunghezza al massimo di $k$:

$$
ED(P, S) \le k \;\Rightarrow\; \lvert L - m \rvert \le k \;\Rightarrow\; -k \le L - m \le k \;\Rightarrow\; m - k \le L \le m + k
$$

:::note[Esempio]
Con $T$ = `bbaccbbaac`, $P$ = `ccbb` e $k = 1$, le lunghezze da provare sono $L \in \{3, 4, 5\}$ e le occorrenze approssimate sono:

| Posizione $i$ | Sottostringa $S$ | $ED(P, S)$ | Perché |
| --- | --- | --- | --- |
| 3 | `accbb` | 1 | Basta cancellare la `a` iniziale |
| 4 | `ccbb` | 0 | Occorrenza esatta (quindi anche approssimata) |
| 5 | `cbb` | 1 | Basta inserire una `c` |

:::

:::caution[Slide 15: esempio da correggere]
La slide indica $i = 7$ come occorrenza approssimata, ma **non lo è**: da $i = 7$ partono `baa` e `baac`, che distano da `ccbb` almeno 4 (per $L = 5$ la sottostringa uscirebbe dal testo). Applicando la definizione, le occorrenze sono $i = 3, 4, 5$. La posizione 7 è quella in cui **finisce** l'occorrenza esatta $T[4:7]$, ed è probabile che l'esempio venga da lì.
:::

### Algoritmo Banale (Approssimato)

È la stessa idea della finestra scorrevole, ma con una finestra $W = [i : i + L - 1]$ di **lunghezza variabile**:

1. Si parte da $i = 1$ con la lunghezza minima $L = m - k$.
2. Se $ED(P, S) \le k$ con $S = T[i : i + L - 1]$, allora $i$ è un'occorrenza approssimata.
3. Altrimenti $W$ viene allungata a destra, finché non si verifica che $i$ è un'occorrenza oppure si raggiunge la lunghezza massima $m + k$.

```text
procedura trivial_approx_matching(T, P, k)
    n ← |T|
    m ← |P|
    i ← 1
    while i ≤ n-m+k+1 do
        L ← m-k
        while L ≤ m+k and i+L-1 ≤ n do
            if ED(P, T[i : i+L-1]) ≤ k then
                output i
                L ← m+k
            L ← L+1
        i ← i+1
```

Due dettagli vanno capiti:

- La posizione arriva fino a $n - m + k + 1$ e non fino a $n - m + 1$, perché l'ultima finestra deve contenere solo la lunghezza **minima** $m - k$.
- L'assegnamento `L ← m+k` serve a uscire dal ciclo interno: dopo `L ← L+1` la condizione $L \le m + k$ diventa falsa. Così ogni posizione viene stampata **una sola volta**, anche se più lunghezze funzionerebbero.

**Tempo computazionale**: $\mathcal{O}(knm^2)$, che si ottiene moltiplicando tre fattori:

| Fattore | Costo | Perché |
| --- | --- | --- |
| Posizioni $i$ | $\mathcal{O}(n)$ | Una iterazione esterna per posizione |
| Lunghezze $L$ | $\mathcal{O}(k)$ | Sono $2k + 1$ valori, da $m - k$ a $m + k$ |
| Calcolo di $ED$ | $\mathcal{O}(m^2)$ | Costa $\mathcal{O}(m \cdot L)$, con $L \le m + k \le 2m$ |

## Due Approcci per Fare Meglio

Entrambi gli algoritmi banali scorrono il testo senza imparare nulla. Per migliorarli si fa un **pre-processing**, cioè una fase di analisi preliminare, e ci sono due scelte possibili su cosa analizzare:

| Pre-processing del **pattern** | Pre-processing del **testo** |
| --- | --- |
| Ricerca esatta con Automa a Stati Finiti (ASF) | Suffix Array |
| Ricerca esatta Knuth-Morris-Pratt (KMP) | Burrows-Wheeler Transform (BWT) |
| Ricerca esatta con Baeza-Yates e Gonnet | FM-index |
| Ricerca approssimata con Wu e Manber (agrep) | |

Il primo approccio conviene quando il pattern è fisso e il testo cambia o arriva in continuazione. Il secondo conviene quando il testo è fisso e molto grande e si devono fare tante ricerche diverse, perché l'indice si costruisce una volta sola.

Le prossime lezioni coprono i primi due metodi della colonna di sinistra: [ASF](../02-ricerca-esatta-con-asf-parte-1/) e [KMP](../04-algoritmo-kmp/).

## Autotest

**1.** Trova tutte le occorrenze esatte di $P$ = `aba` in $T$ = `abababa`. Cosa noti?

<details>
<summary>Soluzione</summary>

Le occorrenze sono in posizione $1, 3, 5$. Le occorrenze possono **sovrapporsi**: un algoritmo corretto deve trovarle tutte, quindi dopo un'occorrenza non può saltare l'intera lunghezza del pattern.

</details>

**2.** Con $T = a^{10}$ e $P = a^3$, quanti confronti tra simboli fa l'algoritmo banale esatto?

<details>
<summary>Soluzione</summary>

Le finestre sono $n - m + 1 = 8$ e ognuna richiede $3$ confronti riusciti, quindi $8 \cdot 3 = 24$ confronti.

</details>

**3.** Calcola $ED$(`cane`, `cena`), $ED$(`casa`, `cassa`) e $ED$(`kitten`, `sitting`).

<details>
<summary>Soluzione</summary>

- $ED$(`cane`, `cena`) $= 2$: due sostituzioni (`a` → `e` e `e` → `a`).
- $ED$(`casa`, `cassa`) $= 1$: un inserimento.
- $ED$(`kitten`, `sitting`) $= 3$: `k` → `s`, `e` → `i`, inserimento della `g` finale.

</details>

**4.** Con $T$ = `abcabba`, $P$ = `abc` e $k = 1$: quali lunghezze $L$ vanno provate e quali sono le occorrenze approssimate?

<details>
<summary>Soluzione</summary>

Le lunghezze sono $L \in \{2, 3, 4\}$. Le occorrenze sono $i = 1$ (`ab`, ma anche l'esatta `abc`), $i = 2$ (`bc`) e $i = 4$ (`ab`).

</details>

**5.** Perché l'esistenza di una sottostringa con $ED(P, S) \le k$ implica $m - k \le L \le m + k$?

<details>
<summary>Soluzione</summary>

Sostituzioni, inserimenti e cancellazioni cambiano la lunghezza di una stringa rispettivamente di $0$, $+1$ e $-1$. Con al più $k$ operazioni la lunghezza varia al massimo di $k$, quindi $\lvert L - m \rvert \le k$.

</details>

**6.** Perché il ciclo esterno dell'algoritmo approssimato arriva a $n - m + k + 1$ e non a $n - m + 1$?

<details>
<summary>Soluzione</summary>

Perché la finestra più corta è lunga $m - k$: l'ultima posizione in cui ci sta è quella per cui $i + (m - k) - 1 = n$, cioè $i = n - m + k + 1$.

</details>

## Glossario

- **Testo ($T$)** - La stringa, di lunghezza $n$, in cui si cerca.
- **Pattern ($P$)** - La stringa, di lunghezza $m$, che si cerca.
- **Alfabeto ($\Sigma$)** - L'insieme dei simboli con cui sono costruite le stringhe.
- **Occorrenza esatta** - Posizione $i$ tale che $T[i : i + m - 1] = P$.
- **Occorrenza approssimata** - Posizione $i$ da cui parte una sottostringa $S$ con $ED(P, S) \le k$.
- **Finestra ($W$)** - Porzione del testo confrontata con il pattern in un dato momento.
- **Distanza di edit ($ED$)** - Minimo numero di sostituzioni, cancellazioni e inserimenti per trasformare una stringa in un'altra.
- **k-mer** - Sottostringa di lunghezza $k$ di una sequenza.
- **Pre-processing** - Fase preliminare di analisi del pattern o del testo che rende più veloce la ricerca.
