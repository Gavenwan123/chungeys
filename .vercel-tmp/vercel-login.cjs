#!/usr/bin/env node
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';
const tmpDir = path.join(process.cwd(), '.vercel-tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
const LOG_FILE = path.join(tmpDir, 'login.log');
function log(msg) { console.error(msg); }
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
async function main() {
  log('Starting login...');
  const logStream = fs.openSync(LOG_FILE, 'w');
  const child = spawn('vercel', ['login'], {
    detached: true, stdio: ['ignore', logStream, logStream], shell: isWindows
  });
  child.unref();
  log(`Background login process started (PID: ${child.pid})`);
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      if (fs.existsSync(LOG_FILE)) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const match = content.match(/https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+/);
        if (match) {
          log(`Authorization URL: ${match[0]}`);
          // Open browser on Windows
          if (isWindows) {
            spawnSync('powershell', ['-Command', `Start-Process '${match[0]}'`], { stdio: 'ignore', windowsHide: true });
          }
          console.log(JSON.stringify({ status: 'needs_auth', auth_url: match[0] }));
          process.exit(0);
        }
      }
    } catch (e) {}
  }
  log('Failed to get authorization URL');
  try { log('Log: ' + fs.readFileSync(LOG_FILE, 'utf8')); } catch {}
  process.exit(1);
}
main();
