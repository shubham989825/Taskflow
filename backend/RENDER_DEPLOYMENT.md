# Render Deployment Environment Variables

## Required Environment Variables

Add these environment variables in your Render dashboard:

### 1. FRONTEND_URI
- **Value**: Your deployed frontend URL (e.g., `https://your-app-name.onrender.com`)
- **Purpose**: CORS configuration for API requests
- **Example**: `https://taskflow-frontend.onrender.com`

### 2. MONGO_URI
- **Value**: Your MongoDB connection string
- **Purpose**: Database connection
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority`

### 3. JWT_SECRET
- **Value**: A secure secret string for JWT tokens
- **Purpose**: Authentication token signing
- **Example**: `your-secure-jwt-secret-key`

### 4. PORT
- **Value**: `5000`
- **Purpose**: Server port (Render will override this, but good to have default)

## Setup Instructions

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add the environment variables above
5. Redeploy your service

## Notes

- `FRONTEND_URI` should match your deployed frontend URL exactly
- Make sure to include `https://` for production URLs
- The backend will automatically use these values for CORS and database connections
- Socket.IO also uses the same CORS configuration for real-time features

## Testing

After deployment, test:
1. API endpoints are accessible
2. CORS allows requests from your frontend
3. Real-time features work properly
4. Authentication tokens are handled correctly
