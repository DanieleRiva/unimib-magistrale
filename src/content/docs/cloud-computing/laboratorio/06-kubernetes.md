---
title: Kubernetes
description: Lab 8 - orchestration, control plane and worker architecture, desired state, Pods, ConfigMaps, Services, DNS and minikube-cloud-lab.
sidebar:
  order: 6
---

:::note[Numbering]
The slides are titled *Lab session 8*, the file is `Inf08`, and on e-learning the resource is *Lab. Topic 7: Kubernetes 1*: it is the same material. Since it is the first Kubernetes lecture, more are likely to follow.
:::

## Where Are We?

With Docker we covered the architecture and technology, images vs containers, and the **multi-container environment** (composition). The next step is the **multi-host environment**, which requires:

:::tip[Definitions]
- **Orchestration**: the **automated coordination, management and organization** of tasks and services **across multiple distributed computing nodes**, so that they work together harmoniously to achieve a desired functionality or workflow.
- **Resource management**: the **coordinated and efficient allocation, scheduling and control** of resources (CPU time, memory, storage, network bandwidth) **across multiple computational nodes**.
:::

## What Is Kubernetes?

:::tip[Definition]
**Kubernetes (K8s)** is an open-source system for **automating deployment, scaling and management of containerized applications** across multiple machines, referred to as **nodes**.
:::

- **Idea**: Docker for clusters of machines. It abstracts away the underlying infrastructure: an **OS for clusters**.
- Built upon **15+ years of experience** running production workloads at **Google**, with community best practices.
- **Cloud-native ecosystem**, managed by the **Cloud Native Computing Foundation**.
- It **groups the containers** of an application into **logical units** for easy management and discovery: objects with different granularities, and the **focus is not on the single container**.

In these slides, *workload* and *application* are synonyms. The name comes from Greek κυβερνήτης, helmsman.

### K8s Functionalities

**Fundamentals**:

- **Declarative deployment** through objects.
- **Control plane**: application/cluster **state reconciliation**.
- **General and extensible API**.

**More technical functionalities**: managing different types of workloads (flexibility), multi-host networking, service discovery and load balancing, automatic workload placement (efficiency), **auto remediating** (self-healing: resilience and reliability), horizontal/vertical scaling (elasticity), security, A/B and canary deployments (testing).

## Architecture

Kubernetes implements a **manager-worker architecture**:

![](../../../../assets/cloud-computing/kubernetes-architettura.png)

- The **Control Plane** (manager) is responsible for **managing the state of the cluster**, **scheduling workloads** and the overall **orchestration**. Multiple control plane nodes are used for **high availability and failover**.
- The **Worker Nodes** run the **actual workloads**, in the form of containers.

### Control Plane Components

| Component | Role |
| --- | --- |
| **kube-apiserver** | **Exposes the Kubernetes API**: the **front-end** of the control plane. Designed to **scale horizontally** (more instances) |
| **etcd** | **Consistent and highly-available key-value store**, holding object definitions: the **backing store for all cluster data** |
| **kube-scheduler** | Watches for newly created **Pods with no assigned node** and **selects a node** for them, using resource requirements, hardware/software/policy constraints, **affinity and anti-affinity** |
| **kube-controller-manager** | **Runs the controller processes**, each a separate process |
| **cloud-controller-manager** | Embeds **cloud-specific control logic** and links the cluster to the **cloud provider's API** |

A **controller** is a process that **watches the shared state** of the cluster through the API server and makes changes to **move the current state towards the desired state**. Examples:

- **Node controller**: notices and responds when nodes go down.
- **Replication controller**: maintains the correct number of Pods.
- **Service Account & Token controllers**: create default accounts and API tokens for new namespaces.

### Worker Node Components

| Component | Role |
| --- | --- |
| **kubelet** | **Node agent**: watches the Pod specs assigned to its node, uses the container runtime to run containers, performs **health checks** and **reports Pod/node status** |
| **kube-proxy** | Helps network requests **reach the right Pods**, **updating network rules** as Pods are created or removed |
| **Container runtime** | **Pulls images** and creates, starts and stops containers. The kubelet talks to it through the **Container Runtime Interface (CRI)**. Examples: **containerd** and **CRI-O** |

:::note[The path of a Pod]
The user sends a manifest to the **apiserver**, which stores it in **etcd**. A **workload controller** sees that Pods are needed and creates them. The **scheduler** assigns each unscheduled Pod to a suitable node. That node's **kubelet** starts it through the runtime.
:::

## Kubernetes Pillars

### The Control Plane and the Desired State

