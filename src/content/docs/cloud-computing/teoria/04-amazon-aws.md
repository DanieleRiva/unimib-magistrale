---
title: Deep Dive su Amazon AWS
description: Concetti chiave di AWS, EC2, S3, EBS, security group, risorse effimere e persistenti, modelli di prezzo.
sidebar:
  order: 4
---

## Che Cos'è AWS

**Amazon Web Services** è un insieme di **servizi-mattone**, progettati per funzionare indipendentemente ma anche insieme. Condividono convenzione sui nomi e autenticazione, e riducono al minimo connessioni e dipendenze interne. Ogni attività, come avviare un server o allocare un IP, si fa con una **chiamata a un web service**.

I tre concetti di base:

| Servizio | Ruolo | Idea |
| --- | --- | --- |
| **EC2** | Calcolo | Esegue il software |
| **S3** | Object storage | Conserva oggetti accessibili via API |
| **EBS** | Block storage | Fornisce un disco alla VM |

L'organizzazione geografica è quella già vista: [region e availability zone](../01-introduzione-al-cloud/#region-e-availability-zone).

## Lo Storage: S3 ed EBS

### S3 - Simple Storage Service

**S3** è una soluzione di **object storage** con interfaccia web. Un *object store* gestisce i dati come **oggetti**, non come file in un filesystem o blocchi. Ogni oggetto ha tre parti:

1. **Dati**: il contenuto vero e proprio.
2. **Metadati**: nome, data di creazione e altre informazioni descrittive.
3. **Identificatore unico**: una chiave che permette di recuperare l'oggetto senza conoscerne la posizione.

Lo spazio di indirizzamento è **piatto**, senza directory gerarchiche: ogni oggetto sta allo stesso livello.

Oggetti fino a **5 TB**, distribuiti in almeno **tre AZ** e replicati automaticamente. SLA del 99,99% di uptime mensile. Si usa per backup, archiviazione e disaster recovery.

### EBS - Elastic Block Store

Un **volume EBS** è un disco indirizzabile che si collega a una istanza in esecuzione **nella stessa Availability Zone**. Può essere formattato, montato e usato come un disco locale, su HDD o SSD. Il suo ciclo di vita è **indipendente** dalle istanze: può esistere anche senza VM in esecuzione.

Un *block store* divide i dati in blocchi di dimensione fissa, ciascuno con un indirizzo. Il sistema operativo legge e scrive i singoli blocchi, e un filesystem li organizza in file.

| | S3 (object) | EBS (block) | Dischi locali EC2 |
| --- | --- | --- | --- |
| **Accesso** | API web | Come un disco | Come un disco |
| **Persistenza** | Persistente | Persistente | **Effimera** |
| **Portata** | Tra AZ | Una sola AZ | L'istanza |
| **Uso tipico** | Backup, file, dati | Database, sistema operativo | Dati temporanei |

## Security Group

Un **Security Group** è un **firewall virtuale** per le istanze EC2. Definisce le connessioni di rete ammesse in ingresso e in uscita, con regole basate su protocollo, porta e intervallo di indirizzi IP.

Un gruppo si può applicare a più istanze, e un'istanza può avere più gruppi. Ad esempio, una regola che ammette TCP sulla porta 443 da qualsiasi IP abilita HTTPS.

:::tip[Da ricordare]
I security group sono **stateful**: il traffico di risposta a una connessione ammessa è permesso automaticamente, senza bisogno di una regola apposita.
:::

## Altri Servizi

| Servizio | Cosa offre |
| --- | --- |
| **SQS** | Code di messaggi gestite, per comunicazione asincrona tra componenti |
| **RDS** | Database relazionali gestiti (MySQL, PostgreSQL) |
| **DynamoDB** | Database NoSQL gestito, chiave-valore e documenti |
| **ElastiCache** | Cache in memoria gestita |
| **EMR** | Elaborazione distribuita di dati (Apache Spark) |
| **ELB** | Distribuisce il traffico in ingresso tra più target |
| **Lambda** | Esegue codice in risposta a eventi, senza gestire server: è il [serverless](../07-serverless/) |

## EC2 - Elastic Compute Cloud

EC2 realizza la metafora del **data center programmabile**, che in seguito verrà chiamata **Infrastructure as Code (IaC)**. Server, immagini, firewall, load balancer, IP e dischi sono disponibili in pochi secondi con una richiesta web.

### Immagine e Istanza

| Concetto | Significato |
| --- | --- |
| **AMI** (*Amazon Machine Image*) | Modello con il sistema operativo ed eventuale software aggiuntivo. Si può personalizzare, condividere e vendere. Ha un ID unico |
| **Istanza** | Una copia **in esecuzione** di una AMI. Si possono lanciare quante copie si vuole |
| **Elastic IP** | Indirizzo IP statico assegnabile a un'istanza. Se questa si guasta, viene riassegnato a un'altra |

