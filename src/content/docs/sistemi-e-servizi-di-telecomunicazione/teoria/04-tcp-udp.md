---
title: TCP & UDP
description: TCP & UDP
sidebar:
  order: 4
---

## Protocolli di Trasporto

Sono protocolli **end-to-end**, ovvero sono "parlati" esclusivamente dai sistemi periferici e **non** dai commutatori della rete.

Gli host conoscono le applicazioni e i loro requisiti, ma **non** hanno conoscenza su quanta capacità della rete è disponibile. Non sanno nemmeno in che modo il loro utilizzo delle risorse è in competizione con l'utilizzo delle risorse di altre applicazioni.

:::note
I protocolli end-to-end hanno il compito di **arricchire** i servizi offerti dal Network Layer.
:::

### UDP

**U**ser **D**atagram **P**rotocol è un protocollo di tipo **connectionless**, orientato a messaggi: il trasferimento di questi dati nella rete **non richiede l'apertura di una connessione**.

Offre un tipo di trasporto **unreliable best-effort**, ovvero non garantisce:

- la consegna;
- la ritrasmissione in caso di perdita;
- il flow e congestion control.

In compenso UDP offre:

- **Multiplexing / Demultiplexing** dei pacchetti da/verso varie applicazioni eseguite sullo stesso host;
- un (opzionale) **rilevamento di errore** sull'intero pacchetto tramite **checksum**.

### TCP

**T**ransmission **C**ontrol **P**rotocol è un protocollo **orientato al flusso di byte**. Di fatto, significa che quello che vogliamo fare è trasferire un flusso di byte dal mittente al destinatario: **tutti** e **nell'ordine** in cui sono stati trasmessi.

Risulta quindi più complicato di UDP, proprio perché:

- garantisce la **consegna sequenziale ordinata**;
- effettua il **recupero** di dati persi o corrotti;
- **elimina i duplicati**.

Inoltre, a differenza di UDP, richiede di **stabilire una connessione** tra mittente e destinatario.

#### Flow Control

Meccanismo che permette al mittente di aggiustare la quantità di dati inviata rispetto alle reali capacità computazionali del ricevitore, evitando di **sovraccaricarlo** e di mandare più dati rispetto alla dimensione reale del buffer lato applicazione ricevente.

Come si fa? Tramite un campo di nome **Transmission Window**, che contiene il numero di byte residui nel buffer, per evitare un **buffer overflow**.

#### Congestion Control

Meccanismo che fa uso di una **finestra di congestione** dinamicamente aggiustata in base allo stato di congestione della rete.

:::tip[Stima della congestione]
Siccome la rete è una **black-box**, esiste un metodo per stimarne la congestione che si basa sul quantitativo di **ACK non ricevuti**.
:::
