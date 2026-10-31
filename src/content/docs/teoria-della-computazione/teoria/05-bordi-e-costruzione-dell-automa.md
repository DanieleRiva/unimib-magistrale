---
title: Bordi, Funzione Prefisso e Costruzione dell'Automa
description: Definizione induttiva di bordo, algoritmi per calcolare la funzione prefisso del KMP e la funzione di transizione dell'automa, con analisi di complessità.
sidebar:
  order: 5
---

## Il Filo Conduttore

L'automa e il KMP si basano sullo stesso concetto, il [bordo](../02-ricerca-esatta-con-asf-parte-1/#il-bordo), ma finora abbiamo solo **dichiarato** i tempi di pre-processing:

| Struttura | Tempo dichiarato |
| --- | --- |
| Funzione prefisso $\pi$ | $\Theta(m)$ |
| Tabella di transizione $\delta$ | $\Theta(m \lvert \Sigma \rvert)$ |

Questa lezione mostra come ottenerli. La chiave è non calcolare ogni bordo da zero, ma **ricavarlo dal bordo del prefisso precedente**, cioè definire il bordo per induzione.

## Definizione Induttiva di Bordo

Sia $x$ una stringa e $c$ un simbolo:

$$
B(\varepsilon) = \varepsilon \quad \text{e} \quad B(xc) = \varepsilon \text{ se } x = \varepsilon
$$

$$
B(xc) = B(x)c \quad \text{se } x \ne \varepsilon \text{ e } c \text{ è nella posizione } \lvert B(x) \rvert + 1 \text{ di } x
$$

$$
B(xc) = B(B(x)c) \quad \text{altrimenti}
$$

:::caution[Slide 2]
La slide scrive $\lvert B(xc) \rvert = \epsilon$, che mescola una lunghezza con una stringa. Il senso è $B(xc) = \varepsilon$, ovvero $\lvert B(xc) \rvert = 0$: una stringa di un solo simbolo ha bordo vuoto.
:::

L'intuizione è questa. Un bordo non vuoto di $xc$ termina con $c$, quindi togliendo $c$ si ottiene un bordo di $x$ (eventualmente vuoto). Allora, per trovare il bordo di $xc$, si guarda **quali bordi di $x$ si possono estendere con $c$**, partendo dal più lungo:

- Il candidato migliore è $B(x)$. Se il simbolo che lo segue in $x$ è proprio $c$, cioè se $x[\lvert B(x) \rvert + 1] = c$, allora $B(x)c$ è il bordo cercato (**secondo caso**).
- Se non si può estendere, si prova con bordi più corti. I bordi di $x$ più corti di $B(x)$ sono esattamente i bordi di $B(x)$, quindi il problema si riduce a calcolare il bordo di $B(x)c$ (**terzo caso**).

Con $x$ = `abcaba` si ha $B(x)$ = `a`, quindi il simbolo in posizione $\lvert B(x) \rvert + 1 = 2$ è `b`:

- **Secondo caso**, $c$ = `b`: `b` è il simbolo atteso, quindi $B(\texttt{abcabab}) = \texttt{a}\texttt{b} = \texttt{ab}$.
- **Terzo caso**, $c$ = `c`: `c` non è il simbolo atteso, quindi $B(\texttt{abcabac}) = B(\texttt{a}\texttt{c}) = B(\texttt{ac}) = \varepsilon$.

:::note[Esempio: quando serve scendere]
Con $x$ = `abcabaabcaba` si ha $B(x)$ = `abcaba`, e il simbolo in posizione 7 è `a`. Leggendo $c$ = `b` non si può estendere, quindi:

$$
B(xc) = B(\texttt{abcaba}\,\texttt{b}) = B(\texttt{abcabab}) = \texttt{ab}
$$

È esattamente il passaggio $\pi(12) = 6$, $\pi(13) = 2$ della tabella vista nel KMP.
:::

### La Catena dei Bordi

Il terzo caso funziona grazie a una proprietà da ricordare:

:::tip[Catena dei bordi]
I bordi di $X$ sono **tutti e soli** quelli della catena $B(X)$, $B(B(X))$, $B(B(B(X)))$, ..., fino a $\varepsilon$.
:::

Il motivo è che un bordo $y$ di $X$ più corto di $B(X)$ è prefisso e suffisso di $X$, quindi anche di $B(X)$, che è a sua volta prefisso e suffisso di $X$. Perciò $y$ è un bordo di $B(X)$.

