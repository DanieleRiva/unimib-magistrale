---
title: DHCP
description: DHCP - Dynamic Host Configuration Protocol
sidebar:
  order: 3
---

## DHCP
Serve per assegnare in maniera automatica indirizzi IP a degli host che vogliono comunicare su una specifica rete locale. Ovviamente è possibile configurare manualmente gli IP degli host, ma avere un meccanismo che configura gli IP automaticamente facilita la gestione.

Di fatto, vado ad assegnare degli indirizzi IP agli host per un determinato periodo di tempo e poi questi IP possono essere riutilizzati. Ottimo in situazioni altamente dinamiche in cui spesso gli host sono inattivi o utilizzano poco spesso la rete per scambiare informazione.
È un'associazione temporanea ed è possibile che quando arriva una richiesta non ci sono indirizzi IP disponibili e quindi la richiesta viene scartata.

È un protocollo client-server, quindi è necessario un DHCP server.

### Funzionamento
Un client DHCP che vuole ottenere un indirizzo IP invia un segnale broadcast di tipo DHCP DISCOVER per identificare i server DHCP esistenti.

Il server DHCP risponde con un messaggio DHCP OFFER con cui offre un indirizzo IP che può essere assegnato al client.

Il client può accettare la proposta tramite messaggio DHCP REQUEST che include l'IP offerto, per poi concludere tramite risposta DHCP ACK da parte del server.

Se un client ha già a disposizione un indirizzo IP offerto precedentemente, si skippano i primi 2 messaggi.