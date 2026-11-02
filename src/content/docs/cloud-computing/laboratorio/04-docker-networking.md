---
title: "Docker: Networking"
description: Lab 4 - Container Network Model, libnetwork, driver bridge, host, none, overlay e macvlan, service discovery e alias di rete.
sidebar:
  order: 4
---

## Container Network Model

Il **Container Network Model (CNM)** è la specifica di Docker per la rete dei container. L'idea è **riprodurre in software** le astrazioni delle reti tradizionali: come i computer hanno interfacce, cavi e switch, i container hanno interfacce virtuali su reti virtuali, con connettività e isolamento.

![](../../../../assets/cloud-computing/cnm.png)

| Componente | Cos'è | Analogia | Implementazione |
| --- | --- | --- | --- |
| **Sandbox** | Configurazione dello stack di rete di un container: interfacce, IP, tabella di routing, DNS | Il computer | Linux network namespace, FreeBSD jail |
| **Endpoint** | Collega una sandbox a una rete. Appartiene a **una sola** rete e **una sola** sandbox | Il cavo e la scheda di rete | Coppia veth, porta Open vSwitch |
| **Network** | Gruppo di endpoint che comunicano tra loro | Lo switch | Linux bridge, VLAN |
| **Cluster** | Gruppo di host Docker connessi da una o più reti | | |

Una sandbox può avere più endpoint: un container può stare su **più reti**.

:::note[Due mattoni di Linux]
- Un **network namespace** è uno stack di rete isolato nel kernel, con interfacce, rotte e regole di firewall proprie. Garantisce che due container non comunichino, a meno di una rete Docker che li colleghi.
- Una **veth** è un cavo virtuale full-duplex con un capo in ogni namespace: un capo sta nel container, l'altro è attaccato alla rete Docker.
:::

Il CNM non è l'unica specifica: **Kubernetes usa la CNI** (*Container Networking Interface*).

### libnetwork

**libnetwork** implementa il CNM. È una libreria basata su **driver**, cioè plugin per diverse implementazioni di rete, con service discovery e load balancing integrati.

Ha due interfacce aperte e collegabili: i **network driver**, per creare reti e aggiungere container, e gli **IPAM driver**, per gestire i pool di indirizzi. I **remote driver** permettono di scrivere plugin di terze parti.

## I Driver di Rete

| Driver | Comportamento | Uso |
| --- | --- | --- |
| **none** | Nessuna rete, solo loopback | Massimo isolamento |
| **bridge** (default) | Rete privata sull'host, basata su Linux bridge | Container sullo stesso host, sviluppo |
| **host** | Il container condivide lo stack di rete dell'host | Prestazioni, con meno isolamento |
| **overlay** | Rete distribuita tra più host, con incapsulamento come VXLAN | Container su host diversi |
| **macvlan** | Assegna un indirizzo MAC, e il container appare come dispositivo fisico | Applicazioni legacy |

`docker network ls` mostra le tre reti predefinite: `bridge`, `host` e `none`.

### Bridge

Docker crea **docker0**, un bridge Ethernet virtuale che inoltra i pacchetti tra le interfacce collegate. All'avvio di un container, Docker crea una coppia **veth** che collega `eth0` del container al bridge. La connettività esterna è fornita da IP forwarding e regole `iptables`.

![](../../../../assets/cloud-computing/docker-bridge.png)

Nonostante il nome, il Linux bridge è di fatto uno **switch virtuale**: inoltra in base all'indirizzo Ethernet, a livello 2.

### Host

Con `--net=host` il container condivide namespace, interfacce e stack IP dell'host. Dal punto di vista della rete, è come avere più processi sull'host senza container. Il container è **pienamente esposto**, e due container non possono usare la stessa porta TCP. Ci sono quindi problemi di sicurezza.

### Overlay

Crea una rete distribuita **tra più host Docker**. Sta sopra le reti specifiche degli host, e Docker instrada in modo trasparente ogni pacchetto verso l'host e il container giusti.

![](../../../../assets/cloud-computing/docker-overlay.png)

### Gli Archetipi

![](../../../../assets/cloud-computing/network-archetypes.png)

Dal più forte al più debole in termini di isolamento: **closed** (solo loopback, driver none), **bridged**, **joined** (due container condividono lo stesso namespace), **open** (driver host, nessuna barriera).

## Comandi

| Comando | Effetto |
| --- | --- |
| `docker network create -d bridge <nome>` | Crea una rete. `--subnet 172.25.0.0/16` per scegliere la subnet |
| `docker network ls` | Elenca |
| `docker network inspect <nome>` | Dettagli |
| `docker network connect <rete> <cont>` | Collega un container |
| `docker network disconnect <rete> <cont>` | Scollega |
| `docker network rm <nome>` | Elimina |

## Service Discovery

libnetwork offre **service discovery** con un **DNS integrato**: ogni container può risolvere i nomi degli altri sulla stessa rete.

:::caution[La differenza da ricordare]
Il DNS funziona sulle reti **definite dall'utente**. Sulla rete `bridge` di default **i container non si risolvono per nome**, ma solo per IP.
:::

