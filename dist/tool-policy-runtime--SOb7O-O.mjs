import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { v as registerRuntimeConfigSnapshotPreparer } from "./runtime-snapshot-DYptB0Cf.mjs";
import { r as CLAW_INSTALL_RECORD_ADOPTED_SCHEMA_VERSION } from "./provenance-schema-version-CA1gqk1A.mjs";
import { a as prepareClawInstallSchemaVersions, i as initializeCachedClawInstallSchemaVersions, o as readCachedClawInstallSchemaVersions, s as registerClawInstallSchemaVersionSnapshotListener } from "./provenance-runtime-read-DLNIVZio.mjs";
import { u as digestClawValue } from "./schema-portability-DPQGHUzw.mjs";
import { i as resolveMigrationAgentSettings, r as normalizeWorkspaceConfig } from "./migrate-validation-DioFMXjJ.mjs";
import { realpathSync } from "node:fs";
//#region src/claws/tool-policy-candidates.ts
function collectClawToolPolicyCandidates(config) {
	return listAgentEntries(config).flatMap((agent) => {
		const tools = agent.tools;
		if (!tools || !tools.profile && !tools.allow?.length) return [];
		let adoptedDigest;
		return [{
			agentId: agent.id,
			agentConfigDigest: digestClawValue(agent),
			adoptedAgentConfigDigest: (env) => adoptedDigest ??= digestClawValue(normalizeWorkspaceConfig(resolveMigrationAgentSettings(config, agent), realpathSync(resolveAgentWorkspaceDir(config, agent.id, env)))),
			tools
		}];
	});
}
//#endregion
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
function applyPreparedClawToolPolicyConsent(candidates = preparedCandidates, stateOptions = preparedStateOptions) {
	const snapshot = readCachedClawInstallSchemaVersions(stateOptions);
	for (const candidate of candidates) {
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
		const adopted = schemaVersionRead.schemaVersion === CLAW_INSTALL_RECORD_ADOPTED_SCHEMA_VERSION;
		const current = adopted || schemaVersionRead.schemaVersion === "openclaw.clawInstallRecord.v2";
		try {
			if (current && schemaVersionRead.agentConfigDigest !== (adopted ? candidate.adoptedAgentConfigDigest(stateOptions.env) : candidate.agentConfigDigest)) throw new Error("Claw agent configuration does not match its consent provenance.");
		} catch (error) {
			preparedClawToolPolicies.set(candidate.tools, {
				kind: "state-error",
				error
			});
			continue;
		}
		preparedClawToolPolicies.set(candidate.tools, { kind: current ? "current" : "legacy" });
	}
}
/** Bind a captured construction config to the owner's prepared provenance facts. */
function prepareCapturedClawToolPolicyConsent(config, stateOptions) {
	applyPreparedClawToolPolicyConsent(collectClawToolPolicyCandidates(config), stateOptions);
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
		replaceClawToolPolicyCandidates(collectClawToolPolicyCandidates(config), {
			path: preparedSchemaVersions.path,
			env: context.env
		});
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
export { collectClawToolPolicyCandidates as a, resolveClawToolPolicyConsent as i, markFrozenClawToolAllowPolicy as n, prepareCapturedClawToolPolicyConsent as r, isFrozenClawToolAllowPolicy as t };
