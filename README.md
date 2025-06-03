# Part 1: Deploy React + Next.js App to Azure App Services

## Prepare your Next.js app

```
npm run build

## Create Azure App Service Plan + Web App:

```
az group create --name myResourceGroup --location "East US"
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name my-nextjs-app 
--runtime "NODE|18-lts" 

## Deploy via GitHub:

```
zip -r app.zip .
az webapp deployment source config-zip --resource-group myResourceGroup --name my-nextjs-app```
--src app.zip


# Part 2: Deploy Flask Docker App to Azure App Services

## Dockerize your Flask app:

```
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]```

## Build and push Docker image to Azure Container Registry (ACR):

```
az acr create --resource-group myResourceGroup --name myRegistry --sku Basic
az acr login --name myRegistry
docker tag flask-app myregistry.azurecr.io/flask-app:v1
docker push myregistry.azurecr.io/flask-app:v1```

## Create App Service with custom container:

```
az webapp create --resource-group myResourceGroup --plan myAppServicePlan \ --name my-flask-app --deployment-container-image-name myregistry.azurecr.io/flask-app:v1```

## Grant App Service access to ACR:

```az webapp config container set --name my-flask-app --resource-group myResourceGroup \
  --docker-custom-image-name myregistry.azurecr.io/flask-app:v1 \
  --docker-registry-server-url https://myregistry.azurecr.io
