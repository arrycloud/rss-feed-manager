# RSS Feed Manager - Deployment Guide

This guide covers deploying the RSS Feed Manager to various platforms using the included Docker image and GitLab CI/CD pipeline.

## Table of Contents

1. [GitLab Pages](#gitlab-pages)
2. [Docker Hub](#docker-hub)
3. [Self-Hosted Servers](#self-hosted-servers)
4. [Kubernetes](#kubernetes)
5. [Troubleshooting](#troubleshooting)

---

## GitLab Pages

GitLab Pages is the easiest deployment option—it's automatic and free.

### Automatic Deployment

The `.gitlab-ci.yml` pipeline automatically deploys to GitLab Pages on every push to the `main` branch.

**Access your site:**
```
https://your-username.gitlab.io/rss-feed-manager/
```

### Enable GitLab Pages

1. Go to **Project → Settings → Pages**
2. Ensure **Access Control** is set appropriately
3. The site is deployed automatically

### Custom Domain

1. Go to **Project → Settings → Pages**
2. Click **New Domain**
3. Enter your domain (e.g., `feeds.example.com`)
4. Update your DNS records:
   - **CNAME:** `your-username.gitlab.io`
   - Or use **A record:** GitLab's IP address
5. Enable HTTPS (automatic with Let's Encrypt)

### Troubleshooting GitLab Pages

**Site not updating:**
- Check **CI/CD → Pipelines** for failed jobs
- Verify `.gitlab-ci.yml` is valid
- Ensure `dist/public/` directory exists in artifacts

**Custom domain not working:**
- Verify DNS propagation: `nslookup your-domain.com`
- Check domain is added in GitLab settings
- Wait 24 hours for DNS propagation

---

## Docker Hub

Push your Docker image to Docker Hub for easy deployment anywhere.

### Prerequisites

- Docker Hub account (free at https://hub.docker.com)
- Docker CLI installed locally

### Setup CI/CD Variables

1. Go to **Project → Settings → CI/CD → Variables**
2. Add these variables:
   - `DOCKER_HUB_USERNAME`: Your Docker Hub username
   - `DOCKER_HUB_PASSWORD`: Your Docker Hub access token (not password)

### Generate Docker Hub Access Token

1. Log in to Docker Hub
2. Go to **Account Settings → Security → Access Tokens**
3. Click **New Access Token**
4. Name it `gitlab-ci`
5. Copy the token and add to GitLab CI/CD variables

### Update .gitlab-ci.yml

Modify the `deploy:docker` job:

```yaml
deploy:docker:
  stage: deploy
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD
  script:
    - docker build -t $DOCKER_HUB_USERNAME/rss-feed-manager:$IMAGE_TAG .
    - docker build -t $DOCKER_HUB_USERNAME/rss-feed-manager:latest .
    - docker push $DOCKER_HUB_USERNAME/rss-feed-manager:$IMAGE_TAG
    - docker push $DOCKER_HUB_USERNAME/rss-feed-manager:latest
  only:
    - main
    - tags
```

### Verify Upload

```bash
docker pull your-username/rss-feed-manager:latest
docker run -p 80:80 your-username/rss-feed-manager:latest
```

---

## Self-Hosted Servers

Deploy to your own server using Docker or traditional hosting.

### Docker on Linux Server

**Prerequisites:**
- Linux server (Ubuntu 20.04+ recommended)
- Docker installed
- SSH access

**Deployment Steps:**

```bash
# SSH into your server
ssh user@your-server.com

# Pull the latest image
docker pull your-username/rss-feed-manager:latest

# Stop existing container (if any)
docker stop rss-feed-manager || true
docker rm rss-feed-manager || true

# Run new container
docker run -d \
  --name rss-feed-manager \
  --restart unless-stopped \
  -p 80:80 \
  -p 443:443 \
  your-username/rss-feed-manager:latest

# Verify it's running
docker ps | grep rss-feed-manager
```

### With Nginx Reverse Proxy

For production with SSL:

```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  app:
    image: your-username/rss-feed-manager:latest
    restart: unless-stopped
    expose:
      - "80"
    networks:
      - web

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - web

networks:
  web:
    driver: bridge
EOF

# Start services
docker-compose up -d
```

### Traditional Hosting (No Docker)

If your host doesn't support Docker:

```bash
# Build locally
pnpm build

# Upload dist/public/ via SFTP or Git
scp -r dist/public/* user@your-server.com:/var/www/html/

# Or clone and build on server
git clone <repo> /var/www/rss-feed-manager
cd /var/www/rss-feed-manager
pnpm install
pnpm build
```

---

## Kubernetes

Deploy to Kubernetes clusters for scalability.

### Create Kubernetes Manifests

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rss-feed-manager
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rss-feed-manager
  template:
    metadata:
      labels:
        app: rss-feed-manager
    spec:
      containers:
      - name: app
        image: your-username/rss-feed-manager:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /index.html
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /index.html
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: rss-feed-manager
spec:
  selector:
    app: rss-feed-manager
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

### Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f deployment.yaml

# Verify deployment
kubectl get deployments
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/rss-feed-manager

# Access the service
kubectl port-forward svc/rss-feed-manager 8080:80
# Visit http://localhost:8080
```

---

## Environment Variables

Configure behavior via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `80` | HTTP port |
| `NODE_ENV` | `production` | Environment mode |
| `LOG_LEVEL` | `info` | Logging level |

### Example with Docker

```bash
docker run -e NODE_ENV=production -e PORT=8080 \
  -p 8080:8080 your-username/rss-feed-manager:latest
```

---

## SSL/HTTPS

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Update nginx.conf to use SSL
# Add to nginx.conf:
# listen 443 ssl;
# ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

# Auto-renew certificates
sudo systemctl enable certbot.timer
```

### Docker with Let's Encrypt

```bash
docker run -d \
  -p 80:80 \
  -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/lib/letsencrypt:/var/lib/letsencrypt \
  your-username/rss-feed-manager:latest
```

---

## Monitoring & Logging

### Docker Logs

```bash
# View logs
docker logs rss-feed-manager

# Follow logs
docker logs -f rss-feed-manager

# View last 100 lines
docker logs --tail 100 rss-feed-manager
```

### Health Checks

The container includes health checks:

```bash
# Check health
docker inspect --format='{{.State.Health.Status}}' rss-feed-manager

# View health details
docker inspect rss-feed-manager | grep -A 10 "Health"
```

### Nginx Status

Access nginx metrics:

```bash
curl http://localhost/nginx_status
```

---

## Scaling

### Horizontal Scaling with Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy service
docker service create \
  --name rss-feed-manager \
  --replicas 3 \
  -p 80:80 \
  your-username/rss-feed-manager:latest

# Scale up
docker service scale rss-feed-manager=5

# View services
docker service ls
```

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs rss-feed-manager

# Inspect image
docker inspect your-username/rss-feed-manager:latest

# Rebuild image
docker build --no-cache -t your-username/rss-feed-manager:latest .
```

### Port already in use

```bash
# Find process using port 80
sudo lsof -i :80

# Kill process
sudo kill -9 <PID>

# Or use different port
docker run -p 8080:80 your-username/rss-feed-manager:latest
```

### High memory usage

```bash
# Check container stats
docker stats rss-feed-manager

# Limit memory
docker run -m 256m your-username/rss-feed-manager:latest
```

### DNS resolution issues

```bash
# Test DNS
docker run --rm your-username/rss-feed-manager:latest \
  nslookup google.com

# Use custom DNS
docker run --dns 8.8.8.8 your-username/rss-feed-manager:latest
```

---

## Performance Optimization

### Image Size Optimization

Current size: ~10MB (nginx:alpine + app)

To reduce further:
- Use `distroless` base image (~5MB)
- Minify HTML/CSS/JS
- Remove unused dependencies

### Caching Strategy

The application includes:
- Browser caching (1 year for static assets)
- Gzip compression (6 level)
- Service Worker caching

### Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test performance
ab -n 1000 -c 10 http://your-domain.com/
```

---

## Rollback

### Rollback Docker Image

```bash
# List available images
docker images your-username/rss-feed-manager

# Stop current container
docker stop rss-feed-manager

# Run previous version
docker run -d --name rss-feed-manager \
  your-username/rss-feed-manager:v1.0.0
```

### Rollback GitLab Pages

1. Go to **CI/CD → Pipelines**
2. Find previous successful pipeline
3. Click **Deploy** button
4. Select previous artifact

---

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set strong nginx security headers
- [ ] Use private Docker registry
- [ ] Enable container scanning
- [ ] Regular dependency updates
- [ ] Restrict network access
- [ ] Monitor logs for errors
- [ ] Enable rate limiting
- [ ] Use non-root user in container
- [ ] Regular backups

---

## Support

For deployment issues:

1. Check GitLab CI/CD pipeline logs
2. Review Docker container logs
3. Verify DNS and firewall settings
4. Check system resources (disk, memory, CPU)
5. Review security group/firewall rules

For more help, see the main [README.md](README.md)
