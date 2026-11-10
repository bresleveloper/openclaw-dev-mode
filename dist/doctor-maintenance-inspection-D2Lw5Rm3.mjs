import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { t as GatewayStateOwnerContentionError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import "./gateway-state-owner-X3EqhtYx.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-D0mOtveg.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-C8zbzbYZ.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { n as readStateLeaseProcessOwnerStatus } from "./state-lease-process-owner-CPrBcVUW.mjs";
import { l as hasGatewayServiceStopUnsafeError } from "./service-inspection-error-ozNMOrIE.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-oZ38327j.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-BBNhGTcQ.mjs";
import { t as DoctorUnreadableStateDatabaseError } from "./state-repair-message-BvQp5mZ3.mjs";
import { t as ExecApprovalsMigrationRequiredError } from "./exec-approvals-migration-gate-uz_Dsb9e.mjs";
import { n as GatewayLockError } from "./gateway-lock-OT1e72lx.mjs";
import { t as DoctorStateMigrationRefusalError } from "./state-migrations.messages-CB0bXmSE.mjs";
//#region src/commands/doctor-maintenance-inspection.ts
/** An app's package-update authority does not own repair of its already offline state. */
async function readOfflineAppOwnedDoctorInspection(error, env) {
	const { GatewayServiceUpdateOwnershipError } = await import("./update-command-service-plan-DEiv-x4w.mjs");
	if (hasCommandProcessCleanupError(error) || !(error instanceof GatewayServiceUpdateOwnershipError) || !error.failureFacts.some((fact) => fact.check === "managed-service" && fact.code === "service-mutation-refused")) return;
	const { readGatewayServiceState, resolveGatewayService } = await import("./service-CtDX9tgS.mjs");
	const { assertDoctorServiceSelection } = await import("./doctor-service-repair-policy-DWUmm7Fs.mjs");
	const state = await readGatewayServiceState(resolveGatewayService(), {
		env,
		requireEffective: true,
		validateEnvBeforeStatusRead: (serviceEnv) => assertDoctorServiceSelection(env, serviceEnv)
	});
	if (!state.command) return;
	const { summarizeGatewayServiceLayout } = await import("./service-layout-Dr6dKWIt.mjs");
	const { readInstallOwner, formatInstallOwnerMessage } = await import("./install-owner-Ct0SM_bt.mjs");
	const owner = await readInstallOwner((await summarizeGatewayServiceLayout(state.command))?.packageRootReal ?? null);
	const { isManagedGatewayServiceOffline } = await import("./update-command-service-publication-CUEHTxr1.mjs");
	if (!owner || !await isManagedGatewayServiceOffline(state)) return;
	const message = `${formatInstallOwnerMessage(owner)} Doctor can repair offline state; Gateway service installation and activation remain with the app.`;
	return {
		stopped: false,
		inspected: true,
		runtimeInspected: true,
		running: false,
		offline: true,
		serviceEnv: state.env,
		serviceMutationAllowed: false,
		serviceUpdateVerdict: {
			kind: "unavailable",
			message
		},
		serviceMutationSkipMessage: message
	};
}
/** Observe the selected installation without bootstrapping it or inheriting a discovery view. */
async function readDoctorGatewayOwnerLease(env, signal) {
	const options = {
		env: { ...env },
		path: resolveOpenClawStateSqlitePath(env)
	};
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, {
		type: "gatewayOwnerLease.read",
		schemaMaintenance: true
	}, {
		current: true,
		signal
	}));
	signal.throwIfAborted();
	if (!reply) return;
	if (!reply.ok || reply.type !== "gatewayOwnerLease.read") throw new Error("Unexpected Doctor Gateway owner lease read result");
	return reply.lease ? {
		...reply.lease,
		state: readStateLeaseProcessOwnerStatus(reply.lease, reply.lease.heartbeatAt)
	} : void 0;
}
/** Admission has not opened repair writers; deferral cannot authorize any later work. */
function classifyDoctorMaintenanceRefusal(error) {
	const causes = collectNestedErrorCandidates(error);
	const refusal = causes.find((cause) => cause instanceof DoctorMaintenanceRefusalError && cause.refusal.kind === "data-at-risk");
	if (refusal) return refusal.refusal;
	if (hasGatewayServiceStopUnsafeError(error) || hasCommandProcessCleanupError(error)) return {
		kind: "data-at-risk",
		reason: "active-mutation"
	};
	if (causes.some((cause) => cause instanceof DoctorUnreadableStateDatabaseError)) return {
		kind: "data-at-risk",
		reason: "unreadable-state"
	};
	if (causes.some((cause) => cause instanceof DoctorStateMigrationRefusalError || cause instanceof StartupMaintenanceRequiredError || cause instanceof ExecApprovalsMigrationRequiredError || cause instanceof UpdateSchemaRefusalError)) return {
		kind: "data-at-risk",
		reason: "incomplete-migration"
	};
	if (causes.some((cause) => cause instanceof GatewayLockError || cause instanceof ConfigWritePostCommitError && cause.rollbackStatus !== "restored")) return {
		kind: "data-at-risk",
		reason: "gateway-state-unverified"
	};
	return {
		kind: "deferred",
		reason: causes.some((cause) => cause instanceof GatewayStateOwnerContentionError) ? "coordinator-contention" : "admission-unavailable"
	};
}
/** The same persisted-state admission protects completion and exceptional restoration. */
async function assertDoctorMaintenanceReady(cfg, env, log, databaseTargets) {
	let schemaPublicationDeferred = false;
	let refusedDatabasePaths = [];
	const { assertSessionStoreMigrationComplete } = await import("./startup-migration-DdU1d51x.mjs");
	assertSessionStoreMigrationComplete({
		cfg,
		env,
		operation: "doctor"
	});
	const { assertOpenClawDatabasesReady } = await import("./openclaw-database-preflight-D3lTU13W.mjs");
	const { resolveConfiguredAgentDatabaseTargets } = await import("./targets-BHY-ArLd.mjs");
	try {
		await assertOpenClawDatabasesReady({
			env,
			config: cfg,
			operation: "doctor",
			onDeferredSchemaPublication: (publication) => {
				schemaPublicationDeferred = true;
				log(publication.message);
			},
			onVerified: (schemas) => {
				refusedDatabasePaths = schemas.agentRefusals?.flatMap((refusal) => refusal.paths) ?? [];
			},
			configuredAgentDatabaseTargets: resolveConfiguredAgentDatabaseTargets(cfg, { env })
		});
	} catch (error) {
		throw new DoctorMaintenanceRefusalError(formatErrorMessage(error), {
			kind: "data-at-risk",
			reason: "incomplete-migration"
		}, { cause: error });
	}
	const { assertConfiguredWorkspaceStateReady } = await import("./workspace-state-dirs-BTAEPnuh.mjs");
	await assertConfiguredWorkspaceStateReady({
		cfg,
		operation: "doctor"
	});
	const { assertNoPendingLegacyExecApprovals } = await import("./exec-approvals-migration-gate-C_f5UQ3b.mjs");
	assertNoPendingLegacyExecApprovals({
		operation: "doctor",
		env
	});
	if (!schemaPublicationDeferred && databaseTargets) {
		const { completeDoctorMigrationBackups } = await import("./doctor-migration-backup-artifacts-Dj0U-Jwb.mjs");
		try {
			completeDoctorMigrationBackups(env, databaseTargets.filter((target) => !refusedDatabasePaths.some((refused) => refused === target.path || refused === target.realPath)).map((target) => target.path));
		} catch (error) {
			log(`Migration backups remain protected; completion registration failed: ${String(error)}`);
		}
	}
	return { schemaPublicationDeferred };
}
function assertDoctorMaintenanceInspection(inspection, env) {
	const kind = inspection.serviceUpdateVerdict?.kind;
	if (!inspection.blockMessage && (kind === "unavailable" || inspection.inspected && (kind === "owned" || kind === "absent" || inspection.offline === true))) return;
	const detail = inspection.blockMessage ?? inspection.serviceMutationSkipMessage ?? `Gateway service ownership or shutdown could not be verified. Run ${formatCliCommand("openclaw gateway status --deep", env)} and stop it through its service owner before retrying.`;
	const guidance = kind === "foreign" ? `Run ${formatCliCommand("openclaw gateway status --deep", env)} to locate the Gateway's installation, then run ${formatCliCommand("openclaw doctor --fix", env)} from that installation. The service was left unchanged.` : `Stop the Gateway service and other OpenClaw processes using this state, then run ${formatCliCommand("openclaw doctor --fix", env)} from an independent shell.`;
	throw new DoctorMaintenanceRefusalError(`Doctor could not enter maintenance. Error: ${detail} ${guidance}`, {
		kind: "data-at-risk",
		reason: "gateway-state-unverified"
	});
}
//#endregion
export { readOfflineAppOwnedDoctorInspection as a, readDoctorGatewayOwnerLease as i, assertDoctorMaintenanceReady as n, classifyDoctorMaintenanceRefusal as r, assertDoctorMaintenanceInspection as t };
