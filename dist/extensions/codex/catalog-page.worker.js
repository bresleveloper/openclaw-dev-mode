import { t as createCodexCatalogDecoder } from "./.setup/client-catalog-response-BMgt_4q4.mjs";
import { serveWorkerTasks } from "openclaw/plugin-sdk/worker-task-server";
//#region extensions/codex/catalog-page.worker.ts
const decode = createCodexCatalogDecoder();
serveWorkerTasks((input) => {
	return decode(input);
});
//#endregion
export {};