:::tip[Analogia con Docker]
AMI sta a istanza come **immagine** Docker sta a **container**: un modello di sola lettura e le sue copie in esecuzione. Il parallelo aiuta a ricordare [il laboratorio](../../laboratorio/01-docker-introduzione/#immagini-e-container).
:::

Quando lanci un'istanza devi specificare il **tipo**: numero di vCPU, modello del processore (Intel Xeon, AMD EPYC, AWS Graviton), frequenza, core fisici e thread.

### Risorse Effimere e Persistenti

Una distinzione d'esame: **le risorse effimere esistono solo finché l'istanza è in esecuzione**.

**Le istanze EC2 sono effimere**: in caso di guasto, dati e stato di solito si perdono. Per la produzione servono ridondanza su più AZ, failover automatico e backup. Sono adatte ad applicazioni **stateless**.

Il **disco locale** è effimero: i dati sopravvivono a un riavvio ma si perdono quando l'istanza viene terminata. Per conservarli si usa EBS, S3 o EFS (filesystem condiviso).

Le **risorse persistenti** restano operative nonostante i guasti, grazie a ridondanza, failover e recovery automatici:

- Elastic IP
- Volumi EBS
- Elastic Load Balancer
- Security Group
- AMI salvate su S3 o come snapshot EBS

## I Modelli di Prezzo

Il costo totale è **uso del calcolo + risorse collegate + trasferimento dati**. Non esiste un unico prezzo: dipende da tipo e dimensione dell'istanza, sistema operativo, region, modalità d'acquisto e costi aggiuntivi (EBS, IPv4 pubblico, monitoring).

| Opzione | Come funziona | Adatta a |
| --- | --- | --- |
| **On-Demand** | Paghi ciò che usi, senza impegni | Sviluppo, carichi variabili o incerti |
| **Savings Plans** | Ti impegni per 1 o 3 anni su un consumo costante, in cambio di tariffe più basse | Consumo di base prevedibile, con flessibilità |
| **Reserved Instances** | Impegno di 1 o 3 anni su una configurazione definita | Configurazioni stabili |
| **Spot** | Capacità inutilizzata a sconto variabile, **AWS può interromperla** | Batch tolleranti ai guasti e riprendibili |

| Carico | Punto di partenza | Compromesso |
| --- | --- | --- |
| Nuovo o incerto | On-Demand | Prezzo unitario più alto |
| Base stabile | Savings Plans, confronta con RI | L'impegno può durare più della domanda |
| Batch flessibile | Spot | La capacità può sparire |
| Capacità garantita | Capacity Reservation | È distinta dallo sconto |

:::tip[Regola pratica]
Serve flessibilità: **On-Demand**. Carico costante: **Savings Plans o Reserved**. Carico interrompibile: **Spot**.
:::

:::caution[Sconto e capacità sono cose diverse]
Le opzioni d'acquisto riguardano il **prezzo**. La **Capacity Reservation** garantisce invece che la capacità esista in una data AZ. Risolvono problemi differenti e si possono combinare.
:::

Per i prezzi attuali vanno usati il listino ufficiale e il *Pricing Calculator*: definisci il carico, aggiungi le risorse collegate e confronta gli scenari.

## Autotest

**1.** Che differenza c'è tra S3 ed EBS?

<details>
<summary>Soluzione</summary>

S3 è un **object store** accessibile via API, con spazio piatto e replica su più AZ. EBS è un **block store** che si comporta come un disco, collegato a un'istanza nella stessa AZ.

</details>

**2.** Un'istanza viene terminata. Quali dati si perdono?

<details>
<summary>Soluzione</summary>

Quelli sul disco locale effimero. Sopravvivono i dati su EBS e S3. Con un semplice riavvio il disco locale resta integro.

</details>

**3.** Che cosa significa che i Security Group sono stateful?

<details>
<summary>Soluzione</summary>

Che il traffico di risposta a una connessione ammessa è consentito automaticamente, senza una regola dedicata.

</details>

**4.** Elenca le risorse EC2 persistenti.

<details>
<summary>Soluzione</summary>

Elastic IP, volumi EBS, Elastic Load Balancer, Security Group e AMI su S3 o snapshot EBS.

</details>

**5.** Quale opzione di prezzo sceglieresti per un job di elaborazione notturno che può riprendere se interrotto?

<details>
<summary>Soluzione</summary>

**Spot**, perché è il più economico e il job tollera le interruzioni.

</details>

**6.** Che differenza c'è tra AMI e istanza?

<details>
<summary>Soluzione</summary>

La AMI è il modello, con sistema operativo e software. L'istanza è una sua copia in esecuzione.

</details>

**7.** Perché le istanze EC2 si prestano ad applicazioni stateless?

<details>
<summary>Soluzione</summary>

Perché sono effimere: se un'istanza sparisce, un'applicazione senza stato locale viene semplicemente sostituita da un'altra istanza.

</details>

## Glossario

- **EC2** - Servizio di calcolo di AWS.
- **S3** - Object storage di AWS.
- **EBS** - Block storage di AWS, collegabile alle istanze.
- **AMI** - Immagine da cui si lanciano le istanze.
- **Istanza** - Copia in esecuzione di una AMI.
- **Security Group** - Firewall virtuale e stateful di un'istanza.
- **Elastic IP** - Indirizzo IP statico riassegnabile.
- **Risorsa effimera** - Risorsa che esiste solo finché l'istanza è attiva.
- **Spot Instance** - Capacità inutilizzata, scontata e interrompibile.
- **Infrastructure as Code (IaC)** - Definizione dell'infrastruttura tramite codice e API.
