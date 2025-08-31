# Syncing from External Sources

Comprehensive guide to configuring and managing synchronization from various external data sources including Git repositories, S3 storage, SSH sources, and HTTP endpoints.

## Overview

SharedVolume supports multiple source types for synchronizing external data:
- **Git repositories** - GitHub, GitLab, Bitbucket, and other Git hosting services
- **S3 compatible storage** - AWS S3, MinIO, DigitalOcean Spaces, and other S3-compatible services
- **SSH sources** - SFTP/SCP file transfers from remote servers
- **HTTP/HTTPS sources** - Direct file downloads from web servers
- **No source** - Empty volumes for manual data management

## No Source Configuration

For scenarios where you need an empty shared volume without automatic synchronization:

```yaml
# No source specified - creates empty volume
spec:
  mountPath: "/opt/mnt/nosource"
  syncInterval: "1m"
  syncTimeout: "30s"
  storageClassName: "standard"
  storage:
    capacity: "1Gi"
```

## Git Repositories

### Basic Git Sync (Public Repository)

For public repositories that don't require authentication:

```yaml
source:
  git:
    url: "https://github.com/example/demo-data.git"
    branch: "main"
```

### Git with Username and Password

For repositories requiring basic authentication:

```yaml
source:
  git:
    url: "https://github.com/example/demo-project.git"
    branch: "master"
    user: "demouser"
    password: "your-password-or-token"
```

For private repositories with enterprise Git hosting:

```yaml
source:
  git:
    url: "https://git.example.com/scm/config/deployment-configs.git"
    branch: "master"
    user: "demo.user"
    password: "***"
```

### Git with Password from Secret

Store sensitive credentials in Kubernetes secrets:

```yaml
source:
  git:
    url: "https://github.com/example/sample-project.git"
    branch: "main"
    user: "demo-user"
    passwordFromSecret:
      name: git-credentials
      key: token
```

For ClusterSharedVolume with namespace-specific secret:

```yaml
source:
  git:
    url: "https://github.com/example/demo-project.git"
    branch: "master"
    user: "demouser"
    passwordFromSecret:
      name: git-basic-secret
      key: password
      namespace: shared-volume-controller-system
```

### Git with SSH Key Authentication

Using embedded private key (base64 encoded):

```yaml
source:
  git:
    url: "ssh://git@git.example.com:7999/org/sample-chart.git"
    branch: "master"
    privateKey: "LS0tLS1CRUdJTiBPUEVOU1NIIFBSSVZBVEUgS0VZLS0tLS0K..."
```

Using private key from secret:

```yaml
source:
  git:
    url: "ssh://git@git.example.com:7999/org/sample-chart.git"
    branch: "master"
    privateKeyFromSecret:
      name: private-key-for-git
      key: private-key
```

For ClusterSharedVolume with namespace-specific secret:

```yaml
source:
  git:
    url: "ssh://git@git.example.com:7999/demo/demo-chart.git"
    branch: "master"
    privateKeyFromSecret:
      name: git-key-secret
      key: private-key
      namespace: shared-volume-controller-system
```

## SSH Sources

### Basic SSH with Password Authentication

```yaml
source:
  ssh:
    host: "ssh.example.com"
    port: 22
    user: "user2"
    password: "password1"
    path: "/opt/demo"
```

### SSH with Private Key (Embedded)

```yaml
source:
  ssh:
    host: "demo.example.com"
    port: 22
    user: "demouser"
    privateKey: "LS0tLS1CRUdJTiBPUEVOU1NIIFBSSVZBVEUgS0VZLS0tLS0K..."
    path: "/opt/demo"
```

### SSH with Private Key from Secret

```yaml
source:
  ssh:
    host: "ssh.example.com"
    port: 22
    user: "root"
    privateKeyFromSecret:
      name: private-key-for-git
      key: private-key
    path: "/opt/demo"
```

For ClusterSharedVolume with namespace-specific secret:

```yaml
source:
  ssh:
    host: "ssh.example.com"
    port: 22
    user: "user2"
    privateKeyFromSecret:
      name: ssh-user-pass
      key: private-key
      namespace: sv-csv-test-ns-1
    path: "/opt/demo"
```

