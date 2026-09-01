const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('\x1b[32m%s\x1b[0m', '  🚀 Starting BoardResultsBD Fullstack Platform   ');
console.log('\x1b[36m%s\x1b[0m', '==================================================\n');

const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve(__dirname, '../backend'),
  stdio: 'inherit',
  shell: true
});

const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve(__dirname, '../frontend'),
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\n\x1b[33m%s\x1b[0m', 'Shutting down development servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
