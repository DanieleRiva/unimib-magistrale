---
title: DHCP
description: DHCP - Dynamic Host Configuration Protocol
sidebar:
  order: 3
---

## DHCP

Il **DHCP** (*Dynamic Host Configuration Protocol*) serve ad assegnare in maniera **automatica** indirizzi IP agli host che vogliono comunicare su una specifica rete locale. È possibile configurare manualmente gli IP degli host, ma avere un meccanismo che li configura automaticamente **facilita la gestione**.

Di fatto, vado ad assegnare indirizzi IP agli host per un **determinato periodo di tempo**, dopodiché questi IP possono essere **riutilizzati**.

:::tip[Quando è particolarmente utile]
È ottimo in situazioni **altamente dinamiche**, in cui spesso gli host sono inattivi o utilizzano poco la rete per scambiare informazioni.
:::

:::caution[Associazione temporanea]
L'associazione IP → host è **temporanea**. È possibile che, quando arriva una richiesta, **non ci siano indirizzi IP disponibili**: in tal caso la richiesta viene **scartata**.
:::

È un protocollo **client-server**, quindi è necessario un **DHCP server**.

## Funzionamento

Lo scambio di messaggi tra client e server segue **quattro fasi**:

| # | Messaggio | Mittente | Descrizione |
| --- | --- | --- | --- |
| 1 | **DHCP DISCOVER** | Client | Inviato in **broadcast** per identificare i server DHCP esistenti. |
| 2 | **DHCP OFFER** | Server | Il server **offre** un indirizzo IP assegnabile al client. |
| 3 | **DHCP REQUEST** | Client | Il client **accetta** la proposta, includendo l'IP offerto. |
| 4 | **DHCP ACK** | Server | Il server **conferma** e conclude l'assegnazione. |

:::note[Scorciatoia]
Se un client ha **già a disposizione** un indirizzo IP offerto precedentemente, si **saltano i primi 2 messaggi** (DISCOVER e OFFER).
:::
