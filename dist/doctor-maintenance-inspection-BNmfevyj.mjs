import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-M64rViod.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-rkhEAmAi.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { t as GatewayStateOwnerContentionError } from "./gateway-state-owner-DmHycK5o.mjs";
import { t as DoctorUnreadableStateDatabaseError } from "./state-repair-message-B5Bu99oR.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { c as hasGatewayServiceStopUnsafeError } from "./service-inspection-error-Bsltcpi4.mjs";
import { o as withArtifactPreservingStateReads, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { c as readStateLeaseProcessOwnerStatus } from "./openclaw-state-lease-store-gySh31JU.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-yVslo54h.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-DuSgsySH.mjs";
import { n as GatewayLockError } from "./gateway-lock-B6mKYs2x.mjs";
import { t as ExecApprovalsMigrationRequiredError } from "./exec-approvals-migration-gate-4cEEb67t.mjs";
import { t as DoctorStateMigrationRefusalError } from "./state-migrations.messages-CXxBVY0a.mjs";
//#region src/commands/doctor-maintenance-inspection.ts
/** An app's package-update authority does not own repair of its already offline state. */
async function readOfflineAppOwnedDoctorInspection(error, env) {
	const { GatewayServiceUpdateOwnershipError } = await import("./update-command-service-plan-DhvGRHPO.mjs");
	if (hasCommandProcessCleanupError(error) || !(error instanceof GatewayServiceUpdateOwnershipError) || !error.failureFacts.some((fact) => fact.check === "managed-service" && fact.code === "service-mutation-refused")) return;
	const { readGatewayServiceState, resolveGatewayService } = await import("./service-CEHmkj0v.mjs");
	const { assertDoctorServiceSelection } = await import("./doctor-service-repair-policy-BzB2Pfvy.mjs");
	const state = await readGatewayServiceState(resolveGatewayService(), {
		env,
		requireEffective: true,
		validateEnvBeforeStatusRead: (serviceEnv) => assertDoctorServiceSelection(env, serviceEnv)
	});
	if (!state.command) return;
	const { summarizeGatewayServiceLayout } = await import("./service-layout-B33QDzfj.mjs");
	const { readInstallOwner, formatInstallOwnerMessage } = await import("./install-owner-C6B0L6kK.mjs");
	const owner = await readInstallOwner((await summarizeGatewayServiceLayout(state.command))?.packageRootReal ?? null);
	const { isManagedGatewayServiceOffline } = await import("./update-command-service-publication-CKC4U9IH.mjs");
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
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, { type: "doctor.gatewayOwnerLease.read" }, {
		current: true,
		signal
	}));
	signal.throwIfAborted();
	if (!reply) return;
	if (!reply.ok || reply.type !== "doctor.gatewayOwnerLease.read") throw new Error("Unexpected Doctor Gateway owner lease read result");
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
	const { assertSessionStoreMigrationComplete } = await import("./startup-migration-Dci0ffgl.mjs");
	assertSessionStoreMigrationComplete({
		cfg,
		env,
		operation: "doctor"
	});
	const { assertOpenClawDatabasesReady } = await import("./openclaw-database-preflight-ClnnU5e8.mjs");
	const { resolveConfiguredAgentDatabaseTargets } = await import("./targets-Be8sKF4o.mjs");
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
	const { assertConfiguredWorkspaceStateReady } = await import("./workspace-state-dirs-C3i8yrXw.mjs");
	await assertConfiguredWorkspaceStateReady({
		cfg,
		operation: "doctor"
	});
	const { assertNoPendingLegacyExecApprovals } = await import("./exec-approvals-migration-gate-ChKEox6L.mjs");
	assertNoPendingLegacyExecApprovals({
		operation: "doctor",
		env
	});
	if (!schemaPublicationDeferred && databaseTargets) {
		const { completeDoctorMigrationBackups } = await import("./doctor-migration-backup-artifacts-BmcblQ2C.mjs");
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