The control plane makes **global decisions** about the cluster, and detects and responds to cluster and application **events**. Its components make the **current state match the desired state** by reacting to events: e.g. Kubernetes automatically creates or removes Pod replicas to match the desired replica count.

:::tip[The two key ideas]
- **Declarative service model**: K8s uses a declarative approach to let you **define the desired state** of the services in your application stack.
- **Desired state reconciliation**: the control plane **constantly monitors the cluster state** and **reconciles any differences** between the actual state and your desired state.
:::

The **desired state** is what applications you want to run, which images they use, the number of replicas, which network and disk resources to make available, and more. Users describe it **textually** (declarative model), and controllers automatically manage the cluster to match it. The **cluster state** means both the state of the **nodes** and the state of all **applications** running in the cluster.

If you ask for 3 replicas and one dies, Kubernetes creates another one with no intervention.

:::tip[Record of intent]
A Kubernetes **object** is a **"record of intent"**: once you create it, the system will **constantly work to ensure that object exists**. By creating an object you tell K8s how you want your cluster's workload to look: this is your cluster's desired state.
:::

Advantages of the declarative model:

| Advantage | Meaning |
| --- | --- |
| **State-focused** | You define what the system should look like ("I want 3 replicas of my app"), and K8s matches it regardless of the current state |
| **Idempotency** | Re-applying the same file causes **no unnecessary changes** if the cluster already matches |
| **Version control-friendly** | Configurations are files, which can be version-controlled |
| **Automation-ready** | It describes the target state, not the steps to reach it |

### Objects

K8s **objects** are abstractions that represent the state of the system, usually the components of an application.

| Base objects | Higher-level abstractions |
| --- | --- |
| Pod, Volume, Namespace, Node | Service, Deployment, StatefulSet, DaemonSet, ReplicaSet, Job |

Base objects support **any type of workload**. Higher-level ones add functionality for **common workloads**, such as long-running service-oriented applications and batch jobs.

### The Pod

:::tip[Definition]
A **Pod** is the **basic execution unit** of any Kubernetes application: the **smallest and simplest unit** in the object model that you create or deploy. It represents processes running on the cluster, and is composed of either **a single container** or a small number of **tightly coupled containers that share resources**, **but usually one**.
:::

A Pod encapsulates the application container(s), **storage resources**, a **unique network IP**, and options that govern how the containers run.

### Manifests

A **manifest** describes an object, in YAML or JSON:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: default
  labels:
    app.kubernetes.io/name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:stable
      ports:
        - name: http
          containerPort: 80
          protocol: TCP
```

| Field | Meaning |
| --- | --- |
| `apiVersion` | API version |
| `kind` | Object type: Pod, Deployment, Replication Controller, Job, Service |
| `metadata` | Name, namespace, **labels**: key/value "tags" on any deployable object, **selectable** by actions and other declarations |
| `spec` | Declares the configuration: the desired state |
| `status` | Managed by Kubernetes |

### create vs apply

`kubectl` supports three kinds of object management:

| Kind | Example |
| --- | --- |
| **Imperative commands** | `kubectl run my-pod --image=...`, `kubectl create deployment ...` |
| **Imperative object configuration** | `kubectl create -f file.yml` |
| **Declarative object configuration** | `kubectl apply -f file.yml` |

:::caution[Slide 15]
The slide announces three kinds but lists two. The third, imperative object configuration, is the `kubectl create` one mentioned in slide 29.
:::

| | `kubectl create` | `kubectl apply` |
| --- | --- | --- |
| **Approach** | Imperative object configuration | Declarative object configuration |
| **Resource exists** | **Fails** | Creates or updates |
| **Updates resources** | No | Yes |
| **On conflict** | Error | Resolved by updating |

`apply` keeps a **record of what was applied** to the object, and **patches rather than replaces** it.

## Namespaces and Addons

A **namespace** is a mechanism to organize resources: a **virtual cluster** inside the physical one, useful for **multi-tenancy** and isolation. It provides a **scope for names**, which must be unique within a namespace but not across namespaces, and divides cluster resources between users via **resource quotas**.

| Namespace | Content |
| --- | --- |
| `default` | Objects with no namespace |
| `kube-system` | Objects and resources created by Kubernetes itself |
| `kube-public` | Readable by all users, reserved for cluster bootstrapping and configuration |
| `kube-node-lease` | Lease objects needed to manage nodes |

**Addons** use Kubernetes resources to implement cluster features, in the `kube-system` namespace:

- **DNS** (required): Kubernetes launches a DNS Pod and Service, and the kubelets tell containers to use it.
- **Dashboard**: a web UI to manage and troubleshoot applications and the cluster.
- **Cluster-level logging**: saves container logs to a central store with search.

## ConfigMaps

:::tip[Definition]
A **ConfigMap** stores **non-sensitive configuration data** in **key-value pairs**. It **separates configuration from application code**, for flexibility and portability, and is injected into containers as **environment variables, command-line arguments or configuration files (volumes)**. ConfigMaps are stored in K8s' internal database as blobs.
:::

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-data
data:
  index.html: |-
    <p><strong>K8s rocks!</strong></p>
```

