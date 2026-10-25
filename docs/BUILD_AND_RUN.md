# 编译、启动与部署说明

本文档适用于 web-qianchun v1.0.0，推荐生产环境为 Linux + Nginx，应用进程监听 `127.0.0.1:3000`。

## 1. 环境要求

- Linux：Ubuntu 22.04+/Debian 12+/Rocky Linux 9+ 均可
- Node.js：24.x（项目根目录 `.nvmrc` 已指定 24）
- npm：随 Node.js 安装
- Nginx：1.20+
- Git：2.30+

检查版本：

```bash
node -v
npm -v
nginx -v
git --version
```

## 2. 本地开发

```bash
git clone https://github.com/Lz-Yonnw/web-qianchun.git
cd web-qianchun
npm ci
npm run dev
```

访问 `http://localhost:3000`。

## 3. 生产构建

```bash
npm ci
npm run check
npm run build:standalone
```

`build:standalone` 会完成 Next.js 生产构建，并把运行时需要的 `public` 与 `.next/static` 复制到 `.next/standalone`。最终可部署目录为：

```text
.next/standalone/
├── .next/
├── node_modules/
├── public/
├── package.json
└── server.js
```

## 4. Linux 服务器启动

将整个 `.next/standalone` 目录上传到服务器，例如 `/var/www/web-qianchun`：

```bash
cd /var/www/web-qianchun
HOSTNAME=127.0.0.1 PORT=3000 node server.js
```

生产环境建议用 systemd 守护进程。创建 `/etc/systemd/system/web-qianchun.service`：

```ini
[Unit]
Description=web-qianchun Next.js application
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/web-qianchun
Environment=NODE_ENV=production
Environment=HOSTNAME=127.0.0.1
Environment=PORT=3000
ExecStart=/usr/bin/node /var/www/web-qianchun/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

启用并启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now web-qianchun
sudo systemctl status web-qianchun
```

如果 Node.js 不在 `/usr/bin/node`，先执行 `which node`，再修改 `ExecStart`。

## 5. Nginx 反向代理

创建 `/etc/nginx/conf.d/web-qianchun.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

验证并重载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

配置 HTTPS 时可使用 Certbot：

```bash
sudo certbot --nginx -d your-domain.com
```

## 6. 更新发布

在源码目录执行：

```bash
git pull --ff-only
npm ci
npm run check
npm run build:standalone
```

把新的 `.next/standalone` 替换到服务器部署目录后：

```bash
sudo systemctl restart web-qianchun
sudo systemctl status web-qianchun
```

建议先上传到新目录，确认文件完整后再切换软链接，以减少停机时间。

## 7. 故障排查

```bash
# 查看应用日志
sudo journalctl -u web-qianchun -n 200 --no-pager

# 持续查看日志
sudo journalctl -u web-qianchun -f

# 检查端口
ss -lntp | grep 3000

# 直接检查应用
curl -I http://127.0.0.1:3000

# 检查 Nginx
sudo nginx -t
```

出现静态资源 404 时，确认部署目录同时包含 `public/` 与 `.next/static/`；使用 `npm run build:standalone` 可自动整理这两部分文件。
