# Script to build and push Docker images to Docker Hub
# Make sure to run `docker login` before running this script!

$DOCKER_USERNAME = "dockerpasindu"
$TAG = "1.0.0"

Write-Host "Building Docker images..."
docker-compose build

Write-Host "Pushing sl-police-nginx..."
docker push $DOCKER_USERNAME/sl-police-nginx:$TAG

Write-Host "Pushing sl-police-gateway..."
docker push $DOCKER_USERNAME/sl-police-gateway:$TAG

Write-Host "Pushing sl-police-monolith..."
docker push $DOCKER_USERNAME/sl-police-monolith:$TAG

Write-Host "Pushing sl-police-mobile-app..."
docker push $DOCKER_USERNAME/sl-police-mobile-app:$TAG

Write-Host "Pushing sl-police-motorist-portal..."
docker push $DOCKER_USERNAME/sl-police-motorist-portal:$TAG

Write-Host "Pushing sl-police-admin-portal..."
docker push $DOCKER_USERNAME/sl-police-admin-portal:$TAG

Write-Host "All images pushed successfully!"
