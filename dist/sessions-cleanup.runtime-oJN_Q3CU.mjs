import { d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as GatewayStateOwnerContentionError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import "./gateway-state-owner-X3EqhtYx.mjs";
import { n as openDoctorStateSchemaReadAdmission } from "./openclaw-state-db-doctor-schema-l6CS6yvq.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { p as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { f as readActiveOpenClawAgentDatabaseLeasesReadOnly } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-d5S6zg8U.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { n as resolveMaintenanceConfig } from "./store-maintenance-runtime-Z7En5Q4b.mjs";
import "./sessions-CnzPI1yx.mjs";
import { i as createSessionsCleanupFailure, n as runSessionsCleanup, r as SessionsCleanupFailureError } from "./cleanup-service-BHj-66gM.mjs";
import { t as resolveSessionCleanupAction } from "./cleanup-action-DfshKGKz.mjs";
import { n as withActivatedPluginIds } from "./activation-context-ZGPJ_bJQ.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-OT1e72lx.mjs";
import { t as ExpectedCliError } from "./failure-output-CpIKhMiV.mjs";
import { n as loadPluginRegistryHandle } from "./loader-B8PRFJEU.mjs";
import { i as withDoctorSqliteMaintenanceLock, t as DoctorSqliteMaintenanceLockUnavailableError } from "./doctor-sqlite-maintenance-lock-DU0BUhr6.mjs";
//#region src/commands/sessions-cleanup.runtime.ts
function prepareCleanupHarnessOwners(config, workspaceDir) {
	const metadata = loadPluginMetadataSnapshot({
		config,
		workspaceDir
	});
	const harnessOwners = metadata.plugins.flatMap((plugin) => {
		const runtime = plugin.activation?.onAgentHarnesses?.[0];
		return runtime ? [{
			plugin,
			runtime
		}] : [];
	});
	const pluginIds = harnessOwners.flatMap(({ plugin, runtime }) => resolveManifestActivationPluginIds({
		config,
		workspaceDir,
		manifestRecords: [plugin],
		trigger: {
			kind: "agentHarness",
			runtime
		},
		requireExplicitManifestOwnerTrust: true
	})).toSorted();
	return {
		registry: loadPluginRegistryHandle({
			config: withActivatedPluginIds({
				config,
				pluginIds
			}),
			activationSourceConfig: config,
			workspaceDir,
			onlyPluginIds: pluginIds,
			manifestRegistry: metadata.manifestRegistry,
			discovery: metadata.discovery,
			installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(metadata.index),
			throwOnLoadError: true
		}),
		excludedOwners: harnessOwners.filter(({ plugin }) => !pluginIds.includes(plugin.id)).map(({ plugin }) => plugin)
	};
}
function warnUnavailableCleanupOwners(owners, result, preview, runtime) {
	const summary = result.appliedSummaries[0];
	if (!summary || !preview || summary.missing + summary.dmScopeRetired + summary.modelRunPruned + summary.pruned + summary.capped === 0) return;
	const candidateHarnessIds = /* @__PURE__ */ new Set();
	let hasLegacyCandidate = false;
	for (const [key, entry] of Object.entries(preview.beforeStore)) {
		const action = resolveSessionCleanupAction({
			...preview,
			key
		});
		if (!entry.sessionId || action === "keep" || action === "archive-dashboard" || action === "archive-cap") continue;
		if (entry.agentHarnessId) candidateHarnessIds.add(entry.agentHarnessId);
		else hasLegacyCandidate = true;
	}
	const excluded = owners.excludedOwners.filter((plugin) => hasLegacyCandidate || plugin.activation?.onAgentHarnesses?.some((id) => candidateHarnessIds.has(id)));
	if (excluded.length > 0) runtime.error(`Warning: native session resources were not cleaned for unavailable harness owners: ${excluded.map((plugin) => plugin.id).toSorted().join(", ")}. Their plugins are disabled or not trusted; resources may remain. Enable or trust those plugins and use their repair flow.`);
}
/** Local destructive cleanup retains the offline owner through reclamation. */
async function runLocalSessionsCleanup(params, runtime) {
	const run = async () => {
		const ownersByWorkspace = /* @__PURE__ */ new Map();
		const results = [];
		let failure;
		for (const target of params.targets) {
			const workspaceDir = resolveAgentWorkspaceDir(params.cfg, target.agentId);
			let owners = ownersByWorkspace.get(workspaceDir);
			if (!owners) {
				owners = prepareCleanupHarnessOwners(params.cfg, workspaceDir);
				ownersByWorkspace.set(workspaceDir, owners);
			}
			let result;
			let preview;
			try {
				result = await withPluginRuntimeRegistryScope(owners.registry, async () => {
					if (owners.excludedOwners.length > 0 && !params.opts.dryRun) preview = (await runSessionsCleanup({
						...params,
						opts: {
							...params.opts,
							dryRun: true
						},
						targets: [target]
					})).previewResults[0];
					return runSessionsCleanup({
						...params,
						targets: [target],
						reclamationMode: "in-process"
					});
				});
			} catch (cause) {
				if (results.length === 0) throw cause;
				failure = cause instanceof SessionsCleanupFailureError ? cause.failure : createSessionsCleanupFailure(target, cause, false);
				break;
			}
			warnUnavailableCleanupOwners(owners, result, preview, runtime);
			results.push(result);
			if (result.failure) {
				failure = result.failure;
				break;
			}
		}
		const first = results[0];
		if (!first) return await runSessionsCleanup({
			...params,
			reclamationMode: "in-process"
		});
		return {
			mode: first.mode,
			previewResults: results.flatMap((result) => result.previewResults),
			appliedSummaries: results.flatMap((result) => result.appliedSummaries),
			...failure ? { failure } : {}
		};
	};
	if (params.opts.dryRun || !params.opts.enforce && !params.opts.fixMissing && !params.opts.fixDmScope && resolveMaintenanceConfig().mode !== "enforce") return await run();
	try {
		return await withDoctorSqliteMaintenanceLock({
			operation: "sessions cleanup",
			protectedPaths: params.targets.map((target) => resolveSqliteTargetFromSessionStorePath(target.storePath, target).path),
			run: async (authority) => {
				const owner = readActiveOpenClawAgentDatabaseLeasesReadOnly({}, openDoctorStateSchemaReadAdmission).find((lease) => lease.owner_pid !== process.pid);
				if (owner) throw cleanupOwnerRefusal(`agent ${owner.agent_id} (PID ${owner.owner_pid})`);
				authority.assertCurrent();
				return await run();
			}
		});
	} catch (error) {
		if (!(error instanceof DoctorSqliteMaintenanceLockUnavailableError) || !(error.cause.cause instanceof GatewayStateOwnerContentionError)) throw error;
		const owner = await readActiveGatewayLockIdentity({ includeEmbedded: true });
		throw cleanupOwnerRefusal(owner ? `OpenClaw process (PID ${owner.pid})` : "another OpenClaw process");
	}
}
function cleanupOwnerRefusal(owner) {
	const message = `Cannot run local sessions cleanup: ${owner} owns this state; run Gateway-delegated cleanup without --store, or stop the Gateway and other owners first.`;
	return new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
//#endregion
export { runLocalSessionsCleanup };
