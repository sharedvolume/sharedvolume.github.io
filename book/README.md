<!-- SharedVolume - Kubernetes Data Sharing Simplified -->
<!-- This is the main README.md file for the SharedVolume documentation -->
<div align="center">
  <img src="images/text-logo.png" alt="SharedVolume Logo" width="400">
  <h1 style="border-bottom: none; margin-top: 20px; color: var(--themeColor, #6366f1);">Kubernetes Data Sharing Simplified</h1>
  <p style="font-size: 1.2em; margin: 20px 0 40px;">
    <strong>Connect, Scale</strong> - Effortless data sharing at Kubernetes scale.
  </p>
</div>

<div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 40px; text-align: center; border: 1px solid #e2e8f0;">
  <p style="font-size: 1.1em; line-height: 1.6; max-width: 800px; margin: 0 auto 25px; color: #334155;">
    <strong>SharedVolume</strong> is a powerful Kubernetes operator that revolutionizes how you share data between pods and workloads. Effortlessly sync content from Git repositories, S3 buckets, HTTP sources, and more with just a few lines of YAML.
  </p>
  <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
    <a href="getting-started/installation.md" style="display: inline-block; padding: 12px 24px; background-color: #f8fafc; color: #1e293b; text-decoration: none; font-weight: bold; border-radius: 6px; border: 2px solid #4f46e5; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">🚀 Get Started</a>
    <a href="overview/what-is-shared-volume.md" style="display: inline-block; padding: 12px 24px; background-color: #f8fafc; color: #1e293b; text-decoration: none; font-weight: bold; border-radius: 6px; border: 2px solid #4f46e5; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">📘 Learn More</a>
    <a href="https://github.com/sharedvolume/shared-volume" style="display: inline-block; padding: 12px 24px; background-color: #f8fafc; color: #1e293b; text-decoration: none; font-weight: bold; border-radius: 6px; border: 2px solid #4f46e5; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">⭐ Star on GitHub</a>
  </div>
</div>
</div>

