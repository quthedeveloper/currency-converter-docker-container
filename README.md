# Currency Converter

A full-stack currency converter built with **React (Vite)** and **Node.js/Express**. The backend communicates with the **Frankfurter Exchange Rate API** to retrieve current exchange rates and perform currency conversions.

The project can be run locally with Node.js or containerized and run with **Docker Compose**.

## Features

* Currency conversion between supported currencies
* Currency list retrieved from the backend
* React + Vite frontend
* Node.js + Express REST API
* Frankfurter API integration
* Backend health-check endpoint
* CORS support
* Dockerized frontend and backend
* Docker Compose configuration for running the complete application
* Frontend-to-backend communication through a Docker Compose network

## Architecture

### Local Development

```text
Browser
   |
   v
Frontend
React + Vite
localhost:5173
   |
   | /api/*
   v
Backend
Node + Express
localhost:4000
   |
   v
Frankfurter API
```

### Docker Compose

```text
Browser
   |
   | localhost:5173
   v
+----------------------+
| Frontend Container   |
| React + Vite         |
| Port 5173            |
+----------+-----------+
           |
           | backend:4000
           v
+----------------------+
| Backend Container    |
| Node + Express       |
| Port 4000            |
+----------+-----------+
           |
           | HTTPS
           v
+----------------------+
| Frankfurter API      |
+----------------------+
```

Docker Compose creates a network allowing the frontend container to communicate with the backend using the service name:

```text
backend:4000
```

This is different from `localhost:4000`. Inside the frontend container, `localhost` refers to the frontend container itself.

## Project Structure

```text
currency-converter-plain/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── src/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Technologies

### Frontend

* React
* Vite
* JavaScript
* HTML/CSS

### Backend

* Node.js
* Express
* CORS
* Native `fetch`

### DevOps / Infrastructure

* Docker
* Docker Compose
* Container networking

### External API

* Frankfurter Exchange Rate API

## Running Locally Without Docker

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:4000
```

### 2. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open the frontend in your browser:

```text
http://localhost:5173
```

The Vite development server proxies `/api` requests to the backend.

## Running With Docker Compose

Make sure Docker Desktop is running.

From the project root:

```bash
docker compose up --build
```

This builds and starts both containers.

### Start in the Background

```bash
docker compose up --build -d
```

### View Running Containers

```bash
docker compose ps
```

### View Logs

```bash
docker compose logs
```

To view only the backend logs:

```bash
docker compose logs backend
```

To view only the frontend logs:

```bash
docker compose logs frontend
```

### Stop the Application

```bash
docker compose down
```

### Rebuild the Containers

```bash
docker compose up --build
```

## Docker Ports

| Service  | Container Port | Host Port |
| -------- | -------------: | --------: |
| Frontend |           5173 |      5173 |
| Backend  |           4000 |      4000 |

The application can be accessed through:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:4000
```

## API Endpoints

### Get Supported Currencies

```http
GET /api/currencies
```

Example:

```text
http://localhost:4000/api/currencies
```

Returns a list of supported currency codes.

### Convert Currency

```http
GET /api/convert?amount=100&from=USD&to=EUR
```

Example:

```text
http://localhost:4000/api/convert?amount=100&from=USD&to=EUR
```

Example response:

```json
{
  "amount": 100,
  "from": "USD",
  "to": "EUR",
  "result": 87.24,
  "date": "2026-09-22"
}
```

### Health Check

```http
GET /healthz
```

Example:

```text
http://localhost:4000/healthz
```

Expected response:

```json
{
  "status": "ok"
}
```

The health-check endpoint can be used to verify that the backend container is running correctly.

## Backend Environment

The backend uses the following environment variable:

```text
PORT
```

If no port is provided, it defaults to:

```text
4000
```

Example:

```bash
PORT=4000
```

## Docker Configuration

### Backend

The backend Dockerfile:

```dockerfile
FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
```

### Frontend

The frontend Dockerfile runs the Vite development server inside the container and exposes port `5173`.

### Docker Compose

The Compose configuration runs two services:

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

The frontend communicates with the backend using:

```text
http://backend:4000
```

when running inside the Docker Compose network.

## Production Build

The frontend can also be built as static files:

```bash
cd frontend
npm run build
```

This creates:

```text
frontend/dist
```

The generated files can be served by a static web server or hosting platform.

For the current Docker Compose setup, the project uses the Vite development server for the frontend.

## Development vs Docker

### Without Docker

```text
Frontend
localhost:5173
     |
     v
Backend
localhost:4000
```

### With Docker Compose

```text
Frontend Container
       |
       | backend:4000
       v
Backend Container
       |
       v
Frankfurter API
```

## Useful Docker Commands

Build the images:

```bash
docker compose build
```

Start the services:

```bash
docker compose up
```

Start in detached mode:

```bash
docker compose up -d
```

Stop the services:

```bash
docker compose down
```

List containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs
```

Rebuild after making changes:

```bash
docker compose up --build
```

## Future Deployment

The project is currently configured for local Docker Compose development.

A future deployment workflow can use:

```text
Local Development
       |
       v
     GitHub
       |
       v
Cloud Platform
       |
       v
Docker Containers
       |
       v
Application Online
```

Future improvements may include:

* Cloud deployment
* CI/CD
* Production frontend container
* HTTPS
* Reverse proxy
* Nginx
* Container monitoring
* Automated Docker image builds

## Notes

* The backend uses native `fetch`, which is available in Node.js 18+.
* No additional HTTP library is required.
* Frankfurter does not require an API key for this project.
* `node_modules` should not be committed to Git.
* Environment files containing secrets should not be committed to Git.
* Docker Compose is currently used to run the frontend and backend together.
* Nginx is not currently part of the deployment architecture.

## License

This project is intended for learning and development purposes.
