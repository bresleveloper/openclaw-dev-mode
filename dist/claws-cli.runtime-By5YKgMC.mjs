import { t as assertExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { o as asRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { a as normalizeWindowsPathForComparison } from "./path-guards-D5kuI0Tv.mjs";
import { c as readFileDescriptorBoundedSync } from "./boundary-file-read-D-Aa04On.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, O as listAgentIds, l as resolveAgentWorkspaceDir, v as toAgentEntriesRecord } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as DEFAULT_AGENT_ID } from "./session-key-CBvmC8zz.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { F as hashStableJson } from "./discovery-D_5mAUI7.mjs";
import { r as resolveInstalledPluginIndexInstallOwner } from "./installed-plugin-index-install-owner-Bd-Byre8.mjs";
import { M as normalizeClawHubSha256Integrity } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { d as readPersistedInstalledPluginIndexRowSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { t as parseInstalledPluginIndex } from "./installed-plugin-index-store-Col5DnQ-.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-BnGMmE02.mjs";
import { u as resolveRememberAcrossConversations } from "./legacy-2ovrASa7.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cl4qyvGH.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { c as runOpenClawStateWriteTransaction, n as openExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as redactSensitiveArgv } from "./redact-argv-C8i2jYjd.mjs";
import { t as AVATAR_MAX_BYTES } from "./avatar-limits-2506OuP3.mjs";
import { n as isAvatarDataUrl, r as isAvatarHttpUrl } from "./avatar-policy-I2uW2Cs8.mjs";
import { f as readCurrentConfigForPolicyCheck, r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import { o as transformConfigFileWithRetry } from "./mutate-CDIHLSip.mjs";
import "./config-Ciq2mxdN.mjs";
import { n as callGatewayFromCli } from "./gateway-rpc-DXO3PHhc.mjs";
import { m as recordAgentProvenance } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { i as resolveLocalProviderAuthEvidence } from "./model-auth-env-CmdBc7TL.mjs";
import { n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-BRjL0YJr.mjs";
import { l as seedWorkspaceBootstrap } from "./workspace-mlzi3k1x.mjs";
import { r as withPluginLifecycleLease, t as hasPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { t as PLUGIN_ARTIFACT_ADAPTER_IDENTITY } from "./install-artifact-inspection-X2JhMF_r.mjs";
import { t as installPluginFromClawHub } from "./clawhub-DyY8io5y.mjs";
import { n as maintainClawPackageLifecycleLease, t as acquireClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-YnpLFoM-.mjs";
import { n as resolvePluginCapabilityConsentCliOptions } from "./plugin-capability-consent-DV06eSCs.mjs";
import { t as resolveMemorySearchSourcePolicy } from "./memory-search-source-policy-B3S1qyBP.mjs";
import { n as resolveCronJobsStorePathFromConfig, t as resolveCronJobsStorePath } from "./paths-Bz2goYfd.mjs";
import { v as loadCronJobsStoreWithConfigJobsReadOnly } from "./store-CV1wrdMb.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-B2J3OrFT.mjs";
import { t as openLocalAgentAvatarFile } from "./identity-avatar-file-DbxXI2gj.mjs";
import { n as resolveHeartbeatSummaryForAgent } from "./heartbeat-summary-BwKUEkLt.mjs";
import { _ as isPortableClawAvatar, a as MAX_MANAGED_WORKSPACE_BYTES, c as parseClawOpenClawProfile, d as CLAW_INSPECT_RESULT_SCHEMA_VERSION, f as CLAW_OUTPUT_STABILITY, h as resolveClawToolProfileSnapshot, l as CLAW_ADD_PLAN_SCHEMA_VERSION, m as resolveClawProfileCapabilities, n as readClawManifestFile, p as materializeClawToolProfile, r as MAX_CLAW_MANIFEST_BYTES, s as parseClawManifest, u as CLAW_BOOTSTRAP_FILE_NAMES } from "./reader-C5RYMxIl.mjs";
import { t as listConfiguredMcpServers } from "./mcp-config-DDcOp4Ta.mjs";
import { a as withClawMcpLifecycleLease, n as unsetConfiguredMcpServer, t as setConfiguredMcpServer } from "./mcp-config-mutation-prwzNOrh.mjs";
import { n as createPluginInstallLogger } from "./plugins-command-helpers-DQdh9F66.mjs";
import { t as installManagedPlugin } from "./management-mutations-BtYtRvdh.mjs";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-Ci4iwiZS.mjs";
import { C as installClawCronJobs, E as upsertClawCronRef, S as deleteClawCronRef, T as readClawCronRefs, _ as CLAW_CRON_REF_SCHEMA_VERSION, a as ClawRemoveError, b as clawCronGatewayJobMatchesRef, n as clawMonitorDrainSchema, r as clawMonitorInventorySchema, v as ClawCronInstallError, x as clawCronSchedulerJobFromResult, y as clawCronGatewayInput } from "./monitor-cleanup-contract-BHX4JGIH.mjs";
import { i as CLAW_REMOVE_RESULT_SCHEMA_VERSION, n as buildClawRemovePlan, r as CLAW_REMOVE_PLAN_SCHEMA_VERSION, t as applyClawRemovePlan } from "./lifecycle-state-PN_JwRLH.mjs";
import { a as readClawInstallRecord, c as readClawPackageRefs, d as updateClawPackageRefStatus, f as CLAW_PACKAGE_REF_SCHEMA_VERSION, i as persistClawPackageRef, l as updateClawInstallRecord, n as deleteClawInstallRecord, o as readClawInstallRecordFromDatabase, p as toPackageRefExtensionSqlParams, r as persistClawInstallRecord, t as clawInstallRecordMatchesPlan, u as updateClawInstallRecordStatus } from "./provenance-CFChXfcP.mjs";
import { b as resolveInstalledClawHubPlugin, c as readClawStatus, d as createClawWorkspaceFiles, f as deleteClawWorkspaceFileRecord, g as clawContainedRelativePath, h as upsertClawWorkspaceFile, l as CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION, m as readClawWorkspaceFiles, p as readClawWorkspaceActionSource, u as ClawWorkspaceWriteError, y as preflightPluginInstall } from "./package-remove-plan-CbN2q2ex.mjs";
import { a as digestClawMcpServer, c as readClawMcpServerRefs, d as upsertClawMcpServerRef, i as deleteClawMcpServerRef, l as readClawMcpServerRefsByName, n as ClawMcpInstallError, o as installClawMcpServers, s as planClawMcpServerRemoval, t as CLAW_MCP_REF_SCHEMA_VERSION } from "./mcp-CSMpf6KZ.mjs";
import { a as logClawUpdatePlanSummary, c as findClawExtensionPackageCollisions, i as logClawExperimentalWarning, l as planClawExtensions, n as formatClawDiagnostics, o as buildClawAddPlan, r as logClawAgentConfiguration, s as clawProfileExtensionPackages, t as emitClawFailure } from "./claws-cli-output-CwznuVGD.mjs";
import { t as resolveClawHubInstallConfirmation } from "./clawhub-install-confirmation-CctKL64D.mjs";
import { r as uninstallPluginWithPolicy } from "./management-uninstall-CpntmTSq.mjs";
import { n as preflightSkillFromClawHub, t as installSkillFromClawHub } from "./clawhub-8PK5eW27.mjs";
import { t as inspectPluginGenerationSources } from "./plugin-generation-source-inspection-BYmIVGn4.mjs";
import { t as resolveClawMonitorCleanupBinding } from "./monitor-cleanup-binding-BTdENnKp.mjs";
import { n as clawPackageRemovalResultSchema } from "./package-remove-contract-BXHzszn4.mjs";
import { r as listCronJobsFromGateway } from "./list-jobs-DVm3xLFY.mjs";
import { t as resolvePluginBatchReload } from "./plugins-lifecycle-client-2gQY_g-b.mjs";
import fs, { closeSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { lstat, mkdir, mkdtemp, realpath, rm, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { stringify } from "yaml";
//#region src/claws/add-plan-helpers.ts
function hasUnsupportedMutationActions(plan) {
	return plan.actions.some((action) => ![
		"agent",
		"workspace",
		"bootstrap",
		"workspaceFile",
		"package",
		"mcpServer",
		"cronJob"
	].includes(action.kind));
}
function planWithPackageActions(plan, predicate) {
	return {
		...plan,
		actions: plan.actions.filter((action) => action.kind !== "package" || predicate(action))
	};
}
function statusAtLeast(status, phase) {
	const order = {
		pending: 0,
		partial: 0,
		workspace_ready: 1,
		config_committed: 2,
		complete: 3
	};
	return order[status] >= order[phase];
}
function sameCommittedAgent(existingAgent, plan) {
	return stableStringify(existingAgent) === stableStringify(plan.agent.config);
}
//#endregion
//#region src/claws/bootstrap.ts
var ClawBootstrapWriteError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "ClawBootstrapWriteError";
	}
};
function contentDigest(content) {
	return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}
async function seedClawPackageBootstrap(plan, options = {}) {
	const actions = plan.actions.filter((action) => action.kind === "bootstrap");
	if (actions.length === 0) return;
	if (actions.length !== 1) throw new ClawBootstrapWriteError("bootstrap_plan_invalid", "A Claw add plan may contain only one package bootstrap action.");
	const action = actions[0];
	if (!action) throw new ClawBootstrapWriteError("bootstrap_plan_invalid", "The package bootstrap action is missing.");
	if (!action.source || !action.digest) throw new ClawBootstrapWriteError("bootstrap_plan_invalid", "The package bootstrap action lacks source integrity.");
	const packageRoot = await realpath(resolve(plan.claw.packageRoot));
	const sourcePath = resolve(action.source);
	const sourceRelative = clawContainedRelativePath(packageRoot, sourcePath);
	if (!sourceRelative) throw new ClawBootstrapWriteError("bootstrap_source_escape", "BOOTSTRAP.md must remain inside the Claw package.");
	const read = await (await root(packageRoot)).read(sourceRelative, {
		hardlinks: "reject",
		maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES,
		symlinks: "reject"
	});
	if (resolve(read.realPath) !== sourcePath || contentDigest(read.buffer) !== action.digest) throw new ClawBootstrapWriteError("bootstrap_source_changed", "BOOTSTRAP.md changed after consent; run add --dry-run again.");
	const expectedTarget = resolve(plan.agent.workspace, DEFAULT_BOOTSTRAP_FILENAME);
	if (resolve(action.target) !== expectedTarget) throw new ClawBootstrapWriteError("bootstrap_target_changed", "The package bootstrap target is not the new agent workspace root.");
	return (options.seedBootstrap ?? seedWorkspaceBootstrap)({
		dir: plan.agent.workspace,
		content: read.buffer,
		...options.nowMs !== void 0 ? { nowMs: options.nowMs } : {},
		stateOptions: options
	});
}
//#endregion
//#region src/claws/legacy-resume.ts
function replaceLegacyCommittedAgent(params) {
	if (!params.resumePlan || params.resumeRecord?.schemaVersion !== "openclaw.clawInstallRecord.v1" || params.resumeRecord.status === "complete") return;
	const existingAgent = params.agents.find((agent) => normalizeAgentId(agent.id) === params.normalizedAgentId);
	if (!existingAgent || !params.matchesPlan(existingAgent, params.resumePlan)) return;
	return {
		...params.config,
		agents: {
			...params.config.agents,
			entries: Object.fromEntries(params.agents.map((agent) => {
				const { id, ...entry } = normalizeAgentId(agent.id) === params.normalizedAgentId ? params.plan.agent.config : agent;
				return [id, entry];
			}))
		}
	};
}
//#endregion
//#region src/claws/package-resume.ts
function ownerInstallIsNewerThanRefs(installedAt, refs) {
	const timestamp = Date.parse(installedAt ?? "");
	return Number.isFinite(timestamp) && refs.length > 0 && refs.every((ref) => timestamp > ref.updatedAtMs);
}
function persistedExtensionMatchesPreflight(ref, preflight) {
	if (!ref.extension) return true;
	if (!preflight.ok) return false;
	return stableStringify({
		detectedFormat: ref.extension.detectedFormat,
		mapped: ref.extension.mapped,
		unavailable: ref.extension.unavailable,
		adapterIdentity: ref.extension.adapterIdentity
	}) === stableStringify({
		detectedFormat: preflight.detectedFormat,
		mapped: preflight.mapped ?? [],
		unavailable: preflight.unavailable ?? [],
		adapterIdentity: preflight.adapterIdentity
	});
}
function findResumableIntroducedPluginRequirement(params) {
	if (params.pkg.kind !== "plugin" || !params.preflight.ok || params.preflight.action !== "reuse") return;
	const expectedRawIntegrity = params.expectedIntegrity ?? params.preflight.integrity;
	if (!expectedRawIntegrity || !params.preflight.installedIntegrity) return;
	const expectedIntegrity = normalizeClawHubSha256Integrity(expectedRawIntegrity);
	const installedIntegrity = normalizeClawHubSha256Integrity(params.preflight.installedIntegrity);
	if (!expectedIntegrity || installedIntegrity !== expectedIntegrity) return;
	const ref = params.refs.find((candidate) => candidate.agentId === params.agentId && candidate.kind === params.pkg.kind && candidate.source === params.pkg.source && candidate.ref === params.pkg.ref && candidate.version === params.pkg.version && normalizeClawHubSha256Integrity(candidate.integrity) === expectedIntegrity && candidate.status === "complete" && candidate.relationship === "referenced" && candidate.origin === "claw-introduced" && !candidate.independentOwner && persistedExtensionMatchesPreflight(candidate, params.preflight));
	return ref && !ownerInstallIsNewerThanRefs(params.preflight.installedAt, [ref]) ? ref : void 0;
}
async function readClawResumeStateReadOnly(agentId, options = {}) {
	const database = await openExistingOpenClawStateDatabaseReadOnly(options);
	if (!database) return;
	try {
		if (!database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'claw_installs'").get()) return;
		const record = readClawInstallRecordFromDatabase(database.db, agentId);
		if (!record) return;
		return {
			record,
			packageRefs: readClawPackageRefs({
				...options,
				database,
				readOnly: true,
				agentId
			})
		};
	} finally {
		database.walMaintenance.close();
	}
}
//#endregion
//#region src/claws/package-setup-requirements.ts
function resolveClawPluginSetupRequirements(params) {
	const providers = params.setup?.providers ?? [];
	if (providers.some((provider) => (provider.envVars ?? []).some((name) => Boolean(params.env[name]?.trim())) || resolveLocalProviderAuthEvidence(provider.authEvidence, params.env))) return [];
	return providers.flatMap((provider) => {
		const envVars = provider.envVars ?? [];
		const authEvidence = provider.authEvidence ?? [];
		if (envVars.length === 0 && authEvidence.length === 0) return [];
		return [{
			kind: "plugin-setup",
			plugin: params.pluginId,
			provider: provider.id,
			envVars,
			authMethods: provider.authMethods ?? []
		}];
	});
}
//#endregion
//#region src/plugins/install-runtime-batch.ts
function indexFromRow(value) {
	if (value === void 0) return;
	const index = parseInstalledPluginIndex(asRecord(safeParseJson(value))?.index);
	if (!index) throw new Error("Plugin batch has an invalid installed-index receipt");
	return index;
}
/** Owns ephemeral committed facts and cleanup across the CLI-to-Gateway lease gap. */
var PluginInstallRuntimeBatch = class {
	constructor(options, reload) {
		this.options = options;
		this.reload = reload;
		this.installs = [];
		this.targets = [];
		this.retained = /* @__PURE__ */ new Set();
		this.sourceChecks = /* @__PURE__ */ new Map();
		this.phase = "collecting";
	}
	get hasCommitted() {
		return this.installs.some((entry) => entry.commit !== void 0);
	}
	close() {
		this.phase = "closed";
		for (const entry of this.installs.splice(0)) {
			entry.commit = void 0;
			entry.cleanups.length = 0;
		}
		this.targets = [];
		this.retained.clear();
		this.sourceChecks.clear();
	}
	assertOpen() {
		if (this.phase === "closed") throw new Error("Plugin installation batch is closed");
	}
	assertCollecting() {
		if (this.phase !== "collecting") throw new Error("Plugin installation batch no longer accepts mutations");
	}
	install() {
		this.assertCollecting();
		const entry = { cleanups: [] };
		this.installs.push(entry);
		return {
			record: (commit, assertSourceCurrent) => {
				this.assertCollecting();
				if (entry.commit) throw new Error("Plugin install already committed in this batch");
				entry.commit = commit;
				if (assertSourceCurrent) this.sourceChecks.set(commit.pluginId, assertSourceCurrent);
				else this.sourceChecks.delete(commit.pluginId);
			},
			deferCleanup: (cleanup, sourcePath) => {
				this.assertCollecting();
				if (!entry.commit) throw new Error("Cannot transfer cleanup before plugin installation commits");
				const configPath = entry.commit.write.configWrite.path;
				const original = fs.lstatSync(sourcePath, {
					bigint: true,
					throwIfNoEntry: false
				});
				entry.cleanups.push(async (assertOwned, warn) => {
					const assertUnclaimed = () => {
						assertOwned();
						const current = fs.lstatSync(sourcePath, {
							bigint: true,
							throwIfNoEntry: false
						});
						if (current && (!original || current.dev !== original.dev || current.ino !== original.ino)) throw new Error(`Retired plugin source changed before cleanup: ${sourcePath}`);
						const index = indexFromRow(readPersistedInstalledPluginIndexRowSync({ filePath: this.databasePath })?.value_json);
						if (!index) throw new Error("Plugin index disappeared before source cleanup");
						const config = readCurrentConfigForPolicyCheck({
							configPath,
							env: this.options.env ?? process.env
						});
						if (createInstalledPluginOwnershipResolver(index, this.options.env).isSourceInUse(sourcePath, config.plugins?.load?.paths ?? [])) throw new Error(`Retired plugin source acquired a current owner: ${sourcePath}`);
						assertOwned();
					};
					assertUnclaimed();
					await cleanup(assertUnclaimed, warn);
				});
			}
		};
	}
	retain(pluginId) {
		this.assertCollecting();
		this.retained.add(pluginId);
	}
	/** Called before the original batch lease exits, after its compensation has settled. */
	prepare(lease) {
		this.assertCollecting();
		lease.assertOwned();
		this.databasePath = lease.databasePath;
		if (!this.hasCommitted && this.retained.size === 0) {
			this.phase = "prepared";
			return;
		}
		const index = indexFromRow(readPersistedInstalledPluginIndexRowSync({ filePath: lease.databasePath })?.value_json);
		const current = index?.installRecords ?? {};
		const targets = /* @__PURE__ */ new Map();
		for (const pluginId of this.retained) {
			if (!current[pluginId]) throw new Error(`Resumable plugin ${pluginId} is no longer installed`);
			const source = inspectPluginGenerationSources((index?.plugins ?? []).filter((entry) => resolveInstalledPluginIndexInstallOwner(entry) === pluginId && entry.enabled && entry.origin !== "bundled").map((entry) => ({
				pluginId: entry.pluginId,
				rootDir: entry.rootDir,
				entryFile: entry.source === entry.manifestPath ? entry.source : void 0
			})));
			this.sourceChecks.set(pluginId, source.assertSourceCurrent);
			targets.set(pluginId, {
				pluginId,
				installHash: hashStableJson(current[pluginId]),
				sourceDigests: source.sourceDigests
			});
		}
		const finalCommits = /* @__PURE__ */ new Map();
		for (const { commit } of this.installs) {
			if (!commit) continue;
			finalCommits.set(commit.pluginId, commit);
		}
		for (const commit of finalCommits.values()) {
			const { pluginId, write } = commit;
			if (write.mutation.databasePath !== lease.databasePath) throw new Error("Plugin batch commit belongs to a different state database");
			const installed = indexFromRow(write.mutation.after.value_json)?.installRecords[pluginId];
			if (commit.operation === "uninstall") {
				if (installed || current[pluginId]) throw new Error(`Plugin ${pluginId} compensation did not remove its installed record`);
				targets.delete(pluginId);
				continue;
			}
			if (!installed) throw new Error(`Plugin ${pluginId} is missing from its committed index receipt`);
			const installHash = hashStableJson(installed);
			if (!current[pluginId] || hashStableJson(current[pluginId]) !== installHash) throw new Error(`Plugin ${pluginId} changed during batch settlement`);
			targets.set(pluginId, {
				pluginId,
				installHash,
				sourceDigests: commit.sourceDigests
			});
		}
		this.targets = [...targets.values()].toSorted((a, b) => a.pluginId.localeCompare(b.pluginId));
		this.phase = "prepared";
	}
	/** The caller must leave every batch lease before invoking the captured runtime client. */
	async finish(warn) {
		if (this.phase !== "prepared" || !this.databasePath || hasPluginLifecycleLease()) throw new Error("Plugin batch was not prepared or its handoff already started");
		this.phase = "applying";
		const targets = this.targets;
		let application;
		try {
			if (targets.length === 0) return;
			application = await this.reload(targets);
			this.assertOpen();
			for (const warning of application.warnings ?? []) warn(warning);
			await withPluginLifecycleLease(this.options, async (lease) => {
				const assertCurrent = () => {
					this.assertOpen();
					lease.assertOwned();
					if (lease.databasePath !== this.databasePath) throw new Error("Plugin cleanup belongs to a different state database");
					const records = indexFromRow(readPersistedInstalledPluginIndexRowSync({ filePath: lease.databasePath })?.value_json)?.installRecords ?? {};
					for (const target of targets) {
						this.sourceChecks.get(target.pluginId)?.();
						if (!records[target.pluginId] || hashStableJson(records[target.pluginId]) !== target.installHash) throw new Error(`Plugin ${target.pluginId} changed before committed source cleanup`);
					}
				};
				for (const { commit, cleanups } of this.installs) {
					if (!commit || !targets.some((target) => target.pluginId === commit.pluginId)) continue;
					for (const cleanup of cleanups) {
						assertCurrent();
						await cleanup(assertCurrent, warn);
						assertCurrent();
					}
				}
			});
			return application;
		} catch (error) {
			throw new Error(`Plugin installations are saved: ${targets.map((target) => target.pluginId).join(", ")}. ` + (application ? `Gateway generation ${application.generation} was applied, but source cleanup failed. ` : "Runtime activation was not confirmed. ") + `Fix the reported issue, then run openclaw plugins reload <plugin-id> for each affected plugin. ${formatErrorMessage(error)}`, { cause: error });
		} finally {
			this.close();
		}
	}
};
//#endregion
//#region src/claws/plugin-runtime.ts
async function runClawPluginBatch(options, pluginCount, run, runtimeFailure) {
	if (!options.reloadPlugins || options.runtimeBatch) return await withPluginLifecycleLease(options, () => run(options.runtimeBatch));
	if (pluginCount > 64) throw new Error(`A live Claw requirement batch supports at most 64 plugin packages. Split the requirement batch before installing.`);
	const batch = new PluginInstallRuntimeBatch(options, options.reloadPlugins);
	let completed;
	const operation = await withPluginLifecycleLease(options, async (lease) => {
		let result;
		try {
			result = ok(await run(batch));
		} catch (error) {
			result = err(error);
		}
		completed = result;
		batch.prepare(lease);
		return result;
	}).catch((error) => {
		const committed = batch.hasCommitted;
		batch.close();
		if (!committed && !completed) throw error;
		throw runtimeFailure(error, completed ?? err(error));
	});
	try {
		const runtime = options.runtime ?? defaultRuntime;
		const application = await batch.finish((message) => runtime.log(message));
		if (application) runtime.log(`Plugin requirements applied in Gateway generation ${application.generation}.`);
	} catch (error) {
		throw runtimeFailure(error, operation);
	}
	if (!operation.ok) throw operation.error;
	return operation.value;
}
//#endregion
//#region src/claws/packages.ts
var ClawPackageInstallError = class extends Error {
	constructor(code, message, installedPackages, options) {
		super(message, options);
		this.code = code;
		this.installedPackages = installedPackages;
		this.name = "ClawPackageInstallError";
	}
};
function packageFromAction(action) {
	const details = action.details;
	if (details?.kind !== "skill" && details?.kind !== "plugin") throw new Error(`Package action ${JSON.stringify(action.id)} has no valid package kind.`);
	if (details.source !== "clawhub" || !details.ref || !details.version || !details.integrity || !normalizeClawHubSha256Integrity(details.integrity)) throw new Error(`Package action ${JSON.stringify(action.id)} is not a pinned ClawHub package with integrity.`);
	if (details.ownerAction !== "install" && details.ownerAction !== "reuse") throw new Error(`Package action ${JSON.stringify(action.id)} has no planned owner state.`);
	if (details.kind === "plugin" && !details.installId) throw new Error(`Package action ${JSON.stringify(action.id)} has no resolved plugin id.`);
	return {
		kind: details.kind,
		source: details.source,
		ref: details.ref,
		version: details.version,
		integrity: details.integrity,
		ownerAction: details.ownerAction,
		...details.extension ? { extension: details.extension } : {},
		...details.installId ? { installId: details.installId } : {},
		...details.riskWarning ? { riskWarning: details.riskWarning } : {}
	};
}
async function probeClawPluginArtifact(pkg, isolateFromLiveExtensions, deps) {
	const probePlugin = deps.probePlugin ?? installPluginFromClawHub;
	const request = {
		spec: `clawhub:${pkg.ref}@${pkg.version}`,
		dryRun: true
	};
	if (!isolateFromLiveExtensions) return await probePlugin(request);
	const probeExtensionsDir = await (deps.createProbeExtensionsDir?.() ?? mkdtemp(join(tmpdir(), "openclaw-claw-plugin-probe-")));
	try {
		return await probePlugin({
			...request,
			extensionsDir: probeExtensionsDir
		});
	} finally {
		try {
			await (deps.removeProbeExtensionsDir?.(probeExtensionsDir) ?? rm(probeExtensionsDir, {
				recursive: true,
				force: true
			}));
		} catch {}
	}
}
async function preflightClawPackage(pkg, workspaceDir, options = {}) {
	if (pkg.kind === "skill") {
		const result = await preflightSkillFromClawHub({
			workspaceDir,
			slug: pkg.ref,
			version: pkg.version
		});
		return result.ok ? result : {
			ok: false,
			code: result.code,
			message: result.error
		};
	}
	const result = await (options.deps?.preflightPlugin ?? preflightPluginInstall)({
		clawhubPackage: pkg.ref,
		rawSpec: `clawhub:${pkg.ref}@${pkg.version}`,
		expectedVersion: pkg.version
	});
	if (!result.ok && result.code !== "plugin_version_conflict") return {
		ok: false,
		code: result.code,
		message: result.error
	};
	const probe = await probeClawPluginArtifact(pkg, !(result.ok && result.action === "install"), options.deps ?? {});
	if (!probe.ok) return {
		ok: false,
		code: probe.code ?? "plugin_preflight_failed",
		message: probe.error
	};
	if (!probe.artifactInspection) return {
		ok: false,
		code: "plugin_artifact_inspection_unavailable",
		message: `Plugin ${pkg.ref}@${pkg.version} did not return canonical artifact inspection.`
	};
	if (probe.artifactInspection.format === "agent") return {
		ok: false,
		code: "plugin_artifact_format_unsupported",
		message: `Plugin ${pkg.ref}@${pkg.version} uses unsupported Claw extension format agent.`
	};
	const integrity = probe.clawhub.integrity ? normalizeClawHubSha256Integrity(probe.clawhub.integrity) : null;
	if (!integrity) return {
		ok: false,
		code: "plugin_integrity_unavailable",
		message: `Plugin ${pkg.ref}@${pkg.version} did not resolve an artifact integrity.`
	};
	const requirements = resolveClawPluginSetupRequirements({
		pluginId: probe.pluginId,
		setup: probe.setup,
		env: options.env ?? process.env
	});
	if (!result.ok) return {
		ok: false,
		code: result.code,
		installedVersion: result.installedVersion,
		integrity,
		installId: probe.pluginId,
		...requirements.length > 0 ? { requirements } : {},
		detectedFormat: probe.artifactInspection.format,
		mapped: probe.artifactInspection.mapped,
		unavailable: probe.artifactInspection.unavailable,
		adapterIdentity: PLUGIN_ARTIFACT_ADAPTER_IDENTITY,
		...probe.warning ? { warning: probe.warning } : {},
		message: `Plugin ${pkg.ref}@${pkg.version} conflicts with installed version ${result.installedVersion}.`
	};
	if (result.action === "reuse" && (result.installedId !== probe.pluginId || !result.installedIntegrity || normalizeClawHubSha256Integrity(result.installedIntegrity) !== integrity)) return {
		ok: false,
		code: "plugin_integrity_conflict",
		message: `Plugin ${pkg.ref}@${pkg.version} is installed as ${result.installedId} with integrity ${result.installedIntegrity ?? "unknown"}, expected ${probe.pluginId} with ${integrity}.`
	};
	return {
		ok: true,
		action: result.action,
		integrity,
		installId: probe.pluginId,
		...result.action === "reuse" && result.installedIntegrity ? { installedIntegrity: result.installedIntegrity } : {},
		...result.action === "reuse" && result.installedAt ? { installedAt: result.installedAt } : {},
		...requirements.length > 0 ? { requirements } : {},
		detectedFormat: probe.artifactInspection.format,
		mapped: probe.artifactInspection.mapped,
		unavailable: probe.artifactInspection.unavailable,
		adapterIdentity: PLUGIN_ARTIFACT_ADAPTER_IDENTITY,
		...probe.warning ? { warning: probe.warning } : {}
	};
}
async function installClawPackages(plan, options = {}) {
	const pluginCount = plan.actions.filter((action) => action.kind === "package" && action.details?.kind === "plugin").length;
	if (!pluginCount) return await installClawPackagesUnlocked(plan, options);
	return await runClawPluginBatch(options, pluginCount, (runtimeBatch) => installClawPackagesUnlocked(plan, {
		...options,
		runtimeBatch
	}), (failure, operation) => {
		const original = !operation.ok && operation.error instanceof ClawPackageInstallError ? operation.error : void 0;
		return new ClawPackageInstallError(original?.code ?? "package_runtime_failed", [original?.message, coerceErrorMessage(failure)].filter(Boolean).join("\n"), original?.installedPackages ?? (operation.ok ? operation.value : []), { cause: !operation.ok ? new AggregateError([operation.error, failure]) : failure });
	});
}
async function installClawPackagesUnlocked(plan, options) {
	const deps = options.deps ?? {};
	const runtime = options.runtime ?? defaultRuntime;
	const installPlugin = deps.installPlugin ?? (async (params) => {
		const result = await installManagedPlugin(params);
		for (const warning of result.warnings ?? []) runtime.log(warning);
		runtime.log(`Installed plugin requirement: ${result.plugin.id}`);
		if (!params.deferRuntime && !params.applyRuntime) runtime.log("Restart the gateway to load plugins.");
	});
	const uninstallPlugin = deps.uninstallPlugin ?? (async (params) => {
		const result = await uninstallPluginWithPolicy(params);
		if (!result.ok) throw new Error(result.error);
		runtime.log(`Rolled back plugin requirement: ${result.value.pluginId}`);
	});
	const installSkill = deps.installSkill ?? installSkillFromClawHub;
	const preflightPlugin = deps.preflightPlugin ?? preflightPluginInstall;
	const preflightSkill = deps.preflightSkill ?? preflightSkillFromClawHub;
	const persistPackageRef = deps.persistPackageRef ?? persistClawPackageRef;
	const completePackageRef = deps.completePackageRef ?? updateClawPackageRefStatus;
	const readPackageRefs = deps.readPackageRefs ?? readClawPackageRefs;
	const acquirePackageLease = deps.acquirePackageLease ?? acquireClawPackageLifecycleLease;
	const resolvePlugin = deps.resolvePlugin ?? resolveInstalledClawHubPlugin;
	const installedPackages = [];
	const installedPlugins = [];
	for (const action of plan.actions.filter((candidate) => candidate.kind === "package")) {
		let packageLease = null;
		try {
			const pkg = packageFromAction(action);
			const acquiredLease = acquirePackageLease(pkg.kind === "skill" ? {
				kind: pkg.kind,
				source: pkg.source,
				ref: pkg.ref,
				workspace: plan.agent.workspace
			} : {
				kind: pkg.kind,
				source: pkg.source,
				ref: pkg.ref
			}, {
				env: options.env,
				path: options.path,
				required: true
			});
			if (!acquiredLease) throw new Error(`Could not acquire package lifecycle lease for ${pkg.ref}.`);
			packageLease = maintainClawPackageLifecycleLease(acquiredLease);
			if (pkg.kind === "skill") {
				const preflight = await preflightSkill({
					workspaceDir: plan.agent.workspace,
					slug: pkg.ref,
					version: pkg.version,
					expectedIntegrity: pkg.integrity
				});
				packageLease.assertCurrent();
				if (!preflight.ok) throw new Error(preflight.error);
				if (preflight.action !== pkg.ownerAction || preflight.warning !== pkg.riskWarning || normalizeClawHubSha256Integrity(preflight.integrity) !== normalizeClawHubSha256Integrity(pkg.integrity)) throw new ClawPackageInstallError("package_owner_state_changed", `Skill ${pkg.ref}@${pkg.version} changed after planning; run add --dry-run again.`, installedPackages);
				if (preflight.action === "reuse") {
					installedPackages.push(persistPackageRef(plan, pkg, {
						...options,
						status: "complete",
						relationship: "managed",
						origin: "pre-existing",
						independentOwner: true
					}));
					continue;
				}
				let packageRef = persistPackageRef(plan, pkg, {
					...options,
					status: "pending",
					relationship: "managed",
					origin: "claw-introduced",
					independentOwner: false
				});
				installedPackages.push(packageRef);
				options.onExternalMutation?.(pkg);
				const installed = await installSkill({
					workspaceDir: plan.agent.workspace,
					slug: pkg.ref,
					version: pkg.version,
					expectedIntegrity: pkg.integrity,
					clawManaged: true
				});
				packageLease.assertCurrent();
				if (!installed.ok) throw new Error(installed.error);
				packageRef = completePackageRef(packageRef, "complete", options);
				installedPackages[installedPackages.length - 1] = packageRef;
				continue;
			}
			const preflight = await preflightPlugin({
				clawhubPackage: pkg.ref,
				rawSpec: `clawhub:${pkg.ref}@${pkg.version}`,
				expectedVersion: pkg.version
			});
			packageLease.assertCurrent();
			if (!preflight.ok) throw new Error(preflight.code === "plugin_version_conflict" ? `Plugin ${pkg.ref}@${pkg.version} conflicts with installed version ${preflight.installedVersion}.` : preflight.error);
			const resumableRequirement = pkg.ownerAction === "install" && preflight.action === "reuse" ? findResumableIntroducedPluginRequirement({
				agentId: plan.agent.finalId,
				pkg,
				preflight,
				expectedIntegrity: pkg.integrity,
				refs: readPackageRefs({
					...options,
					agentId: plan.agent.finalId,
					kind: pkg.kind,
					source: pkg.source,
					ref: pkg.ref,
					version: pkg.version
				})
			}) : void 0;
			if (preflight.action !== pkg.ownerAction && !resumableRequirement) throw new ClawPackageInstallError("package_owner_state_changed", `Plugin ${pkg.ref}@${pkg.version} owner state changed from ${pkg.ownerAction} to ${preflight.action}; run add --dry-run again.`, installedPackages);
			const probe = await probeClawPluginArtifact(pkg, true, { probePlugin: deps.probePlugin });
			packageLease.assertCurrent();
			if (!probe.ok) throw new Error(probe.error);
			const probeIntegrity = probe.clawhub.integrity ? normalizeClawHubSha256Integrity(probe.clawhub.integrity) : null;
			const plannedExtensionInspection = pkg.extension ? {
				detectedFormat: pkg.extension.detectedFormat,
				mapped: pkg.extension.mapped,
				unavailable: pkg.extension.unavailable,
				adapterIdentity: pkg.extension.adapterIdentity
			} : void 0;
			const probedExtensionInspection = probe.artifactInspection ? {
				detectedFormat: probe.artifactInspection.format,
				mapped: probe.artifactInspection.mapped,
				unavailable: probe.artifactInspection.unavailable,
				adapterIdentity: PLUGIN_ARTIFACT_ADAPTER_IDENTITY
			} : void 0;
			if (probe.pluginId !== pkg.installId || probeIntegrity !== normalizeClawHubSha256Integrity(pkg.integrity) || probe.warning !== pkg.riskWarning || plannedExtensionInspection && stableStringify(probedExtensionInspection) !== stableStringify(plannedExtensionInspection)) throw new ClawPackageInstallError("package_owner_state_changed", `Plugin ${pkg.ref}@${pkg.version} identity or trust state changed after planning; run add --dry-run again.`, installedPackages);
			if (preflight.action === "reuse") {
				if (preflight.installedId !== pkg.installId || !preflight.installedIntegrity || normalizeClawHubSha256Integrity(preflight.installedIntegrity) !== normalizeClawHubSha256Integrity(pkg.integrity)) throw new ClawPackageInstallError("package_owner_state_changed", `Plugin ${pkg.ref}@${pkg.version} identity changed after planning; run add --dry-run again.`, installedPackages);
				if (resumableRequirement) {
					options.runtimeBatch?.retain(probe.pluginId);
					installedPackages.push(persistPackageRef(plan, pkg, {
						...options,
						status: "complete",
						relationship: resumableRequirement.relationship,
						origin: resumableRequirement.origin,
						independentOwner: resumableRequirement.independentOwner
					}));
					continue;
				}
				const existingRefs = readPackageRefs({
					...options,
					kind: pkg.kind,
					source: pkg.source,
					ref: pkg.ref,
					version: pkg.version
				});
				const inheritsClawOrigin = existingRefs.length > 0 && existingRefs.every((candidate) => candidate.origin === "claw-introduced" && !candidate.independentOwner) && !ownerInstallIsNewerThanRefs(preflight.installedAt, existingRefs);
				installedPackages.push(persistPackageRef(plan, pkg, {
					...options,
					status: "complete",
					relationship: "referenced",
					origin: inheritsClawOrigin ? "claw-introduced" : "pre-existing",
					independentOwner: !inheritsClawOrigin
				}));
				continue;
			}
			let packageRef = persistPackageRef(plan, pkg, {
				...options,
				status: "pending",
				relationship: "referenced",
				origin: "claw-introduced",
				independentOwner: false
			});
			installedPackages.push(packageRef);
			options.onExternalMutation?.(pkg);
			await installPlugin({
				request: {
					source: "clawhub",
					packageName: pkg.ref,
					version: pkg.version,
					mode: options.pluginInstallMode ?? "install",
					expectedIntegrity: pkg.integrity,
					expectedPluginId: probe.pluginId
				},
				env: options.env,
				beforePersistentApply: packageLease.assertCurrent,
				logger: createPluginInstallLogger(runtime),
				confirmInstall: resolveClawHubInstallConfirmation(),
				...resolvePluginCapabilityConsentCliOptions({
					action: "install",
					runtime
				}),
				invalidateRuntimeCache: false,
				clawManaged: true,
				deferRuntime: options.runtimeBatch?.install()
			});
			if (options.pluginInstallMode !== "update") installedPlugins.push({
				installId: probe.pluginId,
				packageIndex: installedPackages.length - 1
			});
			packageLease.assertCurrent();
			packageRef = completePackageRef(packageRef, "complete", options);
			installedPackages[installedPackages.length - 1] = packageRef;
		} catch (error) {
			try {
				packageLease?.release();
				packageLease = null;
			} catch {}
			const pending = installedPackages.at(-1);
			if (pending?.status === "pending") try {
				installedPackages[installedPackages.length - 1] = completePackageRef(pending, "failed", options);
			} catch {}
			const rollbackErrors = [];
			for (const installedPlugin of installedPlugins.toReversed()) {
				const packageRef = installedPackages[installedPlugin.packageIndex];
				if (!packageRef) continue;
				let rollbackLease = null;
				try {
					const acquiredRollbackLease = acquirePackageLease({
						kind: "plugin",
						source: "clawhub",
						ref: packageRef.ref
					}, {
						env: options.env,
						path: options.path,
						required: true
					});
					if (!acquiredRollbackLease) throw new Error(`Could not acquire package lifecycle lease for ${packageRef.ref}.`, { cause: error });
					rollbackLease = maintainClawPackageLifecycleLease(acquiredRollbackLease);
					if (readPackageRefs({
						...options,
						kind: "plugin",
						source: "clawhub",
						ref: packageRef.ref,
						version: packageRef.version,
						integrity: packageRef.integrity
					}).filter((ref) => ref.agentId !== plan.agent.finalId && (ref.status === "pending" || ref.status === "complete")).length > 0) {
						rollbackErrors.push(`kept plugin ${installedPlugin.installId} because another Claw now references it`);
						continue;
					}
					const currentRefs = readPackageRefs({
						...options,
						kind: "plugin",
						source: "clawhub",
						ref: packageRef.ref,
						version: packageRef.version
					});
					if (currentRefs.some((candidate) => candidate.independentOwner)) {
						rollbackErrors.push(`kept plugin ${installedPlugin.installId} because it now has a direct owner`);
						continue;
					}
					const installed = await resolvePlugin({ clawhubPackage: packageRef.ref });
					const installedIntegrity = installed.status === "found" && installed.record.integrity ? normalizeClawHubSha256Integrity(installed.record.integrity) : null;
					if (installed.status !== "found" || installed.pluginId !== installedPlugin.installId || installed.installedVersion !== packageRef.version || installedIntegrity !== normalizeClawHubSha256Integrity(packageRef.integrity) || ownerInstallIsNewerThanRefs(installed.record.installedAt, currentRefs)) {
						rollbackErrors.push(`kept plugin ${installedPlugin.installId} because its installed identity changed after Claw installation`);
						continue;
					}
					await uninstallPlugin({
						pluginId: installedPlugin.installId,
						caller: "cli",
						invalidateRuntimeCache: false,
						clawManaged: true,
						beforePersistentApply: rollbackLease.assertCurrent,
						onWarning: (warning) => runtime.log(warning),
						deferRuntime: options.runtimeBatch?.install()
					});
					rollbackLease.assertCurrent();
					installedPackages[installedPlugin.packageIndex] = completePackageRef(installedPackages[installedPlugin.packageIndex] ?? packageRef, "rolled_back", options);
				} catch (rollbackError) {
					rollbackErrors.push(`could not remove plugin ${installedPlugin.installId}: ${coerceErrorMessage(rollbackError)}`);
					continue;
				} finally {
					try {
						rollbackLease?.release();
					} catch {}
				}
			}
			const message = coerceErrorMessage(error);
			if (rollbackErrors.length > 0) throw new ClawPackageInstallError("package_rollback_failed", `${message} Rollback incomplete: ${rollbackErrors.join("; ")}.`, installedPackages, { cause: error });
			throw new ClawPackageInstallError(error instanceof ClawPackageInstallError ? error.code : "package_install_failed", message, installedPackages, { cause: error });
		} finally {
			try {
				packageLease?.release();
			} catch {}
		}
	}
	return installedPackages;
}
//#endregion
//#region src/claws/add.ts
const CLAW_ADD_RESULT_SCHEMA_VERSION = "openclaw.clawAddResult.v1";
var ClawAddMutationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "ClawAddMutationError";
	}
};
function markInstallStatus(agentId, status, expectedStatuses, options) {
	(options.updateRecord ?? updateClawInstallRecordStatus)(agentId, status, {
		...options,
		expectedStatuses
	});
}
function clearUnownedInstallRecord(agentId, expectedStatuses, options) {
	(options.deleteRecord ?? deleteClawInstallRecord)(agentId, {
		...options,
		expectedStatuses
	});
}
function workspacePathKey(value) {
	return process.platform === "win32" ? normalizeWindowsPathForComparison(value) : value;
}
function assertWorkspacePathUnchanged(workspace) {
	const canonicalWorkspace = resolvePathViaExistingAncestorSync(workspace);
	if (workspacePathKey(canonicalWorkspace) !== workspacePathKey(workspace)) throw new ClawAddMutationError("workspace_path_changed", `Workspace ancestry changed after planning: expected ${JSON.stringify(workspace)}, resolved ${JSON.stringify(canonicalWorkspace)}.`);
}
function partialResult(params) {
	return {
		schemaVersion: CLAW_ADD_RESULT_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		dryRun: false,
		mutationAllowed: true,
		planIntegrity: params.plan.planIntegrity,
		status: "partial",
		claw: params.plan.claw,
		agent: params.plan.agent,
		workspaceCreated: params.workspaceCreated,
		configCommitted: params.configCommitted,
		workspaceFiles: params.workspaceFiles ?? [],
		packages: params.packages ?? [],
		mcpServers: params.mcpServers ?? [],
		cronJobs: params.cronJobs ?? [],
		installRecord: {
			...params.installRecord,
			status: params.installStatus ?? "partial",
			updatedAtMs: params.nowMs ?? Date.now()
		},
		error: params.error
	};
}
async function applyClawAddPlan(plan, options = {}) {
	if (plan.blockers.length > 0) throw new ClawAddMutationError("plan_blocked", "The Claw add plan contains blockers.");
	if (hasUnsupportedMutationActions(plan)) throw new ClawAddMutationError("unsupported_components", "This build cannot add one or more declared Claw component kinds.");
	if (options.consentPlanIntegrity !== (options.resumePlan?.planIntegrity ?? plan.planIntegrity)) throw new ClawAddMutationError("plan_integrity_mismatch", "Consent does not match the current Claw add plan; run add --dry-run again.");
	const persistRecord = options.persistRecord ?? persistClawInstallRecord;
	let installRecord;
	try {
		installRecord = persistRecord(plan, {
			...options,
			status: "pending",
			expectedExistingRecord: options.resumeRecord,
			expectedExistingPlan: options.resumePlan,
			deferLegacyPlanUpgrade: options.resumePlan !== void 0
		});
	} catch (error) {
		throw new ClawAddMutationError("provenance_failed", error.message);
	}
	const workspace = resolve(resolveUserPath(plan.agent.workspace));
	const workspacePhaseRecorded = statusAtLeast(installRecord.status, "workspace_ready");
	let workspaceState;
	try {
		assertWorkspacePathUnchanged(workspace);
		workspaceState = await lstat(workspace).catch((error) => {
			if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return;
			throw error;
		});
	} catch (error) {
		clearUnownedInstallRecord(plan.agent.finalId, ["pending", "partial"], options);
		if (error instanceof ClawAddMutationError) throw error;
		throw new ClawAddMutationError("workspace_parent_failed", `Could not inspect workspace ${JSON.stringify(workspace)}: ${error.message}`);
	}
	if (!workspacePhaseRecorded && workspaceState) {
		markInstallStatus(plan.agent.finalId, "partial", ["pending", "partial"], options);
		return partialResult({
			plan,
			installRecord,
			workspaceCreated: false,
			configCommitted: false,
			packages: [],
			error: {
				code: "workspace_collision",
				message: `Workspace ${JSON.stringify(workspace)} was created after planning.`
			},
			nowMs: options.nowMs
		});
	}
	if (workspaceState && !workspaceState.isDirectory()) throw new ClawAddMutationError("workspace_collision", `Workspace ${JSON.stringify(workspace)} is no longer a directory.`);
	let workspaceCreated = workspaceState?.isDirectory() ?? false;
	let configCommitted = statusAtLeast(installRecord.status, "config_committed");
	const installPackages = options.installPackages ?? installClawPackages;
	let packages = [];
	const preserveRecordedPhaseOrMarkPartial = () => {
		if (workspacePhaseRecorded) return installRecord.status;
		markInstallStatus(plan.agent.finalId, "partial", ["pending", "partial"], options);
		return "partial";
	};
	const hostRequirementPlan = planWithPackageActions(plan, (action) => action.details?.kind === "plugin");
	if (hostRequirementPlan.actions.filter((action) => action.kind === "package").length > 0) try {
		packages = await installPackages(hostRequirementPlan, options);
	} catch (error) {
		const packageError = error instanceof ClawPackageInstallError ? error : new ClawPackageInstallError("package_install_failed", coerceErrorMessage(error), packages);
		const installStatus = preserveRecordedPhaseOrMarkPartial();
		return partialResult({
			plan,
			installRecord,
			workspaceCreated,
			configCommitted,
			packages: packageError.installedPackages,
			installStatus,
			error: {
				code: packageError.code,
				message: packageError.message
			},
			nowMs: options.nowMs
		});
	}
	try {
		assertWorkspacePathUnchanged(workspace);
		await mkdir(dirname(workspace), { recursive: true });
		assertWorkspacePathUnchanged(workspace);
	} catch (error) {
		if (packages.length > 0) {
			const installStatus = preserveRecordedPhaseOrMarkPartial();
			return partialResult({
				plan,
				installRecord,
				workspaceCreated,
				configCommitted,
				packages,
				installStatus,
				error: {
					code: error instanceof ClawAddMutationError ? error.code : "workspace_parent_failed",
					message: error instanceof ClawAddMutationError ? error.message : `Could not create parent directory for workspace ${JSON.stringify(workspace)}: ${error.message}`
				},
				nowMs: options.nowMs
			});
		}
		clearUnownedInstallRecord(plan.agent.finalId, ["pending", "partial"], options);
		if (error instanceof ClawAddMutationError) throw error;
		throw new ClawAddMutationError("workspace_parent_failed", `Could not create parent directory for workspace ${JSON.stringify(workspace)}: ${error.message}`);
	}
	if (!workspaceCreated) {
		try {
			await mkdir(workspace);
			workspaceCreated = true;
		} catch (error) {
			markInstallStatus(plan.agent.finalId, "partial", ["pending", "partial"], options);
			return partialResult({
				plan,
				installRecord,
				workspaceCreated: false,
				configCommitted: false,
				packages,
				error: {
					code: "workspace_collision",
					message: `Could not create new workspace ${JSON.stringify(workspace)}: ${error.message}`
				},
				nowMs: options.nowMs
			});
		}
		try {
			if (!workspacePhaseRecorded) markInstallStatus(plan.agent.finalId, "workspace_ready", [
				"pending",
				"partial",
				"workspace_ready"
			], options);
		} catch (error) {
			if (await rmdir(workspace).then(() => true).catch(() => false)) try {
				clearUnownedInstallRecord(plan.agent.finalId, ["pending", "partial"], options);
			} catch {}
			throw new ClawAddMutationError("provenance_failed", error.message);
		}
	}
	try {
		await (options.seedPackageBootstrap ?? seedClawPackageBootstrap)(plan, {
			...options,
			...options.nowMs !== void 0 ? { nowMs: options.nowMs } : {}
		});
	} catch (error) {
		const installStatus = configCommitted ? "config_committed" : "workspace_ready";
		markInstallStatus(plan.agent.finalId, installStatus, configCommitted ? ["config_committed"] : ["workspace_ready", "config_committed"], options);
		return partialResult({
			plan,
			installRecord,
			workspaceCreated,
			configCommitted,
			packages,
			installStatus,
			error: {
				code: error instanceof ClawBootstrapWriteError ? error.code : "bootstrap_write_failed",
				message: coerceErrorMessage(error)
			},
			nowMs: options.nowMs
		});
	}
	try {
		await (options.commitConfig ?? (async (transform) => {
			await transformConfigFileWithRetry({
				afterWrite: { mode: "auto" },
				transform: (config) => ({ nextConfig: transform(config) })
			});
		}))((config) => {
			const existingAgents = listAgentEntries(config);
			const agentsToPreserve = existingAgents.length > 0 ? existingAgents : [{
				id: DEFAULT_AGENT_ID,
				default: true
			}];
			const configWithPreservedAgents = {
				...config,
				agents: {
					...config.agents,
					entries: Object.fromEntries(agentsToPreserve.map(({ id, ...entry }) => [id, entry]))
				}
			};
			const normalizedAgentId = normalizeAgentId(plan.agent.finalId);
			const existingAgent = agentsToPreserve.find((agent) => normalizeAgentId(agent.id) === normalizedAgentId);
			if (existingAgent) {
				if (sameCommittedAgent(existingAgent, plan)) return config;
				const nextConfig = replaceLegacyCommittedAgent({
					config: configWithPreservedAgents,
					agents: agentsToPreserve,
					normalizedAgentId,
					plan,
					resumePlan: options.resumePlan,
					resumeRecord: options.resumeRecord,
					matchesPlan: sameCommittedAgent
				});
				if (nextConfig) return nextConfig;
				throw new ClawAddMutationError("agent_id_collision", "Agent " + JSON.stringify(plan.agent.finalId) + " was created after planning.");
			}
			if (findOverlappingWorkspaceAgentIds(configWithPreservedAgents, plan.agent.finalId, workspace).length > 0) throw new ClawAddMutationError("workspace_collision", "Workspace " + JSON.stringify(workspace) + " is already assigned to an agent.");
			return {
				...config,
				agents: {
					...config.agents,
					entries: Object.fromEntries([...agentsToPreserve, plan.agent.config].map(({ id, ...entry }) => [id, entry]))
				}
			};
		});
		configCommitted = true;
		try {
			recordAgentProvenance(plan.agent.finalId, { createdVia: "claw" }, options);
		} catch (error) {
			throw new ClawAddMutationError("provenance_failed", coerceErrorMessage(error));
		}
		if (options.resumePlan && installRecord.schemaVersion === "openclaw.clawInstallRecord.v1") installRecord = persistRecord(plan, {
			...options,
			status: "pending",
			expectedExistingRecord: options.resumeRecord,
			expectedExistingPlan: options.resumePlan
		});
		markInstallStatus(plan.agent.finalId, "config_committed", ["workspace_ready", "config_committed"], options);
	} catch (error) {
		let installStatus = "workspace_ready";
		if (!configCommitted) {
			if (await rmdir(workspace).then(() => true).catch(() => false)) {
				workspaceCreated = false;
				installStatus = "partial";
				markInstallStatus(plan.agent.finalId, "partial", ["workspace_ready", "partial"], options);
			}
		}
		return partialResult({
			plan,
			installRecord,
			workspaceCreated,
			configCommitted,
			packages,
			installStatus,
			error: {
				code: error instanceof ClawAddMutationError ? error.code : "config_commit_failed",
				message: coerceErrorMessage(error)
			},
			nowMs: options.nowMs
		});
	}
	const createFiles = options.createWorkspaceFiles ?? createClawWorkspaceFiles;
	let workspaceFiles = [];
	try {
		workspaceFiles = await createFiles(plan, options);
	} catch (error) {
		const workspaceError = error instanceof ClawWorkspaceWriteError ? error : new ClawWorkspaceWriteError([{
			level: "error",
			code: "workspace_file_io_error",
			phase: "mutation",
			path: "$.workspace",
			message: coerceErrorMessage(error)
		}], workspaceFiles);
		markInstallStatus(plan.agent.finalId, "config_committed", ["config_committed"], options);
		return {
			schemaVersion: CLAW_ADD_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			dryRun: false,
			mutationAllowed: true,
			planIntegrity: plan.planIntegrity,
			status: "partial",
			claw: plan.claw,
			agent: plan.agent,
			workspaceCreated,
			configCommitted,
			workspaceFiles: workspaceError.createdFiles,
			packages,
			mcpServers: [],
			cronJobs: [],
			installRecord: {
				...installRecord,
				status: "config_committed",
				updatedAtMs: options.nowMs ?? Date.now()
			},
			error: {
				code: "workspace_files_failed",
				message: workspaceError.message,
				diagnostics: workspaceError.diagnostics
			}
		};
	}
	let cronJobs = [];
	try {
		const workspacePackagePlan = planWithPackageActions(plan, (action) => action.details?.kind !== "plugin");
		if (workspacePackagePlan.actions.filter((action) => action.kind === "package").length > 0) {
			const workspacePackages = await installPackages(workspacePackagePlan, options);
			packages = [...packages, ...workspacePackages];
		}
	} catch (error) {
		const packageError = error instanceof ClawPackageInstallError ? error : new ClawPackageInstallError("package_install_failed", coerceErrorMessage(error), []);
		return partialResult({
			plan,
			installRecord,
			workspaceCreated,
			configCommitted,
			workspaceFiles,
			packages: [...packages, ...packageError.installedPackages],
			installStatus: "config_committed",
			error: {
				code: packageError.code,
				message: packageError.message
			},
			nowMs: options.nowMs
		});
	}
	const installMcpServers = options.installMcpServers ?? installClawMcpServers;
	let mcpServers = [];
	try {
		mcpServers = await installMcpServers(plan, options);
	} catch (error) {
		const mcpError = error instanceof ClawMcpInstallError ? error : new ClawMcpInstallError("mcp_install_failed", coerceErrorMessage(error), mcpServers);
		markInstallStatus(plan.agent.finalId, "config_committed", ["config_committed"], options);
		return partialResult({
			plan,
			installRecord,
			workspaceCreated,
			configCommitted,
			workspaceFiles,
			packages,
			mcpServers: mcpError.mcpServers,
			installStatus: "config_committed",
			error: {
				code: mcpError.code,
				message: mcpError.message
			},
			nowMs: options.nowMs
		});
	}
	const installCronJobs = options.installCronJobs ?? installClawCronJobs;
	try {
		cronJobs = await installCronJobs(plan, {
			...options,
			gateway: options.cronGateway
		});
	} catch (error) {
		const cronError = error instanceof ClawCronInstallError ? error : new ClawCronInstallError("cron_install_failed", coerceErrorMessage(error), cronJobs);
		markInstallStatus(plan.agent.finalId, "config_committed", ["config_committed"], options);
		return partialResult({
			plan,
			installRecord,
			workspaceCreated,
			configCommitted,
			workspaceFiles,
			packages,
			mcpServers,
			cronJobs: cronError.cronJobs,
			installStatus: "config_committed",
			error: {
				code: cronError.code,
				message: cronError.message
			},
			nowMs: options.nowMs
		});
	}
	try {
		markInstallStatus(plan.agent.finalId, "complete", ["config_committed", "complete"], options);
		return {
			schemaVersion: CLAW_ADD_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			dryRun: false,
			mutationAllowed: true,
			planIntegrity: plan.planIntegrity,
			status: "complete",
			claw: plan.claw,
			agent: plan.agent,
			workspaceCreated,
			configCommitted,
			packages,
			mcpServers,
			cronJobs,
			workspaceFiles,
			installRecord: {
				...installRecord,
				status: "complete",
				updatedAtMs: options.nowMs ?? Date.now()
			}
		};
	} catch (error) {
		return partialResult({
			plan,
			installRecord,
			workspaceCreated,
			configCommitted,
			workspaceFiles,
			packages,
			mcpServers,
			cronJobs,
			error: {
				code: "provenance_failed",
				message: error.message
			}
		});
	}
}
//#endregion
//#region src/claws/export.ts
const CLAW_EXPORT_RESULT_SCHEMA_VERSION = "openclaw.clawExportResult.v1";
const MAX_EXPORT_FILE_BYTES = 1048576;
function decodeUtf8(content) {
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(content);
	} catch {
		return;
	}
}
const DRIFTED_BOOTSTRAP_STATES = /* @__PURE__ */ new Set([
	"modified",
	"unsafe",
	"unknown"
]);
var ClawExportError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "ClawExportError";
	}
};
function portableAgent(agent, avatar) {
	const identity = {
		...agent.identity?.name ? { name: agent.identity.name } : {},
		...agent.identity?.theme ? { theme: agent.identity.theme } : {},
		...agent.identity?.emoji ? { emoji: agent.identity.emoji } : {},
		...avatar ? { avatar } : {}
	};
	return {
		id: agent.id,
		...agent.name ? { name: agent.name } : {},
		...agent.description ? { description: agent.description } : {},
		...Object.keys(identity).length > 0 ? { identity } : {}
	};
}
function portableOpenClawProfile(agent, extensions) {
	const configuredTools = {
		...agent.tools?.profile ? { profile: agent.tools.profile } : {},
		...agent.tools?.allow?.length ? { allow: agent.tools.allow } : {},
		...agent.tools?.alsoAllow?.length ? { alsoAllow: agent.tools.alsoAllow } : {},
		...agent.tools?.deny?.length ? { deny: agent.tools.deny } : {},
		...agent.tools?.fs?.workspaceOnly === true ? { fs: { workspaceOnly: true } } : {}
	};
	let tools = configuredTools;
	if (configuredTools.profile || configuredTools.allow?.length) try {
		tools = materializeClawToolProfile({ tools: configuredTools }).tools ?? {};
	} catch (error) {
		throw new ClawExportError("tool_profile_consent_required", `Could not freeze the exported tool profile: ${error.message}`);
	}
	const settings = {
		...agent.model !== void 0 ? { model: typeof agent.model === "string" ? { primary: agent.model } : agent.model } : {},
		...agent.subagents ? { subagents: {
			...agent.subagents.allowAgents !== void 0 ? { allowAgents: agent.subagents.allowAgents } : {},
			...agent.subagents.delegationMode !== void 0 ? { delegationMode: agent.subagents.delegationMode } : {}
		} } : {},
		...agent.groupChat?.mentionPatterns?.length ? { groupChat: { mentionPatterns: agent.groupChat.mentionPatterns } } : {},
		...agent.sandbox ? { sandbox: {
			...agent.sandbox.mode ? { mode: agent.sandbox.mode } : {},
			...agent.sandbox.scope ? { scope: agent.sandbox.scope } : {},
			...agent.sandbox.workspaceAccess ? { workspaceAccess: agent.sandbox.workspaceAccess } : {}
		} } : {},
		...Object.keys(tools).length > 0 ? { tools } : {},
		...agent.memory?.search ? { memory: { search: {
			...agent.memory.search.enabled !== void 0 ? { enabled: agent.memory.search.enabled } : {},
			...agent.memory.search.rememberAcrossConversations !== void 0 ? { rememberAcrossConversations: agent.memory.search.rememberAcrossConversations } : {},
			...agent.memory.search.sources?.length ? { sources: agent.memory.search.sources } : {}
		} } } : {},
		...agent.heartbeat ? { heartbeat: {
			...agent.heartbeat.every ? { every: agent.heartbeat.every } : {},
			...agent.heartbeat.activeHours ? { activeHours: {
				...agent.heartbeat.activeHours.start ? { start: agent.heartbeat.activeHours.start } : {},
				...agent.heartbeat.activeHours.end ? { end: agent.heartbeat.activeHours.end } : {},
				...agent.heartbeat.activeHours.timezone ? { timezone: agent.heartbeat.activeHours.timezone } : {}
			} } : {},
			...agent.heartbeat.lightContext !== void 0 ? { lightContext: agent.heartbeat.lightContext } : {},
			...agent.heartbeat.isolatedSession !== void 0 ? { isolatedSession: agent.heartbeat.isolatedSession } : {},
			...agent.heartbeat.timeoutSeconds !== void 0 ? { timeoutSeconds: agent.heartbeat.timeoutSeconds } : {}
		} } : {},
		...agent.humanDelay ? { humanDelay: {
			...agent.humanDelay.mode ? { mode: agent.humanDelay.mode } : {},
			...agent.humanDelay.minMs !== void 0 ? { minMs: agent.humanDelay.minMs } : {},
			...agent.humanDelay.maxMs !== void 0 ? { maxMs: agent.humanDelay.maxMs } : {}
		} } : {}
	};
	if (extensions.length === 0 && Object.keys(settings).length === 0) return;
	const parsed = parseClawOpenClawProfile({
		schemaVersion: 1,
		agent: settings,
		extensions
	});
	if (!parsed.ok) throw new ClawExportError("export_openclaw_profile_invalid", parsed.diagnostics.map((diagnostic) => diagnostic.message).join("; "));
	return parsed.profile;
}
function normalizedRelativePath(value) {
	return value.split(sep).join("/");
}
function comparePortableText(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
function isClawBootstrapFileName(value) {
	return CLAW_BOOTSTRAP_FILE_NAMES.includes(value);
}
function readPortableAvatar(params) {
	const source = params.agent.identity?.avatar?.trim();
	if (!source) return {};
	if (isAvatarHttpUrl(source)) return {};
	if (isAvatarDataUrl(source)) return isPortableClawAvatar(source) ? { source } : {};
	const opened = openLocalAgentAvatarFile({
		cfg: params.config,
		agentId: params.agent.id,
		source
	});
	if (!opened.ok) return {};
	try {
		const content = readFileDescriptorBoundedSync(opened.file.fd, AVATAR_MAX_BYTES);
		const path = normalizedRelativePath(relative(params.workspace, opened.file.path));
		return {
			source: path,
			sidecar: {
				path,
				content
			}
		};
	} catch {
		return {};
	} finally {
		closeSync(opened.file.fd);
	}
}
function derivativePackageVersion(manifest, contents) {
	const hash = createHash("sha256").update(JSON.stringify(manifest));
	for (const file of contents.toSorted((left, right) => comparePortableText(left.path, right.path))) hash.update(file.path).update("\0").update(file.content).update("\0");
	return `0.0.0-export.${hash.digest("hex")}`;
}
async function readAuthorBootstrap(path) {
	const resolvedPath = resolve(resolveUserPath(path));
	try {
		const read = await (await root(dirname(resolvedPath))).read(basename(resolvedPath), {
			hardlinks: "reject",
			maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES,
			nonBlockingRead: true,
			symlinks: "reject"
		});
		if (new TextDecoder("utf-8", { fatal: true }).decode(read.buffer).trim().length === 0) throw new ClawExportError("bootstrap_empty", "Export BOOTSTRAP.md must contain reviewed first-run instructions.");
		return read.buffer;
	} catch (error) {
		if (error instanceof ClawExportError) throw error;
		const tooLarge = error instanceof FsSafeError && error.code === "too-large";
		throw new ClawExportError(tooLarge ? "bootstrap_oversized" : "bootstrap_invalid", tooLarge ? `Export BOOTSTRAP.md exceeds ${MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES} bytes.` : `Could not read a safe UTF-8 BOOTSTRAP.md from ${JSON.stringify(resolvedPath)}: ${error.message}`);
	}
}
function portableMcpServer(server) {
	const common = {
		...server.toolFilter && typeof server.toolFilter === "object" ? { toolFilter: server.toolFilter } : {},
		...typeof server.timeout === "number" ? { timeout: server.timeout } : {},
		...typeof server.connectTimeout === "number" ? { connectTimeout: server.connectTimeout } : {}
	};
	if (typeof server.url === "string") {
		if (server.transport !== "sse" && server.transport !== "streamable-http") throw new Error("Managed remote MCP server has an unsupported transport.");
		return {
			url: server.url,
			transport: server.transport,
			...server.auth === "oauth" ? { auth: "oauth" } : {},
			...common
		};
	}
	if (typeof server.command !== "string") throw new Error("Managed MCP server has neither a command nor a remote URL.");
	return {
		command: server.command,
		...server.transport === "stdio" ? { transport: server.transport } : {},
		...Array.isArray(server.args) ? { args: server.args } : {},
		...server.env && typeof server.env === "object" ? { env: server.env } : {},
		...common
	};
}
async function exportClawAgent(agentId, outputDirectory, options) {
	const record = (await readClawStatus(agentId, options)).records.find((candidate) => candidate.install.agentId === agentId);
	if (!record) throw new ClawExportError("claw_not_found", `No installed Claw agent matches ${JSON.stringify(agentId)}.`);
	if (record.install.status !== "complete") throw new ClawExportError("install_incomplete", `Installed Claw agent ${JSON.stringify(agentId)} is in ${JSON.stringify(record.install.status)} state; finish or repair it before export.`);
	const agent = listAgentEntries(options.config).find((candidate) => candidate.id === agentId);
	if (!agent) throw new ClawExportError("agent_missing", `Installed Claw agent ${JSON.stringify(agentId)} is missing from config.`);
	const currentWorkspace = await realpath(resolve(resolveAgentWorkspaceDir(options.config, agentId))).catch(() => resolve(resolveAgentWorkspaceDir(options.config, agentId)));
	if (currentWorkspace !== record.install.workspace) throw new ClawExportError("workspace_changed", `Agent ${JSON.stringify(agentId)} now resolves to workspace ${JSON.stringify(currentWorkspace)} instead of its recorded Claw workspace ${JSON.stringify(record.install.workspace)}.`);
	if (record.agentState !== "present") throw new ClawExportError("agent_drifted", `Agent ${JSON.stringify(agentId)} no longer matches its recorded Claw configuration.`);
	const driftedFiles = record.workspaceFiles.filter((file) => file.state !== "unchanged");
	if (driftedFiles.length > 0) throw new ClawExportError("workspace_files_drifted", `Cannot export drifted managed files: ${driftedFiles.map((file) => `${file.path} (${file.state})`).join(", ")}.`);
	const driftedPackages = record.packages.filter((pkg) => pkg.state !== "present" || pkg.extensionCompatibility !== void 0 && pkg.extensionCompatibility.state !== "compatible");
	if (driftedPackages.length > 0) throw new ClawExportError("packages_drifted", `Cannot export drifted packages: ${driftedPackages.map((pkg) => `${pkg.kind}:${pkg.ref}@${pkg.version} (${pkg.extensionCompatibility?.state ?? pkg.state})`).join(", ")}.`);
	if (record.install.bootstrap && !options.bootstrapPath && DRIFTED_BOOTSTRAP_STATES.has(record.bootstrapState)) throw new ClawExportError("bootstrap_drifted", `Cannot export the package bootstrap ${JSON.stringify(record.bootstrap.path)} in ${JSON.stringify(record.bootstrapState)} state; restore the seeded file or pass a reviewed --bootstrap replacement.`);
	const unresolvedCronJobs = record.cronJobs.filter((cron) => cron.status !== "complete" || !cron.schedulerJobId);
	const unavailableMcpServers = record.mcpServers.filter((server) => server.state !== "present");
	if (unavailableMcpServers.length > 0) throw new ClawExportError("mcp_servers_unavailable", `Cannot export MCP servers with unresolved ownership or drift: ${unavailableMcpServers.map((server) => server.name).join(", ")}.`);
	if (unresolvedCronJobs.length > 0) throw new ClawExportError("cron_jobs_unavailable", `Cannot export cron declarations with unresolved ownership: ${unresolvedCronJobs.map((cron) => cron.manifestId).join(", ")}.`);
	const authorBootstrap = options.bootstrapPath ? await readAuthorBootstrap(options.bootstrapPath) : void 0;
	const workspace = await root(record.install.workspace, {
		hardlinks: "reject",
		maxBytes: MAX_EXPORT_FILE_BYTES,
		symlinks: "reject"
	});
	const allContents = await Promise.all(record.workspaceFiles.map(async (file) => ({
		path: normalizedRelativePath(file.path),
		content: await workspace.readBytes(file.path, { maxBytes: MAX_EXPORT_FILE_BYTES })
	})));
	const soul = allContents.find((file) => file.path === "SOUL.md");
	const decodedSoul = soul ? decodeUtf8(soul.content) : void 0;
	let clawMarkdownBody = soul && decodedSoul !== void 0 && decodedSoul.trim().length > 0 ? soul.content : void 0;
	const contents = allContents.filter((file) => file !== soul || !clawMarkdownBody);
	const avatar = readPortableAvatar({
		config: options.config,
		agent,
		workspace: record.install.workspace
	});
	const managedPaths = new Set(contents.map((file) => file.path));
	if (avatar.sidecar && !managedPaths.has(avatar.sidecar.path)) contents.push(avatar.sidecar);
	let pendingPackageBootstrap;
	if (!authorBootstrap && record.install.bootstrap && record.bootstrapState === "pending") {
		try {
			pendingPackageBootstrap = await workspace.readBytes("BOOTSTRAP.md", { maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES });
		} catch (error) {
			throw new ClawExportError("bootstrap_drifted", `Cannot export the package bootstrap because BOOTSTRAP.md changed after inspection: ${error.message}`);
		}
		if (`sha256:${createHash("sha256").update(pendingPackageBootstrap).digest("hex")}` !== record.install.bootstrap.contentDigest) throw new ClawExportError("bootstrap_drifted", "Cannot export the package bootstrap because BOOTSTRAP.md changed after inspection.");
	}
	const exportedBootstrap = authorBootstrap ?? pendingPackageBootstrap;
	const bootstrapFiles = {};
	const files = [];
	for (const file of contents) {
		const source = `workspace/${file.path}`;
		if (isClawBootstrapFileName(file.path)) bootstrapFiles[file.path] = { source };
		else files.push({
			source,
			path: file.path
		});
	}
	const configuredMcpServers = normalizeConfiguredMcpServers(options.sourceMcpServers ?? options.config.mcp?.servers);
	const openClawProfile = portableOpenClawProfile(agent, record.packages.filter((pkg) => pkg.extension).map((pkg) => ({
		id: pkg.extension.id,
		kind: "plugin",
		format: pkg.extension.format,
		source: pkg.source,
		ref: pkg.ref,
		version: pkg.version
	})).toSorted((left, right) => comparePortableText(left.id, right.id)));
	const openClawProfilePath = "profiles/openclaw.yml";
	const openClawProfileRaw = openClawProfile ? Buffer.from(stringify(openClawProfile)) : void 0;
	const portablePackages = record.packages.filter((pkg) => !pkg.extension).map((pkg) => ({
		kind: pkg.kind,
		source: pkg.source,
		ref: pkg.ref,
		version: pkg.version
	})).toSorted((left, right) => {
		return comparePortableText(`${left.kind}:${left.ref}:${left.version}`, `${right.kind}:${right.ref}:${right.version}`);
	});
	const manifest = {
		schemaVersion: 1,
		agent: portableAgent(agent, avatar.source),
		workspace: {
			bootstrapFiles,
			files
		},
		packages: portablePackages,
		mcpServers: Object.fromEntries(record.mcpServers.map((ref) => [ref.name, portableMcpServer(configuredMcpServers[ref.name])])),
		cronJobs: record.cronJobs.map((cron) => cron.job).toSorted((left, right) => left.id.localeCompare(right.id))
	};
	const serializeClawMarkdown = (body) => Buffer.concat([Buffer.from(`---\n${stringify(manifest)}---\n`), ...body ? [body] : []]);
	let clawMarkdownRaw = serializeClawMarkdown(clawMarkdownBody);
	if (clawMarkdownBody && clawMarkdownRaw.byteLength > 1048576) {
		clawMarkdownBody = void 0;
		contents.push(soul);
		bootstrapFiles["SOUL.md"] = { source: "workspace/SOUL.md" };
		clawMarkdownRaw = serializeClawMarkdown(void 0);
	}
	if (clawMarkdownRaw.byteLength > 1048576) throw new ClawExportError("claw_manifest_oversized", `Exported CLAW.md exceeds ${MAX_CLAW_MANIFEST_BYTES} bytes.`);
	if (contents.reduce((total, file) => total + file.content.byteLength, 0) + (clawMarkdownBody?.byteLength ?? 0) > 4194304) throw new ClawExportError("workspace_files_oversized", `Exported workspace content exceeds ${MAX_MANAGED_WORKSPACE_BYTES} aggregate bytes.`);
	const parsed = parseClawManifest(manifest);
	if (!parsed.ok) throw new ClawExportError("export_manifest_invalid", parsed.diagnostics.map((diagnostic) => diagnostic.message).join("; "));
	const target = resolve(resolveUserPath(outputDirectory));
	await mkdir(dirname(target), { recursive: true });
	try {
		await mkdir(target);
	} catch (error) {
		throw new ClawExportError("output_collision", `Export directory ${JSON.stringify(target)} must not already exist: ${error.message}`);
	}
	const filesWritten = [];
	try {
		const output = await root(target, {
			hardlinks: "reject",
			maxBytes: MAX_EXPORT_FILE_BYTES,
			symlinks: "reject"
		});
		for (const file of contents) {
			const path = `workspace/${file.path}`;
			await output.write(path, file.content, {
				mkdir: true,
				overwrite: false
			});
			filesWritten.push(path);
		}
		if (openClawProfileRaw) {
			await output.write(openClawProfilePath, openClawProfileRaw, {
				mkdir: true,
				overwrite: false
			});
			filesWritten.push(openClawProfilePath);
		}
		const packageJson = {
			name: `openclaw-claw-${record.install.agentId}`,
			version: derivativePackageVersion(manifest, [
				...contents,
				...clawMarkdownBody ? [{
					path: "CLAW.md#body",
					content: clawMarkdownBody
				}] : [],
				...openClawProfileRaw ? [{
					path: openClawProfilePath,
					content: openClawProfileRaw
				}] : [],
				...exportedBootstrap ? [{
					path: "BOOTSTRAP.md",
					content: exportedBootstrap
				}] : []
			]),
			type: "module",
			openclaw: { claw: "CLAW.md" }
		};
		await output.write("package.json", Buffer.from(`${JSON.stringify(packageJson, null, 2)}\n`), { overwrite: false });
		filesWritten.push("package.json");
		await output.write("CLAW.md", clawMarkdownRaw, { overwrite: false });
		filesWritten.push("CLAW.md");
		if (exportedBootstrap) {
			await output.write("BOOTSTRAP.md", exportedBootstrap, { overwrite: false });
			filesWritten.push("BOOTSTRAP.md");
		}
		const reread = await readClawManifestFile(target);
		if (!reread.ok) throw new ClawExportError("export_package_invalid", reread.diagnostics.map((diagnostic) => diagnostic.message).join("; "));
	} catch (error) {
		await rm(target, {
			recursive: true,
			force: true
		}).catch(() => void 0);
		if (error instanceof ClawExportError) throw error;
		throw new ClawExportError("export_write_failed", coerceErrorMessage(error));
	}
	return {
		schemaVersion: CLAW_EXPORT_RESULT_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		agentId,
		outputDirectory: target,
		manifest,
		...openClawProfile ? { openClawProfile } : {},
		filesWritten
	};
}
//#endregion
//#region src/cli/claws-cli-legacy-resume.ts
function authorizeLegacyV1Resume(params) {
	const finalAgentId = params.opts.agentId?.trim() || params.manifest.agent?.id?.trim();
	const consentPlanIntegrity = params.opts.planIntegrity?.trim();
	if (!finalAgentId || !consentPlanIntegrity) return;
	const record = readClawInstallRecord(finalAgentId);
	if (!record || record.schemaVersion !== "openclaw.clawInstallRecord.v1" || record.status === "complete" || record.planIntegrity !== consentPlanIntegrity || record.claw.kind !== params.source.kind || record.claw.name !== params.source.name || record.claw.version !== params.source.version || record.claw.packageRoot !== params.source.packageRoot || record.claw.manifestPath !== params.source.manifestPath) return;
	return record;
}
//#endregion
//#region src/cli/claws-cli.gateway-readiness.ts
const CLAW_AGENT_RELOAD_TIMEOUT_MS = 15e3;
const CLAW_AGENT_RELOAD_POLL_MS = 100;
async function waitUntilGatewayAgentAvailable(agentId) {
	const deadline = Date.now() + CLAW_AGENT_RELOAD_TIMEOUT_MS;
	let lastError;
	while (Date.now() < deadline) {
		try {
			const response = await callGatewayFromCli("config.get", { timeout: "5000" }, {});
			if (Object.hasOwn(response.config?.agents?.entries ?? {}, agentId) && typeof response.configRevisionHash === "string" && response.configRevisionHash === response.appliedConfigHash) return;
			lastError = void 0;
		} catch (error) {
			lastError = error;
		}
		await sleep(CLAW_AGENT_RELOAD_POLL_MS);
	}
	const suffix = lastError instanceof Error ? `: ${lastError.message}` : "";
	throw new Error(`Gateway did not apply the Claw agent configuration in time${suffix}`);
}
//#endregion
//#region src/cli/claws-cli.monitor-cleanup.ts
const binding = () => resolveClawMonitorCleanupBinding(resolveCronJobsStorePathFromConfig(getRuntimeConfig()));
const clawMonitorCleanupGateway = {
	inspect: async (agentId) => clawMonitorInventorySchema.parse(await callGatewayFromCli("claws.monitors", { timeout: "5000" }, {
		phase: "inspect",
		agentId,
		binding: binding()
	})).monitors,
	quiesce: async (agentId, operationId, monitors) => {
		clawMonitorDrainSchema.parse(await callGatewayFromCli("claws.monitors", {}, {
			phase: "quiesce",
			agentId,
			operationId,
			monitors,
			binding: binding()
		}));
	},
	drain: async (agentId, operationId) => {
		clawMonitorDrainSchema.parse(await callGatewayFromCli("claws.monitors", {}, {
			phase: "drain",
			agentId,
			operationId,
			binding: binding()
		}));
	}
};
//#endregion
//#region src/cli/claws-cli.package-removal.ts
const clawPackageRemovalGateway = async (request) => clawPackageRemovalResultSchema.parse(await callGatewayFromCli("claws.packages.remove", { timeout: "600000" }, {
	...request,
	binding: resolveClawMonitorCleanupBinding(resolveCronJobsStorePathFromConfig(getRuntimeConfig()))
}));
//#endregion
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
function digest$4(value) {
	return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}
function targetRef(params) {
	return {
		schemaVersion: CLAW_CRON_REF_SCHEMA_VERSION,
		agentId: params.agentId,
		manifestId: params.job.id,
		declarationKey: `claw:${params.agentId}:${params.job.id}`,
		...params.schedulerJobId ? { schedulerJobId: params.schedulerJobId } : {},
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
			if (previous && action.currentDigest && digest$4(previous.job) !== action.currentDigest) throw new ClawCronUpdateError(`Cron declaration ${JSON.stringify(action.id)} changed after planning.`);
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
	return `sha256:${createHash("sha256").update(stableStringify(persisted)).digest("hex")}`;
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
function digest$3(value) {
	return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}
function packageKey(value) {
	return `${value.kind}:${value.ref}`;
}
async function applyClawPackageUpdate(updatePlan, _targetManifest, targetAddPlan, options) {
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
	}).map((ref) => [packageKey(ref), ref]));
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
			})).find((ref) => packageKey(ref) === action.id && ref.version === target.version);
			if (!installed) throw new ClawPackageUpdateError(`Package installer did not return exact ownership for ${JSON.stringify(action.id)}.`, true);
			if (digest$3(installed) !== digest$3(claimed)) {
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
		digest: `sha256:${createHash("sha256").update(stableStringify(digestSource)).digest("hex")}`
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
	if (!Array.isArray(current) || !Array.isArray(desired)) return "neutral";
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
		if (!Array.isArray(current) || !Array.isArray(desired)) return desired === void 0 ? "reduction" : "escalation";
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
		const sandboxField = field[0] === "sandbox" ? field.slice(1) : void 0;
		const heartbeatField = field[0] === "heartbeat" ? field.slice(1) : void 0;
		const memorySearchField = field[0] === "memory" && field[1] === "search" ? field.slice(2) : void 0;
		const effectiveToolField = field[0] === "tools" && (field[1] === "profile" || field[1] === "alsoAllow" || field[1] === "fs") ? field.slice(1) : void 0;
		const currentValue = sandboxField ? getPath(params.currentSandbox, sandboxField) : heartbeatField ? getPath(params.currentHeartbeat, heartbeatField) : memorySearchField ? getPath(params.currentMemorySearch, memorySearchField) : effectiveToolField ? getPath(params.currentTools, effectiveToolField) : getPath(params.currentAgent, field);
		const desiredValue = sandboxField ? getPath(params.desiredSandbox, sandboxField) : heartbeatField ? getPath(params.desiredHeartbeat, heartbeatField) : memorySearchField ? getPath(params.desiredMemorySearch, memorySearchField) : effectiveToolField ? getPath(params.desiredTools, effectiveToolField) : getPath(params.desiredAgent, field);
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
	const comparisonEntries = entries.some((entry) => entry.default === true) ? entries : entries.map((entry) => entry.id === preferredDefaultAgentId ? {
		...entry,
		default: true
	} : entry);
	const { list: _legacyList, ...agents } = config.agents ?? {};
	return {
		...config,
		agents: {
			...agents,
			entries: toAgentEntriesRecord(comparisonEntries)
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
function mcpCapabilityChange(params) {
	if (params.action === "unchanged") return;
	const reduction = params.desired === void 0;
	return {
		kind: "mcpServer",
		id: params.id,
		path: `mcpServers.${params.id}`,
		action: params.action,
		classification: reduction ? "reduction" : "escalation",
		requiresDistinctConsent: !reduction,
		reason: reduction ? "Target manifest removes or releases an MCP tool surface." : "Target manifest adds, restores, or changes an MCP tool surface.",
		effect: params.desired === void 0 ? { removed: true } : summarizeMcpCapabilityEffect(params.desired),
		...params.current === void 0 ? {} : { current: capabilityValue(summarizeMcpCapability(params.current), params.current) },
		...params.desired === void 0 ? {} : { desired: capabilityValue(summarizeMcpCapability(params.desired), params.desired) }
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
function cronCapabilityChange(params) {
	if (params.action === "unchanged") return;
	const reduction = params.desired === void 0;
	return {
		kind: "cronJob",
		id: params.id,
		path: `cronJobs.${params.id}`,
		action: params.action,
		classification: reduction ? "reduction" : "escalation",
		requiresDistinctConsent: !reduction,
		reason: reduction ? "Target manifest removes a scheduled automation." : "Target manifest adds, restores, or changes a scheduled automation.",
		effect: params.desired === void 0 ? { removed: true } : summarizeCronCapabilityEffect(params.desired),
		...params.current === void 0 ? {} : { current: capabilityValue(summarizeCronCapability(params.current), params.current) },
		...params.desired === void 0 ? {} : { desired: capabilityValue(summarizeCronCapability(params.desired), params.desired) }
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
		summary: {
			totalActions: 0,
			added: 0,
			changed: 0,
			removed: 0,
			released: 0,
			unchanged: 0,
			manual: 0,
			blocked: 0,
			capabilityChanges: 0,
			capabilityEscalations: 0
		},
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
		planIntegrity: params.digest(plan)
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
//#region src/claws/update-plan.ts
function digest$2(value) {
	return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}
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
	const ownsDatabase = !params.stateOptions?.database;
	const database = params.stateOptions?.database ?? await openExistingOpenClawStateDatabaseReadOnly(params.stateOptions);
	if (!database) return makeEmptyClawUpdatePlan({
		agentId: params.agentId,
		source: params.targetSource,
		blockers: [diagnostic("claw_not_found", "$", `No installed Claw agent matches ${JSON.stringify(params.agentId)}.`)],
		diagnostics: params.diagnostics,
		digest: digest$2
	});
	if (!database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'claw_installs'").get()) {
		if (ownsDatabase) database.walMaintenance.close();
		return makeEmptyClawUpdatePlan({
			agentId: params.agentId,
			source: params.targetSource,
			blockers: [diagnostic("claw_not_found", "$", `No installed Claw agent matches ${JSON.stringify(params.agentId)}.`)],
			diagnostics: params.diagnostics,
			digest: digest$2
		});
	}
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
		if (status.records.length === 0) return makeEmptyClawUpdatePlan({
			agentId: params.agentId,
			source: params.targetSource,
			blockers: [diagnostic("claw_not_found", "$", `No installed Claw agent matches ${JSON.stringify(params.agentId)}.`)],
			diagnostics: params.diagnostics,
			digest: digest$2
		});
		if (status.records.length > 1) return makeEmptyClawUpdatePlan({
			agentId: params.agentId,
			source: params.targetSource,
			found: true,
			blockers: [diagnostic("claw_ambiguous", "$", `Claw name ${JSON.stringify(params.agentId)} matches multiple agents; use an agent id.`)],
			diagnostics: params.diagnostics,
			digest: digest$2
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
			diagnostics: params.diagnostics,
			digest: digest$2
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
		const desiredAgentDigest = digest$2(targetPlan.agent.config);
		const agentAction = record.agentState === "modified" ? "manual" : record.agentState === "missing" ? "change" : record.install.agentConfigDigest === desiredAgentDigest ? "unchanged" : "change";
		actions.push({
			kind: "agent",
			id: agentId,
			action: agentAction,
			target: `agents.entries[${JSON.stringify(agentId)}]`,
			blocked: agentAction === "manual",
			reason: agentAction === "manual" ? "Live agent config changed after installation and must be reconciled manually." : record.agentState === "missing" ? "Owned agent config is missing and would be restored from the target manifest." : agentAction === "unchanged" ? "Owned agent config already matches the target manifest." : "Target manifest changes owned agent config.",
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
				desiredDigest: digest$2({
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
			const capabilityChange = mcpCapabilityChange({
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
			const capabilityChange = mcpCapabilityChange({
				id: current.name,
				action,
				current: configuredMcpServers[current.name]
			});
			if (capabilityChange) capabilityChanges.push(capabilityChange);
		}
		const currentCron = new Map(record.cronJobs.map((cron) => [cron.manifestId, cron]));
		for (const target of params.targetManifest.cronJobs) {
			const current = currentCron.get(target.id);
			const desiredDigest = digest$2(target);
			const unresolved = current && (current.status !== "complete" || !current.schedulerJobId);
			const action = !current ? "add" : unresolved ? "manual" : digest$2(current.job) === desiredDigest ? "unchanged" : "change";
			actions.push({
				kind: "cronJob",
				id: target.id,
				action,
				target: current?.schedulerJobId ?? `claw:${agentId}:${target.id}`,
				blocked: action === "manual",
				reason: action === "manual" ? "Cron ownership is unresolved and must be reconciled with the gateway." : action === "unchanged" ? "Recorded cron declaration already matches the target manifest." : `Target manifest ${action === "add" ? "adds" : "changes"} this cron declaration.`,
				...current ? { currentDigest: digest$2(current.job) } : {},
				desiredDigest
			});
			const capabilityChange = cronCapabilityChange({
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
				currentDigest: digest$2(current.job)
			});
			const capabilityChange = cronCapabilityChange({
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
			planIntegrity: digest$2(plan)
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
function digest$1(content) {
	return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}
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
	const targetActions = new Map(targetAddPlan.actions.filter((action) => action.kind === "workspaceFile").map((action) => [action.id, action]));
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
			if (previousContent && action.currentDigest && digest$1(previousContent) !== action.currentDigest) throw new ClawWorkspaceUpdateError(`Workspace file ${JSON.stringify(path)} changed after planning.`);
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
			if (digest$1(content) !== target.digest || target.digest !== action.desiredDigest) throw new ClawWorkspaceUpdateError(`Workspace source for ${JSON.stringify(path)} changed after planning.`);
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
				if (digest$1(await workspace.readBytes(path, { maxBytes: MAX_UPDATE_FILE_BYTES })) !== target.digest) throw new Error(`Workspace file ${JSON.stringify(path)} changed before rollback.`);
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
function digest(value) {
	return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}
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
	const unsupported = actionable.filter((action) => action.kind !== "agent" && action.kind !== "workspaceFile" && action.kind !== "mcpServer" && action.kind !== "cronJob" && action.kind !== "package");
	if (unsupported.length > 0) throw new ClawUpdateMutationError("unsupported_update_actions", `This update slice cannot yet apply: ${unsupported.map((action) => `${action.kind}:${action.id}`).join(", ")}.`);
	if (!fresh.currentClaw || !fresh.targetClaw) throw new ClawUpdateMutationError("update_invalid", "The Claw update plan lacks identity.");
	const buildAddPlan = options.buildAddPlan ?? buildClawAddPlan;
	const currentInstall = (options.readInstall ?? readClawInstallRecord)(fresh.agentId, options);
	if (!currentInstall) throw new ClawUpdateMutationError("update_changed", "The Claw install record disappeared.");
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
		if (!target || action.desiredDigest !== digest({
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
		}, params.targetManifest, targetAddPlan, {
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
	const applyWorkspace = options.applyWorkspace ?? applyClawWorkspaceUpdate;
	let workspaceExecution;
	try {
		workspaceExecution = await applyWorkspace(fresh, targetAddPlan, options);
	} catch (error) {
		if (error instanceof ClawWorkspaceUpdateError && error.partial) throw partialMutation(error.message);
		if (retainedRequirementMutation) throw partialMutation(`${coerceErrorMessage(error)}; successfully realized shared requirements were retained`);
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
		if (retainedRequirementMutation) throw partialMutation(`${coerceErrorMessage(error)}; successfully realized shared requirements were retained`);
		throw new ClawUpdateMutationError("mcp_update_failed", coerceErrorMessage(error));
	}
	let packageExecution;
	try {
		packageExecution = await applyPackageActions(remainingPackageActions);
	} catch (error) {
		const rollbackFailures = await collectClawRollbackFailures([["MCP rollback failed", () => mcpExecution.rollback()], ["workspace rollback failed", () => workspaceExecution.rollback()]]);
		if (error instanceof ClawPackageUpdateError && error.partial) rollbackFailures.unshift("package artifact rollback is unavailable");
		if (rollbackFailures.length > 0) throw partialMutation(`${coerceErrorMessage(error)}; ${rollbackFailures.join("; ")}`);
		if (retainedRequirementMutation) throw partialMutation(`${coerceErrorMessage(error)}; successfully realized shared requirements were retained`);
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
	const rollbackAgent = async () => {
		if (!agentChanged) return;
		await commit((config) => {
			const current = listAgentEntries(config).find((agent) => agent.id === fresh.agentId);
			const targetDigest = `sha256:${createHash("sha256").update(stableStringify(targetAddPlan.agent.config)).digest("hex")}`;
			if ((current ? `sha256:${createHash("sha256").update(stableStringify(current)).digest("hex")}` : void 0) !== targetDigest) throw new Error("The agent changed before rollback.");
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
				if (`sha256:${createHash("sha256").update(stableStringify(current)).digest("hex")}` !== agentAction.currentDigest) throw new ClawUpdateMutationError("agent_changed", "The owned agent entry changed during update.");
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
		const rollbackFailures = await collectClawRollbackFailures([
			["agent rollback failed", () => rollbackAgent()],
			["package rollback incomplete", () => packageExecution.rollback()],
			["MCP rollback failed", () => mcpExecution.rollback()],
			["workspace rollback failed", () => workspaceExecution.rollback()]
		]);
		if (rollbackFailures.length > 0) throw partialMutation(`${coerceErrorMessage(error)}; ${rollbackFailures.join("; ")}`);
		if (retainedRequirementMutation) throw partialMutation(`${coerceErrorMessage(error)}; successfully realized shared requirements were retained`);
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
					...options,
					expectedClaw: fresh.currentClaw,
					status: "partial"
				});
			} catch (persistError) {
				throw partialMutation(`${error.message}; cron gateway mutation outcome is uncertain; provenance update failed: ${coerceErrorMessage(persistError)}`);
			}
			throw partialMutation(`${error.message}; cron gateway mutation outcome is uncertain`);
		}
		const rollbackFailures = await collectClawRollbackFailures([
			["agent rollback failed", () => rollbackAgent()],
			["package rollback incomplete", () => packageExecution.rollback()],
			["MCP rollback failed", () => mcpExecution.rollback()],
			["workspace rollback failed", () => workspaceExecution.rollback()]
		]);
		if (rollbackFailures.length > 0) throw partialMutation(`${coerceErrorMessage(error)}; ${rollbackFailures.join("; ")}`);
		if (retainedRequirementMutation) throw partialMutation(`${coerceErrorMessage(error)}; successfully realized shared requirements were retained`);
		throw new ClawUpdateMutationError("cron_update_failed", coerceErrorMessage(error));
	}
	let installRecord;
	try {
		installRecord = persistInstall(targetAddPlan, {
			...options,
			expectedClaw: fresh.currentClaw
		});
	} catch (error) {
		const rollbackFailures = await collectClawRollbackFailures([
			["agent rollback failed", () => rollbackAgent()],
			["package rollback incomplete", () => packageExecution.rollback()],
			["cron rollback failed", () => cronExecution.rollback()],
			["MCP rollback failed", () => mcpExecution.rollback()],
			["workspace rollback failed", () => workspaceExecution.rollback()]
		]);
		if (rollbackFailures.length > 0) throw partialMutation(`${coerceErrorMessage(error)}; ${rollbackFailures.join("; ")}`);
		if (retainedRequirementMutation) throw partialMutation(`${coerceErrorMessage(error)}; successfully realized shared requirements were retained`);
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
	const config = listedMcpServers.config;
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
//#region src/cli/claws-cli.runtime.ts
function logClawAddPlanSummary(plan, runtime) {
	runtime.log(`Agent: ${plan.agent.finalId}`);
	runtime.log(`Workspace: ${plan.agent.workspace}`);
	logClawAgentConfiguration(plan, runtime);
	runtime.log(`Actions: ${plan.summary.totalActions}`);
	runtime.log(`Packages: ${plan.summary.packageActions}`);
	for (const action of plan.actions.filter((candidate) => candidate.kind === "package")) {
		const requirementState = typeof action.details?.requirementState === "string" ? action.details.requirementState : "unresolved";
		runtime.log(`  Requirement ${action.target}: ${requirementState}${action.action === "install" ? " (installation requires this exact plan consent)" : ""}`);
	}
	runtime.log(`MCP servers: ${plan.summary.mcpServerActions}`);
	for (const action of plan.actions.filter((candidate) => candidate.kind === "mcpServer")) {
		const server = action.details;
		const target = typeof server?.url === "string" ? redactSensitiveUrlLikeString(server.url) : typeof server?.command === "string" ? redactSensitiveArgv([server.command, ...Array.isArray(server.args) ? server.args.filter((arg) => typeof arg === "string") : []]).join(" ") : "invalid declaration";
		runtime.log(`  MCP ${action.id}: ${target}`);
	}
	runtime.log(`Cron jobs: ${plan.summary.cronJobActions}`);
	if (plan.capabilityChanges.length > 0) {
		runtime.log(`Capability escalations (${plan.capabilityChanges.length}):`);
		for (const change of plan.capabilityChanges) runtime.log(redactSensitiveText(`  ! ${change.kind}:${change.id} ${JSON.stringify(change.effect)}`));
		runtime.log("The plan integrity binds every capability line above.");
	}
	if (plan.summary.blockedActions > 0) runtime.log(`Blocked actions: ${plan.summary.blockedActions}`);
}
async function matchingResumeState(plan, opts) {
	const readOnlyState = opts.dryRun ? await readClawResumeStateReadOnly(plan.agent.finalId) : void 0;
	const record = opts.dryRun ? readOnlyState?.record : readClawInstallRecord(plan.agent.finalId);
	if (!record || record.status === "complete" || record.workspace !== plan.agent.workspace || record.claw.kind !== plan.claw.kind || record.claw.name !== plan.claw.name || record.claw.version !== plan.claw.version || record.claw.integrity !== plan.claw.integrity) return;
	return {
		record,
		packageRefs: readOnlyState?.packageRefs ?? readClawPackageRefs({ agentId: plan.agent.finalId })
	};
}
function failNonDryRun(opts, runtime) {
	if (opts.dryRun) return false;
	if (opts.yes && opts.planIntegrity) return false;
	const code = opts.yes ? "plan_integrity_required" : "consent_required";
	const message = opts.yes ? "Claw add consent must include --plan-integrity from the exact dry-run plan." : "Claw add requires explicit consent; pass --dry-run to preview or --yes with --plan-integrity to create the new agent and workspace.";
	emitClawFailure(runtime, opts.json, message, {
		schemaVersion: CLAW_ADD_PLAN_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		ok: false,
		error: {
			code,
			message
		}
	});
	return true;
}
function requireRemoveConsent(opts, runtime) {
	if (opts.dryRun || opts.yes && opts.planIntegrity) return false;
	const code = opts.yes ? "plan_integrity_required" : "consent_required";
	const message = opts.yes ? "Claw remove consent must include --plan-integrity from the exact dry-run plan." : "Claw remove requires explicit consent; pass --dry-run to preview or --yes with --plan-integrity to remove owned state.";
	emitClawFailure(runtime, opts.json, message, {
		schemaVersion: CLAW_REMOVE_PLAN_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		ok: false,
		error: {
			code,
			message
		}
	});
	return true;
}
async function runClawsInspectCommand(sourcePath, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	const result = await readClawManifestFile(sourcePath);
	if (!result.ok) {
		emitClawFailure(runtime, opts.json, formatClawDiagnostics(result.diagnostics), {
			schemaVersion: CLAW_INSPECT_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			valid: false,
			diagnostics: result.diagnostics
		});
		return;
	}
	const extensionPlan = await planClawExtensions({
		extensions: result.openClawProfile?.extensions ?? [],
		workspace: result.source.packageRoot,
		packagePreflight: preflightClawPackage
	});
	const extensionCollisions = findClawExtensionPackageCollisions({
		packages: result.manifest.packages,
		extensions: result.openClawProfile?.extensions ?? []
	});
	const diagnostics = [
		...result.diagnostics,
		...extensionPlan.blockers,
		...extensionCollisions.map(({ diagnostic }) => diagnostic)
	];
	const valid = diagnostics.every((diagnostic) => diagnostic.level !== "error");
	const payload = {
		schemaVersion: CLAW_INSPECT_RESULT_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		valid,
		source: result.source,
		manifest: result.manifest,
		...result.openClawProfile ? { openClawProfile: result.openClawProfile } : {},
		extensions: extensionPlan.extensions,
		diagnostics
	};
	if (opts.json) {
		writeRuntimeJson(runtime, payload);
		if (!valid) runtime.exit(1);
		return;
	}
	logClawExperimentalWarning(runtime);
	runtime.log(`Claw: ${result.source.name}@${result.source.version}`);
	runtime.log(`Agent: ${result.manifest.agent.name ?? result.manifest.agent.id}`);
	runtime.log(`Packages: ${result.manifest.packages.length}`);
	runtime.log(`Extension requirements: ${extensionPlan.extensions.length}`);
	for (const extension of extensionPlan.extensions) runtime.log(`  ${extension.id}: ${extension.requirementState}; ${extension.detectedFormat ?? "unresolved"} -> ${(extension.mapped ?? []).join(", ") || "no mapped capabilities"}`);
	runtime.log(`MCP servers: ${Object.keys(result.manifest.mcpServers).length}`);
	runtime.log(`Cron jobs: ${result.manifest.cronJobs.length}`);
	if (!valid) {
		runtime.error(formatClawDiagnostics(diagnostics));
		runtime.exit(1);
	}
}
async function runClawsAddCommand(sourcePath, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	if (failNonDryRun(opts, runtime)) return;
	let legacyV1ResumeRecord;
	const result = await readClawManifestFile(sourcePath, { authorizeLegacyDynamicToolProfile: ({ manifest, source }) => {
		legacyV1ResumeRecord = authorizeLegacyV1Resume({
			manifest,
			source,
			opts
		});
		return legacyV1ResumeRecord !== void 0;
	} });
	if (!result.ok) {
		emitClawFailure(runtime, opts.json, formatClawDiagnostics(result.diagnostics), {
			schemaVersion: CLAW_ADD_PLAN_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			valid: false,
			diagnostics: result.diagnostics
		});
		return;
	}
	const config = getRuntimeConfig();
	const listedMcpServers = await listConfiguredMcpServers();
	if (!listedMcpServers.ok) {
		runtime.error(listedMcpServers.error);
		runtime.exit(1);
		return;
	}
	const existingAgentIds = listAgentIds(config);
	const existingWorkspacePaths = existingAgentIds.map((agentId) => resolveAgentWorkspaceDir(config, agentId));
	const cronStore = await loadCronJobsStoreWithConfigJobsReadOnly(resolveCronJobsStorePath());
	const basePlanContext = {
		config,
		...opts.agentId ? { agentId: opts.agentId } : {},
		...opts.workspace ? { workspace: opts.workspace } : {},
		existingAgentIds,
		existingWorkspacePaths,
		existingMcpServers: listedMcpServers.mcpServers,
		existingCronJobIds: cronStore.store.jobs.map((job) => job.id),
		packagePreflight: preflightClawPackage
	};
	let plan = await buildClawAddPlan({
		manifest: result.manifest,
		clawMarkdownBody: result.clawMarkdownBody,
		packageBootstrap: result.packageBootstrap,
		openClawProfile: result.openClawProfile,
		source: result.source,
		diagnostics: result.diagnostics,
		context: basePlanContext
	});
	let legacyResumePlan = result.legacyOpenClawProfile ? await buildClawAddPlan({
		manifest: result.manifest,
		clawMarkdownBody: result.clawMarkdownBody,
		packageBootstrap: result.packageBootstrap,
		openClawProfile: result.legacyOpenClawProfile,
		reconstructLegacyDynamicToolProfilePlan: true,
		source: result.source,
		diagnostics: result.diagnostics,
		context: basePlanContext
	}) : void 0;
	let resumableInstallRecord;
	const resumeState = await matchingResumeState(legacyResumePlan ?? plan, opts);
	if (result.legacyOpenClawProfile && !resumeState) plan = {
		...plan,
		blockers: [...plan.blockers, {
			level: "error",
			code: "claw_resume_plan_mismatch",
			phase: "plan",
			path: "$",
			message: "The incomplete Claw add no longer matches the previously consented plan; remove its partial state before retrying."
		}]
	};
	if (resumeState) {
		const { record: resumeRecord, packageRefs: resumePackageRefs } = resumeState;
		resumableInstallRecord = resumeRecord;
		const packagePreflight = async (pkg, workspace) => {
			const preflight = await preflightClawPackage(pkg, workspace);
			return findResumableIntroducedPluginRequirement({
				agentId: resumeRecord.agentId,
				pkg,
				preflight,
				refs: resumePackageRefs
			}) ? {
				...preflight,
				action: "install"
			} : preflight;
		};
		const canResumeWorkspace = resumeRecord.status === "workspace_ready" || resumeRecord.status === "config_committed";
		const expectedCommittedAgentConfigs = legacyResumePlan ? [legacyResumePlan.agent.config, plan.agent.config] : [plan.agent.config];
		const committedAgent = listAgentEntries(config).find((agent) => agent.id === resumeRecord.agentId && expectedCommittedAgentConfigs.some((expected) => stableStringify(agent) === stableStringify(expected)));
		const canResumeAgent = resumeRecord.status === "config_committed" || resumeRecord.status === "workspace_ready" && committedAgent !== void 0;
		const resumePlanContext = {
			...basePlanContext,
			packagePreflight,
			existingAgentIds: canResumeAgent ? existingAgentIds.filter((agentId) => agentId !== resumeRecord.agentId) : existingAgentIds,
			existingWorkspacePaths: canResumeWorkspace ? existingAgentIds.filter((agentId) => agentId !== resumeRecord.agentId).map((agentId) => resolveAgentWorkspaceDir(config, agentId)) : existingWorkspacePaths,
			...canResumeWorkspace ? { resumableWorkspace: resumeRecord.workspace } : {}
		};
		plan = await buildClawAddPlan({
			manifest: result.manifest,
			clawMarkdownBody: result.clawMarkdownBody,
			packageBootstrap: result.packageBootstrap,
			openClawProfile: result.openClawProfile,
			source: result.source,
			diagnostics: result.diagnostics,
			context: resumePlanContext
		});
		if (result.legacyOpenClawProfile) legacyResumePlan = await buildClawAddPlan({
			manifest: result.manifest,
			clawMarkdownBody: result.clawMarkdownBody,
			packageBootstrap: result.packageBootstrap,
			openClawProfile: result.legacyOpenClawProfile,
			reconstructLegacyDynamicToolProfilePlan: true,
			source: result.source,
			diagnostics: result.diagnostics,
			context: resumePlanContext
		});
		const expectedResumePlan = legacyResumePlan ?? plan;
		const exactLegacyResume = !legacyResumePlan || legacyV1ResumeRecord !== void 0 && stableStringify(legacyV1ResumeRecord) === stableStringify(resumeRecord);
		if (plan.blockers.length === 0 && (!exactLegacyResume || !clawInstallRecordMatchesPlan(resumeRecord, expectedResumePlan))) plan = {
			...plan,
			blockers: [...plan.blockers, {
				level: "error",
				code: "claw_resume_plan_mismatch",
				phase: "plan",
				path: "$",
				message: "The incomplete Claw add no longer matches the current plan; remove its partial state before retrying."
			}]
		};
		else resumableInstallRecord = resumeRecord;
	}
	if (plan.blockers.length > 0) {
		if (opts.json) writeRuntimeJson(runtime, plan);
		else {
			logClawExperimentalWarning(runtime);
			logClawAddPlanSummary(plan, runtime);
			runtime.error(formatClawDiagnostics(plan.blockers));
		}
		runtime.exit(1);
		return;
	}
	if (opts.dryRun) {
		if (opts.json) writeRuntimeJson(runtime, plan);
		else {
			logClawExperimentalWarning(runtime);
			runtime.log(`Claw add plan: ${plan.claw.name}@${plan.claw.version}`);
			logClawAddPlanSummary(plan, runtime);
		}
		return;
	}
	const consentPlanIntegrity = legacyResumePlan?.planIntegrity ?? plan.planIntegrity;
	if (opts.planIntegrity !== consentPlanIntegrity) {
		const message = "The consented Claw plan no longer matches; run add --dry-run again.";
		emitClawFailure(runtime, opts.json, message, {
			schemaVersion: CLAW_ADD_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			status: "failed",
			planIntegrity: plan.planIntegrity,
			error: {
				code: "plan_integrity_mismatch",
				message
			}
		});
		return;
	}
	let addResult;
	if (!opts.json) logClawExperimentalWarning(runtime);
	try {
		addResult = await applyClawAddPlan(plan, {
			reloadPlugins: await resolvePluginBatchReload(),
			consentPlanIntegrity: opts.planIntegrity,
			resumeRecord: resumableInstallRecord,
			resumePlan: legacyResumePlan,
			runtime: opts.json ? {
				...runtime,
				log: () => void 0
			} : runtime,
			cronGateway: {
				add: async (input) => await callGatewayFromCli("cron.add", {}, input),
				list: async (agentId) => await listCronJobsFromGateway({}, {
					agentId,
					includeDisabled: true
				}),
				waitUntilAgentAvailable: waitUntilGatewayAgentAvailable
			}
		});
	} catch (error) {
		const code = error instanceof ClawAddMutationError ? error.code : "add_failed";
		const message = error.message;
		emitClawFailure(runtime, opts.json, message, {
			schemaVersion: CLAW_ADD_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			status: "failed",
			error: {
				code,
				message
			}
		});
		return;
	}
	if (opts.json) writeRuntimeJson(runtime, addResult);
	else {
		runtime.log(`Added agent: ${addResult.agent.finalId}`);
		runtime.log(`Workspace: ${addResult.agent.workspace}`);
		runtime.log(`Status: ${addResult.status}`);
		if (addResult.error) runtime.error(addResult.error.message);
	}
	if (addResult.status !== "complete") runtime.exit(1);
}
async function runClawsStatusCommand(target, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	const status = await readClawStatus(target);
	if (opts.json) writeRuntimeJson(runtime, status);
	else {
		logClawExperimentalWarning(runtime);
		runtime.log(`Installed Claws: ${status.summary.claws}`);
		for (const record of status.records) {
			runtime.log(`${record.install.agentId}: ${record.install.claw.name}@${record.install.claw.version} (${record.install.status})`);
			runtime.log(`  Agent: ${record.agentState}; bootstrap: ${record.bootstrapState}; files: ${record.workspaceFiles.length}; packages: ${record.packages.length}`);
		}
	}
	if (target && status.records.length === 0) runtime.exit(1);
}
async function runClawsRemoveCommand(target, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	if (requireRemoveConsent(opts, runtime)) return;
	const selected = opts.removeReferenced ?? [];
	if (opts.removeUnused && selected.length > 0) {
		runtime.error("Choose either --remove-unused or --remove-referenced, not both.");
		runtime.exit(1);
		return;
	}
	if (opts.forceReferenced && selected.length === 0) {
		runtime.error("--force-referenced requires at least one --remove-referenced selector.");
		runtime.exit(1);
		return;
	}
	const referencedCleanup = selected.length ? {
		mode: "remove-selected",
		selected,
		allowConflicts: Boolean(opts.forceReferenced)
	} : opts.removeUnused ? { mode: "remove-if-unused" } : { mode: "retain" };
	const plan = await buildClawRemovePlan(target, {
		referencedCleanup,
		monitorGateway: clawMonitorCleanupGateway
	});
	if (opts.dryRun || plan.blockers.length > 0) {
		if (opts.json) writeRuntimeJson(runtime, plan);
		else {
			logClawExperimentalWarning(runtime);
			runtime.log(`Remove actions: ${plan.actions.length}`);
			runtime.log(`Plan integrity: ${plan.planIntegrity}`);
			for (const action of plan.actions.filter((candidate) => candidate.kind === "packageRef")) runtime.log(`  Package ${action.target}: ${action.action}${action.reason ? ` (${action.reason})` : ""}`);
			for (const action of plan.actions.filter((candidate) => candidate.kind === "mcpServer")) runtime.log(`  MCP ${action.id}: ${action.action}${action.reason ? ` (${action.reason})` : ""}`);
			if (plan.blockers.length > 0) runtime.error(plan.blockers.map((blocker) => blocker.message).join("\n"));
		}
		if (plan.blockers.length > 0) runtime.exit(1);
		return;
	}
	try {
		const result = await applyClawRemovePlan(plan, {
			monitorGateway: clawMonitorCleanupGateway,
			packageGateway: clawPackageRemovalGateway,
			consentPlanIntegrity: opts.planIntegrity,
			referencedCleanup,
			cronGateway: {
				get: async (id) => await callGatewayFromCli("cron.get", {}, { id }),
				remove: async (id) => await callGatewayFromCli("cron.remove", {}, { id })
			}
		});
		if (opts.json) writeRuntimeJson(runtime, result);
		else {
			logClawExperimentalWarning(runtime);
			runtime.log(`${result.agentRemoved ? "Removed agent" : "Agent"}: ${result.agentId}`);
			runtime.log(`Status: ${result.status}`);
			for (const pkg of result.packages) runtime.log(`  Package ${pkg.kind}:${pkg.ref}@${pkg.version}: ${pkg.action}${pkg.reason ? ` (${pkg.reason})` : ""}`);
			runtime.log(`Package references released: ${result.packageRefsReleased}`);
			if (result.error) runtime.error(result.error.message);
			for (const warning of result.warnings ?? []) runtime.log(`Warning: ${warning}`);
			if (result.pluginRuntime) runtime.log(`Plugin runtime changed in Gateway generation ${result.pluginRuntime.generation}.`);
		}
		if (result.status !== "complete") runtime.exit(1);
	} catch (error) {
		const code = error instanceof ClawRemoveError ? error.code : "remove_failed";
		const message = error instanceof Error ? error.message : String(error);
		emitClawFailure(runtime, opts.json, message, {
			schemaVersion: CLAW_REMOVE_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			status: "failed",
			error: {
				code,
				message
			}
		});
	}
}
async function runClawsExportCommand(agentId, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	try {
		const listedMcpServers = await listConfiguredMcpServers();
		if (!listedMcpServers.ok) throw new ClawExportError("mcp_config_unavailable", listedMcpServers.error);
		const result = await exportClawAgent(agentId, opts.out, {
			config: getRuntimeConfig(),
			sourceMcpServers: listedMcpServers.mcpServers,
			...opts.bootstrap ? { bootstrapPath: opts.bootstrap } : {}
		});
		if (opts.json) {
			writeRuntimeJson(runtime, result);
			return;
		}
		logClawExperimentalWarning(runtime);
		runtime.log(`Exported agent: ${result.agentId}`);
		runtime.log(`Package directory: ${result.outputDirectory}`);
		runtime.log(`Workspace files: ${result.manifest.workspace.files.length + Object.keys(result.manifest.workspace.bootstrapFiles).length}`);
		runtime.log(`Packages: ${result.manifest.packages.length}`);
		runtime.log(`Bootstrap: ${result.filesWritten.includes("BOOTSTRAP.md") ? "included" : "none"}`);
	} catch (error) {
		const code = error instanceof ClawExportError ? error.code : "export_failed";
		const message = error instanceof Error ? error.message : String(error);
		emitClawFailure(runtime, opts.json, message, {
			schemaVersion: CLAW_EXPORT_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			status: "failed",
			error: {
				code,
				message
			}
		});
	}
}
//#endregion
export { runClawsAddCommand, runClawsExportCommand, runClawsInspectCommand, runClawsRemoveCommand, runClawsStatusCommand, runClawsUpdateCommand };
