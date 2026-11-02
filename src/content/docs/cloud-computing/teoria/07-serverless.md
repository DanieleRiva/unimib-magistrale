---
title: Serverless Computing
description: Definizione di serverless e FaaS, confronto con gli altri modelli, architettura, cold start, casi d'uso, sfide e limiti, dal paper The Rise of Serverless Computing.
sidebar:
  order: 7
---

:::note[Fonte]
Questa pagina riassume l'articolo *The Rise of Serverless Computing* (Castro, Ishakian, Muthusamy, Slominski, Communications of the ACM, dicembre 2019), indicato come materiale di studio del Topic 01. Alcuni numeri di mercato risalgono a quell'anno.
:::

## Il Problema da Risolvere

Il cloud ha reso popolare il pay-as-you-go e l'elasticità, ma **il peso di scalare è rimasto agli sviluppatori**, che spesso sovradimensionano per reggere i picchi. Risultato: un grande divario tra le risorse pagate (VM affittate) e quelle usate.

Il serverless nasce per realizzare la promessa originale del cloud come **utility**: pagare solo ciò che si usa, senza gestire nulla.

## Definizione

:::tip[Definizione]
Il **serverless computing** è una piattaforma che **nasconde l'uso dei server** agli sviluppatori ed esegue il codice **on demand**, scalandolo automaticamente e **fatturando solo il tempo di esecuzione**.
:::

Il nome non significa che i server non esistano, ma che **non devi pensarci**: la gestione di provisioning, monitoraggio, manutenzione, scalabilità e tolleranza ai guasti passa al provider.

Due caratteristiche chiave:

- **Costo**: si paga solo ciò che gira. Non si pagano server inattivi né l'overhead di creazione e distruzione. La fatturazione è a granularità fine, nell'ordine delle centinaia di millisecondi. È il **"scaling to zero"**.
- **Elasticità**: da zero a "infinito". Lo sviluppatore non scrive policy di autoscaling: è il provider ad avviare più esecuzioni parallele quando la domanda cresce.

### Function as a Service

:::tip[Definizione]
La **FaaS** è una piattaforma serverless dove l'unità di calcolo è una **funzione**, eseguita in risposta a **trigger** come eventi o richieste HTTP.
:::

Il modo più naturale di usare il serverless è fornire un pezzo di codice da eseguire. Le funzioni girano per **tempo limitato** (al massimo minuti) e **non mantengono stato persistente**, perché possono essere riavviate in qualsiasi momento. Questi due vincoli rendono facile al provider mantenerle e scalarle. Se serve uno stato, si usano servizi esterni.

Serverless e FaaS sono spesso usati come sinonimi, ma il primo è più ampio: FaaS ne è la forma più diffusa.

Un'altra definizione citata nell'articolo è quella di Paul Johnston, secondo cui una soluzione è serverless se **non costa nulla quando nessuno la usa**, esclusi i dati salvati.

## Confronto con gli Altri Modelli

Serverless può essere visto come un'**evoluzione di PaaS**: toglie all'utente il controllo sull'hosting, in cambio di scaling più semplice e fatturazione più attraente.

| | IaaS | PaaS (1ª gen.) | FaaS | BaaS/SaaS |
| --- | --- | --- | --- | --- |
| **Competenze richieste** | Alte | Medie | Basse | Basse |
| **Controllo** | Alto | Medio | Basso | Molto basso |
| **Scaling** | Regole da costruire e tarare | Regole da costruire e tarare | Automatico, fino a zero | Nascosto |
| **Unità di lavoro** | VM, rete, storage | Codice impacchettato, in esecuzione come servizio | Una esecuzione di funzione | Estensioni dell'app |
| **Granularità di fatturazione** | Da minuti ad anni | Da minuti ad anni | Centinaia di ms | Mesi, per utenti |

:::caution[Serverless non è una quota gratuita]
Una quota mensile gratuita è un'altra cosa: viene conteggiata anche se l'applicazione è ferma. Serverless significa che se il codice non gira non paghi nulla.
:::

