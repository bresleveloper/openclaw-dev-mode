import { createPluginRuntimeProcessEntrypoint } from "openclaw/plugin-sdk/process-runtime";
// extensions/codex/catalog-page-worker-entrypoint.ts
const codexCatalogPageWorkerEntrypoint = createPluginRuntimeProcessEntrypoint("codexCatalogPage", import.meta.url);
export { codexCatalogPageWorkerEntrypoint };
