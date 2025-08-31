# Release Notes

Welcome to the SharedVolume release notes! Here you'll find information about all the latest features, improvements, and bug fixes in each version of SharedVolume.

## Latest Release

### [Version 0.1.0](https://github.com/sharedvolume/shared-volume-helm/releases/tag/v0.1.0) - *Beta Release* 🚧

**Release Date:** August 2025  
**Status:** Beta - All implementations in test phase

This is the first beta release of SharedVolume. **This release is intended for testing and development environments only.**

**[📖 Read Full Release Notes](https://github.com/sharedvolume/shared-volume-helm/releases/tag/v0.1.0)**

---

## Release Schedule

SharedVolume follows semantic versioning (SemVer):

- **0.x.x releases**: Beta versions for testing and development
- **1.0.0**: First stable production release
- **Minor releases** (x.y.0): New features, backwards compatible
- **Patch releases** (x.y.z): Bug fixes, security updates

## Beta Support Policy

- **Current beta**: Active development and community support
- **Bug fixes**: Provided based on community feedback and testing
- **Breaking changes**: May occur between beta versions
- **Documentation**: Continuously updated based on feedback

## Getting Updates

To stay informed about new releases:

1. Watch our [GitHub repository](https://github.com/sharedvolume/shared-volume-controller)
2. Follow release discussions on GitHub
3. Check our [roadmap](../support/roadmap.md) for upcoming features
4. Join community discussions for early access to features

## Beta Upgrade Guidelines

**Before upgrading beta versions:**

1. ⚠️ **Backup your data**: Beta versions may have breaking changes
2. **Review release notes**: Check for API changes and new features
3. **Test thoroughly**: Validate in development environment first
4. **Check compatibility**: Ensure Kubernetes version compatibility
5. **Report issues**: Help improve stability by reporting problems

**Beta Upgrade Commands:**
```bash
# Backup existing resources
kubectl get sharedvolumes -A -o yaml > backup-sv.yaml
kubectl get clustersharedvolumes -o yaml > backup-csv.yaml

# Upgrade to new beta version
kubectl apply -f https://github.com/sharedvolume/shared-volume-controller/releases/download/v0.1.0/install.yaml
```

## Support and Feedback

**For Beta Users:**
- Report issues on GitHub
- Share testing results
- Provide feedback on documentation
- Suggest improvements and new features
- Help others in community discussions

**Beta Testing Incentives:**
- Early access to new features
- Direct influence on product direction
- Recognition as beta contributor
- Priority support for reported issues
