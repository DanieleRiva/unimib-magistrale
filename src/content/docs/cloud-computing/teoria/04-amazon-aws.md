---
title: Deep Dive on Amazon AWS
description: AWS key concepts, S3, EBS, security groups, EC2 images and instances, ephemeral and persistent resources, pricing model.
sidebar:
  order: 4
---

## Amazon AWS Is...

**Amazon Web Services** is a set of **building-block services**, designed to **work independently** but able to **work well together**:

- They share a **common naming convention and authentication**.
- They **minimize internal connections and dependencies**.
- **Every activity** in AWS can be accessed by making a **web service call**: start a server, create a load balancer, allocate an IP address, attach a persistent storage volume.

The three key concepts:

| Service | Role | Idea |
| --- | --- | --- |
| **EC2** | Compute | Runs the software |
| **S3** | Object storage | Stores objects accessible through APIs |
| **EBS** | Block storage | Provides a disk for the virtual machine |

Over time AWS added IaaS functionality, new data centers, enhanced storage solutions, PaaS functionality and partnerships with software companies. The geographic organization is the one already seen: [regions and availability zones](../01-introduzione-al-cloud/#regions-and-availability-zones).

## Storage: S3 and EBS

### S3 - Simple Storage Service

**S3** is an **object storage** solution with a **web interface** (REST, SOAP, BitTorrent).

:::tip[Object store]
An **object store** manages and stores data **as objects**, rather than as files in a file system or blocks in a traditional storage system. Each object has three components:

1. **Data**: the actual content, such as a file, video or image.
2. **Metadata**: descriptive information, like name and creation date.
3. **Unique Identifier**: a key that allows the object to be retrieved **without knowing the location** of the data (e.g., a file path).

Unlike file systems with hierarchical directories, object stores use a **flat address space**: every object is stored at the same level.
:::

S3 facts from the slides:

- Objects up to **5 TB** each.
- Data automatically distributed across a minimum of **three AZs** (**availability**), with automatic data replication (**durability**).
- Can be queried with SQL or processed by Big Data solutions.
- Public since **2006**, used in production for Amazon's e-commerce. 2 trillion objects in 2013.
- **SLA: 99.99% monthly uptime**, no more than about 4 minutes per month of downtime.
- Useful for **backup and recovery, archiving and disaster recovery**.

### EBS - Elastic Block Store

An **EBS volume** is an **addressable disk volume** that can be attached to any running instance (VM) **in the same Availability Zone**, on HDD or SSD. It can be formatted, mounted and used **as if it were a local disk drive**. Volumes have a **lifetime independent of any instance**: a volume persists even when no instances are running. First introduced in 2008, up to 16 TB.

:::tip[Block store]
A **block store** divides data into **fixed-size chunks called blocks**, each identified by an **address** in the volume. The OS or application reads and writes individual blocks, while a file system organizes them into files. It is used by hard drives and SSDs, and in cloud storage.
:::

| | S3 (object) | EBS (block) | EC2 local disk |
| --- | --- | --- | --- |
| **Access** | Web API | Like a disk | Like a disk |
| **Persistence** | Persistent | Persistent | **Ephemeral** |
| **Scope** | Across AZs | One AZ | The instance |
| **Typical use** | Backup, files, archives | Databases, OS | Temporary data |

## Security Groups

A **Security Group** acts as a **virtual firewall** for an EC2 instance. It defines the allowable set of **inbound and outbound** network connections:

- Each group is named and consists of a list of **protocols, ports and IP address ranges**.
- A group can be applied to **multiple instances**, and an instance can have **multiple groups**.
- Example: a rule allowing TCP on port 443 from any IP address enables HTTPS connections to the instance.

:::tip[Important]
Security groups are **stateful**: **response traffic** for an allowed connection is **automatically permitted**.
:::

## AWS Infrastructure Services (Selected Examples)

| Service | What it offers |
| --- | --- |
| **Simple Queue Service (SQS)** | Managed message queues for **asynchronous** communication between components |
| **Relational Database Service (RDS)** | Managed relational databases (MySQL, PostgreSQL) |
| **DynamoDB** | Managed **NoSQL** database, key-value and document models. Complements RDS |
| **ElastiCache** | Managed **in-memory caching** |
| **Elastic MapReduce (EMR)** | Managed distributed data processing (Apache Spark), for big data |
| **Elastic Load Balancing (ELB)** | Distributes incoming traffic across multiple targets, such as EC2 instances |
| **AWS Lambda** | Runs code **in response to events** without managing servers: it is [serverless](../07-serverless/) |

## EC2 - Elastic Compute Cloud

EC2 implements the **programmable data center** metaphor, later called **Infrastructure as Code (IaC)**. You access multiple AZs in multiple regions and provision your virtualized data center **on demand**: servers, OS images, firewall entries, load balancers, IP addresses and disk volumes are available **in seconds**, with a web service request "to the cloud".

### Image vs Instance

| Concept | Meaning |
| --- | --- |
| **Amazon Machine Image (AMI)** | Contains the **operating system** and possibly additional software and application layers (database servers, middleware, web servers). Prebuilt AMIs can be started, and AMIs can be **customized, shared, or even sold**. Each has a **unique ID** (e.g., `ami-bf5eb9d6`) |
| **Instance** | **One running copy of an AMI**. Any number of copies of the same AMI can be launched |
| **Elastic IP Address** | A **static IP address** you allocate and attach to an instance, at most one per instance. When the instance fails, the address is **remapped to another VM** |

:::tip[Analogy with Docker]
AMI is to instance what a Docker **image** is to a **container**: a read-only template and its running copies. The parallel helps with [the lab](../../laboratorio/01-docker-introduzione/).
:::

An instance can run several operating systems, including Linux and Windows Server. When you start an instance you must specify the **instance type**: number of vCPUs, processor model (Intel Xeon, AMD EPYC, AWS Graviton), clock speed, physical cores vs threads.

### Ephemeral Resources

:::tip[Definition]
**Ephemeral resources** only exist **while an instance is running**, and are **lost when the instance stops or terminates**.
:::

**EC2 instances are ephemeral**: in case of failures, stored data and state are generally lost. For production workloads, implement:

- **Redundancy**: multiple instances across availability zones.
- **Failover**: automatic instance replacement.
- **Recovery**: regular backups and automation scripts.

Instances are **best suited for stateless application patterns**.

The **local disk storage** of each instance is ephemeral too: it **remains intact if the instance is rebooted**, but data is **permanently lost when the instance terminates**. Use persistent storage instead: **EBS** for block storage, **S3** for object storage, **EFS** for shared file systems.

### Persistent Resources

**Persistent resources**, once allocated to your account, are expected to **remain operational in the face of transient or permanent hardware or software failures**. Amazon uses **redundancy, automated failover and automatic recovery**. The persistent EC2 resources are:

- Elastic IP Addresses.
- EBS Volumes.
- Elastic Load Balancers.
- Security Groups.
- AMIs stored in S3 or as EBS snapshots.

:::note[EC2 takeaway]
Launch a set of instances from a set of AMIs. Instance types offer a wide range of memory, processing power and local storage. Instances can be launched in any region, optionally in a chosen AZ, attached to persistent storage (EBS, created and attached in the **same AZ**), and associated with any number of security groups.
:::

## EC2 Pricing

The pricing model determines how compute capacity is paid for, and what flexibility you keep.

:::tip[Cost formula]
**Cost = compute usage + related resources and data transfer.**

There is **no single EC2 price**: it depends on the workload, configuration, region and usage pattern.
:::

| Compute configuration | Purchase option | Additional costs |
| --- | --- | --- |
| Instance family and size | On-Demand, Savings Plans, Reserved Instances or Spot | EBS storage and performance |
| Operating system / software | Each trades cost against flexibility | Data transfer and public IPv4 |
| Region and tenancy | | Monitoring and other services |

The main purchasing options:

| Option | How it works | Best for |
| --- | --- | --- |
| **On-Demand** | Pay for the compute you use, **no long-term commitment** | Learning, development, variable or uncertain demand |
| **Savings Plans** | **Commit to a consistent amount** of compute usage for **1 or 3 years**, in exchange for lower rates | Predictable baseline usage, with flexibility |
| **Reserved Instances** | A 1- or 3-year commitment for a **defined EC2 configuration** | Stable configurations. Compare with Savings Plans first |
| **Spot Instances** | Spare EC2 capacity at a variable discount. **AWS can interrupt it** when capacity is needed | Fault-tolerant batch jobs and workloads that can resume |

:::tip[Rule of thumb]
Flexibility → **On-Demand**. Steady commitment → **Savings Plans / RIs**. Interruption-tolerant → **Spot**.
:::

Choosing by workload:

| Workload pattern | Starting point | Why it fits | Main trade-off |
| --- | --- | --- | --- |
| New / uncertain | On-Demand | No long-term commitment | Higher unit price |
| Stable baseline | Savings Plans, compare RIs | Discount for commitment | Commitment may outlast demand |
| Flexible batch work | Spot | Reduces compute cost | Capacity can be interrupted |
| Guaranteed capacity | Capacity Reservation + suitable pricing | Capacity held in a specified AZ | Reservation is separate from discount |

:::caution[Discount and capacity are different things]
Purchasing options are about **price**. A **Capacity Reservation** guarantees that capacity exists in a given AZ. They solve different problems and **can be combined**.
:::

To obtain current prices: (1) define the workload (region, AZ, instance family and size, OS, tenancy), (2) add related resources (EBS, data transfer, public IPv4, monitoring), (3) compare scenarios with the official pricing page and the **AWS Pricing Calculator**.

## Self-Test

**1.** What is the difference between S3 and EBS?

<details>
<summary>Solution</summary>

S3 is an **object store** accessed through APIs, with a flat address space and replication across at least three AZs. EBS is a **block store** that behaves like a disk, attached to an instance in the same AZ.

</details>

**2.** An instance is terminated. Which data is lost?

<details>
<summary>Solution</summary>

The data on the ephemeral local disk. Data on EBS and S3 survives. A simple reboot keeps the local disk intact.

</details>

**3.** What does it mean that Security Groups are stateful?

<details>
<summary>Solution</summary>

Response traffic for an allowed connection is automatically permitted, without a dedicated rule.

</details>

**4.** List the persistent EC2 resources.

<details>
<summary>Solution</summary>

Elastic IP addresses, EBS volumes, Elastic Load Balancers, Security Groups, and AMIs stored in S3 or as EBS snapshots.

</details>

**5.** Which purchasing option fits a nightly batch job that can resume if interrupted?

<details>
<summary>Solution</summary>

**Spot**, the cheapest, since the job tolerates interruptions.

</details>

**6.** What is the difference between an AMI and an instance?

<details>
<summary>Solution</summary>

The AMI is the template with the OS and software. The instance is one running copy of it.

</details>

**7.** Why are EC2 instances best suited for stateless applications?

<details>
<summary>Solution</summary>

Because they are ephemeral: if an instance fails, a stateless application can simply be replaced by another instance, without losing state.

</details>

**8.** What are the three components of an object in an object store?

<details>
<summary>Solution</summary>

Data, metadata and a unique identifier.

</details>

## Glossary

- **EC2** - AWS compute service.
- **S3** - AWS object storage.
- **EBS** - AWS block storage, attached to instances in the same AZ.
- **AMI** - Image from which instances are launched.
- **Instance** - Running copy of an AMI.
- **Security Group** - Stateful virtual firewall of an instance.
- **Elastic IP** - Static IP address that can be remapped.
- **Ephemeral resource** - Resource that exists only while the instance runs.
- **Spot Instance** - Spare, discounted, interruptible capacity.
- **Infrastructure as Code (IaC)** - Defining infrastructure through code and APIs.
