# Volume Sources & Sync

Shared Volume supports multiple external data sources and synchronization methods, including the option to create volumes without any external source.

## No Source (Local Storage Only)

You can create SharedVolume or ClusterSharedVolume resources without any external source, providing just shared storage for manual data management:

```yaml
apiVersion: sv.sharedvolume.io/v1alpha1
kind: SharedVolume
metadata:
  name: nosource-sv
spec:
  mountPath: "/opt/mnt/nosource"
  storageClassName: "standard"
  storage:
    capacity: "1Gi"
```

This creates a shared volume with no automatic synchronization from external sources, useful for:
- Manual data sharing between pods
- Application-managed data storage
- Temporary shared workspace

## Supported Sources

### Git Repositories

Sync data from Git repositories with various authentication methods:

#### Basic Git Source
```yaml
source:
  source:
    type: git
    url: "https://github.com/example/demo-data.git"
```

Git sources support authentication through hardcoded credentials, username/password, or SSH private keys. Credentials can be provided directly in the spec or referenced from Kubernetes secrets for enhanced security.

### SSH Sources

Sync data from remote SSH servers:

```yaml
source:
  ssh:
    host: "ssh.example.com"
    port: 22
    user: "user2"
    password: "password1"
    path: "/opt/demo"
```

SSH sources support authentication through passwords, private keys, or credentials from Kubernetes secrets. You can specify host, port, username, and the remote path to sync.

### S3 Compatible Storage

Sync data from S3-compatible storage systems:

```yaml
source:
  s3:
    bucketName: "testbucket"
    endpointUrl: "http://s3.example.com:9010"
    region: "us-east-1"
    accessKey: "minioadmin"
    secretKey: "minioadmin123"
    path: "x"
```

S3 sources support various S3-compatible storage systems including AWS S3, MinIO, and others. Credentials can be provided directly or referenced from Kubernetes secrets. You can specify custom endpoints for non-AWS S3-compatible services.

### HTTP/HTTPS Sources

Sync individual files from HTTP/HTTPS endpoints:

```yaml
source:
  http:
    url: "https://github.com/distribution/distribution/blob/6affafd1f030087d88f88841bf66a8abe2bf4d24/contrib/apache/README.MD"
```

This example syncs the README.md file from the GitHub URL. HTTP sources support authentication through headers and can fetch individual files from web endpoints.

## Synchronization Behavior

### Sync Triggers
- **Periodic Sync**: Based on `syncInterval` (e.g., "1m", "5m", "1h")
- **Initial Sync**: Triggered when volume-syncer pod starts

### Sync Process
1. **Connection**: Establish connection to external source
2. **Download**: Fetch data using specified authentication
3. **Validation**: Verify data integrity and format
4. **Update**: Write new data to NFS server storage
5. **Cleanup**: Remove temporary files and close connections

### Sync Configuration
```yaml
spec:
  syncInterval: "5m"    # How often to check for updates
  syncTimeout: "30s"    # Maximum time allowed for sync operation
  retryPolicy:
    maxRetries: 3
    backoffInterval: "10s"
```

## Authentication and Security

### Credential Options
All source types support multiple authentication methods:
- **Direct credentials**: Hardcoded in the resource spec
- **Kubernetes secrets**: Referenced from secret objects for enhanced security
- **Environment variables**: For some source types

### Best Practices
- Use Kubernetes secrets for sensitive credentials in production
- Grant minimum required permissions to access sources
- Rotate credentials regularly
- Use TLS/HTTPS when possible
- Restrict secret access using RBAC
