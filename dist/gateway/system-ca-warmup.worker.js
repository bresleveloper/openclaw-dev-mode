import{parentPort}from"node:worker_threads";import{getCACertificates}from"node:tls";
//!src/gateway/system-ca-warmup.worker.ts
if(!parentPort)throw new Error(`System CA warmup requires a worker thread`);try{getCACertificates(`default`);parentPort.postMessage({ok:true})}catch(e){parentPort.postMessage({ok:false,error:e instanceof Error?e.message:String(e)})}finally{parentPort.close()}export{};