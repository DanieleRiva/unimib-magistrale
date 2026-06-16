---
title: ARP
description: ARP - Address Resolution Protocol
sidebar:
  order: 2
---

## Corrispondenza tra indirizzi IP e indirizzi fisici
Vogliamo comunicare con un host nella stessa rete locale. Solitamente ne conosco l'indirizzo IP, ma non l'indirizzo MAC, ovvero l'indirizzo fisico.

Dato l'IP di un host, serve un protocollo che è in grado di reperire il suo MAC, dato che vengono usati per la comunicazione nel livello 2.

**ARP Table** o **ARP Cache**: tabella che salva le corrispondenze tra indirizzi IP e MAC.

### Funzionamento
![](../../../../assets/arp-funzionamento.png)

Il nodo B invia una ARP request in cui specifica come indirizzo MAC di destinazione un indirizzo MAC di broadcast, mentre come MAC di sorgente il proprio indirizzo MAC (che può dunque comunicarlo all'altro nodo).
Nell'ARP request viene inoltre specificato l'indirizzo IP del destinatario.

Mi può rispondere chi ha questo indirizzo IP e mi dica quale sia il suo indirizzo MAC?

A questo punto, tutti gli host sulla rete locale ricevono il messaggio, ma solo uno vede un match con il proprio indirizzo IP. Questo host invia una risposta comunicando il proprio indirizzo MAC. Ricevuta questa informazione, il primo host salva questa associazione nella propria ARP table, in modo da non dover rieseguire ARP la prossima volta che si contatta l'host A.