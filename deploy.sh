set -e #stop script on error

# server info
SERVER_USER="sangwonlee"
SERVER_HOST="crescendo.cs.vt.edu"
DEPLOY_DIR="/home/sangwonlee/project_cresendo/deploy_v2"

# stop existing node.js server
echo "Stopping existing Node.js server..."
ssh $SERVER_USER@$SERVER_HOST "pm2 stop all"

# build frontend
echo "Installing frontend dependencies..."
cd frontend
npm install
echo "Building frontend..."
npm run build
cd ..

# upload frontend build
echo "Uploading frontend build..."
rsync -av --delete --exclude 'node_modules' --exclude '.git' --exclude 'tests' ./frontend/build $SERVER_USER@$SERVER_HOST:$DEPLOY_DIR/frontend/

# upload backend
echo "Uploading backend..."
rsync -av --delete --exclude 'node_modules' --exclude '.git' --exclude 'tests' ./backend/ $SERVER_USER@$SERVER_HOST:$DEPLOY_DIR/backend/

# upload PM2 ecosystem file
echo "Uploading PM2 ecosystem file..."
rsync -av ./ecosystem.config.js $SERVER_USER@$SERVER_HOST:$DEPLOY_DIR/backend/

# run deploy command on server
echo "Deploying on server..."
ssh $SERVER_USER@$SERVER_HOST "cd $DEPLOY_DIR/backend && npm install && NODE_ENV=production pm2 start ecosystem.config.js --update-env"

# restart nginx to apply new configuration
# echo "Restarting Nginx..."
# ssh $SERVER_USER@$SERVER_HOST "sudo systemctl restart nginx"

echo "Deployment complete!"
