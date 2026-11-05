---
title: "Docker: Resources and Storage"
description: Lab 2 - system information, CPU and memory limits, inspecting containers, volumes, bind mounts and tmpfs.
sidebar:
  order: 2
---

## Information from the Docker System

| Command | Purpose |
| --- | --- |
| `docker system df` | Shows the **disk usage** of images, containers and volumes. `-v` (verbose) for details |
| `docker system events` | Shows events in real time. Open it in one terminal, then start, stop, kill or restart containers in another |
| `docker system prune` | **Reclaims disk space** by deleting unused objects (images, containers, volumes). `-a` for a more aggressive cleanup |

## Limiting Resources

By default, a container has **no resource constraints** and can use as much of a resource as the host's kernel scheduler allows: this is a "no limits world". With two containers on a host with 4 CPUs and 8 GB, each one sees all 4 CPUs and 8 GB.

Linux provides ways to control how much memory, CPU or block I/O a container can use. Docker can enforce:

| Type | Meaning | Example |
| --- | --- | --- |
| **Hard limit** | The container uses **no more than a given amount** | `docker run -m 256m <app>` (or `--memory`) |
| **Soft limit** | The container uses **as much as it needs**, unless certain conditions occur, such as **contention** on the host | `docker run --memory-reservation 256m <app>` |

CPU options:

| Option | Meaning |
| --- | --- |
| `--cpus=<value>` | How much of the available CPU a container can use. With 2 CPUs and `--cpus="1.5"`, it can access **at most one and a half CPUs**. **The preferred option** |
| `--cpu-period=<value>` | The CFS (Completely Fair Scheduler) period, used with `--cpu-quota`. Default 100 ms. Use `--cpus` instead |
| `--cpu-quota=<value>` | Microseconds per `--cpu-period` of guaranteed CPU access. Use `--cpus` instead |
| `--cpuset-cpus` | The **specific CPUs or cores** a container can use, e.g. `0-3` or `1,3` |
| `--cpu-shares` | **Relative weight**, default **1024**. Enforced **only when CPU cycles are constrained**: with plenty of CPU, all containers use as much as they need |

:::note[Ex. 4: limit resource utilization]
```bash
docker run --name fullcpu -d alpine dd if=/dev/zero of=/dev/null
docker run --name halfcpu -d --cpus=.5 -m 100m alpine dd if=/dev/zero of=/dev/null
```
The first one takes the CPU to 100%, the second stops at 50%: check it with `docker stats`. `alpine` is a minimal image of only 5 MB.
:::

## Inspecting Containers

Getting information about a container is of paramount importance, especially in production.

| Command | Purpose |
| --- | --- |
| `docker exec <id> env` | Environment variables defined in the container |
| `docker inspect <id>` | All container details, in JSON |
| `docker inspect -f '{{ .NetworkSettings.IPAddress }}' <id>` | Filters a field with a **Go template** |
| `docker logs <id>` | The command output, as it would appear in a terminal. Options: `--follow`, `--details`, `--tail 5`, `--timestamps` |

## Persistent Storage

Data can be stored in the **writable layer** of a container, but there are downsides:

- Data **will not persist** when the container is removed.
- It is **difficult to get the data out** if another process needs it.
- The writable layer is **coupled to the host** where the container runs.
- It requires a **storage driver** providing a **union filesystem**, which **reduces performance** compared to data volumes, which write directly to the host filesystem.

The MySQL exercise (Ex. 3) shows it: you create a database, remove the container, create an identical one, and the data is gone.

Docker offers three ways to persist data. **The main difference is where the data lives on the Docker host.**

![](../../../../assets/cloud-computing/docker-volumi.png)

| Type | Where data lives | Managed by | When to use it |
| --- | --- | --- | --- |
| **Volume** | A part of the host filesystem **managed by Docker** (`/var/lib/docker/volumes/` on Linux). Non-Docker processes should not modify it | Docker | **The preferred way** to persist data |
| **Bind mount** | **Anywhere** on the host. Non-Docker processes and containers can modify it | The user | Sharing files with the host, e.g. `/my/own/datadir` on `/var/lib/mysql` |
| **tmpfs** | **Host memory only**, never written to the filesystem | Docker | **Non-persistent state** or **sensitive information** |

### Volumes

- Created and managed by Docker: explicitly with `docker volume create`, or by Docker at container creation.
- The related directory is mounted into the container, like a bind mount, but managed by Docker and **isolated from the core functionality of the host**.
- A volume can be **mounted into multiple containers** at the same time.
- A volume can be **named or anonymous**.
- Volumes support **volume drivers** (plugins) to store data on remote hosts or cloud providers.

### Bind Mounts

- The **oldest** type, with limited functionality compared to volumes.
- A file or directory on the host is mounted into a container, **referenced by its path**.
- The file or directory is **created on demand** if it does not exist.
- Can be **performing**, but rely on the host having a **specific directory structure**.
- The **Docker CLI cannot manage** them: you define the bind but cannot create or remove it.
- The container can **modify the host filesystem**: **security issues**.

### tmpfs Mounts

A tmpfs mount is **not persisted on disk**, either on the host or in the container. It is used during the container's lifetime for non-persistent state or sensitive information.

### Mount Rules

| Situation | Result |
| --- | --- |
| **Empty volume** mounted on a container directory with files | The files are **copied into the volume** |
| A volume that **does not exist** | An **empty volume is created**. The host-side directory is typically owned by `root:root`, because the daemon (traditionally running as root) creates it |
| **Bind mount or non-empty volume** on a directory with files | The files are **obscured**: not removed or altered, but **not accessible** while the mount is in place |

