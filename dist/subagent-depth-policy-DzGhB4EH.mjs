import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { v as getSubagentDepth } from "./session-key-CBvmC8zz.mjs";
import { t as isParentOwnedBackgroundAcpSession } from "./session-interaction-mode-DMdVNqja.mjs";
//#region src/agents/subagents/spawn/subagent-depth-policy.ts
function normalizeSpawnDepth(value) {
	if (typeof value === "number") return Number.isInteger(value) && value >= 0 ? value : void 0;
	if (typeof value === "string") return parseStrictNonNegativeInteger(value);
}
function getSubagentDepthFromEntryLookup(sessionKey, resolveEntry) {
	const raw = (sessionKey ?? "").trim();
	const fallbackDepth = getSubagentDepth(raw);
	if (!raw) return fallbackDepth;
	const visited = /* @__PURE__ */ new Set();
	const depthFromStore = (key) => {
		const normalizedKey = normalizeOptionalString(key);
		if (!normalizedKey) return;
		if (visited.has(normalizedKey)) return;
		visited.add(normalizedKey);
		const entry = resolveEntry(normalizedKey);
		const storedDepth = normalizeSpawnDepth(entry?.spawnDepth);
		if (storedDepth !== void 0) return storedDepth;
		const parentKey = normalizeOptionalString(entry?.spawnedBy);
		if (!parentKey) return;
		const parentDepth = depthFromStore(parentKey);
		if (parentDepth !== void 0) return parentDepth + 1;
		return getSubagentDepth(parentKey) + 1;
	};
	return depthFromStore(raw) ?? fallbackDepth;
}
/** Classifies coordination from the exact session entry and its canonical ACP metadata. */
function isSubagentSessionFromEntry(sessionKey, entry, acpMeta) {
	const spawnDepth = normalizeSpawnDepth(entry?.spawnDepth);
	return (spawnDepth === void 0 ? Boolean(normalizeOptionalString(entry?.spawnedBy)) || getSubagentDepth(sessionKey) > 0 : spawnDepth > 0) || isParentOwnedBackgroundAcpSession(entry ? {
		...entry,
		acp: acpMeta
	} : entry);
}
//#endregion
export { isSubagentSessionFromEntry as n, getSubagentDepthFromEntryLookup as t };
