---
title: Ripasso & Autotest
description: Mega ripasso del corso - domande aperte e a crocette per tutti gli argomenti
sidebar:
  order: 18
---

:::tip[Come usare questo file]
Prova a rispondere **prima** di aprire la soluzione. Per le domande aperte, ripeti a voce alta come se fossi all'orale. Le risposte sono nascoste nei menù a tendina: cliccaci sopra solo dopo aver provato.
:::

## 06 - Teoria della Comunicazione

### Domande aperte

1. Cos'è la capacità di canale e come la lega Shannon a banda e rapporto segnale-rumore?
<details><summary>Risposta</summary>La capacità di canale è il massimo bitrate trasmissibile in modo affidabile (BER piccolo a piacere). Shannon (1948): $C = B \cdot \log_2(1 + S/N)$ [bit/s]. Non dipende solo dal mezzo, perché dipende dalla potenza del segnale; non posso aumentarla a piacere perché $S$ elevato diventa rumore $N$ per altri canali (interferenze).</details>

2. Cos'è la banda di un segnale e che ruolo gioca la Fourier Transform?
<details><summary>Risposta</summary>La Fourier Transform porta un segnale dal dominio del tempo a quello della frequenza: ogni segnale è una somma di sinusoidi con frequenza, ampiezza e fase. La banda è l'estensione massima delle componenti in frequenza non nulle.</details>

3. Differenza tra modulazione analogica e digitale.
<details><summary>Risposta</summary>Analogica: sposta il segnale modulante in alta frequenza (su un carrier) per incasellare più segnali sul mezzo. Digitale: assegna forme d'onda (symbol) a gruppi di bit, robuste a rumore/distorsione. Baud rate = symbol/s; se 2 bit/symbol, bitrate = 2 × baud rate.</details>

### Crocette

4. Con banda 4 kHz, la frequenza minima di campionamento (Nyquist) è:
   - A) 4 kHz B) 8 kHz C) 2 kHz D) 16 kHz
<details><summary>Risposta</summary>**B) 8 kHz** (campiono a 2B).</details>

5. Un BER di $10^{-3}$ significa:
   - A) 1 bit errato ogni 100 B) 1 ogni 1000 C) 1 ogni 10 D) 3 bit errati
<details><summary>Risposta</summary>**B) 1 ogni 1000.**</details>

## 07 - Multiplexing & Multiple Access

### Domande aperte

1. Differenza tra Multiplexing e Multiple Access.
<details><summary>Risposta</summary>Entrambi condividono la capacità di un canale. Nel Multiplexing un multiplatore assegna le risorse (frequenza/tempo/codice). Nel Multiple Access le sorgenti accedono in modo concorrente, senza un multiplatore che decide.</details>

2. Spiega FDM, TDM (sincrono e asincrono) e la multiplazione statistica.
<details><summary>Risposta</summary>FDM: divisione in bande di frequenza. TDM sincrono: il tempo è diviso in time slot assegnati rigidamente (slot vuoto se la sorgente non trasmette). ATDM: trasmissione a pacchetti asincrona; abilita la multiplazione statistica, che adatta la condivisione all'intensità di traffico istantanea.</details>

3. Come funziona CDM/CDMA con le chip sequence ortogonali?
<details><summary>Risposta</summary>Ogni segnale è moltiplicato per un codice (chip sequence a +1/-1) con bit molto più corti del dato. I codici sono ortogonali (prodotto scalare = 0). Si trasmette la somma dei segnali codificati; in ricezione, moltiplicando per il proprio codice si estrae il segnale (valore alto = 1, basso = 0; 0 = niente trasmesso).</details>

### Crocette

4. La multiplazione statistica è abilitata da:
   - A) FDM B) TDM sincrono C) ATDM D) CDM
<details><summary>Risposta</summary>**C) ATDM.**</details>

## 08 - Mezzi Trasmissivi

### Domande aperte

