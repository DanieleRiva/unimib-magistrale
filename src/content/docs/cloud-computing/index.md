---
title: Cloud Computing
description: Appunti e materiale del corso di Cloud Computing - Magistrale UNIMIB.
---

Appunti del corso di **Cloud Computing** della magistrale in Informatica all'UNIMIB, A.A. 2026/2027. Docenti: **Flavio De Paoli** e **Michele Ciavotta**, coordinamento del laboratorio: **Federica Filippini**.

:::tip
Naviga le lezioni dalla **sidebar**. La [preparazione all'esame](./esami/) spiega come rispondere alle domande aperte su Dockerfile e Compose.
:::

## Contenuti del Corso

Il corso studia modelli e tecnologie per progettare, sviluppare e gestire applicazioni nel cloud, dall'infrastruttura ai microservizi. Si articola su tre aspetti: **concetti** per capire problemi e soluzioni, **modelli** per descrivere il comportamento dei sistemi, **pratica** per realizzare le soluzioni. Il laboratorio ha 36 ore.

| Argomento | Stato negli appunti |
| --- | --- |
| Modelli cloud, virtualizzazione, XaaS, proprietà | [Teoria 1-7](./teoria/01-introduzione-al-cloud/) |
| Container e Docker | [Laboratorio 1-5](./laboratorio/01-docker-introduzione/) |
| Resource management e Kubernetes | [Laboratorio 6](./laboratorio/06-kubernetes/), prima lezione |
| Microservizi, DevOps, Web of Things | **Slide non ancora disponibili** |

| Appunti | Fonte | Argomento |
| --- | --- | --- |
| [Introduzione](./teoria/01-introduzione-al-cloud/) | Cloud 1 | NIST, IaaS, PaaS, SaaS, deployment |
| [Proprietà](./teoria/02-proprieta-e-caratteristiche/) | Cloud 2 | Utility computing, SLA, elasticità, fault tolerance |
| [Virtualizzazione](./teoria/03-virtualizzazione/) | Cloud 3 | Hypervisor, CPU, memoria, I/O, tecniche |
| [Amazon AWS](./teoria/04-amazon-aws/) | Cloud 4 | EC2, S3, EBS, prezzi |
| [Auto Scaling](./teoria/05-auto-scaling/) | Cloud 5 | Load balancing, policy, cooldown |
| [PaaS e Azure](./teoria/06-paas-azure/) | Cloud 6 | Ruoli, throttling, storage, lock-in |
| [Serverless](./teoria/07-serverless/) | Paper | FaaS, cold start, casi d'uso |
| [Docker: Introduzione](./laboratorio/01-docker-introduzione/) | Lab 1 | Container, layer, comandi |
| [Docker: Risorse e Storage](./laboratorio/02-docker-risorse-e-storage/) | Lab 2 | Limiti, volumi |
| [Docker: Dockerfile e Build](./laboratorio/03-dockerfile-e-build/) | Lab 3 | Istruzioni, multi-stage |
| [Docker: Networking](./laboratorio/04-docker-networking/) | Lab 4 | CNM, driver, DNS |
| [Docker: Compose](./laboratorio/05-docker-compose/) | Lab 5-6 | Multi-servizio |
| [Kubernetes](./laboratorio/06-kubernetes/) | Lab Kubernetes 1 | Architettura, Pod, Service |

## Modalità d'Esame

Lo **scritto** contiene domande aperte e a risposta multipla, su **lezioni e laboratorio**, per un massimo di **28 punti** (si passa con 18):

| Parte | Domande | Punti |
| --- | --- | --- |
| Risposta multipla | 10 da 2 punti | 20 |
| Aperte | 2 da 4 punti | 8 |

**Punti aggiuntivi**:

- Fino a **2 punti di laboratorio**, per chi lo frequenta in presenza: 1 per la frequenza (almeno 75%) e 1 per la partecipazione attiva.
- Fino a **3 punti** con un **progetto finale** facoltativo concordato con il docente. Si possono usare strumenti di IA, ma i punti vengono assegnati dopo una discussione in presenza del codice: chi non sa spiegarlo può perderne.

**Voto finale = scritto + laboratorio (se frequentato) + progetto (facoltativo) + eventuale integrazione orale.**

Se il voto non soddisfa, si può chiedere un **orale su tutto il programma**, laboratorio incluso, ma il voto dell'orale **sostituisce** quello dello scritto, non si somma.

### Prove in Itinere

Lo scritto del primo appello si può fare con **due prove parziali**, ciascuna con domande aperte e a risposta multipla, da **33 punti**:

- Per accedere alla seconda serve almeno **15** nella prima.
- Il voto dello scritto è la **media** delle due.
- **Non ci sono prove di recupero.**

:::caution[Punti da chiarire]
Le fonti non dicono se i punti di laboratorio e progetto si sommano anche ai parziali da 33, dato che 28 + 2 + 3 fa già 33. Non dicono neppure quali argomenti rientrano nel primo parziale: il laboratorio Docker e Kubernetes arriva fino a novembre. Conviene chiedere.
:::

### Date

| Appello | Data |
| --- | --- |
| **Prima prova parziale** | **16/11/2026** |
| **Seconda prova parziale** | **13/01/2027** |
| Appello 2 (scritto completo) | 28/01/2027 |
| Appello 3 (scritto completo) | 17/02/2027 |
| Appelli 4, 5, 6 | Da definire |

## Come Sono Organizzati gli Appunti

Ogni pagina segue le slide e si chiude con un **Autotest** con soluzioni e un **Glossario**.

- I riquadri **Complemento** contengono materiale non presente nelle slide.
- I riquadri di attenzione intitolati **Slide N** segnalano errori e imprecisioni.

## Materiale Non Incluso

- **Quiz di autovalutazione** su e-learning (Virtualization, Cloud Computing, IaaS, PaaS, Serverless): non sono nel materiale fornito, ma sono **da fare**, perché sono l'allenamento più vicino alle domande a risposta multipla.
- **Video** della lezione sulla virtualizzazione e **seminario KPMG** con le sue slide.
- **Link di approfondimento** del laboratorio: Docker networking, Swarm, Kubernetes 101.

## Correzioni Rispetto alle Slide

| Dove | Cosa dice la slide | Correzione |
| --- | --- | --- |
| Cloud 1, slide 7 | "Centinaia di migliaia" e "50.000-80.000" server | I due dati non coincidono: vale il secondo |
| Cloud 3, slide 24 | KVM tra gli hypervisor hosted | Classificazione discussa: KVM è un modulo del kernel |
| Cloud 3, slide 26 | *Full emulation* dell'hardware | Non è l'emulazione di un'altra ISA |
| Cloud 5, slide 7 | Launch configuration | Attuale, ma AWS oggi usa i launch template |
| Cloud 6, slide 11-14 | Ruoli in App Service e in Cloud Services | Sono un modello di Cloud Services |
| Cloud 6, slide 25 | CosmoDB | Cosmos DB |
| Lab 3, slide 26 | `CMD ["--port 27017"]`, `ENTRYPOINT usr/bin/mongod` | Argomenti da separare, forma exec con percorso assoluto |
| Lab 3, slide 26 | ENTRYPOINT o CMD, "non entrambi" | Si possono sovrascrivere entrambi |
| Lab Kubernetes, slide 15 | Tre modi di gestione, ne elenca due | Manca la configurazione imperativa |
