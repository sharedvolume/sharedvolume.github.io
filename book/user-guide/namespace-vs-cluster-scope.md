# Namespace vs Cluster Scope

Understanding when to use SharedVolume (namespace-scoped) vs ClusterSharedVolume (cluster-scoped) resources.

## SharedVolume (Namespace-Scoped)

*TODO: Detailed explanation of namespace-scoped SharedVolumes.*

### When to Use
*TODO: Scenarios where namespace-scoped volumes are appropriate.*

### Security Implications
*TODO: Security considerations for namespace-scoped resources.*

### Examples
*TODO: Practical examples of namespace-scoped volume usage.*

```yaml
# Namespace-scoped example
apiVersion: sharedvolume.io/v1
kind: SharedVolume
metadata:
  name: team-config
  namespace: development
spec:
  # TODO: Add realistic example
```

## ClusterSharedVolume (Cluster-Scoped)

*TODO: Detailed explanation of cluster-scoped ClusterSharedVolumes.*

### When to Use
*TODO: Scenarios where cluster-scoped volumes are appropriate.*

### Security Implications
*TODO: Additional security considerations for cluster-scoped resources.*

### Examples
*TODO: Practical examples of cluster-scoped volume usage.*

```yaml
# Cluster-scoped example
apiVersion: sharedvolume.io/v1
kind: ClusterSharedVolume
metadata:
  name: global-assets
spec:
  # TODO: Add realistic example
```

## Cross-Namespace Access

*TODO: How cluster-scoped volumes enable cross-namespace access.*

### Access Control
*TODO: Managing access control for cross-namespace volumes.*

### Best Practices
*TODO: Guidelines for safe cross-namespace sharing.*

## Migration Between Scopes

*TODO: How to migrate between namespace and cluster-scoped resources.*

## Decision Matrix

*TODO: Table or flowchart to help choose between scopes.*