L'esercizio 4 lo mostra chiaramente. Si creano `container1` su `bridge`, `container2` su `bridge` e `my-net`, `container3` su `my-net`:

| Da | Comando | Risultato | Perché |
| --- | --- | --- | --- |
| `container2` | `ping container3` | Funziona | Sulla stessa rete utente, con DNS |
| `container2` | `ping container1` | Fallisce | Sul bridge di default non c'è DNS |
| `container2` | `ping <IP di container1>` | Funziona | Sono entrambi su `bridge` |
| `container1` | `ping container3` | Fallisce | Reti diverse |
| `container1` | `ping <IP di container3>` | Fallisce | Reti diverse: l'isolamento vale anche per IP |

### Link e Alias

Il **link** è una funzione legacy per comunicare per nome sul bridge di default: con `--link container4:c4`, `container5` risolve `container4` e `c4`. La direzione conta: da `container4` non si raggiunge `container5` per nome. Docker raccomanda le **reti definite dall'utente**.

Gli **alias di rete** danno più nomi a un container, e più container possono condividere lo stesso alias, ottenendo un semplice **bilanciamento**:

```bash
docker run -itd --net=my-net --name c1 --net-alias foo busybox
docker run -itd --net=my-net --name c3 --net-alias foo busybox
# da un altro container: ping foo risponde ora c1, ora c3
```

## Esercizio Completo: Micro e MariaDB

L'esercizio 8 mette insieme rete, volumi e variabili d'ambiente:

```bash
docker network create --driver bridge my-net

docker run -d --name my-sql --network my-net \
  -v my-vol-mariadb:/var/lib/mysql \
  -e MARIADB_ROOT_PASSWORD='tasd-root' -e MARIADB_DATABASE='db_micro' \
  -e MARIADB_USER='micro' -e MARIADB_PASSWORD='tasd' \
  mariadb:11.4

docker run -d --name micro2 --network my-net \
  -e MYSQL_ADDRESS='my-sql' -e MYSQL_PORT=3306 \
  -e DB_USERNAME='micro' -e DB_PASSWORD='tasd' \
  -p 127.0.0.1:8080:8080 miciav/micro:0.3.0
```

Osservazioni importanti:

- Il database **non ha porte pubblicate**: è raggiungibile solo dentro `my-net`.
- L'applicazione raggiunge il database **per nome** (`my-sql`), grazie al DNS.
- `127.0.0.1:8080:8080` pubblica la porta solo sull'interfaccia locale dell'host.
- Fermando `my-sql`, `curl -i localhost:8080/api/sensors/1/value` restituisce **HTTP 500**.

Gestire tutto questo a mano è scomodo: è il motivo per cui esiste [Docker Compose](../05-docker-compose/).

## Autotest

**1.** Quali sono i componenti del CNM?

<details>
<summary>Soluzione</summary>

Sandbox, endpoint, network e cluster.

</details>

**2.** Un container può stare su due reti? Un endpoint?

<details>
<summary>Soluzione</summary>

Un container sì, perché la sua sandbox può avere più endpoint. Un endpoint no: appartiene a una sola rete e a una sola sandbox.

</details>

**3.** Che cos'è una veth?

<details>
<summary>Soluzione</summary>

Un'interfaccia di rete virtuale che funziona come un cavo full-duplex tra due namespace, con un capo nel container e l'altro sulla rete Docker.

</details>

**4.** Due container sulla rete `bridge` predefinita si raggiungono per nome?

<details>
<summary>Soluzione</summary>

No, solo per IP. La risoluzione per nome richiede una rete definita dall'utente, o i link legacy.

</details>

**5.** Quale driver useresti per far comunicare container su host diversi?

<details>
<summary>Soluzione</summary>

**overlay**.

</details>

**6.** Con `--net=host`, perché due container non possono ascoltare entrambi sulla porta 80?

<details>
<summary>Soluzione</summary>

Perché condividono lo stack di rete dell'host, e una porta può essere occupata da un solo processo.

</details>

**7.** Che cosa ottieni dando lo stesso `--net-alias` a due container?

<details>
<summary>Soluzione</summary>

Un nome risolto su entrambi, con un bilanciamento semplice del carico.

</details>

**8.** Ordina gli archetipi dal più al meno isolato.

<details>
<summary>Soluzione</summary>

Closed, bridged, joined, open.

</details>

## Glossario

- **CNM** - Container Network Model, la specifica di rete di Docker.
- **CNI** - Container Networking Interface, la specifica usata da Kubernetes.
- **libnetwork** - Libreria che implementa il CNM.
- **Sandbox / Endpoint** - Stack di rete di un container e suo collegamento a una rete.
- **Network namespace** - Stack di rete isolato nel kernel Linux.
- **veth** - Coppia di interfacce virtuali collegate tra loro.
- **docker0** - Bridge virtuale predefinito di Docker.
- **Overlay** - Rete distribuita sopra le reti degli host.
- **IPAM** - Gestione degli indirizzi IP.
- **Service discovery** - Risoluzione dei nomi dei servizi tramite DNS integrato.
