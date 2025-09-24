# Book Review System

A RESTful API for managing books and reviews built with Node.js, Express, and MongoDB.

## Project Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Book Review System"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory with:
   ```env
   JWT_SECRET=YOURKEY
   DB=YOURDB
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   - Ensure MongoDB is running on `YOURDB`

## How to Run Locally

**Start the development server:**
```bash
npm start
```
or for development with auto-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Authentication Routes (`/auth`)
- **POST** `/auth/signup` - Register a new user
- **POST** `/auth/login` - Login user
- **POST** `/auth/logout` - Logout user

### Book Routes (`/books`)
- **GET** `/books` - Get all books (supports pagination, filtering by author/genre)
- **GET** `/books/:id` - Get book by ID with reviews and average rating
- **POST** `/books` - Add a new book (requires authentication)
- **POST** `/books/:id/reviews` - Add a review to a book (requires authentication)

### Review Routes (`/reviews`)
- **PUT** `/reviews/:id` - Update a review (requires authentication, only owner)
- **DELETE** `/reviews/:id` - Delete a review (requires authentication, only owner)

### Search Route
- **GET** `/search?query=<search_term>` - Search books by title or author (partial, case-insensitive)

## Example API Requests

### Authentication

**Register a user:**
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "Tejash", "password": "!@#$%^"}'
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8b1c2e4b0d8a5c3f21a7b",
    "username": "Tejash"
  }
}
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "Tejash", "password": "!@#$%^"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8b1c2e4b0d8a5c3f21a7b",
    "username": "Tejash"
  }
}
```

**Logout:**
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Cookie: token=<your-jwt-token>"
```

### Books

**Add a book (requires authentication):**
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<your-jwt-token>" \
  -d '{"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "genre": "Fiction"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Book added successfully",
  "book": {
    "_id": "64f8b1c2e4b0d8a5c3f21a7c",
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "reviews": [],
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

**Get all books with pagination and filters:**
```bash
curl "http://localhost:3000/books?page=1&limit=10&author=Shakespeare&genre=Drama"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "_id": "64f8b1c2e4b0d8a5c3f21a7c",
        "id": 1,
        "title": "Hamlet",
        "author": "William Shakespeare",
        "genre": "Drama",
        "reviews": [],
        "createdAt": "2023-09-06T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalBooks": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

**Get book by ID with reviews:**
```bash
curl "http://localhost:3000/books/1"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "book": {
      "_id": "64f8b1c2e4b0d8a5c3f21a7c",
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "genre": "Fiction",
      "avgRating": 4.5,
      "totalReviews": 2
    },
    "reviews": [
      {
        "_id": "64f8b1c2e4b0d8a5c3f21a7d",
        "user": {
          "_id": "64f8b1c2e4b0d8a5c3f21a7b",
          "username": "Tejash"
        },
        "rating": 5,
        "comment": "Excellent book, highly recommended!",
        "createdAt": "2023-09-06T11:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalReviews": 2,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

### Reviews

**Add a review (requires authentication):**
```bash
curl -X POST http://localhost:3000/books/1/reviews \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<your-jwt-token>" \
  -d '{"rating": 5, "comment": "Great book! Highly recommended."}'
```

**Response:**
```json
{
  "success": true,
  "message": "Review added successfully",
  "review": {
    "_id": "64f8b1c2e4b0d8a5c3f21a7d",
    "user": {
      "_id": "64f8b1c2e4b0d8a5c3f21a7b",
      "username": "Tejash"
    },
    "book": "64f8b1c2e4b0d8a5c3f21a7c",
    "rating": 5,
    "comment": "Great book! Highly recommended.",
    "createdAt": "2023-09-06T11:00:00.000Z"
  }
}
```

**Update a review (owner only):**
```bash
curl -X PUT http://localhost:3000/reviews/64f8b1c2e4b0d8a5c3f21a7d \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<your-jwt-token>" \
  -d '{"rating": 4, "comment": "Good book, but not perfect."}'
```

**Delete a review (owner only):**
```bash
curl -X DELETE http://localhost:3000/reviews/64f8b1c2e4b0d8a5c3f21a7d \
  -H "Cookie: token=<your-jwt-token>"
```

### Search

**Search books:**
```bash
curl "http://localhost:3000/search?query=gatsby"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "_id": "64f8b1c2e4b0d8a5c3f21a7c",
        "id": 1,
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "genre": "Fiction",
        "reviews": [],
        "createdAt": "2023-09-06T10:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

## Design Decisions & Assumptions

- **Authentication**: JWT tokens stored in HTTP-only cookies for security, also returned in response for flexibility
- **Authorization**: Only authenticated users can create books and reviews
- **Ownership**: Users can only edit/delete their own reviews
- **Book IDs**: Custom numeric auto-incrementing IDs are used instead of MongoDB ObjectIds for books
- **Pagination**: Implemented for books and reviews to handle large datasets efficiently
- **Validation**: Joi schemas validate all input data with descriptive error messages
- **Error Handling**: Consistent JSON error responses across all endpoints with proper HTTP status codes
- **Database**: MongoDB with Mongoose ODM for schema validation and relationships
- **Password Security**: Passwords are hashed using bcryptjs with salt rounds of 12
- **CORS**: Configured for frontend at `http://localhost:5173` with credentials support
- **Reviews**: One review per user per book constraint implemented at database level
- **Search**: Case-insensitive partial matching on both title and author fields
- **Rating System**: Average rating calculated dynamically from all reviews

