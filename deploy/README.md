# Monopoly on vps-cong

- Frontend: https://beatsync-server.zney295.id.vn/monopoly/
- Health: https://beatsync-server.zney295.id.vn/monopoly/health
- Socket.IO: HTTPS host above, path `/monopoly/socket.io`.
- Backend: Docker Compose project `monopoly`, bound only to `127.0.0.1:9004`.
- Nginx: `/etc/nginx/snippets/monopoly-locations.conf` included in the existing port 9000 gateway.

Each deployment is stored under `/opt/monopoly/releases/<release>`. The frontend symlink is `/var/www/monopoly`. The original gateway configs are backed up in the release's `nginx-backup` directory before changes. Build the VPS frontend with `pnpm --dir client build --base /monopoly/` and the two environment variables in `client/.env.production.example`. Extract the frontend build into the release's `public` directory and run `sh deploy/activate-vps.sh <absolute-release-path>`.

## Frontend on Vercel

Set Root Directory to `client`, Framework to Vite, Build Command to `pnpm run build`, and Output Directory to `dist`. Keep the install command automatic so Vercel detects the workspace lockfile. Add these variables for Production and Preview, then redeploy:

```dotenv
VITE_SOCKET_URL=https://beatsync-server.zney295.id.vn
VITE_SOCKET_PATH=/monopoly/socket.io
```

Vercel builds at `/`; do not copy the VPS `/monopoly/` base flag into its build command. These variables are public frontend connection settings. The persistent WebSocket process stays on the VPS.

The backend currently accepts all frontend origins (`CLIENT_ORIGIN=*`), matching its existing public-game configuration. Set `CLIENT_ORIGIN` when running Compose to restrict it to a chosen frontend origin.

Run `node deploy/smoke-online.mjs` from this repository to verify 5 connected players, WebSocket and polling transports, and game-state broadcasts against the public backend. The current VPS release is available at `/opt/monopoly/current`.

Room state is held in memory, so restarting the backend ends current online rooms.
