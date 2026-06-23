---
title: Quality of Service on the Internet
description: Quality of Service on the Internet
sidebar:
  order: 12
---

## QoS
Con il termine Qualità del Servizio mi riferisco al termine associato ai servizi di rete e ai flussi di traffico in rete.

In termini generali, la QoS è un indicatore di qualità che ha il compito di misurare il livello del servizio rispetto a quelle che sono le aspettative dell'utente, relativamente ai servizi di reti.

La QoS è strettamente dipendente da un set di parametri di performance:
- Available bandwith
- delays
- packet dropping
- eccetera

:::note[QoS vs QoE]
Quality of Experience è un indicatore importante ma diverso, nonostante si ha una relazione tra le due. La QoE è un indicatore che misura in termini soggettivi il valore del servizio offerto all'utente.

QoS è oggettivo, mentre QoE è soggettivo.
:::

Possiamo definire la QoS in:
- Termini Assoluti:

    definisco dei determinati valori che devono essere garantiti per un insieme di parametri di performance che sto misurando. Per esempio, end-to-end delay < 20ms. Ogni sinoglo pacchetto deve rispettare questi determinati valori.

- Termini Relativi:

    definisco il modo in cui tratto determinati flussi di traffico rispetto agli altri. Alcune classi di traffico vengono trattate meglio di altre in base a varie policy adottate.

QoS è importante perché IP è best effort. Al giorno d'oggi ho la necessità di trattare il traffico sulla base dei diversi servizi.

Per sua natura, il traffico di rete è Bursty:
![](image-5.png)

Dobbiamo tenerne in considerazione quando vogliamo garantire qualità del servizio.

Abbiamo già visto che esistono due tipi di servizio:
- real-time: molto sensibili al delay ma non alle perdite (es.: VoIP)

- elastic: molto sensibili alle perdite ma non al delay (es.: Web Browsing)

## Metodi per garantire QoS

Per garantire QoS in una rete IP, ho bisogno di avere almeno un sottoinsieme dei vari metodi qua sotto elencati:

1. Meccanismi che permettono di identificare il tipo di traffico. Ad esempio, le etichette labels nella rete MPLS.
    ![](image-6.png)
2. Strumenti di Traffic Engineering con l'obiettivo di fare enforcement di determinati percorsi in rete. Posso scegliere percorsi arbitrari per il mio traffico, garantendo determinati livelli di qualità del servizio.

3. Call Admission Control (CAC): tutti quei mecccanismi che hanno il compito di valutare se posso ammettere del traffico fatto in un determinato modo nel sistema. 

4. Meccanismi di Network Resource Signalling, utili per prendere le migliori decisioni in termini di CAC

5. Meccanismi di Traffic Regulations: assicurano che il traffico ammesso in rete è fatto in un determinato modo e che quindi rispetta gli accordi che chi sta mettendo il traffico in rete ha stipulato con me.
    ![](image-7.png)

6. Scheduling Techniques per prioritizzare il traffico in uscita tra i dispositivi di rete

7. Over-provisioni: in realtà, per garantire QoS, una delle cose più semplici da fare è andare a dimensionare la rete in modo molto maggiore rispetto alla media necessità, quindi con l'obiettivo di mantenere le risorse in rete il più basso possibile. Facendo ciò, non avrò congestioni, e basso utilizzo. Si fa, però mi trovo ad avere una rete sottoutilizzata quando potrei avere dei ricavi maggiori se usata a pieno. Se ho delle risorse a disposizione mi piacerebbe utilizzarle.









