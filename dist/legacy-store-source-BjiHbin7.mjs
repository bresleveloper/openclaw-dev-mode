import fs from"node:fs";
//!src/config/sessions/legacy-store-source.ts
function isExistingLegacySessionStore(e){return!e.endsWith(`.sqlite`)&&fs.existsSync(e)}export{isExistingLegacySessionStore as t};