# Volume Lifecycle

Understanding the volume lifecycle helps you track and manage your shared volumes effectively. This document explains how SharedVolume and ClusterSharedVolume resources progress through their lifecycle stages.

## Lifecycle Stages

### 1. Create
When you apply a SharedVolume or ClusterSharedVolume resource:

- **Resource Registration**: The Kubernetes API server accepts and stores the resource
- **Controller Detection**: The SharedVolume controller detects the new resource
- **Validation**: The controller validates the resource specification
- **NFS Server Provisioning**: 
  - **For SharedVolume**: NFS server is created in the **same namespace** as the SharedVolume
  - **For ClusterSharedVolume**: NFS server is created in the **shared-volume-controller** namespace
- **Initial Status**: The resource shows no status initially, then transitions to `Preparing`

```bash
kubectl apply -f my-csv.yaml
# Status: (empty) → Preparing

# Check where NFS server is created:
# SharedVolume: kubectl get pods -n <sv-namespace>
# ClusterSharedVolume: kubectl get pods -n shared-volume-controller
```

### 2. Sync
The synchronization is handled internally by the volume-syncer and doesn't affect the resource status:

- **Volume Syncer Pod Creation**: 
  - **For SharedVolume**: Volume syncer is created in the **same namespace** as the SharedVolume
  - **For ClusterSharedVolume**: Volume syncer is created in the **shared-volume-controller** namespace
- **NFS Server Ready**: NFS server becomes reachable (status: Ready)
- **Background Sync**: The volume-syncer handles all synchronization operations internally:
  - Source Connection: Establishes connection to external sources (Git, S3, HTTP, SSH)
  - Data Download: Downloads and validates content
  - NFS Storage: Writes data to NFS server storage
  - Periodic Updates: Continues syncing based on `syncInterval`

```bash
# Monitor sync progress based on resource type:

# For SharedVolume (in same namespace):
kubectl logs -n <sv-namespace> -l app=volume-syncer,sv=<sv-name> -f

# For ClusterSharedVolume (in controller namespace):
kubectl logs -n shared-volume-controller -l app=volume-syncer,csv=<csv-name> -f
```

## PV/PVC Management

### NFS Server Storage

When an NFS server object is created, the following storage resources are provisioned:

- **PersistentVolume (PV)**: Created if storageClass is not used (not auto-generated)
- **PersistentVolumeClaim (PVC)**: Always created to connect to the NFS server
- **Storage Backend**: The PVC and PV provide storage for the NFS server data

```bash
# Check NFS server storage resources
kubectl get pv | grep <nfs-server-name>
kubectl get pvc -n <namespace> | grep <nfs-server-name>

# Check NFS server status
kubectl get nfs
NAME                  READY   ADDRESS                                                CAPACITY
nfs-sv-zlp29eh5cmhw   true    nfs-sv-zlp29eh5cmhw.nfs-server-controller-system.svc   1Gi
```

### Pod Mount Storage

When pods are mounted with annotations, PV/PVC resources are managed per namespace:

#### First Pod in Namespace
- **No existing pods**: If no pod in the current namespace is using the same SV/CSV
  - New PV and PVC are created connecting to the NFS server
  - Pod mounts the volume through the newly created PVC

#### Additional Pods in Namespace
- **Existing pods**: If other pods in the namespace already use the same SV/CSV
  - **Reuses existing PVC**: No new PV/PVC created
  - Pod shares the same PVC as other pods in the namespace

#### Last Pod Cleanup
- **Pod termination**: When the last pod using the SV/CSV in a namespace is removed
  - PV and PVC are automatically cleaned up
  - Storage resources are reclaimed

```bash
# Check pod-level PV/PVC usage in a namespace
kubectl get pvc -n <namespace>
kubectl get pods -n <namespace> -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.volumes[*].persistentVolumeClaim.claimName}{"\n"}{end}'

# Monitor cleanup after last pod removal
kubectl delete pod <last-pod-using-csv>
kubectl get pvc -n <namespace>  # Should show cleanup
```

### 3. Consume
Pods attach to and consume the shared volume:

- **Pod Creation**: Pods are created with SharedVolume annotations
- **Admission Controller**: The admission webhook injects volume mounts automatically
- **PV/PVC Management**: 
  - **First pod in namespace**: Creates new PV and PVC connecting to NFS server
  - **Additional pods**: Reuse existing PVC in the same namespace
- **NFS Mount**: Pods mount the NFS share through the PVC to the specified mount path
- **Data Access**: Applications can read (and write if configured) the synchronized data
- **Active Usage**: Multiple pods can simultaneously access the shared data through shared PVC

```yaml
metadata:
  annotations:
    sharedvolume.csv: "my-csv"  # Triggers automatic volume injection and PV/PVC management
```
- **Data Access**: Applications can read (and write if configured) the synchronized data
- **Active Usage**: Multiple pods can simultaneously access the shared data

```yaml
metadata:
  annotations:
    sharedvolume.csv: "my-csv"  # Triggers automatic volume injection
```

### 4. Persist
Data persistence and ongoing synchronization:

- **Periodic Sync**: Volume syncer runs periodic updates based on `syncInterval`
- **Change Detection**: New commits, file changes, or updates are detected
- **Incremental Updates**: Only changed data is synchronized to minimize overhead
- **Data Durability**: NFS server maintains data persistence across pod restarts
- **Backup Integration**: NFS storage can be backed up using standard Kubernetes backup tools

