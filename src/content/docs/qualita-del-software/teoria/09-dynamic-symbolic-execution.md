---
title: Dynamic Symbolic Execution (DSE)
description: Teoria sul Concolic Testing, limiti dell'esecuzione simbolica pura e risoluzione dinamica.
sidebar:
  order: 16
---

## Il muro dell'Esecuzione Simbolica Pura

L'Esecuzione Simbolica Pura (Symbolic Execution) è una tecnica elegante, ma nel mondo reale si schianta contro due problemi insormontabili:
1. **La matematica non lineare e le Black-Box:** Se il codice invoca una funzione crittografica come uno SHA-256, o fa una query a un database esterno, il motore simbolico non può tradurre queste operazioni in equazioni logiche. L'SMT Solver va nel pallone, restituisce "Unknown" e l'analisi di quel ramo si ferma per sempre.
2. **La Path Explosion:** I cicli `while` dipendenti da variabili di input creano un numero esponenziale o infinito di cammini.

La soluzione definitiva sviluppata dall'ingegneria del software moderna si chiama **Dynamic Symbolic Execution (DSE)**, conosciuta universalmente come **Concolic Testing** (da CONCrete + symbOLIC). 

## Come funziona il Concolic Testing

L'intuizione geniale del Concolic Testing è non abbandonare mai i valori reali. Il programma viene letteralmente eseguito (fatto girare sulla CPU) con dei numeri concreti, ma un motore "ombra" lo segue tracciando parallelamente le equazioni simboliche.

L'algoritmo procede in un loop infinito di scoperte:

1. **Il Seme Iniziale (Concrete Seed):** Si prendono degli input concreti casuali (es. `x = 10, y = 5`). Il programma viene eseguito normalmente.
2. **La Tracciatura (Path Condition):** Mentre il programma gira, ogni volta che incontra un `if`, l'engine registra quale ramo ha preso concretamente e aggiorna la Path Condition Simbolica (es. registra `X > 0 && Y < X`).
3. **La Negazione Strategica:** Finito il giro, l'engine prende l'ultima espressione della Path Condition e la *nega* logicamente. (es. trasforma `Y < X` in `Y >= X`).
4. **La Risoluzione (SMT Solver):** Invia questa Path Condition modificata al risolutore matematico. Il risolutore produce dei nuovi input concreti (es. `x = 10, y = 15`) che garantiscono di percorrere un cammino nuovo, sfociando nel ramo `else` che prima era stato ignorato.
5. **Ripeti:** L'engine riavvia il programma con i nuovi numeri, scoprendo progressivamente tutto l'albero.

## Il superpotere della "Concretizzazione"

Il vero vantaggio del Concolic Testing emerge quando il motore si imbatte in un blocco di codice irrisolvibile (es. un hash crittografico o un limite di sistema).
Se l'engine simbolico vede un'espressione matematica troppo complessa per l'SMT Solver, applica la **Semplificazione Dinamica (Concretization)**: legge il valore numerico reale che quella variabile ha assunto in quell'esatto istante (es. `42`), e sostituisce quel numero fisso all'interno della formula simbolica. 

Questo trasforma un'equazione impossibile in una banale costante. Ovviamente si perde un po' di "completezza" matematica (perché si forza un numero fisso al posto di un simbolo), ma il motore può continuare a esplorare il resto del programma senza schiantarsi.

## Autotest

1. Quali sono i due grandi limiti della Symbolic Execution pura che il Concolic Testing risolve?
2. Cosa significa letteralmente la parola "Concolic"?
3. Qual è l'operazione logica che il motore esegue sulla Path Condition per scoprire nuovi casi di test?
4. Come si comporta il DSE (Dynamic Symbolic Execution) quando incontra una chiamata di rete a un'API esterna?

## Glossario

- **DSE (Dynamic Symbolic Execution)** - Tecnica ibrida in cui il codice viene eseguito sia con valori concreti (per l'esecuzione reale) sia con valori simbolici (per il tracciamento dei vincoli).
- **Concolic Testing** - Sinonimo industriale di DSE. Parola macedonia creata unendo *Concrete* e *Symbolic*.
- **Concretization (Concretizzazione)** - Il meccanismo di emergenza con cui un'espressione simbolica irrisolvibile viene sovrascritta forzatamente con il suo valore numerico concreto campionato a runtime.
- **Trace (Traccia di esecuzione)** - La sequenza lineare di istruzioni attraversata durante una specifica esecuzione concreta.
- **SMT Solver** - Il motore matematico che riceve le Path Condition e genera gli input numerici necessari per esplorare nuovi cammini.