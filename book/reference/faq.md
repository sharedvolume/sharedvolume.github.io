# FAQ

Frequently asked questions about SharedVolume.

## General Questions

### What is SharedVolume and how does it work?

SharedVolume is a Kubernetes operator that provides shared storage with automatic data synchronization from external sources. It creates NFS-based shared volumes that can be mounted by multiple pods across your cluster, with data automatically synced from sources like Git repositories, S3 storage, SSH servers, or HTTP endpoints.

The system works by:
1. Creating an NFS server for shared storage
2. Running a volume syncer to fetch data from external sources
3. Automatically mounting the shared storage in pods using annotations
4. Keeping data synchronized based on configurable intervals

### How is SharedVolume different from regular Kubernetes volumes?

SharedVolume offers several key advantages over standard Kubernetes volumes:

- **Automatic Synchronization**: Data is automatically fetched and updated from external sources
- **Multi-Pod Access**: Multiple pods can read and write to the same volume simultaneously
- **Cross-Namespace Sharing**: ClusterSharedVolume allows sharing data across namespaces
- **Annotation-Based Mounting**: Simple pod annotations handle volume mounting automatically
- **Source Integration**: Built-in support for Git, S3, SSH, and HTTP sources
- **Dynamic Management**: Automatic creation and cleanup of underlying infrastructure

### Can I use SharedVolume with any Kubernetes distribution?

Yes, SharedVolume is designed to work with any standard Kubernetes distribution (v1.20+), including:
- Google Kubernetes Engine (GKE)
- Amazon Elastic Kubernetes Service (EKS)
- Azure Kubernetes Service (AKS)
- Red Hat OpenShift
- VMware Tanzu
- Self-managed Kubernetes clusters
- Local development environments (kind, minikube)

The only requirement is a functioning NFS CSI driver, which is available on most platforms.

## Installation and Setup

### What are the minimum system requirements?

**Cluster Requirements:**
- Kubernetes v1.20 or later
- NFS CSI driver installed and configured
- RBAC enabled
- Admission webhooks enabled

**Optional Requirements:**
- cert-manager (for webhook TLS certificates)
- StorageClass for dynamic NFS server provisioning

**Resource Requirements:**
- Minimal controller overhead: ~100Mi memory, ~100m CPU
- Variable based on NFS server size and sync frequency

### How do I upgrade SharedVolume to a newer version?

To upgrade SharedVolume:

1. **Check Release Notes**: Review breaking changes and migration notes
2. **Backup Configuration**: Export existing SharedVolume resources
3. **Update CRDs**: Apply new CustomResourceDefinitions
4. **Upgrade Controller**: Deploy new controller version
5. **Verify Operation**: Check that existing volumes remain functional

```bash
# Backup existing resources
kubectl get sharedvolumes -A -o yaml > sharedvolumes-backup.yaml
kubectl get clustersharedvolumes -o yaml > clustersharedvolumes-backup.yaml

# Apply new version
kubectl apply -f https://github.com/sharedvolume/shared-volume-controller/releases/latest/download/install.yaml
```

### Can I install SharedVolume in an air-gapped environment?

Yes, SharedVolume supports air-gapped installations:

1. **Download Images**: Pull all required container images
2. **Push to Private Registry**: Upload images to your private registry
3. **Modify Manifests**: Update image references in installation manifests
4. **Install Offline**: Apply manifests in your air-gapped cluster

Required images include the controller, NFS server, and volume syncer components.

## Usage and Configuration

### How do I sync from a private Git repository?

For private Git repositories, use one of these authentication methods:

**SSH Key Authentication:**
```yaml
source:
  git:
    url: "ssh://git@github.com:org/private-repo.git"
    privateKeyFromSecret:
      name: git-ssh-key
      key: private-key
```

**Token Authentication:**
```yaml
source:
  git:
    url: "https://github.com/org/private-repo.git"
    user: "username"
    passwordFromSecret:
      name: git-token
      key: token
```

Create the secret first:
```bash
kubectl create secret generic git-ssh-key --from-file=private-key=~/.ssh/id_rsa
```

### Can I sync from multiple sources into the same volume?

No, each SharedVolume can only sync from one source at a time. However, you can:

- **Create Multiple Volumes**: Use separate SharedVolumes for different sources
- **Use Git Submodules**: Combine multiple repositories in a single Git source
- **Implement Custom Logic**: Use init containers to combine data from multiple sources
- **Use Volume Mounts**: Mount multiple SharedVolumes in the same pod

