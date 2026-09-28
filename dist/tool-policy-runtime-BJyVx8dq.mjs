import { E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import { b as registerRuntimeConfigSnapshotPreparer } from "./runtime-snapshot-DbgWcCyV.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { a as prepareClawInstallSchemaVersions, i as initializeCachedClawInstallSchemaVersions, o as readCachedClawInstallSchemaVersions, s as registerClawInstallSchemaVersionSnapshotListener } from "./provenance-runtime-read-Di4oRDaq.mjs";
import { t as digestClawAgentConfig } from "./agent-config-digest-C49Q5-61.mjs";
//#region src/claws/tool-policy-runtime.ts
const frozenToolAllowPolicies = /* @__PURE__ */ new WeakSet();
const preparedClawToolPolicies = /* @__PURE__ */ new WeakMap();
let preparedCandidates = [];
let preparedStateOptions = {};
const uninitializedStateError = /* @__PURE__ */ new Error("OpenClaw state database has not initialized Claw consent provenance.");
function markFrozenClawToolAllowPolicy(policy) {
	if (policy) frozenToolAllowPolicies.add(policy);
}
function isFrozenClawToolAllowPolicy(policy) {
	return policy ? frozenToolAllowPolicies.has(policy) : false;
}
function applyPreparedClawToolPolicyConsent() {
	const snapshot = readCachedClawInstallSchemaVersions(preparedStateOptions);
	for (const candidate of preparedCandidates) {
		if (snapshot.kind === "uninitialized") {
			preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: uninitializedStateError
			});
			continue;
		}
		if (snapshot.kind === "state-error") {
			if (snapshot.ownershipUnknown || snapshot.knownAgentIds.has(candidate.agentId)) preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: snapshot.error
			});
			else preparedClawToolPolicies.delete(candidate.tools);
			continue;
		}
		const schemaVersionRead = snapshot.schemaVersions.get(candidate.agentId);
		if (!schemaVersionRead) {
			preparedClawToolPolicies.delete(candidate.tools);
			continue;
		}
		if (schemaVersionRead.kind === "error") {
			preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: schemaVersionRead.error
			});
			continue;
		}
		if (schemaVersionRead.schemaVersion === "openclaw.clawInstallRecord.v2" && schemaVersionRead.agentConfigDigest !== candidate.agentConfigDigest) {
			preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error: /* @__PURE__ */ new Error("Claw agent configuration does not match its consent provenance.")
			});
			continue;
		}
		preparedClawToolPolicies.set(candidate.tools, { kind: schemaVersionRead.schemaVersion === "openclaw.clawInstallRecord.v2" ? "current" : "legacy" });
	}
}
function collectClawToolPolicyCandidates(config) {
	return listAgentEntries(config).flatMap((agent) => {
		const tools = agent.tools;
		return tools && (tools.profile || tools.allow?.length) ? [{
			agentId: agent.id,
			agentConfigDigest: digestClawAgentConfig(agent),
			tools
		}] : [];
	});
}
function replaceClawToolPolicyCandidates(candidates, stateOptions = {}) {
	for (const candidate of preparedCandidates) preparedClawToolPolicies.delete(candidate.tools);
	preparedCandidates = candidates;
	preparedStateOptions = stateOptions;
}
function prepareClawToolPolicyConsent(config) {
	replaceClawToolPolicyCandidates(collectClawToolPolicyCandidates(config));
	initializeCachedClawInstallSchemaVersions({
		...preparedStateOptions,
		artifactPreservingReadOnly: false
	});
	applyPreparedClawToolPolicyConsent();
}
async function prepareClawToolPolicyConsentAsync(config, context) {
	const preparedSchemaVersions = await prepareClawInstallSchemaVersions({
		env: context.env,
		artifactPreservingReadOnly: false
	});
	return () => {
		replaceClawToolPolicyCandidates(collectClawToolPolicyCandidates(config), { path: preparedSchemaVersions.path });
		preparedSchemaVersions.publish();
		applyPreparedClawToolPolicyConsent();
	};
}
registerClawInstallSchemaVersionSnapshotListener(() => applyPreparedClawToolPolicyConsent());
registerRuntimeConfigSnapshotPreparer(prepareClawToolPolicyConsent, { prepareAsync: prepareClawToolPolicyConsentAsync });
var ClawToolProfileConsentError = class extends Error {
	constructor(agentId, options = {}) {
		super(options.unboundedFullProfile ? `Claw-managed agent ${JSON.stringify(agentId)} uses the legacy unbounded full tool profile. Add an explicit tools.allow list to its package OpenClaw profile, then run \`openclaw claws update ${agentId}\` and approve the refreshed tool authority.` : `Claw-managed agent ${JSON.stringify(agentId)} uses a legacy dynamic tool policy. Run \`openclaw claws update ${agentId}\` and approve the refreshed tool authority before running it.`);
		this.name = "ClawToolProfileConsentError";
	}
};
var ClawToolProfileConsentStateError = class extends Error {
	constructor(agentId, cause) {
		super(`Cannot verify the installed tool authority for Claw-managed agent ${JSON.stringify(agentId)}. Repair the OpenClaw state database before running it.`, { cause });
		this.name = "ClawToolProfileConsentStateError";
	}
};
function resolveClawToolPolicyConsent(params) {
	if (!params.agentId || !params.ownsProfile && !params.hasAgentAllowlist) return { frozen: false };
	const prepared = params.agentTools ? preparedClawToolPolicies.get(params.agentTools) : void 0;
	if (!prepared) return { frozen: false };
	if (prepared.kind === "state-error") throw new ClawToolProfileConsentStateError(params.agentId, prepared.error);
	if (prepared.kind === "legacy" || params.ownsProfile && (params.profile !== "full" || !params.hasAgentAllowlist)) throw new ClawToolProfileConsentError(params.agentId, { unboundedFullProfile: prepared.kind === "legacy" && params.profile === "full" && !params.hasAgentAllowlist });
	return { frozen: params.hasAgentAllowlist };
}
//#endregion
export { markFrozenClawToolAllowPolicy as n, resolveClawToolPolicyConsent as r, isFrozenClawToolAllowPolicy as t };
