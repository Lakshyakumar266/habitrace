# HabitRace Backend

To install dependencies and start development enviournment on your end follow following steps:

## Prerequisites

Before you begin, ensure you have the following installed:
- [Bun](https://bun.com) (v1.2.22 or higher)
- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Lakshyakumar266/habitrace.git
cd backend
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Start the Database
Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```

This will start a PostgreSQL container in the background. The database will be available on `localhost:5432`.

### 4. Environment Setup
Copy the example environment file and configure your environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your database configuration:
```env
DATABASE_URL="postgresql://dbusername:dbpassword@localhost:5432/dbname"

DB_NAME=dbname
DB_USER=dbusername
DB_PASSWORD=dbpassword
DB_PORT=5432

PORT=3001
SECRET_KEY='your_jwt_authorization_salt'
NODE_ENV=development
```

### 5. Database Generation/Migration
If using Prisma or similar ORM, run migrations:
```bash
bun run db:generate
bun run db:migrate
# or
bun run prisma:migrate
```

### 6. Start the Development Server
```bash
bun dev
```

The server will start on `http://localhost:3001` (or your configured port).

## Available Scripts

- `bun dev` - Start development server with hot reload
- `bun start` - Start production server
- `bun test` - Run tests
- `bun run build` - Build for production

## Docker Commands

- `docker-compose up -d` - Start PostgreSQL container in background
- `docker-compose down` - Stop and remove containers
- `docker-compose logs postgres` - View PostgreSQL logs
- `docker-compose exec postgres psql -U habitrace -d habitrace` - Connect to database

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── prisma/
├── docker-compose.yml
├── .env.example
└── package.json
```

## Technologies Used

- **Runtime**: [Bun](https://bun.com) - Fast all-in-one JavaScript runtime
- **Database**: PostgreSQL with Docker
- **ORM**: Prisma
- **API Framework**: Express 

## Development Tips

1. **Hot Reload**: The development server automatically restarts when you make changes
2. **Database GUI**: Consider using tools like pgAdmin or DBeaver to manage your PostgreSQL database
3. **Environment Variables**: Never commit your `.env` file - keep sensitive data secure

## Troubleshooting

### Database Connection Issues
- Ensure Docker is running: `docker ps`
- Check if PostgreSQL container is healthy: `docker-compose ps`
- Verify environment variables in `.env`

### Port Conflicts
- If port 3001 is in use, change `PORT` in your `.env` file
- For database, modify the port mapping in `docker-compose.yml`

### Dependencies Issues
```bash
# Clear bun cache
bun pm cache rm

# Reinstall dependencies
rm -rf node_modules
bun install
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.