---
title: Voice Over IP - VoIP
description: Voice Over IP - VoIP
sidebar:
  order: 13
---

VoIP è un metodo che posso adottare per gestire le chiamate telefoniche su internet invece che tramite il tradizionale metodo telefonico (Public Switch Telephone Network, PSTN).

La differenza è che la PSTN è una rete a commutazione di circuito, mentre chiaramente la rete internet a commutazione di pacchetto.

Con VoIP si va a trasmettere la voce in **formato completamente digitale**, andando a prendere segmenti di voce e inserirli in pacchetti da inviare.

In rete PSTN la comunicazione è digitale tra centrale e centrale, quindi al giorno d'oggi non è una comunicazione di tipo analogico, ma digitale. Nell'ultimo miglio, tra casa dell'utente e la centrale si ha una effettiva comunicazione in analogico. Solo negli anni '70 era una comunicazione completamente analogica. Ovviamente, non è a pacchetto. 

## Operatori VoIP
Esistono 2 tipi di operatori VoIP:
1. Over-the-Top VoIP (OTT VoIP)

    Permettono di effettuare chiamate VoIP con app al di sopra delle reti degli operatori. A meno di stipulare Service Level Agreements con questi operatori, non garantiscono livelli di QoS.

2. Network Operators che adottano tecnologie VoIP

## Tipologie di chiamate VoIP

Esistono diversi tipi di chiamate:
1. VoIP - VoIP
2. VoIP-PSTN / PSTN-VoIP
3. VoIP-Mobile Radio Network / Mobile Radio Network-VoIP

### VoIP-VoIP - Pure VoIP
Comunicazione tra terminali VoIP, di tipo VoIP puro. 

Mette in comunicazione da terminali che supportano nativamente VoIP, come telefoni o computer con clients VoIP

![](image.png)

La cosa importante da dire è che in questo caso i terminali VoIP prendono la voce, la pacchettizzano, ovvero trasformarla in pacchetti IP che contengono la voce codificata, bypassando completamente la rete telefonica standard. 

### VoIP-VoIP - Adapted Terminals
Si ha un nodo funzionale di nome VoIP box che svolge il ruolo di prendere la voce, digitalizzarla e pacchettizzarla, per poi inviarla nella rete internet. Solitamente si trova all'interno del router.

Nelle tratte tra Standard Phone e VoIP box si ha una comunicazione analogica, il resto è tutto digitale.

![](image-1.png)

### VoIP-PSTN
In questo caso abbiamo una comunicazione tra un device VoIP e un telefono standard collegato alla rete telefonica standard.

Al giorno d'oggi è sempre meno frequente. chiaramente ho una comunicazione ibrida, perché ho tecnologia VoIP fino all'Interworking Point, ma dopo si utilizza la rete PSTN. In questo Interworking Point bisognano fare operazioni di traslazioni di voce e tecnologie per passare da uno all'altro. 

![](image-2.png)

### VoIP-Mobile Radio Network

Situazione che si verifica più frequentemente, perché la rete mobile a commutazione di circuito c'è ed è tutt'ora esistente. 

![](image-3.png)

## Perché VoIP?
Perché usare VoIP quando ho una rete telefonica che funziona da sempre? Qual è il motivo di trasportare tutto su IP?

Per l'operatore:
- Alla fine, è una questione di costi perché gli operatori hanno una convenienza nel mantenere una sola rete "universale" di tipo dati, sulla quale far affluire anche la fonia. È nell'interesse dell'operatore per questione di costi smettere la rete telefonica.

Per l'utente:
- Risulta possibile configurare più facilmente alcuni servizi di chiamata aggiuntivi, come per esempio Call Forwarding; in base al tempo, inoltra la chiamata a questo terminale, se non c'è risposta inoltra alla voicemail. Non che prima non si potesse fare, ma risulta più semplice.
- mentre nella rete telefonica standard ho il numero di telefono che mi identifica anche il chiamato, nella rete con VoIP si può avere un disaccoppiamento tra l'identità dell'utente e l'indirizzo IP associato al terminale. 
- possibilità di migliorare la comunicazione con:
    - integrazione di email, voice mail, sms
    - scambio di dati durante la chiamata
    - sessioni video e multi-conference