Nel linguaggio del KMP, la catena si percorre iterando $\pi$: $\pi(j)$, $\pi(\pi(j))$, e così via. È quello che fa l'istruzione $k \leftarrow \pi[k]$.

## Costruzione Diretta dell'Automa

Il primo algoritmo costruisce $\delta$ stato per stato, senza calcolare $\pi$ a parte:

```text
Algorithm 1: Costruzione Automa
 1: procedure Costruzione-Automa(P)
 2:     m ← |P|
 3:     for all c ∈ Σ do
 4:         δ[0, c] ← 0                     ▷ Stato iniziale 0
 5:     end for
 6:     for i ← 1 to m do
 7:         s ← δ[i-1, P[i]]
 8:         δ[i-1, P[i]] ← i                ▷ Crea lo stato i
 9:         for all c ∈ Σ do
10:             δ[i, c] ← δ[s, c]
11:         end for
12:     end for
13:     return tabella δ
14: end procedure
```

Sembra magia, ma è la definizione induttiva tradotta in codice. Chiamiamo $x = P[1:i]$.

**Riga 7**: $s \leftarrow \delta[i-1, P[i]]$ mette in $s$ la lunghezza del bordo di $P[1:i]$, cioè $\lvert B(x) \rvert$. Infatti, in quel momento, la cella contiene ancora il valore di raccordo $\lvert B(P[:i-1]P[i]) \rvert$, perché non è stata ancora sovrascritta.

**Riga 8**: ora si può sovrascrivere la cella con la transizione di avanzamento.

**Riga 10**: per ogni $c \ne P[i+1]$, $\delta[i, c] \leftarrow \delta[s, c]$ calcola $\lvert B(B(x)c) \rvert$, cioè il raccordo del terzo caso. Lo stato $s$ si comporta come un'ombra: dallo stato $i$, per ogni mismatch, si fa ciò che farebbe lo stato $s$.

