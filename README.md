# Face Collect

Mobile-first web app to collect face images & short clips with client-side quality checks.
Stack (MVP):
- Frontend: Next.js
- Styling: Tailwind CSS
- Client face checks: face-api.js
- Storage + DB: Supabase (Storage + Postgres)
- Backend: Next.js API routes (initially) and FastAPI later if needed

Steps:
1. Project repo & README (this)
2. Frontend scaffold: Next.js + Tailwind
3. Camera capture UI + face-api.js checks
4. Upload to Supabase Storage + metadata to Supabase Postgres
5. Admin list & download endpoint
6. Deploy to Vercel + Supabase

See .env.example for required environment variables.
