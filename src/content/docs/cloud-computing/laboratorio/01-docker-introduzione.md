---
title: "Docker: Introduction"
description: Lab 1 - why containers, namespaces and cgroups, images and layers, copy-on-write, Docker architecture and basic commands.
sidebar:
  order: 1
---

:::note[Environment setup]
The lab runs in a **Linux VM** (Ubuntu 24.04 recommended, 2 vCPUs, 4 GB RAM, 25 GB disk), created with Multipass or VirtualBox, with **Docker Engine installed inside the VM**. Docker Desktop directly on the laptop is discouraged, because it does not provide the environment some exercises need. Adding your user to the `docker` group avoids `sudo`, but grants administrative privileges on the VM.
:::

## Virtualization Recap

**Virtualization** is the emulation of hardware and software components by a different system, to run a single application (or a complete OS) **as if it had a particular physical machine at its disposal**. A **virtual machine** provides a complete emulated hardware platform; the physical resources are shared among several VMs, each with its own OS, created and managed by a **hypervisor** (VMM). The hypervisor is a software layer underneath the virtualized OSes that shares **CPU, memory, storage and network** so that each VM sees them as dedicated. See [Virtualization](../../teoria/03-virtualizzazione/).

### Performance Ain't Cheap

A VM gives **strong isolation** by intercepting hardware-sensitive operations, but that abstraction **has a cost**:

| Cost | Why |
| --- | --- |
| **CPU** | Trap-and-emulate or binary translation handles sensitive instructions |
| **Memory** | Shadow page tables or EPT/NPT maintain a second translation layer |
| **I/O** | Device emulation, paravirtual drivers or SR-IOV trade portability for speed |

Modern hardware reduces the overhead, but **the VM abstraction is never free**.

### VMs Aren't a Good Fit for Microservices

With a monolithic or multi-tier deployment on VMs, each VM hosts one component (load balancer, frontend, application services, database, cache). Isolation is strong, but **every VM carries a full guest OS**: hardware usage is not optimal and scaling happens at the granularity of a whole VM. For **microservices** this is a problem:

- **Coarse isolation boundary**: the VM isolates well, but is too large a unit for a single lightweight service.
- **Large scaling unit**: scaling a service means replicating a whole VM with its guest OS.
- **Per-VM operational overhead**: patching, monitoring and updates multiply for every machine.
- **Resource waste**: duplicated guest OSes consume CPU, memory and disk, reducing deployment density.

## What's a Container?

Think of a container as a **pre-packed suitcase for software**: it bundles an application with **everything it needs to run** (libraries, tools, settings), so it **works the same on any machine**. Everything specific to the app stays inside the container; everything outside stays clean and standardized.

- **Isolates** the application (security and resource sharing).
- **Lightweight**: containers **share the same OS kernel**.
- Works with Linux and Windows Server.

![](../../../../assets/cloud-computing/docker-vs-vm.png)

| | Container | Virtual machine |
| --- | --- | --- |
| **Contains** | App and libraries, **no kernel** | A full guest OS |
| **Processes** | Usually **one** | Several other processes besides the app |
| **Disk** | Shared layers | A virtual disk (a file) with a full OS |
| **Start** | Immediate | OS boot |
| **Isolation** | Isolated process on the same kernel | Strong, through the hypervisor |

