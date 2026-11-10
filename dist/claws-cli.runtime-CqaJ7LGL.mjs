import { t as assertExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./src-Djeo9OvP.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { n as filterStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { o as writeRuntimeJson, r as defaultRuntime, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import "./utils-gjJ-tD2q.mjs";
import { a as normalizeWindowsPathForComparison } from "./path-guards-CH7noY0Z.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-C4n2JwGL.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { t as DEFAULT_AGENT_ID } from "./session-key-CSDERtm3.mjs";
import { S as toAgentEntriesRecord, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { i as recordAgentProvenance } from "./agent-provenance-Bj5CtKpW.mjs";
import { t as redactSensitiveArgv } from "./redact-argv-CWtUb9xr.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import { o as transformConfigFileWithRetry } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import { n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-bootstrap-policy-wM0DWL3B.mjs";
import { t as applyAgentConfig } from "./agents.config-B7znCYIL.mjs";
import { r as resolveCronJobsStorePathFromConfig, t as resolveCronJobsStorePath } from "./paths-C7jZRDkL.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-ClACC-rY.mjs";
import { u as seedWorkspaceBootstrap } from "./workspace-3xrXOvoY.mjs";
import { r as isGatewayProtocolResponseError } from "./protocol-request-BMUN1re6.mjs";
import { n as callGatewayFromCli } from "./gateway-rpc-Wcwajg7Y.mjs";
import { n as digestClawValue, t as digestClawBytes } from "./digest-CI8Suvd7.mjs";
import { n as readClawManifestFile } from "./reader-B0BaP0mr.mjs";
import "./store-HF7PvtRl.mjs";
import { n as loadCronJobsStoreWithConfigJobsReadOnly } from "./read-only-BTIc_b6f.mjs";
import { t as listConfiguredMcpServers } from "./mcp-config-CuTEp6af.mjs";
import { m as ClawCronInstallError, t as ClawRemoveError, y as installClawCronJobs } from "./lifecycle-delete-support-BVDBGRpe.mjs";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-C-K2bAs7.mjs";
import { h as CLAW_OUTPUT_STABILITY, m as CLAW_INSPECT_RESULT_SCHEMA_VERSION, n as ClawMcpInstallError, o as installClawMcpServers, p as CLAW_ADD_PLAN_SCHEMA_VERSION, t as clawContainedRelativePath } from "./path-containment-BLH2epmf.mjs";
import { i as CLAW_REMOVE_RESULT_SCHEMA_VERSION, n as buildClawRemovePlan, r as CLAW_REMOVE_PLAN_SCHEMA_VERSION, t as applyClawRemovePlan } from "./lifecycle-state-uGpIE2KI.mjs";
import { C as readClawPackageRefs, T as updateClawInstallRecordStatus, _ as clawInstallRecordMatchesPlan, c as readClawStatus, d as createClawWorkspaceFiles, u as ClawWorkspaceWriteError, v as deleteClawInstallRecord, x as readClawInstallRecord, y as persistClawInstallRecord } from "./package-remove-plan-D6sNV8gA.mjs";
import { n as clawMonitorDrainSchema, r as clawMonitorInventorySchema } from "./monitor-cleanup-contract-DMqZagu3.mjs";
import { n as clawRemovalJournalResultSchema, r as serializeClawRemovalJournal, t as clawRemovalJournalRequestSchema } from "./removal-journal-contract-BwY0ztCU.mjs";
import { c as planClawExtensions, i as logClawExperimentalWarning, n as formatClawDiagnostics, o as buildClawAddPlan, r as logClawAgentConfiguration, s as findClawExtensionPackageCollisions, t as emitClawFailure } from "./claws-cli-output-DzhUNZLl.mjs";
import { i as preflightClawPackage, n as ClawPackageInstallError, o as findResumableIntroducedPluginRequirement, r as installClawPackages, s as readClawResumeStateReadOnly, t as waitUntilGatewayAgentAvailable } from "./claws-cli.gateway-readiness-DFWfcpLc.mjs";
import { n as ClawExportError, r as exportClawAgent, t as CLAW_EXPORT_RESULT_SCHEMA_VERSION } from "./export-CF1mXNoy.mjs";
import { t as resolveClawMonitorCleanupBinding } from "./monitor-cleanup-binding-IJCEUt7F.mjs";
import { n as clawPackageRemovalResultSchema } from "./package-remove-contract-BSc65q0f.mjs";
import { t as offlineClawAction } from "./claws-cli.state-owner-3ThNTAdb.mjs";
import { r as listCronJobsFromGateway } from "./list-jobs-Bz0gZYC0.mjs";
import { t as resolvePluginBatchReload } from "./plugins-lifecycle-client-CV2oB0RL.mjs";
import { lstat, mkdir, realpath, rmdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
//#region src/claws/add-plan-helpers.ts
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
async function seedClawPackageBootstrap(plan, options = {}) {
	const actions = plan.actions.filter((action) => action.kind === "bootstrap");
	if (actions.length === 0) return;
	if (actions.length !== 1) throw new ClawBootstrapWriteError("bootstrap_plan_invalid", "A Claw add plan may contain only one package bootstrap action.");
	const action = actions[0];
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
	if (resolve(read.realPath) !== sourcePath || digestClawBytes(read.buffer) !== action.digest) throw new ClawBootstrapWriteError("bootstrap_source_changed", "BOOTSTRAP.md changed after consent; run add --dry-run again.");
	const expectedTarget = resolve(plan.agent.workspace, DEFAULT_BOOTSTRAP_FILENAME);
	if (resolve(action.target) !== expectedTarget) throw new ClawBootstrapWriteError("bootstrap_target_changed", "The package bootstrap target is not the new agent workspace root.");
	return seedWorkspaceBootstrap({
		dir: plan.agent.workspace,
		content: read.buffer,
		...options.nowMs !== void 0 ? { nowMs: options.nowMs } : {},
		stateOptions: options
	});
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
async function applyClawAddPlan(plan, options = {}) {
	if (plan.blockers.length > 0) throw new ClawAddMutationError("plan_blocked", "The Claw add plan contains blockers.");
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
	let workspaceCreated = false;
	let configCommitted = false;
	let workspaceFiles = [];
	let packages = [];
	let mcpServers = [];
	let cronJobs = [];
	const partialResult = ({ installStatus = "partial", nowMs, ...overrides }) => ({
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
		workspaceFiles,
		packages,
		mcpServers,
		cronJobs,
		installRecord: {
			...installRecord,
			status: installStatus,
			updatedAtMs: nowMs ?? Date.now()
		},
		...overrides
	});
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
	workspaceCreated = workspaceState?.isDirectory() ?? false;
	configCommitted = statusAtLeast(installRecord.status, "config_committed");
	const installPackages = options.installPackages ?? installClawPackages;
	const preserveRecordedPhaseOrMarkPartial = () => {
		if (workspacePhaseRecorded) return installRecord.status;
		markInstallStatus(plan.agent.finalId, "partial", ["pending", "partial"], options);
		return "partial";
	};
	const hostRequirementPlan = planWithPackageActions(plan, (action) => action.details?.kind === "plugin");
	if (hostRequirementPlan.actions.filter((action) => action.kind === "package").length > 0) try {
		packages = await installPackages(hostRequirementPlan, options);
	} catch (error) {
		const packageError = error instanceof ClawPackageInstallError ? error : void 0;
		const installStatus = preserveRecordedPhaseOrMarkPartial();
		return partialResult({
			packages: packageError?.installedPackages ?? packages,
			installStatus,
			error: {
				code: packageError?.code ?? "package_install_failed",
				message: packageError?.message ?? coerceErrorMessage(error)
			},
			nowMs: options.nowMs
		});
	}
	try {
		assertWorkspacePathUnchanged(workspace);
		await mkdir(dirname(workspace), { recursive: true });
		assertWorkspacePathUnchanged(workspace);
	} catch (error) {
		if (packages.length > 0) return partialResult({
			installStatus: preserveRecordedPhaseOrMarkPartial(),
			error: {
				code: error instanceof ClawAddMutationError ? error.code : "workspace_parent_failed",
				message: error instanceof ClawAddMutationError ? error.message : `Could not create parent directory for workspace ${JSON.stringify(workspace)}: ${error.message}`
			},
			nowMs: options.nowMs
		});
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
				workspaceCreated: false,
				configCommitted: false,
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
			const agentsToPreserve = existingAgents.length > 0 ? existingAgents : [{ id: DEFAULT_AGENT_ID }];
			const configWithPreservedAgents = {
				...config,
				agents: {
					...config.agents,
					entries: toAgentEntriesRecord(agentsToPreserve)
				}
			};
			const normalizedAgentId = normalizeAgentId(plan.agent.finalId);
			const existingAgent = agentsToPreserve.find((agent) => normalizeAgentId(agent.id) === normalizedAgentId);
			if (existingAgent) {
				if (sameCommittedAgent(existingAgent, plan)) return config;
				if (options.resumePlan && options.resumeRecord?.schemaVersion === "openclaw.clawInstallRecord.v1" && options.resumeRecord.status !== "complete" && sameCommittedAgent(existingAgent, options.resumePlan)) return {
					...configWithPreservedAgents,
					agents: {
						...configWithPreservedAgents.agents,
						entries: toAgentEntriesRecord(agentsToPreserve.map((agent) => normalizeAgentId(agent.id) === normalizedAgentId ? plan.agent.config : agent))
					}
				};
				throw new ClawAddMutationError("agent_id_collision", "Agent " + JSON.stringify(plan.agent.finalId) + " was created after planning.");
			}
			if (findOverlappingWorkspaceAgentIds(configWithPreservedAgents, plan.agent.finalId, workspace).length > 0) throw new ClawAddMutationError("workspace_collision", "Workspace " + JSON.stringify(workspace) + " is already assigned to an agent.");
			const nextConfig = applyAgentConfig(configWithPreservedAgents, { agentId: normalizedAgentId });
			return {
				...nextConfig,
				agents: {
					...nextConfig.agents,
					entries: {
						...nextConfig.agents?.entries,
						...toAgentEntriesRecord([plan.agent.config])
					}
				}
			};
		});
		configCommitted = true;
		try {
			await recordAgentProvenance(plan.agent.finalId, { createdVia: "claw" }, options);
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
			installStatus,
			error: {
				code: error instanceof ClawAddMutationError ? error.code : "config_commit_failed",
				message: coerceErrorMessage(error)
			},
			nowMs: options.nowMs
		});
	}
	const createFiles = options.createWorkspaceFiles ?? createClawWorkspaceFiles;
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
		return partialResult({
			workspaceFiles: workspaceError.createdFiles,
			installStatus: "config_committed",
			nowMs: options.nowMs,
			error: {
				code: "workspace_files_failed",
				message: workspaceError.message,
				diagnostics: workspaceError.diagnostics
			}
		});
	}
	try {
		const workspacePackagePlan = planWithPackageActions(plan, (action) => action.details?.kind !== "plugin");
		if (workspacePackagePlan.actions.filter((action) => action.kind === "package").length > 0) {
			const workspacePackages = await installPackages(workspacePackagePlan, options);
			packages = [...packages, ...workspacePackages];
		}
	} catch (error) {
		const packageError = error instanceof ClawPackageInstallError ? error : void 0;
		return partialResult({
			packages: [...packages, ...packageError?.installedPackages ?? []],
			installStatus: "config_committed",
			error: {
				code: packageError?.code ?? "package_install_failed",
				message: packageError?.message ?? coerceErrorMessage(error)
			},
			nowMs: options.nowMs
		});
	}
	const installMcpServers = options.installMcpServers ?? installClawMcpServers;
	try {
		mcpServers = await installMcpServers(plan, options);
	} catch (error) {
		const mcpError = error instanceof ClawMcpInstallError ? error : void 0;
		markInstallStatus(plan.agent.finalId, "config_committed", ["config_committed"], options);
		return partialResult({
			mcpServers: mcpError?.mcpServers ?? mcpServers,
			installStatus: "config_committed",
			error: {
				code: mcpError?.code ?? "mcp_install_failed",
				message: mcpError?.message ?? coerceErrorMessage(error)
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
		const cronError = error instanceof ClawCronInstallError ? error : void 0;
		markInstallStatus(plan.agent.finalId, "config_committed", ["config_committed"], options);
		return partialResult({
			cronJobs: cronError?.cronJobs ?? cronJobs,
			installStatus: "config_committed",
			error: {
				code: cronError?.code ?? "cron_install_failed",
				message: cronError?.message ?? coerceErrorMessage(error)
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
		return partialResult({ error: {
			code: "provenance_failed",
			message: error.message
		} });
	}
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
//#region src/cli/claws-cli.monitor-cleanup.ts
const binding = async () => resolveClawMonitorCleanupBinding(resolveCronJobsStorePathFromConfig(await captureRuntimeConfigAsyncReader()()));
const clawMonitorCleanupGateway = {
	inspect: async (agentId) => clawMonitorInventorySchema.parse(await callGatewayFromCli("claws.monitors", { timeout: "5000" }, {
		phase: "inspect",
		agentId,
		binding: await binding()
	})).monitors,
	quiesce: async (agentId, operationId, monitors) => {
		clawMonitorDrainSchema.parse(await callGatewayFromCli("claws.monitors", {}, {
			phase: "quiesce",
			agentId,
			operationId,
			monitors,
			binding: await binding()
		}));
	},
	drain: async (agentId, operationId) => {
		clawMonitorDrainSchema.parse(await callGatewayFromCli("claws.monitors", {}, {
			phase: "drain",
			agentId,
			operationId,
			binding: await binding()
		}));
	}
};
//#endregion
//#region src/cli/claws-cli.package-removal.ts
const clawPackageRemovalGateway = async (request) => clawPackageRemovalResultSchema.parse(await callGatewayFromCli("claws.packages.remove", { timeout: "600000" }, {
	...request,
	binding: resolveClawMonitorCleanupBinding(resolveCronJobsStorePathFromConfig(await captureRuntimeConfigAsyncReader()()))
}));
//#endregion
//#region src/cli/claws-cli.removal-journal.ts
const clawRemovalJournalGateway = async (input, authority) => {
	const config = await captureRuntimeConfigAsyncReader()();
	authority.assertCurrent();
	const agentId = input.kind === "begin" ? input.entry.agentId : input.journal.agentId;
	const operationId = input.kind === "begin" ? input.operationId : input.journal.operationId;
	const request = clawRemovalJournalRequestSchema.parse({
		phase: input.kind,
		agentId,
		operationId,
		binding: resolveClawMonitorCleanupBinding(resolveCronJobsStorePathFromConfig(config)),
		lease: authority.identity,
		sourceIdentity: authority.sourceIdentity,
		expectedInstallDigest: input.expectedInstallDigest,
		expectedJournalDigest: digestClawValue(serializeClawRemovalJournal(input.kind === "begin" ? input.expectedJournal : input.journal)),
		configDigest: input.configDigest
	});
	let response;
	try {
		response = await callGatewayFromCli("claws.removalJournal", { timeout: "600000" }, request, { signal: authority.signal });
	} catch (error) {
		if (isGatewayProtocolResponseError(error) && (isRecord(error.details) && error.details.outcomeUnknown === false || error.gatewayCode === "INVALID_REQUEST" || error.gatewayCode === "FORBIDDEN")) return err(error);
		throw error;
	}
	const result = clawRemovalJournalResultSchema.parse(response);
	if (!result.ok) return err(new Error(result.error));
	if (input.kind === "begin" ? !result.journal || result.journal.agentId !== agentId || result.journal.operationId !== operationId || result.journal.cleanupCompleted : result.journal !== null) throw new Error("Claw journal outcome is unknown: Gateway returned a different deletion operation; inspect claws status before retrying.");
	return ok(result.journal ? {
		...result.journal,
		phase: "retiring"
	} : null);
};
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
		const target = typeof server?.url === "string" ? redactSensitiveUrlLikeString(server.url) : typeof server?.command === "string" ? redactSensitiveArgv([server.command, ...filterStringEntries(server.args)]).join(" ") : "invalid declaration";
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
function requireClawPlanConsent(action, opts, runtime) {
	if (opts.dryRun || opts.yes && opts.planIntegrity) return false;
	const code = opts.yes ? "plan_integrity_required" : "consent_required";
	const message = opts.yes ? `Claw ${action} consent must include --plan-integrity from the exact dry-run plan.` : `Claw ${action} requires explicit consent; pass --dry-run to preview or --yes with --plan-integrity to ${action === "add" ? "create the new agent and workspace" : "remove owned state"}.`;
	emitClawFailure(runtime, opts.json, message, {
		schemaVersion: action === "add" ? CLAW_ADD_PLAN_SCHEMA_VERSION : CLAW_REMOVE_PLAN_SCHEMA_VERSION,
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
const runClawsAddCommand = offlineClawAction("add", runClawsAddCommandLocal);
async function runClawsAddCommandLocal(sourcePath, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	if (requireClawPlanConsent("add", opts, runtime)) return;
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
	const config = await captureRuntimeConfigAsyncReader()();
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
	const planInput = {
		manifest: result.manifest,
		clawMarkdownBody: result.clawMarkdownBody,
		packageBootstrap: result.packageBootstrap,
		openClawProfile: result.openClawProfile,
		source: result.source,
		diagnostics: result.diagnostics
	};
	let plan = await buildClawAddPlan({
		...planInput,
		context: basePlanContext
	});
	let legacyResumePlan = result.legacyOpenClawProfile ? await buildClawAddPlan({
		...planInput,
		openClawProfile: result.legacyOpenClawProfile,
		reconstructLegacyDynamicToolProfilePlan: true,
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
			...planInput,
			context: resumePlanContext
		});
		if (result.legacyOpenClawProfile) legacyResumePlan = await buildClawAddPlan({
			...planInput,
			openClawProfile: result.legacyOpenClawProfile,
			reconstructLegacyDynamicToolProfilePlan: true,
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
	}
	if (opts.dryRun || plan.blockers.length > 0) {
		if (opts.json) writeRuntimeJson(runtime, plan);
		else {
			logClawExperimentalWarning(runtime);
			if (plan.blockers.length === 0) runtime.log(`Claw add plan: ${plan.claw.name}@${plan.claw.version}`);
			logClawAddPlanSummary(plan, runtime);
			if (plan.blockers.length > 0) runtime.error(formatClawDiagnostics(plan.blockers));
		}
		if (plan.blockers.length > 0) runtime.exit(1);
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
const runClawsStatusCommand = offlineClawAction("status", runClawsStatusCommandLocal);
async function runClawsStatusCommandLocal(target, opts, runtime = defaultRuntime) {
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
const runClawsRemoveCommand = offlineClawAction("remove", runClawsRemoveCommandLocal);
async function runClawsRemoveCommandLocal(target, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	if (requireClawPlanConsent("remove", opts, runtime)) return;
	const selected = opts.removeReferenced ?? [];
	const optionError = opts.removeUnused && selected.length > 0 ? "Choose either --remove-unused or --remove-referenced, not both." : opts.forceReferenced && selected.length === 0 ? "--force-referenced requires at least one --remove-referenced selector." : void 0;
	if (optionError) {
		emitClawFailure(runtime, opts.json, optionError, {
			schemaVersion: CLAW_REMOVE_PLAN_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			ok: false,
			error: {
				code: "invalid_cleanup_options",
				message: optionError
			}
		});
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
			journalGateway: clawRemovalJournalGateway,
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
		if (error instanceof ExitError) throw error;
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
const runClawsExportCommand = offlineClawAction("export", runClawsExportCommandLocal);
async function runClawsExportCommandLocal(agentId, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	try {
		const listedMcpServers = await listConfiguredMcpServers();
		if (!listedMcpServers.ok) throw new ClawExportError("mcp_config_unavailable", listedMcpServers.error);
		const result = await exportClawAgent(agentId, opts.out, {
			config: await captureRuntimeConfigAsyncReader()(),
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
export { runClawsAddCommand, runClawsExportCommand, runClawsInspectCommand, runClawsRemoveCommand, runClawsStatusCommand };