### SSH with Password from Secret

```yaml
source:
  ssh:
    host: "ssh.example.com"
    port: 22
    user: "user2"
    passwordFromSecret:
      name: ssh-user-pass
      key: password
    path: "/opt/demo"
```

## S3 Compatible Storage

### Basic S3 with Direct Credentials

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

### S3 with Credentials from Secret

For both SharedVolume (namespace scope):

```yaml
source:
  s3:
    bucketName: "testbucket"
    endpointUrl: "http://s3.example.com:9010"
    region: "us-east-1"
    accessKeyFromSecret:
      name: s3
      key: accessKey
    secretKeyFromSecret:
      name: s3
      key: secretKey
    path: "x"
```

For ClusterSharedVolume (with explicit namespace):

```yaml
source:
  s3:
    bucketName: "testbucket"
    endpointUrl: "http://s3.example.com:9010"
    region: "us-east-1"
    accessKeyFromSecret:
      name: s3
      key: accessKey
      namespace: sv-csv-test-ns-1
    secretKeyFromSecret:
      name: s3
      key: secretKey
      namespace: sv-csv-test-ns-1
    path: "x"
```

## HTTP/HTTPS Sources

### Simple HTTP Download

```yaml
source:
  http:
    url: "https://github.com/distribution/distribution/blob/6affafd1f030087d88f88841bf66a8abe2bf4d24/contrib/apache/README.MD"
```

HTTP sources are ideal for:
- Downloading configuration files
- Fetching documentation
- Retrieving static assets
- Accessing public data files

## NFS Server Integration

SharedVolume can work with existing NFS servers or integrate with the NFS Server Controller:

### Using External NFS Server by URL

```yaml
spec:
  nfsServer:
    url: "nfs-sv-goazfn8g1e50.sv-csv-test-ns-1.svc.cluster.local"
    path: "/"
  source:
    http:
      url: "https://example.com/data.txt"
```

## Source Configuration Parameters

### Common Parameters

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `syncInterval` | How often to check for updates | No | 5m |
| `syncTimeout` | Maximum time for sync operation | No | 30s |
| `mountPath` | Where to mount the volume in pods | Yes | - |

### Git-Specific Parameters

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `url` | Git repository URL | Yes | - |
| `branch` | Git branch to sync | No | main |
| `user` | Username for authentication | No | - |
| `password` | Password or token | No | - |
| `privateKey` | Base64-encoded private key | No | - |

### SSH-Specific Parameters

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `host` | SSH server hostname | Yes | - |
| `port` | SSH server port | No | 22 |
| `user` | SSH username | No | - |
| `password` | SSH password | No | - |
| `privateKey` | Base64-encoded private key | No | - |
| `path` | Remote path to sync | No | - |

### S3-Specific Parameters

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `bucketName` | S3 bucket name | Yes | - |
| `endpointUrl` | S3 endpoint URL | Yes | - |
| `region` | AWS region | Yes | - |
| `accessKey` | Access key ID | No | - |
| `path` | Object prefix/path | No | / |

### HTTP-Specific Parameters

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `url` | HTTP/HTTPS URL | Yes | - |

## Secret Management

### Creating Secrets for Authentication

For Git credentials:
```bash
kubectl create secret generic git-credentials \
  --from-literal=token=your-github-token \
  --namespace=your-namespace
```

For SSH private keys:
```bash
kubectl create secret generic ssh-private-key \
  --from-file=private-key=~/.ssh/id_rsa \
  --namespace=your-namespace
```

For S3 credentials:
```bash
kubectl create secret generic s3-credentials \
  --from-literal=accessKey=your-access-key \
  --from-literal=secretKey=your-secret-key \
  --namespace=your-namespace
```

> **Note**: S3 secretKey can only be used via `secretKeyFromSecret`, not as a direct field in the spec.

### Secret Reference Formats

#### For SharedVolume (namespace-scoped)
```yaml
passwordFromSecret:
  name: secret-name
  key: key-name
```

