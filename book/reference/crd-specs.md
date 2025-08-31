# CRD Specifications

Complete reference for all Custom Resource Definitions used by Shared Volume.

## SharedVolume

*TODO: Complete API specification for SharedVolume.*

### API Version
- Group: `sharedvolume.io`
- Version: `v1`
- Kind: `SharedVolume`

### Spec Fields

*TODO: Detailed field descriptions with examples.*

```yaml
apiVersion: sharedvolume.io/v1
kind: SharedVolume
metadata:
  name: example-volume
  namespace: default
spec:
  # Source configuration
  source:
    # Git source
    git:
      repository: string      # Required: Git repository URL
      branch: string         # Optional: Branch name (default: main)
      path: string           # Optional: Subdirectory path
      auth:                  # Optional: Authentication
        secretRef:
          name: string       # Secret containing credentials
    
    # S3 source
    s3:
      bucket: string         # Required: S3 bucket name
      prefix: string         # Optional: Object prefix/path
      region: string         # Optional: AWS region
      auth:                  # Optional: Authentication
        secretRef:
          name: string       # Secret containing credentials
    
    # HTTP source
    http:
      url: string           # Required: HTTP(S) URL
      auth:                 # Optional: Authentication
        secretRef:
          name: string      # Secret containing credentials
    
    # SSH source
    ssh:
      host: string          # Required: SSH host
      path: string          # Required: Remote path
      port: int            # Optional: SSH port (default: 22)
      auth:                # Optional: Authentication
        secretRef:
          name: string     # Secret containing SSH key
  
  # Backend configuration
  backend:
    # Local storage (default)
    local:
      storageClass: string  # Optional: StorageClass for PVC
      size: string         # Optional: Volume size (default: 1Gi)
    
    # NFS backend
    nfs:
      server: string       # NFS server address or "auto"
      path: string         # NFS export path
      options: []string    # Optional: Mount options
  
  # Sync configuration
  sync:
    schedule: string       # Optional: Cron schedule for periodic sync
    webhook:              # Optional: Webhook trigger configuration
      enabled: bool
      secret: string
    manual: bool          # Optional: Manual sync only (default: false)
  
  # Access configuration
  access:
    mode: string          # Optional: Access mode (ReadWriteMany, ReadOnlyMany)
    uid: int             # Optional: User ID for file ownership
    gid: int             # Optional: Group ID for file ownership
```

### Status Fields

*TODO: Status field descriptions.*

```yaml
status:
  phase: string           # Current phase (Pending, Syncing, Ready, Failed)
  lastSyncTime: string   # Timestamp of last successful sync
  syncHash: string       # Hash of current sync content
  conditions:            # Detailed condition information
  - type: string
    status: string
    reason: string
    message: string
    lastTransitionTime: string
```

## ClusterSharedVolume

*TODO: Complete API specification for ClusterSharedVolume.*

### API Version
- Group: `sharedvolume.io`
- Version: `v1`
- Kind: `ClusterSharedVolume`

### Spec Fields

*TODO: ClusterSharedVolume spec (similar to SharedVolume but cluster-scoped).*

## NfsServer

*TODO: Complete API specification for NfsServer.*

### API Version
- Group: `sharedvolume.io`
- Version: `v1`
- Kind: `NfsServer`

### Spec Fields

*TODO: NfsServer spec fields.*

```yaml
apiVersion: sharedvolume.io/v1
kind: NfsServer
metadata:
  name: example-nfs
  namespace: shared-volume-system
spec:
  # Storage configuration
  storage:
    size: string          # Storage size for NFS server
    storageClass: string  # StorageClass for underlying storage
  
  # Server configuration
  replicas: int          # Number of NFS server replicas
  resources:             # Resource requirements
    requests:
      cpu: string
      memory: string
    limits:
      cpu: string
      memory: string
  
  # Export configuration
  exports:
  - path: string         # Export path
    options: []string    # NFS export options
    accessModes: []string # Access modes allowed
```

## Field Validation

*TODO: Validation rules and constraints for all fields.*
