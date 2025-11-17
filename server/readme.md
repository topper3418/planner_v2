# INSTALLATION INSTRUCTIONS

This will guide you through the setup for this project 
on a linux server.

## Install server utils

Need Nginx to serve the static files (frontend)
Need Uvicorn to serve the REST server (backend)
Need npm to build the frontend 

```bash
sudo apt install nginx uvicorn npm
```

## Build application (in planner root directory)

build python env and enter it

```bash
python3 -m venv venv
source venv/bin/activate
```

install dependencies

```bash
pip install -r requirements.txt
```

## build frontend (in planner/frontend/)

install node dependencies

```bash
npm i
```

build project

```bash
npm run build
```

## Configure backend service

Edit the server/planner-service-template.service file, following the 
instructions inside it.

Copy the file to /etc/systemd/system/planner.service

```bash
sudo cp server/planner-service-template.service /etc/systemd/system/planner.service
```

Reload systemd to pick up the new service

```bash
sudo systemctl daemon-reload
```

Enable the service to start on boot

```bash
sudo systemctl enable planner.service
```

Start the service

```bash
sudo systemctl start planner.service
```

Test the service with a healthcheck

```bash
curl http://localhost:8000/healthcheck
```

Should return:

```json
{"status":"ok"}
```

## Configure Nginx (in planner/)

Copy the nginx config file to /etc/nginx/sites-available/planner

```bash
sudo cp server/nginx-config-template /etc/nginx/sites-available/planner
```

Enable the site by creating a symlink to sites-enabled

```bash
sudo ln -s /etc/nginx/sites-available/planner /etc/nginx/sites-enabled/planner
```

Disable the default nginx site

```bash
sudo rm /etc/nginx/sites-enabled/default
```

Restart nginx

```bash
