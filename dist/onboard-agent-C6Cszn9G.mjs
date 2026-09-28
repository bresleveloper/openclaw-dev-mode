import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, d as resolveAmbientOwnerAgentId, v as toAgentEntriesRecord } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { p as resolveConfigSnapshotHash } from "./io.read-helpers-N26RjV2V.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import "./config-DryArA1l.mjs";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-C7F4XLva.mjs";
import { n as createAgent, r as validateAgentIdInput } from "./agent-create-DpqSNedE.mjs";
//#region src/commands/onboard-agent.ts
function validateFirstOnboardingAgentName(value) {
	const name = value?.trim();
	if (!name) return "Agent name is required.";
	const validation = validateAgentIdInput(name);
	return validation.ok ? void 0 : `${validation.message}. Choose another name.`;
}
function isInjectedMainRoster(config) {
	const roster = listAgentEntries(config);
	const entry = roster[0];
	return roster.length === 1 && entry?.id === "main" && Object.keys(entry).every((key) => key === "id");
}
function mergeOnboardingCandidate(params) {
	const proposalPatch = createMergePatch(params.base, params.candidate);
	const merged = applyMergePatch(params.currentRuntime, proposalPatch);
	const { list: _legacyList, ...agents } = merged.agents ?? {};
	return inheritLegacyDefaultAgentId(params.currentRuntime, {
		...merged,
		agents: {
			...agents,
			entries: toAgentEntriesRecord(listAgentEntries(params.currentRuntime))
		}
	});
}
async function ensureOnboardingAgent(params) {
	if (params.firstAgent) {
		const validationError = validateFirstOnboardingAgentName(params.firstAgent.name);
		if (validationError) throw new Error(validationError);
	}
	const hasExpectedConfigHash = Object.hasOwn(params, "expectedConfigHash");
	let before = hasExpectedConfigHash ? await readConfigFileSnapshot() : void 0;
	if (before?.exists && !before.valid) throw new Error("Cannot create the first agent from an invalid OpenClaw config.");
	if (before && (resolveConfigSnapshotHash(before) ?? null) !== params.expectedConfigHash) throw new Error("OpenClaw config changed before first-agent creation. Retry setup.");
	inheritLegacyDefaultAgentId(params.baseConfig ?? params.config, params.config);
	const hasCandidateRoster = listAgentEntries(params.config).length > 0 && (params.preserveCandidateRoster || !isInjectedMainRoster(params.config));
	if (params.firstAgent?.team) {
		before ??= await readConfigFileSnapshot();
		if (hasCandidateRoster || hasResolvedRosterBeforeMigrations(before)) throw new Error("The requested team was not created because an agent roster already exists. Use `openclaw agents team create` to add a team.");
	}
	if (hasCandidateRoster) return {
		config: params.config,
		configBase: params.baseConfig ?? params.config,
		agentId: resolveAmbientOwnerAgentId(params.config),
		bootstrapPending: false,
		createdAgent: false
	};
	before ??= await readConfigFileSnapshot();
	if (before.exists && !before.valid) throw new Error("Cannot create the first agent from an invalid OpenClaw config.");
	const effective = before.config;
	const candidateBase = params.baseConfig ?? effective;
	if (before.exists && hasResolvedRosterBeforeMigrations(before)) return {
		config: mergeOnboardingCandidate({
			base: candidateBase,
			candidate: params.config,
			currentRuntime: effective
		}),
		configBase: effective,
		agentId: resolveAmbientOwnerAgentId(effective),
		bootstrapPending: false,
		createdAgent: false
	};
	const firstAgentName = params.firstAgent ? params.firstAgent.name.trim() : "main";
	const createOptions = {
		bootstrapFirstAgent: true,
		...hasExpectedConfigHash ? { expectedConfigHash: params.expectedConfigHash } : {},
		beforePersistentApply: params.beforePersistentApply
	};
	const created = params.firstAgent?.team ? await (await import("./agent-team-BdjrZoZs.mjs")).createAgentTeam({
		...createOptions,
		coordinator: firstAgentName,
		workspaceRoot: params.workspace
	}) : await createAgent({
		...createOptions,
		entry: {
			id: normalizeAgentId(firstAgentName),
			name: firstAgentName,
			workspace: params.workspace
		},
		bootstrapMain: normalizeAgentId(firstAgentName) === "main",
		skipBootstrap: params.config.agents?.defaults?.skipBootstrap,
		skipOptionalBootstrapFiles: params.config.agents?.defaults?.skipOptionalBootstrapFiles
	});
	if (created.status === "error") throw new Error(created.message);
	const createdTeam = "coordinatorId" in created;
	const after = await readConfigFileSnapshot();
	if (!after.valid) throw new Error("Agent creation wrote an invalid OpenClaw config.");
	if (created.configHash && after.hash !== created.configHash) throw new Error("OpenClaw config changed after first-agent creation. Retry setup.");
	const config = mergeOnboardingCandidate({
		base: candidateBase,
		candidate: params.config,
		currentRuntime: after.config
	});
	const sessionMigrationWarnings = (await migrateLegacyMainSessionKeys({
		cfg: after.config,
		mode: "detect"
	})).warnings;
	return {
		config,
		configBase: after.config,
		agentId: createdTeam ? created.coordinatorId : created.agentId,
		bootstrapPending: createdTeam ? false : created.bootstrapPending,
		createdAgentIds: createdTeam ? created.agents.map((agent) => agent.agentId) : [created.agentId],
		createdAgent: created.status === "created",
		...created.configHash ? { configHash: created.configHash } : {},
		...sessionMigrationWarnings.length > 0 ? { sessionMigrationWarnings } : {}
	};
}
//#endregion
export { validateFirstOnboardingAgentName as n, ensureOnboardingAgent as t };
