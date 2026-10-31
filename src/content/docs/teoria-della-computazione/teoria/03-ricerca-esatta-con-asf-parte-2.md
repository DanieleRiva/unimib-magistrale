---
title: Ricerca Esatta con ASF (Parte II)
description: Ricerca di un pattern nel testo con l'automa, significato degli stati, teorema principale ed esecuzione passo per passo.
sidebar:
  order: 3
---

## Le Due Fasi della Ricerca

La ricerca con automa si divide in due momenti ben separati.

**Pre-processing di $P$**: si costruisce l'automa $ASF_P$, in tempo $\Theta(m \lvert \Sigma \rvert)$. Le sue componenti sono quelle viste nella [lezione precedente](../02-ricerca-esatta-con-asf-parte-1/):

- $\Sigma$, alfabeto di definizione di $P$
- $Q = \{0, 1, 2, 3, \dots, m-1, m\}$
- $\delta : Q \times \Sigma \to Q$, funzione di transizione
- $q_0 = 0$
- $F = \{m\}$

**Ricerca di $P$ in un testo $T$**: viene effettuata in tempo $\Theta(n)$.

Ricordiamo le regole della funzione di transizione:

| Regola | Condizione | Risultato |
| --- | --- | --- |
| **Avanzamento** | $j < m \wedge P[j+1] = s$ | $\delta(j, s) = j + 1$ |
| **Raccordo** | $j = m \vee P[j+1] \ne s$ | $\delta(j, s) = \lvert B(P[:j]s) \rvert$ |

:::note[Il tempo di pre-processing non è ovvio]
Applicando la definizione alla lettera, per ognuna delle $\Theta(m \lvert \Sigma \rvert)$ celle dovremmo cercare un bordo provando fino a $m$ lunghezze, ciascuna con un confronto da $\mathcal{O}(m)$: si arriverebbe a $\mathcal{O}(m^3 \lvert \Sigma \rvert)$. Il costo $\Theta(m \lvert \Sigma \rvert)$ richiede un algoritmo più furbo, che si vede [nella lezione 5](../05-bordi-e-costruzione-dell-automa/).
:::

## Il Significato degli Stati

Chiamiamo $j_i$ lo stato in cui si trova l'automa dopo aver letto $T[i]$, con $j_0 = 0$. Il passaggio di stato

$$
j_{i-1} \xrightarrow{T[i]} j_i
$$

equivale a dire che:

$$
P[:j_i] = T[i - j_i + 1 : i]
$$

Cioè: **i primi $j_i$ simboli del pattern coincidono con gli ultimi $j_i$ simboli letti del testo**. E non è una lunghezza qualsiasi, ma la più lunga possibile. Questa è la proprietà che rende corretto l'algoritmo.

:::tip[Teorema Principale]
$j_i$ (con $0 \le i \le n$) è lo stato a cui l'automa $ASF_P$ arriva dopo aver letto $T[i]$ **se e solo se** $j_i$ è la lunghezza del più lungo prefisso di $P$ uguale a una sottostringa di $T$ che finisce in posizione $i$.
:::

Di conseguenza, se lo stato raggiunto è quello finale $m$:

$$
j_{i-1} \xrightarrow{T[i]} m \;\Longrightarrow\; P = T[i - m + 1 : i]
$$

Il "se e solo se" garantisce due cose insieme: ogni volta che l'automa arriva in $m$ c'è davvero un'occorrenza, e ogni occorrenza viene segnalata.

:::note[Complemento: dimostrazione del Teorema]
Le slide enunciano il teorema senza dimostrarlo. La dimostrazione si appoggia a un fatto preliminare.

**Lemma.** $\delta(j, s)$ è il massimo $k$ tale che $P[:k]$ è suffisso di $P[:j]s$.

Se $s = P[j+1]$ con $j < m$, allora $P[:j]s = P[:j+1]$ e il massimo è $j + 1$. Altrimenti $P[:j]s$ non è un prefisso di $P$, quindi $k \le j$ e $P[:k]$ è un prefisso proprio di $P[:j]s$ che ne è anche suffisso: il massimo è $\lvert B(P[:j]s) \rvert$.

