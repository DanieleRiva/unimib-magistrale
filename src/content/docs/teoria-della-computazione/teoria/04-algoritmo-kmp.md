---
title: Algoritmo di Knuth-Morris-Pratt (KMP)
description: Ricerca esatta con KMP, prefix function, regole di spostamento della finestra, scansione del testo e confronto con l'automa.
sidebar:
  order: 4
---

## Dall'Algoritmo Banale al KMP

Ripartiamo dall'[algoritmo banale](../01-introduzione-al-pattern-matching/#algoritmo-banale): una finestra $W = [i : i + m - 1]$ scorre lungo il testo $T$ da sinistra a destra partendo da $i = 1$. I simboli di $P$ vengono confrontati con i corrispondenti simboli di $T$ in $W$, a partire dal primo simbolo di $P$, per decidere se $i$ è un'occorrenza esatta. Poi $W$ si sposta di **una** posizione a destra.

Il KMP mantiene questo schema e migliora proprio l'ultimo passo. Se abbiamo confrontato con successo i primi $j - 1$ simboli di $P$ e poi c'è un mismatch, **conosciamo già** quei $j - 1$ simboli del testo: sono uguali a $P[1:j-1]$. L'algoritmo banale butta via questa informazione, il KMP la usa.

### Le Idee Principali

- **Evitare confronti ridondanti**: non si ricontrollano i caratteri del testo $T$ già verificati con successo nelle iterazioni precedenti.
- **Sfruttare la struttura del pattern**: quando si verifica un *mismatch*, il KMP sa esattamente di quanto far slittare il pattern, sfruttando i prefissi di $P$ che sono anche suoi suffissi.
- **Usare la Prefix Function $\pi$**: viene pre-calcolata una "funzione di fallimento" che indica lo spostamento sicuro massimo consentito della finestra $W$, basandosi unicamente sulle proprietà del pattern $P$.

### Le Due Fasi

| Fase | Cosa fa | Tempo |
| --- | --- | --- |
| **Pre-processing di $P$** | Costruzione della prefix function $\pi$ | $\Theta(m)$ |
| **Ricerca di $P$ in $T$** | Scansione del testo | $\Theta(n)$ |

## La Prefix Function

:::tip[Definizione]
La **Prefix Function** di un pattern $P$ di lunghezza $m$ è la funzione

$$
\pi : \{0, 1, \dots, m\} \to \{-1, 0, 1, \dots, m-1\}
$$

$$
\pi(j) = \begin{cases} \lvert B(P[1:j]) \rvert & \text{se } 1 \le j \le m \\ -1 & \text{se } j = 0 \end{cases}
$$
:::

