---
title: AI Ethics & Legal QA
description: Teoria - Come trasformare l'etica dell'IA e i requisiti legali (AI Act) in metriche di test rigorose (NFRs).
sidebar:
  order: 15
---

## Il problema: L'Etica diventa Ingegneria

Quando testiamo il software tradizionale, cerchiamo "bug" nel codice. Ma i sistemi di Intelligenza Artificiale non falliscono solo per errori di sintassi. Falliscono a causa di dati di addestramento distorti (*biased*), scelte di ottimizzazione insicure, mancanza di robustezza e decisioni opache (black-box). 
Questi fallimenti non generano semplici crash di sistema, ma producono discriminazione, rischi per la sicurezza fisica, violazioni dei diritti fondamentali e cause legali.

Di conseguenza, **i requisiti etici e legali diventano a tutti gli effetti Requisiti di Qualità del Software (QA)**. Il compito dell'Ingegnere del Software non è fare filosofia, ma tradurre concetti astratti (come "Giustizia" o "Trasparenza") in **Requisiti Non Funzionali (NFR)** misurabili e testabili.

## I 5 Pilastri della Qualità dell'IA

La qualità di un modello AI si valuta su cinque dimensioni principali, supportate dall'Articolo 15 dell'AI Act europeo.

### 1. Fairness (Equità e Anti-Discriminazione)
**Definizione:** Il sistema non deve produrre un impatto sproporzionato o discriminatorio su gruppi protetti (es. per etnia, genere, età).
**Come si testa (Le Metriche):**
* **Demographic Parity:** La probabilità di un esito positivo (es. ottenere un prestito) deve essere uguale per tutti i gruppi. `P(accept | group A) ≈ P(accept | group B)`.
* **Equalized Odds:** I tassi di falsi positivi (FPR) e falsi negativi (FNR) devono essere identici tra i gruppi.
* **Predictive Parity:** Il Valore Predittivo Positivo (PPV) deve essere uguale tra i gruppi.

**Il Paradosso (Impossibility Theorem di Chouldechova, 2017):** Se i gruppi di partenza hanno tassi base (*base rates*) diversi nella realtà, è matematicamente IMPOSSIBILE soddisfare tutte e tre queste metriche contemporaneamente. Il QA deve quindi scegliere un solo "oracolo di fairness", fissare una tolleranza numerica e documentare legalmente il compromesso.

### 2. Transparency (Trasparenza ed Explainability)
**Definizione:** Il sistema deve fornire spiegazioni interpretabili per le sue decisioni.
Poiché non esiste un oracolo automatico per capire se una spiegazione è "giusta" (essendo la rete neurale una black-box), il QA deve usare test surrogati:
* **Explainability Budget:** Si impone un limite massimo alla complessità della spiegazione (es. l'algoritmo deve mostrare solo le *Top-3 features* che hanno causato la decisione).
* **Human Comprehension:** Si testa il sistema su utenti reali. Es: "Il >70% degli utenti non esperti interpreta correttamente la spiegazione".
* **Consistency (Coerenza):** A parità di input, il sistema deve generare la stessa spiegazione in modo deterministico.
* *Tecniche usate:* Algoritmi come LIME o SHAP.

### 3. Robustness (Robustezza)
**Definizione:** Il sistema mantiene prestazioni accettabili sotto perturbazioni, attacchi o cambiamenti nei dati (Art. 15 dell'AI Act).
**Come si testa:**
* **Adversarial Robustness:** Il calo di accuratezza deve essere < X% quando il sistema subisce attacchi noti per ingannarlo (es. FGSM, PGD con ε = 0.1).
* **Data Quality:** Tolleranza al degrado se si inietta un Y% di dati "rumorosi" (noisy).
* **Out-of-Distribution Detection:** Il sistema deve accorgersi e segnalare se riceve input che non c'entrano nulla con i dati su cui è stato addestrato.

### 4. Safety (Sicurezza)
**Definizione:** Il sistema non deve causare danni, specialmente nei casi limite o nelle modalità di fallimento. Nel caso di un sistema bancario, significa limitare i tassi di errore:
* Falso Positivo < 5% (es. non negare il prestito a chi lo merita).
* Falso Negativo < 2% (es. non approvare il prestito a chi è a rischio insolvenza).

### 5. Accountability (Responsabilità e Tracciabilità)
**Definizione:** Deve esistere un audit trail completo per poter fare la *Root Cause Analysis* in caso di disastro, come richiesto dal GDPR Art. 22.
**Come si testa:**
* **Logging Completeness:** Ogni singola decisione deve essere registrata con: Input esatto, Output, Versione del Modello, Timestamp, e Punteggio di Confidenza.
* **Traceability:** Capacità ingegneristica di ricostruire e riprodurre deterministicamente qualsiasi decisione passata.

---

## Trappole d'esame

:::caution[Gli errori classici da evitare all'orale]
- **Confondere il "Bug" con il "Bias":** Un sistema AI che discrimina non è necessariamente un software scritto male a livello di codice Java/Python. Spesso l'algoritmo fa *esattamente* quello che gli è stato chiesto, ma ottimizza su dati storici inquinati.
- **Pensare che la Fairness sia risolvibile al 100%:** Se ti chiedono se sia possibile avere un sistema perfettamente equo, devi citare l'Impossibility Theorem di Chouldechova. Non si può avere la perfezione se i dati di base della società sono asimmetrici.
- **Non conoscere l'Articolo 15 dell'AI Act:** Prevede test pre-deployment obbligatori, monitoraggio post-deployment e definisce i requisiti di Accuratezza, Robustezza e Cybersecurity.
:::

## Autotest
1. Perché il test "tradizionale" non basta per garantire che un'IA sia etica e sicura?
2. Spiega con parole tue l'Impossibility Theorem: perché Demographics Parity e Equalized Odds spesso collidono?
3. Non potendo scrivere un assert automatico per capire se un'IA è "trasparente", quali sono i tre metodi surrogati per testare la Transparency?
4. Quali informazioni devono essere obbligatoriamente salvate nei log per garantire l'Accountability e la Root Cause Analysis in caso di incidente?

## Glossario
- **Disparate Impact** - Effetto avverso e sproporzionato che un algoritmo ha su una minoranza o gruppo protetto, anche se le regole non sono esplicitamente scritte per discriminare.
- **AI Act (Art. 15)** - Normativa europea che impone requisiti di robustezza, accuratezza e sicurezza cibernetica per i sistemi AI ad alto rischio.
- **Black-box Model** - Un modello di IA (come le reti neurali profonde) in cui i processi interni che portano a una decisione non sono visibili o comprensibili dall'uomo.
- **LIME/SHAP** - Tecniche e librerie software usate per forzare i modelli black-box a spiegare le proprie decisioni mostrando quali "features" hanno pesato di più.
- **Root Cause Analysis (RCA)** - Processo di indagine volto a scoprire la causa primaria ("radice") di un fallimento o di un errore catastrofico del sistema.