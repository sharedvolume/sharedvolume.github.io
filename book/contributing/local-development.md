# Local Development Setup

Setting up a local development environment for Shared Volume.

## Prerequisites

*TODO: List development prerequisites.*

- Go 1.19+ 
- Docker
- kubectl
- kind or minikube (for local Kubernetes cluster)
- make

## Getting the Source Code

*TODO: Instructions for cloning and setting up the repository.*

```bash
# Clone the repository
git clone https://github.com/sharedvolume/shared-volume.git
cd shared-volume

# Install dependencies
go mod download
```

## Development Environment Setup

*TODO: Complete development environment setup.*

### Local Kubernetes Cluster

```bash
# Create a local cluster with kind
kind create cluster --name shared-volume-dev

# Or use minikube
minikube start --profile shared-volume-dev
```

### Building from Source

```bash
# Build all components
make build

# Build specific components
make build-controller
make build-syncer
```

### Installing for Development

```bash
# Install CRDs
make install

# Deploy to local cluster
make deploy

# Or deploy with development settings
make deploy-dev
```

## Development Workflow

*TODO: Recommended development workflow.*

### Code Changes
*TODO: How to make and test code changes.*

### Local Testing
*TODO: Running tests locally.*

### Debugging
*TODO: Debugging techniques and tools.*

## IDE Setup

*TODO: Setting up popular IDEs for development.*

### VS Code
*TODO: Recommended VS Code extensions and settings.*

### GoLand/IntelliJ
*TODO: GoLand/IntelliJ setup instructions.*

## Development Tools

*TODO: Useful development tools and scripts.*

### Code Generation
*TODO: Code generation for CRDs and clients.*

### Linting and Formatting
*TODO: Code quality tools and standards.*

### Pre-commit Hooks
*TODO: Setting up pre-commit hooks.*

## Troubleshooting Development Issues

*TODO: Common development issues and solutions.*
