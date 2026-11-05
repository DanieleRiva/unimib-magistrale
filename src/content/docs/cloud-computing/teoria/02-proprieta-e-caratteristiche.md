---
title: Cloud Properties and Characteristics
description: Utility computing, SOA, QoS and SLA, scalability and elasticity, dynamic provisioning, availability and reliability, manageability and cloud economics.
sidebar:
  order: 2
---

## Central Ideas

Cloud computing is a **paradigm of computing**, a new way of thinking about the IT industry, **not any specific technology**. The slides break it down like this:

| Central ideas | Enabling techniques |
| --- | --- |
| Utility Computing | Virtualization |
| SOA - Service Oriented Architecture | Parallelized and distributed computing |
| SLA - Service Level Agreement | Service-oriented computing |
| | Autonomic Computing |

## Utility Computing

:::tip[Definition]
**Utility Computing** is a computing model in which computing resources, such as processing power, storage and networking, are provided to users as **metered services**, similar to traditional public utilities like electricity, water, or gas. Users **do not own or manage** the underlying hardware or infrastructure: they access resources **on demand** and **pay only for what they actually consume**.
:::

The user's point of view, in three contrasts:

| Users do not care about | They only care about |
| --- | --- |
| **How** the work is done | **What** they can get |
| What the provider does | The **quality of service** |
| Owning the physical infrastructure | **Paying per usage** |

In short, users only care about the quality of the "Service".

It is a model for **Service Provisioning**: the provider makes computing resources and infrastructure management available as needed, and **charges for specific usage rather than a flat rate**. Like other on-demand utilities, it seeks to **maximize the efficient use of resources** (provider side) and/or **minimize costs** (provider and user).

The slides ask: *virtualization helps a lot in this task, do you see why?* Because it lets the provider share physical machines among many customers, and move or resize workloads, so that hardware is used efficiently.

## SOA, QoS and SLA

**Service Oriented Architecture (SOA)** is essentially a **collection of services which communicate with each other**: a **loosely-coupled suite of services** that can be used within multiple business domains, usually implemented using the **Web Service model**.

**QoS** (in the cloud context) denotes the levels of **performance, reliability and availability** offered by the platform or infrastructure that hosts an application. It is about **how** a certain functionality is delivered. QoS has to do with the efficient operation of systems, and can lead to adjusting procedures or adapting software to make more efficient use of resources.

:::tip[SLA definition]
A **Service Level Agreement (SLA)** is a **contract** between a service provider and a customer that specifies, usually in **measurable terms (QoS)**, what level of service the provider will furnish. It defines the **non-functional characteristics** guaranteed by the service, and includes several **SLOs** (*Service Level Objectives*) that define the quality to be guaranteed through **specific metrics**.
:::

Common contents of the contract:

- Performance guarantee metrics.
- Up-time and down-time ratio.
- Response time.
- **Penalties for non-performance**.
- Documented security capabilities.

There are two levels of SLA, and the lower one **affects** the upper one:

![](../../../../assets/cloud-computing/sla-cloud-applicazione.png)

- **Cloud-based SLA** (CI-SLA, *Cloud Infrastructure*): between the infrastructure provider and whoever builds an application on it.
- **Application-based SLA** (CA-SLA, *Cloud-based Application*): between the application provider and its end users.

Whoever builds an application on the cloud cannot promise its customers more than the infrastructure guarantees.

## Key Properties and Enabling Mechanisms

The slides group the properties in pairs: on the left what you want, on the right the mechanism that achieves it.

| Property | Mechanism | Relation |
| --- | --- | --- |
| **Scalability** | **Elasticity** | Ability → dynamic resource mechanism |
| **Availability** | **Reliability** | Service property → fault-tolerance mechanism |
| **Manageability** | **Interoperability** | Ability to manage → ability to integrate heterogeneous systems |
| **Accessibility** | **Portability** | Ability to access/use → ability to move across environments |
| **Performance** | **Optimization** | Desired outcome → improvement mechanism |

## Scalability and Elasticity

:::tip[Definitions]
- **Scalability**: a property of a system, a network, or a process, that indicates its ability to either **handle growing amounts of work in a graceful manner** or to be **readily enlarged** (empowered).
- **Elasticity**: the ability to enforce **adaptive "autonomic" actions** to enable scalability.

Both are achieved through **dynamic provisioning**.
:::

*Scalable* means the system **can** grow. *Elastic* means it grows and shrinks **by itself**, following the load.

There are two ways of scaling:

| | Vertical | Horizontal |
| --- | --- | --- |
| **Terms** | Scale-up / Scale-down | Scale-out / Scale-in |
| **Action** | More powerful computing resources, **bigger servers** | **More computing resources** (e.g., servers) |
| **Failures** | **Single point of failure** | **Reliable**: fail-over scenario, there is at least one node to take over |
| **Management** | **Human intervention**, reasonable management overhead | Can be **fully automated** (especially in the cloud), but **growing management complexity** |

