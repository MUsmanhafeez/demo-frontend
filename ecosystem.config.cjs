/** PM2 config — run from repo root: pm2 startOrReload ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "demo-frontend",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
