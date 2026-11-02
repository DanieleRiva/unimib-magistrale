---
title: Preparazione all'Esame
description: Struttura della prova, metodo per commentare Dockerfile e file Compose, errori da evitare e checklist di ripasso.
sidebar:
  order: 1
---

## Com'è Fatta la Prova

La prova scritta copre **lezioni e laboratorio**, con domande sui concetti ed esercizi semplici che chiedono di descrivere una soluzione o una tecnologia.

| Parte | Domande | Punti |
| --- | --- | --- |
| Risposta multipla | 10 da 2 punti | 20 |
| Risposte aperte | 2 da 4 punti | 8 |
| **Totale** | | **28** |

Le informazioni complete su regole e date sono nella [pagina del corso](../).

Dagli esempi ufficiali si capisce che almeno un tipo di domanda aperta è questa: **"Comment adequately on the following DOCKERFILE / DOCKER COMPOSE file"**. Su e-learning ci sono anche i quiz di autovalutazione (Virtualization, Cloud Computing, IaaS, PaaS, Serverless) e un esempio di domande miste, che però è su argomenti di un altro corso e serve solo a vedere il formato.

## Come Commentare un Dockerfile

Il metodo delle soluzioni ufficiali è **riga per riga**: per ogni istruzione si dice **cosa fa**, **quando agisce** (build o run) ed **eventuali conseguenze**. Non basta tradurre il nome dell'istruzione.

1. **Commenti e direttive**. Le righe con `#` sono ignorate, ma `# syntax=...` in prima riga è una **direttiva del parser**, che seleziona il frontend di Dockerfile.
2. **Stage**. Conta i `FROM`: più di uno significa multi-stage. Lo stage finale è l'ultimo, e un `FROM` eredita da uno stage precedente solo se lo nomina.
3. **Cosa viene eseguito in build e cosa all'avvio**. `RUN` agisce in build, `CMD` ed `ENTRYPOINT` configurano l'avvio.
4. **Punti di attenzione**. Chiudi con ciò che il file *non* fa: se manca lo `USER` gira come root, se un'istruzione è commentata non ha effetto, se servono file esterni devono stare nel context.

:::note[Esempio di commento]
Dato questo Dockerfile, ispirato agli esempi ufficiali:

```dockerfile
# syntax=docker/dockerfile:1
FROM alpine:3.24
RUN apk add --no-cache ca-certificates
ARG TARGETPLATFORM
COPY ./dist/$TARGETPLATFORM/app /
EXPOSE 80
VOLUME ["/tmp"]
ENTRYPOINT ["/app"]
```

| Riga | Commento |
| --- | --- |
| `# syntax=` | Non è un commento qualsiasi: è una direttiva che sceglie il frontend |
| `FROM` | Parte da Alpine 3.24, unico stage |
| `RUN` | In **build** installa i certificati, senza salvare l'indice dei pacchetti |
| `ARG` | Rende disponibile la piattaforma di destinazione **in build**: non è una variabile d'ambiente a runtime |
| `COPY` | Copia dal context il binario già compilato per quella piattaforma: non c'è compilazione nel file |
| `EXPOSE` | **Documenta** la porta 80, che va comunque pubblicata con `-p` |
| `VOLUME` | Dichiara un punto di mount. Senza mount esterno Docker crea un volume **anonimo** |
| `ENTRYPOINT` | Avvia `/app` in forma exec, e gli argomenti di `docker run` gli vengono accodati |

:::

### Dettagli Che Fanno la Differenza

| Istruzione | Cosa precisare |
| --- | --- |
| `ADD` | A differenza di `COPY`, scompatta gli archivi tar locali |
| `COPY . dest` | Copia dal context, nel rispetto di `.dockerignore` |
| `COPY --from=x` | Copia da uno stage o da un'immagine, non dal context |
| `FROM scratch` | Immagine vuota: nessun programma o libreria ereditati |
| `FROM img AS nome` | Dà un nome allo stage: da solo non rende la build multi-stage |
| `--mount=type=cache` | Cache di BuildKit: il contenuto non finisce nel layer |
| `ENV` | Persiste nell'immagine, sovrascrivibile con `docker run -e` |
| `USER` | Vale per i `RUN` successivi e per il processo a runtime. Creare un utente non significa passare a esso |
| `STOPSIGNAL` | Segnale inviato da `docker stop`, ad esempio per un arresto graceful |
| `ONBUILD` | Registra un'istruzione per le immagini figlie, mai all'avvio |
| `RUN ... \` | Le barre continuano **una sola istruzione**, che produce un solo layer |
| `RUN <<EOF` | Heredoc: script su più righe in una sola istruzione |

## Come Commentare un File Compose

Il metodo è lo stesso, elemento per elemento, servizio per servizio.

1. **Struttura generale**: quali servizi, quali reti, quali volumi. Se non ci sono reti, tutti stanno sulla rete di default del progetto.
2. **Ogni servizio**: immagine o build, porte, volumi, ambiente, dipendenze, riavvio.
3. **Comunicazione**: chi vede chi, in base alle reti. I servizi si raggiungono per nome.
4. **Punti di attenzione**: `depends_on` non attende la prontezza, password in chiaro, dati non persistiti, socket Docker esposto.

:::note[Esempio di commento]
Dato questo file, l'esercizio del Lab 6:

```yaml
services:
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    ports:
      - 9090:9090
    restart: unless-stopped
    volumes:
      - ./prometheus:/etc/prometheus
      - prom_data:/prometheus
