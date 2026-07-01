import { resolveConfig } from "./config.mjs";
import { startPanelServer } from "./server.mjs";

const config = resolveConfig();
const server = await startPanelServer(config);
const { port } = server.address();
console.log(`[wa-claw] panel listening on http://127.0.0.1:${port}  (db: ${config.dbPath})`);
console.log("[wa-claw] auth: ON");
