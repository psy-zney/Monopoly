# Monopoly Deploy Guide

Game nay gom 2 phan rieng:

- `client`: React/Vite frontend.
- `server`: Express + Socket.io realtime server.

Khong deploy `client` static mot minh neu muon choi online nhieu nguoi. `client` can biet URL cua `server`, va `server` can cho phep domain cua `client`.

## Cach deploy khuyen nghi

- Deploy `server` truoc len Render, Railway, Fly.io, hoac VPS.
- Lay public URL cua `server`.
- Deploy `client` len Vercel hoac Netlify.
- Set bien moi truong `VITE_SOCKET_URL` cua `client` tro den public URL cua `server`.
- Quay lai `server`, set `CLIENT_ORIGIN` tro den public URL cua `client`.

## Server

Thu muc deploy:

```txt
server
```

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```

Health check path:

```txt
/health
```

Bien moi truong:

```env
CLIENT_ORIGIN=https://your-client-domain.com
```

Khong can tu set `PORT` neu dung Render/Railway/Fly.io. Server da doc `process.env.PORT` va fallback ve `3001` khi chay local.

Vi du sau khi deploy server:

```env
CLIENT_ORIGIN=https://monopoly-game.vercel.app
```

## Client

Thu muc deploy:

```txt
client
```

Build command:

```bash
npm install && npm run build
```

Output directory:

```txt
dist
```

Bien moi truong:

```env
VITE_SOCKET_URL=https://your-server-domain.com
```

Vi du sau khi deploy server:

```env
VITE_SOCKET_URL=https://monopoly-server.onrender.com
```

## Vercel cho client

Project settings:

```txt
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Environment Variables:

```env
VITE_SOCKET_URL=https://your-server-domain.com
```

Sau khi doi `VITE_SOCKET_URL`, can redeploy client vi Vite dong goi bien `VITE_*` vao build.

## Render cho server

Service type:

```txt
Web Service
```

Runtime:

```txt
Node
```

Root Directory:

```txt
server
```

Build Command:

```bash
npm install && npm run build
```

Start Command:

```bash
npm start
```

Environment Variables:

```env
CLIENT_ORIGIN=https://your-client-domain.com
```

Health Check Path:

```txt
/health
```

Neu Render service bi sleep o goi mien phi, lan ket noi dau co the cham vai chuc giay.

## Railway cho server

Root Directory:

```txt
server
```

Build Command:

```bash
npm install && npm run build
```

Start Command:

```bash
npm start
```

Environment Variables:

```env
CLIENT_ORIGIN=https://your-client-domain.com
```

Railway se tu cap `PORT`. Khong hard-code port.

## Local check truoc khi deploy

Chay test va build client:

```bash
cd client
npm test -- --run
npm run build
```

Build server:

```bash
cd server
npm run build
```

Chay server local:

```bash
cd server
npm run dev
```

Chay client local:

```bash
cd client
npm run dev
```

Mac dinh local:

```env
Client: http://localhost:5173
Server: http://localhost:3001
```

## Thu tu deploy chuan

1. Deploy `server`.
2. Mo `https://your-server-domain.com/health` de kiem tra server tra ve JSON `ok: true`.
3. Copy URL server.
4. Deploy `client` voi `VITE_SOCKET_URL` bang URL server.
5. Copy URL client.
6. Cap nhat `server` voi `CLIENT_ORIGIN` bang URL client.
7. Redeploy/restart server.
8. Mo client production va tao phong de test ket noi realtime.

## Loi thuong gap

Neu client mo duoc nhung khong tao/join phong duoc:

- Kiem tra `VITE_SOCKET_URL` co dung URL server production khong.
- Kiem tra server co online khong bang `/health`.
- Kiem tra `CLIENT_ORIGIN` tren server co dung URL client khong.
- Sau khi doi `VITE_SOCKET_URL`, phai build/redeploy client lai.

Neu bi loi CORS:

- Set `CLIENT_ORIGIN` chinh xac bang domain client, vi du:

```env
CLIENT_ORIGIN=https://monopoly-game.vercel.app
```

Neu deploy client va server cung mot domain/proxy:

- Co the dat `VITE_SOCKET_URL` bang domain do.
- Van nen giu `CLIENT_ORIGIN` ro rang de tranh loi CORS sau nay.

## Trang thai hien tai cua code

Da verify local:

```txt
client: npm test -- --run -> pass
client: npm run build -> pass
server: npm run build -> pass
```