### Specifying a Volume

In `docker run` both `-v` and `--mount` can be used, with the same behavior. `--mount` takes comma-separated `<key>=<value>` pairs:

- `type`: `bind`, `volume` or `tmpfs`. It can be omitted for managed volumes.
- `source` (or `src`): the volume name. Omitted for anonymous volumes.
- `destination` (or `dst`, `target`): the path in the container.
- `readonly`: mounts the volume read-only.

```bash
docker run -d -it --name=nginxtest \
  --mount source=nginx-vol,destination=/usr/share/nginx/html \
  nginx:latest
```

```bash
docker run -d -v my-vol:/var/lib/mysql mysql/mysql-server:8.0.20   # named volume
docker run -it -v "$(pwd)/es-python:/app" adreeve/python-numpy python ./app/es-python.py   # bind mount
```

`$(pwd)` returns the absolute path of the current directory. `-v` is the compact notation.

:::note[Beyond the slides: one difference between -v and --mount]
With a bind mount on a host directory that does not exist, `-v` creates it, while `--mount` returns an error. The slides' "created on demand" is the `-v` behavior.
:::

| Command | Purpose |
| --- | --- |
| `docker volume create <name>` | Create |
| `docker volume ls` | List |
| `docker inspect <name>` | Details |
| `docker volume rm <name>` | Remove |
| `docker volume prune` | Remove unmounted volumes |

### Volume Drivers

In production, with a **multi-host infrastructure** and containers subject to relocation, the base volume technology **falls short**. Docker provides an extensible architecture based on third-party plugins called **drivers**: Local Persist, Azure file storage, Flocker, GlusterFS, OpenStorage, gce-docker, Ceph RBD, Fuse derivatives.

## Docker as a Development Tool

Docker provides images to compile and run without installing anything on the host: a bind mount on the project is enough.

```bash
# Ex. 6: compile with Maven
docker run --rm -v "$(pwd)/es-micro:/app" -w /app maven:3.5-jdk-8 \
  mvn clean install -Dmaven.test.skip=true

# Ex. 7: run the jar
docker run --rm -p 8080:8080 -v "$(pwd)/es-micro:/app" -w /app/target maven:3.5-jdk-8 \
  java -jar ./micro-0.0.1-SNAPSHOT.jar
```

`-w` sets the working directory, `--rm` removes the container when done. Then visit `http://localhost:8080/measure/temperature`.

## Worked Exercises

**MySQL with a volume** (Ex. 3 and 4):

```bash
docker volume create my-vol
docker run -d --name mysql-server -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD='cloud' -e MYSQL_ROOT_HOST='%' \
  -v my-vol:/var/lib/mysql mysql/mysql-server:8.0.20
docker exec -it mysql-server bash   # then: mysql -uroot -p
```

After removing the container and creating a new one with the same volume, the database is still there.

**Share a file with the host** (Ex. 5):

```bash
docker run -it --rm -v "$(pwd)/shared:/mnt/shared" alpine ash
# inside the container
echo "Laboratorio di CC" >> /mnt/shared/cloud.txt
```

Alpine comes without `bash`, so `ash` is used. After the container is removed, the file is still in the host folder.

## Self-Test

**1.** What is the difference between a hard limit and a soft limit?

<details>
<summary>Solution</summary>

A **hard limit** can never be exceeded. A **soft limit** lets the container use what it needs, and is enforced only under contention on the host.

</details>

**2.** When does `--cpu-shares` take effect?

<details>
<summary>Solution</summary>

Only when CPU cycles are constrained. With plenty of CPU, all containers use as much as they need.

</details>

**3.** What are Docker's three storage types, and where does the data live?

<details>
<summary>Solution</summary>

**Volume**: in the host area managed by Docker. **Bind mount**: anywhere on the host. **tmpfs**: in host memory only.

</details>

**4.** Why are volumes preferred to bind mounts?

<details>
<summary>Solution</summary>

They are managed by Docker, isolated from the host, independent of its directory structure, and support drivers for remote storage. They are also safer, since a bind mount lets the container modify the host filesystem.

</details>

**5.** You bind mount a host folder on `/usr/share/nginx/html`, which contains files in the image. What happens to those files?

<details>
<summary>Solution</summary>

They are **obscured**: not removed, but not accessible while the mount is in place. With an **empty volume**, instead, they would have been copied into the volume.

</details>

**6.** When would you use tmpfs?

<details>
<summary>Solution</summary>

For non-persistent state or sensitive information that must not be written to disk.

</details>

**7.** List the downsides of storing data in the container's writable layer.

<details>
<summary>Solution</summary>

Data does not persist when the container is removed, it is hard to get out, the layer is coupled to the host, and the union filesystem is slower than volumes.

</details>

## Glossary

- **Hard / Soft limit** - Unbreakable limit, and limit enforced only under contention.
- **CFS** - Completely Fair Scheduler, the Linux CPU scheduler.
- **Volume** - Persistent storage managed by Docker.
- **Bind mount** - Host path mounted into the container.
- **tmpfs** - In-memory, non-persistent mount.
- **Union filesystem** - Layered filesystem provided by the storage driver.
- **Volume driver** - Plugin to store volumes on remote storage.
- **docker inspect** - Command showing the details of a Docker object.
