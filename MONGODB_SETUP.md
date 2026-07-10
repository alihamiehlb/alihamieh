# MongoDB Atlas Setup Guide

This portfolio now uses MongoDB Atlas for database storage, providing a robust admin management system for editing CV, profile, projects, and achievements.

## Setup Instructions

### 1. Create MongoDB Atlas Account

1. Go to [mongodb.com](https://www.mongodb.com) and sign up for a free account
2. Create a new project (or use an existing one)
3. Create a new cluster:
   - Choose "Free" tier (M0)
   - Select a region closest to your users
   - Wait for cluster to be created (2-5 minutes)

### 2. Configure Database Access

1. Go to "Database Access" in your Atlas dashboard
2. Click "Add New Database User"
3. Create a username and strong password
4. Select "Read and write to any database" for privileges
5. Click "Add User"

### 3. Configure Network Access

1. Go to "Network Access" in your Atlas dashboard
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
4. For production, add your Vercel deployment IPs

### 4. Get Connection String

1. Go to "Database" in your Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select Node.js version
5. Copy the connection string

### 5. Update Environment Variables

Add the following to your `.env` file:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster-name.mongodb.net/portfolio?retryWrites=true&w=majority
```

Replace:
- `YOUR_USERNAME` with your MongoDB username
- `YOUR_PASSWORD` with your MongoDB password
- `cluster-name` with your actual cluster name

### 6. Seed the Database

After setting up your `.env` file, run the seed script to populate MongoDB with your existing content:

```bash
npm run seed:mongo
```

This will import all your existing CV, profile, projects, achievements, and deployed projects data.

### 7. Deploy to Vercel

1. Go to your Vercel project settings
2. Add `MONGODB_URI` as an environment variable
3. Redeploy your application

## Features

- **MongoDB Integration**: All admin panel data is stored in MongoDB Atlas
- **Fallback System**: If MongoDB is not configured, the system falls back to local JSON files
- **Image Optimization**: Images are automatically optimized to WebP format for faster loading
- **Real-time Updates**: Changes in the admin panel are immediately reflected on your site

## Admin Panel Access

Visit `/admin` on your site to access the admin panel. Use the password set in your `ADMIN_PASSWORD` environment variable.

## Troubleshooting

### Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas Network Access
- Check that your username/password are correct in the connection string
- Verify the cluster name matches your Atlas cluster

### Seeding Issues
- Make sure your `.env` file has the correct `MONGODB_URI`
- Ensure you have internet connectivity
- Check that your MongoDB cluster is active

### Admin Panel Issues
- Verify `ADMIN_PASSWORD` is set (minimum 8 characters)
- Check that `ADMIN_SESSION_SECRET` is configured
- Clear your browser cookies if login fails

## Storage Options

The system supports multiple storage backends:

1. **MongoDB Atlas** (recommended for production)
2. **Vercel Blob** (for images)
3. **Local JSON files** (fallback for development)

Images are stored using Vercel Blob or locally, as MongoDB is not optimized for large binary files.
