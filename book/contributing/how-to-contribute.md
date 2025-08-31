# How to Contribute

We welcome contributions to the SharedVolume project! Whether you're fixing bugs, adding features, improving documentation, or helping with testing, your contributions make SharedVolume better for everyone.

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- **Git** installed and configured
- **Go 1.24+** for code contributions
- **Docker** for building container images
- **kubectl** and access to a Kubernetes cluster for testing
- **GitHub account** for submitting contributions

### Understanding the Project

**Read the Documentation:**
- [Architecture Overview](../overview/architecture.md)
- [Repository Structure](repository-structure.md)
- [Development Guide](local-development.md)

**Key Repositories:**
- [shared-volume-controller](https://github.com/sharedvolume/shared-volume-controller) - Main controller
- [nfs-server-controller](https://github.com/sharedvolume/nfs-server-controller) - NFS server management
- [volume-syncer](https://github.com/sharedvolume/volume-syncer) - Data synchronization
- [shared-volume-helm](https://github.com/sharedvolume/shared-volume-helm) - Helm charts

### Finding Issues to Work On

**Good First Issues:**
- Look for `good first issue` label on GitHub
- Documentation improvements
- Test additions
- Bug fixes with clear reproduction steps

**Areas Needing Help:**
- 🐛 Bug fixes and stability improvements
- 📚 Documentation and examples
- 🧪 Test coverage and automation
- 🚀 Performance optimizations
- 🔧 New source type implementations

**Issue Labels:**
- `good first issue` - Perfect for new contributors
- `help wanted` - Community help needed
- `documentation` - Documentation improvements
- `bug` - Bug fixes
- `enhancement` - New features
- `testing` - Test-related work

## Contribution Process

### 1. Plan Your Contribution

**For Bug Fixes:**
1. Check if an issue exists, create one if not
2. Describe the bug and reproduction steps
3. Discuss the proposed solution

**For New Features:**
1. Create a feature request issue
2. Discuss the design and approach
3. Get maintainer approval before implementing
4. Consider breaking the feature into smaller parts

**For Documentation:**
1. Identify gaps or unclear sections
2. Propose improvements in an issue
3. Consider the target audience

### 2. Fork and Set Up

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/yourusername/shared-volume-controller.git
cd shared-volume-controller

# Add upstream remote
git remote add upstream https://github.com/sharedvolume/shared-volume-controller.git

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

**Development Guidelines:**
- Follow existing code patterns and conventions
- Write clear, self-documenting code
- Add comments for complex logic
- Include error handling and logging
- Update related documentation

**Commit Guidelines:**
```bash
# Make focused, logical commits
git add .
git commit -m "feat: add support for custom headers in HTTP source

- Add customHeaders field to HTTPSourceSpec
- Implement header injection in volume syncer
- Add validation for header format
- Include examples in documentation

Fixes #123"
```

### 4. Testing

**Testing Requirements:**
- All new code must include tests
- Existing tests must continue to pass
- Integration tests for new features
- Documentation examples must work

**Running Tests:**
```bash
# Unit tests
make test

# Integration tests
make test-integration

# End-to-end tests
make test-e2e

# Lint and format
make lint
make fmt
```

**Manual Testing:**
- Test your changes in a real Kubernetes environment
- Verify backward compatibility
- Test error conditions and edge cases
- Document any manual testing performed

### 5. Documentation

**Documentation Requirements:**
- Update relevant user documentation
- Add or update API documentation
- Include code examples where appropriate
- Update CHANGELOG.md for user-facing changes

**Documentation Types:**
- **User Guide**: How users interact with features
- **API Reference**: Technical API documentation
- **Examples**: Working code examples
- **Architecture**: Design and implementation details

### 6. Submit Pull Request

**Before Submitting:**
```bash
# Sync with upstream
git fetch upstream
git rebase upstream/main

# Ensure tests pass
make test-all

# Push to your fork
git push origin feature/your-feature-name
```

**Pull Request Guidelines:**
- Use a clear, descriptive title
- Reference related issues (e.g., "Fixes #123")
- Describe what you changed and why
- Include testing instructions
- Add screenshots for UI changes
- Request review from relevant maintainers

**PR Template:**
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (describe)

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed
- [ ] Documentation updated

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if needed)

## Related Issues
Fixes #(issue number)
```

## Code Style and Standards

### Go Code Style

**Follow Standard Go Conventions:**
- Use `gofmt` for formatting
- Follow effective Go guidelines
- Use meaningful variable and function names
- Write clear error messages
- Include package and function documentation

**SharedVolume Specific:**
```go
// Good: Clear function documentation
// ReconcileSharedVolume manages the lifecycle of a SharedVolume resource
func (r *SharedVolumeReconciler) ReconcileSharedVolume(ctx context.Context, sv *svv1alpha1.SharedVolume) error {
    // Implementation
}

// Good: Descriptive error messages
return fmt.Errorf("failed to create NFS server for SharedVolume %s/%s: %w", sv.Namespace, sv.Name, err)

// Good: Structured logging
log.Info("Creating NFS server", "sharedvolume", sv.Name, "namespace", sv.Namespace)
```

### Commit Message Format

Use conventional commits format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `test` - Test additions/changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `chore` - Maintenance tasks

**Examples:**
```
feat(controller): add webhook validation for SharedVolume

fix(syncer): resolve timeout issue with large Git repositories

docs(user-guide): add examples for S3 authentication

test(integration): add tests for ClusterSharedVolume cross-namespace access
```

### Code Review Process

**Review Criteria:**
- ✅ Code quality and readability
- ✅ Test coverage and quality
- ✅ Documentation completeness
- ✅ Backward compatibility
- ✅ Performance impact
- ✅ Security considerations

**Review Timeline:**
- Initial review within 2-3 business days
- Follow-up reviews within 1-2 business days
- Complex changes may require multiple review rounds

**Addressing Feedback:**
- Respond to all review comments
- Make requested changes promptly
- Ask for clarification if feedback is unclear
- Re-request review after addressing feedback

## Types of Contributions

### Bug Fixes

**Process:**
1. Reproduce the issue locally
2. Create a test that demonstrates the bug
3. Implement the fix
4. Verify the test passes
5. Submit PR with clear description

**Requirements:**
- Test that reproduces the original issue
- Fix that resolves the issue
- Documentation update if behavior changes

### New Features

**Process:**
1. Create feature request issue
2. Discuss design and requirements
3. Get maintainer approval
4. Implement in phases if large
5. Include comprehensive tests and docs

**Requirements:**
- Design discussion and approval
- Comprehensive test coverage
- User and developer documentation
- Examples and usage guidance

### Documentation

**Types:**
- User guides and tutorials
- API reference documentation
- Code examples and samples
- Architecture and design docs

**Standards:**
- Clear, concise writing
- Working code examples
- Screenshots for UI elements
- Regular updates for accuracy

### Testing

**Areas:**
- Unit test coverage
- Integration test scenarios
- End-to-end workflow tests
- Performance and load tests

**Guidelines:**
- Test real-world scenarios
- Include negative test cases
- Test error conditions
- Maintain test reliability

## Community Guidelines

### Code of Conduct

We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). All contributors are expected to:

- **Be Respectful**: Treat everyone with respect and professionalism
- **Be Inclusive**: Welcome contributors from all backgrounds
- **Be Collaborative**: Work together constructively
- **Be Patient**: Help newcomers learn and grow
- **Be Professional**: Maintain professional communication

### Communication Channels

**GitHub:**
- [Issues](https://github.com/sharedvolume/shared-volume-controller/issues) - Bug reports and feature requests
- [Discussions](https://github.com/sharedvolume/shared-volume-controller/discussions) - General questions and community chat
- [Pull Requests](https://github.com/sharedvolume/shared-volume-controller/pulls) - Code contributions

**Guidelines:**
- Search existing issues before creating new ones
- Use clear, descriptive titles
- Provide detailed information and context
- Be patient and respectful in discussions
- Help others when you can

### Getting Help

**For Contributors:**
- Check existing documentation first
- Search previous issues and discussions
- Ask specific, detailed questions
- Provide context and examples

**Mentorship:**
- Maintainers provide guidance for complex contributions
- Community members help with questions
- Pair programming available for significant features

## Recognition

### Contributor Recognition

**All Contributors:**
- Listed in repository CONTRIBUTORS.md
- Mentioned in release notes for significant contributions
- GitHub contributor statistics
- Community recognition in discussions

**Significant Contributors:**
- Featured in documentation
- Invited to community calls
- Early access to new features
- Input on project direction

### Maintainer Path

**Becoming a Maintainer:**
1. **Consistent Contributions**: Regular, high-quality contributions over time
2. **Community Involvement**: Active participation in discussions and reviews
3. **Technical Expertise**: Deep understanding of project architecture
4. **Mentorship**: Helping other contributors
5. **Nomination**: Nominated by existing maintainers

**Maintainer Responsibilities:**
- Code review and merging
- Issue triage and management
- Release planning and execution
- Community moderation
- Technical direction

## Getting Started Checklist

**New Contributor Checklist:**
- [ ] Read project documentation
- [ ] Set up development environment
- [ ] Join community discussions
- [ ] Find a good first issue
- [ ] Fork and clone repository
- [ ] Make your first contribution
- [ ] Submit your first pull request

**Resources:**
- [Development Setup](local-development.md)
- [Testing Guide](running-tests.md)
- [Repository Structure](repository-structure.md)
- [FAQ](../reference/faq.md)

## Questions?

**Need Help?**
- 💬 [GitHub Discussions](https://github.com/sharedvolume/shared-volume-controller/discussions) for questions
- 🐛 [GitHub Issues](https://github.com/sharedvolume/shared-volume-controller/issues) for bugs
- 📚 [Documentation](https://sharedvolume.github.io) for guides

**Thank You!**
Your contributions make SharedVolume better for everyone. We appreciate your time and effort in helping build a great shared storage solution for the Kubernetes community! 🎉