1. Cos'è la cross-talk e come la si combatte nei doppini?
<details><summary>Risposta</summary>Cross-talk (diafonia): interferenza tra coppie di cavi paralleli che si comportano da antenna. Si combatte attorcigliando i fili (interferenza distruttiva) e, nei fasci, usando passi di torsione differenti.</details>

2. Multi-mode vs Single-mode fiber e dispersione modale.
<details><summary>Risposta</summary>Multi-mode: core grande (~50 µm), più modi di propagazione → dispersione modale (segnale che si dilata nel tempo, simile a distorsione) → alta capacità solo su brevi distanze. Single-mode: core 8-10 µm, un solo modo, più pregiata e costosa, lunghe distanze.</details>

3. Free-space attenuation: formula e dipendenza da frequenza.
<details><summary>Risposta</summary>$P_r = P_t \left(\frac{\lambda}{4\pi d}\right)^2$. L'attenuazione cresce quadraticamente con la frequenza (cala con la lunghezza d'onda).</details>

### Crocette

4. Le antenne omnidirezionali hanno un diagramma di radiazione:
   - A) sferico uniforme B) "a ciambella" C) a fascio stretto D) puntiforme
<details><summary>Risposta</summary>**B) a ciambella** (sopra/sotto l'antenna non si capta).</details>

## 09 - Broadband Access Networks

### Domande aperte

1. Cos'è il Vectoring e come cancella la diafonia (downstream vs upstream)?
<details><summary>Risposta</summary>Tecnica per cancellare la crosstalk tra doppini. Modello matriciale $\vec{r} = T\vec{s}$. Downstream: precodifica, si trasmette $\vec{s}^{*} = T^{-1}\vec{s}$ così a destinazione si ottiene $\vec{s}$. Upstream: il DSLAM cancella l'interferenza a posteriori ($T^{-1}(T\vec{s}) = \vec{s}$).</details>

2. Differenza tra FTTE, FTTC, FTTB, FTTH (dove avviene lo "swap" rame/fibra).
<details><summary>Risposta</summary>FTTE: fibra fino al Central Office. FTTC: fibra fino all'armadio stradale (Cabinet, con mini-DSLAM). FTTB: fibra fino allo scantinato dell'edificio. FTTH: fibra fino a casa (P2P/AON oppure PON passiva).</details>

3. FTTH PON: struttura ad albero, splitting e GPON.
<details><summary>Risposta</summary>Albero ottico passivo con splitter; in Italia ~2 livelli, splitting 1/64 (1 fibra serve 64 utenti). Svantaggio: la potenza si ripartisce → più alto lo splitting, più attenuazione. GPON: downstream condiviso fino a 2.488 Gb/s, upstream TDMA gestito dall'OLT fino a 1.24 Gb/s.</details>

4. FWA e reti satellitari: quando si usano e che limiti hanno?
<details><summary>Risposta</summary>FWA (Fiber to the Tower): fibra fino alla Base Station, poi radio fino all'utente (LOS/NLOS/Indoor); utile in aree rurali (digital divide). Satellite: copertura globale ma alta latenza (GEO); LEO (Starlink/OneWeb) riduce la latenza con costellazioni e handover tra satelliti.</details>

### Crocette

5. Con uno splitting ratio 1/64, all'aumentare del ratio il segnale agli utenti:
   - A) migliora B) resta uguale C) si attenua di più D) raddoppia
<details><summary>Risposta</summary>**C) si attenua di più** → bitrate ridotti.</details>

## 10 - WAN Connectivity Services (MPLS & VPN)

### Domande aperte

1. Cos'è il Label Swapping e perché MPLS è "livello 2.5"?
<details><summary>Risposta</summary>MPLS incapsula il pacchetto IP in un header di 32 bit tra livello 2 e livello 3 (da cui "2.5"). I router (LSR) leggono l'etichetta, la sostituiscono e inoltrano secondo la MPLS Forwarding Table, lungo circuiti virtuali (LSP) stabiliti prima della comunicazione.</details>

