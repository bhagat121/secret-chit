
# Secret Chit

**Secret Chit** is a secure web application for sharing confidential messages that can expire or self-destruct after one-time access, built using modern full-stack technologies with a focus on privacy and simplicity.

---

## 🚀 Features

- Create secrets with expiration or one-time view restrictions
- Dashboard to manage and search your secrets
- Modern UI with modal editing
- Responsive and mobile-friendly
- Real-time updates using tRPC
- Server-side and client-side validation
- Deployment ready on Vercel

---

## 🧰 Tech Stack

- **Frontend:** Next.js App Router, TypeScript, TailwindCSS, TRPC, React Query
- **Backend:** Next.js API Routes, Prisma, PostgreSQL
- **Auth:** NextAuth.js (Credentials)
- **Deployment:** Vercel
- **ORM:** Prisma
- **State Management:** React Hooks + tRPC
- **UI:** TailwindCSS, Custom Components

---

## 📑 API Documentation

All APIs are exposed via **tRPC**.

### Secret APIs
| Endpoint                  | Method | Description                            |
|--------------------------|--------|----------------------------------------|
| `secret.createSecret`    | POST   | Create a new secret                    |
| `secret.getSecret`       | GET    | Retrieve a secret by ID                |
| `secret.updateSecret`    | PUT    | Edit a secret (only owner can edit)    |

### Dashboard APIs
| Endpoint                  | Method | Description                            |
|--------------------------|--------|----------------------------------------|
| `dashboard.getMySecrets` | GET    | Fetch all secrets for the logged user  |
| `dashboard.deleteSecret` | DELETE | Delete a secret                        |

---

## 🛠️ Project Setup

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/secret-chit.git
cd secret-chit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/secret_chit
NEXTAUTH_SECRET=some_secret_value
```

### 4. Run Prisma Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the Dev Server

```bash
npm run dev
```

---

## 🗂️ Project Structure

```
/
├── app/                     # App router pages
│   └── dashboard/           # Authenticated dashboard
│   └── secret/[id]/         # Secret view page
├── components/              # Reusable UI components
├── server/                  
│   └── api/routers/         # tRPC routers
│   └── db.ts                # Prisma client
│   └── auth.ts              # NextAuth config
├── lib/                     
│   └── trpc.ts              # tRPC config
├── prisma/                  
│   └── schema.prisma        # Prisma schema
└── public/                  # Static assets
```

---

## 🔄 Usage Instructions

1. Visit the home page to create a new secret.
2. Set expiration time or one-time access.
3. Copy and share the generated secret link.
4. If one-time view is enabled, the link becomes invalid after the first open.
5. Dashboard allows search, edit, and delete functionality.

---

## 🚀 Deployment

This project is deployed on **Vercel**. You can do the same by:

1. Connecting your GitHub repo to Vercel.
2. Setting the following environment variables in the Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
3. Add a postinstall script in `package.json`:

```json
"postinstall": "prisma generate"
```

4. Redeploy via the Vercel dashboard.

---

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org)
- [Prisma](https://www.prisma.io)
- [NextAuth.js](https://next-auth.js.org)
- [tRPC](https://trpc.io)
- [TailwindCSS](https://tailwindcss.com)

---