### How do I control sync frequency?

Control sync frequency using the `syncInterval` parameter:

```yaml
spec:
  syncInterval: "5m"  # Check every 5 minutes
  syncTimeout: "30s"  # Timeout after 30 seconds
```

**Common Intervals:**
- `30s` - Very frequent (development)
- `5m` - Frequent (default)
- `1h` - Hourly (production)
- `24h` - Daily (large datasets)

### What happens when a sync fails?

When a sync operation fails:

1. **Error Logging**: Detailed error logged in controller and syncer logs
2. **Status Update**: SharedVolume status reflects the failure
3. **Data Preservation**: Previous successful data remains available
4. **Automatic Retry**: Next sync attempt occurs at the next interval
5. **No Downtime**: Pods continue accessing existing data

Check status with:
```bash
kubectl describe sharedvolume my-volume
```

### Can I use SharedVolume for large files or datasets?

Yes, but consider these factors:

**Performance Considerations:**
- **Storage Capacity**: Ensure adequate storage for your dataset
- **Network Bandwidth**: Large files require more sync time
- **Sync Timeout**: Increase `syncTimeout` for large transfers
- **Sync Interval**: Reduce frequency for large datasets

**Best Practices:**
- Use appropriate storage classes (SSD for performance)
- Monitor sync duration and adjust timeouts
- Consider data compression at the source
- Use incremental sync sources when possible (Git is efficient)

## Security and Permissions

### How does SharedVolume handle authentication to external sources?

SharedVolume supports multiple authentication methods:

**Git Sources:**
- SSH keys (recommended)
- Username/password or tokens
- Deploy keys

**S3 Sources:**
- Access key/secret key pairs
- IAM roles (when running on AWS)

**SSH Sources:**
- SSH keys (recommended)
- Username/password

**Security Features:**
- All credentials stored in Kubernetes secrets
- No plaintext passwords in configurations
- TLS/SSL for encrypted connections
- RBAC integration for access control

### What Kubernetes permissions does SharedVolume need?

SharedVolume requires these RBAC permissions:

**Controller Permissions:**
- Create/manage NFS servers and volume syncers
- Watch SharedVolume/ClusterSharedVolume resources
- Create PVs and PVCs
- Access secrets for authentication

**Webhook Permissions:**
- Modify pod specifications
- Create volume resources
- Access admission review requests

The installation includes all necessary RBAC configurations.

### Is data encrypted in transit and at rest?

**In Transit:**
- Git over SSH: Encrypted
- HTTPS sources: Encrypted
- S3 with TLS: Encrypted
- NFS traffic: Not encrypted by default (can be configured)

**At Rest:**
- Depends on underlying storage encryption
- Use encrypted storage classes for sensitive data
- Container images can include encryption tools

For sensitive data, ensure your storage backend provides encryption at rest.

## Networking and Storage

### Does SharedVolume require special networking configuration?

**Standard Requirements:**
- NFS traffic (ports 2049, 111)
- Outbound access to external sources
- Internal cluster networking

**Network Policies:**
- Allow NFS traffic between pods and servers
- Allow outbound connections for sync operations
- Restrict access to sensitive sources

**Firewall Considerations:**
- Outbound HTTPS (443) for Git/HTTP sources
- Outbound SSH (22) for Git/SSH sources
- Custom ports for S3 endpoints

### Can I use my existing NFS server with SharedVolume?

Yes! SharedVolume supports external NFS servers:

```yaml
spec:
  nfsServer:
    url: "nfs-server.example.com"
    path: "/exports/data"
  source:
    git:
      url: "https://github.com/example/data.git"
```

**Benefits:**
- Use existing NFS infrastructure
- Share servers across multiple SharedVolumes
- Leverage existing backup/monitoring systems
- Custom NFS configurations

### What storage backends are supported?

**Dynamic NFS Servers:**
- Any Kubernetes StorageClass
- Local storage
- Cloud storage (EBS, GCE PD, Azure Disk)
- Network storage (Ceph, GlusterFS)

**External NFS Servers:**
- Traditional NFS servers
- Cloud NFS services (EFS, Cloud Filestore)
- Appliance-based NFS
- Software-defined storage with NFS

**Source Storage:**
- Git repositories (any Git provider)
- S3-compatible storage (AWS S3, MinIO, etc.)
- SSH/SFTP servers
- HTTP/HTTPS file servers

