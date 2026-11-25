import{t as hasErrnoCode}from"./errno-DUBt6SQQ.mjs";
//!src/secrets/store/secret-store-sqlite.ts
function withMissingSecretStoreFallback(e,t){try{return e()}catch(e){if(e instanceof Error&&hasErrnoCode(e,`ERR_SQLITE_ERROR`)&&e.message===`no such table: secret_store_entries`)return t;throw e}}export{withMissingSecretStoreFallback as t};