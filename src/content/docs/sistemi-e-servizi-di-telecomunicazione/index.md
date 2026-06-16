---
title: Sistemi e Servizi di Telecomunicazione
description: Appunti e materiale del corso di Sistemi e Servizi di Telecomunicazione - Magistrale UNIMIB.
---

Appunti, esercizi e materiale del corso di **Sistemi e Servizi di Telecomunicazione** della magistrale in Informatica all'UNIMIB.

:::tip
Naviga le lezioni dalla **sidebar**.
:::

## Obiettivi del Corso e Topics

Gli argomenti del corso si dividono in due ambiti principali - **Reti** e **Sistemi** - anche se nella maggior parte dei casi i due ambiti sono **strettamente collegati**: per avere una rete è quasi sempre necessario un sistema, e viceversa.

### 🖧 Sistemi

#### Concetti Propedeutici
- Aspetti fondamentali sulla teoria della comunicazione
- Multiplexing e Multiple Access (TDM(A), FDM(A), CDM(A), OFDM(A))
- Mezzi Trasmissivi

#### Architetture Tradizionali
- Architetture di Accesso a Banda Larga
    - **Fixed**: ADSL, VDSL, PON, FTTN, FTTC, FTTH
    - **Fixed Wireless Access (FWA)** & Satellite
    - **Mobile Radio**: 2G/GSM, 3G/UMTS, 4G/LTE, 5G
- Connettività WAN (MPLS) & VPN

#### Nuovi Paradigmi
- Software-Defined Networking (SDN)

### 🌐 Servizi

#### Qualità dei Servizi
- Service Level Agreement (SLA) & Traffic Conditioning Agreement (TCA)
- Modelli per QoS: IntServ & DiffServ

#### Multimedia
- Voice over IP (VoIP)
    - Voice Coding
    - Architettura SIP
- CDN: Content Distribution

## Breve Storia di Internet

:::note
I seguenti appunti **non** sono parte dell'esame, ma potrebbero risultare interessanti da conoscere.
:::

Due date a confronto:

- **20 luglio 1969** → l'uomo sulla Luna.
- **29 ottobre 1969** → data storicamente conosciuta per la **nascita di Internet**.

Guardando le pubblicazioni stampa di quel periodo, troviamo **zero tracce** della nascita di Internet, solamente notizie sull'atterraggio sulla Luna. Ovviamente nessuno si aspettava l'importanza che quell'evento avrebbe avuto.

Esiste però una **correlazione** tra questi due eventi: il **4 ottobre 1957** l'Unione Sovietica lancia in orbita il primo satellite, lo **Sputnik 1**. Questo è rilevante perché gli Stati Uniti non pensavano di essere così indietro rispetto all'Unione Sovietica. Il **12 settembre 1962** il presidente **Kennedy** tiene un discorso in cui annuncia un massiccio finanziamento con l'obiettivo di portare l'uomo sulla Luna entro la fine del decennio.

Questo è fondamentale perché parte del finanziamento finì anche alla **DARPA** (*Defense Advanced Research Project Agency*). Uno dei progetti portati avanti fu **ARPAnet**, che aveva una caratteristica fondamentale rispetto alle reti precedenti: fu la **prima rete a commutazione di pacchetto**.

:::tip[Il padre di Internet]
**Leonard Kleinrock** è considerato il padre di Internet: forte dal punto di vista teorico, fu la prima persona a **teorizzare la commutazione di pacchetto**, intuendo che scomporre l'informazione in più pacchetti potesse portare vantaggi nella comunicazione.
:::

Ma perché la nascita di Internet è associata proprio alla data del **29 ottobre 1969**?

### Recap degli Anni '60

| Anno | Evento |
| --- | --- |
| **1961** | Leonard Kleinrock dimostra l'efficacia del *Packet Switching* utilizzando la teoria delle code (*queuing*) |
| **1967** | Lawrence Roberts progetta ARPAnet |
| **1969** | Primo nodo **IMP** (*Interface Message Processor*) di ARPAnet alla **UCLA** |

### Recap degli Anni '70

| Anno | Evento |
| --- | --- |
| **1970** | Creazione di **ALOHAnet**, un network radio di pacchetti all'Università delle Hawaii |
| **1972** | Primo programma e-mail · nasce **NCP** (*Network Control Protocol*), il primo protocollo Internet · ARPAnet raggiunge **15 nodi** |
| **1974** | Cerf e Kahn definiscono i **Principi dell'Internetworking** (network di networks) |
| **1978** | Nasce **Ethernet** nei laboratori di Xerox |
| **1979** | ARPAnet raggiunge **200 nodi** |

### Recap degli Anni '80

| Anno | Evento |
| --- | --- |
| **1982** | Definizione del protocollo **SMTP** per le e-mail |
| **1983** | Rilascio di **TCP/IP**, che rimpiazza NCP (Cerf & Kahn) |
| **1983** | Definizione del **DNS** per la traduzione degli indirizzi IP |
| **30 apr 1986** | Il **CNUCE Institute** collega il primo nodo italiano ad ARPAnet |
| **1988** | **TCP congestion control** |

### Recap degli Anni '90

| Anno | Evento |
| --- | --- |
| **1990** | ARPAnet viene decommissionata |
| **1991** | La **NSF** (*National Science Foundation*) abbandona le restrizioni per uso commerciale di NSFnet |
| **early 1990s** | **Tim Berners-Lee** inventa il **Web** al CERN di Ginevra |
| **1994** | **Mosaic**, poi **Netscape** |
| **late 1990s** | Commercializzazione del Web |

:::note[Curiosità]
Più del **90% del traffico internazionale** viaggia attraverso **cavi sottomarini**.
:::
