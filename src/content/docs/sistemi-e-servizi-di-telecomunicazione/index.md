---
title: Sistemi e Servizi di Telecomunicazione
description: Appunti e materiale del corso di Sistemi e Servizi di Telecomunicazione - Magistrale UNIMIB.
---

Appunti, esercizi e materiale del corso di **Sistemi e Servizi di Telecomunicazione** della magistrale in Informatica all'UNIMIB.

Naviga le lezioni dalla sidebar.

# Obiettivi del Corso e Topics
Gli argomenti del corso si dividono in argomenti in ambito Reti e argomenti in ambito Sistemi, anche se la maggior parte delle volte i due ambiti sono strettamente collegati dato che per avere una rete nella maggior parte delle volte è necessario un sistema, e viceversa.

### Sistemi
#### Concetti Propedeutici
- Aspetti fondamentali sulla teoria della comunicazione
- Multiplexing e Multiple Access (TDM(A), FDM(A), CDM(A), OFDM(A))
- Mezzi Trasmisivi

#### Architetture Tradizionali
- Architetture di Accesso a Banda Larga 
    - Fixed (ADSL, VDSL, PON, FTTN, FTTC, FTTH)
    - Fixed Wireless Access (FWA) & Satellite
    - Mobile Radio: (2G/GSM, 3G/UTMS, 4G/LTE, 5G)
- Connettività WAN (MPLS) & VPN

#### Nuovi Paradigmi
- Software-Defined Networking (SDN)

### Servizi
#### Qualità dei Servizi
- Service Level Agreement (SLA) & Traffic Conditioning Agreement (TCA)
- Modelli per QoS: IntServ & DiffServ

#### Multimedia
- Voice over IP (VoIP)
    - Voice Coding
    - Architettura SIP
- CDN: Content Distribution

# Breve Storia di Internet
I seguenti appunti non saranno parte dell'esame, ma potrebbero risultare interessanti da conoscere.

20 luglio 1969: uomo sulla Luna

29 ottobre 1969: data storicamente conosciuta per la nascita di internet

Guardando però le pubblicazioni stampa di quel periodo, 0 tracce della nascita di internet, solamente notizie sull'atterraggio sulla Luna. Ovviamente nessuno si sarebbe aspettato dell'importanza dell'evento.

Esiste però una correlazione tra questi due eventi: il 4 ottobre 1957 l'Unione Sovietica ha lanciato in orbita il primo satellite, lo Sputnik 1. Questo è rilevante perché gli US non pensavano di essere così indietro rispetto all'Unione Sovietica; il 12 settembre 1962, il presidente Kennedy fece un discorso in cui annunciava un massiccio finanziamento con l'obiettivo di portare l'uomo sulla Luna entro la fine del decennio. Questa è una cosa fondamentale perché questo finanziamento finì anche alla DARPA: Defense Advanced Research Project Agency. Uno dei progetti portati avanti fu ARPAnet, che aveva una caratteristica fondamentale rispetto alle reti esistite precedentemente: ARPAnet fu la prima rete a commutazione di pacchetto.

Il padre di Internet è Leonard Kleinrock. Si considera tale perché è un professore forte dal punto di vista teorico e fu la prima persona a teorizzare la commutazione di pacchetti. Ha pensato che andare a scomporre l'informazione in vari pacchetti poteva portare vantaggi nella comunicazione.

Ma perché la nascita di Internet è associata alla data del 29 ottobre 1969?

## Recap degli Anni '60
- **1961**: Leonard Kleinrock dimostra l'efficacia del Packet Switching utilizzando la teoria della queuing
- 1967: Lawrence Roberts progetta ARPAnet
- 1969: primo nodo IMP (Interface Message Processor) di ARPAnet al UCLA

## Recap degli Anni '70
- 1970: creazione di ALOHAnet, un network radio di pacchetti all'Università di Hawaii
-1972:
    - primo programma e-mail
    - NCP (Network Control Protocol), il primo Protocollo internet è nato
    - ARPAnet ha 15 nodi
- 1974: Cerf e Kahm definiscono i Pricipi dell'Internetworking (network di networks)
- 1978: nasce Ethernet nei laboratori di Xerox
- 1979: ARPAnet ha 200 nodi

## Recap degli Anni '80
- 1982: definizione del protocolo SMTP per le e-mail
- 1983: rilascio di TCP/IP, che rimpiazza NCP (Cerf & Kahn)
- 1983: definizione di DNS per la traduzione degli indirizzi IP
- 30 aprile 1086: il CNUCE Institute collega il primo nodo italiano a ARPAnet
- 1988: TCP congestion control

## Recap degli Anni '90
- 1990 ARPAnet viene decommissionato
- 1991 NSF (National Science Foundation) abbandona le restrizione per uso commerciale di NSFnet
- early 1990s: Tim Berners-Lee inventa il Web al CERN a Geneva
- 1994: Mosaic, poi Netscape
- Late 1990s: commercializzazione del Web

Più del 90% del traffico internazionale viaggia attraverso cavi sottomarini.