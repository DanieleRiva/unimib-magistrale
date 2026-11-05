---
title: Introduction to Cloud Computing
description: NIST definition, essential characteristics, data centers, regions and availability zones, IaaS, PaaS, SaaS service models and deployment models.
sidebar:
  order: 1
---

## Cloud Definitions

The slides introduce this as the definition to remember "when you forget everything":

:::tip[Basic definition]
A **Cloud** is a type of distributed system consisting of **interconnected and virtualized computers**, **provisioned on demand** and **accessible through a network**.
:::

Every keyword matters: *distributed* because resources live on many machines, *virtualized* because the user never sees the physical hardware, *on demand* because resources are obtained when they are needed, *through a network* because they are not on your premises.

The reference definition is the one from **NIST** (*National Institute of Standards and Technology*):

:::tip[NIST definition]
"Cloud computing is a model for enabling **convenient, on-demand network access** to a **shared pool of configurable computing resources** (e.g., networks, servers, storage, applications, and services) that can be **rapidly provisioned and released** with minimal management effort or service provider interaction."
:::

This cloud model **promotes availability** and is composed of **five essential characteristics**, **three service models** and **four deployment models**. The slides call it "our compass", and stress that the cloud is a **technological, economical, and societal model**.

![](../../../../assets/cloud-computing/nist-modello.png)

:::note[Why "cloud"?]
The cloud shape is often used in network diagrams to represent a **"black box" network**: the access interfaces are known, but not the internal structure. The metaphor goes further:

- A cloud is **opaque** and considered very large and distant.
- As in the sky there are different types of clouds, there are **different types of services** and features offered in the cloud. Their internal implementation is opaque.
- Clouds may **overlap**: different models of clouds can be implemented by the same vendor.
- Clouds can **dynamically change shape**: applications and services in the cloud can dynamically adapt.
:::

## Essential Characteristics

| Characteristic | Meaning (from the slides) |
| --- | --- |
| **On-demand self-service** | A consumer can **unilaterally provision** computing capabilities, such as server time and network storage, as needed **automatically**, without (or with little) human interaction with the provider |
| **Broad network access** | Capabilities are available **over the network** and accessed through **standard mechanisms**, by heterogeneous thin or thick clients (mobile phones, laptops, PDAs) and by other traditional or cloud-based software services |
| **Resource pooling** | The provider's resources are **pooled to serve multiple consumers** using a **multi-tenant model**, with physical and virtual resources **dynamically assigned and reassigned** according to demand |
| **Rapid elasticity** | Capabilities can be rapidly and elastically provisioned to **scale up**, and rapidly released to **scale down**, automatically. To consumers they often **appear unlimited** and can be purchased in any quantity at any time |
| **Measured service** | Cloud systems **automatically control and optimize** resource usage through a **metering capability**. Usage can be monitored, controlled and reported, providing **transparency** for both provider and consumer |

:::tip[How to remember them]
Think of electricity: you switch it on yourself (*self-service*), it is available wherever there is a socket (*network access*), one power plant serves everybody (*pooling*), you can use as much as you want (*elasticity*), and a meter measures it (*measured service*).
:::

## Data Centers

**Data centers** are buildings that house a large number of servers that **simultaneously support many services and applications**:

- A data center has **50,000 to 80,000 servers** (25 to 30 MW).
- **ARM processors** are often used to reduce energy costs.
- Data centers are built **on a large scale** to reduce maintenance costs, **but not very large**, also to **limit the blast radius**, i.e. how far the damage of a single failure spreads.
- Data centers **exploit virtualization massively** to run applications.

:::caution[Slide 7]
The same slide says "hundreds of thousands of servers" and then "50,000 to 80,000". The two numbers do not match: the figure to remember is the second, more precise one.
:::

A data center needs:

- **Power supply**, with a generator system to overcome possible power failures.
- A **continuous cooling system**.
- A **security system**: fire alarms, ventilation to eliminate smoke, authorized access, video cameras, security code, biometric and card reader access, locked cabinets.
- A **high-speed network** within the data center, between data centers and to the Internet. Often optical fiber, dedicated and proprietary lines, including intercontinental ones.

### Regions and Availability Zones

| Concept | Definition |
| --- | --- |
| **Availability Zone** | An **independent data center** with its **own power grid and network**, so that it is protected from possible failures in other data centers |
| **Region** | A **cluster of geographically close data centers** for fault tolerance and stability: a set of availability zones in the same geographic area (e.g., Milan), connected to each other with **low-latency connections** |

Large providers have regions spread across the globe. The distinction is important: different AZs protect from a local failure, different regions from a geographic disaster.

### Virtual Infrastructure Manager

A key challenge for cloud providers is managing physical and virtual resources (servers, storage and networks) **holistically**. Resource orchestration must quickly and dynamically deliver resources to users and applications.

