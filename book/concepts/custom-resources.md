# Custom Resources (CRDs)

Shared Volume extends Kubernetes with three custom resources that define how volumes are managed and synchronized. These CRDs work together to provide seamless data sharing across pods and namespaces.

## SharedVolume (sv)

The `SharedVolume` resource is **namespace-scoped** and defines a shared volume within a specific namespace.

### Purpose
- Create shared storage that can be accessed by multiple pods within the same namespace
- Sync data from external sources (Git, S3, HTTP, SSH) into the shared storage
- Provide read-only or read-write access to synchronized data

### Use Cases
- Sharing configuration files across microservices in a namespace
- Distributing static assets to web applications
- Providing shared datasets for development environments

```yaml
apiVersion: sv.sharedvolume.io/v1alpha1
kind: SharedVolume
metadata:
  name: app-config
  namespace: production
spec:
  storageClassName: "standard"
  syncInterval: "5m"
  syncTimeout: "30s"
  mountPath: "/opt/mnt"
  # nfsServer: placeholder_nfs_host (This should be the NFS server address when using external NFS)
  storage:
    capacity: "500Mi"
    # accessMode: ReadWrite # Default is ReadOnly
  source:
    source:
      type: git
      url: "https://github.com/mycompany/app-configs.git"
      branch: "production"
```

## ClusterSharedVolume (csv)

The `ClusterSharedVolume` resource is **cluster-scoped** and can be used across multiple namespaces.

### Purpose
- Create shared storage accessible from any namespace in the cluster
- Enable cross-namespace data sharing without namespace isolation restrictions
- Centrally manage common datasets that multiple teams need access to

### Use Cases
- Sharing ML models or datasets across different teams/namespaces
- Distributing corporate policies, certificates, or compliance data
- Providing common libraries or tools accessible cluster-wide
- Cross-namespace collaboration on shared resources

```yaml
apiVersion: sv.sharedvolume.io/v1alpha1
kind: ClusterSharedVolume
metadata:
  name: my-csv
spec:
  storageClassName: "standard"
  syncInterval: "1m"
  syncTimeout: "30s"
  mountPath: "/opt/mnt"
  # nfsServer: placeholder_nfs_host (This should be the NFS server address when using external NFS)
  storage:
    capacity: "1Gi"
    # accessMode: ReadWrite # Default is ReadOnly
  source:
    source:
      type: git
      url: "https://github.com/example/demo-data.git" # Change here
```

## NfsServer (nfs)

The `NfsServer` resource manages **dynamic NFS server instances** for backend storage.

### Purpose
- Automatically provision NFS servers to store synchronized data
- Provide the underlying storage backend for SharedVolume and ClusterSharedVolume
- Handle NFS server lifecycle (creation, scaling, deletion)
- Enable high availability through replica management

### Use Cases
- Automatically creating dedicated NFS storage for each shared volume
- Scaling NFS server replicas for high availability
- Managing NFS server resources and configuration
- Providing storage backend when external NFS is not available

```yaml
apiVersion: nfs.sharedvolume.io/v1alpha1
kind: NfsServer
metadata:
  name: ml-models-nfs
  namespace: shared-volume-controller-system
spec:
  replicas: 2
  storageClass: "fast-ssd"
  capacity: "10Gi"
  resources:
    requests:
      cpu: "100m"
      memory: "128Mi"
    limits:
      cpu: "500m"
      memory: "512Mi"
```

## Resource Relationships

### How They Work Together

1. **SharedVolume/ClusterSharedVolume** → **NfsServer**
   - When you create a SharedVolume or ClusterSharedVolume, the controller automatically creates an NfsServer resource
   - The NfsServer provides the storage backend for the shared volume
   - Data from external sources is synced into the NFS server storage

2. **NfsServer** → **Kubernetes Resources**
   - NfsServer creates underlying Kubernetes resources (Deployments, Services, PVCs)
   - Manages NFS server pods that provide the actual storage service
   - Handles networking and access control for the NFS endpoints

3. **Pods** → **SharedVolume/ClusterSharedVolume**
   - Pods use annotations to request access to shared volumes
   - The admission controller automatically injects volume mounts and NFS configuration
   - Pods access data through standard Kubernetes volume mounts

### Lifecycle Flow

```
External Source (Git/S3/HTTP/SSH)
           ↓
    Volume Syncer Pod
           ↓
      NFS Server Pod(s)
           ↓
   Consumer Pod(s) via Volume Mounts
```
