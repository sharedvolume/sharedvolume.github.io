# Helm Values Reference

Complete reference for all Helm chart configuration values.

## Chart Information

- Chart Name: `shared-volume`
- Repository: `https://sharedvolume.github.io/helm-charts`

## Global Values

*TODO: Global configuration values that affect multiple components.*

```yaml
# Global configuration
global:
  # Image registry settings
  imageRegistry: ""                    # Global image registry override
  imagePullSecrets: []                # Global image pull secrets
  
  # Common labels and annotations
  commonLabels: {}                    # Labels applied to all resources
  commonAnnotations: {}               # Annotations applied to all resources
  
  # Security context
  securityContext:
    runAsNonRoot: true
    runAsUser: 65534
    fsGroup: 65534
```

## Controller Configuration

*TODO: Shared Volume controller configuration.*

```yaml
# Shared Volume Controller
controller:
  # Image configuration
  image:
    repository: sharedvolume/shared-volume-controller
    tag: ""                          # Defaults to chart appVersion
    pullPolicy: IfNotPresent
  
  # Deployment configuration
  replicaCount: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  
  # Resource configuration
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
  
  # Security context
  securityContext:
    allowPrivilegeEscalation: false
    capabilities:
      drop:
      - ALL
    readOnlyRootFilesystem: true
  
  # Node selection
  nodeSelector: {}
  tolerations: []
  affinity: {}
  
  # Service account
  serviceAccount:
    create: true
    name: ""
    annotations: {}
  
  # RBAC
  rbac:
    create: true
  
  # Metrics and monitoring
  metrics:
    enabled: true
    port: 8080
    serviceMonitor:
      enabled: false
      interval: 30s
  
  # Logging
  logging:
    level: info                      # debug, info, warn, error
    format: json                     # json, text
```

## Volume Syncer Configuration

*TODO: Volume syncer component configuration.*

```yaml
# Volume Syncer
syncer:
  # Image configuration
  image:
    repository: sharedvolume/volume-syncer
    tag: ""
    pullPolicy: IfNotPresent
  
  # Default resource limits for sync jobs
  defaultResources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 1000m
      memory: 1Gi
  
  # Sync job configuration
  job:
    backoffLimit: 3
    activeDeadlineSeconds: 3600
    ttlSecondsAfterFinished: 86400
  
  # Security context for sync jobs
  securityContext:
    runAsNonRoot: true
    runAsUser: 65534
    fsGroup: 65534
```

## NFS Server Configuration

*TODO: NFS server configuration (when enabled).*

```yaml
# NFS Server (optional)
nfsServer:
  # Enable NFS server deployment
  enabled: false
  
  # Image configuration
  image:
    repository: sharedvolume/nfs-server
    tag: ""
    pullPolicy: IfNotPresent
  
  # Controller configuration
  controller:
    image:
      repository: sharedvolume/nfs-server-controller
      tag: ""
      pullPolicy: IfNotPresent
    
    resources:
      requests:
        cpu: 50m
        memory: 64Mi
      limits:
        cpu: 200m
        memory: 256Mi
  
  # Default NFS server configuration
  defaults:
    replicas: 1
    storage:
      size: 10Gi
      storageClass: ""
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 500m
        memory: 512Mi
```

## Installation Configuration

*TODO: Installation and CRD configuration.*

```yaml
# Installation configuration
installation:
  # CRD management
  crds:
    create: true                     # Create CRDs during installation
    upgrade: true                    # Upgrade CRDs during upgrade
  
  # Namespace configuration
  namespace:
    create: true
    name: shared-volume-system
```

## Example Values Files

*TODO: Complete example configurations for different scenarios.*

### Development Environment

```yaml
# values-dev.yaml
controller:
  replicaCount: 1
  resources:
    requests:
      cpu: 50m
      memory: 64Mi
    limits:
      cpu: 200m
      memory: 256Mi
  
  logging:
    level: debug

syncer:
  defaultResources:
    requests:
      cpu: 50m
      memory: 64Mi
    limits:
      cpu: 200m
      memory: 256Mi
```

### Production Environment

```yaml
# values-prod.yaml
controller:
  replicaCount: 2
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 1Gi
  
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: shared-volume-controller
          topologyKey: kubernetes.io/hostname
  
  metrics:
    enabled: true
    serviceMonitor:
      enabled: true
```
