# Wachemo University Digital Campus - Complete Deployment Guide

## 🚀 Quick Start Options

### Option 1: Local Development (Easiest)
```bash
# Install Docker Desktop first from: https://www.docker.com/products/docker-desktop

# Clone your repository
git clone https://github.com/yourusername/wcu-digital-campus.git
cd wcu-digital-campus

# Start everything with one command
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database Admin: http://localhost:8080
# MinIO Storage: http://localhost:9001
```

### Option 2: Free Cloud Deployment (Recommended for Demo)
We'll use free tiers of multiple services:
- **Frontend**: Vercel (Free)
- **Backend**: Railway (Free $5 credit)
- **Database**: PlanetScale (Free tier)
- **File Storage**: Cloudinary (Free tier)

---

## 📋 Prerequisites

### Required Software
- [ ] Node.js 18+ ([Download](https://nodejs.org/))
- [ ] Git ([Download](https://git-scm.com/))
- [ ] Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- [ ] MySQL Workbench (Optional, for database management)

### Required Accounts (All Free)
- [ ] GitHub account
- [ ] Vercel account (sign up with GitHub)
- [ ] Railway account (sign up with GitHub)
- [ ] PlanetScale account (for production database)
- [ ] Cloudinary account (for image storage)

---

## 🏗️ Part 1: Local Development Setup

### Step 1: Install Docker Desktop
1. Download Docker Desktop for Windows
2. Install and restart your computer
3. Open Docker Desktop and wait for it to start
4. Verify installation:
```bash
docker --version
docker-compose --version
```

### Step 2: Setup Local Database

#### Option A: Using Docker (Recommended)
```bash
# Start only the database
docker-compose up -d database

# Wait 30 seconds for database to initialize
# Database will automatically create schema and seed data

# Verify database is running
docker ps
```

#### Option B: Manual MySQL Installation
```bash
# Install MySQL 8.0 from: https://dev.mysql.com/downloads/installer/

# Create database
mysql -u root -p
CREATE DATABASE wcu_digital_campus;
USE wcu_digital_campus;

# Import schema
SOURCE database-schema.sql;

# Import sample data
SOURCE database-seed.sql;
```

### Step 3: Environment Configuration

Create `.env` files for both frontend and backend:

**Backend `.env` (server/.env)**
```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wcu_digital_campus
DB_USER=wcu_user
DB_PASSWORD=wcu_password_2024

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=wcu_redis_2024

# JWT Configuration
JWT_SECRET=wcu_jwt_secret_key_2024_very_secure_change_in_production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# Face Recognition API (Optional for now)
FACE_API_KEY=your_face_api_key_here
FACE_API_URL=https://api.face-recognition-service.com

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env` (client/.env)**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000

# Face Recognition
REACT_APP_FACE_API_URL=http://localhost:5000/api/face

# Application Configuration
REACT_APP_NAME=WCU Digital Campus
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_FACE_VERIFICATION=true
REACT_APP_ENABLE_OFFLINE_MODE=true
REACT_APP_ENABLE_ANALYTICS=false
```

### Step 4: Install Dependencies & Run

```bash
# Backend setup
cd server
npm install
npm run dev

# In a new terminal - Frontend setup
cd client
npm install
npm start
```

### Step 5: Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Database Admin**: http://localhost:8080 (if using Docker)

**Default Login Credentials:**
- Admin: `admin@wcu.edu.et` / `admin123`
- Student: `student1@wcu.edu.et` / `student123`
- Faculty: `dr.ahmed@wcu.edu.et` / `faculty123`

---

## ☁️ Part 2: Cloud Deployment (Free Tier)

### Step 1: Deploy Database to PlanetScale

1. **Create PlanetScale Account**
   - Go to https://planetscale.com
   - Sign up with GitHub
   - Create new database: `wcu-digital-campus`

2. **Get Connection String**
   ```bash
   # Install PlanetScale CLI
   npm install -g @planetscale/cli
   
   # Login
   pscale auth login
   
   # Create database
   pscale database create wcu-digital-campus --region us-east
   
   # Get connection string
   pscale connect wcu-digital-campus main
   ```

3. **Import Schema**
   ```bash
   # Connect to PlanetScale
   mysql -h <your-host> -u <your-user> -p<your-password> --ssl-mode=REQUIRED
   
   # Import schema
   SOURCE database-schema.sql;
   SOURCE database-seed.sql;
   ```

### Step 2: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   cd server
   railway init
   
   # Add environment variables in Railway dashboard
   # DATABASE_URL, JWT_SECRET, etc.
   
   # Deploy
   railway up
   ```

3. **Configure Environment Variables in Railway Dashboard**
   - Go to your project settings
   - Add all variables from your `.env` file
   - Update `DATABASE_URL` with PlanetScale connection string

### Step 3: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Deploy Frontend**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login
   vercel login
   
   # Deploy from client directory
   cd client
   vercel
   
   # Follow prompts and configure:
   # - Project name: wcu-digital-campus
   # - Framework: Create React App
   # - Build command: npm run build
   # - Output directory: build
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add `REACT_APP_API_URL` with your Railway backend URL
   - Redeploy: `vercel --prod`

### Step 4: Setup File Storage (Cloudinary)

1. **Create Cloudinary Account**
   - Go to https://cloudinary.com
   - Sign up for free account

2. **Get API Credentials**
   - Dashboard → Settings → Access Keys
   - Copy: Cloud Name, API Key, API Secret

3. **Add to Railway Environment Variables**
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 🔄 Part 3: CI/CD Setup with GitHub Actions

### Step 1: Prepare GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: WCU Digital Campus"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/wcu-digital-campus.git
git branch -M main
git push -u origin main
```

### Step 2: Configure GitHub Secrets

Go to GitHub → Settings → Secrets and Variables → Actions

Add these secrets:

**Docker Hub (Optional)**
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password

**Railway**
- `RAILWAY_TOKEN`: Get from Railway dashboard → Settings → Tokens

**Vercel**
- `VERCEL_TOKEN`: Get from Vercel → Settings → Tokens
- `VERCEL_ORG_ID`: Found in Vercel project settings
- `VERCEL_PROJECT_ID`: Found in Vercel project settings

**Database**
- `PROD_DATABASE_URL`: Your PlanetScale connection string
- `STAGING_DATABASE_URL`: Staging database connection

**Application**
- `PROD_JWT_SECRET`: Generate with `openssl rand -base64 32`
- `STAGING_JWT_SECRET`: Different secret for staging
- `ADMIN_API_KEY`: For automated tasks

**Monitoring (Optional)**
- `SLACK_WEBHOOK`: For deployment notifications

### Step 3: Test CI/CD Pipeline

```bash
# Make a small change
echo "# Test deployment" >> README.md

# Commit and push
git add .
git commit -m "Test CI/CD pipeline"
git push origin main

# Watch GitHub Actions tab for pipeline execution
```

---

## 🗄️ Part 4: Database Management

### Local Database Access

**Using Docker:**
```bash
# Access MySQL CLI
docker exec -it wcu_database mysql -u wcu_user -pwcu_password_2024 wcu_digital_campus

# Backup database
docker exec wcu_database mysqldump -u wcu_user -pwcu_password_2024 wcu_digital_campus > backup.sql

# Restore database
docker exec -i wcu_database mysql -u wcu_user -pwcu_password_2024 wcu_digital_campus < backup.sql
```

**Using Adminer (Web Interface):**
- Open http://localhost:8080
- Server: `database`
- Username: `wcu_user`
- Password: `wcu_password_2024`
- Database: `wcu_digital_campus`

### Production Database Management

**PlanetScale:**
```bash
# Create backup branch
pscale branch create wcu-digital-campus backup-$(date +%Y%m%d)

# View database insights
pscale database show wcu-digital-campus

# Monitor queries
pscale shell wcu-digital-campus main
```

### Database Migrations

```bash
# Create new migration
npm run migration:create -- add_new_feature

# Run migrations
npm run migration:run

# Rollback migration
npm run migration:rollback
```

---

## 📊 Part 5: Monitoring & Maintenance

### Health Checks

**Backend Health Endpoint:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "uptime": 3600,
  "timestamp": "2024-12-18T10:30:00Z"
}
```

### Log Monitoring

**Docker Logs:**
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

**Production Logs:**
```bash
# Railway logs
railway logs

# Vercel logs
vercel logs
```

### Performance Monitoring

**Database Performance:**
```sql
-- Check slow queries
SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 10;

-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size (MB)"
FROM information_schema.TABLES
WHERE table_schema = "wcu_digital_campus"
ORDER BY (data_length + index_length) DESC;
```

---

## 🔒 Part 6: Security Checklist

### Before Production Deployment

- [ ] Change all default passwords
- [ ] Generate new JWT secrets
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable audit logging
- [ ] Set up monitoring alerts
- [ ] Review and update .gitignore
- [ ] Remove debug/development code
- [ ] Enable security headers
- [ ] Configure CSP (Content Security Policy)

### SSL Certificate Setup (Free with Let's Encrypt)

```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🆘 Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check if database is running
docker ps | grep database

# Check database logs
docker logs wcu_database

# Restart database
docker-compose restart database
```

**2. Port Already in Use**
```bash
# Windows - Find process using port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <process_id> /F
```

**3. Docker Issues**
```bash
# Reset Docker
docker-compose down -v
docker system prune -a
docker-compose up -d
```

**4. Node Modules Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📞 Support & Resources

### Documentation
- API Documentation: `/api-docs` endpoint
- Database Schema: `database-schema.sql`
- Architecture: `TECHNICAL_ARCHITECTURE.md`

### Useful Commands

```bash
# Check system status
docker-compose ps

# View resource usage
docker stats

# Clean up unused resources
docker system prune -a --volumes

# Backup everything
./scripts/backup.sh

# Deploy to production
./scripts/deploy.sh production
```

### Next Steps

1. ✅ Complete local development setup
2. ✅ Test all features locally
3. ✅ Deploy to staging environment
4. ✅ Run integration tests
5. ✅ Deploy to production
6. ✅ Monitor and optimize

---

## 🎓 For Your Instructor

This deployment demonstrates:
- **Modern DevOps Practices**: Docker, CI/CD, automated testing
- **Scalable Architecture**: Microservices, load balancing, caching
- **Security Best Practices**: JWT auth, encryption, rate limiting
- **Production-Ready**: Monitoring, logging, backup strategies
- **Cost-Effective**: Free tier services for demonstration

**Live Demo URLs** (Update after deployment):
- Frontend: https://wcu-digital-campus.vercel.app
- Backend API: https://wcu-backend.railway.app
- API Docs: https://wcu-backend.railway.app/api-docs

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup strategy in place

### Deployment
- [ ] Deploy database changes
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Run smoke tests
- [ ] Verify all services

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify user access
- [ ] Update documentation
- [ ] Notify stakeholders

---

**Need Help?** Check the troubleshooting section or create an issue on GitHub.