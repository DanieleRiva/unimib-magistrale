---
title: Amazon Auto Scaling
description: Architettura a livelli, load balancing, auto scaling group, CloudWatch, health check, trigger, policy, target tracking e cooldown.
sidebar:
  order: 5
---

## Dal Monolite all'Architettura a Livelli

Nel **deployment monolitico** tradizionale, database, API e logica di business stanno su un unico server. Quando gli utenti crescono, la qualità del servizio peggiora, e l'unica strada è lo **scaling verticale**. Questo introduce un single point of failure e diventa antieconomico, perché il costo dell'hardware cresce in modo non lineare: un SSD da 16 TB costa più del doppio di uno da 8 TB.

Le architetture moderne separano i componenti in **livelli**:

![](../../../../assets/cloud-computing/architettura-a-livelli.png)

| | Stateless | Stateful |
| --- | --- | --- |
| **Esempi** | Web server, API | Database, storage persistente |
| **Come scala** | **Orizzontalmente**, replicando le istanze | Richiede gestione specializzata per consistenza e durabilità |
| **Vincolo tipico** | CPU | I/O e storage |

:::tip[Da ricordare]
Stateless e stateful vanno **progettati, installati e scalati in modo indipendente**.
:::

## Load Balancing

In un sistema scalato orizzontalmente, il **load balancer** è il **punto di ingresso unico** per le richieste, che distribuisce tra le istanze. Ottimizza l'uso delle risorse, riduce il tempo di risposta e garantisce alta disponibilità.

| Algoritmo | Come sceglie |
| --- | --- |
| **Round Robin (RR)** | Inoltra ogni richiesta al nodo successivo, in sequenza |
| **Least Used (LU)** | Sceglie il nodo con il carico minore |

I load balancer moderni fanno anche **health check** e collaborano con gli altri servizi per adattare il numero di istanze attive. Abilitano quindi elasticità e resilienza.

## Auto Scaling Group

Un'applicazione bilanciata mostra agli utenti un'unica interfaccia, ma dietro ha molte VM identiche. Gestirle a mano è scomodo. La soluzione è l'**Auto Scaling group**:

:::tip[Definizione]
Un **Auto Scaling group** è una collezione di istanze EC2 con le **stesse caratteristiche**, trattate come un unico gruppo logico per scaling e gestione. Ha un numero **minimo e massimo** di istanze.
:::

Il gruppo può scalare il numero di istanze (**horizontal scaling**) oppure mantenerlo fisso per recuperare dai guasti (**fleet management**). Le istanze devono stare nella **stessa region**, ma possono appartenere a una o più **AZ**.

### Launch Configuration

Ogni gruppo è associato a una **launch configuration**, che descrive le istanze con i parametri necessari a crearle. Ce n'è una sola alla volta. Se la cambi, solo le **nuove** istanze la usano, mentre le esistenti non vengono toccate. In fase di scale-in, Auto Scaling termina per prime le istanze con la configurazione più vecchia.

:::note[Complemento]
AWS ha sostituito le launch configuration con i **launch template**, che svolgono lo stesso ruolo con più funzioni. All'esame vale il termine delle slide, ma se leggi la documentazione attuale troverai quest'ultimo.
:::

## Il Servizio Auto Scaling

**Auto Scaling** è un web service che avvia o termina automaticamente istanze in base a tre fonti:

1. **Policy** definite dall'utente, ad esempio "aggiungi un'istanza se la CPU media supera l'80% per dieci minuti".
2. **Pianificazioni**, ad esempio "dimezza le istanze nel fine settimana".
3. **Health check**.

Garantisce che il numero di istanze **cresca** nei picchi, **cali** nei periodi di calma e **resti lo stesso** in caso di guasti.

### I Tre Servizi Coinvolti

| Servizio | Ruolo |
| --- | --- |
| **CloudWatch (CW)** | Monitora le istanze (carico CPU, I/O disco, I/O rete) |
| **Elastic Load Balancer (ELB)** | Distribuisce il traffico, anche su più AZ. Fa health check periodici e smette di inviare traffico alle istanze malate |
| **Auto Scaling** | Usa i dati di CloudWatch per aggiungere o togliere istanze, attuando una policy |

### Il Ciclo di Auto Scaling

![](../../../../assets/cloud-computing/auto-scaling-loop.png)

1. ELB e le istanze inviano le **metriche** a CloudWatch.
2. Una metrica supera la soglia e scatta l'**allarme**.
3. L'allarme attiva una **policy** che decide di scalare.
4. Viene **lanciata** una nuova istanza dalla AMI.
5. ELB esegue l'**health check** sulla nuova istanza.
6. Se è sana, l'istanza entra nel gruppo e **riceve traffico**.

## Health Check

Un **health check** è un test periodico sullo stato di ogni istanza, che chiama un endpoint predefinito o usa una sonda di monitoraggio. Se un'istanza non risponde correttamente, Auto Scaling la **termina e la sostituisce**. Il gruppo risulta coerente, disponibile e **self-healing**, senza intervento manuale.

## Trigger, Allarmi e Policy

Un **trigger** definisce la condizione in cui si esegue un'azione di scaling, e combina due elementi:

**CloudWatch Alarm**: osserva **una singola metrica** per valutare il superamento di una soglia. Per crearlo si specificano la metrica, la soglia e il numero di periodi di valutazione. Ha tre stati:

| Stato | Significato |
| --- | --- |
| **OK** | La metrica è entro la soglia |
| **ALARM** | La metrica è fuori dalla soglia |
| **INSUFFICIENT_DATA** | La metrica non è disponibile o i dati non bastano |

