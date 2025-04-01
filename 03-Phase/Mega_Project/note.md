# Deploying a Node.js Application on AWS EC2

This guide details the steps to deploy a Node.js application on an AWS EC2 instance using Nginx as a reverse proxy and PM2 for process management.

---

## 1. Setting Up the EC2 Instance
Go to AWS console and luanch EC2 instance.

### Connect to Your EC2 Instance
Connect to EC2 instance using EC2 Instance Connect, Session Manager or SSH client as per your convinence

### Install Node.js and npm
```sh
sudo yum install -y nodejs npm
node -v  # Verify installation
```

### Install Git
```sh
sudo yum install git
git -v  # Verify installation
```

---

## 2. Cloning Your Node.js Project
```sh
mkdir backend
cd backend

git init
git pull <git repo link>
```

---

## 3. Install Dependencies and Configure Environment Variables
```sh
npm install
```
Create and configure environment variables
```sh
vi .env  # Add required environment variables
```

---

## 4. Start the Node.js Application
```sh
npm run start
```

---

## 5. Install and Configure PM2 (Process Manager)
```sh
sudo npm install pm2@latest -g

# Ensure PM2 service automaically starts wen server runs on system
pm2 startup

# Start the application with PM2
pm2 start src/index.js

# View logs to confirm the app is running
pm2 logs

```

---

## 6. Install and Configure Nginx as a Reverse Proxy
```sh
sudo yum install nginx
sudo systemctl start nginx
```

### Configure Nginx
Edit the Nginx configuration file:
```sh
sudo vim /etc/nginx/nginx.conf
```
Add the following configuration:
```
server {
    listen 80;
    server_name <your-ec2-ip>;

    location / {
        proxy_pass http://localhost:8000;  # Adjust port as per your app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Restart Nginx
```sh
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## 7. Verify Deployment
- Visit `http://your-ec2-ip` in the browser.
- Check PM2 process status:
```sh
pm2 list
```
- View logs if issues arise:
```sh
pm2 logs
```

---

## 8. Managing the Application
```sh
pm2 stop src/index.js   # Stop the application
pm2 restart src/index.js  # Restart the application
pm2 delete src/index.js  # Remove from PM2 list
```

---

## 9. Things to note
- Ensure port 80 (HTTP) and 22 (SSH) are open in AWS Security Groups.

---

Your Node.js application is now successfully deployed on AWS EC2! 🚀