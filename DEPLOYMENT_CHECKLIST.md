## Production Deployment Checklist (Auth + Security)

Use this checklist before launching to production. It captures the minimal, practical steps needed for a secure, working deploy of this app.

### 1) Environment variables (server)
- **JWT_SECRET**: Long random string (≥ 32 chars)
- **MONGO_URI**: Production MongoDB connection string
- **NODE_ENV**: `production`
- **CORS_ORIGINS**: Comma-separated list of allowed frontend origins (e.g., `https://yourdomain.com,https://www.yourdomain.com`)
- **SMTP_HOST**, **SMTP_PORT**, **SMTP_USER**, **SMTP_PASS**: SMTP credentials
- **EMAIL_FROM**: From address (e.g., `no-reply@yourdomain.com`)
- Optional: **FRONTEND_BASE_URL** (used in email links)

Why: Secrets and service URLs don’t belong in code; the app needs these to run safely and send email.

### 2) HTTPS/TLS in front of Node
- You must serve production over HTTPS so cookies can be `Secure` and traffic is encrypted.
- If using Nginx + Certbot, adapt this example:

```nginx
server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  return 301 https://yourdomain.com$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com www.yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header Host $host;
  }
}
```

Notes:
- The server already sets `trust proxy` and secure cookie behavior in production.

### 3) CORS
- Set `CORS_ORIGINS` to your exact frontend origin(s) only.
- Example: `https://yourdomain.com,https://www.yourdomain.com`

Why: Prevents other sites from calling your API via browsers.

### 4) Email deliverability (SMTP)
- Use a reputable SMTP provider (e.g., SendGrid/Resend/SES).
- Add DNS records for your domain:
  - **SPF (TXT)**: `v=spf1 include:<your-smtp-domain> ~all`
  - **DKIM**: Provided by your SMTP provider (CNAME/TXT)
  - **DMARC (TXT)**: e.g., `v=DMARC1; p=quarantine; rua=mailto:postmaster@yourdomain.com`
- Test: Register and verify that the 6‑digit email lands in the inbox.

### 5) Monitoring and logs
- Uptime monitor: ping `GET /api/health` every 1–5 minutes.
- Ensure your host keeps stdout/stderr logs and review after deploy.

### 6) Backups
- Atlas: enable daily backups.
- Self-hosted: run a daily `mongodump` to remote storage.

### 7) Security controls already implemented (for your reference)
- Security headers via Helmet; restricted CORS.
- CSRF protection with token endpoint; client sends `X-CSRF-Token`.
- httpOnly cookie session, 3‑day expiry; `Secure`/`SameSite` in prod.
- JWT includes `tokenVersion`; password reset bumps it to kill old sessions.
- Login lockout: 5 wrong attempts → ~10 minute cooldown.
- Verify code limit: 5 wrong codes → ~10 minute cooldown.
- Daily cleanup: remove unverified accounts older than 30 days.
- Clear UX banners for cooldowns; verify and reset flows with success panels.

### 8) Post-deploy smoke test (5 minutes)
1) Register → Verify → Sign in (happy path, emails arrive).
2) Login wrong password ×5 → amber cooldown banner; after ~10 min, correct login works.
3) Verify wrong code ×5 → amber cooldown; after ~10 min, correct code works.
4) Reset password in Browser A → old session in Browser B can’t access `/api/auth/me`.
5) DevTools → Application → Cookies: `token` is `httpOnly`, `Secure` (prod), `SameSite=strict`.
6) Response headers include Helmet defaults (e.g., `X-Content-Type-Options`).

### 9) Useful commands
- Server: `npm install && npm run start` (or your PM2/systemd setup)
- Client: `npm install && npm run build` (then serve via your host or CDN)

### 10) Rollback plan (keep it simple)
- Keep the previous server and client builds available.
- If deploy misbehaves, restore previous environment and build; investigate logs.


