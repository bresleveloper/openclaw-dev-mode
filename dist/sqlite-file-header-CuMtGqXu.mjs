import fs from"node:fs/promises";
//!src/infra/sqlite-file-header.ts
async function isSqliteSnapshotFile(e){if(e.endsWith(`.sqlite`))return true;const t=await fs.open(e,`r`);try{const e=Buffer.alloc(16);return(await t.read(e,0,16,0)).bytesRead===16&&e.toString()===`SQLite format 3\0`}finally{await t.close()}}export{isSqliteSnapshotFile as t};