2. Cos'è il Path Binding e perché migliora la scalabilità?
<details><summary>Risposta</summary>Aggregazione di più flussi in un LSP unico tramite push/pop di un'etichetta esterna. I router interni fanno swapping su meno etichette → tabelle più piccole, maggiore scalabilità.</details>

3. Confronta LDP, CR-LDP e RSVP-TE.
<details><summary>Risposta</summary>LDP: hop-by-hop sul percorso del routing IP, niente Traffic Engineering. CR-LDP: estende LDP con Constraint-Based e Explicit Routing. RSVP-TE: il più usato, supporta nativamente constraint-based e rotte esplicite; le etichette sono distribuite dal Destination LER verso i router del percorso.</details>

4. Cosa sono le VPN e come funziona l'IP Tunnelling?
<details><summary>Risposta</summary>Le VPN estendono geograficamente una rete privata come overlay, condividendo lo stesso spazio di indirizzamento. IP Tunnelling: il PE incapsula il pacchetto IP privato in un nuovo header IP destinato all'ultimo PE, che decapsula e consegna; funziona anche su rete IP pubblica.</details>

### Crocette

5. In MPLS, il nodo di bordo della rete del provider si chiama:
   - A) LSR / Provider Router B) LER / Provider Edge Router C) Customer Edge D) DSLAM
<details><summary>Risposta</summary>**B) LER / Provider Edge Router (PE).**</details>

6. Il campo del VLAN TAG che identifica univocamente la VLAN è:
   - A) TPID B) PRI C) VLAN ID D) DEI
<details><summary>Risposta</summary>**C) VLAN ID** (12 bit).</details>

## 11 - Network Devices & SDN

### Domande aperte

1. Control Plane vs Data Plane: differenza e cosa cambia in SDN.
<details><summary>Risposta</summary>Control Plane: decisioni (percorsi, filtri), operazioni complesse e coordinate. Data Plane: inoltro locale veloce dei pacchetti. In dispositivi tradizionali sono logicamente separati ma fisicamente co-locati; in SDN sono disaccoppiati totalmente (anche fisicamente): il Control Plane è centralizzato in un Controller software.</details>

2. Architettura SDN: Controller, Northbound e Southbound Interfaces, OpenFlow.
<details><summary>Risposta</summary>Il Controller (software, cervello) parla verso l'alto con le applicazioni via NBI (API di alto livello) e verso il basso con gli switch via SBI (es. OpenFlow), inserendo regole nelle flow table.</details>

3. Cosa sono SDN e NFV e qual è la differenza?
<details><summary>Risposta</summary>SDN disaccoppia Control e Data plane (softwarizzazione). NFV disaccoppia hardware e software delle funzioni di rete, eseguendole su hardware generico (cloudificazione). NFV si applica bene al Control Plane, meno al Data Plane (che richiede alta velocità).</details>

### Crocette

4. Un firewall che mantiene lo stato delle connessioni è detto:
   - A) stateless B) stateful C) in-line D) proxy
<details><summary>Risposta</summary>**B) stateful.**</details>

5. Un IDS rispetto al firewall:
   - A) è sempre in-line B) blocca il traffico C) NON è in-line, fa mirroring D) sostituisce il NAT
<details><summary>Risposta</summary>**C) NON è in-line**, analizza una copia (mirroring) del traffico.</details>

## 12 - Quality of Service

### Domande aperte

1. SLA vs TCA e le politiche per il traffico non-compliant.
<details><summary>Risposta</summary>SLA: la QoS che l'ISP garantisce (metriche/SLO). TCA: il profilo di traffico su cui vale lo SLA (peak/average rate, burst). Traffico OUT (non-compliant): Policing (scartato), Shaping (ritardato), Marking (marchiato).</details>

2. Token Bucket vs Leaky Bucket.
<details><summary>Risposta</summary>Token Bucket: serbatoio di k token rigenerati a rate r; permette burst (durata $L = k/(p-r)$), preserva la burstiness. Leaky Bucket: nessun serbatoio, fa uscire a rate costante r; appiattisce (smooth) il traffico, NON preserva la burstiness.</details>