**BaaS** (*Backend as a Service*), o MBaaS per il mobile, offre funzioni di backend pronte, come le notifiche push. Ha somiglianze con il serverless, ma il codice dell'utente resta legato a quel dominio applicativo.

## Architettura di una FaaS

Il cuore di una FaaS è un **sistema di elaborazione di eventi**:

![](../../../../assets/cloud-computing/faas-architettura.png)

Il flusso di un evento è questo:

1. Un evento arriva da UI, API gateway o sorgenti cloud.
2. La piattaforma lo **valida**: autenticazione, autorizzazione e limiti di risorse.
3. L'evento finisce in coda.
4. Il **dispatcher** lo assegna a un **worker**, che alloca un container, vi copia il codice della funzione e la esegue.
5. La piattaforma raccoglie i log, rende disponibile la risposta e ferma e dealloca le istanze inattive.

Per isolare le funzioni di utenti diversi si usano di solito **container**.

### Cold Start

Creare, avviare e distruggere un container per ogni invocazione è costoso e introduce una latenza: è il **cold start problem**. Si mitiga con:

- **Container warm**: già istanziati, riutilizzati per lo stesso utente.
- **Stem cell containers**: un pool di container già avviati ma non ancora assegnati.
- **Cache** delle librerie più usate sui worker, perché scaricarle allunga l'avvio.

C'è una tensione di fondo: **scalare a zero causa i cold start**.

### Risorse e Modello di Programmazione

L'unica risorsa di solito configurabile è la **memoria**: CPU e altre risorse vengono assegnate in proporzione.

Il modello si basa su due primitive:

| Primitiva | Significato |
| --- | --- |
| **Action** | Funzione **stateless** che esegue codice arbitrario. Invocabile in modo sincrono o asincrono |
| **Trigger** | Classe di eventi da varie sorgenti |

Un evento può attivare più funzioni in parallelo, e il risultato di una funzione può attivarne un'altra in sequenza. Una funzione tipica riceve un dizionario (JSON), un oggetto *context* con l'ambiente di esecuzione, e restituisce un dizionario.

```javascript
function main(params, context) {
    return { payload: 'Hello, ' + params.name + ' from ' + params.place };
}
```

Le funzioni dipendono da un **ecosistema** di servizi del provider, come storage e machine learning. La funzione scala, ma lo storage sottostante deve garantire la propria affidabilità.

## Quando Conviene

Il vantaggio economico è massimo per i **carichi bursty**: l'elasticità è delegata alla piattaforma e, soprattutto, quando il sistema è fermo il costo è zero.

### I Casi d'Uso

| Caso | Esempio | Idea |
| --- | --- | --- |
| **Elaborazione di eventi** | Netflix: il caricamento di un video su S3 attiva funzioni che lo dividono e lo transcodificano in parallelo | Funzioni stateless e **idempotenti**: in caso di errore si rieseguono senza effetti collaterali |
| **Composizione di API** | App mobile che chiama geolocalizzazione, meteo e traduzione | Una funzione fa da aggregatore, riducendo il codice client |
| **Analisi in stile Map-Reduce** | PyWren su AWS Lambda | Carichi altamente paralleli, usando S3 per lo storage |
| **Servizi multi-tenant** | A Cloud Guru: ogni utente in un contesto di sicurezza proprio | Isolamento e scalabilità con poco codice |