- possibilità di aggiustare la qualità della chiamata

## Aspetti Principali di VoIP
Prossimamente, vedremo:
- Voice Encoding: in che modo posso codificare la voce per essere trasmessa al meglio tramite VoIP
- Voice Degradation: quali sono le principali cause di degrado in VoIP
- Signalling: come le chiamate possono essere stabilite tramite VoIP

## Voice Encoding
Codificare un segnale audio significa trasformarlo in un flusso di bit che portano ad avere una rappresentazione più o meno fedele del segnale originale. Come passiamo da una rappresentazione analogica a una digitale? Ci sono varie tecniche che vediamo tra poco.

La voce ha un'estensione di banda di circa 4 kHz. Non è proprio così in verità, ma la stragrande maggioranza di energia è concentrata nel range dei 4 kHz.

![](image-4.png)

Ovviamente il segnare vocale risulterà un minimo degradato.

Posso codificare la voce per mezzo di 3 diverse tipologie di codificatori:
1. Waveform Codecs
2. Speech Codecs
3. Hybrid Codecs

### Waveform Codecs
Primi codificatori della voce a nascere. Prendono la forma d'onda e codificano direttamente la waveform del mio segnale. Se ho quindi un segnale vocale che ha estensione di banda pari a $B = 4 kHz$, posso codificare senza alcuna perdita, in quanto ho possibilità di ricorstruire il segnale perfettamente al netto di un errore sistematico che prende il nome di Quantization Error.

Le due operazioni che devo eseguire sono:
- Sampling:
    Trasforma un segnale time-continuous, in un segnale time-discrete. Avendo il segnale continuo (verde) a tempi regolari prendo un campione del segnale analogico:
    ![](image-5.png)

    Il campionamento deve essere fatto seguendo un determinato criterio per fare in modo di ricostruire perfettamente la voce. Se ho un segnale che ha una bandwidth pari a $B$, viene in soccorso il teorema di Nyquist-Shannon che dice: se ho un segnale con estensione pari a $B$, se vado a campionare a una frequenza pari a $2B$, sono sicuro di poter poi ricostruire il segnale senza perdite. Come visibile nel grafico colorato, andiamo a prendere quindi campioni a una frequenza regolare pari a $\frac{1}{2B}$. Se ho banda pari a $4 kHz$, devo usare una frequenza di campionamento pari a $8 kHz$.
- Quantization:
    Dopo aver ottenuto un segnale discretizzato lungo l'asse dei tempi, continuo ad avere un problema: i valori che possono essere assunti da ognuno di questi campioni lungo le asse delle Y, continuano ad essere valori reali che appartengono a $R$. Allora si quantizza; la quantizzazione porta una discretizzazione dei valori assunti dalla mia forma d'onda lungo l'asse delle Y, ovvero lungo l'asse dell'ampiezza del segnale. Rappresento i vari campioni con un numero discreto finito di livelli:
    ![](image-6.png)

    Quindi quello che faccio è: voglio rappresentare i valori dei miei campioni in un certo numero discreto di campioni, in questo caso diciamo 16 diversi livelli. Se ho un segnale che è nullo, io lo codifico con quattro 0. Se ho un segnale che ha valore di ampiezza tra 0 e 1, lo codifico con 0001, e così via.
    Devo definire il livelli di quantizzazione sulla base del valore massimo dell'ampiezza del mio segnale.

    Se faccio questa cosa, il punto è che sto introducendo in maniera irreversibile un errore di quantizzazione; guardando per esempio proprio il primissimo valore del grafico, originariamente ha valore compreso tra 6 e 7, ma poi viene codificato a 7.

    :::danger[Errore di Quantizzazione]
    Tanto più piccolo quanti più livelli di quantizzazione ho. Se ho tanti livelli fitti, ho errore molto ridotto, ma più il numero di livelli è elevato, più ho bisogno di bit per codificare i livelli.
    :::

