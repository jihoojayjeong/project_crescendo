require('dotenv').config({ path: '/home/sangwonlee/project_cresendo/deploy_v2/backend/.env.production' });

module.exports = {
    apps: [
      {
        name: 'crescendo',
        script: 'server.js',
        cwd: '/home/sangwonlee/project_cresendo/deploy_v2/backend',
        env: {
          NODE_ENV: 'production',
          MONGO_URI_PROD: process.env.MONGO_URI_PROD,
          CORS_ORIGIN: process.env.CORS_ORIGIN,
          PROD_REDIRECT_URL: process.env.PROD_REDIRECT_URL,
         // REACT_APP_CAS_LOGIN_URL: 'https://login.vt.edu/profile/cas/login?service=https://crescendo.cs.vt.edu:3000/auth/casCallback'
        }
      }
    ]
  };