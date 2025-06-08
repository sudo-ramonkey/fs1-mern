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
   npm start

   # In a separate terminal, run frontend
   cd front
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Deployment

This project is configured for automated CI/CD deployment using Docker Compose and GitHub Actions.

### Docker Compose Deployment

The application is deployed using Docker Compose with the following services:

- **Backend**: Node.js Express API with MongoDB connection (port 5000)
- **Frontend**: React application served via Nginx (port 80)

### CI/CD Workflow

Pushing to the `main` branch triggers the deployment workflow:

1. Cleans out old containers and images
2. Builds Docker images for frontend and backend using Docker Compose
3. Deploys the containers using `docker-compose up -d`

### Manual Deployment

For manual deployment using Docker Compose:

```bash
# Build and start the services
docker-compose up -d

# To stop the services
docker-compose down

# To rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

Make sure to set the required environment variables in your `.env` file:
- `MONGO_URI`
- `MONGO_USER`
- `MONGO_PASSWORD`

## Project Structure

```
fs1-mern/
├── back/                 # Backend Node.js Express API
├── front/                # Frontend React application
├── docker-compose.yml    # Docker Compose configuration
└── .github/workflows/    # GitHub Actions workflows
```

## Useful Resources

[Carbon Story Book](https://react.carbondesignsystem.com/?path=/docs/getting-started-welcome--welcome)

[Carbon Icons](https://carbon-elements.netlify.app/icons/examples/preview/)

[Docker Compose Documentation](https://docs.docker.com/compose/)
