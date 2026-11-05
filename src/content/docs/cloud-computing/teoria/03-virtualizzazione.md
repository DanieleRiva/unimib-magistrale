---
title: Virtualization
description: Emulation and virtualization, hypervisors, CPU, memory, I/O and network virtualization, benefits, hypervisor taxonomy and virtualization techniques.
sidebar:
  order: 3
---

## Computer Architecture

Since the 1940s, computers have **5 classic components**: **input devices** (keyboard, mouse, DVD), **output devices** (display, printer), **storage devices** (volatile memory like RAM, permanent storage like magnetic, optical and flash disks), **datapath** and **control unit**. Datapath and control together are called the **Processor**. A newly added component is the **network**, essential for communication.

The **CPU** loads programs from storage to RAM and executes a succession of instructions in linear fashion (programs are now *processes*). The "words" the CPU understands belong to an **Instruction Set**. The **Operating System** is a special program that controls the hardware and manages the life-cycle of processes. With **multitasking**, several processes run concurrently on the same hardware, shared thanks to **CPU time-sharing**.

The key to understanding virtualization is that there are **four interfaces**:

![](../../../../assets/cloud-computing/interfacce-sistema.png)

| # | Interface | What it provides |
| --- | --- | --- |
| 1 | **Unprivileged machine instructions** (general instructions) | An interface to the bare hardware available to **any program** |
| 2 | **Privileged instructions** | An interface to the hardware **for the OS** |
| 3 | **System calls** | An interface to the operating system **for applications** |
| 4 | **APIs** | High-level programming endpoints that may exploit OS system calls |

## Emulation and Virtualization

:::tip[Definitions]
- **Emulation** is a technique where one computer system (the **host**) mimics the hardware and instruction set of a **different** computer system (the **guest**). An emulator **translates instructions** from the guest architecture into instructions the host can execute, recreating the complete behavior of the original system in software.
- **Virtualization** is a technology that creates **abstracted, logical instances of physical computing resources**. It uses a **hypervisor** (or Virtual Machine Monitor) to partition physical hardware and create multiple isolated virtual environments called **Virtual Machines (VMs)**. Each VM runs its own OS and applications, **believing it has dedicated hardware**, while sharing the underlying physical resources, i.e. the ISA.
:::

| Aspect | Virtualization | Emulation |
| --- | --- | --- |
| **Architecture** | **Same ISA** (e.g., x86 on x86) | **Different ISA** (e.g., ARM on x86) |
| **Performance** | Near-native speed | Significantly slower |
| **Translation** | Minimal/no instruction translation | Full instruction translation required |
| **Use case** | Server consolidation, cloud computing | Legacy system preservation, cross-platform testing |
| **Example** | VMware ESXi, KVM, Hyper-V | QEMU (in full emulation mode), DOSBox, game console emulators |

A **virtual machine** provides a complete virtualized hardware platform to run a complete operating system. The resources of the physical machine can be shared among several VMs, each with its own OS. VMs are created and managed by a **Hypervisor** (a.k.a. Virtual Machine Monitor). Examples: VirtualBox, KVM, VMware and Xen.

:::note[Brief history]
- **1966**: IBM introduces virtualization with **CP-40** on mainframes.
- **1985**: AT&T 6300+ (Olivetti) with Simultask VMM runs DOS and Unix SVR2 concurrently, an early PC-based experiment.
- **1990s-2000s**: virtualization re-emerges on PCs (VMware, VirtualBox) and becomes a foundation for Cloud Computing.
- **Today**: widely adopted in data centers, for unified management of server hardware and efficient resource sharing.

Virtualization enables **resource sharing** and **isolation**, and is **the foundation of Cloud Computing**.
:::

### Process vs System Virtual Machines

A **Process Virtual Machine** (also called application virtual machine or managed runtime environment) is a virtualization layer that provides a **platform-independent execution environment for a single process or application**. Unlike system VMs, which virtualize entire hardware systems, it virtualizes only the resources needed by one application:

