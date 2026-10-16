import { n as serveWorkerTasks } from "../../worker-task-server-BC_7U18u.mjs";
import { t as prepareProviderPrompt } from "../../provider-prompt-serialization-CaEOELdi.mjs";
//#region src/agents/embedded-agent-runner/provider-prompt-state.worker.ts
serveWorkerTasks((input) => prepareProviderPrompt(input), { transferList: (result) => result.encoded ? [result.encoded.body.buffer] : [] });
//#endregion
export {};
