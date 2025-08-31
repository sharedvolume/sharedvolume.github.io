# Architecture

Understanding the SharedVolume architecture helps you make informed decisions about deployment and usage patterns. The system provides a comprehensive solution for shared storage with automatic synchronization from external sources.

## High-Level Architecture

The SharedVolume system consists of several interconnected components that work together to provide seamless shared storage with data synchronization capabilities.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │   User Pods     │───▶│   Webhook        │    │   External  │ │
│  │ (with annot.)   │    │   (Mount logic)  │    │   Sources   │ │
│  └─────────────────┘    └──────────────────┘    │             │ │
│           │                       │              │ • Git Repos │ │
│           ▼                       ▼              │ • S3 Storage│ │
│  ┌─────────────────┐    ┌──────────────────┐    │ • SSH/SFTP  │ │
│  │   PVC + PV      │    │ Shared Volume    │    │ • HTTP/HTTPS│ │
│  │  (NFS Mount)    │    │   Controller     │    └─────────────┘ │
│  └─────────────────┘    └──────────────────┘           │        │
│           │                       │                    │        │
│           ▼                       ▼                    ▼        │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐ │
│  │   NFS Server    │◀───│  Volume Syncer   │◀───│    Sync     │ │
│  │  (Data Storage) │    │ (Data Sync Job)  │    │   Process   │ │
│  └─────────────────┘    └──────────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### Shared Volume Controller

The **Shared Volume Controller** is the central orchestrator running in the `shared-volume-controller-system` namespace. It manages the entire lifecycle of SharedVolume and ClusterSharedVolume resources.

**Key Responsibilities:**
- Watches for SharedVolume/ClusterSharedVolume creation and updates
- Orchestrates the creation of NFS servers and volume syncers
- Manages the lifecycle of all related components
- Handles resource cleanup when volumes are deleted

### Volume Syncer

The **Volume Syncer** is a specialized component responsible for synchronizing data from external sources to the NFS storage.

**Key Features:**
- Runs as a ReplicaSet for reliability
- Supports multiple source types (Git, S3, SSH, HTTP)
- Handles authentication and connection management
- Performs periodic synchronization based on configured intervals
- Manages sync timeouts and error handling

### NFS Server

The **NFS Server** provides the shared storage backend that pods can mount.

**Deployment Options:**
- **Dynamic NFS Server**: Automatically created and managed by the system
- **External NFS Server**: User-provided existing NFS server

### Admission Webhook

The **Admission Webhook** automatically handles volume mounting for pods with appropriate annotations.

**Functionality:**
- Intercepts pod creation requests
- Detects SharedVolume annotations
- Creates necessary PV/PVC resources
- Configures NFS mounts automatically

## Operational Flow

### SharedVolume Creation Flow

```
1. User creates SharedVolume resource
        ↓
2. Shared Volume Controller detects new resource
        ↓
3. Controller creates NFS Server in SAME namespace
        ↓
4. When NFS Server is ready, Controller creates:
   • Volume Syncer ReplicaSet
   • PVC connected to NFS Server
   • PV for the shared storage
        ↓
5. Volume Syncer starts data synchronization
        ↓
6. SharedVolume status becomes "Ready"
```

### ClusterSharedVolume Creation Flow

```
1. User creates ClusterSharedVolume resource
        ↓
2. Shared Volume Controller detects new resource
        ↓
3. Controller creates NFS Server in CONTROLLER namespace
   (shared-volume-controller)
        ↓
4. When NFS Server is ready, Controller creates:
   • Volume Syncer ReplicaSet (in ns: shared-volume-controller)
   • PVC connected to NFS Server
   • PV for the shared storage
        ↓
5. Volume Syncer starts data synchronization
        ↓
6. ClusterSharedVolume status becomes "Ready"
```

### Pod Mounting Flow

```
1. User creates Pod with SharedVolume annotation
        ↓
2. Admission Webhook intercepts pod creation
        ↓
3. Webhook identifies target SharedVolume/ClusterSharedVolume
        ↓
4. Webhook creates (if not exists):
   • PV connected to SharedVolume's NFS Server
   • PVC in Pod's namespace
        ↓
5. Webhook modifies Pod spec to include NFS mount
        ↓
6. Pod starts with shared volume mounted
```

### Resource Cleanup Flow

```
1. Last Pod using SharedVolume is deleted
        ↓
2. Controller detects no active consumers
        ↓
3. Controller deletes:
   • PVC and PV (in pod's namespace)
        ↓
4. SharedVolume/ClusterSharedVolume is deleted
        ↓
5. Controller deletes:
   • Volume Syncer ReplicaSet
   • NFS Server (if dynamically created)
   • All associated resources
```

## Deployment Topologies

### SharedVolume (Namespace-Scoped)

```
┌─────────────────────────────────────┐
│         User Namespace              │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌───────────────┐ │
│  │ User Pods   │  │ NFS Server    │ │
│  │ (mounted)   │  │ (dynamic)     │ │
│  └─────────────┘  └───────────────┘ │
│         │                │          │
│  ┌─────────────┐  ┌───────────────┐ │
│  │ PVC/PV      │  │ Volume Syncer │ │
│  │ (NFS)       │  │ (ReplicaSet)  │ │
│  └─────────────┘  └───────────────┘ │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  shared-volume-controller-system    │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐ │
│  │   Shared Volume Controller      │ │
│  │   (Orchestrator)                │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Characteristics:**
- NFS Server created in the same namespace as SharedVolume
- Volume Syncer runs in the same namespace
- Provides namespace isolation
- Ideal for team or project-specific storage

### ClusterSharedVolume (Cluster-Scoped)

```
┌─────────────────────────────────────┐
│          User Namespace             │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌───────────────┐ │
│  │ User Pods   │  │ PVC/PV        │ │
│  │ (mounted)   │  │ (NFS)         │ │
│  └─────────────┘  └───────────────┘ │
└─────────────────────────────────────┘
                       │
