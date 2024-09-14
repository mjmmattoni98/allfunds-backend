# Technical project for Allfunds

This project is a technical test for Allfunds. It consists of a RESTful API that provides news from a MongoDB database. The API allows users to fetch actual and archive news, archive them and remove them. It also provides a Swagger documentation for the API in the route `/api-docs`.

If you have docker installed, you can test this server locally without struggling with the installation of MongoDB. Just run the following command:

```sh
docker compose up
```

This will start the server and the MongoDB database in separate containers. The server will be running on `http://localhost:3000`.

## Getting Started

### Prerequisites

- Node.js
- MongoDB (or MongoDB Atlas)
- Docker (optional, for containerization)

### Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables (PORT is optional):

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/allfunds
   ```

### Running the Application

1. Start MongoDB:

   ```sh
   mongod
   ```

2. Run the application:

   ```sh
   npm run start
   ```

   or if you want to run the application in development mode and you have at least Node.js v20:

   ```sh
   npm run dev
   ```

3. The server will be running on `http://localhost:3000`.

### API Documentation

API documentation is available at `http://localhost:3000/api-docs`.

## Project Files

- `app.js`: Main application file.
- `package.json`: Project metadata and dependencies.
- `news.js`: News routes.
- `swagger.js`: Swagger configuration.
- `news.schema.js`: Mongoose schema for news.
- `Dockerfile`: Docker configuration.
- `compose.yml`: Docker Compose configuration.
