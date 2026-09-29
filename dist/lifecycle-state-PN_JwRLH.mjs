import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cl4qyvGH.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-BRjL0YJr.mjs";
import { f as CLAW_OUTPUT_STABILITY } from "./reader-C5RYMxIl.mjs";
import { t as listConfiguredMcpServers } from "./mcp-config-DDcOp4Ta.mjs";
import { a as withClawMcpLifecycleLease, n as unsetConfiguredMcpServer } from "./mcp-config-mutation-prwzNOrh.mjs";
import { a as readAgentDeleteDatabaseRegistry, n as assertAgentSessionStoreDeletionSafe, o as resolveSurvivingDatabaseFilePaths, r as isPathOwnedBySurvivingAgent, t as AgentSharedStoreOwnerError } from "./agent-delete-databases-CY5IIYgH.mjs";
import { S as deleteClawCronRef, a as ClawRemoveError, b as clawCronGatewayJobMatchesRef, c as deletionEffects, f as readClawRemoveCronInventory, g as workspaceContainsUntrackedEntries, i as clawMonitorSnapshotSchema, m as removeClawWorkspaceFile, o as clawRemoveQuietRuntime, p as releaseClawRemoveRows, s as cleanupClawAgentFilesystem, w as markClawCronRefRemoved } from "./monitor-cleanup-contract-BHX4JGIH.mjs";
import { a as readClawInstallRecord } from "./provenance-CFChXfcP.mjs";
import { S as withClawAgentConfigRemoval, _ as applyClawPackageRemovals, a as normalizeClawPackageCleanup, c as readClawStatus, i as filterReferencedCleanup, n as digestClawRemovalInstall, o as orderClawPackageRemovals, r as digestClawRemovalState, s as projectClawPackageRemovePlan, t as digestClawPackageRemovalPlan, v as planClawPackageRemovals, x as digestClawAgentRemovalSurface } from "./package-remove-plan-CbN2q2ex.mjs";
import { a as digestClawMcpServer, i as deleteClawMcpServerRef, l as readClawMcpServerRefsByName, r as clawMcpRemovalSelector, s as planClawMcpServerRemoval } from "./mcp-CSMpf6KZ.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/claws/lifecycle-bootstrap-removal.ts
function clawBootstrapStateBlocksRemove(record) {
	return Boolean(record.install.bootstrap && (record.bootstrap.state === "unsafe" || record.bootstrap.state === "unknown"));
}
function planClawBootstrapRemoval(record) {
	if (!record.install.bootstrap) return;
	const blocked = clawBootstrapStateBlocksRemove(record);
	return {
		kind: "bootstrap",
		id: record.bootstrap.path,
		action: record.bootstrap.state === "pending" ? "delete" : "retain",
		target: `${record.bootstrap.workspace}:${record.bootstrap.path}`,
		blocked,
		details: {
			expectedState: record.bootstrap.state,
			contentDigest: record.install.bootstrap.contentDigest,
			sourcePath: record.install.bootstrap.sourcePath,
			lifecycle: "native-seed-once"
		},
		...record.bootstrap.state === "modified" ? { reason: "Local bootstrap content changed; preserve the file." } : record.bootstrap.state === "complete" ? { reason: "Native onboarding already consumed the bootstrap." } : {}
	};
}
async function removeClawBootstrap(record, assertCurrent) {
	if (!record.install.bootstrap) return;
	if (record.bootstrap.state === "pending") return removeClawWorkspaceFile({
		workspace: record.bootstrap.workspace,
		path: record.bootstrap.path,
		contentDigest: record.install.bootstrap.contentDigest,
		state: "unchanged"
	}, assertCurrent, MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES);
	return record.bootstrap.state === "modified" ? {
		path: record.bootstrap.path,
		action: "retainedModified"
	} : {
		path: record.bootstrap.path,
		action: "missing"
	};
}
//#endregion
//#region src/claws/lifecycle-mcp-removal.ts
async function removeClawMcpServers(params) {
	const listed = params.options.sourceMcpServers ? void 0 : params.options.listMcpServers ? await params.options.listMcpServers() : params.options.config ? void 0 : await listConfiguredMcpServers();
	params.assertCurrent();
	if (listed && !listed.ok) throw new ClawRemoveError("mcp_config_unavailable", listed.error);
	const configured = listed?.ok ? listed.mcpServers : normalizeConfiguredMcpServers(params.options.sourceMcpServers ?? params.options.config?.mcp?.servers);
	const unsetMcpServer = params.options.unsetMcpServer ?? unsetConfiguredMcpServer;
	const mcpServers = [];
	for (const server of params.servers) {
		let removalError;
		params.assertCurrent();
		await withClawMcpLifecycleLease(server.name, params.options, async (assertMcpCurrent) => {
			const assertCurrent = () => {
				params.assertCurrent();
				assertMcpCurrent();
			};
			assertCurrent();
			const currentRef = readClawMcpServerRefsByName(server.name, params.options).find((candidate) => candidate.agentId === params.agentId);
			if (!currentRef) throw new ClawRemoveError("mcp_cleanup_changed", `MCP ownership for ${JSON.stringify(server.name)} changed during removal.`);
			if (planClawMcpServerRemoval(currentRef, params.options).action === "release") {
				assertCurrent();
				deleteClawMcpServerRef(params.agentId, server.name, params.options);
				mcpServers.push({
					name: server.name,
					action: server.state === "missing" ? "missing" : "released"
				});
				return;
			}
			const expectedServer = configured[server.name];
			if (!expectedServer) {
				if (server.state === "present") throw new ClawRemoveError("mcp_cleanup_changed", `MCP server ${JSON.stringify(server.name)} disappeared during removal.`);
				assertCurrent();
				deleteClawMcpServerRef(params.agentId, server.name, params.options);
				mcpServers.push({
					name: server.name,
					action: "missing"
				});
				return;
			}
			if (digestClawMcpServer(expectedServer) !== currentRef.configDigest) throw new ClawRemoveError("mcp_cleanup_changed", `MCP server ${JSON.stringify(server.name)} changed during removal.`);
			try {
				const result = await unsetMcpServer({
					name: server.name,
					expectedServer,
					recordIndependentOwner: false,
					assertCurrent
				});
				if (!result.ok) throw new Error(result.error);
				assertCurrent();
				deleteClawMcpServerRef(params.agentId, server.name, params.options);
				mcpServers.push({
					name: server.name,
					action: result.removed ? "removed" : "missing"
				});
			} catch (cause) {
				const message = coerceErrorMessage(cause);
				mcpServers.push({
					name: server.name,
					action: "error",
					message
				});
				removalError = message;
			}
		});
		params.assertCurrent();
		if (removalError) return {
			mcpServers,
			error: removalError
		};
	}
	return { mcpServers };
}
//#endregion
//#region src/claws/lifecycle-remove-contract.ts
const CLAW_REMOVE_PLAN_SCHEMA_VERSION = "openclaw.clawRemovePlan.v1";
const CLAW_REMOVE_RESULT_SCHEMA_VERSION = "openclaw.clawRemoveResult.v1";
//#endregion
//#region src/claws/package-remove-phase.ts
async function applyClawPackageRemovalPhase(decisions, options) {
	const ordered = orderClawPackageRemovals(decisions);
	options.assertCurrent();
	const cleanup = normalizeClawPackageCleanup(filterReferencedCleanup(options.referencedCleanup, "package"));
	if (!ordered.some((decision) => decision.packageRef.kind === "plugin" && decision.action === "uninstall")) return await applyClawPackageRemovals(ordered, {
		...options,
		deps: options.packageDeps
	});
	if (!options.packageGateway) throw new Error("Plugin cleanup requires the serving Gateway package owner.");
	const removed = await options.packageGateway({
		agentId: options.agentId,
		operationId: options.operationId,
		expectedInstallDigest: digestClawRemovalInstall(readClawInstallRecord(options.agentId, options)),
		expectedPackagePlanDigest: digestClawPackageRemovalPlan(ordered, cleanup),
		cleanup
	});
	options.assertCurrent();
	const expected = ordered.map(({ packageRef }) => [
		packageRef.kind,
		packageRef.ref,
		packageRef.version
	]);
	const actual = removed.packages.map((pkg) => [
		pkg.kind,
		pkg.ref,
		pkg.version
	]);
	if (!isDeepStrictEqual(expected, actual) || removed.packages.some((pkg) => pkg.kind === "plugin" && pkg.action === "uninstalled") && !removed.application) throw new Error("Gateway package cleanup returned incomplete removal outcomes.");
	return removed;
}
//#endregion
//#region src/claws/lifecycle-state.ts
async function buildClawRemovePlan(target, options = {}) {
	const status = await readClawStatus(target, options);
	const blockers = [];
	if (status.records.length === 0) blockers.push({
		code: "claw_not_found",
		message: `No installed Claw matches ${JSON.stringify(target)}.`
	});
	else if (status.records.length > 1) blockers.push({
		code: "claw_ambiguous",
		message: `Claw name ${JSON.stringify(target)} matches multiple agents; use an agent id.`
	});
	const record = status.records.length === 1 ? status.records[0] : void 0;
	if (record?.agentState === "modified") blockers.push({
		code: "agent_modified",
		message: `Agent ${JSON.stringify(record.install.agentId)} changed after add.`
	});
	for (const file of record?.workspaceFiles ?? []) if (file.state === "unsafe") blockers.push({
		code: "workspace_file_unsafe",
		message: `${file.path}: ${file.message ?? "unsafe file"}`
	});
	if (record && clawBootstrapStateBlocksRemove(record)) blockers.push({
		code: "bootstrap_cleanup_uncertain",
		message: `BOOTSTRAP.md has ${record.bootstrap.state} ownership state and must be reconciled before removal.`
	});
	for (const server of record?.mcpServers ?? []) if (server.state === "pending") blockers.push({
		code: "mcp_cleanup_uncertain",
		message: `MCP server ${JSON.stringify(server.name)} has ${server.state} ownership state and must be reconciled before removal.`
	});
	for (const cron of record?.cronJobs ?? []) if (cron.status !== "removed" && (cron.status !== "complete" || !cron.schedulerJobId)) blockers.push({
		code: "cron_cleanup_uncertain",
		message: `Cron declaration ${JSON.stringify(cron.manifestId)} has ${cron.status} ownership state and must be reconciled before removal.`
	});
	const actions = [];
	if (record) {
		const packageCleanup = filterReferencedCleanup(options.referencedCleanup, "package");
		const mcpCleanup = filterReferencedCleanup(options.referencedCleanup, "mcp");
		const packageDecisions = await planClawPackageRemovals(record.install, record.packages, {
			...options,
			deps: options.packageDeps,
			referencedCleanup: packageCleanup
		});
		const packagePlan = projectClawPackageRemovePlan({
			decisions: packageDecisions,
			inspections: record.packages,
			cleanup: packageCleanup
		});
		blockers.push(...packagePlan.blockers);
		const config = options.config ?? getRuntimeConfig();
		try {
			assertAgentSessionStoreDeletionSafe(config, record.install.agentId, options);
		} catch (error) {
			if (!(error instanceof AgentSharedStoreOwnerError)) throw error;
			blockers.push({
				code: "shared_session_store_owner",
				message: error.message
			});
		}
		const effects = deletionEffects(config, record.install.agentId, record.install.workspace, options.env);
		const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(readAgentDeleteDatabaseRegistry(options), record.install.agentId, options.env);
		const sharedWithSurvivor = (pathname) => isPathOwnedBySurvivingAgent(config, record.install.agentId, pathname, survivingDatabaseFilePaths, options.env);
		const sharedWorkspace = Boolean(effects.workspace) && sharedWithSurvivor(effects.workspace);
		const sharedAgentDir = sharedWithSurvivor(effects.agentDir);
		const sharedSessionsDir = sharedWithSurvivor(effects.sessionsDir);
		const workspaceHasModifiedFiles = record.workspaceFiles.some((file) => file.state === "modified") || record.bootstrap.state === "modified";
		const trackedWorkspacePaths = [...record.workspaceFiles.map((file) => file.path), ...record.install.bootstrap && record.bootstrap.state === "pending" ? [record.bootstrap.path] : []];
		const workspaceHasUntrackedEntries = await workspaceContainsUntrackedEntries(record.install.workspace, trackedWorkspacePaths);
		const { attachedJobs, monitors, inspectionUnavailable } = await readClawRemoveCronInventory(record.install.agentId, options);
		const ownedSchedulerJobIds = new Set(record.cronJobs.filter((cron) => cron.status !== "removed" && cron.schedulerJobId).map((cron) => cron.schedulerJobId));
		actions.push({
			kind: "agent",
			id: record.install.agentId,
			action: "remove",
			target: `agents.entries[${JSON.stringify(record.install.agentId)}]`,
			blocked: record.agentState === "modified",
			details: {
				expectedState: record.agentState,
				configDigest: record.install.agentConfigDigest,
				removalSurfaceDigest: digestClawAgentRemovalSurface(options.config ?? getRuntimeConfig(), record.install.agentId),
				ownedPaths: record.install.agentOwnedPaths
			},
			...record.agentState === "modified" ? { reason: "Agent config digest changed." } : {}
		});
		if (effects.pruned.removedBindings > 0) actions.push({
			kind: "configBinding",
			id: record.install.agentId,
			action: "remove",
			target: `bindings[agentId=${record.install.agentId}]`,
			blocked: record.agentState === "modified",
			details: { count: effects.pruned.removedBindings }
		});
		if (effects.pruned.removedAllow > 0) actions.push({
			kind: "agentAllow",
			id: record.install.agentId,
			action: "remove",
			target: `tools.agentToAgent.allow[${record.install.agentId}]`,
			blocked: record.agentState === "modified",
			details: { count: effects.pruned.removedAllow }
		});
		if (effects.workspace) actions.push({
			kind: "workspace",
			id: record.install.agentId,
			action: sharedWorkspace || workspaceHasModifiedFiles || workspaceHasUntrackedEntries ? "retain" : "trash",
			target: effects.workspace,
			blocked: record.agentState === "modified",
			details: {
				retained: sharedWorkspace || workspaceHasModifiedFiles || workspaceHasUntrackedEntries,
				sharedWith: effects.workspaceSharedWith
			},
			...sharedWorkspace ? { reason: "Workspace contains state owned by another agent." } : workspaceHasModifiedFiles ? { reason: "Workspace contains locally modified Claw-managed files." } : workspaceHasUntrackedEntries ? { reason: "Workspace contains files or directories not managed by this Claw." } : {}
		});
		if (effects.agentDir) actions.push({
			kind: "agentState",
			id: record.install.agentId,
			action: sharedAgentDir ? "retain" : "trash",
			target: effects.agentDir,
			blocked: record.agentState === "modified",
			...sharedAgentDir ? { reason: "Agent directory contains state owned by another agent." } : {}
		});
		actions.push({
			kind: "sessionIndex",
			id: record.install.agentId,
			action: "delete",
			target: `session store entries for agent:${record.install.agentId}`,
			blocked: record.agentState === "modified"
		});
		actions.push({
			kind: "sessionTranscripts",
			id: record.install.agentId,
			action: sharedSessionsDir ? "retain" : "trash",
			target: effects.sessionsDir,
			blocked: record.agentState === "modified",
			...sharedSessionsDir ? { reason: "Session directory contains state owned by another agent." } : {}
		});
		for (const job of attachedJobs.filter((candidate) => !ownedSchedulerJobIds.has(candidate.id))) {
			if (monitors.some((monitor) => isDeepStrictEqual(monitor, job))) {
				actions.push({
					kind: "scheduledJob",
					id: job.id,
					action: "remove",
					target: `cron_jobs:${job.id}`,
					blocked: false,
					reason: "Config-owned monitor; Gateway cancellation and drainage precede local cleanup.",
					details: { ...job }
				});
				continue;
			}
			blockers.push({
				code: "agent_job_attached",
				message: `Cron job ${JSON.stringify(job.id)} still references agent ${JSON.stringify(record.install.agentId)}; reassign or remove independent work, or reconnect to the serving Gateway to verify monitor ownership.`
			});
			actions.push({
				kind: "scheduledJob",
				id: job.id,
				action: "retain",
				target: `cron_jobs:${job.id}`,
				blocked: true,
				reason: "Scheduled work without verified Claw or config ownership must be handled explicitly.",
				details: {
					...inspectionUnavailable ? { monitorInspection: "unavailable" } : {},
					name: job.name,
					enabled: job.enabled,
					agentId: job.agentId,
					ownerAgentId: job.ownerAgentId
				}
			});
		}
		for (const file of record.workspaceFiles) actions.push({
			kind: "workspaceFile",
			id: file.path,
			action: file.state === "unchanged" ? "delete" : "retain",
			target: `${file.workspace}:${file.path}`,
			blocked: file.state === "unsafe",
			details: {
				expectedState: file.state,
				contentDigest: file.contentDigest,
				workspace: file.workspace
			},
			...file.state === "modified" ? { reason: "Local content changed; preserve the file." } : {}
		});
		const bootstrapAction = planClawBootstrapRemoval(record);
		if (bootstrapAction) actions.push(bootstrapAction);
		actions.push(...packagePlan.actions);
		const unmatchedMcpSelectors = new Set(mcpCleanup?.selected ?? []);
		for (const server of record.mcpServers) {
			const blocked = server.state === "pending";
			const decision = planClawMcpServerRemoval(server, {
				...options,
				referencedCleanup: mcpCleanup
			});
			unmatchedMcpSelectors.delete(clawMcpRemovalSelector(server));
			if (decision.blocked) blockers.push({
				code: "referenced_cleanup_requires_override",
				message: `${clawMcpRemovalSelector(server)}: ${decision.reason ?? "explicit conflict override is required"}`
			});
			actions.push({
				kind: "mcpServer",
				id: server.name,
				action: blocked ? "retain" : decision.action,
				target: `mcp.servers.${server.name}`,
				blocked,
				details: {
					expectedState: server.state,
					configDigest: server.configDigest,
					relationship: server.relationship,
					origin: server.origin,
					independentOwner: server.independentOwner,
					affectedClawAgentIds: decision.affectedClawAgentIds,
					cleanupMode: mcpCleanup?.mode ?? "retain",
					availableCleanupModes: server.relationship === "referenced" ? [
						"retain",
						"remove-if-unused",
						"remove-selected"
					] : ["remove"]
				},
				...blocked ? { reason: `MCP ownership state is ${server.state}.` } : decision.reason ? { reason: decision.reason } : {}
			});
		}
		for (const selector of unmatchedMcpSelectors) blockers.push({
			code: "referenced_cleanup_not_found",
			message: `Selected referenced resource ${JSON.stringify(selector)} is not owned by this Claw.`
		});
		for (const cron of record.cronJobs) {
			const blocked = cron.status !== "removed" && (cron.status !== "complete" || !cron.schedulerJobId);
			actions.push({
				kind: "cronJob",
				id: cron.manifestId,
				action: blocked ? "retain" : "remove",
				target: cron.schedulerJobId ?? cron.declarationKey,
				blocked,
				details: {
					expectedStatus: cron.status,
					declarationKey: cron.declarationKey,
					schedulerJobId: cron.schedulerJobId,
					job: cron.job
				},
				...blocked ? { reason: `Cron ownership state is ${cron.status}.` } : {}
			});
		}
		actions.push({
			kind: "installRecord",
			id: record.install.agentId,
			action: "remove",
			target: `claw_installs:${record.install.agentId}`,
			blocked: false,
			details: {
				expectedStatus: record.install.status,
				planIntegrity: record.install.planIntegrity,
				sourceIntegrity: record.install.claw.integrity
			}
		});
	}
	const planIdentity = {
		target,
		agentId: record?.install.agentId,
		actions,
		blockers
	};
	return {
		schemaVersion: CLAW_REMOVE_PLAN_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		dryRun: true,
		mutationAllowed: false,
		planIntegrity: digestClawRemovalState(planIdentity),
		target,
		...record ? { agentId: record.install.agentId } : {},
		actions,
		blockers
	};
}
async function applyClawRemovePlan(plan, options = {}) {
	if (options.consentPlanIntegrity !== plan.planIntegrity) throw new ClawRemoveError("plan_integrity_mismatch", "Consent does not match the current Claw remove plan; run remove --dry-run again.");
	if (plan.blockers.length > 0 || !plan.agentId) throw new ClawRemoveError("remove_blocked", "The Claw remove plan contains blockers.");
	const monitorGateway = options.monitorGateway;
	if (!monitorGateway) throw new ClawRemoveError("monitor_gateway_required", "Claw removal requires the serving Gateway to establish safe cancellation and drainage.");
	const currentPlan = await buildClawRemovePlan(plan.target, options);
	if (currentPlan.planIntegrity !== plan.planIntegrity) throw new ClawRemoveError("remove_changed", "Claw-owned state changed after remove planning.");
	const agentId = plan.agentId;
	const expectedRemovalSurfaceDigest = plan.actions.find((action) => action.kind === "agent" && action.id === agentId)?.details?.removalSurfaceDigest;
	if (typeof expectedRemovalSurfaceDigest !== "string") throw new ClawRemoveError("remove_changed", "Claw remove plan is missing config state.");
	const record = (await readClawStatus(plan.agentId, options)).records[0];
	if (!record || record.agentState === "modified" || clawBootstrapStateBlocksRemove(record) || record.workspaceFiles.some((file) => file.state === "unsafe") || record.mcpServers.some((server) => server.state === "pending")) throw new ClawRemoveError("remove_changed", "Claw-owned state changed after remove planning.");
	const packageDecisions = await planClawPackageRemovals(record.install, record.packages, {
		...options,
		deps: options.packageDeps,
		referencedCleanup: filterReferencedCleanup(options.referencedCleanup, "package")
	});
	const plannedPackages = plan.actions.filter((action) => action.kind === "packageRef").map((action) => `${action.id}:${action.action}`).toSorted();
	const currentPackages = packageDecisions.map((decision) => `${decision.packageRef.kind}:${decision.packageRef.ref}@${decision.packageRef.version}:${decision.action === "uninstall" ? "uninstall" : "release"}`).toSorted();
	if (JSON.stringify(plannedPackages) !== JSON.stringify(currentPackages)) throw new ClawRemoveError("remove_changed", "Package ownership changed after remove planning.");
	const plannedMcpServers = plan.actions.filter((action) => action.kind === "mcpServer").map((action) => `${action.id}:${action.action}`).toSorted();
	const currentMcpServers = record.mcpServers.map((server) => `${server.name}:${planClawMcpServerRemoval(server, options).action}`).toSorted();
	if (JSON.stringify(plannedMcpServers) !== JSON.stringify(currentMcpServers)) throw new ClawRemoveError("remove_changed", "MCP ownership changed after remove planning.");
	const result = {
		schemaVersion: CLAW_REMOVE_RESULT_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		dryRun: false,
		status: "partial",
		agentId,
		agentRemoved: false,
		workspaceFiles: [],
		packages: [],
		mcpServers: [],
		cronJobs: [],
		packageRefsReleased: 0
	};
	const partial = (code, message) => ({
		...result,
		error: {
			code,
			message
		}
	});
	const monitors = currentPlan.actions.filter((action) => action.kind === "scheduledJob" && action.action === "remove").map((action) => clawMonitorSnapshotSchema.parse(action.details));
	return await withClawAgentConfigRemoval({
		agentId,
		expectedDigest: record.install.agentConfigDigest,
		expectedInstall: record.orphaned ? null : record.install,
		expectedRemovalSurfaceDigest,
		expectedState: record.agentState,
		fallbackWorkspace: record.install.workspace,
		config: options.config,
		stateDatabase: options,
		onModified: () => new ClawRemoveError("agent_modified", "Agent config changed during remove."),
		quiesceMonitors: (operationId) => monitorGateway.quiesce(agentId, operationId, monitors),
		drainMonitors: async (operationId) => await monitorGateway.drain(agentId, operationId)
	}, async (commitRemoval, assertCurrent) => {
		assertCurrent();
		const mcpRemoval = await removeClawMcpServers({
			agentId,
			servers: record.mcpServers,
			options,
			assertCurrent
		});
		assertCurrent();
		result.mcpServers = mcpRemoval.mcpServers;
		if (mcpRemoval.error) return partial("mcp_cleanup_failed", mcpRemoval.error);
		const cronJobs = result.cronJobs;
		for (const cron of record.cronJobs) {
			if (cron.status !== "removed" && (!cron.schedulerJobId || cron.status !== "complete")) throw new ClawRemoveError("cron_cleanup_uncertain", `Cron declaration ${JSON.stringify(cron.manifestId)} is not safely removable.`);
			if (cron.status !== "removed" && (!options.cronGateway?.get || !options.cronGateway.remove)) throw new ClawRemoveError("cron_gateway_required", "Claw cron jobs require the gateway-owned cron.get and cron.remove APIs.");
			try {
				if (cron.status !== "removed") {
					const live = await options.cronGateway.get(cron.schedulerJobId);
					if (live != null && !clawCronGatewayJobMatchesRef(agentId, cron, live)) throw new Error(`Cron declaration ${JSON.stringify(cron.manifestId)} changed after planning.`);
					assertCurrent();
					if (live != null) try {
						await options.cronGateway.remove(cron.schedulerJobId);
					} catch (removeError) {
						if (await options.cronGateway.get(cron.schedulerJobId) != null) throw removeError;
					}
					assertCurrent();
					markClawCronRefRemoved(agentId, cron.manifestId, options);
				}
				deleteClawCronRef(agentId, cron.manifestId, options);
				cronJobs.push({
					manifestId: cron.manifestId,
					schedulerJobId: cron.schedulerJobId,
					action: "removed"
				});
			} catch (error) {
				const message = coerceErrorMessage(error);
				cronJobs.push({
					manifestId: cron.manifestId,
					schedulerJobId: cron.schedulerJobId,
					action: "error",
					message
				});
				return partial("cron_cleanup_failed", message);
			}
		}
		const configRemoval = await commitRemoval();
		const { cleanupTargets, configBeforeDelete, completeDeletion } = configRemoval;
		result.agentRemoved = configRemoval.agentRemoved;
		try {
			await configRemoval.drainMonitors();
			configRemoval.assertCurrent();
		} catch (error) {
			return partial("monitor_cleanup_failed", coerceErrorMessage(error));
		}
		const purgeFailed = await (options.purgeSessions ?? (await import("./cleanup-service-C7InSMgq.mjs")).purgeAgentSessionStoreEntries)(configBeforeDelete, agentId, {
			env: options.env,
			runDatabaseCleanup: configRemoval.runDatabaseCleanup
		});
		assertCurrent();
		if (purgeFailed) return partial("session_cleanup_failed", "Session cleanup failed; correct the reported error and retry Claw removal.");
		try {
			const removed = await applyClawPackageRemovalPhase(packageDecisions, {
				...options,
				agentId,
				operationId: configRemoval.operationId,
				assertCurrent
			});
			result.packages = removed.packages;
			result.pluginRuntime = removed.application;
			result.warnings = removed.warnings;
		} catch (error) {
			return partial("package_cleanup_failed", coerceErrorMessage(error));
		}
		assertCurrent();
		const packageErrors = result.packages.filter((pkg) => pkg.action === "error");
		if (packageErrors.length > 0) return partial("package_cleanup_failed", packageErrors.map((pkg) => pkg.reason).join("; "));
		const workspaceFiles = result.workspaceFiles;
		for (const file of record.workspaceFiles) {
			assertCurrent();
			workspaceFiles.push(await removeClawWorkspaceFile(file, assertCurrent));
		}
		assertCurrent();
		const bootstrap = await removeClawBootstrap(record, assertCurrent);
		const cleanupErrors = workspaceFiles.filter((file) => file.action === "error").map((file) => file.message ?? `Could not remove ${file.path}.`);
		if (bootstrap?.action === "error") cleanupErrors.push(bootstrap.message ?? `Could not remove ${bootstrap.path}.`);
		if (cleanupErrors.length === 0) {
			const workspaceHasRemainingEntries = await workspaceContainsUntrackedEntries(cleanupTargets.workspaceDir, record.workspaceFiles.map((file) => file.path));
			configRemoval.assertCurrent();
			cleanupErrors.push(...await cleanupClawAgentFilesystem({
				agentId,
				nextConfig: configRemoval.nextConfig,
				targets: cleanupTargets,
				runtime: clawRemoveQuietRuntime,
				trashPath: options.trashPath,
				stateDatabase: options,
				assertCurrent,
				retainWorkspace: workspaceHasRemainingEntries || bootstrap?.action === "retainedModified" || workspaceFiles.some((file) => file.action === "retainedModified")
			}));
		}
		const complete = releaseClawRemoveRows(agentId, workspaceFiles, cleanupErrors, configRemoval.assertCurrent, completeDeletion, options);
		return {
			...result,
			status: complete ? "complete" : "partial",
			...bootstrap ? { bootstrap } : {},
			packageRefsReleased: complete ? record.packages.length : 0,
			...complete ? {} : { error: {
				code: "workspace_cleanup_failed",
				message: cleanupErrors.join("; ")
			} }
		};
	}).catch((error) => partial(error instanceof ClawRemoveError ? error.code : "monitor_cleanup_failed", coerceErrorMessage(error)));
}
//#endregion
export { CLAW_REMOVE_RESULT_SCHEMA_VERSION as i, buildClawRemovePlan as n, CLAW_REMOVE_PLAN_SCHEMA_VERSION as r, applyClawRemovePlan as t };