┌─────────────────────────────────────┐
│  shared-volume-controller-system    │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐ │
│  │   Shared Volume Controller      │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────┐  ┌───────────────┐ │
│  │ NFS Server  │  │ Volume Syncer │ │
│  │ (dynamic)   │  │ (ReplicaSet)  │ │
│  └─────────────┘  └───────────────┘ │
└─────────────────────────────────────┘
```

**Characteristics:**
- NFS Server created in controller namespace
- Volume Syncer runs in controller namespace
- Centralized management
- Ideal for organization-wide shared data

## External NFS Server Integration

When using external NFS servers, the system behavior changes:

```
┌─────────────────────────────────────┐
│         User Namespace              │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌───────────────┐ │
│  │ User Pods   │  │ Volume Syncer │ │
│  │ (mounted)   │  │ (ReplicaSet)  │ │
│  └─────────────┘  └───────────────┘ │
│         │                │          │
│  ┌─────────────┐         │          │
│  │ PVC/PV      │         │          │
│  │ (NFS)       │         │          │
│  └─────────────┘         │          │
└─────────────────────────────────────┘
         │                  │
         ▼                  ▼
┌─────────────────────────────────────┐
│       External NFS Server           │
│     (User Managed)                  │
└─────────────────────────────────────┘
```

**Key Differences:**
- No dynamic NFS server creation
- Uses existing NFS infrastructure
- Multiple SharedVolumes can reference the same NFS server
- NFS server lifecycle managed independently

## Data Flow and Synchronization

### Sync Process Flow

```
External Source ──┐
                  │
    ┌─────────────▼─────────────┐
    │     Volume Syncer         │
    │                           │
    │  1. Fetch from source     │
    │  2. Authentication        │
    │  3. Data download         │
    │  4. Write to NFS          │
    └─────────────┬─────────────┘
                  │
    ┌─────────────▼─────────────┐
    │      NFS Server           │
    │   (Shared Storage)        │
    └─────────────┬─────────────┘
                  │
    ┌─────────────▼─────────────┐
    │       User Pods           │
    │    (Read/Write data)      │
    └───────────────────────────┘
```

### Sync Triggers

1. **Periodic Sync**: Based on `syncInterval` configuration
2. **Initial Sync**: When SharedVolume is first created
3. **Manual Trigger**: Through controller API (if supported)

## Integration Points

### Kubernetes API Integration

- **Custom Resources**: SharedVolume and ClusterSharedVolume CRDs
- **Admission Controllers**: Webhook for automatic volume mounting
- **Controllers**: Standard Kubernetes controller pattern
- **RBAC**: Proper role-based access control

### Storage Integration

- **NFS Protocol**: Standard NFS v4 support
- **Persistent Volumes**: Kubernetes PV/PVC abstraction
- **Storage Classes**: Integration with cluster storage classes

### External Source Integration

- **Git Repositories**: SSH and HTTPS protocols
- **S3 Compatible Storage**: AWS S3, MinIO, etc.
- **SSH/SFTP**: Direct file transfer protocols
- **HTTP/HTTPS**: Simple file downloads

## Security Model

### Access Control

- **RBAC**: Controller permissions managed through Kubernetes RBAC
- **Namespace Isolation**: SharedVolume respects namespace boundaries
- **Secret Management**: Secure credential storage in Kubernetes secrets

### Network Security

- **NFS Security**: Standard NFS security mechanisms
- **TLS/SSL**: Encrypted connections to external sources
- **Network Policies**: Kubernetes network policy support

## Performance Considerations

### Scalability Factors

- **NFS Server Capacity**: Storage and network bandwidth limits
- **Sync Frequency**: Balance between freshness and system load
- **Concurrent Access**: Multiple pods accessing shared storage
- **Resource Limits**: CPU and memory for syncer components

### Optimization Strategies

- **Sync Intervals**: Tune based on data change frequency
- **Resource Limits**: Set appropriate CPU/memory limits
- **Storage Classes**: Use appropriate storage backends
- **Network Optimization**: Consider NFS mount options

## Monitoring and Observability

### Key Metrics

- SharedVolume/ClusterSharedVolume status and health
- Sync operation success/failure rates
- NFS server performance and availability
- Storage utilization and growth

### Logging

- Controller operation logs
- Volume syncer operation logs
- NFS server access logs
- Webhook operation logs

## Troubleshooting Architecture

### Common Issues

1. **Sync Failures**: Network connectivity, authentication
2. **Mount Issues**: NFS server availability, permissions
3. **Performance Problems**: Storage bottlenecks, network latency
4. **Resource Conflicts**: Namespace permissions, RBAC issues

### Debug Flow

```
1. Check SharedVolume/ClusterSharedVolume status
        ↓
2. Verify NFS server health and accessibility
        ↓
3. Check Volume Syncer logs and status
        ↓
4. Validate external source connectivity
        ↓
5. Review pod mounting and PVC/PV status
```

This architecture provides a robust, scalable solution for shared storage with automatic data synchronization, supporting both namespace-scoped and cluster-scoped use cases while maintaining security and operational simplicity.
