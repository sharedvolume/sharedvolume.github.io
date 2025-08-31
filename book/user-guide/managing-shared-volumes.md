# Managing SharedVolumes

Learn how to effectively manage SharedVolumes and ClusterSharedVolumes throughout their lifecycle.

## Resource Overview

### SharedVolume (sv)
- **API Group**: `sv.sharedvolume.io/v1alpha1`
- **Scope**: Namespace-scoped
- **Short Name**: `sv`
- **Plural**: `sharedvolumes`

### ClusterSharedVolume (csv)
- **API Group**: `sv.sharedvolume.io/v1alpha1`
- **Scope**: Cluster-scoped
- **Short Name**: `csv`
- **Plural**: `clustersharedvolumes`

## Creating SharedVolumes

### Basic SharedVolume Creation

```yaml
apiVersion: sv.sharedvolume.io/v1alpha1
kind: SharedVolume
metadata:
  name: my-app-config
  namespace: production
spec:
  mountPath: "/opt/mnt/config"
  syncInterval: "5m"
  syncTimeout: "30s"
  storageClassName: "standard"
  storage:
    capacity: "1Gi"
    accessMode: "ReadOnly"
  source:
    git:
      url: "https://github.com/mycompany/app-configs.git"
      branch: "production"
```

### Basic ClusterSharedVolume Creation

```yaml
apiVersion: sv.sharedvolume.io/v1alpha1
kind: ClusterSharedVolume
metadata:
  name: shared-ml-models
spec:
  mountPath: "/opt/mnt/models"
  syncInterval: "1h"
  syncTimeout: "5m"
  storageClassName: "fast-ssd"
  storage:
    capacity: "10Gi"
    accessMode: "ReadOnly"
  source:
    s3:
      bucketName: "ml-models-bucket"
      endpointUrl: "https://s3.amazonaws.com"
      region: "us-west-2"
      path: "production-models"
      accessKeyFromSecret:
        name: "s3-credentials"
        key: "access-key"
      secretKeyFromSecret:
        name: "s3-credentials"
        key: "secret-key"
```

### No-Source Volume (Manual Management)

```yaml
apiVersion: sv.sharedvolume.io/v1alpha1
kind: SharedVolume
metadata:
  name: workspace
  namespace: development
spec:
  mountPath: "/opt/mnt/workspace"
  storageClassName: "standard"
  storage:
    capacity: "5Gi"
    accessMode: "ReadWrite"
  # No source specified - manual data management
```

## Managing Resources

### Listing Resources

```bash
# List SharedVolumes in current namespace
kubectl get sv

# List SharedVolumes in all namespaces
kubectl get sv -A

# List ClusterSharedVolumes
kubectl get csv

# Detailed output with additional columns
kubectl get sv -o wide
kubectl get csv -o wide
```

### Viewing Resource Details

```bash
# Describe a SharedVolume
kubectl describe sv my-app-config -n production

# Get YAML output
kubectl get sv my-app-config -n production -o yaml

# Check ClusterSharedVolume status
kubectl get csv shared-ml-models -o yaml
```

## Status Monitoring

### Status Fields

Both SharedVolume and ClusterSharedVolume provide these status fields:

```yaml
status:
  phase: "Ready"                    # Current phase: Preparing, Ready, Failed
  message: "Volume is ready"        # Additional information
  nfsServerAddress: "nfs-sv-abc123.shared-volume-controller.svc.cluster.local"
  serviceName: "nfs-sv-abc123"      # NFS service name
  persistentVolumeName: "pv-abc123" # Associated PV name
  persistentVolumeClaimName: "pvc-abc123" # Associated PVC name
```

### Phase Monitoring

```bash
# Monitor phase transitions
kubectl get sv my-app-config -w

# Check for Ready volumes
kubectl get sv --field-selector status.phase=Ready

# Find volumes with issues
kubectl get sv --field-selector status.phase=Failed
```

### Additional Status Columns

The default `kubectl get` output includes these columns:

- **Phase**: Current phase (Preparing, Ready, Failed)
- **NFS Address**: NFS server endpoint address
- **Mount Path**: Where the volume is mounted in pods
- **SyncInterval**: How often sync occurs
- **Capacity**: Storage capacity allocated

## Spec Parameters

### Core Configuration

#### `mountPath` (required)
- **Type**: string
- **Description**: The path where the volume will be mounted inside consuming pods
- **Example**: `"/opt/mnt/data"`