![](image-7.png)

## Pulse Code Modulation (PCM)
Codifica che adottata nelle reti telefoniche standard.

Nel caso specifico di PCM abbiamo una Logarithmic Quantizazion non uniforme: livelli più fitti per valori di ampiezza bassi e meno fitti man mano cresce l'ampiezza del segnale. Questo si fa perché una quantizzazione di questo tipo si adatta molto bene alla dinamica di loudness dell'orecchio umano: è in grado di percepire molto meglio variazioni di intensità del suono quando il volume è molto basso, molto meno quando un suono ha un volume molto alto. Adottando questo tipo di quantizzazione sto dicendo che ho livelli più ravvicinati con un'ampiezza molto bassa del segnale, riproducendo più fedelmente il segnale per il mio orecchio.

## Differential PCM (DPCM)
Una delle varianti di Pulse Code Modulation, che hanno il compito di cercare di ridurre il bitrate senza compromettere la qualità della voce.

DPCM sfrutta gli stessi principi di PCM, ma si basa sulla seguente osservazione: campioni che sono temporalmente vicini sono fortemente correlati. Possiamo sfruttare questa correlazione per ridurra la quantità di bit da trasmettere. Per fare questo, si adottano dei metodi predittivi alla sorgente con l'obiettivo di stimare quale sarà il campione successivo, per poi codificare solo la differenza tra il campione reale e il campio predetto.
![](image-8.png)
![](image-9.png)

Ma perché devo fare una cosa del genere? Perché ho che la varianza nel segnale differenza è più bassa rispetto alla varianza nel mio segnale originale. È possibile codificare con meno bit rispetto ai sample individuali.

## Adaptive DPCM (ADPCM)
Ottengo dei miglioramenti delle prestazioni se considero una quantizzazione di tipo adattivo. 

![](image-10.png)

Vado ad adattare il numero dei livelli di quantizzazione sulla base del trend del segnale, se è più o meno ampio.

## Speech Codecs
Chiamati anche Vocoder. A differenza dei codificatori a forma d'onda, i Vocoder cercano di codificare la foce sulla base delle sue caratteristiche intrisiche, con l'obiettivo di ridurre il più possibile la ridondanza. Gli aspetti fondamentali dei vocoder:
- efficienza molto elevata
- complessità molto complessi
- ritardi elevati
- sensibili al rumore di fondo in quanto fatti apposta per codificare la voce umana

Il tipo di Speech Codecs più adottato sono i Linear Vocoders (LPC).

### Voice Signal Characteristics

![](image-11.png)

Il segnale vocale è composto da due tipologie di suono:
- Voiced: suoni tipici delle vocali. Hanno una forma d'onda che si ripete periodicamente secondo una frequenza determinata che prende il nome di pitch frequency.

- Unvoiced: più tipici delle consonanti, molto diversi dai voiced. Hanno ampiezza molto più bassa e caratterizzati da high frequencies.

