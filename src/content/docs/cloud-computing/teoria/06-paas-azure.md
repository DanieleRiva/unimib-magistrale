---
title: Deep Dive su PaaS e Azure
description: Il cambio di paradigma introdotto da PaaS, web role e worker role, auto scaling, throttling, storage in Azure e vendor lock-in.
sidebar:
  order: 6
---

## PaaS: Ripasso

Una **PaaS** è un ambiente integrato per sviluppare, eseguire e gestire applicazioni cloud, orientato a sviluppo e operations. Offre strumenti di progettazione, middleware, API e servizi chiave (storage, cache, posta), e supporta un insieme di linguaggi.

![](../../../../assets/cloud-computing/paas-elementi.png)

:::tip[In una riga]
**PaaS = piattaforma di sviluppo ed esecuzione + servizi**. I servizi principali riguardano lo sviluppo e l'esecuzione, il ciclo di vita, la gestione del carico e la gestione dei dati.
:::

## Il Cambio di Paradigma

Creare un ambiente di sviluppo tradizionale significa procurarsi i server, installare e configurare sistemi operativi, runtime e database, creare un repository, spostare il codice, poi installare, testare ed eseguire. La difficoltà vera è costruire una **replica fedele dell'ambiente di produzione**.

PaaS cambia il quadro:

- Gli sviluppatori non si occupano di installazione e gestione dei server, ma di sviluppo, versioni e configurazione.
- Sono supportati da **servizi di sviluppo** (build, test, repository) e **servizi di runtime** (sandbox per eseguire e scalare).
- Possono testare picchi di carico lasciando che l'applicazione acquisisca risorse da sola.
- Il ciclo di vita diventa **agile**, con sviluppo e deployment continui. Il deployment è più rapido e sicuro, lo stato del software è più visibile e sviluppatori e tester lavorano sulla stessa applicazione e runtime degli operatori.

L'obiettivo è un flusso di lavoro **ripetibile, affidabile, prevedibile e veloce**.

## Azure: Web Role e Worker Role

**Microsoft Azure** offre un vasto insieme di servizi: applicazioni (web e worker role), gestione dei dati (SQL Azure, Tables, Blobs), messaggistica (Queues, Service Bus), caching, networking, identità. L'ambiente è un PaaS gestito: le applicazioni girano in **sandbox isolate** e lo sviluppatore si occupa della logica, non dei server.

| | Web Role | Worker Role |
| --- | --- | --- |
| **Ruolo** | Tier **frontend** | Tier **backend** |
| **Funzione** | Logica verso l'utente, richieste HTTP(S) | Lavori asincroni o lunghi, slegati dall'interazione diretta |
| **Ambiente** | IIS gestito | VM gestita |
| **Riceve il lavoro da** | Load balancer | Coda o service bus |
| **Esempi** | Sito web, API | Trasformazione dati, calcolo batch, integrazione |
| **Scaling** | Dinamico (CPU, numero di richieste) | Indipendente dai web role |
| **Stato** | **Stateless**, stato esterno | **Stateless**, stato esterno |

![](../../../../assets/cloud-computing/azure-ruoli.png)

Nell'esempio, il load balancer distribuisce il traffico tra due istanze web, che inseriscono lavori in una **coda**. Da lì li prelevano le istanze di backend e il generatore di report. **La coda disaccoppia il backend dal resto**: i due lati possono scalare e guastarsi in modo indipendente.

Entrambi i ruoli girano su VM che **non sono esposte all'utente**. Sistema operativo, rete, patch, scaling, recovery e bilanciamento spettano ad Azure. Quello che installi è il **role package**: codice, configurazione, sicurezza e attività di avvio. Il *fabric controller* lo colloca in una VM.