In pratica, $\pi(j)$ è la lunghezza del [bordo](../02-ricerca-esatta-con-asf-parte-1/#il-bordo) del prefisso di $P$ lungo $j$. Il valore speciale $\pi(0) = -1$ ha uno scopo preciso, che vedremo tra poco.

:::note[Esempio]
Per $P$ = `abcabaabcabab` ($m = 13$):

| $P$ | | a | b | c | a | b | a | a | b | c | a | b | a | b |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $j$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
| $\pi(j)$ | -1 | 0 | 0 | 0 | 1 | 2 | 1 | 1 | 2 | 3 | 4 | 5 | 6 | 2 |

Ad esempio $\pi(5) = 2$ perché `abcab` ha bordo `ab`, e $\pi(12) = 6$ perché `abcabaabcaba` ha bordo `abcaba`.
:::

## Regole di Spostamento della Finestra

In caso di *mismatch* o di fine analisi, definiamo:

| Simbolo | Significato |
| --- | --- |
| $i$ | Posizione attuale della finestra $W$ |
| $j = \min\{j' \text{ t.c. } P[j'] \ne T[i + j' - 1]\}$ | Posizione di mismatch sul pattern $P$ |
| $P[1:j-1] = T[i : i+j-2]$ | **Prefisso di match** di $P$ rispetto a $T$ |
| $i + j - 1$ | Posizione di mismatch sul testo $T$ |

Se non c'è alcun mismatch, cioè il pattern è stato trovato per intero, si pone $j = m + 1$.

Il ragionamento è sempre lo stesso. Il prefisso di match è già stato letto, quindi la prossima posizione utile è quella in cui **un prefisso di $P$ si sovrappone a un suffisso del prefisso di match**. Il più lungo di questi è proprio il bordo di $P[1:j-1]$, lungo $\pi(j-1)$.

### Caso j > 1

Supponiamo un mismatch in $j = 6$ alla posizione $i = 7$:

```text
       1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17
T      a b c b b a a b c a  b  c  a  b  c  a  a
P                  a b c a  b  b  c  a               (i = 7)
P'                       a  b  c  a  b  b  c  a      (p = 10)
                               ^
                               T[12] = c, P[6] = b
```

Poniamo $k = \pi(j-1) = \pi(5) = 2$. Poiché $P[1:2]$ è un suffisso di $P[1:5]$, ed è uguale a $T[10:11]$:

- $W$ viene spostata da $i = 7$ a $p = i + j - \pi(j-1) - 1 = 10$.
- Il confronto riparte dalla posizione $\pi(j-1) + 1 = 3$ su $P$ e dalla posizione $i + j - 1 = 12$ su $T$.

I due simboli `ab` non vengono più confrontati: sappiamo già che coincidono.

### Caso π(j-1) = 0

Se il prefisso di match non ha prefissi che sono anche suoi suffissi, $\pi(5) = 0$:

```text
       1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17
T      a b c b b a c b c a  b  c  a  b  c  a  a
P                  c b c a  b  b  c  a               (i = 7)
P'                             c  b  c  a  b  b      (p = 12)
```

- $W$ viene spostata da $i = 7$ a $p = i + j - 0 - 1 = i + j - 1 = 12$.
- Il confronto riparte dalla posizione $\pi(j-1) + 1 = 1$ su $P$ e dalla posizione $i + j - 1 = 12$ su $T$.

È lo spostamento più lungo possibile: la finestra salta tutto il prefisso di match.

### Caso j = m + 1

Questo caso si verifica quando c'è un'**occorrenza completa**. Con $m = 8$ e $\pi(8) = 3$:

```text
       1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17
T      a b c b b a a b c a  b  a  b  c  c  a  a
P                  a b c a  b  a  b  c               (i = 7)
P'                             a  b  c  a  b  a      (p = 12)
```

- $W$ viene spostata da $i = 7$ a $p = i + (m + 1) - \pi(m) - 1 = 12$.
- I primi 3 caratteri corrispondono già. Il confronto riparte dalla posizione $\pi(m) + 1 = 4$ su $P$ e dalla posizione $i + m = 15$ su $T$.

Usare $\pi(m)$ e non spostarsi di $m$ posizioni è ciò che permette di trovare le occorrenze **sovrapposte**.

### Caso j = 1

Questo caso si verifica quando il mismatch avviene al primo carattere:

```text
       1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17
T      a b c b b a a b c a  b  c  a  b  c  a  a
P      c b c a b b c a                               (i = 1)
P'       c b c a b b c a                             (i = 2)
```

- $W$ viene spostata in avanti di una sola posizione, da $i = 1$ a $p = i + 1 = 2$.
- Il confronto riparte dalla posizione 1 su $P$ e dalla posizione $i + 1 = 2$ su $T$.

### Riepilogo delle Regole

| Caso | Nuova posizione $p$ di $W$ | Riparte su $P$ da | Riparte su $T$ da |
| --- | --- | --- | --- |
| $j > 1$ | $i + j - \pi(j-1) - 1$ | $\pi(j-1) + 1$ | $i + j - 1$ |
| $j = m + 1$ | $i + m - \pi(m)$ | $\pi(m) + 1$ | $i + m$ |
| $j = 1$ | $i + 1$ | $1$ | $i + 1$ |

Il caso $j = m + 1$ è la formula del caso $j > 1$ con $j$ sostituito. La finestra si sposta sempre di $(j - 1) - \pi(j - 1)$ posizioni: la lunghezza del prefisso di match meno il suo bordo.

:::tip[Perché π(0) = -1]
Anche il caso $j = 1$ rientra nella formula generale: con $\pi(0) = -1$ si ottiene $p = i + 1 - (-1) - 1 = i + 1$. Il valore $-1$ rende una sola regola valida per tutti i casi e, come vedremo, permette allo pseudocodice di non avere un ramo dedicato.
:::

### Perché lo Spostamento è Sicuro

:::note[Complemento: dimostrazione]
Le slide parlano di spostamento "sicuro": va dimostrato che tra $i$ e $p$ **non si salta nessuna occorrenza**.

Supponiamo per assurdo che ci sia un'occorrenza in $i'$ con $i < i' < p$. Allora il pattern allineato in $i'$ si sovrappone al prefisso di match per $\ell = i + j - 1 - i'$ simboli, e questi coincidono. Quindi $P[1:\ell]$ è suffisso di $P[1:j-1]$, e poiché $i' > i$ è un suffisso proprio: è un bordo di $P[1:j-1]$.

Ma da $i' < p = i + j - 1 - \pi(j-1)$ segue $\ell > \pi(j-1)$. Avremmo un bordo più lungo del più lungo: assurdo.
:::

## La Scansione del Testo

```text
Algoritmo KMP-scan(P, T, π)
 1: m ← |P|
 2: n ← |T|
 3: j ← 0
 4: for q ← 1 to n do
 5:     while j ≥ 0 and P[j+1] ≠ T[q] do
 6:         j ← π(j)
 7:     end while
 8:     j ← j + 1
 9:     if j = m then
10:         output q - m + 1
11:     end if
12: end for
```

:::caution[Il j dello pseudocodice non è il j delle regole]
Nelle regole di spostamento $j$ è la **posizione del mismatch**. In `KMP-scan`, $j$ è il **numero di simboli già in match**, quindi $P[j+1]$ è il prossimo simbolo da confrontare. Per questo la riga 6 scrive $\pi(j)$ dove le regole scrivevano $\pi(j-1)$: è la stessa cosa. Inoltre $q$ corrisponde a $i + j - 1$ delle regole, cioè alla posizione sul testo.
:::

Riga per riga:

- **Riga 4**: $q$ scorre il testo e **non torna mai indietro**.
- **Righe 5-7**: finché il prossimo simbolo del pattern non coincide con $T[q]$, si accorcia il prefisso di match passando al suo bordo. Ogni iterazione del `while` è uno spostamento della finestra.
- **Riga 8**: ora $P[j+1] = T[q]$, oppure $j = -1$. In entrambi i casi $j + 1$ è il nuovo numero di simboli in match.
- **Righe 9-10**: se $j = m$ abbiamo trovato un'occorrenza, che inizia in $q - m + 1$.

Il caso $j = -1$ corrisponde a "non si può più accorciare nulla": il ciclo termina per la guardia $j \ge 0$, la riga 8 riporta $j$ a 0 e il `for` passa al simbolo successivo del testo. È il caso $j = 1$ delle regole, gestito senza un ramo apposito grazie a $\pi(0) = -1$.

:::caution[Cosa succede dopo un'occorrenza]
Con $j = m$, alla riga 5 dell'iterazione successiva si legge $P[m+1]$, che non esiste. Lo pseudocodice sottintende una convenzione: $P[m+1]$ è un simbolo **diverso da tutti** quelli di $\Sigma$, così la condizione è vera e si esegue $j \leftarrow \pi(m)$, come nel caso $j = m + 1$ delle regole. In un programma si può anche scrivere $j \leftarrow \pi(m)$ subito dopo l'`output`.
:::

### Esecuzione Completa

Riprendiamo l'esempio dell'[automa](../03-ricerca-esatta-con-asf-parte-2/#esercizio-svolto): $T$ = `cabacacbacaba`, $P$ = `acacbac`. La prefix function è:

| $j$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $\pi(j)$ | -1 | 0 | 0 | 1 | 2 | 0 | 1 | 2 |

| $q$ | $T[q]$ | $j$ iniziale | Riga 6 ($j \leftarrow \pi(j)$) | $j$ finale | Note |
| --- | --- | --- | --- | --- | --- |
| 1 | c | 0 | 0 → -1 | 0 | |
| 2 | a | 0 | | 1 | |
| 3 | b | 1 | 1 → 0 → -1 | 0 | |
| 4 | a | 0 | | 1 | |
| 5 | c | 1 | | 2 | |
| 6 | a | 2 | | 3 | |
| 7 | c | 3 | | 4 | |
| 8 | b | 4 | | 5 | |
| 9 | a | 5 | | 6 | |
| 10 | c | 6 | | **7** | **Occorrenza in** $10 - 7 + 1 = 4$ |
| 11 | a | 7 | 7 → 2 | 3 | |
| 12 | b | 3 | 3 → 1 → 0 → -1 | 0 | |
| 13 | a | 0 | | 1 | |

:::tip[Osservazione chiave]
La colonna "$j$ finale" è `0 1 0 1 2 3 4 5 6 7 3 0 1`: **è identica alla sequenza degli stati dell'automa**. Il KMP è l'automa $ASF_P$ in cui le transizioni di mismatch non sono scritte in tabella, ma vengono ricalcolate al momento seguendo la catena $\pi$.
:::

### Complessità della Scansione

Il tempo di scansione è $\Theta(n)$, anche se c'è un `while` dentro un `for`. Un singolo simbolo può costare molto (per $q = 12$ ci sono tre iterazioni), ma il costo totale è limitato. Il ragionamento è **ammortizzato**:

- La riga 8 incrementa $j$ di 1, una volta per ogni $q$: in totale $j$ cresce di $n$.
- Ogni iterazione del `while` **diminuisce** $j$ di almeno 1, perché $\pi(j) < j$.
- Alla fine di ogni iterazione del `for` vale $j \ge 0$, quindi $j$ non può diminuire in totale più di quanto sia cresciuto.

Le iterazioni del `while` sono quindi al massimo $n$ in tutto, e il costo complessivo è $\Theta(n)$.

## Vantaggi e Confronto con l'Automa

I vantaggi del KMP:

- **Nessun backtracking sul testo**: il puntatore sul testo $T$ avanza soltanto. Questo lo rende perfetto per processare *data stream* continui.
- **Indipendenza dall'alfabeto**: lo spazio e il tempo di pre-processing dipendono unicamente dalla lunghezza del pattern $m$ e non dalla grandezza dell'alfabeto $\lvert \Sigma \rvert$.

| Parametro | Automa | KMP |
| --- | --- | --- |
| **Memoria occupata** | $\Theta(m \lvert \Sigma \rvert)$ | $\Theta(m)$ |
| **Tempo (pre-processing di $P$)** | $\Theta(m \lvert \Sigma \rvert)$ | $\Theta(m)$ |
| **Tempo (scansione di $T$)** | $\Theta(n)$ | $\Theta(n)$ |

Il tempo di scansione è lo stesso in entrambi i casi, ma il KMP ha bisogno di molta meno memoria e di meno preparazione. Il prezzo da pagare è che l'automa spende **tempo costante su ogni simbolo**, mentre il $\Theta(n)$ del KMP è ammortizzato: un singolo simbolo può richiedere diversi passi del `while`.

## Autotest

**1.** Calcola $\pi$ per `aabaab`, `aaaa`, `abacaba` e `abababca`.

<details>
<summary>Soluzione</summary>

| $P$ | $\pi(0), \pi(1), \dots, \pi(m)$ |
| --- | --- |
| `aabaab` | -1, 0, 1, 0, 1, 2, 3 |
| `aaaa` | -1, 0, 1, 2, 3 |
| `abacaba` | -1, 0, 0, 1, 0, 1, 2, 3 |
| `abababca` | -1, 0, 0, 1, 2, 3, 4, 0, 1 |

</details>

**2.** Con $P$ = `abababca`, finestra in $i = 3$ e mismatch in $j = 6$: dove va la finestra? Da dove riparte il confronto?

<details>
<summary>Soluzione</summary>

$\pi(5) = 3$, quindi $p = 3 + 6 - 3 - 1 = 5$. Il confronto riparte da $\pi(5) + 1 = 4$ su $P$ e da $i + j - 1 = 8$ su $T$.

</details>

**3.** Esegui `KMP-scan` con $P$ = `aaaa` e $T$ = `aaabaaaaa`.

<details>
<summary>Soluzione</summary>

Con $\pi$ = -1, 0, 1, 2, 3:

| $q$ | $T[q]$ | $j$ iniziale | Riga 6 | $j$ finale |
| --- | --- | --- | --- | --- |
| 1 | a | 0 | | 1 |
| 2 | a | 1 | | 2 |
| 3 | a | 2 | | 3 |
| 4 | b | 3 | 3 → 2 → 1 → 0 → -1 | 0 |
| 5 | a | 0 | | 1 |
| 6 | a | 1 | | 2 |
| 7 | a | 2 | | 3 |
| 8 | a | 3 | | **4** |
| 9 | a | 4 | 4 → 3 | **4** |

Occorrenze: $8 - 4 + 1 = 5$ e $9 - 4 + 1 = 6$. Per $q = 4$ il `while` fa 4 iterazioni: è il motivo per cui il costo per singolo simbolo non è costante.

</details>

**4.** Perché il `while` dentro al `for` non rende il KMP quadratico?

<details>
<summary>Soluzione</summary>

Perché ogni iterazione del `while` diminuisce $j$ di almeno 1, mentre $j$ aumenta di 1 solo una volta per iterazione del `for`. Sommando su tutta l'esecuzione, le iterazioni del `while` non possono essere più degli incrementi, cioè $n$.

</details>

**5.** Perché non si può saltare direttamente tutto il prefisso di match, spostando sempre la finestra alla posizione del mismatch?

<details>
<summary>Soluzione</summary>

Perché si perderebbero le occorrenze che iniziano dentro il prefisso di match. Ad esempio, con $P$ = `aaaa` e $T$ = `aaaaa` ci sono occorrenze in 1 e 2, che verrebbero saltate. Il bordo indica esattamente quanto si può sovrapporre.

</details>

**6.** Che relazione c'è tra KMP e automa?

<details>
<summary>Soluzione</summary>

Il valore di $j$ dopo ogni simbolo è lo stesso stato dell'automa. La differenza è che l'automa ha in tabella la transizione già pronta, mentre il KMP la ricostruisce seguendo la catena di $\pi$, risparmiando la memoria per $\lvert \Sigma \rvert$ colonne.

</details>

## Glossario

- **KMP** - Algoritmo di ricerca esatta di Knuth, Morris e Pratt, con pre-processing $\Theta(m)$ e scansione $\Theta(n)$.
- **Prefix Function ($\pi$)** - Detta anche funzione di fallimento: $\pi(j) = \lvert B(P[1:j]) \rvert$ e $\pi(0) = -1$.
- **Mismatch** - Mancata corrispondenza tra un simbolo del pattern e il simbolo del testo allineato.
- **Prefisso di match** - La parte $P[1:j-1]$ del pattern che coincide con il testo prima del mismatch.
- **Backtracking** - Tornare indietro su una posizione già letta del testo. Il KMP non lo fa mai.
- **Analisi ammortizzata** - Valutazione del costo totale di una sequenza di operazioni, anche se le singole operazioni hanno costi molto diversi.
