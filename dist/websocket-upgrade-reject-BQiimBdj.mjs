import{STATUS_CODES}from"node:http";
//!src/shared/websocket-upgrade-reject.ts
function rejectWebSocketUpgrade(e,t){const n=[`HTTP/1.1 ${t.status} ${t.reason??STATUS_CODES[t.status]}`,`Connection: close`,...t.body?[`Content-Type: ${t.body.contentType}`,`Content-Length: ${Buffer.byteLength(t.body.text,`utf8`)}`]:[],...Object.entries(t.headers??{}).map(([e,t])=>`${e}: ${t}`),``,t.body?.text??``].join(`\r
`);try{e.end(n,()=>e.destroy())}catch(t){e.destroy();throw t}}export{rejectWebSocketUpgrade as t};