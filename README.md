# Northcoders News API

Welcome to the Northcoders News API! This project is a RESTful API designed to serve as the backend for a news aggregation service. It was created as part of a Digital Skills Bootcamp in Software Engineering provided by Northcoders.

## Hosted Version
[Click here](https://nc-news-azox.onrender.com/api) to view the hosted version of the project.

## Project Summary

The Northcoders News API allows users to interact with a database of articles, comments, and topics. Users can fetch articles, post comments, upvote/downvote content, and more. The API is built using Node.js, Express, and PostgreSQL.

### Key Features:
**GET** endpoints for retrieving articles, comments, and topics.
**POST** endpoints for adding new comments and articles.
**PATCH** endpoints for voting on articles and comments.
**DELETE** endpoints for removing unwanted comments.

### Requirements

To run this project, you need to have the following installed on your machine:

**Node.js** version 14.0.0 or higher
**PostgreSQL** version 12.0 or higher

## Getting Started

Follow these instructions to get a copy of the project running locally.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/northcoders-news-api.git
cd northcoders-news-api
```

### 2. Install Dependencies
Use npm to install the required dependencies:

```bash

npm install
```

### 3. Set Up Environment Variables
Create two .env files, one for the development database and one for the test database.

.env.development
```makefile

PGDATABASE=your_development_db_name
```
.env.test
```makefile
PGDATABASE=your_test_db_name
```
Make sure the values of PGDATABASE correspond to your Postgres databases for development and testing.

Refer to the .env-example file for guidance.

### 4. Seed Local Database
To seed your local database with sample data, run the following command:

```bash
npm run seed
```
### 5. Running the Tests
To run the test suite, use:

```bash
npm test
```
### 6. Running the API
To start the API locally, run:

```bash
npm start
```
This will start the server on http://localhost:9090.


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
