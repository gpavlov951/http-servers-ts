# HTTP Servers TypeScript

A TypeScript-based HTTP server implementation featuring a social media API called "Chirp" - a Twitter-like platform with user management, authentication, and webhook integrations.

## 🚀 Features

- **User Management**: Create, read, update, and delete users
- **Authentication**: JWT-based authentication with refresh tokens
- **Chirps**: Create, read, and delete social media posts
- **Admin Panel**: Metrics and system management
- **Webhooks**: Polka webhook integration for payment processing
- **Database**: PostgreSQL with Drizzle ORM
- **File Server**: Static file serving with hit tracking
- **Logging**: Request/response logging and error handling

## 📋 Requirements

- **Node.js**: v21.7.0 (see `.nvmrc`)
- **Package Manager**: pnpm (recommended)
- **Database**: PostgreSQL
- **TypeScript**: v5.8.3+

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd http-servers-ts
   ```

2. **Install Node.js version**

   ```bash
   nvm use
   # or
   nvm install 21.7.0 && nvm use 21.7.0
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Set up database**

   ```bash
   # Generate database schema
   pnpm run db:generate

   # Run migrations
   pnpm run db:migrate
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_URL=postgresql://username:password@localhost:5432/chirp_db

# Platform Environment
PLATFORM=dev  # or "prod"

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Polka Webhook Integration
POLKA_KEY=your-polka-webhook-secret-key
```

### Environment Variables Description

| Variable     | Description                               | Required | Default |
| ------------ | ----------------------------------------- | -------- | ------- |
| `DB_URL`     | PostgreSQL connection string              | ✅       | -       |
| `PLATFORM`   | Application environment (`dev` or `prod`) | ✅       | -       |
| `JWT_SECRET` | Secret key for JWT token signing          | ✅       | -       |
| `POLKA_KEY`  | Secret key for Polka webhook verification | ✅       | -       |

## 🚀 Running the Application

### Development Mode

```bash
pnpm run dev
```

This runs the server with auto-reload on file changes using nodemon.

### Production Mode

```bash
# Build the application
pnpm run build

# Start the server
pnpm run start
```

### Database Management

```bash
# Generate new migration
pnpm run db:generate

# Apply migrations
pnpm run db:migrate

# Open Drizzle Studio (database GUI)
pnpm run db:studio
```

### Testing

```bash
pnpm run test
```

## 📡 API Documentation

Base URL: `http://localhost:8080`

### Health Check

- **GET** `/api/healthz` - Server health check

### User Management

- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users` - Update authenticated user
- **PUT** `/api/users/:id` - Update user by ID
- **DELETE** `/api/users/:id` - Delete user

### Authentication

- **POST** `/api/login` - User login
- **POST** `/api/refresh` - Refresh JWT token
- **POST** `/api/revoke` - Revoke refresh token

### Chirps (Posts)

- **GET** `/api/chirps` - Get all chirps
- **GET** `/api/chirps/:chirpID` - Get chirp by ID
- **POST** `/api/chirps` - Create new chirp (requires authentication)
- **POST** `/api/chirps/validate` - Validate chirp content
- **DELETE** `/api/chirps/:chirpID` - Delete chirp (requires authentication)

### Webhooks

- **POST** `/api/polka/webhooks` - Polka webhook endpoint

### Admin

- **GET** `/admin/metrics` - Get server metrics
- **POST** `/admin/reset` - Reset server metrics

### Static Files

- **GET** `/app/*` - Serve static files from `src/app/` directory

## 🏗️ Project Structure

```
src/
├── app/              # Static files (HTML, CSS, JS)
├── config.ts         # Application configuration
├── db/               # Database schema and migrations
├── features/         # Feature-based modules
│   ├── admin/        # Admin functionality
│   ├── chirps/       # Chirp management
│   ├── health/       # Health checks
│   ├── login/        # Authentication
│   ├── users/        # User management
│   └── webhooks/     # Webpack handlers
├── routes/           # Route definitions
├── shared/           # Shared utilities and middleware
└── index.ts          # Application entry point
```

## 🧪 Testing

The project uses Vitest for testing. Run tests with:

```bash
pnpm run test
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: Send credentials to `/api/login` to receive access and refresh tokens
2. **Protected Routes**: Include the JWT token in the `Authorization` header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Token Refresh**: Use `/api/refresh` to get new tokens
4. **Token Revocation**: Use `/api/revoke` to invalidate refresh tokens

## 🗃️ Database Schema

The application uses Drizzle ORM with PostgreSQL. The schema includes:

- **Users**: User accounts with authentication
- **Chirps**: Social media posts
- **Refresh Tokens**: JWT refresh token management

## 📊 Monitoring

- **Metrics**: Available at `/admin/metrics`
- **Logging**: All requests and responses are logged
- **Error Handling**: Centralized error handling middleware

## 🔗 Webhooks

The application supports Polka webhooks for payment processing:

- **Endpoint**: `/api/polka/webhooks`
- **Method**: POST
- **Authentication**: Uses `POLKA_KEY` for webhook verification

## 📝 Contributing

This project is part of the [Boot.dev](https://www.boot.dev/lessons/3c83ee38-8e4a-4ab2-8a52-41e15dea698f) curriculum.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
