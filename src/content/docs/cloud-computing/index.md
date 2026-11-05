---
title: Cloud Computing
description: Notes and material for the Cloud Computing course - UNIMIB Master's degree.
---

Notes for the **Cloud Computing** course of the Master's degree in Computer Science at UNIMIB, academic year 2026/2027. Lecturers: **Flavio De Paoli** and **Michele Ciavotta**, lab coordination: **Federica Filippini**.

:::tip
Lectures and exam are in English, so these notes are in English too, following the slides' wording. Browse the lessons from the **sidebar**. The [exam preparation](./esami/) page explains how to answer the open questions on Dockerfiles and Compose files.
:::

## Course Content

The course covers models and technologies to design, develop and manage cloud applications, from infrastructure to microservices. It is organized around three aspects: **concepts** to understand problems and solutions, **models** to describe system behavior, and **practice** to build solutions. The lab is 36 hours.

| Topic | Status in the notes |
| --- | --- |
| Cloud models, virtualization, XaaS, properties | [Theory 1-7](./teoria/01-introduzione-al-cloud/) |
| Containers and Docker | [Lab 1-5](./laboratorio/01-docker-introduzione/) |
| Resource management and Kubernetes | [Lab 6](./laboratorio/06-kubernetes/), first lecture |
| Microservices, DevOps, Web of Things | **Slides not available yet** |

| Notes | Source | Topic |
| --- | --- | --- |
| [Introduction](./teoria/01-introduzione-al-cloud/) | Cloud 1 | NIST, IaaS, PaaS, SaaS, deployment |
| [Properties](./teoria/02-proprieta-e-caratteristiche/) | Cloud 2 | Utility computing, SLA, elasticity, fault tolerance |
| [Virtualization](./teoria/03-virtualizzazione/) | Cloud 3 | Hypervisors, CPU, memory, I/O, techniques |
| [Amazon AWS](./teoria/04-amazon-aws/) | Cloud 4 | EC2, S3, EBS, pricing |
| [Auto Scaling](./teoria/05-auto-scaling/) | Cloud 5 | Load balancing, policies, cooldown |
| [PaaS and Azure](./teoria/06-paas-azure/) | Cloud 6 | Roles, throttling, storage, lock-in |
| [Serverless](./teoria/07-serverless/) | Paper | FaaS, cold start, use cases |
| [Docker: Introduction](./laboratorio/01-docker-introduzione/) | Lab 1 | Containers, layers, commands |
| [Docker: Resources and Storage](./laboratorio/02-docker-risorse-e-storage/) | Lab 2 | Limits, volumes |
| [Docker: Dockerfile and Build](./laboratorio/03-dockerfile-e-build/) | Lab 3 | Instructions, multi-stage |
| [Docker: Networking](./laboratorio/04-docker-networking/) | Lab 4 | CNM, drivers, DNS |
| [Docker: Compose](./laboratorio/05-docker-compose/) | Labs 5-6 | Multi-service |
| [Kubernetes](./laboratorio/06-kubernetes/) | Kubernetes Lab 1 | Architecture, Pods, Services |

## Exam Rules

The **written exam** has open and multiple-choice questions on **lectures and lab**, for a maximum of **28 points** (18 to pass):

| Part | Questions | Points |
| --- | --- | --- |
| Multiple choice | 10 × 2 points | 20 |
| Open | 2 × 4 points | 8 |

**Extra points**:

- Up to **2 lab points** for those attending in person: 1 for attendance (at least 75%) and 1 for active participation.
- Up to **3 points** with an optional **final project** agreed with the lecturer. AI tools are allowed, but points are assigned after an in-person discussion of the code: those who cannot explain it may lose some.

**Final grade = written exam + lab (if attended) + project (optional) + possible oral exam.**

If you are not satisfied with the grade, you can ask for an **oral exam on the whole program**, lab included, but the oral grade **replaces** the written one, it does not add to it.

### Midterm Exams

The written exam of the first session can be taken as **two partial exams**, each with open and multiple-choice questions, worth **33 points**:

- You need at least **15** in the first to take the second.
- The written grade is the **average** of the two.
- **There are no make-up exams.**

:::caution[To be clarified]
The sources do not say whether lab and project points also add to the 33-point partials, since 28 + 2 + 3 already makes 33. Nor do they say which topics are in the first partial: the Docker and Kubernetes lab runs until November. Worth asking.
:::

### Dates

| Session | Date |
| --- | --- |
| **First partial exam** | **16/11/2026** |
| **Second partial exam** | **13/01/2027** |
| Session 2 (full written exam) | 28/01/2027 |
| Session 3 (full written exam) | 17/02/2027 |
| Sessions 4, 5, 6 | To be defined |

## How the Notes Are Organized

Each page follows the slides and ends with a **Self-Test** with solutions and a **Glossary**.

- Boxes titled **Beyond the slides** contain material that is not in the slides.
- Caution boxes titled **Slide N** point out errors and inaccuracies.

## Material Not Included

- **Self-assessment quizzes** on e-learning (Virtualization, Cloud Computing, IaaS, PaaS, Serverless): not in the provided material, but **worth doing**, since they are the closest practice for the multiple-choice questions.
- The **video** of the virtualization lecture and the **KPMG seminar** with its slides.
- The lab's **further reading links**: Docker networking, Swarm, Kubernetes 101.

## Corrections to the Slides

| Where | What the slide says | Correction |
| --- | --- | --- |
| Cloud 1, slide 7 | "Hundreds of thousands" and "50,000-80,000" servers | The two figures do not match: the second one counts |
| Cloud 3, slide 24 | KVM among hosted hypervisors | Debated classification: KVM is a kernel module |
| Cloud 3, slide 26 | *Full emulation* of the hardware | Not emulation of another ISA |
| Cloud 5, slide 7 | Launch configuration | Still valid, but AWS now uses launch templates |
| Cloud 6, slides 12-15 | Roles in App Service and in Cloud Services | They are a Cloud Services model |
| Cloud 6, slide 26 | CosmoDB | Cosmos DB |
| Lab 3, slide 26 | `CMD ["--port 27017"]`, `ENTRYPOINT usr/bin/mongod` | Separate arguments, exec form with absolute path |
| Lab 3, slide 26 | ENTRYPOINT or CMD, "not both" | Both can be overridden |
| Kubernetes Lab, slide 15 | Three kinds of management, lists two | Imperative object configuration is missing |
