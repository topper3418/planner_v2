# INSTALLATION INSTRUCTIONS

## install server utils

Need Nginx to serve the static files (frontend)
Need Uvicorn to serve the REST server (backend)
Need npm to build the frontend 

```bash
sudo apt install nginx uvicorn npm

## build application (in planner root directory)

build python env and enter it

```bash
python3 -m venv venv
source venv/bin/activate


install dependencies

```bash
pip install -r requirements.txt


## build frontend (in planner/frontend/)

install node dependencies

```bash
npm i


build project

```bash
npm run build

