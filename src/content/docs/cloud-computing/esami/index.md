---
title: Exam Preparation
description: Exam structure, method to comment on Dockerfiles and Compose files, common mistakes and review checklist.
sidebar:
  order: 1
---

## How the Exam Works

The written exam covers **lectures and lab**, with questions on concepts and simple exercises asking to describe a solution or a technology.

| Part | Questions | Points |
| --- | --- | --- |
| Multiple choice | 10 × 2 points | 20 |
| Open questions | 2 × 4 points | 8 |
| **Total** | | **28** |

Full rules and dates are on the [course page](../).

The official examples show that at least one kind of open question is: **"Comment adequately on the following DOCKERFILE / DOCKER COMPOSE file"**. On e-learning there are also self-assessment quizzes (Virtualization, Cloud Computing, IaaS, PaaS, Serverless) and a sample of mixed questions, which covers another course and is only useful to see the format.

## How to Comment on a Dockerfile

The method of the official solutions is **line by line**: for each instruction, say **what it does**, **when it acts** (build or run) and **any consequences**. Translating the instruction name is not enough.

1. **Comments and directives**. Lines starting with `#` are ignored, but `# syntax=...` on the first line is a **parser directive** that selects the Dockerfile frontend.
2. **Stages**. Count the `FROM`s: more than one means multi-stage. The final stage is the last one, and a `FROM` inherits from a previous stage only if it names it.
3. **What runs at build time and what at start**. `RUN` acts at build time, `CMD` and `ENTRYPOINT` configure the start.
4. **Points of attention**. Close with what the file does *not* do: without `USER` it runs as root, a commented instruction has no effect, external files must be in the context.

:::note[Sample comment]
Given this Dockerfile, inspired by the official examples:

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

| Line | Comment |
| --- | --- |
| `# syntax=` | Not an ordinary comment: a directive that selects the frontend |
| `FROM` | Starts from Alpine 3.24, single stage |
| `RUN` | At **build time**, installs certificates without keeping the package index |
| `ARG` | Makes the target platform available **at build time**: it is not a runtime environment variable |
| `COPY` | Copies from the context the binary already compiled for that platform: there is no compilation in the file |
| `EXPOSE` | **Documents** port 80, which must still be published with `-p` |
| `VOLUME` | Declares a mount point. Without an external mount, Docker creates an **anonymous** volume |
| `ENTRYPOINT` | Starts `/app` in exec form, and `docker run` arguments are appended to it |

:::

### Details That Make the Difference