Guardando il grafico, notiamo (come scritto sotto l'asse X) che è visible un segnale Unvoiced, ma anche due segnali Voiced a destra.

Gli speech codecs vanno proprio a sfruttare questa forte differenza nella generazione tra questi due tipi di suoni. 

### Voice Production

Lezione di anatomia perché in questo corso vediamo tutto. Però a parte le cacate, è importante capire come funziona la produzione della voce perché ci permette di capire in che modo andiamo a modellare la produzione della voce nei Vocoder.

![](image-12.png)

Possiamo dire che quando dobbiamo produrre la voce, entrano in gioco 3 fasi differenti:
1. Produzione del fiato, genera aria.
2. Generazione del suono, quando l'aria raggiunge la laringe, che vibra producendo il suono effettivo.
3. Il suono attraversa il "tratto vocale" dove avviene la modulazione del suono. Sulla base delle posizioni che il palato, bocca e naso assumono, vado a modulare il suono.

Nei Vocoder, la modellazione della voce viene fatta tramite un Phoneme Model.

Phoneme: basic unit of sound.

L'obiettivo è andare a definire un filtro riverberante, caratterizzato da un insieme di parametri. Adesso vediamo con il modello Phoneme cerca di capire quali sono questi parametri per riprodurre la voce al meglio.

### Phoneme Model
![](image-13.png)

Nel modello Phoneme abbiamo 2 diverse fasi:

1. Fase di eccitazione

    Va a modellare le due fasi precedenti di produzione del fiato e di generazione del suono, in un'unica fase.

    Si genera un segnale di eccitazione, che può essere fatto in 2 modi:
    1. treno di impulsi con un determinato pitch, se sono di fronte a un suono Voiced. (Periodic)
    2. white noise, se sono di fronte a un phoneme di tipo Unvoiced. (Stochastic)

2. Modulazione del Suono

    Una volta generato il segnale di generazione, questo segnale viene dato in input a un filtro riverberante che ha il compito di modellare quella fase di modulazione del suono. Questo filtro ha un numero $a_i$ di parametri; dobbiamo capire quali sono questi parametri in modo che in uscita si ottiene un segnale che è il più simile possibile al phoneme originale.

## Linear Vocoders - LCP

Considerando un Vocoder Lineare, abbiamo di fronte due fasi:

### Fase di Analysis
Viene fatta alla sorgente. 

![](image-14.png)

Come funziona? Prende a intervalli regolari la waveform, solitamente circa 10-20ms. Deve capire come devono essere fatti i parametri del filtro per fare in modo che in uscita si ha un segnale il più simile possibile al Phonema analizzato.

Come prima cosa, bisogna analizzare se la waveform è un segnale Voiced o Unvoiced, tramite un flag opportuno. Se risulta Voiced, bisogna definire un Segnale di Eccitazione che abbia una determinata frequenza di pitch; devo capire quale è questa frequenza. Se invece risulta Unvoiced, devo generare un White Noise che ha una determinata varianza; devo capire quale è questa varianza. 

A questo punto fornisco in input il Segnale di Eccitazione preparato al filtro lineare, del quale devo stimare i coefficienti $a_i$.

Il punto chiave è che dò in input al filtro un segnale $S'(n)$. In uscita dal filtro voglio avere un segnale $Ŝ(n)$ il più possibile simile al segnale originale, quindi vado a cercare di minimizzare una funzione di errore $e(n) = |Ŝ(n) - s(n)|$, con $s(n)$ segnale che voglio riprodurre; nel fare questa operazione vado a cercare quali sono i parametri nel filtro che mi portano a minimizzare l'errore.

Ma effettivamente, cosa invio in rete? Invio i parametri, usati poi nella fasi di Decodifica. Questi parametri sono:
- parametri $a_i$ del filtro
- flag Voiced/Unvoiced
- varianza del rumore/frequenza di pitch
- gain $G$

Con questi valori, posso fare dall'altro lato la synthesis, ovvero generare la voce 

### Fase di Synthesis
Viene fatta alla destinazione. Consiste nella fase di decodifica: un synthesiser utilizza i parametri ricevuti per riprodurre il segnale. Questa riproduzione del segnale prende appunto il nome di Synthesis.

Per ripetere, i parametri utilizzati sono:
- parametri $a_i$ del filtro
- flag Voiced/Unvoiced
- varianza del rumore/frequenza di pitch
- gain $G$

![](image-15.png)

Quello che può sconvolgere è che quello che ascolto, in realtà non è la voce reale dell'altra persona, ma una voce totalmente sintetica e ricostruita a partire dai parametri.

Vantaggi:
- bitrate molto ridotto, < 5 kbit/s
Svantaggi:
- ritardi molto elevati (segmentation, analysis, synthesis)
- la voce ricostruita è comprensibile e ha voce buona, ma non è naturale ed eccellente
    - problemi con rumori di fondo

### Esempio
Utile per capire i vantaggi di ridunzione della ridondanza. I valori usati non sono reali, ma comunque realistici.

Immaginiamo di avere Phonema ogni 30ms da analizzare.
- $G = 5$ bit
- $a_i = 8$ bits each (i = 1, ..., 10)

    10 parametri con 8 bit utilizzati per codificare ciascun parametro.
- $V | NV = 1$ bit

    1 bit per codificare se è un suono Voiced o Unvoiced.
- Pitch period / Noise Varianca = $6 bits$ 

Il bitrate corrisponde a $\frac{92 bit}{30 ms} = 3.067 kbit/s$

## Hybrid Codec
Usano le stesse tecniche dei Vocoder Lineari, ma ne ottimizzano ulteriormente alcuni aspetti.

Ci sono diverse famiglie di Hybrid Codec:
- MultiPulse-Excited Linear Prediction (MPELP)

    Invece di fare 2 divere tipologie di segnali di eccitazioni, ce n'è una sola che è una sequenza di $N$ campioni non equispaziati e con ampiezze variabili. Non si ha più quindi distinzione tra Voiced e Unvoiced.
- GSM encoder (RPE-LTP)

    I bit encoded appartengono a diversi livelli di protezione (maximum, medium, no protection)

- Code Excited Linear Prediction (CELP)

    Modifico ulteriormente la fase di eccitazione: definisco un codebook, ovvero un insieme di sequenze di eccitazioni predeterminate codificate con un determinato numero di bit. La scelta ha sempre l'obiettivo di minimizzare l'errore funzione $e(n)$. Nonostante può portare ad elevate efficienze, ha il problema che sono onerose computazionalmente.

    ![](image-16.png)

## Voice Quality Assessment
In che modo posso valutare la qualità di queste diverse codifiche?

La qualità delle codifiche può essere valutata per mezzi di una metrica di nome Mean Opinion Score (MOS). In maniera soggettiva dice se una codifica è migliore o peggiore delle altre. Il MOS non è altro che un numero che va da 1 a 5, dove il valore 1 indica che la qualità è pessima, mentre il 5 indica che la qualità è eccellente.

I vari codificatori sono associati a determinati MOS, ma come si ottiene questo valore per una determinata codifica? Questo è un problema perché devo coinvolgere un alto numero di ascoltatori al quale faccio ascoltare lo stesso segmento audio per mezzo di diverse codifiche e faccio loro esprimere opinioni con valori da 1 a 5.

Ovviamente è una procedura che dal putno di vista tecnico non ha nulla di complesso, però è complessa da un punto di vista logistico perché va organizzata.

Vantaggi:
- questa metrica riflette la ricezione delle persone.
Svantaggi:
- costoso e complesso (non tecnicamente ma logicamente).
- one-off-method, ovvero una tantum; se domani esce una nuova codifica, dovrò rifare tutto includendo anche quelle vecchie.

![](image-17.png)

## Voice Degradation

Si hanno sorgenti di ritardo intrinseche, a prescindere dal fatto che si userà una rete a commutazione di pacchetto o circuito per trasmettere la voce.

Guardando a commutazione di pacchetto, però, ci sono ulteriori problematiche non presenti nel caso di commutazione di circuito. Queste problematiche includono introduzioni di ritardi e la perdita dei segmenti vocali.

Vediamo quindi quali sono i vari ritardi che sono introdotti nella comunicazione.

![](image-18.png)

Abbiamo un certo numero di ritardi che si sommano per formare il **Mout-To-Ear-Delay**.

Dopo che catturo la voce ho un segnale analogico e devo codificarlo. Fatto ciò, devo inserire in pacchetti i vari bit che rappresentano i segmenti vocali, poi vengono inviati in rete e si sperimentano tutti quei ritardi ottenuti da rete a commutazione di paccheti. Poi si ha un ritardo di playout e infine un ulteriore ritardo di decodifica.

### Packetization Delay
La pacchettizzazione è quella operazione che permette di raggruppare più segmenti vocali in una rete a commutazione di pacchetto. questa cosa si fa per cercare di evitare di introdurre pacchetti con dimensione troppo piccola in rete, dato che avere troppi pacchetti piccoli in rete non è una cosa positiva in quanto devo poi andare ad elaborare l'header di ogni singolo pacchetto.

![](image-19.png)

Ovviamente questo ritardo dipende molto dalla lunghezza dei segmenti vocali e dal numero di segmenti vocali che vanno raggruppati.

### Transmission & Propagation Delay
Il ritardo di trasmissione dipende dalla lunghezza dei pacchetti e dalla capacità del collegamento.

### Processing Delay
Ritardo solitamente **trascurabile** in quanto solitamente nell'ordine dei ns, necessario per elaborare i pacchetti; ad esempio fare lookup, capire verso quale interfaccia il pacchetto va inoltrato, operazioni sull'header del pacchetto come il decremento del TTL, ecc...

### Queuing Delay
Può invece essere significativo. Dipende dall'intensità di traffico perché in reti a commutazione di pacchetto più pacchetti si accodano nelle code di uscita dei nodi di rete. 

![](image-20.png)

### Playout Delay - Jitter Compensaton
Il ritardo di Playout è un delay che vado a introdurre alla destinazione consapevolemnte per compensare quello che prende il nome di Jitter.

Jitter: variazione nello spaziamento, per quanto riguarda i pacchetti ricevuti alla destinazione, rispetto allo spaziamento che avevano alla sorgente. Se invio vari pacchetti tutti ogni tempo $t$, durante la comunicazione questo intervallo di tempo $t$ potrebbe non rimanere uguale, ma più vicini o più lontani.

![](image-21.png)

I pacchetti sono incodati in un **Playout Buffer**. Il primo pacchetto deve essere riprodotto dal ricevitore dopo un delay che compensa il Network Jitter (playout delay $T_{out}$). Questo $T_{out}$ può essere costante, oppure adattivo in base alle condizioni della rete osservate nell'ultimo periodo.

## Silence Suppression
Tecnica adottata nelle reti a commutazione di pacchetto per cercare di ridurre la quantità di dati che devono essere inviati quando si hanno chiamate VoIP.

Nasce da una banale considerazione: quando ho una conversazione bidirezionale, solitamente il chiamante è usato in media da parte dell'utente per il 50% del tempo. Se non si sta parlando, non ha senso occupare data inviando segmenti vocali vuoti che non hanno voce; sopprimendo quindi i silenzi, si occupa banda inferiore.

Il punto è che non si fa in maniera opportuna questa soppressione dei silenzi, dall'altro lato si verifica la sensazione di caduta di linea. Se si ha un silenzio totale, può dare l'impressione che sia caduta la linea.

Allora quello che si fa è introdurre localmente un background noise che dà la sensazione a chi sta ascoltando che la linea sia ancora attiva. Questo rumore è generato localmente, senza necessità di trasmissione.

Bisogna però capire come identificare se si è o meno in un periodo di silenzio: se ne occupano delle tecniche che prendono il nome di **Silence Detection**.


## VoIP Signalling Protocols
Sono tutti quei protocolli che permettono di controllare flussi dati.

Questo genere di protocolli servono esclusivamente a fare in modo che la chiamta possa essere instaurata, quindi anche a riservare le risorse.

Esistono due tipi di protocolli di segnalazioni:
1. In-band signalling:

    Utilizzano esattamente lo stesso canale che viene usato per la voce o per i flussi dati, per scambiare i messaggi relativi alla segnalazione.
2. Out-band signalling:

    Adottano un canale separato rispetto a quello usato per trasportare flussi dati o la voce.

### Signalling in the PSTN Network
Breve digressione su quella che era la segnalazione nella rete telefonica standard.

Chiaramente, nella PSTN la segnalazione coinvolgeva:
- chiamante
- rete telefonica, che ha il compito di instradare la chiamata e riservare le risorse (circuiti)
- chiamato

La rete PSTN fa:
- Access Control
- Call Admission Control
- Charging (tariffare la chiamata)

Il signalling nella rete PSTN si chiama SS7 (Signalling System No. 7), sviluppata dal 1975.

Esempio di tipologie di messaggi scambiati quando viene adottata questa segnalazione in rete PSTN:

![](image-22.png)

Dove le frecce continue indicano messaggi scambiati, mentre quelle tratteggiate delle azioni.

### VoIP Signalling
Sulla rete IP, il signalling può essere minimizzato perché possiamo usare delle tecnologie già esistenti, come per esempio il DNS per tradurre un indirizzo IP nel nome del chiamante o del chiamato. Inoltre, il Data flow roting viene eseguito dal protocollo IP.

Potrebbe essere sufficiente aggiungere:
- un protocollo per avvisare il chiamato
- un protocollo per negoziare i parametri di sessione (codecs, numero e tipo di media streams supportati, ...)

Purtroppo, non è vero che questo è sufficiente. I protocolli di segnalazione sono tendenzialmente più complessi perché si vuole arricchire con altre funzionalità per rendere questa segnalazione quanto più simile, se non migliore, a quella che era nella rete PSTN. Quindi, si cerca di implementare:
- Access Control
- Call Admission control
- Charging
- Control of multi-party sessions

Ci sono varie architetture adottate per la segnalazione VoIP, le due più conosciute sono H.323 e Session Initiation Protocol (SIP). Ci focaliziamo su SIP.

### SIP

Spoiler: ritroveremo quasi tutte le cose già viste in HTTP perché è molto simile come protocollo.

SIP è nato nel 2002, apposta per risolvere l'esigenza di effettuare chiamate sia audio e audio-video sulla rete IP.

L'identificatore associato agli utenti per effettuare le chiamate con SIP prende il nome di SIP Uniform Resource Identifier (URI). Sintatticamente e semanticamente sono identici agli indirizzi email: user@domain.tld.

L'identificativo è relativo all'utente, non al terminale; è quindi possibile avere quella che prende il nome di Personal Mobility. Un utente può accedere al servizio VoIP da diversi terminali, anche temporaneamente. Si ha quindi disaccoppiamento tra id del terminale e dell'utente. Comprensibilmente, per garantire questa Mobility, sonon necessarie due funzionalità da implementare:
- registration
- user location

#### Metodi SIP
![](image-23.png)

Essendo simile a HTTP, SIP è un protocollo di tipo client-server, in cui ogni nodo coinvolto nella rete ha una funzionalità client e una funzionalità server, dove il client invia richieste e il server risponde.

In SIP ci sono diversi metodi utilizzati, proprio come l'esistenza di vari metodi HTTP. Le richieste SIP, possono riguardare diversi metodi, che però sono ovviamente differenti da quelli di HTTP. In totale SIP ha 14 metodi, ma i più importanti sono i seguenti:

![](image-24.png)

:::note
SIP non garantisce consegna. HTTP si basa su TCP, ma per SIP questo non è vero: può girare sia su TCP che su UDP.

Di gran lunga, la situazione più tipica è che SIP viene utilizzato su UDP.
:::

#### SIP Response Codes

75 possibili codici raggruppati in 6 categorie. Nulla di più da dire rispetto a HTTP.






























