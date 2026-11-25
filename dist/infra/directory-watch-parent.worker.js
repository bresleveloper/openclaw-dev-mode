import{workerData}from"node:worker_threads";
//!src/infra/directory-watch-parent.worker.ts
const caller=workerData?.caller;if(typeof caller!==`number`)throw new Error(`Directory watch parent monitor requires its caller PID`);setInterval(()=>{if(process.ppid!==caller)process.kill(process.pid,`SIGKILL`)},1e3);export{};