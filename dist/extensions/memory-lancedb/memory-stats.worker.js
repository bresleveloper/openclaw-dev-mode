import { t as loadLanceDbModule } from "./.setup/lancedb-runtime-DsU7C05g.mjs";
import { t as runMemoryStatsReader } from "./.setup/memory-stats-reader-D8cdyeTF.mjs";
// extensions/memory-lancedb/memory-stats.worker.ts
await runMemoryStatsReader(loadLanceDbModule);
export {};