## Performance and Scaling

### How many SharedVolumes can I create in a cluster?

Scaling limits depend on:

**Cluster Resources:**
- Available CPU/memory for controllers
- Storage capacity for NFS servers
- Network bandwidth for sync operations

**Practical Limits:**
- 100+ SharedVolumes per cluster (typical)
- 1000+ with adequate resources
- Limited by underlying storage and network

**Scaling Strategies:**
- Use ClusterSharedVolume for organization-wide data
- External NFS servers for better resource sharing
- Multiple clusters for very large deployments

### What are the performance characteristics of SharedVolume?

**Read Performance:**
- NFS read performance (depends on storage backend)
- Multiple pods can read simultaneously
- Caching at the pod level improves performance

**Write Performance:**
- NFS write performance
- Concurrent writes from multiple pods supported
- Consider write coordination for consistency

**Sync Performance:**
- Depends on source type and data size
- Git is efficient for incremental updates
- HTTP/S3 downloads entire content each time

**Optimization Tips:**
- Use SSD storage for better IOPS
- Tune NFS mount options
- Optimize sync intervals
- Monitor and set resource limits

### Can SharedVolume sync data across multiple clusters?

SharedVolume operates within a single cluster, but you can achieve multi-cluster scenarios:

**Multi-Cluster Patterns:**
- Deploy SharedVolume in each cluster
- Sync from the same external sources
- Use ClusterSharedVolume for consistency
- GitOps for configuration management

**External Coordination:**
- Shared Git repositories across clusters
- Centralized S3 storage
- Cross-cluster NFS servers
- External orchestration tools

## Troubleshooting

### My volume shows as "Pending" - what should I check?

**Common Causes:**

1. **StorageClass Issues:**
   ```bash
   kubectl get storageclass
   kubectl describe sharedvolume my-volume
   ```

2. **RBAC Permissions:**
   ```bash
   kubectl logs -n shared-volume-controller-system deployment/shared-volume-controller
   ```

3. **Resource Constraints:**
   ```bash
   kubectl describe nodes
   kubectl get events
   ```

4. **NFS Server Issues:**
   ```bash
   kubectl get pods -l app=nfs-server
   kubectl logs -l app=nfs-server
   ```

### Sync is failing with authentication errors - how do I debug?

**Debug Steps:**

1. **Verify Secret Contents:**
   ```bash
   kubectl get secret my-git-secret -o yaml
   kubectl get secret my-git-secret -o jsonpath='{.data.token}' | base64 -d
   ```

2. **Check Source Connectivity:**
   ```bash
   # Test Git access
   git clone https://github.com/example/repo.git
   
   # Test SSH access
   ssh -T git@github.com
   ```

3. **Review Syncer Logs:**
   ```bash
   kubectl logs -l app=volume-syncer
   ```

4. **Validate Permissions:**
   - Ensure Git repository permissions
   - Check S3 bucket access
   - Verify SSH server access

### How do I view detailed logs for debugging?

**Controller Logs:**
```bash
kubectl logs -n shared-volume-controller-system deployment/shared-volume-controller
```

**Volume Syncer Logs:**
```bash
kubectl logs -l app=volume-syncer -f
```

**NFS Server Logs:**
```bash
kubectl logs -l app=nfs-server
```

**Webhook Logs:**
```bash
kubectl logs -n shared-volume-controller-system deployment/shared-volume-webhook
```

**Enable Debug Logging:**
Add `--log-level=debug` to controller arguments for verbose logging.

### The mounted volume appears empty - what's wrong?

**Check List:**

1. **Sync Status:**
   ```bash
   kubectl describe sharedvolume my-volume
   ```

2. **Mount Point:**
   ```bash
   kubectl exec my-pod -- ls -la /mount/path
   ```

3. **NFS Connectivity:**
   ```bash
   kubectl exec my-pod -- mount | grep nfs
   ```

4. **Source Data:**
   - Verify source repository/storage has data
   - Check sync path configurations
   - Ensure source is accessible

## Advanced Usage

### Can I extend SharedVolume with custom sync sources?

Currently, SharedVolume supports Git, S3, SSH, and HTTP sources. For custom sources:

**Workarounds:**
- Use init containers for custom sync logic
- Extend existing sources (e.g., HTTP with custom headers)
- Contribute new source types to the project

**Future Plans:**
- Plugin architecture for custom sources
- Extensible sync framework
- Community-contributed source types

### How do I implement custom validation for volume configurations?

