# SharedVolume Documentation Site

This repository contains the official documentation for SharedVolume, built with [HonKit](https://github.com/honkit/honkit) and deployed to GitHub Pages.

## 🌐 Live Documentation

The documentation is automatically deployed to GitHub Pages at: **[sharedvolume.github.io](https://sharedvolume.github.io)**

## 📁 Repository Structure

```
├── .github/workflows/     # GitHub Actions for automatic deployment
├── book/                  # HonKit documentation source
│   ├── README.md         # Landing page content
│   ├── SUMMARY.md        # Table of contents
│   ├── book.json         # HonKit configuration
│   ├── styles/           # Custom CSS styles
│   ├── images/           # Documentation images
│   └── */                # Documentation chapters
├── _site/                # Built documentation (auto-generated)
├── static/               # Static assets (if any)
├── package.json          # Node.js dependencies
└── .nojekyll            # Prevents Jekyll processing
```

## 🚀 Local Development

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/sharedvolume/sharedvolume.github.io.git
cd sharedvolume.github.io

# Install dependencies
npm install

# Serve locally (available at http://localhost:4000)
npm run serve

# Build for production
npm run build
```

### Making Changes
1. Edit documentation files in the `/book` directory
2. Test changes locally with `npm run serve`
3. Commit and push to the `main` branch
4. GitHub Actions will automatically build and deploy to GitHub Pages

## 🔧 Build Process

The documentation is built using:
- **HonKit**: Modern GitBook successor for documentation generation
- **GitHub Actions**: Automated CI/CD pipeline
- **GitHub Pages**: Static site hosting

### Automatic Deployment
- **Trigger**: Push to `main` branch
- **Build**: HonKit processes Markdown files and applies custom styling
- **Deploy**: Built site is deployed to GitHub Pages
- **URL**: Available at `https://sharedvolume.github.io`

## 📝 Content Guidelines

### Adding New Pages
1. Create Markdown files in appropriate directories under `/book`
2. Update `/book/SUMMARY.md` to include new pages in navigation
3. Follow existing formatting and style conventions

### Styling
- Custom styles are in `/book/styles/website.css`
- Uses CSS variables for consistent theming
- Responsive design for mobile and desktop

### Images
- Store images in `/book/images/`
- Use relative paths in Markdown: `![Alt text](../images/filename.png)`
- Optimize images for web (WebP preferred, fallback to PNG/JPG)

## 🎨 Customization

### Theme Configuration
Edit `/book/book.json` to modify:
- Site title and description
- Plugin configuration
- Theme colors and variables
- Custom CSS includes

### CSS Variables
```css
:root {
  --themeColor: #6366f1;      /* Primary brand color */
  --primaryColor: #4f46e5;    /* Action buttons */
  --accentColor: #06b6d4;     /* Highlights and icons */
}
```

## 🚀 Deployment Configuration

### GitHub Pages Settings
1. Go to repository **Settings > Pages**
2. Set **Source** to "GitHub Actions"
3. The workflow will handle everything automatically

### Custom Domain (Optional)
To use a custom domain:
1. Add a `CNAME` file in the repository root with your domain
2. Configure DNS to point to `sharedvolume.github.io`
3. Update GitHub Pages settings

## 🔍 Troubleshooting

### Build Failures
- Check GitHub Actions logs for detailed error messages
- Ensure all Markdown files have valid syntax
- Verify all image links are correct and files exist

### Local Development Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for syntax errors
npm run build
```

### Styling Issues
- Check CSS syntax in `/book/styles/website.css`
- Verify CSS variables are properly defined
- Test in different browsers and screen sizes

## 📚 Related Repositories

- [shared-volume-controller](https://github.com/sharedvolume/shared-volume-controller) - Main SharedVolume controller
- [shared-volume-helm](https://github.com/sharedvolume/shared-volume-helm) - Helm charts
- [SharedVolume Organization](https://github.com/sharedvolume) - All SharedVolume projects

## 🤝 Contributing

We welcome contributions to improve the documentation!

1. Fork this repository
2. Create a feature branch
3. Make your changes in the `/book` directory
4. Test locally with `npm run serve`
5. Submit a pull request

For detailed contribution guidelines, see [How to Contribute](https://sharedvolume.github.io/contributing/how-to-contribute.html).

## 📄 License

This documentation is licensed under [MIT License](LICENSE).

---

**Created by [Bilgehan Nal](https://bilgehannal.com)** - Project Creator & Main Contributor 🚀