![](../../../../assets/cloud-computing/scaling-verticale.png)

![](../../../../assets/cloud-computing/scaling-orizzontale.png)

### Dynamic Provisioning

:::tip[Definition]
**Dynamic Provisioning** describes a complex networked computing environment where computing instances are **provisioned or deployed from an administrative console or client application**. The system might enable **rules to automate the provisioning**, e.g. Amazon auto-scaling groups.
:::

In the **traditional computing model** there are two common problems, because capacity is fixed in advance:

![](../../../../assets/cloud-computing/provisioning-tradizionale.png)

- **Under-provisioning** (underestimation of system utilization): capacity is below the peaks. You get **loss revenue** and, over time, **loss users**: unhappy users leave, so demand itself drops.
- **Over-provisioning**: organizations overestimate utilization to handle peak loads, allocating resources based on **peak capacity requirements**. The gap between capacity and demand is **unused resources**, which results in:
    - **Low average utilization**: resources sit idle during non-peak periods.
    - **Higher operational costs**: paying for capacity that is not used most of the time.
    - **Capital inefficiency**: significant investment with poor return.

Out of the cloud, organizations must commit to **fixed capacity investments based on imperfect forecasts**, leading to periods of both waste and service issues.

With the cloud, resources are provisioned dynamically in response to actual demand (**elasticity**), to meet:

- **Seasonal demand variations**: holiday shopping periods, tax season.
- **Demand variations between different industries**: sector-specific patterns and business cycles.
- **Burst demand for extraordinary events**: viral content, flash sales.

Capacity now **closely follows the demand curve**, resources scale up and down automatically, and the waste area is dramatically reduced.

![](../../../../assets/cloud-computing/cloud-provisioning.png)

Cloud provisioning **converts fixed capital costs into variable operational expenses**. The advantages:

- **No under-supply**.
- **Reduction of over-supply**.
- **Reduction of initial investments**.
- **Improved performance**.

:::note[Case study: Animoto]
Animoto lets users create videos from their own photos and music, and chose **Amazon EC2** as its platform. Released as a Facebook app in mid-April 2008, it got **more than 750,000 sign-ups within 3 days**. EC2 usage went from **50 to 5,000 VMs** (×100 increase), with no manual intervention or service disruption, and resources **automatically scaled back down** as the surge subsided.
:::

## Availability and Reliability

:::tip[Definitions]
- **Availability**: the **proportion of time a system is in a functioning condition**, expressed as 100% minus unavailability. Cloud infrastructure usually provides high availability: a "**Five Nines**" system statistically provides **99.999%** availability.
- **Reliability**: the ability of a system to **perform its required functions under stated conditions for a specified period of time**.
:::

At application level they are achieved through a **fault-tolerant system**, **system resilience** and **reliable system security**.

:::note[Beyond the slides: what the "nines" mean]
This table is computed and is not in the slides. It gives an order of magnitude when reading an SLA.

| Availability | Max downtime per year | Max downtime per month (30 days) |
| --- | --- | --- |
| 99% | 87.7 hours | 7.2 hours |
| 99.9% | 8.8 hours | 43.2 minutes |
| 99.99% | 52.6 minutes | 4.3 minutes |
| 99.999% ("five nines") | 5.3 minutes | 26 seconds |

:::

### Fault Tolerance

:::tip[Definition]
**Fault tolerance** is the property that enables a system to **continue operating properly in the event of the failure of some of its components**. If the operating quality decreases at all, the decrease must be **proportional to the severity of the failure**, compared to a naively-designed system in which even a small failure can cause total breakdown.
:::

Four basic actions:

1. **No single point of failure**. A **SPOF** is a part of a system which, if it fails, stops the entire system. Critical components are identified **preventively**. **Replication** can help, and the cloud provides tools for it.
2. **Fault detection** of the failing component. **Fault Detection and Isolation (FDI)** is a subfield of control engineering about monitoring a system, identifying when a fault has occurred, and pinpointing its type and location.
3. **Fault containment** to prevent propagation: the system isolates the failure to the offending component, so that other components are not taken down by its erratic behavior. In the cloud, faulty components are usually **identified, isolated and terminated automatically**.
4. **Availability of reversion modes**.

These actions are implemented **at cloud level**, but the cloud can help the designer implement them **at application level**.

### System Resilience

:::tip[Definition]
**Resilience** is the ability to **provide and maintain an acceptable level of service** in the face of faults and challenges to normal operation. It pertains to the system's ability to **return to its original state** after encountering trouble, as soon as possible.
:::

Example risk events: power is lost at a plant for two days, or a key service is lost because of a database corruption. Can the system and the business recover?

**Disaster recovery** is the set of policies and procedures to be prepared for, and execute, the recovery after a disaster. Common strategies:

- **Backup**: copy data off-site at regular intervals, replicate data to an off-site location, replicate the whole system.
- **Preparation**: local mirror systems, surge protectors, **Uninterruptible Power Supply (UPS)**.

### System Security

