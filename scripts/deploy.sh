#!/bin/bash
set -e

SERVER_USER="sangwonlee"
SERVER_HOST="crescendo.cs.vt.edu"
DEPLOY_DIR="/home/sangwonlee/project_cresendo/deploy_v2"
DOCKERHUB_USERNAME="jihoovt" 
VERSION=$(date +%Y%m%d%H%M%S)

# Set PUBLIC_URL
PUBLIC_URL="/"

# Build and push Docker images
echo "Building and pushing Docker images..."
docker buildx build --platform linux/amd64,linux/arm64 -t $DOCKERHUB_USERNAME/crescendo-frontend:$VERSION -t $DOCKERHUB_USERNAME/crescendo-frontend:latest --build-arg PUBLIC_URL=$PUBLIC_URL --push ../frontend
docker buildx build --platform linux/amd64,linux/arm64 -t $DOCKERHUB_USERNAME/crescendo-backend:$VERSION -t $DOCKERHUB_USERNAME/crescendo-backend:latest --push ../backend

# Update docker-compose.prod.yml with new version tags
sed -i '' "s|image: $DOCKERHUB_USERNAME/crescendo-frontend:.*|image: $DOCKERHUB_USERNAME/crescendo-frontend:$VERSION|" ../docker/docker-compose.prod.yml
sed -i '' "s|image: $DOCKERHUB_USERNAME/crescendo-backend:.*|image: $DOCKERHUB_USERNAME/crescendo-backend:$VERSION|" ../docker/docker-compose.prod.yml

# Transfer files to server
echo "Transferring files to server..."
rsync -avz ../docker/docker-compose.prod.yml ../env/frontend.env ../env/backend.env $SERVER_USER@$SERVER_HOST:$DEPLOY_DIR/


# Deploy on server
echo "Deploying on server..."
ssh $SERVER_USER@$SERVER_HOST << EOF
  cd $DEPLOY_DIR
  export VERSION=$VERSION
  docker compose -f docker-compose.prod.yml pull
  docker compose -f docker-compose.prod.yml up -d
  echo "Deployment completed."
EOF

echo "Deployment process finished!"