## State Transitions

SharedVolume and ClusterSharedVolume resources transition through these states:

```
    [Created] ──────────────→ [Preparing]
        │                        │
        ↓                        ↓
   [Failed] ←────────────────[Ready]
        │                        │
        ↓                        ↓
   [Terminating] ←──────────[Ready]
        │                   (ongoing)
        ↓                        
   [Deleted]                     
```

### State Descriptions

- **Preparing**: NFS server is up and running, volume-syncer is being deployed
- **Ready**: NFS server is reachable and volume-syncer is up, volume is available for consumption
- **Failed**: Error occurred during provisioning
- **Terminating**: Resource deletion in progress
- **Deleted**: Resource and associated storage cleaned up

### Status Examples

When you run `kubectl get sv` or `kubectl get csv`, you'll see status progression like this:

```bash
# Initial state - no status shown, NFS endpoint being created
kubectl get csv http-csv
NAME       STATUS    ENDPOINT   MOUNT         INTERVAL   CAPACITY
http-csv             /opt/mnt/http1   1m             1Gi

# Preparing state - NFS server up, volume-syncer starting
kubectl get csv http-csv
NAME       STATUS      ENDPOINT                                                      MOUNT         INTERVAL   CAPACITY
http-csv   Preparing   nfs-sv-golii49g2216.shared-volume-controller.svc.cluster.local   /opt/mnt/http1   1m             1Gi

# Ready state - NFS server reachable, volume-syncer operational
kubectl get csv http-csv
NAME       STATUS   ENDPOINT                                                      MOUNT         INTERVAL   CAPACITY
http-csv   Ready    nfs-sv-pnr12zledikp.shared-volume-controller.svc.cluster.local   /opt/mnt/http1   1m             1Gi
```

**Important**: The "Ready" status means the volume is accessible. Data synchronization is handled internally by the volume-syncer and doesn't change the resource status.
- **Updating**: Periodic sync updating the data
- **Failed**: Error occurred during sync or provisioning
- **Terminating**: Resource deletion in progress
- **Deleted**: Resource and associated storage cleaned up

## Lifecycle Events

Kubernetes events are generated throughout the lifecycle:

```bash
# View lifecycle events
kubectl get events --field-selector involvedObject.name=my-csv

# Common events:
# - NfsServerCreated: NFS server provisioned successfully
# - SyncStarted: Data synchronization initiated
# - SyncCompleted: Initial sync finished successfully
# - SyncFailed: Synchronization encountered an error
# - VolumeReady: Volume ready for pod consumption
# - PodAttached: Pod successfully mounted the volume
# - SyncUpdated: Periodic sync completed
```

## Monitoring Lifecycle

### Command Line Monitoring

```bash
# Check resource status
kubectl get csv my-csv -o yaml

# Monitor sync logs
kubectl logs -n shared-volume-controller -l csv=my-csv

# Watch NFS server status
kubectl get pods -n shared-volume-controller | grep my-csv

# Check volume usage by pods
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.annotations.sharedvolume\.csv}{"\n"}{end}'
```

### Status Fields

The resource status provides detailed lifecycle information:

```yaml
status:
  phase: "Ready"
  conditions:
    - type: "NfsServerReady"
      status: "True"
      lastTransitionTime: "2024-01-01T10:00:00Z"
    - type: "SyncCompleted"
      status: "True"
      lastTransitionTime: "2024-01-01T10:05:00Z"
  nfsServer:
    endpoint: "my-csv-nfs.shared-volume-controller.svc.cluster.local"
    path: "/data"
  lastSyncTime: "2024-01-01T10:05:00Z"
  syncStatus: "Success"
```

## Cleanup and Garbage Collection

### Manual Cleanup

```bash
# Delete the SharedVolume/ClusterSharedVolume
kubectl delete csv my-csv

# This triggers:
# 1. Pod volume unmounting
# 2. NFS server shutdown
# 3. Storage reclamation
# 4. Resource deletion
```

### Automatic Cleanup

- **Pod Termination**: Volume mounts are automatically cleaned up when pods terminate
- **Unused Volumes**: NFS servers remain active as long as the CSV/SV exists
- **Failed Resources**: Failed resources require manual intervention and cleanup
- **Storage Reclamation**: PVCs are deleted when NFS servers are removed

### Cleanup Verification

```bash
# Verify complete cleanup
kubectl get csv my-csv  # Should return "NotFound"
kubectl get pods -n shared-volume-controller | grep my-csv  # Should be empty
kubectl get pvc -n shared-volume-controller | grep my-csv   # Should be empty
```

## Best Practices

### Lifecycle Management
- Monitor sync status regularly using `kubectl get csv`
- Set appropriate `syncInterval` based on data change frequency
- Use `syncTimeout` to prevent hanging sync operations
- Implement health checks in consuming applications

### Resource Planning
- Plan storage capacity based on data size and growth
- Consider NFS server resource requirements for high-traffic volumes
- Use appropriate storage classes for performance requirements
- Monitor resource usage and adjust limits as needed

### Troubleshooting
- Check controller logs for lifecycle issues
- Verify network connectivity for external sources
- Ensure proper RBAC permissions for service accounts
- Monitor storage usage and availability
