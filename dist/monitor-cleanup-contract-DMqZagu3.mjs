import { Fn as object, Jn as string, Lt as boolean, Nt as array, kt as _null, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region src/claws/monitor-cleanup-contract.ts
const text = string().min(1).max(4096);
const clawMonitorCleanupBindingSchema = object({
	configPath: text,
	statePath: text,
	cronStorePath: text
}).strict();
const clawMonitorSnapshotSchema = object({
	id: text,
	name: string(),
	enabled: boolean(),
	agentId: text,
	ownerAgentId: _null(),
	storeKey: text,
	declarationKey: text,
	revision: text
}).strict();
const clawMonitorInventorySchema = object({ monitors: array(clawMonitorSnapshotSchema).max(2) }).strict();
const clawMonitorDrainSchema = object({ drained: literal(true) }).strict();
//#endregion
export { clawMonitorSnapshotSchema as i, clawMonitorDrainSchema as n, clawMonitorInventorySchema as r, clawMonitorCleanupBindingSchema as t };
