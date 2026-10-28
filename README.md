# Saravanan R — portfolio (Personal Digital Operating System)

Concept: data in motion. The 3D field is one set of points that regroups per section (network, project clusters, layered stack, helix timeline, convergence on contact).
All content lives in `client/src/data/portfolio.js`. Nothing else needs editing to update the site.

## Run locally
    cd server && npm install && npm run dev      # http://localhost:5000
    cd client && npm install && npm run dev      # http://localhost:5173 (proxies /api)

## Build
    cd client && npm run build                   # outputs client/dist

## Deploy
- Backend (Render/Railway): root `server`, build `npm install`, start `npm start`. Set `CLIENT_ORIGIN` to your site URL.
- Frontend (Vercel/Netlify): root `client`, build `npm run build`, output `dist`. Set `VITE_API_URL` to the backend URL.
- Contact messages are appended to `server/messages.jsonl`, which free hosts wipe on redeploy. Replace the body of `server/controllers/contact.js` with Resend or Nodemailer before going live.