#### For ClusterSharedVolume (cluster-scoped)
```yaml
passwordFromSecret:
  name: secret-name
  key: key-name
  namespace: secret-namespace
```

## Sync Behavior and Lifecycle

### Sync Intervals

The `syncInterval` parameter controls how frequently the system checks for updates:
- `1m` - Every minute (frequent updates)
- `5m` - Every 5 minutes (default)
- `1h` - Every hour (less frequent)
- `24h` - Daily sync

### Sync Timeout

The `syncTimeout` parameter sets the maximum time allowed for a sync operation:
- `30s` - 30 seconds (default)
- `5m` - 5 minutes (for large repositories)
- `15m` - 15 minutes (for very large datasets)

### Error Handling

When sync operations fail:
1. The system logs the error
2. The previous successful state is preserved
3. Retries occur at the next sync interval
4. Status is updated to reflect the failure

## Best Practices

### Security
- Always use secrets for sensitive credentials
- Regularly rotate access keys and tokens
- Use SSH keys instead of passwords when possible
- Limit secret access with RBAC policies

### Performance
- Choose appropriate sync intervals based on update frequency
- Use specific paths/prefixes to limit data transfer
- Monitor sync operation duration and adjust timeouts
- Consider network bandwidth when setting intervals

### Reliability
- Test source connectivity before deploying
- Monitor sync status and set up alerts
- Have backup strategies for critical data
- Use stable branch names for Git sources

### Resource Management
- Size storage capacity appropriately
- Monitor storage usage growth over time
- Clean up unused volumes and secrets
- Use appropriate access modes for your use case

## Troubleshooting

### Common Issues

1. **Authentication failures**: Verify credentials and permissions
2. **Network connectivity**: Check firewall rules and DNS resolution
3. **Timeout errors**: Increase `syncTimeout` for large datasets
4. **Permission denied**: Ensure proper file permissions and access rights
5. **Secret not found**: Verify secret exists in the correct namespace

### Debug Commands

Check volume status:
```bash
kubectl describe sharedvolume your-volume-name
kubectl describe clustersharedvolume your-volume-name
```

View sync logs:
```bash
kubectl logs -l app=shared-volume-controller -n shared-volume-controller-system
```

Test connectivity:
```bash
# For Git repositories
git clone https://github.com/example/repo.git

# For SSH sources
ssh user@host.example.com

# For S3 sources
aws s3 ls s3://bucket-name --endpoint-url=https://endpoint.com
```

## Integration Examples

### CI/CD Pipeline Data

```yaml
apiVersion: sv.sharedvolume.io/v1alpha1
kind: SharedVolume
metadata:
  name: ci-artifacts
spec:
  mountPath: "/opt/ci-data"
  syncInterval: "5m"
  storageClassName: "fast-ssd"
  storage:
    capacity: "10Gi"
  source:
    git:
      url: "https://github.com/myorg/ci-artifacts.git"
      branch: "main"
      user: "ci-user"
      passwordFromSecret:
        name: ci-git-token
        key: token
```

### Configuration Management

```yaml
apiVersion: sv.sharedvolume.io/v1alpha1
kind: ClusterSharedVolume
metadata:
  name: app-configs
spec:
  mountPath: "/etc/app-config"
  syncInterval: "10m"
  storageClassName: "standard"
  storage:
    capacity: "1Gi"
  source:
    s3:
      bucketName: "company-configs"
      region: "us-west-2"
      path: "applications/"
      accessKeyFromSecret:
        name: s3-readonly
        key: accessKey
        namespace: config-system
      secretKeyFromSecret:
        name: s3-readonly
        key: secretKey
        namespace: config-system
```

### Documentation Sync

```yaml
apiVersion: sv.sharedvolume.io/v1alpha1
kind: SharedVolume
metadata:
  name: team-docs
spec:
  mountPath: "/opt/docs"
  syncInterval: "30m"
  storageClassName: "standard"
  storage:
    capacity: "2Gi"
  source:
    http:
      url: "https://docs.company.com/api/export/team-docs.tar.gz"
```