#### `storageClassName` (optional)
- **Type**: string
- **Description**: The storage class to use for the underlying PVC
- **Default**: Uses cluster default storage class
- **Example**: `"fast-ssd"`, `"standard"`

#### `syncInterval` (optional)
- **Type**: string
- **Description**: How often to check for updates from the source
- **Format**: Duration string (e.g., "1m", "5m", "1h")
- **Default**: Varies by implementation
- **Example**: `"5m"`

#### `syncTimeout` (optional)
- **Type**: string
- **Description**: Maximum time allowed for a sync operation to complete
- **Format**: Duration string
- **Default**: Varies by implementation
- **Example**: `"30s"`

### Storage Configuration

#### `storage.capacity` (required)
- **Type**: string
- **Description**: The amount of storage to allocate for the volume
- **Format**: Kubernetes resource quantity
- **Example**: `"1Gi"`, `"500Mi"`, `"10Gi"`

#### `storage.accessMode` (optional)
- **Type**: string
- **Description**: Access mode for the storage
- **Values**: `"ReadOnly"`, `"ReadWrite"`
- **Default**: `"ReadOnly"`

### NFS Server Configuration

The `nfsServer` section allows you to specify an external NFS server instead of using the dynamically created one.

#### `nfsServer.url` (optional)
- **Type**: string
- **Description**: URL/address of an external NFS server
- **Example**: `"nfs-sv-goazfn8g1e50.sv-csv-test-ns-1.svc.cluster.local"`, `"nfs.example.com"`

#### `nfsServer.path` (optional)
- **Type**: string
- **Description**: Path on the NFS server to mount
- **Example**: `"/"`, `"/exports/data"`

#### External NFS Example
```yaml
spec:
  nfsServer:
    url: "example-nfs-host.example.com"
    path: "/"
```

#### `nfsServer.image` (optional)
- **Type**: string
- **Description**: Container image to use for NFS server
- **Usage**: For custom NFS server images

### Source Configuration

#### `source` (optional)
- **Type**: object
- **Description**: External data source configuration
- **Note**: If omitted, creates a volume with no external sync

The `source` field supports multiple source types including Git, S3, SSH, and HTTP. Each source type has its own specific parameters for authentication and configuration. See the [Volume Sources & Sync](../concepts/volume-sources-sync.md) documentation for detailed source configuration options.

## Updating SharedVolumes

### Safe Updates
These fields can be updated without recreating resources:
- `syncInterval`
- `syncTimeout`
- Source credentials (when using secrets)
- Source branch (for Git)
- Source path (for S3/SSH)

```bash
# Update sync interval
kubectl patch sv my-config -p '{"spec":{"syncInterval":"10m"}}'

# Update Git branch
kubectl patch sv my-config -p '{"spec":{"source":{"git":{"branch":"staging"}}}}'
```

### Updates Requiring Recreation
These changes require deleting and recreating the resource:
- `mountPath`
- `storage.capacity`
- `storageClassName`
- Source type (git → s3, etc.)

## Troubleshooting

### Common Issues

**Volume Stuck in Preparing**
```bash
# Check NFS server pod logs
kubectl logs -n shared-volume-controller -l csv=my-csv

# Check events
kubectl get events --field-selector involvedObject.name=my-csv
```

**Sync Failures**
```bash
# Check volume-syncer logs
kubectl logs -n shared-volume-controller -l app=volume-syncer,csv=my-csv -f

# Verify source connectivity
kubectl exec -n shared-volume-controller deploy/volume-syncer -- nslookup github.com
```

**Mount Issues in Pods**
```bash
# Check pod events
kubectl describe pod my-pod

# Verify NFS connectivity
kubectl exec my-pod -- mount | grep nfs
```

## Best Practices

### Resource Naming
- Use descriptive names that indicate purpose
- Include environment in name when appropriate
- Follow consistent naming conventions across team

### Source Management
- Use secrets for all credentials in production
- Rotate credentials regularly
- Use least-privilege access for source systems

### Storage Planning
- Plan capacity based on expected data growth
- Use appropriate storage classes for performance needs
- Monitor storage usage and adjust as needed

### Sync Configuration
- Set `syncInterval` based on data change frequency
- Use longer intervals for large datasets
- Set appropriate `syncTimeout` for source reliability

### Security
- Use ReadOnly access mode when possible
- Restrict namespace access for sensitive SharedVolumes
- Use ClusterSharedVolumes sparingly and with proper RBAC