## Database Schema

The system uses MongoDB with the following collections:

### Counter Collection (for auto-increment)
```javascript
{
  _id: "book_id",           // Counter identifier
  sequence_value: Number    // Current sequence number
}
```

### Users Collection
```javascript
{
  _id: ObjectId,                    // MongoDB ObjectId
  username: String,                 // Required, unique, 3-30 chars, alphanumeric
  password: String,                 // Required, hashed, min 6 chars
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-generated
}
```

### Books Collection
```javascript
{
  _id: ObjectId,                    // MongoDB ObjectId
  id: Number,                       // Auto-increment, unique, user-facing ID
  title: String,                    // Required, 2-100 chars
  author: String,                   // Required, 2-100 chars
  genre: String,                    // Required, 2-100 chars
  reviews: [ObjectId],              // Array of Review._id references
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-generated
}
```

### Reviews Collection
```javascript
{
  _id: ObjectId,                    // MongoDB ObjectId
  user: ObjectId,                   // Required, references User._id
  book: ObjectId,                   // Required, references Book._id
  rating: Number,                   // Required, integer, 1-5
  comment: String,                  // Required, 5-500 chars
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-generated
}
```

**Database Constraints:**
- Unique compound index on `{user: 1, book: 1}` for one review per user per book
- Auto-population of user/book data in review queries
- Automatic password hashing on user save
- Auto-incrementing book IDs using Counter collection

## Project Structure

```
├── app.js                 # Main application entry point
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (not in repo)
├── Readme.md             # Project documentation
├── controllers/          # Business logic
│   ├── authController.js # Authentication logic (signup, login, logout)
│   ├── bookController.js # Book management (CRUD, search, pagination)
│   ├── reviewController.js # Review management (CRUD, ownership validation)
│   └── joi-schema.js     # Input validation schemas
├── middleware/
│   └── authMiddleware.js # JWT authentication middleware
├── models/              # Database models
│   ├── User.js          # User schema with password hashing
│   ├── Book.js          # Book schema with auto-increment ID
│   └── Review.js        # Review schema with references
└── routes/              # API route definitions
    ├── authRoutes.js    # Authentication routes
    ├── bookRoutes.js    # Book and review creation routes
    └── reviewRoutes.js  # Review update/delete routes
```

## Validation Rules

### User Validation
- **Username**: 3-30 characters, alphanumeric only, required, unique
- **Password**: Minimum 6 characters, required

### Book Validation
- **Title**: 2-100 characters, required
- **Author**: 2-100 characters, required
- **Genre**: 2-100 characters, required

### Review Validation
- **Rating**: Integer between 1-5, required
- **Comment**: 5-500 characters, required
- **Constraint**: One review per user per book

## Dependencies

### Production Dependencies
```json
{
  "express": "^4.18.2",        // Web framework
  "mongoose": "^7.5.0",        // MongoDB ODM
  "bcryptjs": "^2.4.3",        // Password hashing
  "jsonwebtoken": "^9.0.2",    // JWT token handling
  "joi": "^17.9.2",            // Data validation
  "cors": "^2.8.5",            // Cross-origin resource sharing
  "cookie-parser": "^1.4.6",   // Cookie parsing middleware
  "dotenv": "^16.3.1"          // Environment variable loading
}
```

### Development Dependencies
```json
{
  "nodemon": "^3.0.1"          // Development server with auto-reload
}
```

## Installation Commands

```bash
# Install all dependencies
npm install express mongoose bcryptjs jsonwebtoken joi cors cookie-parser dotenv

# Install development dependencies
npm install --save-dev nodemon
```

## Scripts

```json
{
  "start": "node app.js",       // Production start
  "dev": "nodemon app.js"       // Development start with auto-reload
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional array for validation errors
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Testing the API

You can test the API using:
- **curl** (examples provided above)
- **Postman** - Import the endpoints and test interactively
- **Thunder Client** (VS Code extension)
- **Insomnia** - REST API client

## Security Features

- **Password Hashing**: Passwords hashed with bcryptjs (12 salt rounds)
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Tokens stored in secure cookies
- **Input Validation**: All inputs validated with Joi schemas
- **CORS Configuration**: Restricted to specific origins
- **Error Handling**: No sensitive data leaked in error messages

## Future Enhancements

Potential improvements for production use:
- Rate limiting for API endpoints
- Request logging with Winston
- Data sanitization and validation
- API documentation with Swagger
- Unit and integration tests
- Docker containerization
- Environment-specific configurations
- Database connection pooling
- Caching with Redis
- File upload for book covers
- Advanced search with Elasticsearch