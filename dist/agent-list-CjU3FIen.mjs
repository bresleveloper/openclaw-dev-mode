import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as normalizeMainKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries, o as tryResolveDefaultAgentId } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { b as SYSTEM_AGENT_ROSTER_ENTRIES, g as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-dWNS6Rcs.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/agent-list.ts
async function listExistingAgentIdsFromDisk() {
	const agentsDir = path.join(resolveStateDir(), "agents");
	try {
		return (await fs.readdir(agentsDir, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => normalizeAgentId(entry.name));
	} catch {
		return [];
	}
}
function resolveGatewayAgentSelectionState(cfg) {
	const configuredIds = listAgentEntries(cfg).map((entry) => normalizeAgentId(entry.id));
	const soleAgentId = tryResolveDefaultAgentId(cfg);
	if (soleAgentId) return {
		defaultId: normalizeAgentId(soleAgentId),
		ownership: "sole",
		selectionRequired: false
	};
	const legacyAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	const legacyCompatibleId = legacyAgentId ?? configuredIds[0];
	if (!legacyCompatibleId) throw new Error("Cannot project gateway agent ownership without a configured agent.");
	return {
		defaultId: normalizeAgentId(legacyCompatibleId),
		ownership: legacyAgentId && cfg.agents?.ownership !== "explicit" ? "legacy" : "explicit",
		selectionRequired: !legacyAgentId
	};
}
/** Lists gateway-visible agents with canonical membership, ordering, and semantic kind. */
async function listGatewayAgentsBasic(cfg) {
	const ownerEntries = new Map(SYSTEM_AGENT_ROSTER_ENTRIES.map((entry) => [normalizeAgentId(entry.id), entry]));
	const selection = resolveGatewayAgentSelectionState(cfg);
	const defaultId = selection.defaultId;
	const mainKey = normalizeMainKey(cfg.session?.mainKey);
	const scope = cfg.session?.scope ?? "per-sender";
	const configuredById = /* @__PURE__ */ new Map();
	const diskIds = /* @__PURE__ */ new Set();
	const agentIds = /* @__PURE__ */ new Set();
	agentIds.add(normalizeAgentId(defaultId));
	for (const entry of listAgentEntries(cfg)) {
		if (!entry?.id) continue;
		const id = normalizeAgentId(entry.id);
		const configuredName = normalizeOptionalString(entry.name);
		const identityName = normalizeOptionalString(entry.identity?.name);
		configuredById.set(id, configuredName ?? identityName);
		agentIds.add(id);
	}
	for (const id of await listExistingAgentIdsFromDisk()) {
		diskIds.add(id);
		agentIds.add(id);
	}
	const allowedIds = configuredById.size > 0 ? configuredById : null;
	const visibleIds = [...agentIds].filter((id) => !allowedIds || allowedIds.has(id) || diskIds.has(id) && ownerEntries.has(id));
	visibleIds.sort((a, b) => a.localeCompare(b));
	const orderedIds = defaultId && visibleIds.includes(defaultId) ? [defaultId, ...visibleIds.filter((id) => id !== defaultId)] : visibleIds;
	if (mainKey && !orderedIds.includes(mainKey) && (!allowedIds || allowedIds.has(mainKey))) orderedIds.push(mainKey);
	const agents = orderedIds.map((id) => {
		const admissionRefusal = readAgentDatabaseAdmissionRefusal(id);
		const agent = {
			id,
			kind: !configuredById.has(id) && diskIds.has(id) ? ownerEntries.get(id)?.kind ?? "agent" : "agent",
			name: configuredById.get(id)
		};
		if (admissionRefusal) {
			agent.status = "degraded";
			agent.admissionRefusal = admissionRefusal;
		}
		return agent;
	});
	return {
		...selection,
		mainKey,
		scope,
		agents
	};
}
//#endregion
export { resolveGatewayAgentSelectionState as n, listGatewayAgentsBasic as t };
