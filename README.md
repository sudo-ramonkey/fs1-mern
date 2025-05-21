# fs1-mern (El mundo de las guitarras)
> ¿Aqui en el mundo de las guitarras?

> [alejandroSampa11](https://github.com/alejandroSampa11)

This is the repo for [Gadielo023](https://github.com/Gadielo023) and [sudo-ramonkey](https://github.com/sudo-ramonkey) project for their fullstack I class

## Getting Started

### Local Development

To run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gadielo023/fs1-mern.git
   cd fs1-mern
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd back
   npm install
   cd ..

   # Install frontend dependencies
   cd front
   npm install
   cd ..
   ```

3. **Set up environment variables**
   - Create a `.env` file in the back directory
   - Add necessary environment variables (DB connection string, etc.)

4. **Run the application**
   ```bash
   # Run backend
   cd back
   npm run dev

   # In a separate terminal, run frontend
   cd front
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Deployment

This project is configured for automated CI/CD deployment to Kubernetes using GitHub Actions.

### Kubernetes Deployment

The application is deployed as StatefulSets for zero-downtime deployments:

- **Backend**: Node.js Express API with MongoDB connection
- **Frontend**: React application served via Nginx
- **Ingress**: Configured to route traffic to the appropriate services

### CI/CD Workflow

Pushing to the `main` branch triggers the deployment workflow:

1. Builds Docker images for frontend and backend
2. Pushes images to GitHub Container Registry
3. Updates Kubernetes manifests with new image tags
4. Applies the manifests to the Kubernetes cluster
5. Verifies the deployment

### Manual Deployment

For manual deployment, see the instructions in `k8s/README.md`.

## Project Structure

```
fs1-mern/
├── back/                 # Backend Node.js Express API
├── front/                # Frontend React application
├── k8s/                  # Kubernetes manifests
└── .github/workflows/    # GitHub Actions workflows
```

## Useful Resources

[Carbon Story Book](https://react.carbondesignsystem.com/?path=/docs/getting-started-welcome--welcome)

[Carbon Icons](https://carbon-elements.netlify.app/icons/examples/preview/)

[Kubernetes Documentation](https://kubernetes.io/docs/home/)
