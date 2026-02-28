# Frontend Render Deployment

## Environment Variables

Add this environment variable in your Render dashboard:

### VITE_BACKEND_URL
- **Value**: Your deployed backend URL (e.g., `https://your-backend-name.onrender.com`)
- **Purpose**: API endpoint configuration
- **Example**: `https://taskflow-backend.onrender.com`

## Setup Instructions

1. Go to your Render dashboard
2. Select your frontend service
3. Go to "Environment" tab
4. Add the environment variable above
5. Redeploy your service

## Important Notes

- The frontend will automatically use the deployed backend URL when `VITE_BACKEND_URL` is set
- For local development, it will fallback to `http://localhost:5000`
- Make sure to include `https://` for production URLs
- The backend URL must match exactly (no trailing slash needed)

## Testing

After deployment, test:
1. Authentication (login/register)
2. Board creation and management
3. Task operations (create, edit, delete, drag-drop)
4. Real-time updates with Socket.IO

## CORS Configuration

Ensure your backend has the correct `FRONTEND_URI` environment variable set to your frontend URL for proper CORS configuration.