**Current Options:**
- Use Kubernetes ValidatingAdmissionWebhooks
- Implement policy engines (OPA Gatekeeper)
- Pre-deployment validation in CI/CD

**Custom Webhook Example:**
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionWebhook
metadata:
  name: sharedvolume-validator
webhooks:
- name: validate.sharedvolume.io
  # Custom validation logic
```

### Can I use SharedVolume in CI/CD pipelines?

Yes! SharedVolume is excellent for CI/CD scenarios:

**Common Patterns:**
- **Artifact Storage**: Store build artifacts in shared volumes
- **Configuration Management**: Sync configuration from Git
- **Test Data**: Share test datasets across pipeline stages
- **Documentation**: Auto-deploy documentation from Git

**Example CI/CD Setup:**
```yaml
apiVersion: sv.sharedvolume.io/v1alpha1
kind: SharedVolume
metadata:
  name: ci-artifacts
spec:
  mountPath: "/ci-data"
  syncInterval: "1m"
  source:
    git:
      url: "https://github.com/myorg/ci-artifacts.git"
      branch: "main"
```

## Migration and Compatibility

### How do I migrate from other volume solutions to SharedVolume?

**Migration Strategies:**

1. **Parallel Deployment**: Run both systems during transition
2. **Data Migration**: Copy existing data to SharedVolume sources
3. **Gradual Cutover**: Migrate workloads incrementally
4. **Validation**: Ensure data consistency during migration

**From Traditional NFS:**
- Keep existing NFS servers
- Use external NFS server configuration
- Add sync capabilities gradually

**From Other Operators:**
- Export existing configurations
- Map to SharedVolume specifications
- Test thoroughly before cutover

### Is SharedVolume compatible with service meshes like Istio?

Yes, SharedVolume is compatible with service meshes:

**Istio Compatibility:**
- NFS traffic may need special handling
- Consider sidecar injection policies
- Network policies may need updates
- Monitor proxy performance impact

**Best Practices:**
- Exclude NFS servers from mesh if needed
- Configure appropriate network policies
- Monitor mesh metrics for performance

### Can I use SharedVolume with Windows nodes?

SharedVolume support for Windows depends on:

**Windows NFS Support:**
- Windows Server with NFS Client enabled
- Container runtime support for NFS
- Network configuration for NFS traffic

**Current Limitations:**
- Limited testing on Windows nodes
- NFS CSI driver compatibility varies
- Consider Linux nodes for NFS servers

**Alternatives:**
- Use SMB/CIFS for Windows
- Deploy NFS servers on Linux nodes only

## Contributing and Support

### How can I contribute to the SharedVolume project?

**Ways to Contribute:**

1. **Code Contributions:**
   - Bug fixes and feature implementations
   - Documentation improvements
   - Test coverage enhancements

2. **Community Support:**
   - Answer questions in discussions
   - Help with troubleshooting
   - Share use cases and best practices

3. **Testing and Feedback:**
   - Test new releases
   - Report bugs and issues
   - Request new features

**Getting Started:**
- Check the [Contributing Guide](../contributing/how-to-contribute.md)
- Join community discussions
- Start with "good first issue" labels

### Where can I get help if I encounter issues?

**Support Channels:**

1. **GitHub Issues**: [https://github.com/sharedvolume/shared-volume-controller/issues](https://github.com/sharedvolume/shared-volume-controller/issues)
2. **GitHub Discussions**: [https://github.com/sharedvolume/shared-volume-controller/discussions](https://github.com/sharedvolume/shared-volume-controller/discussions)
3. **Documentation**: This documentation site
4. **Community**: Join our community for peer support

**Before Seeking Help:**
- Check this FAQ
- Review documentation
- Search existing issues
- Prepare detailed error information

### How do I report bugs or request features?

**Bug Reports:**

1. **Search Existing Issues**: Check if already reported
2. **Gather Information**:
   - SharedVolume version
   - Kubernetes version
   - Error logs and symptoms
   - Steps to reproduce

3. **Create Issue**: Use bug report template
4. **Provide Context**: Include configuration examples

**Feature Requests:**

1. **Check Roadmap**: See if already planned
2. **Describe Use Case**: Explain the problem you're solving
3. **Propose Solution**: Suggest implementation approach
4. **Community Feedback**: Discuss with others first

**Issue Templates:**
- Use provided GitHub issue templates
- Include all requested information
- Be clear and specific about the problem