**Teorema.** Sia $\sigma(i)$ la lunghezza del più lungo prefisso di $P$ che è suffisso di $T[:i]$. Dimostriamo $j_i = \sigma(i)$ per induzione su $i$. Per $i = 0$ entrambi valgono 0. Per il passo, assumiamo $j_{i-1} = \sigma(i-1)$:

- $j_i \le \sigma(i)$: per il Lemma, $P[:j_i]$ è suffisso di $P[:j_{i-1}]T[i]$, che per ipotesi è suffisso di $T[:i]$. Quindi $P[:j_i]$ è suffisso di $T[:i]$.
- $\sigma(i) \le j_i$: sia $k = \sigma(i) > 0$ (se $k = 0$ non c'è nulla da dimostrare). Allora $P[:k-1]$ è suffisso di $T[:i-1]$, quindi $k - 1 \le j_{i-1}$ e $P[:k-1]$ è suffisso di $P[:j_{i-1}]$. Dunque $P[:k]$ è suffisso di $P[:j_{i-1}]T[i]$ e per il Lemma $k \le j_i$.
:::

## L'Algoritmo

1. $ASF_P$ parte dallo stato iniziale $j_0 = 0$ e legge i simboli di $T$ uno dopo l'altro.
2. Per ogni simbolo $T[i]$ letto, effettua la transizione dallo stato corrente $j_{i-1}$ al nuovo stato $j_i = \delta(j_{i-1}, T[i])$.
3. Ogni volta che lo stato $j_i$ è uguale allo stato accettante $m$, produce in output l'occorrenza esatta $i - m + 1$.

```text
procedura ASF_string_matching(δ, T, m)
begin
    n ← |T|
    j ← 0
    for i ← 1 to n do
        j ← δ(j, T[i])
        if j = m then
            output i - m + 1        // exact occurrence
end
```

Il valore stampato è $i - m + 1$ perché $i$ è la posizione in cui l'occorrenza **finisce**, mentre le occorrenze si identificano con la posizione in cui **iniziano**.

**Complessità**: il ciclo fa esattamente $n$ iterazioni e ognuna è una lettura in tabella a costo costante, quindi $\Theta(n)$ indipendentemente dal testo e dal pattern. Il puntatore su $T$ non torna mai indietro.

## Esercizio Svolto

Testo $T$ = `cabacacbacaba` ($n = 13$), pattern $P$ = `acacbac` ($m = 7$). La tabella delle transizioni è quella costruita nella lezione precedente:

| Stato $j$ | $\delta(j, a)$ | $\delta(j, b)$ | $\delta(j, c)$ |
| --- | --- | --- | --- |
| **0** | 1 | 0 | 0 |
| **1** | 1 | 0 | 2 |
| **2** | 3 | 0 | 0 |
| **3** | 1 | 0 | 4 |
| **4** | 3 | 5 | 0 |
| **5** | 6 | 0 | 0 |
| **6** | 1 | 0 | 7 |
| **7** | 3 | 0 | 0 |

Partiamo dallo stato $j = 0$ e leggiamo il testo:

| $i$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | **10** | 11 | 12 | 13 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $T[i]$ | c | a | b | a | c | a | c | b | a | **c** | a | b | a |
| Stato $j$ | 0 | 1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | **7** | 3 | 0 | 1 |

Ogni passo è una lettura in tabella:

- Al passo $i = 1$ leggo `c`: $\delta(0, c) = 0$.
- Al passo $i = 2$ leggo `a`: $\delta(0, a) = 1$.
- Al passo $i = 3$ leggo `b`: $\delta(1, b) = 0$.
- Da $i = 4$ a $i = 9$ l'automa avanza ogni volta di uno stato: $\delta(0, a) = 1$, $\delta(1, c) = 2$, $\delta(2, a) = 3$, $\delta(3, c) = 4$, $\delta(4, b) = 5$, $\delta(5, a) = 6$.
- Al passo $i = 10$ leggo `c` a partire dallo stato 6: $\delta(6, c) = 7$.

Lo stato 7 è $m$: **$P$ occorre in posizione $i - m + 1 = 10 - 7 + 1 = 4$**. Infatti $T[4:10]$ = `acacbac`.

L'algoritmo non si ferma, ma prosegue per trovare eventuali occorrenze successive:

- Al passo $i = 11$ leggo `a`: $\delta(7, a) = 3$. Il prefisso `aca` è effettivamente il suffisso del testo letto finora.
- Al passo $i = 12$ leggo `b`: $\delta(3, b) = 0$.
- Al passo $i = 13$ leggo `a`: $\delta(0, a) = 1$.

Il testo è finito e lo stato non è più tornato a 7, quindi l'unica occorrenza è in posizione 4.

Possiamo controllare il Teorema su una colonna qualsiasi. Per $i = 7$ lo stato è 4, e infatti $T[4:7]$ = `acac` = $P[:4]$.

## Autotest

**1.** Esegui l'automa di $P$ = `abab` sul testo $T$ = `aababab`. Quali occorrenze trovi? (La tabella è nell'Autotest della lezione precedente.)

