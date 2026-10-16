import { t as createCodexCatalogDecoder } from "./.setup/client-catalog-response-CogGEXrN.mjs";
import { serveWorkerTasks } from "openclaw/plugin-sdk/worker-task-server";
//#region extensions/codex/catalog-page.worker.ts
const decode = createCodexCatalogDecoder();
serveWorkerTasks((input) => {
	return decode(input);
});
//#endregion
export {};
