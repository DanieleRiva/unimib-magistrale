---
title: "Docker: Dockerfile e Build"
description: Lab 3 - costruzione delle immagini, istruzioni del Dockerfile, ENTRYPOINT e CMD, multi-stage build, registry e push.
sidebar:
  order: 3
---

## Il Processo di Build

La **build** è il processo che crea un'immagine: impacchetta librerie e programmi in un filesystem a layer e aggiunge metadati, come il processo da eseguire e le opzioni di sicurezza.

Riceve in input un **Dockerfile** con le istruzioni e un **context**, l'insieme dei file disponibili in un certo percorso o URL, e produce un'immagine. Durante il processo vengono creati ed eseguiti diversi container intermedi, committati in layer.

```bash
docker build -t mymongo:0.1 .                       # il punto è il context
docker build -t mymongo:0.1 -f path/to/Dockerfile . # Dockerfile con altro nome o percorso
```

| Opzione | Significato |
| --- | --- |
| `-t` | Nome e tag `name:tag`. Puoi assegnarne più di uno alla stessa immagine |
| `-f` | Percorso del Dockerfile |
| `--build-arg` | Imposta una variabile di build |
| `--target` | Sceglie lo stage di build finale |
| `--pull` | Prova sempre a scaricare una versione più nuova dell'immagine base |
| `--rm`, `--force-rm` | Rimuove i container intermedi |
| `-q` | Stampa solo l'ID dell'immagine |

:::note[Limiti di risorse in build]
Le opzioni come `--memory` e `--cpu-shares` limitano **ogni istruzione RUN** durante la build, non l'immagine finale. Più RUN possono girare in parallelo, quindi il consumo totale può essere superiore. Il Docker moderno usa **BuildKit**, e `docker build` è di solito un alias di `docker buildx build`.
:::

Esiste anche un'alternativa manuale, la **image promotion**: avvii un container, ci installi qualcosa e fai `docker commit`. Il risultato non è riproducibile, ed è per questo che si usa il Dockerfile.

## Il Dockerfile

Un **Dockerfile** è uno script di istruzioni eseguite in sequenza. Ogni riga ha la forma `ISTRUZIONE argomenti`, e i commenti iniziano con `#`.

| Solo build | Build e run | Run |
| --- | --- | --- |
| `FROM` | `WORKDIR` | `CMD` |
| `MAINTAINER` | `USER` | `EXPOSE` |
| `COPY` | `ENV` | `VOLUME` |
| `ADD` | | `ENTRYPOINT` |
| `RUN` | | `LABEL` |
| `ONBUILD` | | |
| `ARG` | | |

![](../../../../assets/cloud-computing/dockerfile-layers.png)

### Istruzioni di Base

| Istruzione | Cosa fa | Da sapere |
| --- | --- | --- |
| `FROM` | Immagine di partenza | Prima istruzione. `FROM scratch` parte da un'immagine vuota |
| `LABEL` | Metadati | Va dopo `FROM`. Vengono ereditati, e vale l'ultimo valore |
| `RUN` | Esegue un comando in build | Crea un nuovo layer. Conviene concatenare i comandi con `&&` per fare meno layer |
| `COPY` | Copia dal context all'immagine | Preferibile quando basta copiare |
| `ADD` | Come `COPY`, ma la sorgente può essere un URL, e scompatta gli archivi | |
| `WORKDIR` | Directory di lavoro per le istruzioni seguenti | La crea se manca. Meglio di `RUN cd ...`, e con percorsi assoluti |
| `ENV` | Variabile d'ambiente persistente | Disponibile in build e nel container |
| `ARG` | Variabile **solo in build** | Si passa con `--build-arg`, può avere un default, non persiste |
| `USER` | Utente per le istruzioni seguenti e a runtime | Riduce i privilegi |
| `EXPOSE` | **Documenta** la porta | **Non pubblica** la porta: servono `-p` o `-P` |
| `VOLUME` | Dichiara un punto di mount | Senza mount esterno, Docker crea un volume anonimo |
| `ONBUILD` | Istruzione eseguita **nelle immagini figlie** | Non viene eseguita nel Dockerfile corrente, ma prima delle istruzioni del figlio |

Nelle variabili si può usare `$var` o `${var}`, con due forme speciali: `${var:-word}` vale `word` se la variabile non è impostata, `${var:+word}` vale `word` se è impostata.