:::tip[Il trucco dell'ordine]
La riga 10 riempie la riga $i$ **per tutti** i simboli, anche per $c = P[i+1]$, che dovrebbe essere un avanzamento. Non è un errore: quel valore è provvisorio, ma alla prossima iterazione del ciclo la riga 7 lo **legge** (e gli serve proprio il valore di raccordo!) prima che la riga 8 lo sovrascriva. Le slide lo dicono così: l'istruzione 10 viene effettuata per $i - 1$ prima della 7 per lo stato $i$.
:::

:::note[Perché la riga 10 legge valori già definitivi]
All'inizio dell'iterazione $i$ le righe della tabella da $0$ a $i - 2$ sono definitive, mentre la riga $i - 1$ manca solo della cella di avanzamento, che viene scritta alla riga 8. Poiché $s = \lvert B(x) \rvert \le i - 1$, la riga 10 copia una riga già completa.
:::

### Esempio di Esecuzione

Con $P$ = `acacbac` e $\Sigma = \{a, b, c\}$, ogni riga $(a, b, c)$ viene copiata dalla riga $s$:

| $i$ | $P[i]$ | $s$ (riga 7) | Riga 8 | Riga $i$ copiata |
| --- | --- | --- | --- | --- |
| 1 | a | 0 | $\delta[0, a] \leftarrow 1$ | da riga 0: (1, 0, 0) |
| 2 | c | 0 | $\delta[1, c] \leftarrow 2$ | da riga 0: (1, 0, 0) |
| 3 | a | 1 | $\delta[2, a] \leftarrow 3$ | da riga 1: (1, 0, 2) |
| 4 | c | 2 | $\delta[3, c] \leftarrow 4$ | da riga 2: (3, 0, 0) |
| 5 | b | 0 | $\delta[4, b] \leftarrow 5$ | da riga 0: (1, 0, 0) |
| 6 | a | 1 | $\delta[5, a] \leftarrow 6$ | da riga 1: (1, 0, 2) |
| 7 | c | 2 | $\delta[6, c] \leftarrow 7$ | da riga 2: (3, 0, 0) |

Il risultato è la tabella della [Parte I](../02-ricerca-esatta-con-asf-parte-1/#costruire-la-tabella-a-mano). Si noti che la colonna $s$ è `0 0 1 2 0 1 2`: sono esattamente i valori $\pi(1), \dots, \pi(7)$. L'algoritmo calcola la funzione prefisso **come effetto collaterale**.

**Complessità**: $m$ iterazioni, ognuna delle quali copia $\lvert \Sigma \rvert$ celle, quindi $\Theta(m \lvert \Sigma \rvert)$.

## Calcolo della Funzione Prefisso

Il secondo approccio separa i compiti: prima si calcola $\pi$, poi si usa $\pi$ per riempire $\delta$.

```text
Algorithm 3: Calcolo dei Bordi (Funzione Prefisso KMP)
 1: procedure Calcola-Bordi(P)
 2:     m ← |P|
 3:     π[1] ← 0
 4:     k ← 0
 5:     for i ← 2 to m do
 6:         while k > 0 and P[k+1] ≠ P[i] do
 7:             k ← π[k]
 8:         end while
 9:         if P[k+1] = P[i] then
10:             k ← k + 1
11:         end if
12:         π[i] ← k
13:     end for
14:     return π
15: end procedure
```

All'inizio di ogni iterazione, $k = \pi[i-1]$ è la lunghezza del bordo del prefisso precedente. Il ciclo traduce la definizione induttiva, con $x = P[1:i-1]$ e $c = P[i]$:

- **Righe 6-7 (terzo caso)**: se il bordo non si può estendere, si passa al bordo del bordo, scendendo lungo la catena.
- **Righe 9-10 (secondo caso)**: se $P[k+1] = P[i]$, il bordo si estende di un simbolo.
- **Riga 12**: si salva il risultato. Se $k$ è arrivato a 0 e $P[1] \ne P[i]$, il bordo è vuoto.

:::note[È il KMP applicato al pattern stesso]
Il codice è quasi identico a `KMP-scan`: `Calcola-Bordi` cerca $P$ dentro $P$ a partire dalla posizione 2. Cambia solo la gestione del caso limite: qui la guardia è $k > 0$ con un `if` separato, là è $j \ge 0$ con $\pi(0) = -1$. Questo algoritmo non usa $\pi[0]$, perché non scende sotto $k = 0$.
:::

### Esempio di Esecuzione

Con $P$ = `abcabaabcabab`:

| $i$ | $P[i]$ | $k$ iniziale | Riga 7 ($k \leftarrow \pi[k]$) | $\pi[i]$ |
| --- | --- | --- | --- | --- |
| 2 | b | 0 | | 0 |
| 3 | c | 0 | | 0 |
| 4 | a | 0 | | 1 |
| 5 | b | 1 | | 2 |
| 6 | a | 2 | 2 → 0 | 1 |
| 7 | a | 1 | 1 → 0 | 1 |
| 8 | b | 1 | | 2 |
| 9 | c | 2 | | 3 |
| 10 | a | 3 | | 4 |
| 11 | b | 4 | | 5 |
| 12 | a | 5 | | 6 |
| 13 | b | 6 | 6 → 1 | 2 |

Guardiamo il caso $i = 13$. Si parte da $k = 6$, ma $P[7]$ = `a` è diverso da $P[13]$ = `b`. Si scende a $k = \pi[6] = 1$, e ora $P[2]$ = `b` coincide con $P[13]$. Quindi $k$ diventa 2 e $\pi[13] = 2$.

### Complessità

- L'istruzione 5 itera $m - 1$ volte il ciclo `while` delle righe 6-7 (torna indietro) e le istruzioni delle righe 9-10 (avanzamento).
- Le righe 9-10 hanno costo costante.
- Il ciclo `while` non ha costo costante, ma itera al più un numero di volte pari alla parte di pattern che è in match per via delle righe 9-10.

:::caution[La trappola del tempo quadratico]
Un `while` dentro un `for` fa pensare a $\mathcal{O}(m^2)$, ma il conto è **ammortizzato**: non si limita il costo di una singola iterazione, ma il **totale**. La variabile $k$ parte da 0, viene incrementata al massimo una volta per iterazione (quindi al più $m - 1$ volte in tutto), e ogni iterazione del `while` la diminuisce di almeno 1 senza mai portarla sotto 0.

Non si può togliere più di quanto si è messo: in tutta l'esecuzione il `while` fa al massimo $m - 1$ iterazioni. Il costo è quindi al più il doppio del costo degli avanzamenti, e $\pi$ è calcolata in tempo complessivo **lineare in $m$**, cioè $\Theta(m)$.
:::

## Costruzione della Tabella con π

```text
Algorithm 4: Costruzione Automa
 1: procedure Costruzione-Automa(P, Σ)
 2:     m ← |P|
 3:     π ← Calcola-Bordi(P)                ▷ Richiama la funzione dei bordi
 4:     for all c ∈ Σ do
 5:         δ[0, c] ← 0
 6:     end for
 7:     δ[0, P[1]] ← 1
 8:     for i ← 1 to m do
 9:         for all c ∈ Σ do
10:             if i < m and c = P[i+1] then
11:                 δ[i, c] ← i + 1         ▷ Match: avanza
12:             else
13:                 δ[i, c] ← δ[π[i], c]    ▷ Mismatch: fallback via π
14:             end if
15:         end for
16:     end for
17:     return tabella δ
18: end procedure
```

La riga 13 è il cuore dell'algoritmo:

$$
\delta(i, c) = \lvert B(P[:i]c) \rvert = \delta(\pi(i), c) \quad \text{se } i = m \vee c \ne P[i+1]
$$

Vale per i due casi della definizione induttiva, con $x = P[:i]$ e quindi $\lvert B(x) \rvert = \pi(i)$:

- Se $c$ estende il bordo, $\delta(\pi(i), c)$ è un avanzamento e vale $\pi(i) + 1 = \lvert B(x)c \rvert$.
- Se non lo estende, $\delta(\pi(i), c)$ è un raccordo e vale $\lvert B(B(x)c) \rvert$.

Poiché $\pi[i] < i$, la riga $\pi[i]$ della tabella è già stata riempita quando serve: per questo gli stati si processano in ordine crescente. La guardia $i < m$ alla riga 10 gestisce lo stato finale, in cui ogni simbolo è un mismatch perché $P[m+1]$ non esiste.

:::note[Esempio]
Con $P$ = `acacbac` e $\pi$ = -1, 0, 0, 1, 2, 0, 1, 2:

- $\delta(4, a) = \delta(\pi(4), a) = \delta(2, a) = 3$
- $\delta(6, a) = \delta(\pi(6), a) = \delta(1, a) = 1$
- $\delta(7, a) = \delta(\pi(7), a) = \delta(2, a) = 3$

:::

Questa formula spiega anche il legame con il KMP: la riga 13 è il `while` di `KMP-scan` **eseguito in anticipo e salvato in tabella**. Il KMP fa quei salti durante la scansione, l'automa li fa tutti una volta sola durante la costruzione.

### Complessità

- L'istruzione 8 itera $m$ volte un ciclo per ogni simbolo $c \in \Sigma$.
- Le istruzioni 11 e 13 hanno un costo costante, fissata la tabella per $\pi$.
- Il calcolo di $\pi$ costa $\Theta(m)$, che viene assorbito.

Il costo complessivo è quindi $\mathcal{O}(m \cdot \lvert \Sigma \rvert)$, e dato che ogni cella va scritta è $\Theta(m \lvert \Sigma \rvert)$.

:::caution[Slide 9]
La slide scrive $O(m \cdot \Sigma)$: va inteso come $\lvert \Sigma \rvert$, la **cardinalità** dell'alfabeto, come nelle altre slide. Inoltre lo pseudocodice della slide 8 è tagliato dopo la riga 14: le righe 15-18 qui sopra sono state completate per chiudere i cicli.
:::

## Riepilogo per l'Esame

| Concetto | Formula |
| --- | --- |
| **Bordo** | $B(X)$ = più lungo prefisso proprio di $X$ che ne è anche suffisso |
| **Transizione (avanzamento)** | $j < m \wedge P[j+1] = s \Rightarrow \delta(j,s) = j + 1$ |
| **Transizione (raccordo)** | $j = m \vee P[j+1] \ne s \Rightarrow \delta(j,s) = \lvert B(P[:j]s) \rvert$ |
| **Raccordo calcolato con $\pi$** | $\delta(i, c) = \delta(\pi(i), c)$ |
| **Prefix function** | $\pi(j) = \lvert B(P[1:j]) \rvert$, $\pi(0) = -1$ |
| **Nuova posizione della finestra** | $p = i + j - \pi(j-1) - 1$ |
| **Occorrenza** | Stato $m$ dopo aver letto $T[i]$ $\Rightarrow$ inizio in $i - m + 1$ |

| Algoritmo | Pre-processing | Spazio | Ricerca |
| --- | --- | --- | --- |
| Banale esatto | Nessuno | $\mathcal{O}(1)$ | $\mathcal{O}(nm)$ |
| Banale approssimato | Nessuno | Quello di $ED$ | $\mathcal{O}(knm^2)$ |
| Automa (ASF) | $\Theta(m \lvert \Sigma \rvert)$ | $\Theta(m \lvert \Sigma \rvert)$ | $\Theta(n)$ |
| KMP | $\Theta(m)$ | $\Theta(m)$ | $\Theta(n)$ |

## Autotest

**1.** Esegui `Calcola-Bordi` su $P$ = `abacaba`.

<details>
<summary>Soluzione</summary>

| $i$ | $P[i]$ | $k$ iniziale | Riga 7 | $\pi[i]$ |
| --- | --- | --- | --- | --- |
| 2 | b | 0 | | 0 |
| 3 | a | 0 | | 1 |
| 4 | c | 1 | 1 → 0 | 0 |
| 5 | a | 0 | | 1 |
| 6 | b | 1 | | 2 |
| 7 | a | 2 | | 3 |

Quindi $\pi[1..7]$ = 0, 0, 1, 0, 1, 2, 3.

</details>

**2.** Esegui l'Algorithm 1 su $P$ = `abaaba` con $\Sigma = \{a, b\}$. Quali valori assume $s$?

<details>
<summary>Soluzione</summary>

$s$ assume i valori 0, 0, 1, 1, 2, 3, cioè $\pi(1), \dots, \pi(6)$. La tabella finale è quella dell'[automa di `abaaba`](../02-ricerca-esatta-con-asf-parte-1/#lautoma-come-grafo).

</details>

**3.** Per $P$ = `abaaba` calcola $\delta(6, a)$ e $\delta(6, b)$ usando la formula con $\pi$.

<details>
<summary>Soluzione</summary>

$\pi(6) = 3$, quindi $\delta(6, a) = \delta(3, a) = 4$ e $\delta(6, b) = \delta(3, b) = 2$. Sono le due frecce rosse uscenti dallo stato finale nel disegno.

</details>

**4.** Perché `Calcola-Bordi` è lineare e non quadratico?

<details>
<summary>Soluzione</summary>

Perché $k$ viene incrementato al più $m - 1$ volte, una per iterazione del `for`, e ogni iterazione del `while` lo diminuisce di almeno 1 senza farlo mai diventare negativo. Il numero totale di iterazioni del `while` è quindi al più $m - 1$, e il costo totale è $\Theta(m)$.

</details>

**5.** Nell'Algorithm 1, perché la riga 7 deve stare prima della riga 8?

<details>
<summary>Soluzione</summary>

Perché la cella $\delta[i-1, P[i]]$ contiene il valore di raccordo, che è proprio $\lvert B(P[1:i]) \rvert$. La riga 8 lo sovrascrive con l'avanzamento: invertendole, quel valore andrebbe perso e $s$ varrebbe sempre $i$.

</details>

**6.** Nell'Algorithm 4, cosa cambierebbe togliendo la guardia $i < m$ alla riga 10?

<details>
<summary>Soluzione</summary>

Per $i = m$ si leggerebbe $P[m+1]$, che non esiste. La guardia assicura che dallo stato finale tutte le transizioni siano di raccordo.

</details>

**7.** Perché i bordi di $X$ più corti di $B(X)$ sono bordi di $B(X)$?

<details>
<summary>Soluzione</summary>

Sia $y$ un bordo di $X$ con $\lvert y \rvert < \lvert B(X) \rvert$. Allora $y$ è prefisso di $X$ e, essendo più corto, è prefisso di $B(X)$, che è un prefisso di $X$. Allo stesso modo $y$ è suffisso di $X$ e quindi suffisso di $B(X)$, che è un suffisso di $X$. Quindi $y$ è un bordo di $B(X)$.

</details>

## Glossario

- **Definizione induttiva di bordo** - Calcola $B(xc)$ a partire da $B(x)$, estendendolo con $c$ oppure scendendo a $B(B(x)c)$.
- **Catena dei bordi** - La sequenza $B(X), B(B(X)), \dots, \varepsilon$, che contiene tutti i bordi di $X$.
- **Stato ombra ($s$)** - Nell'Algorithm 1, lo stato $\lvert B(P[1:i]) \rvert$ da cui lo stato $i$ copia le sue transizioni di mismatch.
- **Calcola-Bordi** - Algoritmo che calcola $\pi$ in tempo $\Theta(m)$.
- **Fallback** - Transizione di mismatch ottenuta da quella dello stato $\pi(i)$.
