import { createPluginRuntimeProcessEntrypoint } from "openclaw/plugin-sdk/process-runtime";
// extensions/memory-lancedb/memory-stats-entrypoint.ts
const memoryStatsRuntimeEntrypoint = createPluginRuntimeProcessEntrypoint("memoryStatsRuntime", import.meta.url);
export { memoryStatsRuntimeEntrypoint as t };