3. IntServ vs DiffServ.
<details><summary>Risposta</summary>IntServ (1994): QoS per singolo flusso, usa RSVP e mantiene stato per flusso nei router → non scalabile. DiffServ (1998): QoS per classe di servizio (campo DSCP); regolazione solo ai bordi, i core fanno Differentiated Forwarding (Per-Hop-Behaviour) senza stato per flusso → scalabile.</details>

4. RSVP: messaggi PATH e RESV, e dove avviene la Call Admission.
<details><summary>Risposta</summary>PATH (sorgente→dest, segue il routing, installa PATH state; porta TSPEC/ADSPEC). RESV (dest→sorgente, source-based routing a ritroso; porta FLOWSPEC con TSPEC+RSPEC). La Call Admission è fatta da ogni router alla ricezione del RESV: accetta (e riserva) o rifiuta.</details>

### Crocette

5. Quale PHB di DiffServ ha priorità più alta / bassa latenza?
   - A) Best Effort B) Assured Forwarding C) Expedited Forwarding D) RED
<details><summary>Risposta</summary>**C) Expedited Forwarding.**</details>

6. La durata massima del burst in un token bucket è:
   - A) $k \cdot r$ B) $k/(p-r)$ C) $p/r$ D) $r/k$
<details><summary>Risposta</summary>**B) $k/(p-r)$.**</details>

## 13 - Voice over IP (VoIP & SIP)

### Domande aperte

1. Waveform codec vs Speech codec (Vocoder/LPC): differenza di principio.
<details><summary>Risposta</summary>Waveform (es. PCM): codifica direttamente la forma d'onda (sampling + quantization). Vocoder/LPC: codifica i parametri di un modello della voce (eccitazione voiced/unvoiced + filtro). Bitrate molto più basso (<5 kbit/s) ma voce sintetica e ritardi alti.</details>

2. Cos'è il Mouth-to-Ear delay e da quali ritardi è composto?
<details><summary>Risposta</summary>Somma di: codifica, packetization, trasmissione, propagazione, processing, queuing, playout (jitter compensation) e decodifica. Il playout delay si introduce volontariamente alla destinazione per compensare il jitter.</details>

3. Architettura SIP: User Agent, Proxy Server, Registrar, Redirect Server. (Spesso chiesto!)
<details><summary>Risposta</summary>UA: client+server, stabilisce sessioni. Registrar: associa URI SIP ↔ IP dello UA (REGISTER periodica). Proxy Server: instrada richieste/risposte tra domini (livello applicativo). Redirect Server: risponde indicando una diversa localizzazione dell'utente. La localizzazione finale dell'utente avviene interrogando il Registrar.</details>

4. Cos'è SDP e cosa permette di negoziare?
<details><summary>Risposta</summary>Session Description Protocol: trasportato nel corpo dei messaggi SIP (di solito INVITE/200 OK). Permette di negoziare i parametri della sessione, in particolare i media (campo m=: tipo, porta, transport RTP/AVP, codifiche supportate).</details>

### Crocette

5. SIP, a livello di trasporto:
   - A) solo TCP B) solo UDP C) TCP o UDP (tipicamente UDP) D) solo TLS
<details><summary>Risposta</summary>**C) TCP o UDP, tipicamente UDP.** SIP non garantisce consegna.</details>

6. Il campo SIP usato per far seguire alle risposte lo stesso percorso delle richieste è:
   - A) Call-ID B) CSeq C) Via D) Contact
<details><summary>Risposta</summary>**C) Via** (per le richieste successive: Record-Route/Route).</details>

## 14 - Content Delivery Network

### Domande aperte

