#!/bin/sh
set -eu
release=$(readlink -f "${1:?Pass the release directory}")
case "$release" in /opt/monopoly/releases/*) ;; *) exit 1 ;; esac
test -f "$release/public/index.html"

sudo -n docker compose -p monopoly -f "$release/deploy/compose.yaml" up -d --build --wait --wait-timeout 120
curl -fsS http://127.0.0.1:9004/health

mkdir -p "$release/nginx-backup"
for config in port_9000.conf kittens-9000.conf; do
    sudo -n cp -a "/etc/nginx/sites-available/$config" "$release/nginx-backup/$config"
done
sudo -n install -m 644 "$release/deploy/nginx-monopoly-upgrade.conf" /etc/nginx/conf.d/monopoly-upgrade.conf
sudo -n install -m 644 "$release/deploy/nginx-monopoly-locations.conf" /etc/nginx/snippets/monopoly-locations.conf
sudo -n python3 - <<'PY'
from pathlib import Path
marker = '    include /etc/nginx/snippets/kittens-locations.conf;'
addition = '    include /etc/nginx/snippets/monopoly-locations.conf;'
for name in ('port_9000.conf', 'kittens-9000.conf'):
    path = Path('/etc/nginx/sites-available') / name
    content = path.read_text()
    if addition in content:
        continue
    if content.count(marker) != 1:
        raise SystemExit(f'Unexpected Nginx layout: {path}')
    path.write_text(content.replace(marker, marker + '\n' + addition, 1))
PY
if ! sudo -n nginx -t; then
    for config in port_9000.conf kittens-9000.conf; do
        sudo -n cp -a "$release/nginx-backup/$config" "/etc/nginx/sites-available/$config"
    done
    exit 1
fi
if test -e /var/www/monopoly && ! test -L /var/www/monopoly; then
    printf 'Refusing to replace an existing directory: /var/www/monopoly\n' >&2
    exit 1
fi
sudo -n ln -sfn "$release/public" /var/www/monopoly
sudo -n systemctl reload nginx
sudo -n ln -sfn "$release" /opt/monopoly/current
for attempt in 1 2 3 4 5; do
    if curl -fsS -H 'Host: beatsync-server.zney295.id.vn' http://127.0.0.1:9000/monopoly/health; then
        exit 0
    fi
    sleep 1
done
exit 1