volumes:
  prom_data:
```

| Elemento | Commento |
| --- | --- |
| `image` | Immagine senza tag, quindi implicitamente `latest` |
| `container_name` | Fissa il nome: il servizio **non può essere scalato** |
| `command` | Sostituisce il `CMD` dell'immagine. L'`ENTRYPOINT` resta |
| `ports` | Pubblica la porta 9090 dell'host sulla 9090 del container |
| `restart` | `unless-stopped`: riavvia, salvo stop manuale |
| `./prometheus:...` | **Bind mount** in lettura e scrittura, per la configurazione |
| `prom_data:...` | **Named volume** gestito da Docker, per i dati. Sopravvive a `down`, non a `down -v` |
| `volumes` in fondo | Dichiara il volume. Il nome reale ha il prefisso del progetto |

:::

### Dettagli Che Fanno la Differenza

| Elemento | Cosa precisare |
| --- | --- |
| `ports` | A sinistra l'host, a destra il container |
| `expose` | Non pubblica sull'host e non è un firewall |
| `./dir:/path` | Bind mount |
| `nome:/path` | Named volume, da dichiarare in `volumes` |
| `/path` da solo | Volume anonimo. Tipico: `/usr/src/app/node_modules`, per non farlo coprire dal bind mount del codice |
| `read_only: true` | Riguarda quel mount, non l'intero container |
| `depends_on` | Ordine di avvio, non prontezza |
| `build: target` | Sceglie uno stage del Dockerfile |
| `stdin_open: true` | Come `docker run -i`, senza allocare un terminale |
| `/var/run/docker.sock` | Dà accesso al daemon: **potere molto elevato** |
| `${VAR}` | Sostituita da Compose, non dentro al container |
| `cap_add: NET_ADMIN` | Aggiunge privilegi Linux rispetto a quelli predefiniti |
| `ipv4_address` | IP statico, deve stare nella subnet della rete |
| `version` | Campo storico, oggi obsoleto |

:::tip[Topologie con più reti]
Se la consegna ha più reti, disegna chi sta dove. Un servizio su due reti parla con entrambe, ma **non fa da router**: i servizi su reti diverse non si vedono tra loro.
:::

## Gli Errori da Evitare

Le soluzioni ufficiali chiudono con questi punti, che sono gli equivoci più comuni:

- `RUN` agisce in **build**, `CMD` ed `ENTRYPOINT` configurano l'**avvio**.
- `COPY` legge dal **build context**, non dalla directory del Dockerfile. `COPY --from` legge da uno stage o da un'immagine.
- `EXPOSE` **documenta**: per pubblicare serve `-p`.
- `VOLUME` dichiara un punto di mount: nome e percorso host arrivano a runtime.
- `ARG` è un parametro di build, `ENV` persiste nell'immagine. **Nessuno dei due è adatto ai segreti**.
- `ONBUILD` agisce nelle build figlie. Un `USER` commentato non ha effetto.
- Un nuovo `FROM` inizia uno stage, e eredita da uno precedente solo se lo nomina.

## Checklist di Ripasso

**Teoria**

- [ ] Definizione NIST con 5 caratteristiche, 3 servizi, 4 deployment
- [ ] Chi gestisce cosa in IaaS, PaaS, SaaS, e tecniche abilitanti
- [ ] Differenze tra AZ e region
- [ ] SLA, SLO, QoS, e il rapporto tra CA-SLA e CI-SLA
- [ ] Scalabilità ed elasticità, verticale e orizzontale
- [ ] Under e over-provisioning
- [ ] Le 4 azioni della fault tolerance
- [ ] Emulazione e virtualizzazione, full, para e OS-level
- [ ] Ring, trap-and-emulate, binary translation, hardware-assisted
- [ ] Shadow page tables e EPT/NPT, device emulation, VirtIO e SR-IOV
- [ ] Hypervisor bare-metal e hosted
- [ ] EC2, S3, EBS, risorse effimere e persistenti, modelli di prezzo
- [ ] Ciclo di auto scaling, stati dell'allarme, tipi di policy, cooldown
- [ ] Web e worker role, throttling, lock-in
- [ ] Serverless, FaaS, cold start, anti-pattern

**Laboratorio**

- [ ] Namespaces e cgroups
- [ ] Layer e copy-on-write
- [ ] Comandi di base e ciclo di vita
- [ ] Limiti hard e soft
- [ ] Volume, bind mount, tmpfs
- [ ] Istruzioni del Dockerfile, ENTRYPOINT e CMD
- [ ] Multi-stage build
- [ ] CNM e driver di rete, DNS sulle reti utente
- [ ] Compose e `depends_on`
- [ ] Architettura di Kubernetes, stato desiderato, Pod e Service
