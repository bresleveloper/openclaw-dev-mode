//!src/infra/non-fatal-cleanup.ts
async function runBestEffortCleanup(e){try{return await e.cleanup()}catch(t){try{e.onError?.(t)}catch{}return}}export{runBestEffortCleanup as t};