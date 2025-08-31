# NFS Server

The NFS Server Controller is a professional-grade Kubernetes operator that manages NFS servers as custom resources, providing dynamic provisioning and comprehensive lifecycle management of NFS services within your cluster. Part of the SharedVolume ecosystem for enterprise storage solutions.

## Overview

The NFS Server Controller provides enterprise-ready NFS server management through custom resources. It enables organizations to deploy and manage NFS servers declaratively within their Kubernetes clusters, offering a cloud-native approach to shared storage provisioning designed for production environments at scale.

### Problem Statement

Traditional NFS server deployment in Kubernetes environments involves:
- Manual pod and service configuration
- Complex storage management
- Inconsistent deployment patterns
- Limited automation and lifecycle management
- Difficulty in scaling and high availability setup

### Solution

The NFS Server Controller addresses these challenges by:
- **Declarative Management**: Define NFS servers as Kubernetes custom resources
- **Automated Provisioning**: Automatic creation of storage, pods, and services
- **Lifecycle Management**: Handle creation, updates, scaling, and deletion
- **Storage Flexibility**: Support for both dynamic provisioning and existing volumes
- **High Availability**: Built-in support for multiple replicas
- **Kubernetes Native**: Follows Kubernetes patterns and best practices

## Enterprise Features

- **Production-Ready Architecture**: Built with enterprise-grade reliability and scalability in mind
- **Custom Resource Definition (CRD)**: Define NFS servers declaratively using Kubernetes resources
- **Dynamic Provisioning**: Automatically provision NFS servers with persistent storage
- **Advanced Lifecycle Management**: Handle creation, updates, scaling, and deletion of NFS server instances
- **Storage Flexibility**: Support for both StorageClass-based and pre-existing PersistentVolume storage
- **High Availability**: Configurable replica count for NFS server instances with built-in redundancy
- **Service Discovery**: Automatic service creation for seamless NFS server connectivity
- **Comprehensive Monitoring**: Real-time status updates, health checks, and observability
- **Security-First Design**: Built with Kubernetes security best practices and RBAC integration
- **Multi-Platform Support**: Container images for multiple architectures (amd64, arm64)

### Key Capabilities

#### 🎯 **Declarative Configuration**
Define NFS servers using familiar Kubernetes YAML manifests with simple, intuitive specifications.

#### 🔄 **Automated Lifecycle Management**
Complete automation of NFS server deployment, scaling, updates, and cleanup operations.

#### 💾 **Flexible Storage Options**
Support for both StorageClass-based dynamic provisioning and pre-existing PersistentVolume binding.

#### 🏗️ **High Availability**
Configurable replica count for redundancy and improved availability of NFS services.

#### 🔍 **Status Monitoring**
Real-time status updates, health checks, and comprehensive observability features.

#### 🛡️ **Security First**
Security-focused design with proper RBAC, network policies, and container security practices.

## Quick Start

### Creating an NFS Server

Create an NFS server using a StorageClass:

```yaml
apiVersion: sharedvolume.io/v1alpha1
kind: NfsServer
metadata:
  name: my-nfs-server
  namespace: default
spec:
  storage:
    capacity: "10Gi"
    storageClassName: "fast-ssd"
  replicas: 2
  path: "/shared"
```

Apply the configuration:
```bash
kubectl apply -f nfs-server.yaml
```

### Using the NFS Server

Once the NFS server is running, you can mount it in your pods:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nfs-client
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: nfs-storage
      mountPath: /data
  volumes:
  - name: nfs-storage
    nfs:
      server: my-nfs-server.default.svc.cluster.local
      path: /shared
