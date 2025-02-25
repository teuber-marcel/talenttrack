TalentTrack - AI-Powered Recruitment Platform

This is an app designed to streamline recruitment processes through AI-driven job profile creation, suitability scoring, and interview preparation.

Project Overview

TalentTrack is built to assist recruiters by automating candidate evaluation and improving hiring decisions. This project includes:

- AI-generated suitability scores based on candidate profiles.
- Automated interview question generation to streamline interview preparation.
- A user-friendly dashboard for recruiters to manage applications.
- Integration with LinkedIn for candidate sourcing.

---

Getting Started

Installation

Ensure you have Node.js (v18 or later) and npm (or yarn/pnpm/bun) installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/teuber-marcel/talenttrack.git
   cd talenttrack
   ```
2. Install dependencies on both the server and client side (e.g. cd server & cd client):
   ```bash
   npm install
   or
   yarn install
   or
   pnpm install
   ```

Running the Development Server

To start the project locally, run on both the server and client side (e.g. cd server & cd client):

```bash
npm run dev
or
yarn dev
or
pnpm dev
```

Then, open http://localhost:3000 in your browser.

Building for Production

To create an optimized production build on both the server and client side (e.g. cd server & cd client):

```bash
npm run build
npm start
```

---

Project Structure

```
📂 talenttrack
 ┣ 📂 client                      front-end
     ┣ 📂 public                  Static assets
     ┣ 📂 src
         ┣ 📂 app                 Next.js app directory and Global styles
         ┣ 📂 components          UI components
         ┣ 📂 pages               Main UI pages
         ┣ 📂 services            API services (fetching applicants, vacancies, etc.)
         ┣ 📂/📜 ...
 ┣ 📂 server                      back-end logic
     ┣ 📂 controllers             Feature controller
     ┣ 📂 models                  Used models
     ┣ 📂 routes                  Routing logic
     ┣ 📂/📜 ...
     ┣ 📜 .env.example            Environment variable template
 ┣ 📜 package.json        Project dependencies & scripts
 ┣ 📜 README.md           Project documentation
 ┣ 📜 ...
```

---

Environment Variables

Before running the project, configure your environment variables.

1. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and update the values:
   ```
   DB_CONNECTION_URL=...
   OPENAI_API_KEY=...
   ```

---

Deployment

The recommended deployment platform is Vercel.

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```

For more details, refer to the Next.js Deployment Guide: https://nextjs.org/docs/app/building-your-application/deploying.

---

Contributors

- Felix Makowski
- Marcel Teuber
- Lukas Walter
- Henry Wibbe

---

Troubleshooting & Support

For any issues, open an issue in the repository.
