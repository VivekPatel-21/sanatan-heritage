import {spawn} from 'node:child_process';
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'ignore',env:process.env});
let ready=false;
try {
  for(let attempt=0;attempt<40;attempt++){
    if(server.exitCode!==null)throw new Error('Site server exited before the performance audit');
    try{const response=await fetch('http://127.0.0.1:8080/',{signal:AbortSignal.timeout(800)});if(response.ok){ready=true;break;}}catch{}
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(!ready)throw new Error('Local site server was not ready on port 8080');
  await import('./measure-performance.mjs');
}finally{
  server.kill('SIGTERM');
}
