# Xerpia ERP - Angular 17 Frontend

A modern, modular ERP system built with Angular 17, following hexagonal architecture principles and clean code practices.

## 🚀 Features

- **Angular 17** with standalone components
- **Hexagonal Architecture** (Ports & Adapters)
- **Modular Design** with lazy-loaded modules
- **JWT Authentication** with refresh token support
- **Role-based Access Control**
- **Docker Support** with multi-stage builds
- **Environment Configuration** with .env support
- **Clean Code** practices and SOLID principles
- **Responsive Design** with modern UI

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                 # Core functionality (singleton services)
│   │   ├── auth/            # Authentication services
│   │   ├── guards/          # Route guards
│   │   └── interceptors/    # HTTP interceptors
│   ├── shared/              # Shared components and services
│   │   ├── components/      # Reusable components
│   │   ├── models/         # Interfaces and types
│   │   └── services/       # Shared services
│   ├── modules/            # Feature modules
│   │   ├── accounting/     # Accounting module
│   │   ├── product/        # Product management
│   │   ├── provider/       # Provider management
│   │   └── user/          # User management
│   └── environments/       # Environment configurations
├── assets/                 # Static assets
└── environments/          # Environment files
```

### Module Structure (Hexagonal Architecture)

Each module follows hexagonal architecture:

```
module/
├── domain/              # Business logic and interfaces
├── application/         # Use cases and application services
├── infrastructure/      # External adapters (HTTP, etc.)
└── presentation/        # UI components and routes
```

## 🛠 Technology Stack

- **Frontend Framework**: Angular 17
- **Language**: TypeScript
- **Styling**: SCSS
- **Authentication**: JWT with @auth0/angular-jwt
- **HTTP Client**: Angular HttpClient
- **State Management**: RxJS
- **Build Tool**: Angular CLI
- **Package Manager**: npm
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- Angular CLI 17
- Docker (optional, for containerization)

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment Configuration

Configure your settings in `.env`:

```env
API_BASE_URL=http://localhost:3000/api
JWT_SECRET_KEY=your-secret-key-here
APP_NAME=Xerpia ERP
APP_VERSION=1.0.0
```

### 3. Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`.

### 4. Build for Production

```bash
ng build --configuration production
```

## 🐳 Docker Support

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t xerpia-erp .

# Run the container
docker run -p 80:80 xerpia-erp
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d
```

The application will be available at `http://localhost:80`.

## 🔐 Authentication & Authorization

The application uses JWT-based authentication with:

- Login/Register functionality
- Automatic token refresh
- Role-based access control
- Protected routes with guards

### User Roles

- **Admin**: Full system access
- **Manager**: Management-level access
- **Employee**: Standard user access
- **Viewer**: Read-only access

## 📊 Modules

### 1. User Management
- User CRUD operations
- Role assignment
- Search and filtering

### 2. Product Management
- Product catalog management
- Category management
- Stock tracking

### 3. Provider Management
- Supplier information
- Contact management
- Location-based filtering

### 4. Accounting
- Chart of accounts
- Journal entries
- Financial reports
- Double-entry validation
