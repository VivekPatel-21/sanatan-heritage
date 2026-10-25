import { spawnSync } from 'node:child_process';
const candidates = process.env.SANATAN_PYTHON ? [[process.env.SANATAN_PYTHON, []]] : process.platform === 'win32' ? [['py', ['-3']], ['python', []], ['python3', []]] : [['python3', []], ['python', []]];
for (const [command, prefix] of candidates) {
  const probe = spawnSync(command, [...prefix, '--version'], { encoding: 'utf8', windowsHide: true });
  if (probe.status !== 0 || !/Python 3\./.test(probe.stdout + probe.stderr)) continue;
  const result = spawnSync(command, [...prefix, 'scripts/check-site.py'], { stdio: 'inherit', windowsHide: true });
  process.exit(result.status ?? 1);
}
console.error('Python 3 is required for the site checker. Install Python or set SANATAN_PYTHON to its executable path.');
process.exit(1);
