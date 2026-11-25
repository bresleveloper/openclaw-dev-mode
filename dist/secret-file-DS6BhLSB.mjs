import{s as readSecretFileSync,t as DEFAULT_SECRET_FILE_MAX_BYTES}from"./secret-file-CCWvcuYH.mjs";
//!src/acp/secret-file.ts
function readSecretFromFile(e,t){return readSecretFileSync(e,t,{maxBytes:DEFAULT_SECRET_FILE_MAX_BYTES,rejectSymlink:true})}export{readSecretFromFile as t};