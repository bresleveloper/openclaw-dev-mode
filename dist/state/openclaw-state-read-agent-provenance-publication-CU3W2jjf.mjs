import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import "./openclaw-state-read-sqlite-worker-operation-admission-we1rdJYO.mjs";
import { n as createStateDomainPublication } from "./openclaw-state-read-state-domain-publication-DnqJOUHl.mjs";
createStateDomainPublication({
	domain: "agent-provenance",
	keyOf: (row) => row.agentId,
	isValue: (value) => isRecord(value) && typeof value.agentId === "string" && (value.createdVia === "operator" || value.createdVia === "agent" || value.createdVia === "claw") && (value.creatorAgentId === null || typeof value.creatorAgentId === "string") && typeof value.createdAtMs === "number"
});
//#endregion
export {};
