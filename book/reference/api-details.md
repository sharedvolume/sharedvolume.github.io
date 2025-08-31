# API Details

Detailed API reference for interacting with Shared Volume programmatically.

## Kubernetes API Integration

*TODO: How Shared Volume integrates with the Kubernetes API.*

### API Groups and Versions

```
sharedvolume.io/v1:
  - SharedVolume
  - ClusterSharedVolume
  - NfsServer
```

### API Server Integration
*TODO: How the custom resources integrate with the Kubernetes API server.*

## REST API Endpoints

*TODO: Direct REST API access patterns.*

### SharedVolume Endpoints

```
# Namespace-scoped operations
GET    /apis/sharedvolume.io/v1/namespaces/{namespace}/sharedvolumes
POST   /apis/sharedvolume.io/v1/namespaces/{namespace}/sharedvolumes
GET    /apis/sharedvolume.io/v1/namespaces/{namespace}/sharedvolumes/{name}
PUT    /apis/sharedvolume.io/v1/namespaces/{namespace}/sharedvolumes/{name}
PATCH  /apis/sharedvolume.io/v1/namespaces/{namespace}/sharedvolumes/{name}
DELETE /apis/sharedvolume.io/v1/namespaces/{namespace}/sharedvolumes/{name}

# Status subresource
GET    /apis/sharedvolume.io/v1/namespaces/{namespace}/sharedvolumes/{name}/status
PUT    /apis/sharedvolume.io/v1/namespaces/{namespace}/sharedvolumes/{name}/status
PATCH  /apis/sharedvolume.io/v1/namespaces/{namespace}/sharedvolumes/{name}/status
```

### ClusterSharedVolume Endpoints

```
# Cluster-scoped operations
GET    /apis/sharedvolume.io/v1/clustersharedvolumes
POST   /apis/sharedvolume.io/v1/clustersharedvolumes
GET    /apis/sharedvolume.io/v1/clustersharedvolumes/{name}
PUT    /apis/sharedvolume.io/v1/clustersharedvolumes/{name}
PATCH  /apis/sharedvolume.io/v1/clustersharedvolumes/{name}
DELETE /apis/sharedvolume.io/v1/clustersharedvolumes/{name}

# Status subresource
GET    /apis/sharedvolume.io/v1/clustersharedvolumes/{name}/status
PUT    /apis/sharedvolume.io/v1/clustersharedvolumes/{name}/status
PATCH  /apis/sharedvolume.io/v1/clustersharedvolumes/{name}/status
```

## Client Libraries

*TODO: Available client libraries for different languages.*

### Go Client

```go
// Example Go client usage
import (
    "context"
    "k8s.io/client-go/kubernetes"
    svv1 "github.com/sharedvolume/shared-volume/api/v1"
    svclient "github.com/sharedvolume/shared-volume/pkg/client/clientset/versioned"
)

// Create a SharedVolume
sv := &svv1.SharedVolume{
    ObjectMeta: metav1.ObjectMeta{
        Name:      "example",
        Namespace: "default",
    },
    Spec: svv1.SharedVolumeSpec{
        // TODO: Add spec example
    },
}

client := svclient.NewForConfig(config)
result, err := client.SharedvolumeV1().SharedVolumes("default").Create(ctx, sv, metav1.CreateOptions{})
```

### kubectl Integration
*TODO: Using kubectl with Shared Volume resources.*

```bash
# List all SharedVolumes
kubectl get sharedvolumes
kubectl get sv  # short name

# Get detailed information
kubectl describe sv my-volume

# Edit a SharedVolume
kubectl edit sv my-volume

# View events
kubectl get events --field-selector involvedObject.kind=SharedVolume
```

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 500: Internal Server Error