:::tip[Definition]
The software tool responsible for the orchestration is the **Virtual Infrastructure Manager (VIM)**. It resembles a traditional operating system (a "**cloud operating system**"), but instead of dealing with a single computer, it **aggregates resources from multiple computers**, presenting a **uniform view** to users and applications.
:::

## Service Models

A **service model** is a high-level characterization (model) of the cloud that focuses primarily on the **services offered** and the **type of users**. The set of service models defines a possible **taxonomy**: the **SPI model** (SaaS, PaaS, IaaS), the most common classification of cloud services.

The difference is **who manages what**:

![](../../../../assets/cloud-computing/iaas-paas-saas.png)

| | IaaS | PaaS | SaaS |
| --- | --- | --- | --- |
| **What you get** | Virtual infrastructure | A platform to develop and deploy applications | A finished application |
| **What you control** | OS, storage, deployed applications, some networking | Deployed applications and hosting environment configuration | Only user-specific settings |
| **Enabling technique** | Virtualization | Runtime environment | Web service |
| **Flexibility** | High | Medium | Low |
| **Examples** | AWS EC2 | Azure App Service, Google App Engine | Web-based email, online office suites |

:::tip[Takeaways from the slides]
- **IaaS** is the service model that **abstracts the infrastructure**.
- **PaaS** is the deployment (and development) platform that **abstracts the infrastructure, OS, and middleware** to drive developer productivity.
- **SaaS** is the **finished applications that you rent and customize**.
:::

### IaaS - Infrastructure as a Service

The capability provided to the consumer (user or application) is to provision **virtual machines, storage, networks** and other fundamental computing resources. The consumer can **deploy and run arbitrary software**, including OS and applications. The consumer **does not manage or control the underlying cloud infrastructure**, but has control over operating systems, storage, deployed applications, and possibly limited control of selected networking components.

The **enabling technique** is **virtualization**, in three forms: **server, storage and network virtualization**. IaaS provides two services.

The **Resource Management Interface (RMI)** enables the customer to obtain and manage virtualized resources. It can be user or application oriented: **GUI** or **API**.

| Resource | Basic operations |
| --- | --- |
| **Virtual Machine** | Creation, suspension, resumption and termination |
| **Virtual Storage** | Space allocation, space release, data writing and data reading |
| **Virtual Network** | IP address allocation, domain name registration, connection establishment and bandwidth provision |

The **System Monitoring Interface** offers several types of monitoring metrics:

| Resource | Metrics |
| --- | --- |
| **Virtual Machine** | CPU loading, memory utilization, IO loading and internal network loading |
| **Virtual Storage** | Virtual space utilization, data duplication and storage device access bandwidth |
| **Virtual Network** | Virtual network bandwidth, network connectivity and network load balancing |

Properties supported by the virtualization technique:

- **Manageability and Interoperability**: system control, billing, API.
- **Availability and Reliability**: multiple copies of VMs, storage redundancy.
- **Scalability and Elasticity**: on-demand resource (e.g., VM) provisioning.

### PaaS - Platform as a Service

The capability provided to the consumer is to **develop and deploy** onto the cloud applications created using **programming languages and tools supported by the provider**. The consumer does not manage or control the underlying infrastructure (network, servers, operating systems, storage), but has control over the **deployed applications** and possibly the **application hosting environment configurations**.

The **enabling technique** is the **Runtime Environment**: the collection of software services available, usually implemented by a **collection of program libraries** and an **application execution engine**. Its common properties are manageability and interoperability, performance and optimization, availability and reliability, scalability and elasticity.

PaaS provides two services:

- **Programming IDE**: users develop their service with an IDE that integrates the full functionality of the runtime environment and provides **development tools** such as profiler, debugger and testing environment. The programming APIs may be **heterogeneous across providers**, but there are still some common functions: computation, storage and communication resource operations.
- **System Control Interface**, with two approaches:
    - **Policy-Based Control**: a principle or rule that guides decisions according to some requirements: *if &lt;condition&gt; then &lt;action&gt;*.
    - **Workflow Control**: describes the flow of installation and configuration of resources, for a speedy and efficient construction and management of cloud resources.

### SaaS - Software as a Service

The capability provided to the consumer is to **use the provider's applications** running on a cloud infrastructure. The applications are accessible from various client devices through a **thin client interface** such as a web browser (e.g., web-based email). The consumer does not manage or control anything, **except for limited user-specific application configuration settings**.

The **enabling technique** is the **Web Service**. **Web 2.0** is the trend of using the full potential of the web: viewing the Internet as a computing platform, running interactive applications through a web browser, leveraging interconnectivity and mobility of devices, with greater human participation. The Internet provides **accessibility and portability**.

SaaS provides two services:

