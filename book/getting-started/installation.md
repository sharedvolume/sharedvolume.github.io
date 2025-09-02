# In## Prerequisites

Before installing SharedVolume, ensure you have:

- Kubernetes cluster (version 1.20 or later)
- `kubectl` configured to access your cluster
- Helm 3.x (for Helm installation method)ion

Get Shared Volume up and running in your Kubernetes cluster quickly and easily.

## Prerequisites

Before installing Shared Volume, ensure you have:

- Kubernetes cluster (version 1.19 or later)
- kubectl configured to access your cluster
- Helm 3.x (for Helm installation method)
- Cluster admin permissions to install CRDs and RBAC resources

### Required Components

The following components must be installed manually before installing Shared Volume:

- **cert-manager**: Must be installed manually before installing this chart
- **CSI NFS driver**: Must be installed manually before installing this chart

> **Note**: If these components are already installed in your cluster, you can skip their installation steps.

#### Install cert-manager

> **Check if already installed**: Run `kubectl get pods -n cert-manager` to see if cert-manager is already running.

```bash
# Install cert-manager using kubectl
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Or using Helm
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

#### Install CSI NFS Driver

> **Check if already installed**: Run `kubectl get pods -n kube-system | grep csi-nfs` to see if CSI NFS driver is already running.

```bash
# Install CSI NFS driver using kubectl
curl -skSL https://raw.githubusercontent.com/kubernetes-csi/csi-driver-nfs/v4.11.0/deploy/install-driver.sh | bash -s v4.11.0 --

# Or using Helm
helm repo add csi-driver-nfs https://raw.githubusercontent.com/kubernetes-csi/csi-driver-nfs/master/charts
helm repo update
helm install csi-driver-nfs csi-driver-nfs/csi-driver-nfs \
  --namespace kube-system \
  --set kubeletDir=/var/lib/kubelet
```

## Installation Methods

### Helm Installation (Recommended)

The recommended way to install Shared Volume is using Helm:

```bash
# Install from GitHub releases (recommended)
helm install shared-volume \
  https://github.com/sharedvolume/shared-volume-helm/releases/download/v0.1.0/shared-volume-0.1.0.tgz

# Or install from local directory
git clone https://github.com/sharedvolume/shared-volume-helm.git
cd shared-volume-helm
helm install shared-volume ./shared-volume
```

#### Install Specific Version

To install a specific version, replace `v0.1.0` with your desired version:

```bash
# Install specific version (replace <version> with desired version)
helm install shared-volume \
  https://github.com/sharedvolume/shared-volume-helm/releases/download/v<version>/shared-volume-<version>.tgz
```

> **Available Releases**: Check the [shared-volume-helm releases page](https://github.com/sharedvolume/shared-volume-helm/releases) to see all available versions.

#### Helm Configuration Options

You can customize the installation using Helm values:

```bash
# Install with custom configuration
helm install shared-volume \
  https://github.com/sharedvolume/shared-volume-helm/releases/download/v0.1.0/shared-volume-0.1.0.tgz \
  --set nfsServer.enabled=false \
  --set sharedVolume.replicaCount=2 \
  --set sharedVolume.resources.limits.memory="256Mi"
```

Common configuration options:

**NFS Server Controller:**
- `nfsServer.enabled`: Enable NFS Server controller (default: true)
- `nfsServer.replicaCount`: Number of NFS controller replicas (default: 1)
- `nfsServer.resources`: Resource requests and limits for NFS controller
- `nfsServer.nfsServerImage`: NFS server image for instances

> **⚠️ Important Note about NFS Server**: The built-in NFS Server controller requires privileged pods to function properly. If your cluster has security policies that prevent privileged pod creation, you must:
> - Set `nfsServer.enabled=false` to disable the built-in NFS server
> - Use your own external NFS server instead
> - Configure SharedVolume resources to point to your external NFS server

**Shared Volume Controller:**
- `sharedVolume.enabled`: Enable Shared Volume controller (default: true)
- `sharedVolume.replicaCount`: Number of controller replicas (default: 1)
- `sharedVolume.resources`: Resource requests and limits for the controller
- `sharedVolume.volumeSyncerImage`: Volume syncer image for operations

**Global Settings:**
- `global.imageRegistry`: Global image registry override
- `global.imagePullSecrets`: Global image pull secrets

For all available options, see the [Helm Values Reference](../reference/helm-values.md).

### Kubernetes Manifest Installation

For environments where Helm is not available, you can install using kubectl:

```bash
# Apply the Shared Volume manifests
kubectl apply -f https://github.com/sharedvolume/shared-volume-helm/releases/download/v0.1.0/install.yaml

# Or apply a specific version (replace <version> with desired version)
kubectl apply -f https://github.com/sharedvolume/shared-volume-helm/releases/download/v<version>/install.yaml
```

## Verification

Verify that the installation was successful:

```bash
# Check if the Shared Volume controller is running
kubectl get pods -n shared-volume-controller-system

# Expected output:
# NAME                                                    READY   STATUS    RESTARTS   AGE
# shared-volume-controller-controller-manager-xxxx       1/1     Running   0          2m

# Check if the NFS Server controller is running (if enabled)
kubectl get pods -n nfs-server-controller-system

# Expected output (if nfsServer.enabled=true):
# NAME                                              READY   STATUS    RESTARTS   AGE
# nfs-server-controller-controller-manager-xxxx    1/1     Running   0          2m

# Verify CRDs are installed
kubectl get crd | grep sharedvolume

# Expected output:
# sharedvolumes.sharedvolume.io   2023-08-31T08:00:00Z
# clustersharedvolumes.sharedvolume.io   2023-08-31T08:00:00Z

# Check controller logs (optional)
kubectl logs -n shared-volume-controller-system deployment/shared-volume-controller-controller-manager
kubectl logs -n nfs-server-controller-system deployment/nfs-server-controller-controller-manager
```

If all pods are running and CRDs are installed, the installation was successful!

## Next Steps

- Continue to [Quick Start Tutorial](quick-start.md) to create your first shared volume
- Read about [Core Concepts](../concepts/custom-resources.md) to understand how Shared Volume works
- Explore [Use Cases](../overview/use-cases.md) to see how others are using Shared Volume

## Troubleshooting Installation

### Common Issues

**Problem**: Pods stuck in `Pending` state
1. **Check Pod Status**: Verify the controller is running properly
   ```bash
   kubectl describe pod -n shared-volume-controller-system <pod-name>
   ```
**Solution**: Check resource constraints and node availability.

**Problem**: CRDs not found
```bash
kubectl get crd sharedvolumes.sharedvolume.io
```
**Solution**: Ensure you have cluster admin permissions to install CRDs.

**Problem**: RBAC permission errors
```bash
kubectl get clusterrole shared-volume-controller
```
**Solution**: Verify RBAC resources are created correctly.

## References

- **Helm Chart Repository**: [sharedvolume/shared-volume-helm](https://github.com/sharedvolume/shared-volume-helm)
- **Chart Releases**: [GitHub Releases](https://github.com/sharedvolume/shared-volume-helm/releases)
- **Chart Documentation**: See the repository README for detailed chart configuration options