| Instruction | What to point out |
| --- | --- |
| `ADD` | Unlike `COPY`, it unpacks local tar archives |
| `COPY . dest` | Copies from the context, respecting `.dockerignore` |
| `COPY --from=x` | Copies from a stage or an image, not from the context |
| `FROM scratch` | Empty image: no programs or libraries inherited |
| `FROM img AS name` | Names the stage: by itself it does not make the build multi-stage |
| `--mount=type=cache` | BuildKit cache: its content does not end up in the layer |
| `ENV` | Persists in the image, can be overridden with `docker run -e` |
| `USER` | Applies to following `RUN`s and to the runtime process. Creating a user does not mean switching to it |
| `STOPSIGNAL` | Signal sent by `docker stop`, e.g. for a graceful shutdown |
| `ONBUILD` | Registers an instruction for child images, never at container start |
| `RUN ... \` | Backslashes continue **a single instruction**, which produces a single layer |
| `RUN <<EOF` | Heredoc: a multi-line script in one instruction |

## How to Comment on a Compose File

Same method, element by element, service by service.

1. **Overall structure**: which services, networks and volumes. With no networks, everything is on the project's default network.
2. **Each service**: image or build, ports, volumes, environment, dependencies, restart.
3. **Communication**: who sees whom, based on networks. Services reach each other by name.
4. **Points of attention**: `depends_on` does not wait for readiness, plain-text passwords, non-persisted data, exposed Docker socket.

:::note[Sample comment]
Given this file, the Lab 6 exercise:

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

| Element | Comment |
| --- | --- |
| `image` | Image with no tag, so implicitly `latest` |
| `container_name` | Fixes the name: the service **cannot be scaled** |
| `command` | Overrides the image's `CMD`. The `ENTRYPOINT` stays |
| `ports` | Publishes host port 9090 to container port 9090 |
| `restart` | `unless-stopped`: restarts, unless manually stopped |
| `./prometheus:...` | Read-write **bind mount**, for the configuration |
| `prom_data:...` | **Named volume** managed by Docker, for the data. Survives `down`, not `down -v` |
| `volumes` at the bottom | Declares the volume. Its real name has the project prefix |

:::

### Details That Make the Difference

| Element | What to point out |
| --- | --- |
| `ports` | Host on the left, container on the right |
| `expose` | Does not publish on the host, and is not a firewall |
| `./dir:/path` | Bind mount |
| `name:/path` | Named volume, to be declared under `volumes` |
| `/path` alone | Anonymous volume. Typical: `/usr/src/app/node_modules`, so the code bind mount does not hide it |
| `read_only: true` | Applies to that mount, not the whole container |
| `depends_on` | Startup order, not readiness |
| `build: target` | Selects a Dockerfile stage |
| `stdin_open: true` | Like `docker run -i`, without allocating a terminal |
| `/var/run/docker.sock` | Gives access to the daemon: **very high power** |
| `${VAR}` | Substituted by Compose, not inside the container |
| `cap_add: NET_ADMIN` | Adds Linux privileges beyond the defaults |
| `ipv4_address` | Static IP, must be within the network's subnet |
| `version` | Historical field, now obsolete |

:::tip[Topologies with several networks]
If the file has several networks, draw who is where. A service on two networks talks to both, but **does not act as a router**: services on different networks cannot see each other.
:::

## Mistakes to Avoid

The official solutions end with these points, the most common misconceptions:

- `RUN` acts at **build time**, `CMD` and `ENTRYPOINT` configure the **start**.
- `COPY` reads from the **build context**, not from the Dockerfile's directory. `COPY --from` reads from a stage or an image.
- `EXPOSE` **documents**: publishing needs `-p`.
- `VOLUME` declares a mount point: name and host path come at runtime.
- `ARG` is a build parameter, `ENV` persists in the image. **Neither is suitable for secrets**.
- `ONBUILD` acts in child builds. A commented `USER` has no effect.
- A new `FROM` starts a stage, and inherits from a previous one only if it names it.

## Review Checklist

**Theory**

- [ ] NIST definition: 5 characteristics, 3 service models, 4 deployment models
- [ ] Who manages what in IaaS, PaaS, SaaS, and enabling techniques
- [ ] AZ vs region
- [ ] SLA, SLO, QoS, and cloud-based vs application-based SLA
- [ ] Scalability and elasticity, vertical and horizontal
- [ ] Under- and over-provisioning
- [ ] The 4 actions of fault tolerance
- [ ] Emulation vs virtualization; full, para and OS-level
- [ ] Rings, trap-and-emulate, binary translation, hardware-assisted
- [ ] Shadow page tables and EPT/NPT, device emulation, VirtIO and SR-IOV
- [ ] Bare-metal and hosted hypervisors
- [ ] EC2, S3, EBS, ephemeral and persistent resources, pricing options
- [ ] Auto scaling loop, alarm states, policy types, cooldown
- [ ] Web and worker roles, throttling, lock-in
- [ ] Serverless, FaaS, cold start, anti-pattern

**Lab**

- [ ] Namespaces and cgroups
- [ ] Layers and copy-on-write
- [ ] Basic commands and container lifecycle
- [ ] Hard and soft limits
- [ ] Volume, bind mount, tmpfs
- [ ] Dockerfile instructions, ENTRYPOINT and CMD
- [ ] Multi-stage builds
- [ ] CNM and network drivers, DNS on user-defined networks
- [ ] Compose and `depends_on`
- [ ] Kubernetes architecture, desired state, Pods and Services