**Cloud security** is a sub-domain of computer security, network security and, more broadly, information security. It refers to a broad set of **policies, technologies and controls** to protect data, applications and the associated infrastructure.

| Issue | Requirement |
| --- | --- |
| **Data Protection** | Data from one customer must be properly **segregated** from that of another |
| **Identity Management** | Every enterprise has its own identity management system to control access to information and resources |
| **Application Security** | Providers should ensure that applications offered as a service are secure |
| **Privacy** | Critical data are **masked**, and only authorized users have access to data in its entirety |

## Manageability and Interoperability

:::tip[Definitions]
- **Manageability**: the ability of a system to be **controlled**, either by means of **self-control** or by providing techniques to ease **external control**. It covers the enterprise-wide administration of cloud systems.
- **Interoperability**: the property of a product or system to **work with other products or systems**, present or future, without any restricted access or implementation. Achieved through **open interfaces**, **web-based interfaces** and **virtualization**.
:::

They are achieved through **system state monitoring** and **system control automation**.

- **System Monitor**: a process within a distributed system for **collecting and storing state data**. In the cloud you monitor physical and virtual hardware state, resource performance metrics, network access patterns, system logs.
- **Billing System**: users pay per the resources they used. The provider sets the price list, records each user's usage through the **monitoring system**, automatically calculates the amount and requests the payment.
- **Load Balancing** (a form of **optimization**): a technique to distribute workload evenly across two or more computers, network links, CPUs, drives or other resources, to get **optimal resource utilization**, **maximize throughput**, **minimize response time** and **avoid overload**. It improves resource utilization, system performance and energy efficiency.

## Economy at the Time of Cloud Computing

Aspects to consider in an economic assessment:

- **Pay-as-you-go model**: no upfront costs, pay only for what you consume. From **Capital Expenditure (CAPEX)** to **Operational Expenditure (OPEX)**.
- **Elasticity as risk transfer**: no risks associated with incorrect sizing of the infrastructure. The **provider absorbs the infrastructure risk**.
- **Economies of scale**, for both provider and user:
    - **Infrastructure efficiency**: large data centers achieve lower per-unit costs for compute, storage, networking, electricity, cooling and space.
    - **Cost advantages**: providers pass savings to users through prices that small and medium organizations cannot match.
    - **Expertise pooling**: access to world-class skills, best practices and cutting-edge technologies.

## Self-Test

**1.** What is the difference between an SLA and an SLO?

<details>
<summary>Solution</summary>

The **SLA** is the contract between provider and customer. The **SLOs** are the measurable objectives inside it, defined through specific metrics, e.g. "response time under 200 ms in 99% of requests".

</details>

**2.** Compare vertical and horizontal scaling with respect to failures and automation.

<details>
<summary>Solution</summary>

**Vertical** scaling has a single point of failure and requires human intervention. **Horizontal** scaling is reliable thanks to fail-over (another node takes over) and can be fully automated, at the cost of growing management complexity.

</details>

**3.** Why does under-provisioning lose users, not just revenue?

<details>
<summary>Solution</summary>

During peaks, excess requests are not served (loss revenue). Users who get a bad service leave, so future demand drops too (loss users).

</details>

**4.** Are scalability and elasticity the same thing?

<details>
<summary>Solution</summary>

No. Scalability is the ability to handle growing work or be enlarged. Elasticity is the mechanism: adaptive autonomic actions that enable scalability, in both directions.

</details>

**5.** What are the four basic actions of fault tolerance?

<details>
<summary>Solution</summary>

No single point of failure, fault detection of the failing component, fault containment to prevent propagation, availability of reversion modes.

</details>

**6.** What is the difference between availability and reliability?

<details>
<summary>Solution</summary>

Availability is the proportion of time the system is functioning (a service property). Reliability is the ability to perform the required functions under stated conditions for a specified time, and is achieved through fault-tolerance mechanisms.

</details>

**7.** What does moving from CAPEX to OPEX mean?

<details>
<summary>Solution</summary>

Instead of a large upfront investment in hardware, you pay an operational expense proportional to usage.

</details>

**8.** Name three problems of traditional over-provisioning.

<details>
<summary>Solution</summary>

Low average utilization, higher operational costs, capital inefficiency.

</details>

## Glossary

- **Utility Computing** - Computing resources provided as metered services.
- **SOA** - Collection of loosely-coupled services that communicate with each other.
- **QoS** - Levels of performance, reliability and availability of a service.
- **SLA / SLO** - Service contract, and the measurable objectives inside it.
- **Scalability** - Ability to handle growing work or be enlarged.
- **Elasticity** - Autonomic adaptive actions that enable scalability.
- **Dynamic provisioning** - Provisioning resources in response to actual demand.
- **SPOF** - Component whose failure stops the whole system.
- **FDI** - Fault Detection and Isolation.
- **Resilience** - Ability to keep an acceptable service and return to the original state.
- **Disaster recovery** - Policies and procedures to recover after a disaster.
- **CAPEX / OPEX** - Capital and operational expenditure.