```

## Configuration

### NfsServer Spec

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `storage.capacity` | string | Storage capacity (e.g., "10Gi") | Yes |
| `storage.storageClassName` | string | StorageClass name for dynamic provisioning | No* |
| `storage.persistentVolume` | string | Pre-existing PersistentVolume name | No* |
| `replicas` | int32 | Number of NFS server replicas (default: 2) | No |
| `path` | string | NFS export path (default: "/nfs") | No |
| `image` | string | NFS server image (default: auto-detected) | No |

*Either `storageClassName` or `persistentVolume` must be specified, but not both.

### Examples

#### Complete Example with StorageClass:
```yaml
apiVersion: sharedvolume.io/v1alpha1
kind: NfsServer
metadata:
  name: nfs-server-1
  namespace: shared-volume
spec:
  storage:
    capacity: 10Gi
    storageClassName: standard
  replicas: 1
  path: /nfs-server-path-1
  image: sharedvolume/nfs-server:3.22.0
```

#### Using a specific PersistentVolume:
```yaml
apiVersion: sharedvolume.io/v1alpha1
kind: NfsServer
metadata:
  name: nfs-with-pv
  namespace: shared-volume
spec:
  storage:
    capacity: "50Gi"
    persistentVolume: "nfs-pv-1"
  replicas: 1
  path: /nfs-server-path-1
```

#### Minimal Configuration:
```yaml
apiVersion: sharedvolume.io/v1alpha1
kind: NfsServer
metadata:
  name: simple-nfs
  namespace: default
spec:
  storage:
    capacity: "20Gi"
    storageClassName: "standard"
```

#### High Availability Setup:
```yaml
apiVersion: sharedvolume.io/v1alpha1
kind: NfsServer
metadata:
  name: ha-nfs-server
  namespace: production
spec:
  storage:
    capacity: "100Gi"
    storageClassName: "fast-ssd"
  replicas: 3
  path: /shared-data
  image: sharedvolume/nfs-server:3.22.0
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   kubectl/API  │    │  NFS Controller  │    │   NFS Server    │
│                 │───▶│                  │───▶│     Pods        │
│ apply nfs.yaml  │    │  Reconcile Loop  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │       PVC        │    │    Service      │
                       │   (Storage)      │    │  (Discovery)    │
                       └──────────────────┘    └─────────────────┘