:::caution[Perché i ruoli devono essere stateless]
La VM può essere riciclata o sostituita dalla piattaforma in qualsiasi momento, per aggiornamenti o scaling. Qualunque cosa salvata localmente può sparire, quindi i dati persistenti vanno nello storage esterno. È lo stesso ragionamento delle [istanze EC2 effimere](../04-amazon-aws/#risorse-effimere-e-persistenti).
:::

:::caution[Slide 11-13 e 14: dove stanno i ruoli?]
Le slide 11-13 collocano i ruoli in *Azure App Service*, la slide 14 in *Azure Cloud Services*. La seconda è quella corretta: web e worker role sono il modello di **Cloud Services**, un servizio più vecchio che Microsoft sta dismettendo. Per l'esame conta il **concetto** di ruolo, cioè la separazione tra frontend e backend stateless.
:::

## Auto Scaling e Throttling

### Auto Scaling Application Block

Il componente regola automaticamente il numero di istanze secondo delle policy.

| Regole | Scopo |
| --- | --- |
| **Constraint rules** | Limiti minimi e massimi al numero di istanze di un ruolo |
| **Reactive rules** | Azioni di scaling in risposta alle metriche (CPU, lunghezza della coda, richieste) |

Meccanismi collegati:

- **Scaling Groups**: più ruoli condividono logica e soglie.
- **Throttling Actions**: limitano temporaneamente il carico quando lo scaling non tiene il passo.
- **Stabilizer**: è il cooldown, che impone un tempo minimo tra azioni, tipicamente **20 minuti**, per evitare oscillazioni.

### Throttling

Il **throttling** limita la velocità con cui clienti o carichi consumano risorse quando il sistema è sotto stress. Mantiene il sistema stabile e previene il sovraccarico. I concetti chiave sono:

- **Rate limit e quote**: numero massimo di operazioni per finestra di tempo.
- **Rifiuto o ritardo**: oltre il limite, le richieste vengono rifiutate (ad esempio **HTTP 429**) o accodate.
- **Graceful degradation**: le funzioni non essenziali vengono rallentate o disabilitate per preservare quelle centrali.
- **Combinazione con l'auto scaling**: il throttling fa da cuscinetto finché non arriva la nuova capacità.
- **Limiti per tenant**: impediscono a un utente di monopolizzare le risorse condivise.

Ad esempio, un web role sovraccarico può ammettere solo 100 utenti alla volta, migliorando le prestazioni ed evitando il crash nelle ore di punta.

## Lo Storage in Azure

| Tipo | Cos'è | Note |
| --- | --- | --- |
| **Blob** | File con metadati | Distribuiti su più server, replicati almeno 3 volte. Un solo livello di cartelle: i **container** |
| **Table** | NoSQL chiave-valore, schema flessibile | Non relazionale. Fino a 255 proprietà e 1 MB per entità. Fortemente consistente |
| **Queue** | Messaggi | Memorizzazione e consegna affidabile |
| **SQL Azure** | SQL Server nel cloud | Nessuna amministrazione, 99,99% di disponibilità, modello familiare |
| **Cosmos DB** | Database multi-modello, senza schema | Chiave-valore, grafo, colonne, documenti. Latenza sotto i 10 ms al 99° percentile |

![](../../../../assets/cloud-computing/azure-blob.png)

La struttura di un blob è **account → container → blob → blocchi o pagine**, con URL del tipo `http://<account>.blob.core.windows.net/<container>/<blobname>`.

Nelle **Table**, ogni entità ha tre proprietà obbligatorie: **PartitionKey** e **RowKey**, le uniche indicizzate, che insieme identificano l'entità e ne definiscono l'ordinamento, e il **Timestamp**. La stessa RowKey può comparire in PartitionKey diverse.

:::caution[Slide 25]
La slide scrive *CosmoDB*: il nome corretto è **Cosmos DB**.
:::

## Valore e Rischi di PaaS

**Valore di business**:

- **Meno costi**: server, storage, rete, manutenzione della piattaforma, personale di supporto.
- **Più velocità e agilità**: arrivo rapido sul mercato senza grandi investimenti, con la possibilità di espandersi quando serve.

**Rischi**: usare strumenti non supportati può essere un problema, e soprattutto c'è il **vendor lock-in**, la difficoltà di lasciare il provider. Si può limitare in tre modi:

1. Usare cloud che offrono framework di programmazione ed esecuzione standard.
2. Sfruttare i tentativi di standardizzare le API, come **Cloud Foundry**.
3. Adottare approcci di sviluppo e deployment **multi-cloud**.

## Autotest

**1.** Che differenza c'è tra web role e worker role?

<details>
<summary>Soluzione</summary>

Il **web role** è il frontend ed espone endpoint HTTP dietro al load balancer. Il **worker role** è il backend ed esegue lavori asincroni, di solito prelevati da una coda.

</details>

**2.** Perché tra web role e worker role si mette una coda?

<details>
<summary>Soluzione</summary>

Per **disaccoppiarli**: i due livelli scalano in modo indipendente, e un picco o un guasto del backend non blocca il frontend.

</details>

**3.** Perché i ruoli devono essere stateless?

<details>
<summary>Soluzione</summary>

Perché la piattaforma può riciclare o sostituire le VM in qualsiasi momento. Lo stato va nello storage esterno.

</details>

**4.** Che differenza c'è tra auto scaling e throttling?

<details>
<summary>Soluzione</summary>

L'**auto scaling** aumenta la capacità. Il **throttling** limita la domanda quando la capacità non basta, facendo da cuscinetto finché non arrivano nuove risorse.

</details>

**5.** Quale codice HTTP indica una richiesta respinta dal throttling?

<details>
<summary>Soluzione</summary>

429.

</details>

**6.** Che cos'è il vendor lock-in e come si può limitare?

<details>
<summary>Soluzione</summary>

È la dipendenza da un provider, che rende costoso cambiarlo. Si limita con framework standard, API standardizzate come Cloud Foundry e approcci multi-cloud.

</details>

**7.** Quali sono le proprietà obbligatorie di un'entità in Azure Table?

<details>
<summary>Soluzione</summary>

PartitionKey, RowKey e Timestamp.

</details>

## Glossario

- **Web Role** - Componente frontend di un'applicazione PaaS.
- **Worker Role** - Componente backend per lavori asincroni.
- **Role package** - Pacchetto con codice, configurazione e attività di avvio di un ruolo.
- **Service Bus** - Messaggistica publish-subscribe di Azure.
- **Constraint rule / Reactive rule** - Regole di limite e di reazione alle metriche.
- **Stabilizer** - Cooldown nell'auto scaling di Azure.
- **Throttling** - Limitazione del consumo di risorse sotto stress.
- **Graceful degradation** - Riduzione controllata delle funzioni non essenziali.
- **Vendor lock-in** - Dipendenza da un provider.
- **Blob** - Oggetto binario di grandi dimensioni.
