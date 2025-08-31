# Running Tests

Comprehensive guide to running tests for Shared Volume.

## Test Structure

*TODO: Overview of the test structure and organization.*

```
test/
├── unit/                   # Unit tests
├── integration/            # Integration tests
├── e2e/                    # End-to-end tests
├── fixtures/               # Test fixtures and data
└── utils/                  # Test utilities
```

## Unit Tests

*TODO: Running and writing unit tests.*

### Running Unit Tests

```bash
# Run all unit tests
make test-unit

# Run tests for specific package
go test ./pkg/controller/...

# Run tests with coverage
make test-unit-coverage
```

### Writing Unit Tests
*TODO: Guidelines for writing unit tests.*

## Integration Tests

*TODO: Running and writing integration tests.*

### Running Integration Tests

```bash
# Run integration tests (requires cluster)
make test-integration

# Run specific integration test suite
go test ./test/integration/controller/...
```

### Integration Test Environment
*TODO: Setting up environment for integration tests.*

## End-to-End Tests

*TODO: Running comprehensive e2e tests.*

### Running E2E Tests

```bash
# Run full e2e test suite
make test-e2e

# Run specific e2e scenarios
make test-e2e-git
make test-e2e-s3
```

### E2E Test Requirements
*TODO: Prerequisites for running e2e tests.*

## Performance Tests

*TODO: Performance and load testing.*

### Load Testing
*TODO: Running load tests.*

### Benchmark Tests
*TODO: Performance benchmark tests.*

## Test Configuration

*TODO: Configuring tests for different environments.*

### Test Environment Variables
*TODO: Environment variables used by tests.*

### Test Data Management
*TODO: Managing test data and fixtures.*

## Continuous Integration

*TODO: How tests run in CI/CD pipelines.*

### GitHub Actions
*TODO: CI configuration and test execution.*

### Test Reporting
*TODO: Test result reporting and analysis.*

## Debugging Test Failures

*TODO: Techniques for debugging failed tests.*

### Test Logs
*TODO: Accessing and analyzing test logs.*

### Local Reproduction
*TODO: Reproducing CI failures locally.*
