import{isMarkedAsUntransferable}from"node:worker_threads";
//!src/infra/worker-transfer-bytes.ts
function ownedWorkerBytes(e){if(e.buffer instanceof ArrayBuffer&&e.byteOffset===0&&e.byteLength===e.buffer.byteLength&&!isMarkedAsUntransferable(e.buffer))return new Uint8Array(e.buffer);const t=new Uint8Array(e.byteLength);t.set(e);return t}export{ownedWorkerBytes as t};