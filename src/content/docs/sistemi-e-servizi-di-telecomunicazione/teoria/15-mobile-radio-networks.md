---
title: Mobile Radio Networks
description: Mobile Radio Networks
sidebar:
  order: 15
---

## Introduzione Storica

![](image.png)
![](image-1.png)
![](image-2.png)
![](image-3.png)
![](image-4.png)
![](image-5.png)
![](image-6.png)
![](image-7.png)

![](image-8.png)

## The Mobile Radio Network Infrastructure

Una rete radiomobile è una tipoligia di rete di accesso che permette di interconnettere i terminali degli utenti, che in contesto di rete radiomobile prendono il nome di User Equipment, a dei servizi di Fonia o Dati.

![](image-9.png)

Si parla di un'architettura ben definita, il cui aspetto fondamentale è che **garantisce una comunicazione seamless durante la mobilità dell'utente**.

Cerchiamo di capire in termini generali com'è fatta questa rete radiomobile.

### Radio Access Network & Core Network
![](image-10.png)

La rete radiomobile, si compone di due parti:
- Radio Access Network (RAN):

    ha il compito di gestire la connettività radio della rete con i terminali degli utenti

- Core Network (CN):

    una delle due parti della rete radiomobile in quanto rete di accesso, non rete di backbone.

    Ha il compito di interconnettere la rete RAN a delle infrastrutture esterne che offrono servizi di tipo Phone o Internet.

    Implementa tutte le funzionalità relativa alla connettività e la gestione della mobilità.

![](image-11.png)

Esistono due tipi di Core Network, che si distinguono per la tipologia di servizi che possono essere offerti:
- Commutazione di circuito:

    fornisce esclusivamente accesso ai servizi di fonia. Si ha per la generazione 2G e 3G, per quanto riguarda l'effettuare chiamate su rete a commutazioni di circuito.
- Commutazione di pacchetto:

    forniscono accesso a servizi dati, quindi alla possibilità di accedere a Internet. (2G, 3G, 4G e 5G). Dalla 4G in poi si spostano su commutazione di pacchetto, nello specifico sul protocollo IP

#### Radio Access Network
La RAN ha come elemento fondamentale quelle che prendono il nome di Base Stations (BS).

![](image-12.png)

Queste antenne hanno il compito di interconnettere alla rete gli utenti per mezzo di un'interfaccia radio; quindi serve un; antenna sia lato User Equipment che lato BS. L'utente può inviare e ricevere dati per mezzo dell'interfaccia radio.

Le Base Station si interconnettono alla Core Network per mezzo di un insieme di collegamenti che prende il nome di **rete di Backhaul**. Il concetto è lo stesso di Fixed Wireless Access; dietro alle BS c'è un'infrastruttura di rete che interconnette le antenne con la Core Network. Posso usare tecnologie di tipo diverso, come fibra ottica, con un ponte radio, eccetera...

##### Copertura Cellulare
Quando utiliziamo il *telefono* implica che andiamo ad adottare una tecnologie di quelle che prendono il nome di **Celle**; si ha una rete cellulare.

L'area in cui utilizzo il servizio è suddivisa in celle, dove ciascuna cella è coperta da una specifica Base Station.

Le celle sono solitamente approssimate a una forma esagonale, per facilità nel fare i conti: l'esagono è il poligono regolare che ha una forma più possibile simile a un cerchio che tassella il piano, ovvero che posso coprire completamente il piano.

![](image-13.png)

Per la gestione della mobility dell'utente, esistono 4 procedure:
- Cell Selection
- Location Update
- Paging
- Handover

La scelta della procedura da adottare dipende dallo stato dello UE (User Equipment):
- idle -> terminale non è coinvolto in una comunicazione
- active -> terminale con conversazione/sessione dati attiva

###### Cell Selection
Adottata in situazione IDLE. Lo UE si collega autonomamente alla BS per la quali presume di avere il miglior segnale.

Ogni BS invia un segnale in broadcast (beacon), il terminale li riceve e in maniera autonoma sceglie di collegarsi alla BS che ha il segnale migliore.

![](image-14.png)

Ovviamente, solitamente, la più vicina è quella con segnale migliore.

Quando il terminale si trova in una situazione IDLE, la posizione del terminale viene tracciata ad una granularità di Location Area (LA).

:::note[Location Area]
Insieme di celle contigue, solitamente con pattern più o meno fissati che si ripetono.
:::

Quindi, in un database specifico, si deve mantenere nella rete l'associazione tra il terminale e la LA in cui si trova. Fintanto mi muovo dentro questa specifica LA l'associazione non viene modificata, ma se passo in un'altra LA l'associazione viene aggiornata.

![](image-15.png)
![](image-16.png)

Di fatto, in ogni istante in fase di IDLE di un UE, è possibile tracciare la possibile tracciare la sua posizione a livello di LA, ma non a livello di singola cella.

Si pone però un problema: conosco l'area in cui si trova l'utente, ma nel momento in cui arriva una chiamata in entrata/uscita come posso localizzarlo esattamente nella LA? Abbiamo detto che in ogni esagono è presente una BS, quindi devo capire l'utente a quale è collegato.

Questo si fa per mezzo della procedura di Pagin.

###### Paging
Procedura che inizia quando un UE si trova in stato IDLE, ma poi si sposta in ACTIVE, adottata quando c'è una chiamata/sessione entrante verso il determinato UE.

![](image-17.png)

Ogni singola BS all'interno della LA deve inviare un messaggio di Paging che contiene l'identificativo del terminale (utente). TUTTI gli utenti all'interno della LA ricevono il messaggio di paging, ma solo uno identifica come messaggio di Paging a sé diretto, per poi rispondere. A questo punto è possibile identificare la specifica cella in cui si trova l'utente e si passa allo stato di ACTIVE mobility; è iniziata la conversazione.

###### Handover
Procedura adottata in situazione ACTIVE mobility. In questo caso il tracciamento utente non viene fatto più a livello di granularità di LA, ma di singola cella.

![](image-18.png)

È la rete che decide quando l'utente deve fare l'handover, ma è anche user assisted: l'utente invia dati della per aiutare la rete a prendere decisioni. 
Questo approccio segue la logica **make-before-break**: alloca le risorse in rete prima di effettuare l'handover effettivo, perché quando si fa il cambio di cella le risorse necessitano di essere già effettuate.

Quando si fa handover? Vediamo l'esempio nel grafico a destra, che mostra la potenza dei segnali delle due BS e il momento perfetto per effettuare l'handover. Il problema è che nella realtà dei fatti la potenza del segnale è frastagliato; quindi, l'handover viene effettuate quando lo UE sperimenta per un determinato periodo di tempo che la qualità della BS B è migliore della qualità della BS A.







































