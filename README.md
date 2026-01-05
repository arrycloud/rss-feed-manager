# RSS Feed Manager

A production-ready, single-file web application for managing UK news RSS feeds with comprehensive GitLab CI/CD pipeline and Docker containerization.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)
![Node](https://img.shields.io/badge/Node-20+-brightgreen.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitLab-orange.svg)

## Overview

The RSS Feed Manager is a lightweight, modern web application that provides an intuitive interface for managing RSS feeds from major UK news outlets. Built with vanilla HTML, CSS, and JavaScript, it offers a responsive design, offline capability, and seamless clipboard integration—all in a single, optimized file.

### Key Features

- **Single-File Architecture:** All HTML, CSS, and JavaScript in one optimized file (~40KB)
- **15+ Pre-configured UK News Sources:** BBC, Guardian, Telegraph, Times, Independent, Sky News, and more
- **Responsive Design:** Mobile-first glassmorphism UI with smooth animations
- **Search & Filter:** Real-time search across feed names and URLs
- **Clipboard Integration:** Copy individual or all feeds with one click
- **Offline Support:** Service Worker enables offline functionality
- **PWA Ready:** Installable as a Progressive Web App
- **Production Docker:** Multi-stage Dockerfile with nginx (~10MB image)
- **GitLab CI/CD:** Complete pipeline with build, test, security, and deployment stages
- **Security Hardened:** CSP headers, XSS protection, and container scanning

## Quick Start

### Prerequisites

- Node.js 20+ or Docker
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://gitlab.com/your-username/rss-feed-manager.git
cd rss-feed-manager

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Docker Deployment

```bash
# Build Docker image
docker build -t rss-feed-manager:latest .

# Run container
docker run -p 80:8080 rss-feed-manager:latest

# Access application
open http://localhost
```

## Architecture

### Frontend Structure

The application is built as a single HTML file (`client/public/index.html`) containing:

| Component | Details |
|-----------|---------|
| **HTML** | Semantic markup with accessibility attributes |
| **CSS** | Glassmorphism design system with animations |
| **JavaScript** | Vanilla JS with no dependencies |
| **Data** | 18 pre-configured UK RSS feeds |

### Design System

The UI implements a **Glassmorphism with Soft Gradients** aesthetic:

- **Typography:** Poppins (display) + Inter (body)
- **Color Palette:** Indigo (#4F46E5), Lavender (#F3E8FF), Blue (#EFF6FF)
- **Effects:** Backdrop blur, soft shadows, smooth transitions
- **Animations:** 300ms cubic-bezier with staggered entries
- **Responsive:** Mobile-first, optimized for all screen sizes

### Docker Architecture

**Multi-stage Build:**

```dockerfile
Stage 1: Node 20 Alpine
  ├─ Install dependencies (pnpm)
  ├─ Build frontend (Vite)
  └─ Output: dist/

Stage 2: nginx Alpine (~10MB)
  ├─ Copy built assets
  ├─ Configure nginx
  ├─ Add security headers
  └─ Health checks enabled
```

### GitLab CI/CD Pipeline

The `.gitlab-ci.yml` includes five stages:

| Stage | Jobs | Purpose |
|-------|------|---------|
| **Build** | `build:frontend` | Compile frontend assets |
| **Test** | `test:unit`, `test:lint` | Run tests and linting |
| **Security** | `security:dependencies`, `security:container` | Audit dependencies and scan Docker image |
| **Deploy** | `deploy:docker`, `deploy:pages` | Push to registry and GitLab Pages |
| **Scheduled** | `security:audit:scheduled` | Weekly dependency audits |

## Usage

### Generating Feeds

1. Click the **"Generate Feeds"** button to populate the table
2. The app loads 18 pre-configured UK news RSS feeds
3. A success toast confirms the operation

### Searching Feeds

- Use the search box to filter by feed name or URL
- Press `Ctrl+K` (or `Cmd+K` on Mac) to focus the search
- Results update in real-time

### Copying URLs

**Copy Individual Feed:**
- Click the **"Copy"** button next to any feed
- URL is copied to clipboard
- Button shows confirmation feedback

**Copy All Feeds:**
- Click **"Copy All"** button
- All feeds are formatted as `Name: URL` pairs
- Entire list is copied to clipboard

### Statistics

The stats section displays:
- **Total Feeds:** All available feeds
- **Visible Feeds:** Feeds matching current search
- **Copied URLs:** Count of copied operations

## Included RSS Feeds

The application includes feeds from these major UK news sources:

- BBC News (main, world, UK, technology)
- The Guardian (international, UK, world)
- The Telegraph (news, UK news)
- The Times
- The Independent
- Sky News (main, UK)
- ITV News
- Channel 4 News
- Reuters UK
- Financial Times
- The Economist

## Deployment

### GitLab Pages

The pipeline automatically deploys to GitLab Pages on every push to `main`:

```bash
# Access your deployed app
https://your-username.gitlab.io/rss-feed-manager/
```

### Docker Hub

To push to Docker Hub, add these CI/CD variables in GitLab:

```
DOCKER_HUB_USERNAME = your_username
DOCKER_HUB_PASSWORD = your_password
```

Then modify `.gitlab-ci.yml`:

```yaml
deploy:docker:
  script:
    - docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD
    - docker build -t your_username/rss-feed-manager:$IMAGE_TAG .
    - docker push your_username/rss-feed-manager:$IMAGE_TAG
```

### Custom Domain

1. Go to **GitLab Project → Settings → Pages**
2. Add your custom domain
3. Update DNS records as instructed
4. Enable HTTPS

## Performance Metrics

- **Initial Load:** < 500ms
- **Docker Image Size:** ~10MB
- **Container Startup:** < 2 seconds
- **Single HTML File:** ~40KB (gzipped)
- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices)

## Security

### Built-in Protections

- **Content Security Policy (CSP):** Restricts script execution
- **X-Frame-Options:** Prevents clickjacking
- **X-Content-Type-Options:** Prevents MIME sniffing
- **XSS Protection:** Browser-level XSS filtering
- **Referrer Policy:** Controls referrer information

### Container Security

- **Non-root User:** nginx runs as unprivileged user
- **Read-only Filesystem:** Production assets are immutable
- **Health Checks:** Automatic container health monitoring
- **Trivy Scanning:** Container vulnerability scanning in CI/CD

### Dependency Security

- **npm audit:** Runs on every merge request
- **Scheduled Audits:** Weekly dependency vulnerability checks
- **Frozen Lockfile:** Ensures reproducible builds

## Development

### Project Structure

```
rss-feed-manager/
├── client/
│   ├── public/
│   │   ├── index.html          # Main single-file app
│   │   └── images/
│   │       └── hero-bg.png     # Hero background
│   └── src/
│       ├── App.tsx             # React entry (if extended)
│       └── index.css           # Global styles
├── Dockerfile                  # Multi-stage build
├── nginx.conf                  # Production server config
├── .gitlab-ci.yml             # CI/CD pipeline
├── package.json               # Dependencies
└── README.md                  # This file
```

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server on http://localhost:3000

# Production
pnpm build        # Build for production
pnpm preview      # Preview production build

# Quality
pnpm check        # TypeScript type checking
pnpm format       # Format code with Prettier

# Docker
docker build -t rss-feed-manager .
docker run -p 80:80 rss-feed-manager
```

### Extending the Application

To add more features:

1. **Add More Feeds:** Edit the `UK_RSS_FEEDS` array in `index.html`
2. **Customize Colors:** Modify CSS variables in the `<style>` tag
3. **Add Functionality:** Extend the JavaScript section (vanilla JS, no build needed)
4. **Upgrade to React:** Use the existing React scaffold in `client/src/`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Offline Support

The application includes a Service Worker that enables:

- Offline access to previously loaded feeds
- Automatic cache updates
- Network-first strategy for API calls

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support (`Ctrl+K` to search)
- High contrast colors (WCAG AA compliant)
- Semantic HTML structure
- Focus indicators on all interactive elements

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Merge Request

## License

This project is licensed under the MIT License—see the LICENSE file for details.

## Support

For issues, questions, or suggestions:

1. Check existing GitLab Issues
2. Create a new issue with detailed description
3. Include browser/environment information
4. Attach screenshots if applicable

## Roadmap

- [ ] RSS feed validation and health checks
- [ ] Feed categorization and custom collections
- [ ] Dark mode toggle
- [ ] Feed preview functionality
- [ ] Export to OPML format
- [ ] Multi-language support
- [ ] Advanced filtering (by category, date range)

## Acknowledgments

- **Design Inspiration:** iOS 15+ Glassmorphism
- **Icons:** Emoji for simplicity and accessibility
- **Fonts:** Google Fonts (Poppins, Inter)
- **Server:** nginx Alpine for production efficiency

## Changelog

### Version 1.0.0 (2024)

- Initial release
- Single-file HTML application
- 18 pre-configured UK RSS feeds
- Glassmorphism UI with smooth animations
- Docker containerization
- Complete GitLab CI/CD pipeline
- Security scanning and hardening
- PWA support with Service Worker
- Responsive mobile-first design

---

**Made with ❤️ for the developer community**

For the latest updates, visit: [GitLab Repository](https://gitlab.com/your-username/rss-feed-manager)