- **Process-level abstraction**: virtualizes at the application layer, not the hardware layer.
- **Single application**: each VM instance runs one application or process.
- **Platform independence**: "write once, run anywhere".
- **Managed execution**: memory management, garbage collection, security.
- **Intermediate representation**: applications are compiled to platform-independent **bytecode**, interpreted or JIT-compiled.

The JVM is the classic example.

:::caution[Course scope]
In this course we consider **only System Virtual Machines**.
:::

## What Is a Hypervisor?

:::tip[Definition]
A **Hypervisor** (or **Virtual Machine Monitor**) is software that **creates and manages virtual machines** by **abstracting and partitioning physical hardware resources**. It leverages the hardware virtualization features of modern CPUs (such as **Intel VT-x** or **AMD-V**), and shares the available resources so that **each VM sees them as dedicated**.
:::

The resources to share are four: **CPU, memory, storage and network**.

## CPU Virtualization and Protection Rings

Modern CPUs define **protection levels (rings)** from **Ring 0** (highest privilege) to **Ring 3** (lowest privilege). OS kernels expect to run at **Ring 0** to execute privileged instructions directly on hardware.

In a virtualized environment, the guest OS believes it has full control over the hardware, but it actually runs in a **deprivileged mode**. Hypervisors need to **intercept** privileged instructions. Early solutions used **trap-and-emulate** and **binary translation**, then hardware support arrived.

| Technique | How it works |
| --- | --- |
| **Trap-and-emulate** | When the guest OS attempts a privileged instruction, the CPU generates a **trap** (exception), transferring control to the hypervisor, which **emulates the instruction's behavior** in a safe, virtualized manner |
| **Binary translation** | The hypervisor **dynamically scans, analyzes and rewrites guest code at runtime**, replacing problematic instructions with safe equivalents. It was VMware's solution for x86 before hardware support existed |
| **Hardware-assisted virtualization** (Intel VT-x, AMD-V) | New CPU modes: the hypervisor runs in **root mode**, the guest OS in **non-root mode**, as if it were in Ring 0. A privileged instruction is **automatically trapped** and handed to the hypervisor |

Hardware support also brings **efficient context switching** between guest and host, **memory virtualization support**, and **I/O virtualization** (Intel VT-d, AMD IOMMU) for safe and efficient device sharing between VMs.

## Memory Virtualization

Memory management is a critical challenge: the guest OS maintains **its own page tables**, assuming it owns physical memory. There are actually **two translations**:

![](../../../../assets/cloud-computing/virtualizzazione-memoria.png)

| Technique | How it works | Cost |
| --- | --- | --- |
| **Shadow Page Tables** | The hypervisor maintains **synchronized copies** of the guest page tables, translating guest-virtual to host-physical addresses | **High overhead** |
| **Hardware-Assisted Page Tables**: Extended Page Tables (**EPT**, Intel), Nested Page Tables (**NPT**, AMD) | A **second level of hardware translation** | **Reduced overhead** |

These technologies drastically improved performance, enabling **scalable virtualization** in cloud data centers.

## I/O Virtualization

Input/output devices must also be virtualized for guest systems.

| Technique | How it works | Trade-off |
| --- | --- | --- |
| **Device emulation** | The hypervisor emulates hardware devices | Highly portable, but **slow** |
| **Paravirtualized drivers** (e.g., **VirtIO**) | The guest OS communicates directly with the hypervisor through **optimized interfaces** | Better performance |
| **Direct device assignment with SR-IOV** (Single Root I/O Virtualization) | Partitions **PCI** devices | **Near-native performance**, at the cost of **flexibility and migration limitations** |

![](../../../../assets/cloud-computing/sr-iov.png)

## Network Virtualization

**Network virtualization** abstracts physical networking resources (switches, routers, links) into **Software-Defined logical Networks (SDN)**. Multiple **isolated virtual networks coexist** on the same physical infrastructure, enabling **multi-tenancy** in cloud data centers.

- **Virtual switches** (Linux bridge, Open vSwitch) connect VMs or containers **within each host**, as if plugged into a real switch.
- **Overlay networks** (e.g., VXLAN, GRE tunnels) interconnect virtual switches **across hosts**, creating logical topologies independent of the physical network.

