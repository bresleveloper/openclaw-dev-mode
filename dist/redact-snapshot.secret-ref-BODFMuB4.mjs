//!src/config/redact-snapshot.secret-ref.ts
function isSecretRefShape(e){return typeof e.source===`string`&&typeof e.id===`string`}export{isSecretRefShape as t};