It can also be created imperatively: `kubectl create configmap literal-example --from-literal=City=Hamburg`, or `--from-file index.html`. In the Pod it is mounted as a volume, and its content appears as files:

```yaml
spec:
  containers:
    - name: nginx
      image: nginx:stable
      volumeMounts:
        - name: data
          mountPath: "/usr/share/nginx/html"
  volumes:
    - name: data
      configMap:
        name: nginx-data
```

:::note[Why Ex. 3 fails]
Re-applying the manifest to an existing Pod gives an error: a Pod's volumes cannot be changed on the fly. You must delete the Pod and create it again.
:::

## K8s as a SOA Enabler

**SOA** builds applications as a collection of **loosely coupled services** communicating over a network, promoting reusability, scalability and maintainability. Kubernetes is a **SOA enabler**: a platform to deploy, scale and manage **microservices**, the modern evolution of SOA, with **independent deployment and scaling** of each service, built-in **service discovery and load balancing** (DNS-based), and **resilience and self-healing** (automatic restarts, replication, health checks).

## Services

**Why do we need a Service?** Pods are **ephemeral**, so their IP addresses can change: how do consumers find out which IP to connect to?

:::tip[Definition]
A **Service** is an abstraction that defines a **logical set of identical Pods** and a **policy to access them**. It offers an **abstract entrypoint** to the Pods, enabling **service discovery** and **load balancing** among them.
:::

Services control communication with Pods: they **load balance** requests, **don't send traffic to unhealthy** Pods, **only talk to the correct version**, and provide **service discovery** (each Pod just calls the name of the service it wants).

The set of Pods targeted by a Service is usually determined by a **selector**, which matches the Pods' **labels**:

![](../../../../assets/cloud-computing/kubernetes-selector.png)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: nginx
  ports:
    - name: http
      port: 8080        # Service port
      targetPort: 80    # Pod port
      protocol: TCP
```

A Service **does not manage Pods and their replicas**: it just **abstracts them**, providing a unified view. In Ex. 4, deleting the Pod empties the Service's **Endpoints**, and re-creating it brings them back. Adding `nginx-2` with the same label gives two endpoints.

| Type | Access |
| --- | --- |
| **ClusterIP** (default) | A service **inside** the cluster, for other apps in the cluster. **No external access** |
| **NodePort** | Extends ClusterIP. **Exposes a port on every node's IP** |
| **LoadBalancer** | Extends NodePort. Works with an **external system** to map an **external IP** to the service |
| **ExternalName** | References endpoints **outside** the cluster |

![](../../../../assets/cloud-computing/kubernetes-service-types.png)

:::caution[Service environment variables]
The kubelet injects variables like `NGINX_SERVICE_HOST` and `NGINX_SERVICE_PORT` into Pods (the `NGINX_` prefix comes from the Service name). **Timing matters**: create the Service **before the container**. Existing containers do not gain new variables: recreate the Pod. They are connection details (the Service ClusterIP and port), not credentials.
:::

### DNS

Minikube provides a DNS implementation called **kube-dns**.

| Object | DNS name |
| --- | --- |
| **Service** (ClusterIP) | `<my-svc>.<my-namespace>.svc.<cluster-domain>`, resolving to the Service's cluster IP |
| **Pod** | `<pod-ip-with-dashes>.<my-namespace>.pod.<cluster-domain>` |
| **Pod exposed by a Service** | `<pod-ip-with-dashes>.<service-name>.<my-namespace>.svc.<cluster-domain>` |

A Service also resolves by `my-svc` and `my-svc.my-namespace`: from a Pod in `default`, both `http://nginx:8080/` and `http://nginx.default:8080/` return the nginx page. A Pod in `default` with IP `172.17.0.3` is `172-17-0-3.default.pod.cluster.local`.

## The Lab: minikube-cloud-lab