```

The NFS Server Controller consists of:

- **Custom Resource Definition (CRD)**: Defines the `NfsServer` resource schema
- **Controller**: Watches for `NfsServer` resources and manages their lifecycle
- **Reconciler**: Ensures the desired state matches the actual state by creating/updating:
  - PersistentVolumeClaims for storage
  - ReplicaSets for NFS server pods
  - Services for network access

### Technology Stack

- **Language**: Go 1.24+
- **Framework**: Kubebuilder/controller-runtime
- **Container**: Distroless base images
- **Storage**: Kubernetes PersistentVolumes
- **Networking**: Kubernetes Services
- **Security**: RBAC, Pod Security Standards

## Use Cases

### **Development Teams**
- Shared development environments
- Code repositories and build artifacts
- Temporary storage for CI/CD pipelines
- Cross-team collaboration spaces

### **Data Analytics**
- Shared datasets for ML/AI workloads
- Data lakes and warehouses
- ETL pipeline intermediate storage
- Research data sharing

### **Enterprise Applications**
- Legacy application integration
- Shared configuration and templates
- Backup and archive storage
- Multi-tenant shared storage

### **Enterprise Production Environments**
- Mission-critical shared storage for business applications
- High-availability storage for enterprise workloads
- Compliance-ready storage solutions with audit trails
- Multi-tenant environments with proper isolation

### **DevOps and Platform Engineering**
- Infrastructure as Code storage templates
- Centralized monitoring and observability data storage
- Configuration management at enterprise scale
- Business continuity and disaster recovery scenarios

## Monitoring

The controller provides the following status information:

```bash
kubectl get nfs
NAME                   READY   ADDRESS                                                   CAPACITY
fs-sv-zlp29eh5cmhw     true    nfs-sv-zlp29eh5cmhw.nfs-server-controller-system.svc     1Gi
```

You can also use the full resource name:
```bash
kubectl get nfsservers
```

For detailed status:
```bash
kubectl describe nfsserver fs-sv-zlp29eh5cmhw
```

### Status Fields

| Field | Description |
|-------|-------------|
| `Ready` | Whether the NFS server is ready and accessible |
| `Address` | The service address for connecting to the NFS server (users can copy this directly) |
| `Capacity` | The allocated storage capacity |

## Troubleshooting

### Common Issues

1. **NFS Server not ready:**
   - Check PVC status: `kubectl get pvc`
   - Verify storage class exists: `kubectl get storageclass`
   - Check pod logs: `kubectl logs -l app=my-nfs-server`

2. **Mount issues from clients:**
   - Ensure NFS client utilities are installed in client pods
   - Verify network policies allow NFS traffic
   - Check service endpoints: `kubectl get endpoints my-nfs-server`

3. **Permission issues:**
   - Verify the controller has proper RBAC permissions
   - Check if security policies allow privileged containers

### Debug Commands

View controller logs:
```bash
kubectl logs -n nfs-server-controller-system deployment/nfs-server-controller-manager
```

Test NFS connectivity:
```bash
kubectl run nfs-test --image=alpine:latest --rm -it -- /bin/sh
# Inside pod: apk add nfs-utils && showmount -e <service-name>.<namespace>.svc.cluster.local
```

Check NFS server resources:
```bash
kubectl get pods,svc,pvc -l app=<nfs-server-name>
```

## Security Considerations

- NFS server pods run with privileged security context (required for NFS functionality)
- Ensure proper network policies to restrict NFS access
- Consider using storage encryption for sensitive data
- Regularly update the NFS server image for security patches
- Use RBAC to control who can create and manage NFS servers
- Implement proper access controls on the underlying storage

## Best Practices

1. **Resource Planning**: Size your storage capacity appropriately for your workload
2. **High Availability**: Use multiple replicas for production workloads
3. **Naming Conventions**: Use descriptive names that indicate purpose and environment
4. **Namespace Organization**: Group related NFS servers in appropriate namespaces
5. **Monitoring**: Implement monitoring and alerting for NFS server health
6. **Backup Strategy**: Ensure regular backups of NFS server data
7. **Update Policy**: Keep NFS server images updated for security and stability

## Integration with SharedVolume

The NFS Server Controller works seamlessly with SharedVolume and ClusterSharedVolume resources:

```yaml
apiVersion: sharedvolume.io/v1
kind: SharedVolume
metadata:
  name: team-shared-data
  namespace: development
spec:
  nfsServer:
    url: "nfs-server-1.shared-volume.svc.cluster.local"
    path: "/nfs-server-path-1"
  capacity: "10Gi"
```

This integration allows you to:
- Create NFS servers dynamically using the NFS Server Controller
- Reference these servers in SharedVolume resources
- Automatically mount the shared storage in pods using annotations

## Resources

- **Repository**: [https://github.com/sharedvolume/nfs-server-controller](https://github.com/sharedvolume/nfs-server-controller)
- **Releases**: [https://github.com/sharedvolume/nfs-server-controller/releases](https://github.com/sharedvolume/nfs-server-controller/releases)
- **Docker Hub**: [https://hub.docker.com/r/sharedvolume/nfs-server-controller](https://hub.docker.com/r/sharedvolume/nfs-server-controller)
- **Issues**: [https://github.com/sharedvolume/nfs-server-controller/issues](https://github.com/sharedvolume/nfs-server-controller/issues)

## Support

For support and questions:
- **Issues**: Report bugs and feature requests on [GitHub Issues](https://github.com/sharedvolume/nfs-server-controller/issues)
- **Discussions**: Join community discussions on [GitHub Discussions](https://github.com/sharedvolume/nfs-server-controller/discussions)
- **Security**: Report security vulnerabilities privately to bilgehan.nal@gmail.com
