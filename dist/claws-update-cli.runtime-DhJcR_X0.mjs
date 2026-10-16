import { t as assertExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import "./src-CdRlGRnW.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { C as tryResolveAmbientOwnerAgentId, d as resolveAgentWorkspaceDir, x as toAgentEntriesRecord } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { l as runOpenClawStateWriteTransaction, n as openExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-D1jWDzK3.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./legacy-Bu4WPgr_.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-DQmvZkAl.mjs";
import { o as resolveRememberAcrossConversations } from "./config-utils-DnfHy8-v.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { o as transformConfigFileWithRetry } from "./mutate-Br6nKTV_.mjs";
import "./config-CzeZu5J_.mjs";
import { n as callGatewayFromCli } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import { l as digestClawBytes, u as digestClawValue } from "./schema-portability-DPQGHUzw.mjs";
import { i as resolveMigrationAgentSettings, o as withAuthoredAgentRoster, r as normalizeWorkspaceConfig } from "./migrate-validation-DioFMXjJ.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-DGIfx80_.mjs";
import { n as resolveHeartbeatSummaryForAgent } from "./heartbeat-summary-DGkbnKda.mjs";
import { t as resolveMemorySearchSourcePolicy } from "./memory-search-source-policy-zikTNTRB.mjs";
import { d as resolveClawToolProfileSnapshot, n as readClawManifestFile, u as resolveClawProfileCapabilities } from "./reader-tis62fDs.mjs";
import { t as listConfiguredMcpServers } from "./mcp-config-Cv7bEPf1.mjs";
import { a as withClawMcpLifecycleLease, n as unsetConfiguredMcpServer, t as setConfiguredMcpServer } from "./mcp-config-mutation-CtCOP707.mjs";
import { E as upsertClawCronRef, S as deleteClawCronRef, T as readClawCronRefs, _ as CLAW_CRON_REF_SCHEMA_VERSION, b as clawCronGatewayJobMatchesRef, x as clawCronSchedulerJobFromResult, y as clawCronGatewayInput } from "./monitor-cleanup-contract-BKt7Vod1.mjs";
import { c as readClawMcpServerRefsByName, i as digestClawMcpServer, m as CLAW_OUTPUT_STABILITY, o as planClawMcpServerRemoval, r as deleteClawMcpServerRef, s as readClawMcpServerRefs, u as upsertClawMcpServerRef } from "./mcp-A-4-BIRV.mjs";
import "./lifecycle-state-D5IOOLG7.mjs";
import { t as CLAW_MCP_REF_SCHEMA_VERSION } from "./mcp-records-F-n78kde.mjs";
import { C as readClawInstallRecord, D as updateClawInstallRecord, N as preflightPluginInstall, O as updateClawInstallRecordStatus, T as readClawPackageRefs, c as readClawStatus, f as deleteClawWorkspaceFileRecord, g as upsertClawWorkspaceFile, h as readClawWorkspaceFiles, l as CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION, m as readClawWorkspaceActionSource } from "./package-remove-plan-BJkvcHDT.mjs";
import { c as toPackageRefExtensionSqlParams, o as CLAW_PACKAGE_REF_SCHEMA_VERSION } from "./provenance-read.kernel-B_3aRsEz.mjs";
import { a as logClawUpdatePlanSummary, i as logClawExperimentalWarning, n as formatClawDiagnostics, o as buildClawAddPlan, t as emitClawFailure } from "./claws-cli-output-wPhbKerb.mjs";
import { a as runClawPluginBatch, i as preflightClawPackage, r as installClawPackages, t as waitUntilGatewayAgentAvailable } from "./claws-cli.gateway-readiness-CTpqAkJ3.mjs";
import { t as resolvePluginBatchReload } from "./plugins-lifecycle-client-BZibQSaQ.mjs";
import { realpathSync } from "node:fs";
import { resolve, sep } from "node:path";
import { lstat } from "node:fs/promises";
//#region src/claws/application-provenance.ts
function isApplicationUpdateBlocker(entry) {
	return entry.code !== "workspace_collision" && entry.code !== "agent_id_collision" && !entry.path.startsWith("$.packages");
}
function clawPackageKey(value) {
	return `${value.kind}:${value.ref}`;
}
function recordingClawPackagePreflight(preflight, workspace, results, currentPackages) {
	return async (pkg) => {
		const result = preflight ? await preflight(pkg, workspace) : {
			ok: false,
			code: "package_install_unavailable",
			message: "Package preflight is unavailable."
		};
		const current = currentPackages.get(clawPackageKey(pkg));
		const normalized = !result.ok && pkg.kind === "plugin" && result.code === "plugin_version_conflict" && current?.state === "present" && current.origin === "claw-introduced" && !current.independentOwner && current.version !== pkg.version && result.installedVersion === current.version ? {
			...result,
			ok: true,
			action: "install"
		} : result;
		results.set(clawPackageKey(pkg), normalized);
		return normalized;
	};
}
function clawProfileExtensionPackages(profile) {
	return (profile?.extensions ?? []).map((extension) => ({
		kind: "plugin",
		source: extension.source,
		ref: extension.ref,
		version: extension.version
	}));
}
function clawTargetPackages(manifest, profile) {
	return new Map([...manifest.packages, ...clawProfileExtensionPackages(profile)].map((pkg) => [clawPackageKey(pkg), pkg]));
}
function clawWorkspaceActionsById(actions) {
	return new Map(actions.filter((action) => action.kind === "workspaceFile").map((action) => [action.id, action]));
}
function clawPackageActionsById(actions) {
	return new Map(actions.filter((action) => action.kind === "package").map((action) => [action.id, action]));
}
function clawExtensionProvenanceChanged(current, target) {
	return stableStringify(current ?? null) !== stableStringify(target?.details?.extension ?? null);
}
//#endregion
//#region src/claws/update-rollback.ts
async function collectClawRollbackFailures(steps) {
	const failures = [];
	for (const step of steps) {
		const rollback = typeof step === "function" ? step : step[1];
		try {
			await rollback();
		} catch (error) {
			const message = coerceErrorMessage(error);
			failures.push(typeof step === "function" ? message : `${step[0]}: ${message}`);
		}
	}
	return failures;
}
//#endregion
//#region src/claws/cron-update.ts
var ClawCronUpdateError = class extends Error {
	constructor(message, partial = false) {
		super(message);
		this.partial = partial;
		this.name = "ClawCronUpdateError";
	}
};
function targetRef(params) {
	return {
		schemaVersion: CLAW_CRON_REF_SCHEMA_VERSION,
		agentId: params.agentId,
		manifestId: params.job.id,
		declarationKey: `claw:${params.agentId}:${params.job.id}`,
		status: "pending",
		job: params.job,
		createdAtMs: params.previous?.createdAtMs ?? params.nowMs,
		updatedAtMs: params.nowMs
	};
}
async function applyClawCronUpdate(updatePlan, targetManifest, options) {
	const actions = updatePlan.actions.filter((action) => action.kind === "cronJob" && action.action !== "unchanged");
	if (actions.length === 0) return {
		appliedIds: [],
		rollback: async () => void 0
	};
	if (!options.cronGateway) throw new ClawCronUpdateError("Claw cron updates require the gateway cron API.");
	if (!options.cronGateway.get) throw new ClawCronUpdateError("Claw cron updates require the gateway cron.get API.");
	const gateway = options.cronGateway;
	const readRefs = options.readRefs ?? readClawCronRefs;
	const upsertRef = options.upsertRef ?? upsertClawCronRef;
	const deleteRef = options.deleteRef ?? deleteClawCronRef;
	const currentRefs = new Map(readRefs(updatePlan.agentId, options).map((ref) => [ref.manifestId, ref]));
	const targetJobs = new Map(targetManifest.cronJobs.map((job) => [job.id, job]));
	const undo = [];
	const appliedIds = [];
	const nowMs = options.nowMs ?? Date.now();
	let agentAvailable = false;
	const waitForAgent = async () => {
		if (!agentAvailable) {
			await gateway.waitUntilAgentAvailable?.(updatePlan.agentId);
			agentAvailable = true;
		}
	};
	const add = async (ref) => {
		await waitForAgent();
		let raw;
		try {
			raw = await gateway.add(clawCronGatewayInput(updatePlan.agentId, ref));
		} catch (error) {
			throw new ClawCronUpdateError(coerceErrorMessage(error), true);
		}
		const result = clawCronSchedulerJobFromResult(raw);
		if (!result) throw new ClawCronUpdateError("cron.add returned no scheduler job id.", true);
		return result.id;
	};
	const rollback = async () => {
		const failures = await collectClawRollbackFailures(undo.toReversed());
		if (failures.length > 0) throw new ClawCronUpdateError(failures.join("; "));
	};
	try {
		for (const action of actions) {
			const previous = currentRefs.get(action.id);
			if (previous && action.currentDigest && digestClawValue(previous.job) !== action.currentDigest) throw new ClawCronUpdateError(`Cron declaration ${JSON.stringify(action.id)} changed after planning.`);
			if (previous?.schedulerJobId) {
				const live = await gateway.get(previous.schedulerJobId);
				if (!clawCronGatewayJobMatchesRef(updatePlan.agentId, previous, live)) throw new ClawCronUpdateError(`Cron declaration ${JSON.stringify(action.id)} changed after planning.`);
			}
			if (action.action === "remove") {
				if (!previous?.schedulerJobId || previous.status !== "complete") throw new ClawCronUpdateError(`Cron declaration ${JSON.stringify(action.id)} is no longer safely removable.`);
				upsertRef({
					...previous,
					status: "pending",
					updatedAtMs: nowMs
				}, options);
				try {
					await gateway.remove(previous.schedulerJobId);
				} catch (error) {
					throw new ClawCronUpdateError(coerceErrorMessage(error), true);
				}
				undo.push(async () => {
					const restoredId = await add(previous);
					upsertRef({
						...previous,
						schedulerJobId: restoredId,
						updatedAtMs: nowMs
					}, options);
				});
				deleteRef(updatePlan.agentId, action.id, options);
				appliedIds.push(action.id);
				continue;
			}
			const job = targetJobs.get(action.id);
			if (!job) throw new ClawCronUpdateError(`Target cron declaration ${JSON.stringify(action.id)} is missing.`);
			await waitForAgent();
			const pending = targetRef({
				agentId: updatePlan.agentId,
				job,
				previous,
				nowMs
			});
			upsertRef(pending, options);
			const schedulerJobId = await add(pending);
			if (action.action === "change") {
				if (!previous?.schedulerJobId || schedulerJobId !== previous.schedulerJobId) {
					try {
						await gateway.remove(schedulerJobId);
						if (previous) upsertRef(previous, options);
					} catch (error) {
						throw new ClawCronUpdateError(`cron.add did not converge and cleanup failed: ${coerceErrorMessage(error)}`, true);
					}
					throw new ClawCronUpdateError(`cron.add did not converge declaration ${JSON.stringify(action.id)} on its owned scheduler job.`);
				}
				undo.push(async () => {
					const restoredId = await add(previous);
					upsertRef({
						...previous,
						schedulerJobId: restoredId,
						updatedAtMs: nowMs
					}, options);
				});
			} else undo.push(async () => {
				await gateway.remove(schedulerJobId);
				deleteRef(updatePlan.agentId, action.id, options);
			});
			upsertRef({
				...pending,
				schedulerJobId,
				status: "complete"
			}, options);
			appliedIds.push(action.id);
		}
	} catch (error) {
		try {
			await rollback();
		} catch (rollbackError) {
			throw new ClawCronUpdateError(`${coerceErrorMessage(error)}; rollback failed: ${coerceErrorMessage(rollbackError)}`, true);
		}
		throw new ClawCronUpdateError(coerceErrorMessage(error), error instanceof ClawCronUpdateError && error.partial);
	}
	return {
		appliedIds,
		rollback
	};
}
//#endregion
//#region src/claws/mcp-update.ts
var ClawMcpUpdateError = class extends Error {
	constructor(message, partial = false) {
		super(message);
		this.partial = partial;
		this.name = "ClawMcpUpdateError";
	}
};
async function applyClawMcpUpdate(updatePlan, targetManifest, options) {
	const actions = updatePlan.actions.filter((action) => action.kind === "mcpServer" && action.action !== "unchanged");
	if (actions.length === 0) return {
		appliedNames: [],
		rollback: async () => void 0
	};
	const setServer = options.setServer ?? setConfiguredMcpServer;
	const unsetServer = options.unsetServer ?? unsetConfiguredMcpServer;
	const readRefs = options.readRefs ?? readClawMcpServerRefs;
	const readRefsByName = options.readRefsByName ?? readClawMcpServerRefsByName;
	const planRemoval = options.planRemoval ?? planClawMcpServerRemoval;
	const upsertRef = options.upsertRef ?? upsertClawMcpServerRef;
	const deleteRef = options.deleteRef ?? deleteClawMcpServerRef;
	const currentServers = normalizeConfiguredMcpServers(options.sourceMcpServers);
	const undo = [];
	const appliedNames = [];
	const nowMs = options.nowMs ?? Date.now();
	let configMutationUncertain = false;
	const rollback = async () => {
		const failures = await collectClawRollbackFailures(undo.toReversed());
		if (failures.length > 0) throw new ClawMcpUpdateError(failures.join("; "));
	};
	try {
		for (const action of actions) await withClawMcpLifecycleLease(action.id, options, async () => {
			const name = action.id;
			const previousRef = readRefs(updatePlan.agentId, options).find((candidate) => candidate.name === name);
			const previousServer = currentServers[name];
			if (action.action === "add" && (previousServer || previousRef)) throw new ClawMcpUpdateError(`MCP server ${JSON.stringify(name)} appeared after planning and was not claimed.`);
			if (previousServer && !previousRef) throw new ClawMcpUpdateError(`MCP server ${JSON.stringify(name)} is not owned by this Claw.`);
			if (action.action === "release") {
				if (!previousRef) throw new ClawMcpUpdateError(`MCP reference ${JSON.stringify(name)} disappeared.`);
				if (previousServer !== void 0 && digestClawMcpServer(previousServer) === previousRef.configDigest && planRemoval(previousRef, options).action !== "release") throw new ClawMcpUpdateError(`MCP server ${JSON.stringify(name)} is no longer safely releasable.`);
				deleteRef(updatePlan.agentId, name, options);
				undo.push(async () => await withClawMcpLifecycleLease(name, options, async () => {
					upsertRef(previousRef, options);
				}));
				appliedNames.push(name);
				return;
			}
			if (action.action === "remove") {
				if (!previousServer || !previousRef) throw new ClawMcpUpdateError(`MCP server ${JSON.stringify(name)} disappeared.`);
				if (planRemoval(previousRef, options).action !== "remove") throw new ClawMcpUpdateError(`MCP server ${JSON.stringify(name)} gained another owner after planning.`);
				upsertRef({
					...previousRef,
					status: "pending",
					updatedAtMs: nowMs
				}, options);
				configMutationUncertain = true;
				const removed = await unsetServer({
					name,
					expectedServer: previousServer,
					recordIndependentOwner: false
				});
				configMutationUncertain = false;
				if (!removed.ok) {
					configMutationUncertain = true;
					upsertRef(previousRef, options);
					configMutationUncertain = false;
					throw new Error(removed.error);
				}
				undo.push(async () => await withClawMcpLifecycleLease(name, options, async () => {
					const restored = await setServer({
						name,
						server: previousServer,
						createOnly: true,
						recordIndependentOwner: false
					});
					if (!restored.ok) throw new Error(restored.error);
					upsertRef(previousRef, options);
				}));
				deleteRef(updatePlan.agentId, name, options);
				appliedNames.push(name);
				return;
			}
			const targetServer = targetManifest.mcpServers[name];
			if (!targetServer) throw new ClawMcpUpdateError(`Target MCP declaration ${JSON.stringify(name)} is missing.`);
			const targetRef = {
				schemaVersion: CLAW_MCP_REF_SCHEMA_VERSION,
				agentId: updatePlan.agentId,
				name,
				configDigest: digestClawMcpServer(targetServer),
				relationship: previousRef?.relationship ?? "managed",
				origin: previousRef?.origin ?? "claw-introduced",
				independentOwner: previousRef?.independentOwner ?? false,
				status: "pending",
				createdAtMs: previousRef?.createdAtMs ?? nowMs,
				updatedAtMs: nowMs
			};
			upsertRef(targetRef, options);
			configMutationUncertain = true;
			const written = await setServer({
				name,
				server: targetServer,
				...previousServer ? { expectedServer: previousServer } : { createOnly: true },
				recordIndependentOwner: false
			});
			configMutationUncertain = false;
			if (!written.ok) {
				configMutationUncertain = true;
				if (previousRef) upsertRef(previousRef, options);
				else deleteRef(updatePlan.agentId, name, options);
				configMutationUncertain = false;
				throw new Error(written.error);
			}
			undo.push(async () => await withClawMcpLifecycleLease(name, options, async () => {
				const currentRefs = readRefsByName(name, options);
				const currentOwnRef = currentRefs.find((candidate) => candidate.agentId === updatePlan.agentId);
				if (currentRefs.filter((candidate) => candidate.agentId !== updatePlan.agentId).length > 0 || currentOwnRef?.independentOwner && !targetRef.independentOwner) throw new Error(`MCP server ${JSON.stringify(name)} gained another owner during rollback; current configuration was retained.`);
				if (previousServer && previousRef) {
					const restored = await setServer({
						name,
						server: previousServer,
						expectedServer: targetServer,
						recordIndependentOwner: false
					});
					if (!restored.ok) throw new Error(restored.error);
					upsertRef(previousRef, options);
				} else {
					const removed = await unsetServer({
						name,
						expectedServer: targetServer,
						recordIndependentOwner: false
					});
					if (!removed.ok) throw new Error(removed.error);
					deleteRef(updatePlan.agentId, name, options);
				}
			}));
			upsertRef({
				...targetRef,
				status: "complete"
			}, options);
			appliedNames.push(name);
		});
	} catch (error) {
		try {
			await rollback();
		} catch (rollbackError) {
			throw new ClawMcpUpdateError(`${coerceErrorMessage(error)}; rollback failed: ${coerceErrorMessage(rollbackError)}`, true);
		}
		throw new ClawMcpUpdateError(coerceErrorMessage(error), configMutationUncertain || error instanceof ClawMcpUpdateError && error.partial);
	}
	return {
		appliedNames,
		rollback
	};
}
//#endregion
//#region src/claws/package-update-provenance.ts
function digestClawPackageRef(ref) {
	const persisted = {
		schemaVersion: ref.schemaVersion,
		agentId: ref.agentId,
		clawName: ref.clawName,
		kind: ref.kind,
		source: ref.source,
		ref: ref.ref,
		version: ref.version,
		integrity: ref.integrity,
		status: ref.status,
		relationship: ref.relationship,
		origin: ref.origin,
		independentOwner: ref.independentOwner,
		...ref.extension ? { extension: ref.extension } : {},
		installedAtMs: ref.installedAtMs,
		updatedAtMs: ref.updatedAtMs
	};
	return digestClawValue(persisted);
}
function replaceClawPackageRefExpected(expected, replacement, options = {}) {
	const identity = expected ?? replacement;
	if (!identity) throw new Error("Package reference replacement requires an identity.");
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		if (expected) {
			const extension = toPackageRefExtensionSqlParams(expected.extension);
			if (executeSqliteQuerySync(db, kysely.deleteFrom("claw_package_refs").where((eb) => eb.and({
				agent_id: expected.agentId,
				package_kind: expected.kind,
				package_source: expected.source,
				package_ref: expected.ref,
				package_version: expected.version,
				package_integrity: expected.integrity,
				schema_version: expected.schemaVersion,
				claw_name: expected.clawName,
				package_status: expected.status,
				relationship: expected.relationship,
				origin: expected.origin,
				independent_owner: expected.independentOwner ? 1 : 0,
				installed_at_ms: expected.installedAtMs,
				updated_at_ms: expected.updatedAtMs
			})).where("extension_id", "is", extension.extension_id).where("extension_format", "is", extension.extension_format).where("extension_detected_format", "is", extension.extension_detected_format).where("extension_mapped_json", "is", extension.extension_mapped_json).where("extension_unavailable_json", "is", extension.extension_unavailable_json).where("extension_adapter_identity", "is", extension.extension_adapter_identity)).numAffectedRows !== 1n) throw new Error(`Package reference ${JSON.stringify(`${expected.kind}:${expected.ref}`)} changed after planning.`);
		} else if (executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("claw_package_refs").select((eb) => eb.val(1).as("occupied")).where("agent_id", "=", identity.agentId).where("package_kind", "=", identity.kind).where("package_source", "=", identity.source).where("package_ref", "=", identity.ref).limit(1))) throw new Error(`Package reference ${JSON.stringify(`${identity.kind}:${identity.ref}`)} appeared after planning.`);
		if (replacement) executeSqliteQuerySync(db, kysely.insertInto("claw_package_refs").values({
			agent_id: replacement.agentId,
			package_kind: replacement.kind,
			package_source: replacement.source,
			package_ref: replacement.ref,
			package_version: replacement.version,
			package_integrity: replacement.integrity,
			schema_version: replacement.schemaVersion,
			claw_name: replacement.clawName,
			package_status: replacement.status,
			relationship: replacement.relationship,
			origin: replacement.origin,
			independent_owner: replacement.independentOwner ? 1 : 0,
			...toPackageRefExtensionSqlParams(replacement.extension),
			installed_at_ms: replacement.installedAtMs,
			updated_at_ms: replacement.updatedAtMs
		}));
	}, options);
}
//#endregion
//#region src/claws/package-update.ts
var ClawPackageUpdateError = class extends Error {
	constructor(message, partial, options) {
		super(message, options);
		this.partial = partial;
		this.name = "ClawPackageUpdateError";
	}
};
async function applyClawPackageUpdate(updatePlan, targetAddPlan, options) {
	const actions = updatePlan.actions.filter((action) => action.kind === "package" && action.action !== "unchanged");
	if (actions.length === 0) return {
		appliedIds: [],
		rollback: async () => void 0
	};
	const installPackages = options.installPackages ?? installClawPackages;
	const readRefs = options.readRefs ?? readClawPackageRefs;
	const replaceExpected = options.replaceExpected ?? replaceClawPackageRefExpected;
	const currentRefs = new Map(readRefs({
		...options,
		agentId: updatePlan.agentId
	}).map((ref) => [clawPackageKey(ref), ref]));
	const allRefs = readRefs(options);
	const undo = [];
	const externalMutations = [];
	const appliedIds = [];
	const rollback = async () => {
		const failures = await collectClawRollbackFailures(undo.toReversed());
		if (externalMutations.length > 0) failures.push(`package artifacts may have been retained: ${externalMutations.join(", ")}`);
		if (failures.length > 0) throw new ClawPackageUpdateError(failures.join("; "), externalMutations.length > 0);
	};
	try {
		for (const action of actions) {
			const previous = currentRefs.get(action.id);
			if (previous && action.currentDigest && digestClawPackageRef(previous) !== action.currentDigest) throw new ClawPackageUpdateError(`Package reference ${JSON.stringify(action.id)} changed after planning.`, false);
			if (action.action === "release" || action.action === "remove") {
				if (!previous) throw new ClawPackageUpdateError(`Package reference ${JSON.stringify(action.id)} disappeared.`, false);
				replaceExpected(previous, void 0, options);
				undo.push(async () => replaceExpected(void 0, previous, options));
				appliedIds.push(action.id);
				continue;
			}
			const targetAction = targetAddPlan.actions.find((candidate) => candidate.kind === "package" && candidate.id === action.id);
			const target = targetAction?.details;
			if (!targetAction || target?.kind !== "skill" && target?.kind !== "plugin" || target.source !== "clawhub" || !target.ref || !target.version) throw new ClawPackageUpdateError(`Target package action ${JSON.stringify(action.id)} is missing.`, false);
			const targetIntegrity = target.integrity;
			if (typeof targetIntegrity !== "string") throw new ClawPackageUpdateError(`Target package action ${JSON.stringify(action.id)} has no resolved integrity.`, false);
			if (target.kind === "plugin" && allRefs.some((ref) => ref.agentId !== updatePlan.agentId && ref.kind === "plugin" && ref.source === target.source && ref.ref === target.ref && ref.version !== target.version)) throw new ClawPackageUpdateError(`Plugin ${JSON.stringify(target.ref)} has another Claw owner pinned to a different version.`, false);
			const nowMs = options.nowMs ?? Date.now();
			const reusesExistingArtifact = target.ownerAction === "reuse";
			const preservesExistingEdge = reusesExistingArtifact && previous?.version === target.version && previous.integrity === targetIntegrity;
			let claimed = {
				schemaVersion: CLAW_PACKAGE_REF_SCHEMA_VERSION,
				agentId: updatePlan.agentId,
				clawName: targetAddPlan.claw.name,
				kind: target.kind,
				source: target.source,
				ref: target.ref,
				version: target.version,
				integrity: targetIntegrity,
				status: "pending",
				relationship: preservesExistingEdge && previous ? previous.relationship : target.kind === "skill" ? "managed" : "referenced",
				origin: preservesExistingEdge && previous ? previous.origin : reusesExistingArtifact ? "pre-existing" : "claw-introduced",
				independentOwner: preservesExistingEdge && previous ? previous.independentOwner : reusesExistingArtifact,
				...target.extension ? { extension: target.extension } : {},
				installedAtMs: preservesExistingEdge && previous ? previous.installedAtMs : nowMs,
				updatedAtMs: nowMs
			};
			replaceExpected(previous, claimed, options);
			undo.push(async () => replaceExpected(claimed, previous, options));
			const installed = (await installPackages({
				...targetAddPlan,
				actions: [targetAction]
			}, {
				...options,
				pluginInstallMode: action.action === "change" ? "update" : "install",
				deps: {
					...options.packageDeps,
					preflightPlugin: async (params) => {
						const preflight = await (options.packageDeps?.preflightPlugin ?? preflightPluginInstall)(params);
						const conflictingOwner = readRefs(options).some((ref) => ref.agentId !== updatePlan.agentId && ref.kind === "plugin" && ref.source === target.source && ref.ref === target.ref && ref.version !== target.version);
						return !preflight.ok && preflight.code === "plugin_version_conflict" && !conflictingOwner && previous?.origin === "claw-introduced" && !previous.independentOwner && previous.version === preflight.installedVersion && target.version === preflight.expectedVersion ? {
							ok: true,
							action: "install",
							request: preflight.request
						} : preflight;
					},
					persistPackageRef: (_plan, _pkg, persistOptions) => {
						const next = {
							...claimed,
							status: persistOptions?.status ?? "complete",
							relationship: preservesExistingEdge ? claimed.relationship : persistOptions?.relationship ?? claimed.relationship,
							origin: preservesExistingEdge ? claimed.origin : persistOptions?.origin ?? claimed.origin,
							independentOwner: preservesExistingEdge ? claimed.independentOwner : persistOptions?.independentOwner ?? claimed.independentOwner,
							updatedAtMs: nowMs
						};
						replaceExpected(claimed, next, options);
						claimed = next;
						return next;
					},
					completePackageRef: (ref, status) => {
						const next = {
							...ref,
							status,
							updatedAtMs: nowMs
						};
						replaceExpected(claimed, next, options);
						claimed = next;
						return next;
					}
				},
				onExternalMutation: () => {
					externalMutations.push(`${target.kind}:${target.ref}@${target.version}`);
				}
			})).find((ref) => clawPackageKey(ref) === action.id && ref.version === target.version);
			if (!installed) throw new ClawPackageUpdateError(`Package installer did not return exact ownership for ${JSON.stringify(action.id)}.`, true);
			if (digestClawValue(installed) !== digestClawValue(claimed)) {
				replaceExpected(claimed, installed, options);
				claimed = installed;
			}
			appliedIds.push(action.id);
		}
	} catch (error) {
		if (externalMutations.length > 0) throw new ClawPackageUpdateError(`${coerceErrorMessage(error)}; package artifact outcome requires reconciliation`, true, { cause: error });
		try {
			await rollback();
		} catch (rollbackError) {
			throw new ClawPackageUpdateError(`${coerceErrorMessage(error)}; rollback incomplete: ${coerceErrorMessage(rollbackError)}`, externalMutations.length > 0, { cause: new AggregateError([error, rollbackError]) });
		}
		throw new ClawPackageUpdateError(coerceErrorMessage(error), error instanceof ClawPackageUpdateError ? error.partial : false, { cause: error });
	}
	return {
		appliedIds,
		rollback
	};
}
//#endregion
//#region src/claws/update-capability-changes.ts
function capabilityValue(summary, digestSource = summary) {
	return {
		summary,
		digest: digestClawValue(digestSource)
	};
}
function getPath(value, path) {
	let current = value;
	for (const segment of path) {
		if (!current || typeof current !== "object" || !Object.hasOwn(current, segment)) return;
		current = current[segment];
	}
	return current;
}
function summarizeAgentCapability(value) {
	return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : stableStringify(value);
}
function compareRankedCapability(current, desired, rank) {
	const currentRank = typeof current === "string" ? rank[current] ?? 0 : 0;
	const desiredRank = typeof desired === "string" ? rank[desired] ?? 0 : 0;
	return desiredRank > currentRank ? "escalation" : desiredRank < currentRank ? "reduction" : "neutral";
}
function classifyToolSet(current, desired) {
	const currentTools = new Set(current.filter((value) => typeof value === "string"));
	const desiredTools = new Set(desired.filter((value) => typeof value === "string"));
	if (currentTools.has("*") !== desiredTools.has("*")) return desiredTools.has("*") ? "escalation" : "reduction";
	if (desiredTools.has("*")) return "neutral";
	if ([...desiredTools].some((tool) => !currentTools.has(tool))) return "escalation";
	return [...currentTools].some((tool) => !desiredTools.has(tool)) ? "reduction" : "neutral";
}
function classifyHeartbeatEvery(current, desired) {
	const toInterval = (value) => {
		if (value === "disabled") return 0;
		if (typeof value !== "string") return;
		try {
			return Math.max(0, parseDurationMs(value, { defaultUnit: "m" }));
		} catch {
			return;
		}
	};
	const currentMs = toInterval(current);
	const desiredMs = toInterval(desired);
	if (currentMs === void 0 || desiredMs === void 0 || currentMs === desiredMs) return "neutral";
	if (currentMs === 0) return "escalation";
	if (desiredMs === 0) return "reduction";
	return desiredMs < currentMs ? "escalation" : "reduction";
}
function classifyAgentCapability(path, current, desired, currentAgentExists) {
	if (path === "subagents.allowAgents") {
		if (!Array.isArray(current) || !Array.isArray(desired)) return "escalation";
		return desired.some((target) => !current.includes(target)) ? "escalation" : "reduction";
	}
	if (path === "tools.profile" || path === "tools.allow" || path === "tools.deny") {
		if (!currentAgentExists && desired !== void 0) return "escalation";
		if (desired === void 0) return "escalation";
		if (current === void 0) return "reduction";
	}
	if (path === "tools.alsoAllow") {
		if (!currentAgentExists && desired !== void 0) return "escalation";
		if (desired === void 0) return "reduction";
		if (current === void 0) return "escalation";
	}
	if (desired === void 0) return "reduction";
	if (current === void 0) return "escalation";
	if (path === "sandbox.workspaceAccess") return compareRankedCapability(current, desired, {
		none: 0,
		ro: 1,
		rw: 2
	});
	if (path === "sandbox.mode") return compareRankedCapability(current, desired, {
		all: 0,
		"non-main": 1,
		off: 2
	});
	if (path === "sandbox.scope") return compareRankedCapability(current, desired, {
		session: 0,
		agent: 1,
		shared: 2
	});
	if (path === "heartbeat.every") return classifyHeartbeatEvery(current, desired);
	if (path === "heartbeat.isolatedSession") return desired === true ? "reduction" : "escalation";
	if (path === "heartbeat.timeoutSeconds") return typeof current === "number" && typeof desired === "number" && desired < current ? "reduction" : "escalation";
	if (path === "tools.fs.workspaceOnly") return desired === true ? "reduction" : "escalation";
	if (path === "memory.search.enabled") return desired === false ? "reduction" : "escalation";
	if (path === "memory.search.rememberAcrossConversations") return desired === true ? "escalation" : "reduction";
	if (path === "memory.search.sources") {
		if (!Array.isArray(current) || !Array.isArray(desired)) return "escalation";
		const currentSources = new Set(current);
		return desired.some((source) => !currentSources.has(source)) ? "escalation" : "reduction";
	}
	if (path === "tools.deny") {
		if (!Array.isArray(current) || !Array.isArray(desired)) return "escalation";
		const desiredTools = new Set(desired.filter((value) => typeof value === "string"));
		if (current.some((value) => typeof value === "string" && !desiredTools.has(value))) return "escalation";
		const currentTools = new Set(current.filter((value) => typeof value === "string"));
		return desired.some((value) => typeof value === "string" && !currentTools.has(value)) ? "reduction" : "neutral";
	}
	if ((path === "tools.profile" || path === "tools.allow" || path === "tools.alsoAllow") && Array.isArray(current) && Array.isArray(desired)) return classifyToolSet(current, desired);
	return path.startsWith("sandbox.") || path.startsWith("tools.") || path.startsWith("heartbeat.") || path.startsWith("subagents.") || path.startsWith("memory.search.") ? "escalation" : "neutral";
}
function pushAgentCapabilityChanges(params) {
	for (const field of [
		["model"],
		["subagents", "allowAgents"],
		["subagents", "delegationMode"],
		["sandbox", "mode"],
		["sandbox", "scope"],
		["sandbox", "workspaceAccess"],
		["tools", "profile"],
		["tools", "allow"],
		["tools", "alsoAllow"],
		["tools", "deny"],
		[
			"tools",
			"fs",
			"workspaceOnly"
		],
		[
			"memory",
			"search",
			"enabled"
		],
		[
			"memory",
			"search",
			"rememberAcrossConversations"
		],
		[
			"memory",
			"search",
			"sources"
		],
		["heartbeat", "every"],
		["heartbeat", "activeHours"],
		["heartbeat", "isolatedSession"],
		["heartbeat", "timeoutSeconds"]
	]) {
		const [currentRoot, desiredRoot, offset] = field[0] === "sandbox" ? [
			params.currentSandbox,
			params.desiredSandbox,
			1
		] : field[0] === "heartbeat" ? [
			params.currentHeartbeat,
			params.desiredHeartbeat,
			1
		] : field[0] === "memory" && field[1] === "search" ? [
			params.currentMemorySearch,
			params.desiredMemorySearch,
			2
		] : field[0] === "tools" && (field[1] === "profile" || field[1] === "alsoAllow" || field[1] === "fs") ? [
			params.currentTools,
			params.desiredTools,
			1
		] : [
			params.currentAgent,
			params.desiredAgent,
			0
		];
		const valuePath = field.slice(offset);
		const currentValue = getPath(currentRoot, valuePath);
		const desiredValue = getPath(desiredRoot, valuePath);
		const profileField = field[0] === "tools" && field[1] === "profile";
		const current = profileField ? resolveClawProfileCapabilities(currentValue) : currentValue;
		const desired = profileField ? resolveClawProfileCapabilities(desiredValue) : desiredValue;
		if (stableStringify(current) === stableStringify(desired)) continue;
		const path = field.join(".");
		const classification = classifyAgentCapability(path, current, desired, params.currentAgent !== void 0);
		params.changes.push({
			kind: "agent",
			id: params.agentId,
			path: `agent.${path}`,
			action: "change",
			classification,
			requiresDistinctConsent: classification === "escalation",
			reason: `Agent capability field ${path} changes in the target manifest.`,
			effect: profileField ? {
				path,
				current: currentValue,
				desired: desiredValue,
				currentCapabilities: current,
				desiredCapabilities: desired
			} : {
				path,
				current,
				desired
			},
			...currentValue === void 0 ? {} : { current: capabilityValue(summarizeAgentCapability(currentValue), profileField ? {
				value: currentValue,
				resolvedCapabilities: current
			} : current) },
			...desiredValue === void 0 ? {} : { desired: capabilityValue(summarizeAgentCapability(desiredValue), profileField ? {
				value: desiredValue,
				resolvedCapabilities: desired
			} : desired) }
		});
	}
}
function normalizeLegacyAgent(config, currentAgent, desiredAgent) {
	const tools = currentAgent.tools;
	if (!tools?.profile || desiredAgent.tools?.profile !== "full" || !desiredAgent.tools.allow) return currentAgent;
	const snapshot = resolveClawToolProfileSnapshot({
		...tools,
		alsoAllow: resolvePortableTools(config, currentAgent.id).alsoAllow
	});
	if (!snapshot) return currentAgent;
	const { profile: _profile, allow: _allow, alsoAllow: _alsoAllow, deny: _deny, ...otherTools } = tools;
	return {
		...currentAgent,
		tools: {
			...otherTools,
			profile: "full",
			...snapshot.allow.length > 0 ? { allow: snapshot.allow } : {},
			...snapshot.deny.length > 0 ? { deny: snapshot.deny } : {}
		}
	};
}
function resolveHeartbeat(config, agentId) {
	const defaults = config.agents?.defaults?.heartbeat;
	const overrides = listAgentEntries(config).find((agent) => agent.id === agentId)?.heartbeat;
	return {
		...defaults,
		...overrides,
		every: resolveHeartbeatSummaryForAgent(config, agentId).every
	};
}
function resolvePortableTools(config, agentId) {
	const globalTools = config.tools;
	const agentTools = listAgentEntries(config).find((agent) => agent.id === agentId)?.tools;
	return {
		profile: agentTools?.profile ?? globalTools?.profile,
		alsoAllow: agentTools?.alsoAllow ?? globalTools?.alsoAllow,
		fs: { workspaceOnly: agentTools?.fs?.workspaceOnly ?? globalTools?.fs?.workspaceOnly ?? false }
	};
}
function resolvePortableMemorySearch(config, agentId) {
	const defaults = config.memory?.search;
	const overrides = listAgentEntries(config).find((agent) => agent.id === agentId)?.memory?.search;
	const enabled = overrides?.enabled ?? defaults?.enabled ?? true;
	const rememberAcrossConversations = resolveRememberAcrossConversations(config, agentId);
	const { sources } = resolveMemorySearchSourcePolicy({
		configuredSources: overrides?.sources ?? defaults?.sources,
		rememberAcrossConversations,
		configuredSessionMemory: overrides?.experimental?.sessionMemory ?? defaults?.experimental?.sessionMemory ?? false
	});
	return {
		enabled,
		rememberAcrossConversations,
		sources: sources.toSorted()
	};
}
function prepareCapabilityComparisonConfig(config, entries, preferredDefaultAgentId) {
	const agents = config.agents ?? {};
	const systemAgentId = agents.ownership !== "explicit" && entries.some((entry) => entry.id === preferredDefaultAgentId) ? tryResolveAmbientOwnerAgentId(config) ?? preferredDefaultAgentId : void 0;
	return {
		...config,
		agents: {
			...agents,
			ownership: entries.length > 1 ? "explicit" : agents.ownership,
			entries: toAgentEntriesRecord(entries),
			defaults: systemAgentId ? {
				...agents.defaults,
				systemAgent: {
					...agents.defaults?.systemAgent,
					agentId: systemAgentId
				}
			} : agents.defaults
		}
	};
}
function pushResolvedAgentCapabilityChanges(params) {
	const currentAgents = listAgentEntries(params.config);
	const currentIndex = currentAgents.findIndex((agent) => agent.id === params.agentId);
	const existingCurrentAgent = currentIndex === -1 ? void 0 : currentAgents[currentIndex];
	const currentAgent = existingCurrentAgent ? normalizeLegacyAgent(params.config, existingCurrentAgent, params.desiredAgent) : void 0;
	const comparisonAgents = [...currentAgents];
	if (currentAgent && currentIndex !== -1) comparisonAgents[currentIndex] = currentAgent;
	const desiredAgents = [...currentAgents];
	if (currentIndex === -1) desiredAgents.push(params.desiredAgent);
	else desiredAgents[currentIndex] = params.desiredAgent;
	const currentConfig = prepareCapabilityComparisonConfig(params.config, comparisonAgents, params.agentId);
	const desiredConfig = prepareCapabilityComparisonConfig(params.config, desiredAgents, params.agentId);
	pushAgentCapabilityChanges({
		changes: params.changes,
		agentId: params.agentId,
		currentAgent,
		desiredAgent: params.desiredAgent,
		currentSandbox: currentAgent ? resolveSandboxConfigForAgent(currentConfig, params.agentId) : void 0,
		desiredSandbox: resolveSandboxConfigForAgent(desiredConfig, params.agentId),
		currentHeartbeat: currentAgent ? resolveHeartbeat(currentConfig, params.agentId) : void 0,
		desiredHeartbeat: resolveHeartbeat(desiredConfig, params.agentId),
		currentMemorySearch: currentAgent ? resolvePortableMemorySearch(params.config, params.agentId) : void 0,
		desiredMemorySearch: resolvePortableMemorySearch(desiredConfig, params.agentId),
		currentTools: currentAgent ? resolvePortableTools(currentConfig, params.agentId) : void 0,
		desiredTools: resolvePortableTools(desiredConfig, params.agentId)
	});
}
function packageCapabilityChange(params) {
	if (params.pkg.kind !== "plugin" || params.action === "unchanged") return;
	const reduction = params.desiredVersion === void 0;
	return {
		kind: "package",
		id: `plugin:${params.pkg.ref}`,
		path: `packages.plugin.${params.pkg.ref}`,
		action: params.action,
		classification: reduction ? "reduction" : "escalation",
		requiresDistinctConsent: !reduction,
		reason: reduction ? "Target manifest removes or releases plugin executable code." : "Target manifest adds or changes plugin executable code.",
		effect: {
			kind: params.pkg.kind,
			ref: params.pkg.ref,
			...params.desiredVersion ? { version: params.desiredVersion } : {},
			...params.integrity ? { integrity: params.integrity } : {},
			...params.installId ? { installId: params.installId } : {},
			...params.riskWarning ? { riskWarning: params.riskWarning } : {},
			...params.desiredExtension ? { extension: params.desiredExtension } : {}
		},
		...params.currentVersion ? { current: capabilityValue(`version ${params.currentVersion}${params.currentExtension ? "; extension mapping recorded" : ""}`, {
			version: params.currentVersion,
			extension: params.currentExtension
		}) } : {},
		...params.desiredVersion ? { desired: capabilityValue(`version ${params.desiredVersion}${params.desiredExtension ? "; extension mapping updated" : ""}`, {
			version: params.desiredVersion,
			extension: params.desiredExtension
		}) } : {}
	};
}
function summarizeMcpCapability(server) {
	if (!server || typeof server !== "object") return "not configured";
	const value = server;
	const summary = [];
	if (typeof value.command === "string") summary.push(`local process (${Array.isArray(value.args) ? value.args.length : 0} args)`);
	else if (typeof value.url === "string") summary.push("remote server");
	else summary.push("configured server");
	if (value.auth !== void 0) summary.push("auth configured");
	if (value.toolFilter !== void 0) summary.push("tool filter configured");
	if (value.env && typeof value.env === "object") summary.push(`${Object.keys(value.env).length} env entries`);
	return summary.join("; ");
}
function summarizeMcpCapabilityEffect(server) {
	if (!server || typeof server !== "object") return { configured: false };
	const value = server;
	return {
		connection: typeof value.command === "string" ? "local-process" : typeof value.url === "string" ? "remote-server" : "configured-server",
		...typeof value.transport === "string" ? { transport: value.transport } : {},
		...typeof value.command === "string" ? {
			commandConfigured: true,
			argumentCount: Array.isArray(value.args) ? value.args.length : 0
		} : {},
		...value.auth !== void 0 ? { authConfigured: true } : {},
		...value.toolFilter !== void 0 ? { toolFilterConfigured: true } : {},
		...value.env && typeof value.env === "object" ? { envEntryCount: Object.keys(value.env).length } : {}
	};
}
function summarizeCronCapability(cron) {
	if (!cron || typeof cron !== "object") return "not configured";
	const value = cron;
	const schedule = value.schedule;
	return `schedule ${schedule ? Object.keys(schedule).find((key) => key !== "timezone") ?? "configured" : "configured"}; session ${typeof value.session === "string" ? value.session : "default"}; payload withheld`;
}
function summarizeCronCapabilityEffect(cron) {
	if (!cron || typeof cron !== "object") return { configured: false };
	const value = cron;
	const schedule = value.schedule;
	return {
		schedule: schedule && typeof schedule === "object" ? Object.keys(schedule).find((key) => key !== "timezone") ?? "configured" : "configured",
		timezoneConfigured: typeof schedule?.timezone === "string",
		session: typeof value.session === "string" ? value.session : "default",
		deliveryConfigured: value.delivery !== void 0,
		payloadWithheld: true
	};
}
function resourceCapabilityChange(params) {
	if (params.action === "unchanged") return;
	const isMcp = params.kind === "mcpServer";
	const summarize = isMcp ? summarizeMcpCapability : summarizeCronCapability;
	const reduction = params.desired === void 0;
	return {
		kind: params.kind,
		id: params.id,
		path: `${isMcp ? "mcpServers" : "cronJobs"}.${params.id}`,
		action: params.action,
		classification: reduction ? "reduction" : "escalation",
		requiresDistinctConsent: !reduction,
		reason: isMcp ? reduction ? "Target manifest removes or releases an MCP tool surface." : "Target manifest adds, restores, or changes an MCP tool surface." : reduction ? "Target manifest removes a scheduled automation." : "Target manifest adds, restores, or changes a scheduled automation.",
		effect: params.desired === void 0 ? { removed: true } : isMcp ? summarizeMcpCapabilityEffect(params.desired) : summarizeCronCapabilityEffect(params.desired),
		...params.current === void 0 ? {} : { current: capabilityValue(summarize(params.current), params.current) },
		...params.desired === void 0 ? {} : { desired: capabilityValue(summarize(params.desired), params.desired) }
	};
}
//#endregion
//#region src/claws/update-plan-summary.ts
function summarizeClawUpdatePlan(actions, capabilityChanges) {
	return {
		totalActions: actions.length,
		added: actions.filter((action) => action.action === "add").length,
		changed: actions.filter((action) => action.action === "change").length,
		removed: actions.filter((action) => action.action === "remove").length,
		released: actions.filter((action) => action.action === "release").length,
		unchanged: actions.filter((action) => action.action === "unchanged").length,
		manual: actions.filter((action) => action.action === "manual").length,
		blocked: actions.filter((action) => action.blocked).length,
		capabilityChanges: capabilityChanges.length,
		capabilityEscalations: capabilityChanges.filter((change) => change.requiresDistinctConsent).length
	};
}
//#endregion
//#region src/claws/update-plan-types.ts
const CLAW_UPDATE_PLAN_SCHEMA_VERSION = "openclaw.clawUpdatePlan.v1";
//#endregion
//#region src/claws/update-plan-empty.ts
function makeEmptyClawUpdatePlan(params) {
	const plan = {
		schemaVersion: CLAW_UPDATE_PLAN_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		dryRun: true,
		mutationAllowed: false,
		found: params.found ?? false,
		agentId: params.agentId,
		...params.currentClaw ? { currentClaw: params.currentClaw } : {},
		...params.source ? { targetClaw: {
			name: params.source.name,
			version: params.source.version,
			integrity: params.source.integrity
		} } : {},
		summary: summarizeClawUpdatePlan([], []),
		actions: [],
		capabilityChanges: [],
		readiness: {
			ready: true,
			requirements: []
		},
		blockers: params.blockers,
		diagnostics: params.diagnostics ?? []
	};
	return {
		...plan,
		planIntegrity: digestClawValue(plan)
	};
}
//#endregion
//#region src/claws/update-plan.ts
function diagnostic(code, path, message) {
	return {
		level: "error",
		code,
		phase: "plan",
		path,
		message
	};
}
function manualState(state) {
	return state === "modified" || state === "unsafe" || state === "pending" || state === "failed";
}
async function buildClawUpdatePlan(params) {
	const notFound = () => makeEmptyClawUpdatePlan({
		agentId: params.agentId,
		source: params.targetSource,
		blockers: [diagnostic("claw_not_found", "$", `No installed Claw agent matches ${JSON.stringify(params.agentId)}.`)],
		diagnostics: params.diagnostics
	});
	const ownsDatabase = !params.stateOptions?.database;
	const database = params.stateOptions?.database ?? await openExistingOpenClawStateDatabaseReadOnly({
		...params.stateOptions,
		requireCanonicalSchema: true
	});
	if (!database) return notFound();
	const readOnlyStateOptions = {
		...params.stateOptions,
		database,
		readOnly: true
	};
	try {
		const status = await readClawStatus(params.agentId, {
			...readOnlyStateOptions,
			config: params.config,
			sourceMcpServers: params.sourceMcpServers,
			...params.packagePreflight ? { packagePreflight: params.packagePreflight } : {}
		});
		if (status.records.length === 0) return notFound();
		if (status.records.length > 1) return makeEmptyClawUpdatePlan({
			agentId: params.agentId,
			source: params.targetSource,
			found: true,
			blockers: [diagnostic("claw_ambiguous", "$", `Claw name ${JSON.stringify(params.agentId)} matches multiple agents; use an agent id.`)],
			diagnostics: params.diagnostics
		});
		const record = status.records[0];
		const agentId = record.install.agentId;
		if (record.install.claw.name !== params.targetSource.name) return makeEmptyClawUpdatePlan({
			agentId,
			source: params.targetSource,
			found: true,
			currentClaw: {
				name: record.install.claw.name,
				version: record.install.claw.version,
				integrity: record.install.claw.integrity
			},
			blockers: [diagnostic("claw_identity_mismatch", "$.name", `Target package ${JSON.stringify(params.targetSource.name)} does not match installed Claw ${JSON.stringify(record.install.claw.name)}.`)],
			diagnostics: params.diagnostics
		});
		const packagePreflights = /* @__PURE__ */ new Map();
		const currentPackages = new Map(record.packages.map((pkg) => [clawPackageKey(pkg), pkg]));
		const targetPlan = await buildClawAddPlan({
			manifest: params.targetManifest,
			clawMarkdownBody: params.targetClawMarkdownBody,
			includePackageBootstrap: false,
			openClawProfile: params.targetOpenClawProfile,
			source: params.targetSource,
			diagnostics: params.diagnostics,
			context: {
				config: params.config,
				existingAgentIds: listAgentIds(params.config).filter((id) => id !== agentId),
				agentId,
				workspace: record.install.workspace,
				packagePreflight: recordingClawPackagePreflight(params.packagePreflight, record.install.workspace, packagePreflights, currentPackages)
			}
		});
		const blockers = targetPlan.blockers.filter(isApplicationUpdateBlocker);
		const actions = [];
		const capabilityChanges = [];
		let desiredAgentDigest = digestClawValue(targetPlan.agent.config);
		let adoptedSettingsUnsupported = false;
		if (record.install.agentOrigin === "adopted") try {
			desiredAgentDigest = digestClawValue(normalizeWorkspaceConfig(resolveMigrationAgentSettings(params.config, targetPlan.agent.config), record.install.workspace));
		} catch {
			adoptedSettingsUnsupported = true;
		}
		const agentAction = record.agentState === "modified" || adoptedSettingsUnsupported ? "manual" : record.agentState === "missing" ? "change" : record.install.agentConfigDigest === desiredAgentDigest ? "unchanged" : "change";
		actions.push({
			kind: "agent",
			id: agentId,
			action: agentAction,
			target: `agents.entries[${JSON.stringify(agentId)}]`,
			blocked: agentAction === "manual",
			reason: agentAction === "manual" ? adoptedSettingsUnsupported ? "Current inherited agent defaults cannot be represented by the installed Claw v1 package. Reconcile those settings manually." : "Live agent config changed after installation and must be reconciled manually." : record.agentState === "missing" ? "Owned agent config is missing and would be restored from the target manifest." : agentAction === "unchanged" ? "Owned agent config already matches the target manifest." : "Target manifest changes owned agent config.",
			...record.agentState === "missing" ? {} : { currentDigest: record.install.agentConfigDigest },
			desiredDigest: desiredAgentDigest
		});
		pushResolvedAgentCapabilityChanges({
			changes: capabilityChanges,
			agentId,
			config: params.config,
			desiredAgent: targetPlan.agent.config
		});
		const targetFiles = clawWorkspaceActionsById(targetPlan.actions);
		const currentFiles = new Map(record.workspaceFiles.map((file) => [file.path, file]));
		let workspace;
		let workspaceState = "present";
		try {
			const workspaceStat = await lstat(record.install.workspace);
			if (!workspaceStat.isDirectory() || workspaceStat.isSymbolicLink()) workspaceState = "unsafe";
			else workspace = await root(record.install.workspace, {
				hardlinks: "reject",
				symlinks: "reject"
			});
		} catch (error) {
			workspaceState = error && typeof error === "object" && "code" in error && error.code === "ENOENT" ? "missing" : "unsafe";
		}
		for (const [path, target] of targetFiles) {
			const current = currentFiles.get(path);
			if (!target.digest) {
				actions.push({
					kind: "workspaceFile",
					id: path,
					action: "manual",
					target: `${record.install.workspace}:${path}`,
					blocked: true,
					reason: target.reason ?? "Target workspace source could not be verified."
				});
				continue;
			}
			let unownedDestination = workspaceState === "unsafe" ? "unsafe" : "absent";
			if (!current) {
				if (workspace) try {
					unownedDestination = await workspace.exists(path) ? "occupied" : "absent";
				} catch {
					unownedDestination = "unsafe";
				}
			}
			const currentFileRequiresManual = current !== void 0 && manualState(current.state) && !(workspaceState === "missing" && current.state === "unsafe");
			const action = workspaceState === "unsafe" ? "manual" : !current && unownedDestination !== "absent" ? "manual" : !current ? "add" : currentFileRequiresManual ? "manual" : current.contentDigest === target.digest && current.state === "unchanged" ? "unchanged" : "change";
			actions.push({
				kind: "workspaceFile",
				id: path,
				action,
				target: `${record.install.workspace}:${path}`,
				blocked: action === "manual",
				reason: unownedDestination === "occupied" ? "Workspace path already exists without Claw ownership and must be preserved." : unownedDestination === "unsafe" ? "Workspace path is unsafe to inspect and cannot be claimed automatically." : workspaceState === "missing" && current ? "Owned workspace is missing and this file would be restored." : action === "add" ? "Target manifest adds a managed workspace file." : action === "manual" ? "Local workspace content changed or became unsafe and must be reconciled manually." : action === "unchanged" ? "Managed workspace content already matches the target source." : "Target source changes or restores managed workspace content.",
				...current ? { currentDigest: current.contentDigest } : {},
				...current ? { currentPresent: current.state !== "missing" } : {},
				desiredDigest: target.digest
			});
		}
		for (const current of record.workspaceFiles) {
			if (targetFiles.has(current.path)) continue;
			const manual = workspaceState === "unsafe" || manualState(current.state) && !(workspaceState === "missing" && current.state === "unsafe");
			actions.push({
				kind: "workspaceFile",
				id: current.path,
				action: manual ? "manual" : "remove",
				target: `${current.workspace}:${current.path}`,
				blocked: manual,
				reason: manual ? "Target removes this file, but local drift must be preserved manually." : "Target manifest removes this managed workspace file.",
				currentDigest: current.contentDigest,
				currentPresent: current.state !== "missing"
			});
		}
		const allPackages = readClawPackageRefs(readOnlyStateOptions);
		const targetPackages = clawTargetPackages(params.targetManifest, params.targetOpenClawProfile);
		const targetPackageActions = clawPackageActionsById(targetPlan.actions);
		for (const [key, target] of targetPackages) {
			const current = currentPackages.get(key);
			const preflight = packagePreflights.get(key);
			const targetAction = targetPackageActions.get(key);
			const extensionChanged = clawExtensionProvenanceChanged(current?.extension, targetAction);
			const failedPackageMutationPreflight = (!current || current.origin === "claw-introduced" && !current.independentOwner && (current.state === "missing" || current.version !== target.version)) && !preflight?.ok;
			const conflictingPluginPin = target.kind === "plugin" && allPackages.some((candidate) => candidate.agentId !== agentId && candidate.kind === target.kind && candidate.source === target.source && candidate.ref === target.ref && candidate.version !== target.version);
			const unresolvedCurrent = current && [
				"modified",
				"ambiguous",
				"incomplete"
			].includes(current.state);
			const independentlyOwnedMutation = current && (current.origin === "pre-existing" || current.independentOwner) && (current.state === "missing" || current.version !== target.version);
			const action = conflictingPluginPin || unresolvedCurrent || independentlyOwnedMutation || failedPackageMutationPreflight ? "manual" : !current ? "add" : current.state === "missing" ? "change" : current.version === target.version && !extensionChanged ? "unchanged" : "change";
			actions.push({
				kind: "package",
				id: key,
				action,
				target: `${target.source}:${target.ref}@${target.version}`,
				blocked: action === "manual",
				reason: action === "manual" ? conflictingPluginPin ? "Another Claw pins an incompatible version of this shared plugin." : independentlyOwnedMutation ? "Package is independently owned and cannot be restored or changed by this Claw." : failedPackageMutationPreflight ? preflight?.message ?? "Package preflight failed." : `Current package lifecycle state is ${current?.state ?? "unknown"} and must be reconciled manually.` : action === "add" ? "Target manifest adds a package reference." : action === "unchanged" ? "Recorded package reference already matches the exact target version and extension mapping." : current?.version === target.version ? "Target profile changes extension provenance without reinstalling the package." : "Target manifest changes the exact package version.",
				...current ? { currentDigest: digestClawPackageRef(current) } : {},
				desiredDigest: digestClawValue({
					package: target,
					integrity: preflight?.integrity,
					installId: preflight?.installId,
					riskWarning: preflight?.warning,
					prerequisites: preflight?.requirements,
					extension: targetAction?.details?.extension
				})
			});
			const capabilityChange = packageCapabilityChange({
				pkg: target,
				action,
				currentVersion: current?.version,
				desiredVersion: target.version,
				integrity: preflight?.integrity,
				installId: preflight?.installId,
				riskWarning: preflight?.warning,
				currentExtension: current?.extension,
				desiredExtension: targetAction?.details?.extension
			});
			if (capabilityChange) capabilityChanges.push(capabilityChange);
			if (failedPackageMutationPreflight) {
				const packageIndex = params.targetManifest.packages.findIndex((pkg) => clawPackageKey(pkg) === key);
				const extensionIndex = params.targetOpenClawProfile?.extensions?.findIndex((extension) => clawPackageKey(extension) === key) ?? -1;
				const path = packageIndex >= 0 ? `$.packages[${packageIndex}]` : `$.profiles.openclaw.extensions[${extensionIndex}]`;
				const code = preflight?.code ?? "package_install_unavailable";
				if (!blockers.some((entry) => entry.code === code && entry.path === path)) blockers.push(diagnostic(code, path, preflight?.message ?? "Package preflight failed."));
			}
		}
		for (const [key, current] of currentPackages) if (!targetPackages.has(key)) {
			const manual = current.state !== "present";
			const action = manual ? "manual" : "release";
			actions.push({
				kind: "package",
				id: key,
				action,
				target: `${current.source}:${current.ref}@${current.version}`,
				blocked: manual,
				reason: manual ? `Target removes this package, but current lifecycle state is ${current.state}.` : "Target manifest releases this package dependency while preserving the artifact.",
				currentDigest: digestClawPackageRef(current)
			});
			const capabilityChange = packageCapabilityChange({
				pkg: current,
				action,
				currentVersion: current.version
			});
			if (capabilityChange) capabilityChanges.push(capabilityChange);
		}
		const configuredMcpServers = normalizeConfiguredMcpServers(params.sourceMcpServers);
		const currentMcp = new Map(record.mcpServers.map((server) => [server.name, server]));
		for (const [name, target] of Object.entries(params.targetManifest.mcpServers)) {
			const current = currentMcp.get(name);
			const desiredDigest = digestClawMcpServer(target);
			const unownedLiveServer = !current && Object.hasOwn(configuredMcpServers, name);
			const sharedWithOtherClaws = current && readClawMcpServerRefsByName(name, readOnlyStateOptions).some((candidate) => candidate.agentId !== agentId);
			const independentlyOwnedMutation = current !== void 0 && (current.origin === "pre-existing" || current.independentOwner) && (current.configDigest !== desiredDigest || current.state !== "present");
			const sharedChange = sharedWithOtherClaws && current?.configDigest !== desiredDigest;
			const action = unownedLiveServer || independentlyOwnedMutation || sharedChange ? "manual" : !current ? "add" : manualState(current.state) ? "manual" : current.configDigest === desiredDigest && current.state === "present" ? "unchanged" : "change";
			actions.push({
				kind: "mcpServer",
				id: name,
				action,
				target: `mcp.servers.${name}`,
				blocked: action === "manual",
				reason: unownedLiveServer ? "MCP server name already exists without this Claw's ownership." : independentlyOwnedMutation ? "MCP server is independently owned and cannot be restored or changed by this Claw." : sharedChange ? "Another Claw shares this MCP declaration and blocks changing global config." : action === "manual" ? "MCP ownership is unresolved or live config drifted and must be reconciled manually." : action === "unchanged" ? "Owned MCP config digest already matches the target declaration." : `Target manifest ${action === "add" ? "adds" : "changes or restores"} this MCP declaration.`,
				...current ? { currentDigest: current.configDigest } : {},
				desiredDigest
			});
			const capabilityChange = resourceCapabilityChange({
				kind: "mcpServer",
				id: name,
				action,
				current: current ? configuredMcpServers[name] : void 0,
				desired: target
			});
			if (capabilityChange) capabilityChanges.push(capabilityChange);
		}
		for (const current of record.mcpServers) {
			if (Object.hasOwn(params.targetManifest.mcpServers, current.name)) continue;
			const manual = current.state === "pending" || current.state === "failed";
			const sharedOrIndependent = current.relationship === "referenced" || current.origin === "pre-existing" || current.independentOwner || readClawMcpServerRefsByName(current.name, readOnlyStateOptions).some((candidate) => candidate.agentId !== agentId);
			const ownerAction = current.state === "present" && !sharedOrIndependent ? "remove" : "release";
			const action = manual ? "manual" : ownerAction;
			actions.push({
				kind: "mcpServer",
				id: current.name,
				action,
				target: `mcp.servers.${current.name}`,
				blocked: manual,
				reason: manual ? "Target removes this MCP declaration, but ownership is incomplete." : ownerAction === "release" ? "Target manifest releases this Claw's reference while preserving shared or independently owned MCP config." : "Target manifest removes this solely owned MCP declaration.",
				currentDigest: current.configDigest
			});
			const capabilityChange = resourceCapabilityChange({
				kind: "mcpServer",
				id: current.name,
				action,
				current: configuredMcpServers[current.name]
			});
			if (capabilityChange) capabilityChanges.push(capabilityChange);
		}
		const currentCron = new Map(record.cronJobs.map((cron) => [cron.manifestId, cron]));
		for (const target of params.targetManifest.cronJobs) {
			const current = currentCron.get(target.id);
			const desiredDigest = digestClawValue(target);
			const unresolved = current && (current.status !== "complete" || !current.schedulerJobId);
			const action = !current ? "add" : unresolved ? "manual" : digestClawValue(current.job) === desiredDigest ? "unchanged" : "change";
			actions.push({
				kind: "cronJob",
				id: target.id,
				action,
				target: current?.schedulerJobId ?? `claw:${agentId}:${target.id}`,
				blocked: action === "manual",
				reason: action === "manual" ? "Cron ownership is unresolved and must be reconciled with the gateway." : action === "unchanged" ? "Recorded cron declaration already matches the target manifest." : `Target manifest ${action === "add" ? "adds" : "changes"} this cron declaration.`,
				...current ? { currentDigest: digestClawValue(current.job) } : {},
				desiredDigest
			});
			const capabilityChange = resourceCapabilityChange({
				kind: "cronJob",
				id: target.id,
				action,
				current: current?.job,
				desired: target
			});
			if (capabilityChange) capabilityChanges.push(capabilityChange);
		}
		for (const current of record.cronJobs) {
			if (params.targetManifest.cronJobs.some((cron) => cron.id === current.manifestId)) continue;
			const manual = current.status !== "complete" || !current.schedulerJobId;
			const action = manual ? "manual" : "remove";
			actions.push({
				kind: "cronJob",
				id: current.manifestId,
				action,
				target: current.schedulerJobId ?? current.declarationKey,
				blocked: manual,
				reason: manual ? "Target removes this cron declaration, but scheduler ownership is unresolved." : "Target manifest removes this owned cron declaration.",
				currentDigest: digestClawValue(current.job)
			});
			const capabilityChange = resourceCapabilityChange({
				kind: "cronJob",
				id: current.manifestId,
				action,
				current: current.job
			});
			if (capabilityChange) capabilityChanges.push(capabilityChange);
		}
		actions.sort((left, right) => `${left.kind}:${left.id}`.localeCompare(`${right.kind}:${right.id}`));
		capabilityChanges.sort((left, right) => `${left.kind}:${left.id}:${left.path}`.localeCompare(`${right.kind}:${right.id}:${right.path}`));
		const plan = {
			schemaVersion: CLAW_UPDATE_PLAN_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			dryRun: true,
			mutationAllowed: false,
			found: true,
			agentId,
			currentClaw: {
				name: record.install.claw.name,
				version: record.install.claw.version,
				integrity: record.install.claw.integrity
			},
			targetClaw: {
				name: params.targetSource.name,
				version: params.targetSource.version,
				integrity: params.targetSource.integrity
			},
			summary: summarizeClawUpdatePlan(actions, capabilityChanges),
			actions,
			capabilityChanges,
			readiness: targetPlan.readiness,
			blockers,
			diagnostics: targetPlan.diagnostics
		};
		return {
			...plan,
			planIntegrity: digestClawValue(plan)
		};
	} finally {
		if (ownsDatabase) database.walMaintenance.close();
	}
}
//#endregion
//#region src/claws/workspace-update.ts
const MAX_UPDATE_FILE_BYTES = 1048576;
var ClawWorkspaceUpdateError = class extends Error {
	constructor(message, partial = false) {
		super(message);
		this.partial = partial;
		this.name = "ClawWorkspaceUpdateError";
	}
};
async function applyClawWorkspaceUpdate(updatePlan, targetAddPlan, options = {}) {
	const actions = updatePlan.actions.filter((action) => action.kind === "workspaceFile" && action.action !== "unchanged");
	if (actions.length === 0) return {
		appliedPaths: [],
		rollback: async () => void 0
	};
	const workspaceRoot = resolve(targetAddPlan.agent.workspace);
	const packageRoot = resolve(targetAddPlan.claw.packageRoot);
	const workspace = await root(workspaceRoot, {
		hardlinks: "reject",
		maxBytes: MAX_UPDATE_FILE_BYTES,
		symlinks: "reject"
	});
	const source = await root(packageRoot, {
		hardlinks: "reject",
		maxBytes: MAX_UPDATE_FILE_BYTES,
		symlinks: "reject"
	});
	const currentRefs = new Map(readClawWorkspaceFiles(updatePlan.agentId, options).map((record) => [record.path, record]));
	const targetActions = clawWorkspaceActionsById(targetAddPlan.actions);
	const undo = [];
	const appliedPaths = [];
	const rollback = async () => {
		const failures = await collectClawRollbackFailures(undo.toReversed());
		if (failures.length > 0) throw new ClawWorkspaceUpdateError(failures.join("; "), true);
	};
	try {
		for (const action of actions) {
			const path = action.id;
			const previousRef = currentRefs.get(path);
			const existed = await workspace.exists(path);
			const previousContent = existed ? await workspace.readBytes(path, { maxBytes: MAX_UPDATE_FILE_BYTES }) : void 0;
			if (action.currentPresent === true && !existed) throw new ClawWorkspaceUpdateError(`Workspace file ${JSON.stringify(path)} disappeared after planning.`);
			if (action.currentPresent === false && existed) throw new ClawWorkspaceUpdateError(`Workspace file ${JSON.stringify(path)} appeared after planning.`);
			if (previousContent && action.currentDigest && digestClawBytes(previousContent) !== action.currentDigest) throw new ClawWorkspaceUpdateError(`Workspace file ${JSON.stringify(path)} changed after planning.`);
			if (action.action === "add" && existed) throw new ClawWorkspaceUpdateError(`Workspace destination ${JSON.stringify(path)} appeared after planning.`);
			if (action.action === "remove") {
				undo.push(async () => {
					if (await workspace.exists(path)) throw new Error(`Workspace file ${JSON.stringify(path)} appeared before rollback.`);
					if (previousContent) await workspace.write(path, previousContent, {
						mkdir: true,
						overwrite: true
					});
					if (previousRef) upsertClawWorkspaceFile(previousRef, options);
				});
				if (existed) await workspace.remove(path);
				deleteClawWorkspaceFileRecord(updatePlan.agentId, path, options);
				appliedPaths.push(path);
				continue;
			}
			const target = targetActions.get(path);
			if (!target?.source || !target.digest) throw new ClawWorkspaceUpdateError(`Target workspace action ${JSON.stringify(path)} lacks source provenance.`);
			const resolvedSource = await readClawWorkspaceActionSource({
				action: target,
				packageRoot,
				sourceRoot: source
			});
			const content = resolvedSource.content;
			if (digestClawBytes(content) !== target.digest || target.digest !== action.desiredDigest) throw new ClawWorkspaceUpdateError(`Workspace source for ${JSON.stringify(path)} changed after planning.`);
			const nowMs = options.nowMs ?? Date.now();
			const record = {
				schemaVersion: CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION,
				agentId: updatePlan.agentId,
				workspace: workspace.rootReal,
				path,
				sourcePath: resolvedSource.sourceRelative.replaceAll(sep, "/"),
				contentDigest: target.digest,
				status: "complete",
				createdAtMs: previousRef?.createdAtMs ?? nowMs,
				updatedAtMs: nowMs
			};
			undo.push(async () => {
				if (!await workspace.exists(path)) throw new Error(`Workspace file ${JSON.stringify(path)} disappeared before rollback.`);
				const currentContent = await workspace.readBytes(path, { maxBytes: MAX_UPDATE_FILE_BYTES });
				if (digestClawBytes(currentContent) !== target.digest) throw new Error(`Workspace file ${JSON.stringify(path)} changed before rollback.`);
				if (previousContent) await workspace.write(path, previousContent, {
					mkdir: true,
					overwrite: true
				});
				else if (await workspace.exists(path)) await workspace.remove(path);
				if (previousRef) upsertClawWorkspaceFile(previousRef, options);
				else deleteClawWorkspaceFileRecord(updatePlan.agentId, path, options);
			});
			await workspace.write(path, content, {
				mkdir: true,
				overwrite: existed
			});
			upsertClawWorkspaceFile(record, options);
			appliedPaths.push(path);
		}
	} catch (error) {
		try {
			await rollback();
		} catch (rollbackError) {
			throw new ClawWorkspaceUpdateError(`${coerceErrorMessage(error)}; rollback failed: ${coerceErrorMessage(rollbackError)}`, true);
		}
		throw error;
	}
	return {
		appliedPaths,
		rollback
	};
}
//#endregion
//#region src/claws/update-apply.ts
const CLAW_UPDATE_RESULT_SCHEMA_VERSION = "openclaw.clawUpdateResult.v1";
var ClawUpdateMutationError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "ClawUpdateMutationError";
	}
};
function comparablePlan(plan) {
	return {
		found: plan.found,
		agentId: plan.agentId,
		currentClaw: plan.currentClaw,
		targetClaw: plan.targetClaw,
		actions: plan.actions,
		capabilityChanges: plan.capabilityChanges,
		readiness: plan.readiness,
		blockers: plan.blockers
	};
}
function unchangedPackagePaths(plan, manifest) {
	const unchangedIds = new Set(plan.actions.filter((action) => action.kind === "package" && action.action === "unchanged").map((action) => action.id));
	const paths = /* @__PURE__ */ new Set();
	manifest.packages.forEach((pkg, index) => {
		if (unchangedIds.has(`${pkg.kind}:${pkg.ref}`)) paths.add(`$.packages[${index}]`);
	});
	return paths;
}
async function applyClawUpdatePlan(plan, params, options) {
	if (options.consentPlanIntegrity !== plan.planIntegrity) throw new ClawUpdateMutationError("plan_integrity_mismatch", "Consent does not match the current Claw update plan; run update --dry-run again.");
	if (!plan.found || plan.blockers.length > 0 || plan.actions.some((action) => action.blocked)) throw new ClawUpdateMutationError("update_blocked", "The Claw update plan contains blockers or manual actions.");
	const fresh = await (options.rebuildPlan ?? buildClawUpdatePlan)({
		agentId: plan.agentId,
		targetManifest: params.targetManifest,
		targetClawMarkdownBody: params.targetClawMarkdownBody,
		targetOpenClawProfile: params.targetOpenClawProfile,
		targetSource: params.targetSource,
		config: options.config,
		sourceMcpServers: options.sourceMcpServers,
		stateOptions: options,
		packagePreflight: options.packagePreflight
	});
	if (fresh.planIntegrity !== plan.planIntegrity || stableStringify(comparablePlan(fresh)) !== stableStringify(comparablePlan(plan))) throw new ClawUpdateMutationError("update_changed", "Claw-owned state changed after update planning; build a new dry-run plan.");
	const actionable = fresh.actions.filter((action) => action.action !== "unchanged");
	if (!fresh.currentClaw || !fresh.targetClaw) throw new ClawUpdateMutationError("update_invalid", "The Claw update plan lacks identity.");
	const buildAddPlan = options.buildAddPlan ?? buildClawAddPlan;
	const currentInstall = (options.readInstall ?? readClawInstallRecord)(fresh.agentId, options);
	if (!currentInstall) throw new ClawUpdateMutationError("update_changed", "The Claw install record disappeared.");
	const adoptedAgentConfigDigest = currentInstall.agentOrigin === "adopted" ? fresh.actions.find((action) => action.kind === "agent")?.desiredDigest : void 0;
	const installPersistenceOptions = {
		...options,
		...adoptedAgentConfigDigest ? { agentConfigDigest: adoptedAgentConfigDigest } : {}
	};
	const partialMutation = (message, errorOptions) => {
		try {
			updateClawInstallRecordStatus(fresh.agentId, "partial", options);
		} catch {}
		return new ClawUpdateMutationError("update_partial", message, errorOptions);
	};
	const targetAddPlan = await buildAddPlan({
		manifest: params.targetManifest,
		clawMarkdownBody: params.targetClawMarkdownBody,
		includePackageBootstrap: false,
		openClawProfile: params.targetOpenClawProfile,
		source: params.targetSource,
		context: {
			agentId: fresh.agentId,
			workspace: currentInstall.workspace,
			packagePreflight: async (pkg, workspace) => {
				const preflight = options.packagePreflight ? await options.packagePreflight(pkg, workspace) : {
					ok: false,
					code: "package_install_unavailable",
					message: "Package preflight is unavailable."
				};
				const action = fresh.actions.find((candidate) => candidate.kind === "package" && candidate.id === `${pkg.kind}:${pkg.ref}`);
				return !preflight.ok && pkg.kind === "plugin" && preflight.code === "plugin_version_conflict" && action?.action === "change" ? {
					ok: true,
					action: "install",
					...preflight.integrity ? { integrity: preflight.integrity } : {},
					...preflight.installId ? { installId: preflight.installId } : {},
					...preflight.warning ? { warning: preflight.warning } : {},
					...preflight.requirements ? { requirements: preflight.requirements } : {},
					...preflight.detectedFormat ? { detectedFormat: preflight.detectedFormat } : {},
					...preflight.mapped ? { mapped: preflight.mapped } : {},
					...preflight.unavailable ? { unavailable: preflight.unavailable } : {},
					...preflight.adapterIdentity ? { adapterIdentity: preflight.adapterIdentity } : {}
				} : preflight;
			}
		}
	});
	const unchangedPaths = unchangedPackagePaths(fresh, params.targetManifest);
	if (targetAddPlan.blockers.some((blocker) => blocker.code !== "agent_id_collision" && blocker.code !== "workspace_collision" && !(blocker.code === "skill_version_conflict" && unchangedPaths.has(blocker.path)))) throw new ClawUpdateMutationError("update_target_blocked", "The target Claw cannot be safely materialized for update.");
	for (const action of fresh.actions.filter((candidate) => candidate.kind === "package" && candidate.action === "unchanged")) {
		const addAction = targetAddPlan.actions.find((candidate) => candidate.kind === "package" && candidate.id === action.id);
		if (!addAction || addAction.details?.expectedState === "absent") throw new ClawUpdateMutationError("update_changed", `Package ${JSON.stringify(action.id)} is no longer present; build a new dry-run plan.`);
	}
	const targetPackages = clawTargetPackages(params.targetManifest, params.targetOpenClawProfile);
	for (const action of fresh.actions.filter((candidate) => candidate.kind === "package" && candidate.action !== "unchanged" && candidate.action !== "release" && candidate.action !== "remove")) {
		const target = targetPackages.get(action.id);
		const details = targetAddPlan.actions.find((candidate) => candidate.kind === "package" && candidate.id === action.id)?.details;
		if (!target || action.desiredDigest !== digestClawValue({
			package: target,
			integrity: details?.integrity,
			installId: details?.installId,
			riskWarning: details?.riskWarning,
			prerequisites: details?.prerequisites,
			extension: details?.extension
		})) throw new ClawUpdateMutationError("update_changed", `Resolved package ${JSON.stringify(action.id)} changed after update planning; build a new dry-run plan.`);
	}
	const applyPackage = options.applyPackage ?? applyClawPackageUpdate;
	const requirementActions = fresh.actions.filter((action) => action.kind === "package" && action.action !== "unchanged" && action.action !== "release" && action.action !== "remove" && targetPackages.get(action.id)?.kind === "plugin");
	const remainingPackageActions = fresh.actions.filter((action) => action.kind === "package" && action.action !== "unchanged" && !requirementActions.includes(action));
	const applyPackageActions = async (actions, runtimeBatch) => {
		if (actions.length === 0) return {
			appliedIds: [],
			rollback: async () => void 0
		};
		return await applyPackage({
			...fresh,
			actions
		}, targetAddPlan, {
			...options,
			runtimeBatch
		});
	};
	const resumedRequirements = currentInstall.status === "complete" ? [] : fresh.actions.filter((action) => action.kind === "package" && action.action === "unchanged" && targetPackages.get(action.id)?.kind === "plugin").map((action) => {
		const installId = targetAddPlan.actions.find((entry) => entry.id === action.id)?.details?.installId;
		if (typeof installId !== "string" || !installId) throw new ClawUpdateMutationError("update_changed", `Plugin requirement ${action.id} lost its installed identity; build a new dry-run plan.`);
		return installId;
	});
	let requirementExecution;
	try {
		requirementExecution = requirementActions.length || resumedRequirements.length ? await runClawPluginBatch(options, requirementActions.length + resumedRequirements.length, (batch) => {
			for (const id of resumedRequirements) batch?.retain(id);
			return applyPackageActions(requirementActions, batch);
		}, (failure, operation) => new ClawPackageUpdateError([!operation.ok ? coerceErrorMessage(operation.error) : void 0, coerceErrorMessage(failure)].filter(Boolean).join("\n"), true, { cause: !operation.ok ? new AggregateError([operation.error, failure]) : failure })) : await applyPackageActions(requirementActions);
	} catch (error) {
		if (error instanceof ClawPackageUpdateError && error.partial) throw partialMutation(error.message, { cause: error });
		throw new ClawUpdateMutationError("package_update_failed", coerceErrorMessage(error), { cause: error });
	}
	const retainedRequirementMutation = requirementExecution.appliedIds.length > 0;
	const throwIfUpdatePartial = (error, rollbackFailures = []) => {
		if (rollbackFailures.length > 0) throw partialMutation(`${coerceErrorMessage(error)}; ${rollbackFailures.join("; ")}`);
		if (retainedRequirementMutation) throw partialMutation(`${coerceErrorMessage(error)}; successfully realized shared requirements were retained`);
	};
	const applyWorkspace = options.applyWorkspace ?? applyClawWorkspaceUpdate;
	let workspaceExecution;
	try {
		workspaceExecution = await applyWorkspace(fresh, targetAddPlan, options);
	} catch (error) {
		if (error instanceof ClawWorkspaceUpdateError && error.partial) throw partialMutation(error.message);
		throwIfUpdatePartial(error);
		throw new ClawUpdateMutationError("workspace_update_failed", coerceErrorMessage(error));
	}
	const applyMcp = options.applyMcp ?? applyClawMcpUpdate;
	let mcpExecution;
	try {
		mcpExecution = await applyMcp(fresh, params.targetManifest, options);
	} catch (error) {
		const partial = error instanceof ClawMcpUpdateError && error.partial;
		try {
			await workspaceExecution.rollback();
		} catch (rollbackError) {
			throw partialMutation(`${coerceErrorMessage(error)}; workspace rollback failed: ${coerceErrorMessage(rollbackError)}`);
		}
		if (partial) throw partialMutation(`${error.message}; MCP config write outcome is uncertain`);
		throwIfUpdatePartial(error);
		throw new ClawUpdateMutationError("mcp_update_failed", coerceErrorMessage(error));
	}
	let packageExecution;
	try {
		packageExecution = await applyPackageActions(remainingPackageActions);
	} catch (error) {
		const rollbackFailures = await collectClawRollbackFailures([["MCP rollback failed", () => mcpExecution.rollback()], ["workspace rollback failed", () => workspaceExecution.rollback()]]);
		if (error instanceof ClawPackageUpdateError && error.partial) rollbackFailures.unshift("package artifact rollback is unavailable");
		throwIfUpdatePartial(error, rollbackFailures);
		throw new ClawUpdateMutationError("package_update_failed", coerceErrorMessage(error));
	}
	const agentAction = fresh.actions.find((action) => action.kind === "agent");
	const commit = options.commitConfig ?? (async (transform) => {
		await transformConfigFileWithRetry({
			afterWrite: { mode: "auto" },
			transform: (config) => ({ nextConfig: transform(config) })
		});
	});
	let previousAgent;
	let agentChanged = false;
	const liveAgentDigest = (config, agent) => {
		if (!agent || currentInstall.agentOrigin !== "adopted") return agent ? digestClawValue(agent) : void 0;
		let workspace = resolveAgentWorkspaceDir(config, fresh.agentId, options.env);
		try {
			workspace = realpathSync(workspace);
		} catch {
			workspace = resolve(workspace);
		}
		try {
			return digestClawValue(normalizeWorkspaceConfig(resolveMigrationAgentSettings(config, agent), workspace));
		} catch {
			return;
		}
	};
	const rollbackAgent = async () => {
		if (!agentChanged) return;
		await commit((config) => {
			const current = listAgentEntries(config).find((agent) => agent.id === fresh.agentId);
			const targetDigest = adoptedAgentConfigDigest ?? digestClawValue(targetAddPlan.agent.config);
			if (liveAgentDigest(config, current) !== targetDigest) throw new Error("The agent changed before rollback.");
			const nextEntries = { ...config.agents?.entries };
			if (previousAgent) {
				const { id: _id, ...previousEntry } = previousAgent;
				nextEntries[fresh.agentId] = previousEntry;
			} else delete nextEntries[fresh.agentId];
			return {
				...config,
				agents: {
					...config.agents,
					entries: nextEntries
				}
			};
		});
		agentChanged = false;
	};
	if (agentAction?.action === "change") try {
		await commit((config) => {
			const current = listAgentEntries(config).find((agent) => agent.id === fresh.agentId);
			previousAgent = current;
			if (agentAction.currentDigest !== void 0) {
				if (!current) throw new ClawUpdateMutationError("agent_changed", "The owned agent entry disappeared during update.");
				if (liveAgentDigest(config, current) !== agentAction.currentDigest) throw new ClawUpdateMutationError("agent_changed", "The owned agent entry changed during update.");
			}
			const nextEntries = { ...config.agents?.entries };
			const { id: _id, ...targetEntry } = targetAddPlan.agent.config;
			nextEntries[fresh.agentId] = targetEntry;
			agentChanged = true;
			return {
				...config,
				agents: {
					...config.agents,
					entries: nextEntries
				}
			};
		});
	} catch (error) {
		throwIfUpdatePartial(error, await collectClawRollbackFailures([
			["agent rollback failed", () => rollbackAgent()],
			["package rollback incomplete", () => packageExecution.rollback()],
			["MCP rollback failed", () => mcpExecution.rollback()],
			["workspace rollback failed", () => workspaceExecution.rollback()]
		]));
		if (error instanceof ClawUpdateMutationError) throw error;
		throw new ClawUpdateMutationError("agent_update_failed", coerceErrorMessage(error));
	}
	const persistInstall = options.persistInstall ?? updateClawInstallRecord;
	const applyCron = options.applyCron ?? applyClawCronUpdate;
	let cronExecution;
	try {
		cronExecution = await applyCron(fresh, params.targetManifest, options);
	} catch (error) {
		if (error instanceof ClawCronUpdateError && error.partial) {
			try {
				persistInstall(targetAddPlan, {
					...installPersistenceOptions,
					expectedClaw: fresh.currentClaw,
					status: "partial"
				});
			} catch (persistError) {
				throw partialMutation(`${error.message}; cron gateway mutation outcome is uncertain; provenance update failed: ${coerceErrorMessage(persistError)}`);
			}
			throw partialMutation(`${error.message}; cron gateway mutation outcome is uncertain`);
		}
		throwIfUpdatePartial(error, await collectClawRollbackFailures([
			["agent rollback failed", () => rollbackAgent()],
			["package rollback incomplete", () => packageExecution.rollback()],
			["MCP rollback failed", () => mcpExecution.rollback()],
			["workspace rollback failed", () => workspaceExecution.rollback()]
		]));
		throw new ClawUpdateMutationError("cron_update_failed", coerceErrorMessage(error));
	}
	let installRecord;
	try {
		installRecord = persistInstall(targetAddPlan, {
			...installPersistenceOptions,
			expectedClaw: fresh.currentClaw
		});
	} catch (error) {
		throwIfUpdatePartial(error, await collectClawRollbackFailures([
			["agent rollback failed", () => rollbackAgent()],
			["package rollback incomplete", () => packageExecution.rollback()],
			["cron rollback failed", () => cronExecution.rollback()],
			["MCP rollback failed", () => mcpExecution.rollback()],
			["workspace rollback failed", () => workspaceExecution.rollback()]
		]));
		throw new ClawUpdateMutationError("provenance_update_failed", coerceErrorMessage(error));
	}
	return {
		schemaVersion: CLAW_UPDATE_RESULT_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		dryRun: false,
		mutationAllowed: true,
		status: "complete",
		agentId: fresh.agentId,
		previousClaw: fresh.currentClaw,
		targetClaw: fresh.targetClaw,
		appliedActions: actionable,
		installRecord
	};
}
//#endregion
//#region src/cli/claws-update-cli.runtime.ts
async function runClawsUpdateCommand(target, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	if (!opts.dryRun && (!opts.yes || !opts.planIntegrity)) {
		const message = "Claw update requires explicit consent; pass --dry-run to preview or --yes with --plan-integrity to apply supported actions.";
		emitClawFailure(runtime, opts.json, message, {
			schemaVersion: CLAW_UPDATE_PLAN_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			ok: false,
			error: {
				code: "consent_required",
				message
			}
		});
		return;
	}
	const listedMcpServers = await listConfiguredMcpServers();
	if (!listedMcpServers.ok) {
		emitClawFailure(runtime, opts.json, listedMcpServers.error, {
			schemaVersion: CLAW_UPDATE_PLAN_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			dryRun: true,
			mutationAllowed: false,
			valid: false,
			diagnostics: [{
				level: "error",
				code: "mcp_config_unavailable",
				phase: "plan",
				path: "$.mcpServers",
				message: listedMcpServers.error
			}]
		});
		return;
	}
	const config = withAuthoredAgentRoster(listedMcpServers.runtimeConfig ?? listedMcpServers.config, listedMcpServers.sourceConfigBeforeMigrations);
	let source = opts.from;
	if (!source) {
		const database = await openExistingOpenClawStateDatabaseReadOnly();
		let status = { records: [] };
		if (database) try {
			if (database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'claw_installs'").get()) status = await readClawStatus(target, {
				database,
				readOnly: true,
				sourceMcpServers: listedMcpServers.mcpServers
			});
		} finally {
			database.walMaintenance.close();
		}
		if (status.records.length !== 1) {
			const message = status.records.length === 0 ? `No installed Claw agent matches ${JSON.stringify(target)}.` : `Claw name ${JSON.stringify(target)} matches multiple agents; use an agent id.`;
			emitClawFailure(runtime, opts.json, message, {
				schemaVersion: CLAW_UPDATE_PLAN_SCHEMA_VERSION,
				stability: CLAW_OUTPUT_STABILITY,
				dryRun: true,
				mutationAllowed: false,
				valid: false,
				diagnostics: [{
					level: "error",
					code: status.records.length === 0 ? "claw_not_found" : "claw_ambiguous",
					phase: "plan",
					path: "$",
					message
				}]
			});
			return;
		}
		const recorded = status.records[0].install.claw;
		source = recorded.kind === "package" ? recorded.packageRoot : recorded.manifestPath;
	}
	const loaded = await readClawManifestFile(source, { allowLegacyDynamicToolProfile: !opts.from });
	if (!loaded.ok) {
		const diagnostics = opts.from ? loaded.diagnostics : [...loaded.diagnostics, {
			level: "error",
			code: "recorded_source_unavailable",
			phase: "plan",
			path: "$",
			message: "The recorded Claw source is unavailable; pass --from to override it."
		}];
		emitClawFailure(runtime, opts.json, formatClawDiagnostics(diagnostics), {
			schemaVersion: CLAW_UPDATE_PLAN_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			dryRun: true,
			mutationAllowed: false,
			valid: false,
			diagnostics
		});
		return;
	}
	const plan = await buildClawUpdatePlan({
		agentId: target,
		targetManifest: loaded.manifest,
		targetClawMarkdownBody: loaded.clawMarkdownBody,
		targetOpenClawProfile: loaded.openClawProfile,
		targetSource: loaded.source,
		config,
		sourceMcpServers: listedMcpServers.mcpServers,
		packagePreflight: preflightClawPackage,
		diagnostics: loaded.diagnostics
	});
	if (opts.dryRun || plan.blockers.length > 0 || plan.actions.some((action) => action.blocked)) {
		if (opts.json) writeRuntimeJson(runtime, plan);
		else {
			logClawExperimentalWarning(runtime);
			runtime.log(`Claw update plan: ${plan.currentClaw?.name ?? target} ${plan.currentClaw?.version ?? "unknown"} -> ${plan.targetClaw?.version ?? "unknown"}`);
			runtime.log(`Plan integrity: ${plan.planIntegrity}`);
			logClawUpdatePlanSummary(plan, runtime);
		}
		if (plan.blockers.length > 0 || plan.actions.some((action) => action.blocked)) runtime.exit(1);
		return;
	}
	try {
		const result = await applyClawUpdatePlan(plan, {
			targetManifest: loaded.manifest,
			targetClawMarkdownBody: loaded.clawMarkdownBody,
			targetOpenClawProfile: loaded.openClawProfile,
			targetSource: loaded.source
		}, {
			config,
			reloadPlugins: await resolvePluginBatchReload(),
			sourceMcpServers: listedMcpServers.mcpServers,
			consentPlanIntegrity: opts.planIntegrity,
			packagePreflight: preflightClawPackage,
			runtime: opts.json ? {
				...runtime,
				log: () => void 0
			} : runtime,
			cronGateway: {
				waitUntilAgentAvailable: waitUntilGatewayAgentAvailable,
				add: async (input) => await callGatewayFromCli("cron.add", {}, input),
				get: async (id) => await callGatewayFromCli("cron.get", {}, { id }),
				remove: async (id) => await callGatewayFromCli("cron.remove", {}, { id })
			}
		});
		if (opts.json) {
			writeRuntimeJson(runtime, result);
			return;
		}
		logClawExperimentalWarning(runtime);
		runtime.log(`Updated agent: ${result.agentId}`);
		runtime.log(`Claw version: ${result.previousClaw.version} -> ${result.targetClaw.version}`);
	} catch (error) {
		const code = error instanceof ClawUpdateMutationError ? error.code : "update_failed";
		const message = error instanceof Error ? error.message : String(error);
		emitClawFailure(runtime, opts.json, message, {
			schemaVersion: CLAW_UPDATE_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			status: code === "update_partial" ? "partial" : "failed",
			error: {
				code,
				message
			}
		});
	}
}
//#endregion
export { runClawsUpdateCommand };
