import { createPluginRuntimeProcessEntrypoint } from "openclaw/plugin-sdk/process-runtime";
// extensions/codex/session-history-worker-entrypoint.ts
const codexHistoryWorkerEntrypoint = createPluginRuntimeProcessEntrypoint("codexSessionHistory", import.meta.url);
export { codexHistoryWorkerEntrypoint };
