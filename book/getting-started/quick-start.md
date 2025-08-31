# Quick Start Tutorial

This tutorial will walk you through creating your first ClusterSharedVolume and mounting it into a pod.

## Prerequisites

- Shared Volume operator installed (see [Installation](installation.md))
- kubectl access to your cluster

## Step 1: Create Your First ClusterSharedVolume

Create a ClusterSharedVolume that syncs data from a Git repository:

```yaml
# my-csv.yaml
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

Apply the resource:

```bash
kubectl apply -f my-csv.yaml
```

## Step 2: Verify the Volume is Syncing

Check the ClusterSharedVolume status:

```bash
# Check the volume status
kubectl get csv my-csv -o yaml

# Monitor pods created for this CSV in shared-volume-controller namespace
kubectl get pods -n shared-volume-controller | grep my-csv

# Watch NFS server pod logs
kubectl logs -n shared-volume-controller -l app=nfs-server,csv=my-csv -f

# Watch volume-syncer pod logs
kubectl logs -n shared-volume-controller -l app=volume-syncer,csv=my-csv -f
```

## Step 3: Mount the Volume in a Pod

Create a pod that uses the ClusterSharedVolume with annotations:

```yaml
# consumer-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: consumer-pod
  annotations:
    sharedvolume.csv: "my-csv"
spec:
  containers:
  - name: alpine
    image: alpine:3.18
    command: ["/bin/sh", "-c", "while true; do echo 'Testing complex multi-source scenario'; find /opt/mnt -type d -name '*' | head -20; sleep 60; done"]
    resources:
      requests:
        memory: "32Mi"
        cpu: "100m"
      limits:
        memory: "64Mi"
        cpu: "300m"
  automountServiceAccountToken: false
```

Apply the pod:

```bash
kubectl apply -f consumer-pod.yaml
```

## Step 4: Verify the Mount

Check if the pod is running and verify the volume is mounted:

```bash
# Check if the pod is running
kubectl get pod consumer-pod

# View the pod logs to see it accessing the mounted data
kubectl logs consumer-pod

# Verify the volume is mounted and accessible
kubectl exec consumer-pod -- ls -la /opt/mnt

# View the synced Git repository content
kubectl exec consumer-pod -- find /opt/mnt -type f | head -10
```

## What's Next?

Now that you have a basic understanding, explore:

- [Managing SharedVolumes](../user-guide/managing-shared-volumes.md) for more advanced usage
- [Volume Sources & Sync](../concepts/volume-sources-sync.md) to understand different source types
- [User Guide](../user-guide/managing-shared-volumes.md) for real-world scenarios