## ✨ Why Choose SharedVolume?

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
  <div style="background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="font-size: 2em; margin-bottom: 10px; color: var(--accentColor, #06b6d4);">🔄</div>
    <h3 style="margin-top: 0; color: var(--themeColor, #6366f1);">Multi-Source Sync</h3>
    <p>Automatically sync data from <strong>Git repositories</strong>, <strong>S3 buckets</strong>, <strong>HTTP endpoints</strong>, and <strong>SSH sources</strong>. Keep your data fresh across all workloads without manual intervention.</p>
  </div>
  
  <div style="background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="font-size: 2em; margin-bottom: 10px; color: var(--accentColor, #06b6d4);">📦</div>
    <h3 style="margin-top: 0; color: var(--themeColor, #6366f1);">Simple Integration</h3>
    <p>Mount shared volumes into any pod using <strong>simple annotations</strong> - no complex volume configurations needed. Get started in minutes, not hours, with our intuitive approach.</p>
  </div>
  
  <div style="background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="font-size: 2em; margin-bottom: 10px; color: var(--accentColor, #06b6d4);">💾 </div>
    <h3 style="margin-top: 0; color: var(--themeColor, #6366f1);">Efficient Storage Usage</h3>
    <p>Uses the same storage at the background, keeping only one copy through shared storage approach - reducing storage costs and improving efficiency.</p>
  </div>
  
  <div style="background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="font-size: 2em; margin-bottom: 10px; color: var(--accentColor, #06b6d4);">🌐</div>
    <h3 style="margin-top: 0; color: var(--themeColor, #6366f1);">Cross-Namespace Volume Sharing</h3>
    <p>Enables volume sharing across namespace pods using ClusterSharedVolume, breaking traditional namespace boundaries for storage access.</p>
  </div>
</div>

## 🎯 Perfect Use Cases

<table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
  <tr>
    <td style="width: 50%; padding: 15px; vertical-align: top; border: 1px solid #eaeaea; background-color: #fafafa;">
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div style="font-size: 1.8em; color: var(--accentColor, #06b6d4);">⚙️</div>
        <div>
          <h4 style="margin-top: 0; color: var(--themeColor, #6366f1);">Configuration Management</h4>
          <p style="margin-bottom: 0;">Share config files, secrets, and settings across multiple services</p>
        </div>
      </div>
    </td>
    <td style="width: 50%; padding: 15px; vertical-align: top; border: 1px solid #eaeaea; background-color: #fafafa;">
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div style="font-size: 1.8em; color: var(--accentColor, #06b6d4);">🌐</div>
        <div>
          <h4 style="margin-top: 0; color: var(--themeColor, #6366f1);">Static Asset Distribution</h4>
          <p style="margin-bottom: 0;">Serve shared assets, documentation, and resources from CDN or Git</p>
        </div>
      </div>
    </td>
  </tr>
  <tr>
    <td style="width: 50%; padding: 15px; vertical-align: top; border: 1px solid #eaeaea; background-color: #fafafa;">
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div style="font-size: 1.8em; color: var(--accentColor, #06b6d4);">🔄</div>
        <div>
          <h4 style="margin-top: 0; color: var(--themeColor, #6366f1);">CI/CD Pipelines</h4>
          <p style="margin-bottom: 0;">Pass build artifacts, test results, and deployments between pipeline stages</p>
        </div>
      </div>
    </td>
    <td style="width: 50%; padding: 15px; vertical-align: top; border: 1px solid #eaeaea; background-color: #fafafa;">
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div style="font-size: 1.8em; color: var(--accentColor, #06b6d4);">⚡</div>
        <div>
          <h4 style="margin-top: 0; color: var(--themeColor, #6366f1);">Multi-Stage Workflows</h4>
          <p style="margin-bottom: 0;">Share data and results between different processing steps and microservices</p>
        </div>
      </div>
    </td>
  </tr>
  <tr>
    <td style="width: 50%; padding: 15px; vertical-align: top; border: 1px solid #eaeaea; background-color: #fafafa;">
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div style="font-size: 1.8em; color: var(--accentColor, #06b6d4);">📊</div>
        <div>
          <h4 style="margin-top: 0; color: var(--themeColor, #6366f1);">Data Processing</h4>
          <p style="margin-bottom: 0;">Distribute datasets, models, and processing results across compute workloads</p>
        </div>
      </div>
    </td>
    <td style="width: 50%; padding: 15px; vertical-align: top; border: 1px solid #eaeaea; background-color: #fafafa;">
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div style="font-size: 1.8em; color: var(--accentColor, #06b6d4);">🔧</div>
        <div>
          <h4 style="margin-top: 0; color: var(--themeColor, #6366f1);">Development Tools</h4>
          <p style="margin-bottom: 0;">Share development environments, tools, and resources across teams</p>
        </div>
      </div>
    </td>
  </tr>
</table>

## 🚀 Quick Start

<div style="background-color: #f8fafc; border-left: 4px solid var(--primaryColor, #4f46e5); padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
  <p style="margin-top: 0; font-weight: bold;">💡 Get up and running in under 5 minutes!</p>
  <p style="margin-bottom: 0;">
    Ready to get started with SharedVolume? Our comprehensive quick start guide will walk you through installation, creating your first SharedVolume, and mounting it in your pods with simple annotations.
  </p>
</div>

<div style="text-align: center; margin: 30px 0;">
  <a href="getting-started/quick-start.md" style="display: inline-block; padding: 12px 24px; background-color: #f8fafc; color: #1e293b; text-decoration: none; font-weight: bold; border-radius: 6px; border: 2px solid #4f46e5; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">📖 Follow our Quick Start Guide</a>
</div>

<p style="text-align: center; font-size: 1.1em;">
  Step-by-step instructions to deploy SharedVolume in your cluster and start sharing data between your workloads.
</p>

---

## 🤝 Community & Support

### **�‍💻 Project Creator & Maintainer**
<div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
  <div style="display: flex; align-items: center; gap: 15px;">
    <div style="font-size: 2.5em;">🚀</div>
    <div>
      <h4 style="margin: 0 0 8px 0; color: #0369a1;">Bilgehan Nal</h4>
      <p style="margin: 0; color: #0284c7;">Project Creator & Main Contributor</p>
      <p style="margin: 8px 0 0 0;">
        <a href="https://bilgehannal.com" style="color: #0369a1; font-weight: 500; text-decoration: none;">🌐 bilgehannal.com</a>
      </p>
    </div>
  </div>
  <p style="margin-top: 15px; margin-bottom: 0; color: #0369a1; font-style: italic;">
    "SharedVolume was born from the need to simplify data sharing in Kubernetes environments. Thank you for being part of this journey!"
  </p>
</div>

### **�💬 Get Help & Connect**
| Resource | Description |
|----------|-------------|
| 🏠 **[Organization Page](https://github.com/sharedvolume)** | Github organization for SharedVolume |
| 🐛 **[Issue Tracker](https://github.com/sharedvolume/shared-volume/issues)** | Report bugs, request features, get support |

### **🚀 Stay Updated**
| Resource | Description |
|----------|-------------|
| 🗺️ **[Roadmap](support/roadmap.md)** | See what's coming next in SharedVolume |
| 📢 **[Release Notes](https://github.com/sharedvolume/shared-volume/releases)** | Latest features and improvements |

### **🤝 Contributing**
| Resource | Description |
|----------|-------------|
| 🎯 **[How to Contribute](contributing/how-to-contribute.md)** | Guidelines for contributing code and documentation |
| 🔨 **[Local Development](contributing/local-development.md)** | Set up your development environment |

---

<div style="text-align: center; margin: 50px 0 30px; padding: 40px 30px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
  <img src="images/logo-square.png" alt="SharedVolume Logo" width="100" style="margin-bottom: 20px;">
  <h2 style="margin-top: 0; color: #1e293b; font-size: 1.8em;">Ready to simplify your Kubernetes data sharing?</h2>
  <p style="font-size: 1.1em; margin-bottom: 30px; color: #475569;">
    Join the developers who are already using SharedVolume in their projects.
  </p>
  <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
    <a href="getting-started/installation.md" style="display: inline-block; padding: 12px 24px; background-color: #f8fafc; color: #1e293b; text-decoration: none; font-weight: bold; border-radius: 6px; border: 2px solid #4f46e5; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">🚀 Get Started Now</a>
    <a href="https://github.com/sharedvolume/shared-volume" style="display: inline-block; padding: 12px 24px; background-color: #f8fafc; color: #1e293b; text-decoration: none; font-weight: bold; border-radius: 6px; border: 2px solid #4f46e5; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">⭐ Star on GitHub</a>
  </div>
</div>

<!-- Custom styles for SharedVolume documentation -->
<style>
/* CSS Variables for consistent theming */
:root {
  --themeColor: #6366f1;
  --primaryColor: #4f46e5;
  --accentColor: #06b6d4;
  --textDark: #1e293b;
  --textMedium: #475569;
  --textLight: #64748b;
  --bgLight: #f8fafc;
  --borderLight: #e2e8f0;
}

/* Typography improvements */
h1, h2, h3, h4 {
  color: var(--textDark);
}

h1 {
  color: var(--themeColor) !important;
}

h2, h3 {
  color: var(--themeColor);
}

/* Link styling */
a {
  color: var(--primaryColor);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--themeColor);
  text-decoration: underline;
}

/* Button hover effects */
a[style*="background: linear-gradient"]:hover,
a[style*="background-color"]:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
}

/* Improved table styling */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

td {
  border: 1px solid var(--borderLight) !important;
  background-color: var(--bgLight) !important;
}

/* Card hover effects */
div[style*="box-shadow"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15) !important;
  transition: all 0.3s ease;
}

/* Better contrast for feature icons */
div[style*="color: var(--accentColor"] {
  color: #0891b2 !important;
}

/* Responsive design improvements */
@media (max-width: 768px) {
  div[style*="display: flex"] {
    flex-direction: column !important;
    align-items: center !important;
  }
  
  div[style*="display: grid"] {
    grid-template-columns: 1fr !important;
  }
  
  table, td {
    display: block !important;
    width: 100% !important;
    border: none !important;
    margin-bottom: 15px !important;
  }
}

/* Fix for HonKit compatibility */
.book-header h1 a, 
.book-header h1 a:hover {
  color: var(--themeColor) !important;
}

/* Better button focus states for accessibility */
a[style*="padding"]:focus {
  outline: 2px solid var(--accentColor);
  outline-offset: 2px;
}
</style>
