import{writeSiblingTempFile}from"@openclaw/fs-safe/advanced";
//!src/infra/sibling-temp-file.ts
async function writeSiblingTempFile$1(e){return await writeSiblingTempFile({...e,producerIsolation:`private-directory`})}export{writeSiblingTempFile$1 as t};