**minikube** implements a **local Kubernetes cluster** on macOS, Linux and Windows, for local development. **minikube-cloud-lab** is a **simulated cloud provider**, backed by real Kubernetes nodes running in Docker: you can create and delete a cluster, choose a machine type, set node limits, get credentials and watch the **Cluster Autoscaler** add or remove machines. It is a local teaching environment, not a production cloud.

```bash
git clone https://github.com/miciav/minikube-cloud-lab.git
cd minikube-cloud-lab
source scripts/configure.sh   # again in every new terminal
docker compose up -d

cloud clusters create lab --machine-type lab-small --min-nodes 1 --max-nodes 3
cloud clusters get-credentials lab
kubectl get nodes

# end of lab
cloud clusters delete lab
docker compose down
```

`kubectl` reads credentials from **kubeconfig** (`~/.kube/config`), and the active **context** selects cluster and user. **Authentication** identifies you, **RBAC** controls access. Keep credentials private and out of Git.

| Command | Purpose |
| --- | --- |
| `kubectl run my-pod --image=...` | Create a Pod imperatively |
| `kubectl apply -f file.yml` | Apply a manifest |
| `kubectl get pods` / `services` / `nodes` | List objects, `-A` for all namespaces |
| `kubectl describe pod nginx` | Details and events |
| `kubectl exec -it my-pod -- sh` | Run a command in the Pod. `--` separates kubectl options from the command |
| `kubectl port-forward pod/nginx 18080:80` | Forward a local port. **Only for debugging and development** |
| `kubectl delete pod my-pod` | Delete |

## Self-Test

**1.** What are the control plane components, and what do they do?

<details>
<summary>Solution</summary>

**kube-apiserver** exposes the API. **etcd** stores all cluster data. **kube-scheduler** assigns Pods to nodes. **kube-controller-manager** runs the controllers that reconcile the state. **cloud-controller-manager** links the cluster to the cloud provider.

</details>

**2.** Which components run on every worker node?

<details>
<summary>Solution</summary>

kubelet, kube-proxy and the container runtime.

</details>

**3.** What does it mean that Kubernetes is declarative?

<details>
<summary>Solution</summary>

You describe the desired state, not the steps. Controllers continuously compare current and desired state and reconcile the differences.

</details>

**4.** What is a Pod, and how does it relate to containers?

<details>
<summary>Solution</summary>

The basic execution unit, the smallest object you deploy. It contains one or a few tightly coupled containers that share resources and an IP, usually just one.

</details>

**5.** Why are Services needed?

<details>
<summary>Solution</summary>

Pods are ephemeral and change IP. A Service offers a stable entrypoint, with service discovery and load balancing.

</details>

**6.** How does a Service choose its Pods?

<details>
<summary>Solution</summary>

With a **selector** that matches the Pods' **labels**.

</details>

**7.** What is the difference between `port` and `targetPort`?

<details>
<summary>Solution</summary>

`port` is the Service's port, `targetPort` the container's port in the Pod.

</details>

**8.** Which Service type would you choose for an internal database, and which to expose a website on the cloud?

<details>
<summary>Solution</summary>

**ClusterIP** for the database, which stays internal. **LoadBalancer** for the website.

</details>

**9.** What is the difference between `kubectl create` and `kubectl apply`?

<details>
<summary>Solution</summary>

`create` is imperative and fails if the resource exists. `apply` is declarative: it creates or updates the resource with a patch.

</details>

**10.** Define orchestration and resource management.

<details>
<summary>Solution</summary>

Orchestration is the automated coordination and management of tasks and services across multiple nodes. Resource management is the coordinated allocation, scheduling and control of CPU, memory, storage and bandwidth across multiple nodes.

</details>

## Glossary

- **Orchestration** - Automated coordination of services across nodes.
- **Control Plane** - Part of the cluster that manages its state.
- **Worker Node** - Machine that runs the workloads.
- **kube-apiserver** - Front-end of the control plane.
- **etcd** - Key-value store of all cluster data.
- **Controller** - Process that moves the current state towards the desired one.
- **kubelet** - Agent on every node.
- **kube-proxy** - Manager of the node's network rules.
- **Pod** - Basic execution unit.
- **Manifest** - Description of an object in YAML or JSON.
- **Label / Selector** - Object tags, and the criterion to choose objects.
- **Service** - Stable entrypoint to a set of Pods.
- **ConfigMap** - Non-sensitive configuration separated from code.
- **Namespace** - Virtual cluster within the cluster.
- **CRI / CNI** - Standard interfaces for runtime and networking.
- **RBAC** - Role-based access control.
- **Reconciliation** - Continuous correction of the current state towards the desired one.
