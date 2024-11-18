
# Question Bank Application

This is a [Next.js](https://nextjs.org) project developed to manage and display structured academic questions, especially focusing on mathematical problems with LaTeX support. It leverages Next.js for the frontend, Prisma with PostgreSQL for the database management, and is styled using Tailwind CSS.

## Getting Started

### Install PostgreSQL

Depending on your operating system, follow these instructions to install PostgreSQL:

#### Windows
1. Download the installer from [EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Execute the installer and follow the on-screen instructions. Remember the password you set for the PostgreSQL admin user.
3. Optionally, add the path to PostgreSQL's bin directory to your system's PATH environment variable.

```bash
# Example to add PostgreSQL to PATH in Windows
setx PATH "%PATH%;C:\Program Files\PostgreSQL\13\bin"
```

#### macOS
Using Homebrew:

```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Set Up Application

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/atjyschool/QuestionBank.git
cd QuestionBank
npm install
```

### Set Up the Database with Prisma

1. **Create the database:**
   Before running migrations, you need to create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE question_bank;

# Exit psql
\q
```

2. **Configure your Prisma environment:**
   Update your `.env` file with the correct DATABASE_URL:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/question_bank?schema=public"
```
Replace USER and PASSWORD with your own settings

3. **Run migrations:**
   Create and apply migrations:

```bash
npx prisma migrate dev --name init
```

### Running the Application

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js and Prisma, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Prisma Documentation](https://www.prisma.io/docs/) - learn about Prisma features and API.

You can check out [the GitHub repository](https://github.com/atjyschool/QuestionBank) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
