# What is Shared Volume?
---
  <img src="../images/text-logo.png" alt="Shared Volume Logo" height="50"/>

**SharedVolume** is a powerful Kubernetes operator that revolutionizes how you share data between pods and workloads. Effortlessly sync content from Git repositories, S3 buckets, HTTP sources, and more with just a few lines of YAML.

## 🎯 The Problem It Solves

In traditional Kubernetes environments, sharing data between pods often involves:
- Kubernetes has no native multi-source sync, so fetching data from Git, S3, HTTP, or SSH usually requires custom init containers, sidecars, or sync jobs.
- Kubernetes causes data duplication and waste, since each workload often stores its own copy of the same dataset.
- Kubernetes enforces namespace isolation, making volume sharing across namespaces difficult or impossible without hacks.
- Kubernetes requires manual updates, meaning new Git commits or S3 changes must be synced with custom cron jobs or pipelines.

**Shared Volume eliminates these complexities.**

## 🚀 How It Works

Shared Volume introduces three key concepts:

### 📦 **Define a SharedVolume (SV or CSV)**
- In your cluster, you create a SharedVolume (namespace-scoped) or ClusterSharedVolume (cluster-wide)
- You specify the data source (Git repo, S3 bucket, HTTP endpoint, SSH source, etc.).

### 🔄 **Operator Handles Data Sync** 
- The SharedVolume operator automatically pulls and keeps the data in sync with the source.
- Only one copy of the data is stored in the background, no matter how many pods use it.

### 📎 **Pods Attach with Simple Annotations**
- Instead of writing complex PersistentVolume YAML, you just annotate your pod and the operator injects the volume automatically into the pod.

## ✨ Key Benefits

### **Effortless Data Sharing**
- Share data between pods and workloads without writing complex PVC or storage configs.

### **Multi-Source Support**
- Sync directly from Git, S3, HTTP, and SSH without custom init containers or sidecars.

### **Single Storage Copy**
- Keeps only one copy of the data, reducing storage usage and avoiding duplication.

### **Cross-Namespace Sharing**
- Use **ClusterSharedVolume(csv)** to share data across namespace boundaries.

### **Always Up-to-Date**
- Automatic sync keeps data fresh without manual cron jobs or pipeline hacks.

### **Simple Integration**
- Just add a pod annotation to mount shared volumes instantly.

### **Cost & Resource Efficiency**
- Saves both storage costs and operational overhead compared to traditional solutions.

## 📌 Perfect Use Cases

### ⚙️ Configuration Management  
Share configuration files, certificates, and settings across multiple microservices without rebuilding containers.  

### 🌐 Static Asset Distribution  
Distribute web assets, documentation, or media files from your CDN, S3 bucket, or Git repository directly to your pods.  

### 🔄 CI/CD Data Flow  
Pass build artifacts, test results, or deployment configurations seamlessly between different pipeline stages.  

### 📊 Multi-Stage Processing  
Share datasets, intermediate results, or processed files between different processing steps in data or ML pipelines.  

### 🤖 Data Processing & AI/ML  
Distribute large datasets, trained models, or analytics results across multiple compute workloads efficiently.  

### 🛠️ Development Environments  
Provide shared SDKs, dependencies, or tools across development pods and teams without duplication.  

### 🔗 Cross-Namespace Collaboration  
Enable teams in different namespaces to securely share the same data sources without complex hacks.

## 🏗️ Architecture Overview

```
┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐
│   Git Repo  │  │  S3 Bucket   │  │ HTTP Source │  │ SSH Source  │
│    🗂️      │  │     🪣       │  │     🌐     │  │     🔐     │
└─────────────┘  └──────────────┘  └─────────────┘  └─────────────┘
       │                │                │                │
       └────────────────┼────────────────┼────────────────┘
                        │                │      (External sources - Optional)
                        │                │
                 ┌──────▼────────────────▼──────┐
                 │   Shared Volume Controller   │ ← 🎛️ Kubernetes Operator
                 │    (Syncs data to shared     │
                 │     storage for each SV/CSV) │
                 └──────────────┬───────────────┘
                                │
                 ┌──────────────▼───────────────┐
                 │        Shared Storage        │
                 │       (NFS Server)           │ ← 📦 Generated single for each SV/CSV
                 │  • Dynamic (nfs-server op)   │     Can be:
                 │    (requires privilege mode) │     - Generated by nfs-server operator (only if cluster allows privileged mode)
                 │  • Static (external NFS)     │     - Static external NFS server
                 └──────────────┬───────────────┘
                                │
       ┌────────────────────────┼────────────────────────┐
       │                        │                        │
   ┌───▼───┐                ┌───▼───┐                ┌───▼───┐
   │ Pod A │                │ Pod B │                │ Pod C │
   │  📱   │                │  🖥️   │                │  🔧   │
   └───────┘                └───────┘                └───────┘
```

## 🚀 Ready to Get Started?

- **Ready to install?** Jump to our [Installation Guide](../getting-started/installation.md)  
- **Want to see it in action?** Try our [Quick Start Tutorial](../getting-started/quick-start.md)
