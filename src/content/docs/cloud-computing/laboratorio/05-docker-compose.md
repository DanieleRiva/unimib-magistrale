---
title: "Docker: Compose"
description: Labs 5 and 6 - services vs containers, the docker-compose.yml file, depends_on, healthcheck, scaling, resources and a final Docker recap.
sidebar:
  order: 5
---

## Services vs Containers

A distributed application is made of different pieces called **services**, e.g. the **persistence** service (a database) and the **front-end** service.

- Services in Docker are **"containers in production"**.
- A service can be a **set of replicas of a container**, usually load-balanced: more than one container of the same kind working as one.
- **Scaling** a service changes the **number of container instances** running that piece of software, assigning more resources to it (**horizontal scaling**).

**Multi-container apps are difficult to manage**: in the [Micro and MariaDB exercise](../04-docker-networking/#complete-exercise-micro-and-mariadb) you needed three long commands, in the right order (network, database first, then the REST service). And how about **scaling, load balancing and availability**?

## Docker Compose

:::tip[Definition]
**Compose** is a tool for **defining and running multi-service Docker applications** on a **single node**. It offers a **declarative language** to define, run and scale services: specify services, images and configuration in a simple YAML file, `docker-compose.yml`, and get everything running with **one command**.
:::

```bash
docker compose up -d        # start everything
docker compose down         # stop and remove
```

Compose is one of the first tools of the Docker ecosystem. It is available as `docker compose` or `docker-compose`, depending on the installation. The `-f path/to/file.yml` option is not necessary if the file is named `docker-compose.yml` and is in the current directory.

:::tip[The ultimate goal of Compose]
Make your development environments **repeatable, isolated and fast**. It can be integrated into a **Continuous Integration / Continuous Delivery** setup (Maven, JUnit, Jenkins).
:::

## The Compose File

The file has three main sections: **services**, **networks** and **volumes**.

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    image: demochatweb:0.1
    ports:
      - "80:9000"
    networks:
      - my-net
  mongo:
    image: mongo
    volumes:
      - type: volume
        source: data
        target: /data/db
    networks:
      - my-net

networks:
  my-net:
    driver: bridge

volumes:
  data:
    driver: local
```

- Service `web` is **built** from a context and Dockerfile, and tagged `demochatweb:0.1`. A service can be created **from an image or built**.
- Service `mongo` is created from the `mongo` image, with a volume named `data` on `/data/db`.
- The `networks` section defines one network `my-net` of type `bridge`, the `volumes` section one volume `data` of type `local`.

This is a **2-tier application**: a Node.js presentation service and a MongoDB persistence service, connected by a **private virtual network**. If you declare no networks, Compose creates a **default network for the project**, and services reach each other using the **service name** as hostname.

:::note[The version key]
The slides show `version: '3.2'` (the v3 file format, Docker 17.04.0+). In current Compose versions the field is **obsolete** and ignored.
:::

### Main Keys

| Key | Meaning |
| --- | --- |
| `image` | Image to use |
| `build` | `context`, `dockerfile`, `target` to build the image |
| `ports` | Published ports, `"host:container"` |
| `expose` | Declares a port **without publishing it** on the host |
| `volumes` | Named volume, bind mount or anonymous volume |
| `networks` | Networks of the service |
| `environment` | Environment variables |
| `env_file` | Reads variables from a file |
| `command` | Overrides the image's `CMD` |
| `entrypoint` | Overrides the `ENTRYPOINT` |
| `restart` | Restart policy |
| `depends_on` | Startup order |
| `healthcheck` | Command that checks the service's health |
| `container_name` | Fixed name, which **prevents scaling** the service |
| `deploy.resources` | Resource limits |
| `stop_signal` | Stop signal |
| `labels` | Metadata |

### Restart Policies

| Value | Behavior |
| --- | --- |
| `no` | Never restart (default) |
| `always` | Always restart. A manual stop lasts until the daemon restarts |
| `on-failure` | Restart only if the process exits with an error |
| `unless-stopped` | Like `always`, but a manually stopped container stays stopped after a daemon restart |

### Commands

| Command | Effect |
| --- | --- |
| `up` | Create and start containers, `-d` in the background |
| `down` | Stop and remove containers and networks. **`-v` also removes volumes** |
| `build` / `pull` / `push` | Build, pull or push service images |
| `create` / `start` / `stop` / `restart` | Manage services, also singly |
| `ps` / `top` / `logs` | List containers, running processes, output. `logs -f` follows it |
| `exec` / `run` | Command in a running container / one-off command in a new container |
| `pause` / `unpause` / `kill` / `rm` | Pause, unpause, kill, remove stopped containers |
| `config` | Validate and view the Compose file |
| `events` / `port` / `images` | Real-time events, public port of a binding, images |
| `version` | Compose version information |

## depends_on and Healthcheck

:::caution[depends_on does not wait for the service to be ready]
In its short form, `depends_on` only sets the **startup order**. The database may be started but not yet accepting connections. As the slides note, the database must be **up and running** before `micro` is deployed: use `depends_on` **and** a `healthcheck`, with the long form `condition: service_healthy`.
:::

A possible solution of Ex. 3 (Micro and MariaDB):

```yaml
services:
  db:
    image: mariadb:11.4
    restart: unless-stopped
    environment:
      MARIADB_ROOT_PASSWORD: tasd-root
      MARIADB_DATABASE: db_micro
      MARIADB_USER: micro
      MARIADB_PASSWORD: tasd
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - backend
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      retries: 5

  micro:
    image: miciav/micro:0.3.0
    restart: on-failure
    environment:
      MYSQL_ADDRESS: db
      MYSQL_PORT: 3306
      DB_USERNAME: micro
      DB_PASSWORD: tasd
    ports:
      - "127.0.0.1:8080:8080"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - backend
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 256M

volumes:
  db_data:

networks:
  backend:
    driver: bridge
```

`MYSQL_ADDRESS: db` works because DNS resolves the service name. Ex. 3.1 extends the file with two variable files, `.env.dev` (development) and `.env` (production), to observe the **precedence** of environment variables.

:::caution[Two different mechanisms for variables]
`${VAR}` placeholders in the Compose file are substituted **by Compose** before creating containers, reading them from the shell or the project's `.env` file. Variables in `environment` and `env_file` instead **end up inside the container**.
:::

## Scaling with Compose

Compose lets containers scale, since they are treated as **services**:

```bash
docker compose up -d --scale whoami=2
```

:::caution[Port constraint]
**Only services with no bound ports can be scaled**: two replicas cannot bind the same host port. `container_name` also prevents scaling.
:::

Ex. 4 shows the typical solution: a **reverse proxy** in front of the replicas.

```yaml
services:
  nginx-proxy:
    image: jwilder/nginx-proxy
    ports:
      - "80:80"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
  whoami:
    image: jwilder/whoami
    environment:
      - VIRTUAL_HOST=whoami.local
```

Only the proxy publishes a port. Repeating `curl -H "Host: whoami.local" localhost`, different replicas answer. The proxy discovers containers by reading the Docker socket, mounted read-only.

## Multiple Networks and Resources

Ex. 5 replicates the Lab 4 topology in Compose, with a static IP:

```yaml
services:
  container1:
    image: busybox
    command: sleep 3600
    networks:
      - net1
  container2:
    image: busybox
    command: sleep 3600
    networks:
      - net1
      - net2
  container3:
    image: busybox
    command: sleep 3600
    networks:
      net2:
        ipv4_address: 172.25.3.3

networks:
  net1:
  net2:
    ipam:
      config:
        - subnet: 172.25.0.0/16
```

`container2` is on both networks and talks to everyone. `container1` and `container3` cannot see each other.

Ex. 6 replicates the Lab 2 resource limits: two `alpine` containers running `dd if=/dev/zero of=/dev/null`, one limited to **0.5 CPUs and 100 MB** with `deploy.resources.limits`.

## Docker Recap

![](../../../../assets/cloud-computing/docker-recap.png)

The full chain is **build → image → run**: the Dockerfile and context produce an image, a read-only template. Containers are created from it: isolated processes with a writable layer, connected by user-defined networks, with persistent data in volumes. Compose coordinates everything.

### The Final Exercise

Lab 6 proposes an end-to-end exercise, submitted on e-learning:

1. Code a **service backed by a database** (CRUD), in any language.
2. Create a **Dockerfile** and build a **small image** for the service. The database can use a ready-made image.
3. Create a **docker-compose** file with a managed volume or bind mount for the database, a **virtual network**, a suitable **restart policy** and **resource limits**.
4. Deploy it on your VM and check it works.
5. Write a **README** with the commands to build and deploy.

Lab 6 also asks to comment a Compose file adequately, which is exactly the kind of [exam question](../../esami/).

## Self-Test

**1.** What is the difference between Compose and Kubernetes?

<details>
<summary>Solution</summary>

Compose defines and runs multi-service applications on a **single node**. [Kubernetes](../06-kubernetes/) orchestrates containers on a **cluster** of machines.

</details>

**2.** Does `depends_on: [db]` guarantee that the database is ready?

<details>
<summary>Solution</summary>

No, only the startup order. You need a `healthcheck` and `condition: service_healthy`.

</details>

**3.** What is the difference between `ports` and `expose`?

<details>
<summary>Solution</summary>

`ports` publishes the port on the host. `expose` only declares it: it stays reachable by other services on the same network.

</details>

**4.** What is the difference between `always` and `unless-stopped`?

<details>
<summary>Solution</summary>

After a manual stop, with `always` the container restarts when the daemon restarts. With `unless-stopped` it stays stopped.

</details>

**5.** After `docker compose down`, is the data in named volumes still there? And after `down -v`?

<details>
<summary>Solution</summary>

After `down` yes. With `down -v` the volumes are removed.

</details>

**6.** Why can't a service with `ports: ["8080:8080"]` be scaled to 2 replicas?

<details>
<summary>Solution</summary>

Both would try to bind host port 8080. The solution is to publish a proxy and leave the replicas without ports.

</details>

**7.** How does a service reach another one in the same project?

<details>
<summary>Solution</summary>

Using the **service name** as hostname, thanks to the project network's DNS.

</details>

**8.** What does scaling a service mean?

<details>
<summary>Solution</summary>

Changing the number of container instances (replicas) running it: horizontal scaling.

</details>

## Glossary

- **Service** - Piece of an application, realized by one or more replicas of a container.
- **Docker Compose** - Tool to define and run multi-service applications on a single node.
- **depends_on** - Startup order between services.
- **healthcheck** - Command that checks a container's health.
- **Restart policy** - Rule for restarting a container.
- **Reverse proxy** - Component that receives requests and forwards them to replicas.
- **Interpolation** - Substitution of `${VAR}` in the Compose file.
