---
title: Past Partial Exam
description: A first partial exam from a previous year, with explained solutions and model answers for the open questions.
sidebar:
  order: 2
---

:::note[About this exam]
This is the first partial exam of a previous year. The format was different from this year's (14 multiple-choice questions instead of 10, plus 2 open questions), and a few topics have changed:

- **Docker Swarm**, REST, caching and microservices appear in it. This year Swarm is replaced by Kubernetes, and the microservices slides are not available yet, so those questions have **no matching page in these notes**. Their solutions are marked **Not in the notes** and are based on general knowledge.
- Theory on virtualization, AWS, Auto Scaling, PaaS and Serverless does not appear here, but it is part of this year's program.
:::

## Multiple-Choice Questions

**1.** Docker-compose is:

- a. A Docker API that simplifies the definition and management of multi-host applications
- b. A file that defines a multi-container and multi-host application
- c. A Docker API that simplifies the definition and management of multi-container applications by implementing a declarative service model
- d. A CLI to manage a container abstraction called service

<details>
<summary>Solution</summary>

**c.** The keywords are **multi-container** and **declarative**. Compose runs multi-service applications on a **single node**, so a and b are wrong ("multi-host"). d describes `docker service`, the Swarm CLI. See [Docker: Compose](../../laboratorio/05-docker-compose/#docker-compose).

</details>

**2.** In Docker, the term "Container Network Model" or CNM refers to... (pick the right answer)

- a. A library that provides services for the creation of virtual networks to connect containers
- b. A service that allows you to describe a network by means of a blueprint
- c. A technology that implements virtual network interfaces of type veth
- d. An abstraction that describes at a high level the basic elements of a network and their life-cycle

<details>
<summary>Solution</summary>

**d.** The CNM is a **specification**: sandbox, endpoint, network and cluster. Option a describes **libnetwork**, which *implements* the CNM, and c describes a veth, one possible *implementation* of an endpoint. See [Docker: Networking](../../laboratorio/04-docker-networking/#container-network-model).

</details>

**3.** What are the more relevant implications of caching?

- a. Caching enhances applications' modularity and deployability
- b. Caching reduces latency and network traffic
- c. Caching makes an application network and human compliant
- d. Caching reduces memory and CPU usage

<details>
<summary>Solution (not in the notes)</summary>

**b.** A cache keeps a copy of the data closer to whoever uses it, so requests are answered faster and fewer of them travel over the network. It does not reduce memory usage: it uses memory to store the copies.

</details>

**4.** In Docker, when do you need to use an OVERLAY network?

- a. When Docker is installed as a dependency of a key-value database
- b. When containers on different hosts have to communicate with each other
- c. When containers in the same VM of a cluster have to communicate with each other
- d. When Docker runs in swarm mode

<details>
<summary>Solution</summary>

**b.** The overlay driver creates a **distributed network among multiple Docker hosts**. Containers on the same host (c) only need a bridge. Swarm does use overlay networks (d), but the *need* is cross-host communication. See [Overlay Mode](../../laboratorio/04-docker-networking/#overlay-mode).

</details>

**5.** Which among these features are NOT essential for cloud computing as defined by NIST? (two answers)

- a. Measured services
- b. Rapid elasticity
- c. Broad network access
- d. Resource pooling
- e. Security
- f. On-demand self-service
- g. Customization service

<details>
<summary>Solution</summary>

**e and g.** The five essential characteristics are on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service. See [Essential Characteristics](../../teoria/01-introduzione-al-cloud/#essential-characteristics).

</details>

**6.** In Docker the term Copy-on-write refers to the fact that... (pick the right answer)

- a. The docker filesystem is read-only and shared across various containers
- b. Each container creates a writable layer of the filesystem
- c. When a container modifies a file, this is written to the outermost layer of the filesystem
- d. A new layer is created every time a command is executed in a dockerfile

<details>
<summary>Solution</summary>

**c.** Copy-on-write: when a container changes a file, it is **copied into its writable layer** (the outermost one) and changed there. Options a, b and d are true facts about the layered filesystem, but none of them *is* copy-on-write. See [Copy-on-Write Strategy](../../laboratorio/01-docker-introduzione/#copy-on-write-strategy).

</details>

**7.** One of the following statements about Docker in swarm mode is FALSE, which one?

- a. It implements an API to perform the "scale up" and "scale down" of the services
- b. It internally implements load balancing and distributed DNS functions
- c. It internally implements an API to update services running in groups
- d. It manages machine clusters by defining a multi-level pyramidal structure of roles

<details>
<summary>Solution (not in the notes)</summary>

**d.** Swarm has only **two roles**: **manager** nodes, which keep the cluster state and schedule services, and **worker** nodes, which run the containers. There is no multi-level pyramid. The other statements are true: `docker service scale`, internal load balancing and DNS, rolling updates with `docker service update`. The same ideas exist in [Kubernetes](../../laboratorio/06-kubernetes/#architecture), with control plane and worker nodes.

</details>

**8.** Which of the following statements on volumes in Docker is FALSE?

- a. Some volumes are managed directly by Docker
- b. A plugin system is used in Docker to allow you to manage volumes even in the cloud
- c. The data in a volume are deleted when the container is removed
- d. Volumes can be directories on the file system and storage areas on the host machine's memory

<details>
<summary>Solution</summary>

**c.** Volumes exist precisely so that data **survives** the container. a is true (managed volumes), b is true (volume drivers), d is true (bind mounts and volumes on disk, tmpfs in memory). See [Persistent Storage](../../laboratorio/02-docker-risorse-e-storage/#persistent-storage).

</details>

**9.** What statement is INCORRECT? The adoption of the REST style can be relevant to...

- a. Promote decomposition
- b. Increase comprehensibility
- c. Simplify management
- d. Enable automatic composition

<details>
<summary>Solution (not in the notes)</summary>

**d.** REST splits a system into resources with a uniform interface, which helps decomposition, understanding and management. It does not describe the *meaning* of services in a machine-readable way, so it does not by itself enable **automatic** composition.

</details>

**10.** Which is the WRONG statement about stateless requests?

- a. There is no application state since all information required by a resource is in the request
- b. Server does not use information from previous requests
- c. Client maintains application state
- d. Stateless applications can be easily load-balanced, partitioned, scaled, cached

<details>
<summary>Solution (not in the notes)</summary>

**a.** Stateless does not mean that there is no application state: it means the **server** keeps no session state, and the **client** holds it (c) and sends what is needed with every request. This is why any server replica can answer (d), the same idea as [stateless layers](../../teoria/05-auto-scaling/#from-monolith-to-layered-architecture) in Auto Scaling.

</details>

**11.** Which statement better represents the properties and benefits of the hybrid cloud?

- a. The hybrid cloud combines different cloud deployment models
- b. The hybrid cloud provides secure virtualized environment so that sensitive data can be processed in public cloud
- c. The hybrid cloud combines company's legacy non-cloud infrastructure and cloud-based services
- d. The hybrid cloud combines private cloud services and services run in community cloud

<details>
<summary>Solution</summary>

**a.** NIST: a **composition of two or more clouds** (private, community or public) that remain unique entities. c is wrong because legacy non-cloud infrastructure is not a cloud. d is only one possible combination, and the typical one is private-public. See [Deployment Models](../../teoria/01-introduzione-al-cloud/#deployment-models).

</details>

**12.** When a container runs in host mode (`--net=host`)... (pick the right answer)

- a. Its execution is safer because it shares the network interface of the host
- b. It receives an IP address belonging to the same subnet as the host
- c. It shares the network namespace with the host
- d. It only has access to the loopback interface

<details>
<summary>Solution</summary>

**c.** a is the opposite of the truth (host mode has security issues), b is wrong because the container uses the host's own IP, d describes the `none` driver. See [Host Mode](../../laboratorio/04-docker-networking/#host-mode).

</details>

**13.** In which situation would a microservices approach NOT be beneficial? (pick the right answer)

- a. Your organization is not successfully strategizing for such a compartmental design
- b. If your organization is starting directly with microservices, rather than a monolith
- c. All of the above
- d. Members of a development team aren't as knowledgeable

<details>
<summary>Solution (not in the notes)</summary>

**c.** All three are common reasons to avoid microservices: an organization not ready for the design, starting without a monolith to split (it is usually advised to start with a monolith and extract services later), and a team without enough experience.

</details>

**14.** What is elasticity?

- a. The ability to enforce adaptive "autonomic" actions
- b. The ability to run a single instance of the software on a server, serving multiple client organizations
- c. The ability to either handle growing amounts of work in a graceful manner
- d. The ability of a system or component to perform its required functions under stated conditions for a specified period of time

<details>
<summary>Solution</summary>

**a.** Almost word for word from the slides. The distractors are the definitions of neighboring concepts: c is **scalability**, d is **reliability**, b is **multi-tenancy**. See [Scalability and Elasticity](../../teoria/02-proprieta-e-caratteristiche/#scalability-and-elasticity).

</details>

:::tip[What this exam teaches]
Look at the wrong options: they are often **true statements about something else** (questions 2, 6, 14). Knowing which keyword belongs to which concept is what makes the difference.
:::

## Open Questions

### 1. Comment on the docker-stack.yml Below

The original file is not available. A **stack file** is a Compose file deployed on a Swarm cluster with `docker stack deploy -c docker-stack.yml <name>`. Comment it with the same method as [Compose files](../#how-to-comment-on-a-compose-file), plus the Swarm-specific keys.

:::note[Beyond the slides: what changes in a stack file]
An illustrative example, not the original exam file:

```yaml
services:
  web:
    image: myuser/web:1.0
    ports:
      - "80:8000"
    networks:
      - front
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
      resources:
        limits:
          cpus: "0.5"
          memory: 256M
  db:
    image: postgres:16
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - front
    deploy:
      placement:
        constraints:
          - node.role == manager

networks:
  front:
    driver: overlay

volumes:
  db_data:
```

| Element | Comment |
| --- | --- |
| `image` | Mandatory in practice: `build` is **ignored** by `docker stack deploy`, so images must be built and pushed first |
| `deploy.replicas: 3` | Three tasks (containers) of the service, spread across the cluster nodes |
| `ports` | Published through Swarm's routing mesh: any node answers on port 80 and balances among replicas |
| `update_config` | Rolling update: one replica at a time, 10 seconds apart |
| `restart_policy` | Swarm restarts a task only if it fails |
| `resources.limits` | Each replica gets at most half a CPU and 256 MB |
| `placement.constraints` | The database runs only on a manager node, so its local volume stays on the same machine |
| `driver: overlay` | A network spanning all the cluster's hosts, needed because replicas run on different nodes |
| `db_data` | Named volume, local to the node where `db` runs |

:::

If this year's exam has a similar question, it will most likely be about a Compose file, or a Kubernetes manifest.

### 2. Microservices

> Provide a concise description of the microservices principles and architecture. Discuss the issues of data management and scalability in comparison with the monolithic architecture.

:::caution[Not in the notes yet]
The microservices slides are not available yet. This model answer is built from an answer found together with the exam, translated and reorganized. Check it against the slides when they arrive.
:::

<details>
<summary>Model answer</summary>

**Architecture.** A microservices architecture splits an application into **small, independent services**, each implementing a **specific business function** and communicating with the others through **well-defined APIs**, typically over the network.

**Principles.**

- **Decentralization**: each service is developed, deployed and scaled independently.
- **Autonomy**: each service owns its data (**database per service**) and can be developed by a separate team, with faster development cycles.
- **Resilience**: the failure of one service does not necessarily bring down the whole system.
- **Independent scalability**: each service is scaled according to its own load, for better resource usage.
- **Continuous integration and delivery**: small services allow faster and more frequent releases.
- **Isolation**: changes and faults in one service do not affect the others.

**Data management issues, compared to a monolith.** A monolith has a single database, with local transactions and immediate consistency. With microservices:

- **Consistency** across services that own separate databases is hard to guarantee, and often becomes eventual consistency.
- **Data duplication**: the same data may be replicated in several services.
- **Distributed transactions**: an operation spanning several services cannot rely on a single database transaction.

**Scalability issues, compared to a monolith.** A monolith can only scale as a whole, replicating everything even if only one function is overloaded. Microservices scale each service independently, but:

- **Communication and coordination overhead** grows with the number of services.
- **Service discovery** becomes essential to find where each service runs.
- **Operational complexity**: deploying and monitoring many services is harder than managing one application.

**Conclusion.** Microservices offer more flexibility, agility and fine-grained scalability, at the cost of more complex data management and operations. The choice depends on the requirements and on the organization.

</details>
