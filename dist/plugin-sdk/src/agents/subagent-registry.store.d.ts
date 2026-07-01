import type { SubagentRunRecord } from "./subagent-registry.types.js";
type ReadonlySubagentRunRecord = Readonly<SubagentRunRecord>;
export declare function resolveSubagentRegistryPath(): string;
export declare function loadSubagentRegistryFromDisk(): Map<string, SubagentRunRecord>;
export declare function loadSubagentRegistryFromDisk(options: {
    clone: false;
}): ReadonlyMap<string, ReadonlySubagentRunRecord>;
export declare function saveSubagentRegistryToDisk(runs: Map<string, SubagentRunRecord>): void;
export {};