:::caution[L'anti-pattern]
Una funzione che chiama un'API dopo l'altra aspettando ogni risposta **paga il tempo di attesa**, stando ferma sull'I/O: è un **anti-pattern serverless**. La soluzione è incapsulare ogni chiamata in una funzione e **concatenarle in sequenza**, una composizione che si comporta come una funzione unica. Strumenti come AWS Step Functions gestiscono le orchestrazioni complesse.
:::

Se un carico non è divisibile in piccole unità, sono meglio sistemi batch. Se tollera qualche riavvio, le [spot instance](../04-amazon-aws/#i-modelli-di-prezzo) sono una buona alternativa.

## Sfide e Limiti

- **Modelli di programmazione e strumenti**: le funzioni sono tante e brevi, quindi debugging e individuazione dei colli di bottiglia sono difficili. Gli strumenti tradizionali che richiedono l'accesso ai server non si applicano. Servono semantiche di recupero (*at-least-once*, *at-most-once*) e supporto a refactoring e rollback.
- **Mancanza di standard e vendor lock-in**: l'area è nuova e in rapido cambiamento. Nel frattempo si usano framework compatibili con più provider.

## Opportunità di Ricerca

- **A livello di sistema**: ridurre i cold start mantenendo lo scaling a zero, e capire se i container siano l'astrazione giusta, o se servano ad esempio gli **unikernel**.
- **Codice legacy**: scomporlo automaticamente in unità più piccole.
- **Serverless stateful**: capire se sia possibile senza perdere scalabilità e tolleranza ai guasti.
- **SLA**: difficili da garantire, perché l'applicazione dipende da servizi esterni alla piattaforma.
- **Serverless all'edge**: gli eventi nascono spesso ai margini della rete, con IoT e dispositivi mobili. Lì il costo può essere definito in modo diverso, ad esempio con l'energia più importante della velocità.

## Autotest

**1.** Definisci serverless computing e indica le due caratteristiche chiave.

<details>
<summary>Soluzione</summary>

È una piattaforma che nasconde i server agli sviluppatori ed esegue il codice on demand, scalato automaticamente e fatturato solo per il tempo di esecuzione. Le caratteristiche sono il **costo** (pay-as-you-go, scaling to zero) e l'**elasticità** automatica.

</details>

**2.** Che differenza c'è fra serverless e FaaS?

<details>
<summary>Soluzione</summary>

Il serverless è il paradigma generale. La FaaS ne è la forma più diffusa, con la funzione come unità di calcolo.

</details>

**3.** Perché le funzioni FaaS sono stateless e di breve durata?

<details>
<summary>Soluzione</summary>

Perché così il provider può allocare i server quando servono, fermarli alla fine e riavviare una funzione in qualsiasi momento: la piattaforma resta facile da scalare.

</details>

**4.** Cos'è il cold start e come si mitiga?

<details>
<summary>Soluzione</summary>

È la latenza dovuta alla creazione di un container per una nuova invocazione. Si mitiga con container warm, pool di stem cell container e cache delle librerie.

</details>

**5.** Perché una funzione che orchestra chiamate sequenziali è un anti-pattern?

<details>
<summary>Soluzione</summary>

Perché si paga il tempo in cui la funzione attende l'I/O. Meglio una funzione per chiamata, concatenate in sequenza.

</details>

**6.** In cosa FaaS differisce dalla PaaS di prima generazione?

<details>
<summary>Soluzione</summary>

Toglie all'utente il controllo sull'hosting. Scala automaticamente fino a zero, fattura al centinaio di millisecondi e non richiede regole di autoscaling.

</details>

**7.** Per quali carichi il serverless è più conveniente?

<details>
<summary>Soluzione</summary>

Per i carichi **bursty** e intermittenti, perché nei periodi fermi il costo è zero. Se la domanda è sostenuta possono convenire VM riservate o cluster.

</details>

## Glossario

- **Serverless** - Modello in cui i server sono nascosti e si paga solo l'esecuzione.
- **FaaS** - Function as a Service, serverless con la funzione come unità di calcolo.
- **BaaS** - Backend as a Service, funzioni di backend pronte all'uso.
- **Scaling to zero** - Nessuna risorsa attiva, e nessun costo, quando non c'è lavoro.
- **Action / Trigger** - Funzione stateless ed evento che la attiva.
- **Cold start** - Latenza di avvio di una funzione senza container pronto.
- **Warm container** - Container già avviato e riutilizzabile.
- **Stem cell container** - Container preavviato non ancora assegnato.
- **Idempotente** - Eseguibile più volte con lo stesso effetto.
- **Bursty** - Carico fatto di picchi brevi e irregolari.
- **Unikernel** - Immagine minima con un'applicazione e il solo sistema necessario.
