# Annotations

Annotations provide a simple, declarative way for pods to attach to shared volumes. The admission controller automatically injects the necessary volume mounts based on these annotations.

## How Annotations Work

When you add SharedVolume annotations to a pod, the admission webhook:
1. **Detects the annotations** during pod creation
2. **Validates the referenced volumes** exist and are accessible
3. **Automatically injects volume mounts** into the pod spec
4. **Configures NFS mounts** to connect to the appropriate shared storage

## Annotation Types

### ClusterSharedVolume Annotation

Use `sharedvolume.csv` to attach ClusterSharedVolume resources:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: consumer-pod
  annotations:
    sharedvolume.csv: "http-csv,success-nosource-csv-1"
spec:
  containers:
  - name: app
    image: alpine:3.18
    command: ["sleep", "3600"]
```

### SharedVolume Annotation

Use `sharedvolume.sv` to attach SharedVolume resources:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: consumer-pod
  annotations:
    sharedvolume.sv: "http-sv,success-nosource-sv-1"
spec:
  containers:
  - name: app
    image: alpine:3.18
    command: ["sleep", "3600"]
```

## Multiple Volume Attachment

You can attach multiple shared volumes to a single pod by listing them comma-separated:

### Single Volume
```yaml
annotations:
  sharedvolume.csv: "my-config-volume"
```

### Multiple Volumes
```yaml
annotations:
  sharedvolume.csv: "config-volume,data-volume,assets-volume"
  sharedvolume.sv: "namespace-specific-volume"
```

### Mixed Volume Types
```yaml
annotations:
  sharedvolume.csv: "global-config,shared-assets"
  sharedvolume.sv: "app-config,local-data"
```

## Volume Configuration

All volume configuration is handled in the SharedVolume or ClusterSharedVolume resource specification:

- **Mount Path**: Defined in the `mountPath` field of the SV/CSV spec
- **Access Mode**: Configured in the `storage.accessMode` field (ReadOnly/ReadWrite)
- **Capacity**: Specified in the `storage.capacity` field
- **Sync Settings**: Controlled by `syncInterval` and `syncTimeout`

**No mount options, access modes, or paths are specified in annotations** - they are all inherited from the volume resource definition.

## Annotation Examples

### Development Environment
```yaml
metadata:
  annotations:
    sharedvolume.csv: "common-configs"
    sharedvolume.sv: "dev-workspace"
```

### Production Application
```yaml
metadata:
  annotations:
    sharedvolume.csv: "app-configs,certificates,static-assets"
```

### Data Processing Pipeline
```yaml
metadata:
  annotations:
    sharedvolume.csv: "input-datasets,ml-models"
    sharedvolume.sv: "processing-workspace"
```

## Best Practices

### Naming Conventions
- Use descriptive names for shared volumes
- Include environment or purpose in the name
- Avoid special characters except hyphens

### Volume Organization
- Use ClusterSharedVolume for data shared across namespaces
- Use SharedVolume for namespace-specific data
- Group related volumes logically

### Pod Design
- Attach only necessary volumes to reduce complexity
- Consider volume access patterns when designing applications
- Test volume accessibility before deploying to production