L'azione parte quando l'allarme **cambia stato e ci resta** per più periodi.

**Auto Scaling Policy**: specifica l'azione correttiva, cioè come e di quanto cambiare la capacità.

| Tipo di policy | Funzionamento |
| --- | --- |
| **Simple scaling** | Una regola e un aggiustamento fisso |
| **Step scaling** | Più soglie, con azioni proporzionali all'entità dello sforamento |
| **Target tracking** | Retroazione continua attorno a un valore obiettivo |
| **Scheduled scaling** | Capacità modificata in base al tempo |

## Gli Scenari

**Fleet management**: mantiene la flotta in salute. Monitora le istanze, sostituisce quelle malate e bilancia il traffico tra le AZ.

**Scheduled scaling**: per carichi prevedibili. Si specificano data e ora, e capacità minima, massima e desiderata.

**Dynamic scaling**: per picchi imprevedibili. Si creano policy per salire e scendere, più un cooldown. Le istanze spot possono essere una buona idea. I due approcci sono **step scaling** e **target tracking**.

### Target Tracking

Si specifica il valore desiderato di una metrica, ad esempio **CPU media al 50%**, e AWS adatta il numero di istanze per restarci vicino:

- Se la CPU sale sopra il 50%, aggiunge istanze per ridurre il carico.
- Se scende, ne termina per ridurre i costi.

A differenza dello scaling a soglie, **non servono allarmi separati** per salire e scendere: il ciclo di retroazione è gestito internamente da AWS.

![](../../../../assets/cloud-computing/target-tracking.png)

Nel grafico il traffico aumenta, la CPU sale sopra il target, le istanze passano da 10 a 15 e la CPU torna al 50%.

## Cooldown

Il **cooldown** è un intervallo configurabile dopo un'azione di scaling, in cui Auto Scaling sospende nuove azioni. Dà tempo al sistema di stabilizzarsi e alle metriche di riflettere l'effetto della modifica.

Senza cooldown, le azioni si susseguirebbero prima di raggiungere l'equilibrio, causando **oscillazioni** (*thrashing*) e consumo inutile di risorse.

:::note[Perché serve davvero]
Una VM impiega minuti a partire. Se la CPU resta alta nel frattempo, senza cooldown il sistema ne avvierebbe altre, poi troppe, quindi le terminerebbe e ripartirebbe da capo.
:::

## Distribuzione tra le Zone

Auto Scaling cerca di distribuire le istanze **uniformemente tra le AZ** abilitate, lanciando le nuove nella zona con meno istanze. Se fallisce, prova nelle altre. Se il gruppo si sbilancia, possono avvenire attività di **ribilanciamento**.

## Autotest

**1.** Perché lo scaling verticale di un monolite non basta?

<details>
<summary>Soluzione</summary>

Introduce un single point of failure e i costi crescono più che linearmente rispetto alle prestazioni.

</details>

**2.** Quali sono i tre servizi coinvolti in Auto Scaling, e cosa fa ciascuno?

<details>
<summary>Soluzione</summary>

**CloudWatch** monitora, **ELB** distribuisce il traffico e fa health check, **Auto Scaling** aggiunge o rimuove istanze attuando le policy.

</details>

**3.** Quali sono gli stati di un CloudWatch Alarm?

<details>
<summary>Soluzione</summary>

OK, ALARM e INSUFFICIENT_DATA.

</details>

**4.** Che cosa succede quando un'istanza fallisce un health check?

<details>
<summary>Soluzione</summary>

Auto Scaling la termina e ne lancia una sostitutiva. Intanto ELB smette di mandarle traffico.

</details>

**5.** Che differenza c'è tra step scaling e target tracking?

<details>
<summary>Soluzione</summary>

Lo **step scaling** ha più soglie e azioni definite dall'utente, proporzionali allo sforamento. Il **target tracking** richiede solo un valore obiettivo, e il ciclo di retroazione è gestito da AWS.

</details>

**6.** A cosa serve il cooldown?

<details>
<summary>Soluzione</summary>

Evita oscillazioni, sospendendo le azioni finché le metriche non riflettono l'effetto della modifica precedente.

</details>

**7.** Le istanze di un Auto Scaling group possono stare in region diverse?

<details>
<summary>Soluzione</summary>

No: devono stare nella stessa region, anche se in AZ diverse.

</details>

**8.** Quali strategie useresti per un negozio online con picco ogni venerdì sera, e per un sito soggetto a notizie virali?

<details>
<summary>Soluzione</summary>

Per il picco prevedibile, **scheduled scaling**. Per quelli imprevedibili, **dynamic scaling** con target tracking o step scaling, più un cooldown.

</details>

## Glossario

- **Stateless / Stateful** - Componente senza o con stato da preservare.
- **Load balancer** - Punto di ingresso che distribuisce le richieste tra le istanze.
- **Auto Scaling group** - Insieme di istanze identiche gestite come un'unità.
- **Launch configuration** - Descrizione delle istanze di un gruppo.
- **CloudWatch** - Servizio di monitoraggio di AWS.
- **Health check** - Test periodico dello stato di un'istanza.
- **Trigger** - Allarme più policy di scaling.
- **Target tracking** - Scaling che mantiene una metrica vicino a un valore obiettivo.
- **Cooldown** - Pausa dopo un'azione di scaling.
- **Thrashing** - Oscillazione continua tra scale-out e scale-in.
- **Fleet management** - Mantenimento in salute della flotta di istanze.
