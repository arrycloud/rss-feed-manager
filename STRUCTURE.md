# RSS Feed Manager - Project Structure

## Directory Layout

```
rss-feed-manager/
├── client/                          # Frontend application
│   ├── public/
│   │   ├── index.html              # Main single-file app (25KB)
│   │   │                           # Contains: HTML, CSS, JS, Service Worker
│   │   │                           # Features: 18 RSS feeds, search, clipboard
│   │   └── images/
│   │       └── hero-bg.png         # Hero background (glassmorphism)
│   ├── src/
│   │   ├── App.tsx                 # React entry point (for future expansion)
│   │   ├── main.tsx                # React DOM mount
│   │   ├── index.css               # Global Tailwind styles
│   │   ├── pages/
│   │   │   └── Home.tsx            # Home page component
│   │   ├── components/             # Reusable UI components
│   │   ├── contexts/               # React context providers
│   │   ├── hooks/                  # Custom React hooks
│   │   └── lib/                    # Utility functions
│   └── index.html                  # Vite entry template
│
├── server/                          # Backend placeholder
│   └── index.ts                    # Express server (optional)
│
├── shared/                          # Shared types and constants
│   └── const.ts                    # Shared constants
│
├── tests/                           # Test suite
│   ├── app.test.js                 # Unit tests (~200 lines)
│   │                               # Tests: feeds, URLs, search, clipboard
│   └── e2e.spec.js                 # E2E tests (~300 lines)
│                                   # Tests: UI interactions, workflows
│
├── Dockerfile                       # Multi-stage Docker build (1.5KB)
│                                   # Stage 1: Node 20 Alpine (build)
│                                   # Stage 2: nginx Alpine (production)
│                                   # Final size: ~10MB
│
├── nginx.conf                       # Production nginx config (2.6KB)
│                                   # Features: SPA routing, caching,
│                                   # security headers, gzip compression
│
├── .gitlab-ci.yml                   # GitLab CI/CD pipeline (3.9KB)
│                                   # Stages: build, test, security, deploy
│                                   # Jobs: 8 total (4 active, 4 allow_failure)
│
├── vitest.config.ts                 # Vitest configuration
│                                   # Environment: jsdom
│                                   # Coverage: v8 provider
│
├── vite.config.ts                   # Vite build configuration
│                                   # React plugin, alias resolution
│
├── tsconfig.json                    # TypeScript configuration
│                                   # Target: ES2020, Module: ESNext
│
├── tsconfig.node.json               # TypeScript config for build tools
│
├── package.json                     # Project dependencies (3.3KB)
│                                   # Scripts: dev, build, test, preview
│                                   # Dependencies: React, Tailwind, etc.
│
├── pnpm-lock.yaml                   # Locked dependency versions
│                                   # Ensures reproducible builds
│
├── .gitignore                       # Git ignore rules
│                                   # Excludes: node_modules, dist, .env
│
├── .prettierrc                      # Code formatting rules
│
├── .prettierignore                  # Prettier ignore patterns
│
├── components.json                  # shadcn/ui component config
│
├── patches/                         # pnpm patch files
│
├── README.md                        # Main documentation (10KB)
│                                   # Sections: Overview, Quick Start,
│                                   # Architecture, Usage, Deployment
│
├── DEPLOYMENT.md                    # Deployment guide (8KB)
│                                   # Covers: GitLab Pages, Docker Hub,
│                                   # Self-hosted, Kubernetes, SSL/HTTPS
│
├── PROJECT_SUMMARY.md               # Executive summary (5KB)
│                                   # Deliverables, specs, metrics
│
├── STRUCTURE.md                     # This file
│                                   # Directory and file descriptions
│
└── ideas.md                         # Design exploration (5KB)
                                    # Three design approaches evaluated
                                    # Selected: Glassmorphism

```

## Key Files Description

### Frontend Application

**`client/public/index.html` (25KB)**

The heart of the application—a single, self-contained HTML file containing complete HTML5 markup with semantic structure, embedded CSS (~450 lines) with glassmorphism design system, and vanilla JavaScript (~300 lines) with no external dependencies. The file includes a Service Worker for offline support, 18 pre-configured UK news RSS feeds, search and filter functionality, clipboard integration, responsive design optimized for mobile-first approach, and toast notifications with loading states.

### Configuration Files

**`Dockerfile` (1.5KB)**

Multi-stage Docker build configuration implementing a two-stage approach: Stage 1 uses Node 20 Alpine for building the frontend, while Stage 2 uses nginx Alpine for production serving. The configuration includes security hardening with non-root user execution and health checks, resulting in a final image size of approximately 10MB.

