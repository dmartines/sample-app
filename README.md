# Full Stack Sample Application

A modern full-stack application featuring a Vite.js React frontend and FastAPI backend.

## Project Structure

```
sample-app/
├── frontend/           # Vite.js + React + TypeScript frontend
│   ├── src/           # Frontend source code
│   ├── public/        # Static files
│   └── Dockerfile     # Frontend container configuration
├── backend/           # FastAPI backend
│   ├── app.py        # Main FastAPI application
│   ├── requirements.txt
│   └── Dockerfile    # Backend container configuration
└── docker-compose.yml # Docker composition for all services
```

## Prerequisites

- Node.js 20.x or later
- Python 3.11 or later
- Docker and Docker Compose
- Git

## Local Development

### Frontend (Vite.js + React)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at http://localhost:3000

### Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
python app.py
```

The backend API will be available at http://localhost:5001

## Docker Deployment

The entire application can be run using Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down
```

When running with Docker Compose:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- API Documentation: http://localhost:5001/docs

## API Endpoints

### Backend

- `GET /api/hello`: Returns a hello world message
  ```json
  {
    "message": "Hello World"
  }
  ```

## Development Notes

### Frontend
- Built with Vite.js for faster development
- Uses TypeScript for better type safety
- Includes React for UI components
- Styled with modern CSS

### Backend
- FastAPI for high-performance API
- Automatic API documentation with Swagger UI
- CORS enabled for frontend communication
- Type hints and validation

## Deployment to Azure

### Frontend Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Create Azure resources:
```bash
az group create --name myResourceGroup --location "East US"
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name my-vite-app --runtime "NODE|20-lts"
```

3. Deploy the build:
```bash
cd dist
zip -r ../app.zip .
az webapp deployment source config-zip --resource-group myResourceGroup --name my-vite-app --src ../app.zip
```

### Backend Deployment

1. Create Azure Container Registry:
```bash
az acr create --resource-group myResourceGroup --name myRegistry --sku Basic
az acr login --name myRegistry
```

2. Build and push backend image:
```bash
cd backend
docker build -t myregistry.azurecr.io/fastapi-app:v1 .
docker push myregistry.azurecr.io/fastapi-app:v1
```

3. Create App Service for backend:
```bash
az webapp create --resource-group myResourceGroup --plan myAppServicePlan \
  --name my-fastapi-app --deployment-container-image-name myregistry.azurecr.io/fastapi-app:v1
```

4. Configure container settings:
```bash
az webapp config container set --name my-fastapi-app --resource-group myResourceGroup \
  --docker-custom-image-name myregistry.azurecr.io/fastapi-app:v1 \
  --docker-registry-server-url https://myregistry.azurecr.io
```

## Azure App Service Deployment Guide

### Prerequisites for Azure Deployment

1. Install Azure CLI
```bash
# macOS
brew install azure-cli

# Windows
winget install -e --id Microsoft.AzureCLI

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

2. Login to Azure
```bash
az login
```

### Deploy Frontend to Azure App Service

1. Build the frontend for production:
```bash
cd frontend
npm run build
```

2. Create a resource group if you don't have one:
```bash
az group create --name myResourceGroup --location "East US"
```

3. Create an App Service Plan:
```bash
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --sku B1 \
  --is-linux
```

4. Create a Web App for the frontend:
```bash
az webapp create \
  --name my-vite-frontend \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --runtime "NODE|20-lts"
```

5. Configure the build output:
```bash
cd dist
zip -r ../frontend.zip .
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name my-vite-frontend \
  --src ../frontend.zip
```

### Deploy Backend to Azure App Service

1. Create an Azure Container Registry:
```bash
# Create ACR
az acr create \
  --resource-group myResourceGroup \
  --name myappregistry \
  --sku Basic

# Login to ACR
az acr login --name myappregistry
```

2. Build and push the backend Docker image:
```bash
cd backend
docker build -t myappregistry.azurecr.io/fastapi-backend:v1 .
docker push myappregistry.azurecr.io/fastapi-backend:v1
```

3. Create a Web App for the backend:
```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name my-fastapi-backend \
  --deployment-container-image-name myappregistry.azurecr.io/fastapi-backend:v1
```

4. Configure the container registry credentials:
```bash
# Get the registry credentials
ACR_USERNAME=$(az acr credential show -n myappregistry --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show -n myappregistry --query "passwords[0].value" -o tsv)

# Configure the web app
az webapp config container set \
  --name my-fastapi-backend \
  --resource-group myResourceGroup \
  --docker-custom-image-name myappregistry.azurecr.io/fastapi-backend:v1 \
  --docker-registry-server-url https://myappregistry.azurecr.io \
  --docker-registry-server-user $ACR_USERNAME \
  --docker-registry-server-password $ACR_PASSWORD
```

### Configure Environment Variables

1. Set frontend environment variables:
```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name my-vite-frontend \
  --settings \
    VITE_API_URL="https://my-fastapi-backend.azurewebsites.net"
```

2. Set backend environment variables:
```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name my-fastapi-backend \
  --settings \
    ALLOWED_ORIGINS="https://my-vite-frontend.azurewebsites.net"
```

### Enable CORS for Backend

Configure CORS in the backend App Service:
```bash
az webapp cors add \
  --resource-group myResourceGroup \
  --name my-fastapi-backend \
  --allowed-origins "https://my-vite-frontend.azurewebsites.net"
```

### Verify Deployment

Your applications will be available at:
- Frontend: https://my-vite-frontend.azurewebsites.net
- Backend: https://my-fastapi-backend.azurewebsites.net
- API Documentation: https://my-fastapi-backend.azurewebsites.net/docs

### Troubleshooting

1. View backend logs:
```bash
az webapp log tail \
  --resource-group myResourceGroup \
  --name my-fastapi-backend
```

2. View frontend logs:
```bash
az webapp log tail \
  --resource-group myResourceGroup \
  --name my-vite-frontend
```

3. Restart an App Service:
```bash
az webapp restart \
  --resource-group myResourceGroup \
  --name <app-name>
```

### Cleanup Resources

To avoid incurring charges, clean up resources when no longer needed:
```bash
az group delete --name myResourceGroup --yes
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request