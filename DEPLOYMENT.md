# Deployment Instructions

## Prerequisites

1. Node.js 20+ installed
2. PostgreSQL database (can use Neon, Supabase, or any PostgreSQL provider)
3. Google OAuth credentials (for Google Sign-In)
4. Stream Chat account (for real-time messaging)
5. UploadThing account (for file uploads)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000" # Change for production

# Stream Chat
NEXT_PUBLIC_STREAM_KEY="your-stream-key"
STREAM_SECRET="your-stream-secret"

# UploadThing
NEXT_PUBLIC_UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Cron job secret (for cleanup jobs)
CRON_SECRET="your-cron-secret"
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` in your browser

## Production Deployment

### Option 1: Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign up for a Vercel account at [vercel.com](https://vercel.com)
3. Import your project
4. Add environment variables in the Vercel dashboard
5. Deploy!

### Option 2: Node.js Server

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Run the production server:
   ```bash
   npm start
   ```

### Option 3: Docker

1. Build the Docker image:
   ```bash
   docker build -t socially .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env socially
   ```

## Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env` file
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Monitoring and Maintenance

1. Set up a cron job to run the cleanup endpoint daily:
   ```
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://your-domain.com/api/clear-uploads
   ```

2. Monitor logs for errors
3. Regularly backup your database

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear the Next.js cache:
   ```bash
   rm -rf .next
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check that all environment variables are set correctly

### Database Connection Issues

1. Verify the `DATABASE_URL` format
2. Ensure the database server is accessible
3. Check firewall settings if deploying to a cloud provider

### Authentication Issues

1. Verify Google OAuth credentials
2. Ensure the redirect URI is set correctly in the Google Console
3. Check that `NEXT_PUBLIC_BASE_URL` is set correctly

## Performance Optimization

1. Enable compression in your reverse proxy (nginx, Apache)
2. Use a CDN for static assets
3. Enable database connection pooling
4. Monitor bundle sizes and optimize large dependencies