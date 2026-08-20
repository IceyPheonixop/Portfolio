# Portfolio CMS

A full-stack personal developer portfolio with a database-backed public site and a private admin CMS. All portfolio content is stored in MongoDB, so changes made through the deployed admin dashboard appear publicly without rebuilding or redeploying the frontend.

## Stack

- Client: React, Vite, Tailwind CSS, Framer Motion, React Router, Lucide
- API: Node.js, Express, MongoDB/Mongoose, JWT in HTTP-only cookies, bcrypt
- Media: Cloudinary (project/profile images and resume)
- Hosting: Vercel (client), Render or Railway (API), MongoDB Atlas, Cloudinary

## Local development

1. Copy `.env.example` to `server/.env` and copy `client/.env.example` to `client/.env`.
2. Fill in the environment values below. Use a long random `JWT_SECRET`.
3. Install packages:

```bash
npm install
npm run install:all
```

4. Create the first administrator. No default account or password is included:

```bash
npm run create-admin --prefix server -- "Your Name" you@example.com "use-a-strong-password-of-12-or-more-characters"
```

5. Start both applications:

```bash
npm run dev
```

The client runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

## Environment variables

`server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=generate-a-long-unique-random-secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:5173
```

`client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit either `.env` file. The repository’s `.gitignore` excludes them.

## MongoDB Atlas

1. Create an Atlas account and a cluster.
2. Create a database user with a strong password.
3. Add your local IP while developing; for deployment, permit the hosting service as required by Atlas.
4. Copy the driver connection string and set it as `MONGODB_URI`.

## Cloudinary

Create a Cloudinary account, then copy the cloud name, API key, and API secret from its dashboard to the API environment. The browser uploads files only to the protected Express API; Cloudinary secrets are never included in the client build. Images are saved under `portfolio/projects` and profile assets under `portfolio/profile`.

## Deployment

### API (Render or Railway)

1. Deploy the `server` directory as a Node service. Build command: `npm install`; start command: `npm start`.
2. Configure every server environment variable above. Set `NODE_ENV=production`.
3. Set `CLIENT_URL` to the final Vercel domain (or a comma-separated list of allowed frontend domains).
4. Copy the deployed API URL, for example `https://portfolio-api.example.com/api`.

### Client (Vercel)

1. Import the repository and set the root directory to `client`.
2. Use `npm run build`; Vite’s output directory is `dist`.
3. Set `VITE_API_URL` to the deployed API URL including `/api`.
4. Deploy.

Because the API uses a cross-site HTTP-only session cookie in production, the client and API must both use HTTPS. CORS is restricted to `CLIENT_URL`; do not use wildcard origins.

## Admin usage

Open `/admin/login` on the deployed client. After login, use **Projects** to create, edit, publish, reorder, and delete projects, including Cloudinary-hosted hero and gallery images. Drafts remain private. Published projects immediately populate the public projects page and sidebar via the REST API.

The remaining admin screens manage profile, resume, social links, skills, experience, education, and achievements. All write endpoints require the authenticated admin cookie.

## Deployment checklist

- [ ] MongoDB Atlas connection succeeds.
- [ ] Cloudinary credentials are configured only in the API service.
- [ ] `CLIENT_URL` exactly matches the deployed web origin.
- [ ] `VITE_API_URL` is the deployed HTTPS API URL; no production localhost URL remains.
- [ ] Create the initial admin using the one-time CLI command.
- [ ] Log in on the deployed site and test a create/update/delete project flow.
- [ ] Test image upload and removal.
- [ ] Confirm a published project appears publicly, and a draft does not.
