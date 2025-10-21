# 🚀 Acquisitions API

> **Production-Grade Node.js Express API with Complete CI/CD Pipeline, Docker Containerization, and Kubernetes Deployment**

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.1-blue?logo=express)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue?logo=kubernetes)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Docker](#docker)
- [Kubernetes](#kubernetes)
- [Security](#security)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Acquisitions API** is a robust, production-ready REST API built with Node.js and Express. It demonstrates enterprise-level development practices including:

- ✅ Automated testing with Jest
- ✅ Container orchestration with Docker
- ✅ Kubernetes deployment manifests
- ✅ GitHub Actions CI/CD pipeline
- ✅ Security best practices
- ✅ Comprehensive logging and monitoring
- ✅ API authentication and authorization
- ✅ Multi-platform Docker builds (amd64, arm64)

---

## ⭐ Features

### 🔐 Security
- JWT authentication
- Role-based access control (RBAC)
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting with Arcjet
- Non-root container execution
- SQL injection prevention with Drizzle ORM

### 📊 Performance
- Optimized multi-stage Docker builds
- Response caching strategies
- Efficient database queries with Drizzle
- Winston JSON logging for analysis
- Health checks every 30 seconds

### 🧪 Testing & Quality
- Jest unit tests with 100% coverage target
- Supertest for API endpoint testing
- ESLint configuration
- Prettier code formatting
- Automated testing on every push

### 📦 Deployment
- GitHub Actions CI/CD pipeline
- Docker image publication to Docker Hub
- Multi-platform builds (linux/amd64, linux/arm64)
- Kubernetes ready with complete manifests
- Rolling updates with zero downtime
- Horizontal Pod Autoscaler (HPA)

### 📝 Logging & Monitoring
- Morgan HTTP request logging
- Winston structured logging (JSON format)
- Health check endpoints
- Request tracking
- Performance metrics

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 20 (Alpine) |
| **Framework** | Express | 5.1+ |
| **Database** | PostgreSQL (Neon) | Latest |
| **ORM** | Drizzle ORM | 0.44+ |
| **Authentication** | JWT | 9.0+ |
| **Validation** | Zod | 4.1+ |
| **Security** | Helmet, Bcrypt | Latest |
| **Logging** | Winston, Morgan | Latest |
| **Testing** | Jest, Supertest | Latest |
| **Containerization** | Docker | Latest |
| **Orchestration** | Kubernetes | 1.28+ |
| **CI/CD** | GitHub Actions | Native |
| **Package Manager** | npm | 10+ |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional, for containerization)
- PostgreSQL or Neon account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/GalaxyMatrix/acquisitions.git
cd acquisitions

# 2. Install dependencies
npm ci

# 3. Create environment file
cp .env.example .env
# Edit .env with your database credentials

# 4. Setup database
npm run db:push

# 5. Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/acquisitions

# JWT
JWT_SECRET=your-secret-key-here

# API Keys (if applicable)
API_KEY=your-api-key

# Logging
LOG_LEVEL=info
```

---

## 📁 Project Structure

```
acquisitions/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── config/
│   │   ├── database.js        # Database configuration
│   │   └── logger.js          # Winston logger setup
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Express middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── models/                # Database models (Drizzle)
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/
│   │   └── format.js          # Utility functions
│   └── validations/           # Zod schemas
├── tests/
│   ├── app.test.js            # App tests
│   ├── setup.js               # Test setup
│   ├── integration/           # Integration tests
│   └── unit/                  # Unit tests
├── k8s/                       # Kubernetes manifests
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── hpa.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml
├── .github/workflows/
│   ├── tests.yml              # Testing workflow
│   ├── docker-build-and-push.yml  # Docker workflow
│   └── deploy-k8s.yml         # Kubernetes deployment
├── Dockerfile                 # Multi-stage build
├── docker-compose.dev.yml     # Local development
├── package.json
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
└── README.md
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

All protected endpoints require a JWT token:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-21T22:42:49.000Z",
  "uptime": 1234567
}
```

#### Get API Info

```http
GET /api
```

**Response:**
```json
{
  "name": "Acquisitions API",
  "version": "1.0.0",
  "description": "Node.js Express API for acquisitions system"
}
```

---

## 💻 Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
npm run format:check

# Database commands
npm run db:generate   # Generate migrations
npm run db:migrate    # Run migrations
npm run db:push       # Push schema changes
npm run db:studio     # Open Drizzle Studio
```

### Code Quality

This project maintains high code quality standards:

- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Jest**: Unit and integration testing
- **Supertest**: API endpoint testing

Run before committing:

```bash
npm run lint:fix
npm run format
npm test
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- app.test.js

# Run with coverage
npm test -- --coverage

# Watch mode (re-run on changes)
npm test -- --watch
```

### Test Structure

```javascript
// tests/app.test.js
describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
    });
  });
});
```

### Coverage Goals

- ✅ Unit tests: >80% coverage
- ✅ Integration tests: Critical paths
- ✅ E2E tests: Key user workflows

---

## 📦 Docker

### Building Locally

```bash
# Development image
docker build -t acquisitions-app:dev --target development .

# Production image
docker build -t acquisitions-app:prod --target production .

# Run container
docker run -p 3000:3000 acquisitions-app:prod
```

### Docker Compose (Development)

```bash
# Start services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Multi-Platform Builds

The GitHub Actions workflow automatically builds for multiple platforms:

- `linux/amd64` (x86-64)
- `linux/arm64` (ARM64/Apple Silicon)

```bash
# Build locally for multiple platforms (requires buildx)
docker buildx build --platform linux/amd64,linux/arm64 -t acquisitions-app:latest .
```

---

## ☸️ Kubernetes

### Prerequisites

- kubectl installed
- Kubeconfig configured
- Access to Kubernetes cluster

### Deployment

```bash
# Apply all manifests
kubectl apply -k k8s/

# Check deployment status
kubectl get deployments -n acquisitions

# View pods
kubectl get pods -n acquisitions

# Check service
kubectl get svc -n acquisitions

# View logs
kubectl logs -n acquisitions -l app=acquisitions-app -f

# Port forward
kubectl port-forward -n acquisitions svc/acquisitions-app 3000:80
```

### Manifests

| Manifest | Purpose |
|----------|---------|
| `namespace.yaml` | Create isolated namespace |
| `configmap.yaml` | Configuration management |
| `secret.yaml` | Sensitive data storage |
| `deployment.yaml` | Application deployment (3 replicas) |
| `service.yaml` | Expose application |
| `hpa.yaml` | Auto-scaling (2-10 replicas) |
| `ingress.yaml` | External routing |
| `serviceaccount.yaml` | RBAC setup |
| `kustomization.yaml` | Orchestrate all resources |

### Auto-Scaling

The HPA automatically scales pods based on:

- **CPU**: Target 70% utilization
- **Memory**: Target 80% utilization
- **Min replicas**: 2
- **Max replicas**: 10

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. Tests Workflow (`.github/workflows/tests.yml`)

Runs on every push and pull request:

- ✅ Checkout code
- ✅ Install dependencies
- ✅ Run linting
- ✅ Run tests
- ✅ Generate coverage reports

#### 2. Docker Build & Push (`.github/workflows/docker-build-and-push.yml`)

Runs on push to main branch:

- ✅ Build Docker image for multiple platforms
- ✅ Push to Docker Hub
- ✅ Tag with branch, SHA, and version
- ✅ Generate build summary

#### 3. Kubernetes Deployment (`.github/workflows/deploy-k8s.yml`)

Manual or automatic Kubernetes deployment:

- ✅ Update deployment image
- ✅ Verify rollout status
- ✅ Health checks

### Workflow Triggers

```yaml
# Tests on every push and PR
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Docker build on main push
on:
  push:
    branches: [main]

# Manual Kubernetes deployment
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
```

---

## 🔐 Security

### Authentication & Authorization

```javascript
// JWT-based authentication
const token = jwt.sign({ userId: 123 }, process.env.JWT_SECRET);

// Role-based access control
app.post('/admin', requireRole('admin'), handler);
```

### Security Headers

Helmet.js provides:

- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Content-Security-Policy

### Database Security

- Parameterized queries via Drizzle ORM
- Connection pooling
- SQL injection prevention

### Container Security

- Non-root user execution (uid: 1001)
- Read-only root filesystem
- No privilege escalation
- Resource limits

### Secrets Management

```bash
# Store secrets in GitHub
# Settings → Secrets and variables → Actions

# Reference in workflows
${{ secrets.DATABASE_URL }}
${{ secrets.JWT_SECRET }}
```

---

## 📈 Performance

### Optimization Strategies

1. **Multi-stage Docker builds**: Reduce image size
2. **Response caching**: Reduce database hits
3. **Connection pooling**: Efficient database connections
4. **Logging**: Minimal overhead with Winston
5. **Health checks**: 30-second intervals

### Benchmarks

```bash
# Load testing
npm install -g autocannon
autocannon http://localhost:3000/health

# Expected: >1000 req/sec
```

### Monitoring

- Response times tracked in logs
- Memory usage monitored
- CPU usage analyzed
- Request throughput measured

---

## 🤝 Contributing

### Code Standards

1. Follow ESLint configuration
2. Format with Prettier
3. Write tests for new features
4. Update documentation

### Pull Request Process

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "feat: Add my feature"`
3. Push branch: `git push origin feature/my-feature`
4. Open Pull Request
5. Wait for CI/CD checks to pass
6. Request review

### Commit Message Format

```
feat: Add new feature
fix: Fix a bug
docs: Update documentation
test: Add or update tests
chore: Update dependencies
refactor: Refactor code
```

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💼 Author

**Adrian Hajdin**

- GitHub: [@GalaxyMatrix](https://github.com/GalaxyMatrix)
- Repository: [acquisitions](https://github.com/GalaxyMatrix/acquisitions)

---

## 🙏 Acknowledgments

- Node.js and Express.js communities
- Docker and Kubernetes documentation
- GitHub Actions for CI/CD
- Neon for serverless PostgreSQL
- All open-source contributors

---

## 📞 Support

### Documentation

- [Node.js Docs](https://nodejs.org/docs/)
- [Express Guide](https://expressjs.com/)
- [Docker Docs](https://docs.docker.com/)
- [Kubernetes Docs](https://kubernetes.io/docs/)

### Issues & Questions

Open an issue on [GitHub Issues](https://github.com/GalaxyMatrix/acquisitions/issues)

### Deployment Help

- **Railway**: [Railway Docs](https://railway.app/docs)
- **Vercel**: [Vercel Docs](https://vercel.com/docs)
- **AWS EKS**: [AWS EKS Guide](https://docs.aws.amazon.com/eks/)
- **Google GKE**: [GKE Docs](https://cloud.google.com/kubernetes-engine/docs)

---

## 📊 Project Stats

```
Language: JavaScript
Lines of Code: ~1000+
Test Coverage: >80%
Docker Images: Multi-platform (amd64, arm64)
Kubernetes Ready: ✅
CI/CD Enabled: ✅
Production Ready: ✅
```

---

**⭐ If you found this helpful, please star the repository!**

---

## 🚀 Quick Links

| Link | Description |
|------|-------------|
| [GitHub Repo](https://github.com/GalaxyMatrix/acquisitions) | Source code |
| [Docker Hub](https://hub.docker.com/r/yourusername/acquisitions-app) | Container images |
| [API Docs](./docs/API.md) | Detailed API documentation |
| [Contributing Guide](./CONTRIBUTING.md) | How to contribute |
| [Deployment Guide](./docs/DEPLOYMENT.md) | Deployment instructions |

---

**Last Updated**: October 22, 2025
**Version**: 1.0.0