**`nginx.conf` (2.6KB)**

Production nginx configuration providing SPA routing where all routes serve index.html, Gzip compression at level 6, security headers including CSP and X-Frame-Options, static asset caching for one year, and denial of access to hidden files.

**`.gitlab-ci.yml` (3.9KB)**

GitLab CI/CD pipeline with five stages: Build (frontend compilation), Test (unit tests and linting), Security (dependency audit and container scanning), Deploy (Docker registry and GitLab Pages), and Scheduled (weekly security audits). The pipeline includes eight total jobs with four active and four allowing failure to prevent blocking.

### Testing

**`tests/app.test.js` (~200 lines)**

Unit tests covering feed data validation with 18+ sources, URL format validation, search filtering logic, clipboard formatting, HTML structure verification, accessibility attributes, performance benchmarks, and PWA support verification.

**`tests/e2e.spec.js` (~300 lines)**

End-to-end tests covering page load and initialization, feed generation workflow, search and filter functionality, copy operations, keyboard shortcuts, responsive design across three breakpoints, accessibility compliance, and error handling scenarios.

### Documentation

**`README.md` (10KB)**

Comprehensive project documentation including project overview and key features, quick start guide for both development and Docker deployment, architecture explanation, design system details, usage instructions with examples, performance metrics, security information, development workflow, deployment options, browser support, and contributing guidelines.

**`DEPLOYMENT.md` (8KB)**

Detailed deployment guide covering GitLab Pages deployment with automatic setup, Docker Hub integration, self-hosted server setup for both Docker and traditional approaches, Kubernetes deployment with manifest examples, SSL/HTTPS configuration, monitoring and logging strategies, scaling approaches, and comprehensive troubleshooting guide.

**`PROJECT_SUMMARY.md` (5KB)**

Executive summary document providing project overview and metrics, deliverables breakdown, technical specifications, file structure overview, quality metrics, security implementation details, and future enhancement roadmap.

## File Statistics

| Category | Files | Total Size |
|----------|-------|-----------|
| Frontend | 1 HTML + assets | 25KB |
| Configuration | 4 files | ~8KB |
| Tests | 2 files | ~500 lines |
| Documentation | 4 files | ~33KB |
| Build/Config | 6 files | ~3KB |
| **Total** | **~20 files** | **~70KB** |

## Development Workflow

### Initial Setup

```bash
git clone <repo>
cd rss-feed-manager
pnpm install
pnpm dev
```

### Making Changes

Edit `client/public/index.html` for single-file application changes, or edit React components in `client/src/` for expansion. Run tests with `pnpm test`, build with `pnpm build`, and preview with `pnpm preview`.

### Deployment

Push to the main branch, and the GitLab CI/CD pipeline runs automatically. The application deploys to GitLab Pages within 2 minutes, and the Docker image is pushed to the registry.

## Important Notes

### Single-File Application

The main application is `client/public/index.html`. This file is completely self-contained with no external dependencies, can be deployed as-is to any web server, works offline with Service Worker, includes all CSS and JavaScript inline, and is optimized for fast loading.

### Docker Deployment

The Dockerfile creates a production-ready image using a multi-stage build for efficiency, nginx:alpine base (~5MB), final image size of ~10MB, startup time under 2 seconds, and includes health checks for monitoring.

### CI/CD Pipeline

The `.gitlab-ci.yml` automates building frontend assets, running tests, security scanning, deploying to GitLab Pages, and pushing Docker images to the registry.

## Customization Guide

### Adding More RSS Feeds

Edit the `UK_RSS_FEEDS` array in `client/public/index.html`:

```javascript
const UK_RSS_FEEDS = [
  { name: 'Your Feed', url: 'https://example.com/rss' },
  // ... more feeds
];
```

### Changing Colors

Modify CSS variables in the `<style>` tag to customize the color palette and visual appearance of the application.

### Extending with React

The `client/src/` directory contains React components. To expand the application, create new components in `client/src/components/`, add pages in `client/src/pages/`, update `client/src/App.tsx` with routes, and run `pnpm build` to compile.

## Security Considerations

All dependencies are pinned in `pnpm-lock.yaml` to ensure reproducible builds. Weekly security audits run via CI/CD, container vulnerability scanning is implemented, security headers are configured in nginx, non-root user execution is enforced in Docker container, and CSP headers prevent XSS attacks.

## Performance Optimization

The single HTML file is under 50KB, Gzip compression achieves 70% reduction in transfer size, browser caching is set for 1 year on static assets, Service Worker enables offline support, and CSS/JS are minified inline for optimization.

---

*For more information, see README.md, DEPLOYMENT.md, or PROJECT_SUMMARY.md*
