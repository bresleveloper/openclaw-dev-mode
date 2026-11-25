import { createPluginRuntimeProcessEntrypoint } from "openclaw/plugin-sdk/process-runtime";
// extensions/codex/stdio-worker-entrypoint.ts
const codexStdioWorkerEntrypoint = createPluginRuntimeProcessEntrypoint("codexStdio", import.meta.url);
export { codexStdioWorkerEntrypoint };