<details>
<summary>Soluzione</summary>

| $i$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $T[i]$ | a | a | b | a | b | a | b |
| Stato $j$ | 1 | 1 | 2 | 3 | **4** | 3 | **4** |

Lo stato 4 viene raggiunto per $i = 5$ e $i = 7$, quindi le occorrenze sono $5 - 4 + 1 = 2$ e $7 - 4 + 1 = 4$. Si sovrappongono: la transizione $\delta(4, a) = 3$ è ciò che permette di trovare anche la seconda.

</details>

**2.** Nell'automa di $P$ = `abab`, dopo aver letto $T[i]$ lo stato è 3. Cosa sai con certezza del testo?

<details>
<summary>Soluzione</summary>

Che $T[i-2:i]$ = `aba` e che nessun prefisso più lungo di $P$ finisce in posizione $i$. In particolare $i$ non è la fine di un'occorrenza.

</details>

**3.** Perché lo stato finale $m$ ha transizioni uscenti, se abbiamo già trovato l'occorrenza?

<details>
<summary>Soluzione</summary>

Perché la ricerca deve continuare sul resto del testo, e un'occorrenza successiva si può sovrapporre a quella appena trovata. Le transizioni uscenti da $m$ conservano il bordo del pattern.

</details>

**4.** Perché il tempo di ricerca è $\Theta(n)$ e non solo $\mathcal{O}(n)$?

<details>
<summary>Soluzione</summary>

Perché l'algoritmo legge sempre tutti gli $n$ simboli del testo, facendo esattamente una transizione per simbolo. Non esistono casi fortunati che lo fanno terminare prima.

</details>

**5.** Enuncia il Teorema Principale e spiega perché il "se e solo se" è importante.

<details>
<summary>Soluzione</summary>

$j_i$ è lo stato raggiunto dopo aver letto $T[i]$ se e solo se è la lunghezza del più lungo prefisso di $P$ uguale a una sottostringa di $T$ che finisce in posizione $i$. Una direzione garantisce che lo stato $m$ indichi una vera occorrenza, l'altra che nessuna occorrenza venga persa: l'algoritmo è quindi corretto e completo.

</details>

## Glossario

- **$ASF_P$** - Automa a stati finiti costruito a partire dal pattern $P$.
- **Pre-processing del pattern** - Costruzione di $ASF_P$, in tempo $\Theta(m \lvert \Sigma \rvert)$.
- **$j_i$** - Stato dell'automa dopo la lettura di $T[i]$, con $j_0 = 0$.
- **Teorema Principale** - $j_i$ è la lunghezza del più lungo prefisso di $P$ che finisce in posizione $i$ del testo.
- **Occorrenza** - Viene identificata dalla posizione iniziale $i - m + 1$, con $i$ posizione in cui l'automa raggiunge lo stato $m$.