Il file **`.dockerignore`** non è un'istruzione, ma controlla quali file finiscono nel context. Usa pattern come `*.md`, e `!README*.md` per le eccezioni.

:::caution[EXPOSE non pubblica]
È la confusione più frequente. `EXPOSE 80` è **documentazione**. Per raggiungere il container dall'host servono `-p host:container` oppure `-P`, che pubblica tutte le porte esposte su porte casuali.
:::

### ENTRYPOINT e CMD

Sono le istruzioni più importanti, e anche quelle che si confondono più facilmente.

| | `ENTRYPOINT` | `CMD` |
| --- | --- | --- |
| **Scopo** | Il comando principale del container | I **valori di default** |
| **Quante** | Vale l'ultima | Vale l'ultima |
| **Con argomenti in `docker run`** | Li riceve come argomenti | Viene **sostituito** |
| **Per sovrascriverlo** | `--entrypoint` | Gli argomenti dopo l'immagine |

Hanno due forme:

| Forma | Sintassi | Note |
| --- | --- | --- |
| **Exec** (consigliata) | `ENTRYPOINT ["executable", "param1"]` | Il processo riceve direttamente i segnali |
| **Shell** | `ENTRYPOINT executable param1` | Avviato come `/bin/sh -c`, che non inoltra i segnali: `docker stop` non funziona bene |

La combinazione tipica è `ENTRYPOINT` in forma exec per il comando e `CMD` per i parametri di default:

```dockerfile
ENTRYPOINT ["/usr/bin/mongod"]
CMD ["--port", "27017", "--dbpath", "/data/db", "--bind_ip_all"]
```

| Comando | Cosa viene eseguito |
| --- | --- |
| `docker run mymongo` | `mongod --port 27017 --dbpath /data/db --bind_ip_all` |
| `docker run mymongo --port 28000` | `mongod --port 28000`: il `CMD` è stato sostituito |
| `docker run --entrypoint sh mymongo` | `sh`, senza il `CMD` del Dockerfile |

:::caution[Slide 26: esempio impreciso]
La slide contiene tre imprecisioni:

- `CMD ["--port 27017"]` passa un **unico** argomento con lo spazio dentro. Vanno separati: `["--port", "27017"]`.
- `ENTRYPOINT usr/bin/mongod` è in forma shell, e **in forma shell il `CMD` viene ignorato**. Va usata la forma exec, con il percorso assoluto.
- Dice che si può sovrascrivere ENTRYPOINT o CMD "ma non entrambi", subito dopo aver mostrato un comando che li sovrascrive entrambi. Si possono sovrascrivere uno, l'altro o tutti e due.