- **Web-based Applications**: conventional applications translate their access interface onto a web-based platform. Four domains:
    - **General**: office suites, multimedia, instant messaging.
    - **Business**: ERP, CRM, market trading systems.
    - **Scientific**: aerospace and biochemistry simulations.
    - **Government**: national medical systems, public transportation services.
- **Web Portal**: apart from search, portals offer e-mail, news, stock prices, databases and entertainment. They let enterprises give a **consistent look and feel, with access control**, to multiple applications and databases that would otherwise be separate entities. Examples: iGoogle, MSNBC, Netvibes, Yahoo!.

:::caution[The real cloud is blurry]
The SPI model is the most common classification, but the real cloud is **blurry**: a provider can offer different services at different levels, and it is not always easy to classify them. Moving from IaaS to SaaS, **flexibility decreases** and the service becomes more **self-managed**.
:::

## Deployment Models

A **cloud deployment model** is defined according to **where the infrastructure resides** and **who has control over it**. Choosing it is one of the most important cloud deployment decisions. The four models differ primarily in the **access, size and ownership** of the cloud services.

| Model | Definition | Basic characteristics |
| --- | --- | --- |
| **Public** (external, multi-tenant cloud) | Made available to the **general public**, owned by an organization **selling cloud services** | Homogeneous infrastructure, common policies, shared resources and multi-tenancy, leased or rented infrastructure, economies of scale |
| **Private** (internal, on-premise cloud) | Operated **solely for one organization**, managed by it or by a third party, **on or off premise**. Access is limited to the organization's consumers | Heterogeneous infrastructure, customized and tailored policies, dedicated resources, in-house infrastructure, end-to-end control |
| **Community** | **Shared by several organizations** with shared concerns: mission, security requirements, policy, compliance | Access typically restricted to the members. Example: universities cooperating in research |
| **Hybrid** | A **composition of two or more clouds** that remain unique entities, bound together by standardized or proprietary technology that enables **data and application portability** | Example: **cloud bursting** for load balancing between clouds. Typical case: **private-public for scalability** |

:::note[Cloud bursting]
A typical hybrid case: a company normally runs on its private cloud and, during load peaks, "bursts" into the public cloud. The private cloud can then be sized for the average load instead of the peak.
:::

:::caution[Do not mix up the two axes]
*Service models* (IaaS, PaaS, SaaS) and *deployment models* (public, private, community, hybrid) are independent: a PaaS can be public or private. This is a classic trap in multiple-choice questions.
:::

## Self-Test

**1.** What does the NIST model consist of? List all components.

<details>
<summary>Solution</summary>

**5 essential characteristics**: on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service. **3 service models**: IaaS, PaaS, SaaS. **4 deployment models**: public, private, community, hybrid.

</details>

**2.** A company installs its own database on a rented VM. Who manages the operating system? Which service model is it?

<details>
<summary>Solution</summary>

The company, because it is **IaaS**: the consumer controls OS, storage and deployed applications, while the provider manages the underlying infrastructure.

</details>

**3.** What is the difference between an Availability Zone and a Region?

<details>
<summary>Solution</summary>

An AZ is an independent data center with its own power grid and network. A region is a set of geographically close AZs connected with low-latency links.

</details>

**4.** What is the enabling technique of each service model?

<details>
<summary>Solution</summary>

IaaS: virtualization. PaaS: runtime environment. SaaS: web service.

</details>

**5.** Why are data centers large, but not very large?

<details>
<summary>Solution</summary>

Large scale reduces maintenance costs, but a very large data center would increase the **blast radius**: a single failure would hit too many services.

</details>

**6.** What is cloud bursting, and which deployment model does it belong to?

<details>
<summary>Solution</summary>

Moving load from one cloud to another during peaks, typically from private to public. It belongs to the **hybrid** model.

</details>

**7.** What is a Virtual Infrastructure Manager?

<details>
<summary>Solution</summary>

The software that orchestrates the physical and virtual resources of many computers, presenting a uniform view to users and applications: a "cloud operating system".

</details>

**8.** What are the two services provided by IaaS, and the two approaches of the PaaS System Control Interface?

<details>
<summary>Solution</summary>

IaaS: Resource Management Interface and System Monitoring Interface. PaaS System Control Interface: policy-based control and workflow control.

</details>

## Glossary

- **NIST** - US institute whose cloud definition is the course reference.
- **Multi-tenant** - Model where the same resources serve multiple isolated consumers.
- **Availability Zone (AZ)** - Independent data center within a region.
- **Region** - Set of geographically close AZs.
- **Blast radius** - Extent of the damage caused by a single failure.
- **Virtual Infrastructure Manager (VIM)** - Software that orchestrates cloud resources.
- **SPI model** - Classification of cloud services into SaaS, PaaS, IaaS.
- **Runtime environment** - Libraries and execution engine that enable PaaS.
- **Cloud bursting** - Moving load to another cloud during peaks.