Benefits: **strong isolation**, **programmability** through SDN controllers, **elastic provisioning**, **simplified management** of large infrastructures.

## Virtualization Benefits

- **Unified vision of physical resources**: resources can be on different physical machines or on the network.
- **Centralized management** of hardware and software.
- **Workload isolation**: programs run inside the VM, isolated from the host and other VMs. This brings:
    - **Security**: all program instructions are fully confined inside a VM.
    - **Reliability**: software failures inside one VM do not affect others.
    - **Performance control**: one VM should not affect the performance of another.
- **Consolidation**: several VMs on a single physical system, reducing the **total cost of ownership (TCO)**, an estimate of all direct and indirect costs of acquiring and operating a system over its lifetime. It also **optimizes physical resource usage**.
- **Easy migration** (workload migration, a.k.a. application mobility): the guest OS can be **suspended, migrated** to a different platform, and **resumed** immediately or later. It improves **hardware maintenance, performance and fault tolerance**. A VM's state includes a **full disk, configuration files and an image of its memory (RAM)**.
- **Easy redundancy**: virtualized items can be easily copied.

## Taxonomy of Hypervisors

| | Bare-Metal | Hosted |
| --- | --- | --- |
| **Where it runs** | Installed on the **bare hardware**, communicates directly with it | Installed **on top of a host OS** |
| **Nature** | Basically a **lightweight OS** | Runs guest OSes side by side with the user's applications |
| **Advantages** | **Improved I/O performance** | Ease of installation and configuration, **unmodified host and guest OS**, runs on a wide variety of computers |
| **Disadvantages** | Difficult to install and configure, **depends on the hardware platform** | **Performance degradation** |
| **Examples** | VMware ESX, Microsoft Hyper-V, Citrix XenServer | VMware Workstation, VirtualBox, QEMU |

![](../../../../assets/cloud-computing/hypervisor-bare-metal.png)

![](../../../../assets/cloud-computing/hypervisor-hosted.png)

:::caution[Slide 24: KVM]
The slide lists KVM among the hosted hypervisors. This classification is debated: KVM is a Linux kernel module that turns Linux itself into a hypervisor, and many consider it bare-metal. In an exam answer, follow the slide, but know that the line is not sharp.
:::

## Virtualization Techniques

The slides divide them into:

- **Software virtualization**: **full virtualization** using binary translation, **para-virtualization** (a.k.a. OS-assisted virtualization), **OS-level virtualization**.
- **Hardware-assisted virtualization**: the hardware implements specific technologies to support virtualization, which full and para-virtualization can **exploit for performance**.

### Full Virtualization

A technique that provides a VM environment that is a **full emulation of the underlying hardware**:

- The **guest OS does not need to be modified**.
- The guest OS is **not aware** of the virtual environment.
- Each VM is independent of the others.
- The hypervisor executes **privileged instructions** by dynamically translating them into sequences suitable for the real hardware (**binary translation**), while **unprivileged instructions are executed directly**.