1. Reverse proxy vs Forward proxy e perché le CDN avvicinano i contenuti.
<details><summary>Risposta</summary>Reverse proxy: front-end vicino all'origin (nel backbone), non risolve il bottleneck di rete. Forward proxy: cache vicino agli utenti (riduce carico e latenza). Le CDN replicano i contenuti popolari vicino agli utenti.</details>

2. I due meccanismi di Request Routing basati sul DNS.
<details><summary>Risposta</summary>DNS Redirection: il DNS autoritativo restituisce l'IP di una replica/cache (caso 1: delega a un nameserver del CDN, il più usato; caso 2: il DNS del content provider risolve direttamente verso le cache). URL Rewriting: si riscrivono gli URL degli oggetti statici verso il dominio CDN.</details>

3. Consistenza: invalidation, freshness, validation; cosa fa il client con ETag/if-modified-since.
<details><summary>Risposta</summary>Invalidation: scadenza Expected Expiry Time (Expires). Freshness: garantire che la copia non sia obsoleta. Validation: a expiry scaduto, verifica se il contenuto è ancora buono. Il client (cache) invia GET con if-none-match (ETag) o if-modified-since; il server risponde 200 OK (modificato) o 304 Not Modified.</details>

### Crocette

4. Quale tipo di contenuto si presta meglio al caching?
   - A) dinamico B) volatile C) statico D) cifrato
<details><summary>Risposta</summary>**C) statico.**</details>

## 15 - Mobile Radio Networks (Concetti)

### Domande aperte

1. Le 4 procedure di mobility (Cell Selection, Location Update, Paging, Handover) e in quale stato si usano.
<details><summary>Risposta</summary>IDLE: Cell Selection (lo UE sceglie la BS col beacon migliore) e Location Update (aggiorna la LA). Transizione IDLE→ACTIVE: Paging (si rintraccia la cella esatta con chiamata entrante). ACTIVE: Handover (cambio cella, make-before-break, deciso dalla rete ma user-assisted).</details>

2. Frequency Reuse e tradeoff sulla dimensione del Cluster.
<details><summary>Risposta</summary>Cluster: celle adiacenti con gruppi di frequenze disgiunti. Reuse Efficiency = 1/K. Cluster piccolo: più capacità per cella ma più interferenza (celle co-canale vicine). Cluster grande: meno capacità ma meno interferenza. K ammissibili: 1, 3, 4, 7, 9...</details>

### Crocette

3. In stato IDLE, la posizione dello UE è tracciata a granularità di:
   - A) singola cella B) Location Area C) paese D) BSC
<details><summary>Risposta</summary>**B) Location Area** (la cella esatta si scopre col Paging).</details>

## 16 - 2G / 3G / 4G

### Domande aperte

1. Ruolo di MSC, VLR, HLR, GMSC, AUC in GSM.
<details><summary>Risposta</summary>MSC: centrale che instrada chiamate e gestisce la mobility. VLR: DB temporaneo degli utenti che visitano le celle dell'MSC. HLR: DB centrale permanente + quale VLR sta visitando un utente. GMSC: MSC di confine verso reti esterne. AUC: autenticazione delle SIM.</details>

