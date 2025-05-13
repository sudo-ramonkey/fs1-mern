# Kubernetes Deployment for MERN Stack Application

This directory contains Kubernetes manifests for deploying the fs1-mern application (frontend and backend) to a Kubernetes cluster as StatefulSets.

## Overview

The deployment consists of:

- Backend StatefulSet (Node.js Express API)
- Frontend StatefulSet (React app served via Nginx)
- Services for both components
- Ingress for external access
- MongoDB credentials as Kubernetes Secret

## Components

### Backend

- **StatefulSet**: `backend-statefulset.yaml`
- **Service**: `backend-service.yaml`
- Uses Node.js container
- Connects to MongoDB
- Exposes REST API on port 5000
- Health check endpoint at `/health`

### Frontend

- **StatefulSet**: `frontend-statefulset.yaml`
- **Service**: `frontend-service.yaml`
- Uses Nginx to serve static React files
- Connects to backend API

### Additional Resources

- **MongoDB Secret**: `mongodb-secret.yaml`
- **Ingress**: `ingress.yaml` - Routes traffic to frontend and backend services

## Zero-Downtime Deployment

The StatefulSets are configured for zero downtime using:

- Rolling update strategy
- Readiness and liveness probes to ensure smooth transitions
- Session affinity for consistent user experience

## Manual Deployment

To deploy manually (not using GitHub Actions):

```bash
# Create and apply MongoDB Secret first (do NOT commit secrets to the repo!)
# Either create a secret directly or use a tool like sealed-secrets or external-secrets
kubectl create secret generic mongodb-credentials \
  --from-literal=uri="mongodb://user:password@mongodb:27017/dbname?authSource=admin" \
  --from-literal=username="user" \
  --from-literal=password="password"

# Apply Services
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-service.yaml

# Deploy StatefulSets
kubectl apply -f backend-statefulset.yaml
kubectl apply -f frontend-statefulset.yaml

# Apply Ingress
kubectl apply -f ingress.yaml
```

## Monitoring

Check deployment status:

```bash
# Check Services
kubectl get services

# Check Pods
kubectl get pods

# Check StatefulSets
kubectl get statefulsets

# View logs
kubectl logs -f statefulset/backend-0
kubectl logs -f statefulset/frontend-0
```

## Customization

Create MongoDB credentials as a Kubernetes secret for production use. Never commit secrets to the repository.

Change `ingress.yaml` to use your domain name instead of the example domain.