:::tip[What's Docker?]
**Docker** is an open-source project that **automates the deployment of applications inside software containers**, providing an additional layer of abstraction and automation of **operating-system-level virtualization on Linux**. *Docker* (nautical) means port worker.

Goal: uniform software packaging and execution, **"Build, Ship and Run Any App, Anywhere"**. Like shipping containers, the container is always the same regardless of its contents, so it fits on all trucks, cranes and ships.
:::

## Linux Containers: Restricted Processes

The key concept: **a container is not a separate operating system, it is a restricted process running on the host's shared kernel**.

![](../../../../assets/cloud-computing/linux-container.png)

The Linux kernel provides the tools:

| Mechanism | Purpose | What it covers |
| --- | --- | --- |
| **Namespaces** | Resource **isolation**: provide processes with **their own system view** | `pid` (processes), `net` (networks), `mnt` (mount points, fs), `uts` (hostname), `ipc` (semaphores), `user` (UIDs) |
| **Control groups (cgroups)** | Resource **limitation and monitoring**, and device access control | Memory, CPU, block I/O, network |
| **Seccomp** | Filters the system calls a process can use | System calls |
| **Chroot / pivot_root** | Changes the root filesystem | Private directory |

:::tip[How to remember it]
**Namespaces** decide **what a process can see**, **cgroups** decide **how much it can use**.
:::

## Images and Containers

| Concept | Meaning |
| --- | --- |
| **Image** | A **read-only template** used to create containers: application code, libraries and dependencies. Stored in Docker Hub or another registry. **Images can be built upon other images** |
| **Container** | A **running instance of an image**: an application in isolated, **ephemeral** execution, self-contained, **based on and linked to one image**. Lightweight and portable |
| **Container registry** | A repository for **storing and distributing images**, enabling sharing and versioning. Public or private |
| **Container runtime / engine** | Software that **creates and runs containers** and manages their lifecycle, exposing APIs or a CLI |

The relation is like class and object, or [AMI and instance](../../teoria/04-amazon-aws/#image-vs-instance): many containers are created from one image.

### Layered File System

Containers' virtual disks contain file systems created by **sewing different layers together**:

![](../../../../assets/cloud-computing/container-filesystem.png)

- A virtual disk is **immutable**: it cannot be changed.
- Its file system is made of several **immutable layers**, each a file containing a piece of a file system (like zip files).
- A layer **can be shared among images** (good idea!), and several containers can be created from the same image: **sharing is caring**.
- A container is **linked** to its virtual disk, **no copy is involved**, so it **starts immediately**.
- Each container has a **thin writable layer** on top of the image file system, to implement changes. The **R/W layer exists only for containers**; read-only layers belong to both images and containers.

### Copy-on-Write Strategy

![](../../../../assets/cloud-computing/copy-on-write.png)

- If a file is changed **during the image creation**, a **new layer** with the modified file is created.
- When you start a container, a **thin writable container layer** is added on top of the other layers.
- If a file is changed during the **life-cycle of a container**, it is stored in the **mutable container-specific layer**: all the container's changes go there, and the copy hides the underlying one.
- Files the container does not change **are not copied**, which keeps the writable layer **as small as possible**.

When the container is removed, its writable layer disappears: this is why [volumes are needed](../02-docker-risorse-e-storage/#persistent-storage).

## Docker Architecture

**Docker Engine** is a **client-server** application with three major components:

- A **server**, a long-running **daemon** process (the `dockerd` command).
- A **REST API** that programs use to talk to the daemon and instruct it.
- A **command line interface (CLI)** client (the `docker` command).

The CLI uses the REST API to control the daemon, through scripting or direct commands. The daemon **creates and manages Docker objects**: images, containers, networks and volumes. Client and daemon can run on the **same system or on different ones**, and communicate via REST over **UNIX sockets or a network interface**.

![](../../../../assets/cloud-computing/docker-architettura.png)

A **Docker registry** stores images. **Docker Hub** is the public default, and you can run your own **private registry**.

### Going Deeper

The user always works through the CLI, which talks to Docker Engine. Beneath it, two key components operate:

![](../../../../assets/cloud-computing/docker-engine-interno.png)

| Component | Role |
| --- | --- |
| **containerd** | The daemon that manages the **entire container lifecycle**: pulls and stores images, prepares the filesystem, configures networking, supervises running containers. It **does not create containers directly**, but coordinates the component that does |
| **runc** | The **low-level runtime**, compliant with the **OCI** (Open Container Initiative) standard. It **actually creates and runs** the container, using **namespaces and cgroups** |

## Main Commands

`docker run` does everything at once: looks for the image locally, **pulls** it from the registry if missing, **creates** the container and **starts** it.

```bash
docker run -d --rm -it --name web -p 8081:80 nginx:latest
```

| Option | Meaning |
| --- | --- |
| `-d` | Detached: runs in the background |
| `--rm` | Removes the container when it exits |
| `-it` | Interactive with a terminal: `-i` keeps stdin open, `-t` allocates a terminal |
| `--name` | Names the container |
| `-p 8081:80` | **Publishes** container port 80 on host port 8081 |
| `nginx:latest` | Image name and **tag**. The tag is not necessary |

:::caution[Port order]
In `-p 8081:80` the **host** is on the left and the **container** on the right: the rule is `host:container`.
:::

| Command | Purpose |
| --- | --- |
| `docker --version` / `docker --help` | Version and help. `docker <command> --help` for each command |
| `docker search ubuntu` | Search images. Filters: `--filter is-official=true`, `--filter stars=100`, `--limit 5` |
| `docker pull alpine:3.9.4` | Download an image |
| `docker images` / `docker image ls` | List images. `-a` all, `-q` IDs only, `--no-trunc` full IDs |
| `docker ps` / `docker container ls` | List running containers. `-a` all, `-s` with disk size |
| `docker stats <id>` | Live resource usage |
| `docker exec <id> <cmd>` | Run a command in a running container |
| `docker top <id>` | Processes running inside the container |
| `docker rmi <img>` / `docker image rm` | Delete a local image |

With `docker exec`, an interactive shell needs both options: `docker exec -it <id> bash`. Without `-i` you cannot type, without `-t` you have no terminal, and with `-d` the command runs in the background.

### Container Lifecycle

![](../../../../assets/cloud-computing/container-lifecycle.png)

| Command | Effect |
| --- | --- |
| `docker create` | Creates a container **but does not start it** |
| `docker run` | Creates **and starts** a container |
| `docker start` / `stop` | Starts / stops the container |
| `docker restart` | Stops and then starts a container |
| `docker pause` / `unpause` | Suspends / un-suspends all processes. **The resources are not released** |
| `docker kill` | Sends the **SIGKILL** signal |
| `docker rm` | Removes a stopped/killed container. `-f` / `--force` also removes a running one |

:::tip[Useful solutions]
- **Remove all images with a single command** (Ex. 18): `docker rmi $(docker images -q)`.
- **Ex. 4** (pull `alpine:3.9.4`, then `miciav/micro:0.0`): the second pull does not download the shared layer again. Layers are identified by their content, and Docker only downloads the ones it does not already have.
:::

:::note[Default resources]
Processes belonging to containers are **exactly like other processes** in user space: by default they **see all the available memory** and **have access to all CPUs** without limitation. How to limit them is in the [next lab](../02-docker-risorse-e-storage/#limiting-resources).
:::

## Self-Test

**1.** What are namespaces and cgroups, and how do they differ?

<details>
<summary>Solution</summary>

Both are Linux kernel features. **Namespaces** isolate, giving a process its own view of processes, network, filesystem, hostname, IPC and users. **Cgroups** limit and monitor resources such as CPU, memory, block I/O and network.

</details>

**2.** What is the difference between an image and a container?

<details>
<summary>Solution</summary>

An image is a read-only template made of layers. A container is a running, isolated, ephemeral instance of it, with a thin writable layer on top.

</details>

**3.** Why does a container start immediately?

<details>
<summary>Solution</summary>

There is no OS to boot and the image is not copied: the container links to its layers and only adds a writable layer.

</details>

**4.** What happens when a container modifies a file belonging to an image layer?

<details>
<summary>Solution</summary>

With **copy-on-write**, the file is copied into the container's writable layer and modified there. The copy hides the original, which stays intact in the image.

</details>

**5.** What do containerd and runc do?

<details>
<summary>Solution</summary>

**containerd** manages the container lifecycle, images and networking. **runc** is the OCI runtime that actually creates the container with namespaces and cgroups.

</details>

**6.** Which command creates and starts nginx in the background, publishing container port 80 on host port 8081?

<details>
<summary>Solution</summary>

`docker run -d -p 8081:80 nginx`.

</details>

**7.** What is the difference between `docker stop`, `docker pause` and `docker kill`?

<details>
<summary>Solution</summary>

`stop` stops the container, `pause` suspends its processes while keeping its resources, `kill` sends SIGKILL.

</details>

**8.** Why are VMs not a good fit for microservices?

<details>
<summary>Solution</summary>

Coarse isolation boundary, large scaling unit, per-VM operational overhead, and resource waste from duplicated guest OSes.

</details>

## Glossary

- **Container** - Isolated process sharing the host kernel.
- **Image** - Read-only template used to create containers.
- **Layer** - Immutable piece of an image's file system.
- **Copy-on-write** - Copying a file into the writable layer when it is modified.
- **Registry** - Image repository, such as Docker Hub.
- **Namespace** - Isolated view of a kernel resource.
- **Cgroup** - Resource limitation and monitoring.
- **dockerd** - The Docker daemon.
- **containerd** - Daemon that manages the container lifecycle.
- **runc** - Low-level OCI-compliant runtime.
- **OCI** - Open Container Initiative, the container standard.