2. IMSI vs TMSI: perché serve il temporaneo?
<details><summary>Risposta</summary>IMSI è univoco e permanente: usarlo in chiaro sull'interfaccia radio permetterebbe di tracciare l'utente. Il TMSI (temporaneo, associato all'IMSI nel VLR) si usa al suo posto quando possibile; cambia quando l'utente passa a un nuovo MSC.</details>

3. Differenza chiave 2G → 3G → 4G (commutazione, autenticazione, architettura).
<details><summary>Risposta</summary>2G GSM: commutazione di circuito, autenticazione solo utente→rete. 3G UMTS: nuova RAN CDMA, soft handover, mutua autenticazione, bearer con QoS. 4G LTE: all-IP (niente più circuito), flat network (1 nodo RAN: eNodeB), OFDMA, MIMO; mobility gestita dalla MME.</details>

4. GPRS: cos'è e cosa sono i tunnel di livello 2 e 4.
<details><summary>Risposta</summary>GPRS: commutazione di pacchetto su GSM (nodi SGSN, GGSN; canale PDTCH). Due tunnel: livello 2 (LLC) tra MS e SGSN; livello 4 (GTP, incapsulamento IP effettivo) tra SGSN e GGSN.</details>

5. LTE: ruolo di MME, SGW, PGW e cos'è il Default Bearer.
<details><summary>Risposta</summary>MME: quasi tutta la mobility + autenticazione, stabilisce i bearer (Control Plane, mai attraversata dai dati). SGW: re-routing/buffering pacchetti negli handover/IDLE. PGW: gateway verso reti esterne, assegna IP (DHCP), tariffazione. Default Bearer: stabilito UE↔PGW all'attach, mantenuto finché il terminale è acceso.</details>

### Crocette

6. In LTE l'handover che coinvolge meno la MME usa l'interfaccia:
   - A) S1 B) X2 C) E D) SGs
<details><summary>Risposta</summary>**B) X2** (collegamento diretto tra eNodeB).</details>

7. La mutua autenticazione (rete↔utente) viene introdotta a partire da:
   - A) 2G B) 3G C) 4G D) 5G
<details><summary>Risposta</summary>**B) 3G.**</details>

## 17 - 5G

### Domande aperte

1. Cos'è il Network Slicing?
<details><summary>Risposta</summary>Affettamento della rete 5G tramite NFV e SDN in reti virtuali isolate e specializzate (slice), assegnate a tenant diversi; problemi su una slice non impattano le altre.</details>

2. Onde millimetriche e Massive MIMO: vantaggi, limiti e soluzione.
<details><summary>Risposta</summary>mmWave (24-300 GHz): tanta banda, antenne piccole, ma altissima path loss e sensibilità a ostacoli/atmosfera → soluzione: Small Cells (<200 m). Massive MIMO: array di antenne con fasci stretti per singolo utente (beamforming), riuso della stessa banda.</details>

3. Architettura SBA: cos'è la CUPS e qualche funzione del Control Plane.
<details><summary>Risposta</summary>Service Based Architecture: Control Plane disaggregato in funzioni atomiche che dialogano via API REST. CUPS = separazione totale Control/User Plane. Funzioni: AMF (mobility, ex-MME), SMF (sessioni/IP, ex-MME+SGW/PGW), AUSF/UDM (autenticazione/dati, ex-HSS), UPF (User Plane, ex-PGW/SGW).</details>

### Crocette

4. La controparte 5G dell'MME (mobility) è:
   - A) UPF B) SMF C) AMF D) NRF
<details><summary>Risposta</summary>**C) AMF** (Access & Mobility Management Function).</details>

5. Un deployment 5G con nuove gNB su una EPC 4G esistente è:
   - A) Stand-Alone (SA) B) Non-Stand-Alone (NSA) C) C-RAN D) SD-RAN
<details><summary>Risposta</summary>**B) Non-Stand-Alone (NSA).**</details>

## Sfide trasversali (collegamenti tra lezioni)

:::note[Domande "killer" da orale]
Queste collegano più lezioni: sono quelle che fanno la differenza per il voto TOP.
:::

1. Segui un pacchetto dati di un utente mobile 4G da quando apre il browser: quali bearer, quali nodi, e dove entra il DNS/CDN?
2. Confronta come si garantisce QoS in IntServ (RSVP) vs DiffServ vs nei bearer UMTS/LTE: dove sta lo stato e perché.
3. Il concetto di "tunnel/bearer" attraversa GPRS, UMTS, LTE e 5G (PDU Session): spiega l'evoluzione.
4. SDN e NFV compaiono in tre contesti (SDN/SD-WAN, vEPC in 4G, SBA/slicing in 5G): che problema risolvono ogni volta?
5. Multiplexing e Multiple Access: dove li ritrovi in radiomobile (FDM+TDM in GSM, CDMA in UMTS, OFDMA in LTE)?