:::caution[Slide 26: "emulation" has two meanings]
Here "full emulation of the hardware" does not mean [emulation](#emulation-and-virtualization) of a **different** ISA: the ISA is the same, and unprivileged instructions run directly.
:::

### Para-Virtualization

The **guest OS is modified** to be **aware** that it runs in a virtualized environment. Instead of fully emulating hardware, the guest OS uses **special calls** to interact directly with the hypervisor: the **hypercalls**. This translates into a **performance boost** and **seamless integration** (mouse, keyboard, screen).

**Paravirtualized drivers** are optimized, virtualization-aware device drivers that replace slow device emulation with direct, efficient communication with the hypervisor. Example: **VirtIO** (KVM/QEMU), the standard for paravirtual I/O devices (network, block storage).

![](../../../../assets/cloud-computing/paravirtualizzazione.png)

The diagram shows Hyper-V: "enlightened" guest systems talk to the hypervisor through the Hypercall API and VMBus.

### OS-Level Virtualization (Containerization)

The **host operating system itself** provides multiple **isolated execution environments**, known as **containers** (or zones, jails), rather than emulating full hardware machines.

- Unlike hypervisor-based virtualization, it **shares the same kernel** among all containers.
- Each container runs as a **set of isolated processes**, with its own view of the **filesystem, process table, network stack and resource quotas**.
- The virtualization capability is provided by the **host OS**, which performs all the functions of a hypervisor.

Examples: Linux containers (Docker, LXD).

![](../../../../assets/cloud-computing/os-level-virtualization.png)

| | Full | Para | OS-level |
| --- | --- | --- | --- |
| **Guest modified** | No | Yes | There is no guest OS |
| **Aware of virtualization** | No | Yes | Sees an isolated system |
| **Kernel** | One per VM | One per VM | One, shared |
| **Examples** | VMware | Xen, VirtIO | Docker, LXD |

Containers are the topic of the [lab](../../laboratorio/01-docker-introduzione/).

## Self-Test

**1.** What is the difference between emulation and virtualization?

<details>
<summary>Solution</summary>

Emulation mimics a **different ISA** with full instruction translation, and is significantly slower. Virtualization works on the **same ISA**, with minimal or no translation and near-native speed.

</details>

**2.** Why can't a guest OS really run in Ring 0?

<details>
<summary>Solution</summary>

It would have direct control of the hardware and could interfere with the hypervisor and the other VMs, breaking isolation. It runs in a deprivileged mode instead.

</details>

**3.** How does trap-and-emulate work?

<details>
<summary>Solution</summary>

The guest runs deprivileged. When it executes a privileged instruction, the CPU generates a trap, control passes to the hypervisor, which emulates the instruction safely and resumes the VM.

</details>

**4.** What is the difference between full virtualization and para-virtualization?

<details>
<summary>Solution</summary>

In **full** virtualization the guest is unmodified and unaware: privileged instructions are binary-translated. In **para-virtualization** the guest is modified and aware, and talks to the hypervisor through hypercalls, with better performance.

</details>

**5.** What is the fundamental difference between a VM and a container?

<details>
<summary>Solution</summary>

Each VM has its own OS and kernel on top of a hypervisor. Containers share the host kernel: they are isolated processes, much lighter but with weaker isolation.

</details>

**6.** Why are Shadow Page Tables expensive, and what replaced them?

<details>
<summary>Solution</summary>

The hypervisor must keep its copies synchronized with the guest page tables. They were replaced by EPT (Intel) and NPT (AMD), which add a second level of translation in hardware.

</details>

**7.** SR-IOV gives near-native performance. Why isn't it always used?

<details>
<summary>Solution</summary>

It costs flexibility and limits VM migration, because the VM is tied to a physical device.

</details>

**8.** List the advantages and disadvantages of bare-metal and hosted hypervisors.

<details>
<summary>Solution</summary>

Bare-metal: improved I/O performance, but difficult to install and configure and dependent on the hardware platform. Hosted: easy to install, unmodified host and guest OS, runs on many computers, but with performance degradation.

</details>

**9.** What does a VM's state include, for migration?

<details>
<summary>Solution</summary>

A full disk, configuration files and an image of its memory (RAM).

</details>

## Glossary

- **ISA** - Instruction Set Architecture.
- **Emulation** - Software reproduction of a system with a different ISA.
- **Hypervisor / VMM** - Software that creates and manages virtual machines.
- **Ring** - CPU protection level, from 0 (highest privilege) to 3.
- **Trap-and-emulate** - Intercepting and emulating privileged instructions.
- **Binary translation** - Rewriting guest code at runtime.
- **EPT / NPT** - Two-level address translation in hardware.
- **VirtIO** - Standard for paravirtual I/O devices.
- **SR-IOV** - Partitioning a PCI device to assign it directly to VMs.
- **SDN** - Software-Defined logical Networks.
- **VXLAN** - Overlay network technology.
- **Hypercall** - Direct call from a paravirtualized guest to the hypervisor.
- **TCO** - Total cost of ownership.
- **Consolidation** - Running several VMs on fewer physical machines.
