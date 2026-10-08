import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
const child=spawn('python3',['-m','http.server','8080','--directory',existsSync('dist/index.html')?'dist':'.'],{stdio:'inherit'});
child.on('exit',code=>process.exit(code??1));