Il [Dockerfile di MongoDB](#esempio-completo) dell'esercizio è scritto correttamente.
:::

### Più Servizi in un Container

La raccomandazione è **un servizio per container**, anche se quel servizio può generare più processi. Se proprio servono più servizi nello stesso container si usa uno **script wrapper** come `CMD`, oppure un process manager come **supervisord**.

### Esempio Completo

Il Dockerfile dell'esercizio 1 installa MongoDB su Ubuntu:

```dockerfile
FROM ubuntu:24.04
LABEL org.opencontainers.image.authors="Cloud Computing laboratory"

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates curl gnupg \
 && ... \
 && rm -rf /var/lib/apt/lists/* /tmp/server-8.0.asc
RUN mkdir -p /data/db && chown mongodb:mongodb /data/db

USER mongodb
VOLUME ["/data/db"]
EXPOSE 27017
ENTRYPOINT ["/usr/bin/mongod"]
CMD ["--port", "27017", "--dbpath", "/data/db", "--bind_ip_all"]
```

Nota il dettaglio del `RUN`: è una sola istruzione, che alla fine **pulisce** i file temporanei nello stesso layer. Un `RUN rm` separato non ridurrebbe la dimensione dell'immagine, perché i file resterebbero nel layer precedente.

## Multi-Stage Build

Con la **multi-stage build** si usano più `FROM` nello stesso Dockerfile: ognuno inizia un nuovo stage, e si copiano selettivamente solo gli artefatti necessari. Il risultato è un'immagine finale **piccola**, senza strumenti di compilazione.

Ecco la soluzione ufficiale dell'esercizio 6:

```dockerfile
FROM maven:3.9-eclipse-temurin-8 AS build
WORKDIR /app
COPY pom.xml .
COPY src/ src/
RUN mvn clean install -Dmaven.test.skip=true

FROM eclipse-temurin:8-jre
WORKDIR /app
COPY --from=build /app/target/micro-0.0.1-SNAPSHOT.jar .
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "micro-0.0.1-SNAPSHOT.jar"]
```

Con `--target` ci si ferma a uno stage intermedio: `docker build -t mybuild --target build .`.

Un'altra soluzione ufficiale, per l'esercizio 3 su NGINX:

```dockerfile
FROM nginx:1.18.0
COPY --chmod=755 docker-entrypoint.sh /docker-entrypoint.sh
COPY html /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
```

Da avviare ad esempio con `docker run -d -m 500m -p 80:80 <immagine>`.

## Distribuire le Immagini

Docker può costruire anche da un repository Git remoto, usato come context:

```bash
docker build -t <user>/nginx-example github.com/atbaker/nginx-example
```

Il **registry** è lo strumento che distribuisce le immagini. **Docker Hub** offre repository pubblici gratuiti e privati a pagamento.

```bash
docker login
docker push <utente>/<immagine>:<tag>
```

Si può anche avere un registry locale:

```bash
docker run -d -p 5000:5000 --restart=always --name registry registry:latest
docker tag <immagine> localhost:5000/<immagine>
docker push localhost:5000/<immagine>
curl http://localhost:5000/v2/_catalog
docker pull localhost:5000/<immagine>
```

## Autotest

**1.** Che differenza c'è tra `COPY` e `ADD`?

<details>
<summary>Soluzione</summary>

Entrambe copiano dal context. `ADD` accetta anche un URL come sorgente e scompatta gli archivi locali.

</details>

**2.** Che differenza c'è tra `ARG` ed `ENV`?

<details>
<summary>Soluzione</summary>

`ARG` esiste solo in build e si imposta con `--build-arg`. `ENV` persiste nell'immagine ed è disponibile nel container.

</details>

**3.** Il Dockerfile ha `EXPOSE 80`. Se lanci `docker run nginx-custom`, la porta è raggiungibile dall'host?

<details>
<summary>Soluzione</summary>

No, perché `EXPOSE` è documentazione. Servono `-p 80:80` oppure `-P`.

</details>

**4.** Dato `ENTRYPOINT ["python"]` e `CMD ["app.py"]`, cosa esegue `docker run img test.py`?

<details>
<summary>Soluzione</summary>

`python test.py`: gli argomenti sostituiscono il `CMD`, mentre l'`ENTRYPOINT` resta.

</details>

**5.** Perché si preferisce la forma exec di `ENTRYPOINT`?

<details>
<summary>Soluzione</summary>

Perché il processo principale riceve direttamente i segnali. In forma shell gira sotto `/bin/sh -c`, che non li inoltra, e `docker stop` non lo ferma in modo pulito. Inoltre la forma shell ignora `CMD`.

</details>

**6.** Quando viene eseguita un'istruzione `ONBUILD`?

<details>
<summary>Soluzione</summary>

Quando si fa la build di un'immagine **figlia**, prima delle istruzioni del Dockerfile figlio. Mai all'avvio del container.

</details>

**7.** Quale vantaggio dà la multi-stage build?

<details>
<summary>Soluzione</summary>

Un'immagine finale piccola, che contiene solo gli artefatti e non compilatori e dipendenze di build.

</details>

**8.** Perché `RUN rm file` in un'istruzione separata non riduce la dimensione dell'immagine?

<details>
<summary>Soluzione</summary>

Perché ogni `RUN` crea un layer: il file resta nel layer precedente, e quello nuovo si limita a nasconderlo.

</details>

## Glossario

- **Dockerfile** - Script di istruzioni per costruire un'immagine.
- **Build context** - Insieme dei file disponibili durante la build.
- **Forma exec / shell** - Sintassi con array JSON o con comando come testo.
- **Multi-stage build** - Build con più `FROM`, per copiare solo gli artefatti.
- **BuildKit** - Motore di build moderno di Docker.
- **Tag** - Etichetta che identifica la versione di un'immagine.
- **.dockerignore** - Elenco di file da escludere dal context.
- **Image promotion** - Creazione di un'immagine con `docker commit`.
