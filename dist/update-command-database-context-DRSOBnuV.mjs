import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { i as isPidAlive } from "./pid-alive-dd7OR8F6.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { m as createUpdatePreflightFailure } from "./service-inspection-error-ozNMOrIE.mjs";
import { t as classifyOpenClawArgv } from "./gateway-process-argv-BLh8C227.mjs";
import { a as readGatewayLockProcessCmdline } from "./gateway-owner-lease-KxvFWleW.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { c as readLockPayload, u as resolveGatewayLockPaths } from "./gateway-lock-OT1e72lx.mjs";
import { b as UpdatePreMutationError } from "./update-global-BlXQRfes.mjs";
import "./shared-DRiGAorf.mjs";
import { n as maybeStopManagedServiceBeforeMutableUpdate, s as formatUpdateAncestryBlockMessage, u as resolveForegroundUpdateAdmission } from "./update-command-service-maintenance-DvLJF4Bi.mjs";
import { n as GatewayServiceUpdateOwnershipError } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { a as hasSchemaRefusal, i as formatSchemaRefusalLines, n as captureTargetDatabaseSchemaContext, o as isCandidateAdmissionContextCovered, r as checkTargetDatabaseSchemasForContexts } from "./schema-preflight-Dfpu1-Iv.mjs";
import { a as collectServiceInspectionFailureFacts } from "./update-command-result-BgqRj9_Z.mjs";
import { a as resolveOwnedManagedUpdatePreflightEnv, r as captureOwnedManagedUpdatePreflightContext } from "./update-command-managed-context-CxkSVUSh.mjs";
//#region src/cli/update-cli/update-command-database-context.ts
function managedServicePreflightError(code) {
	const failure = createUpdatePreflightFailure(code, void 0, "managed-service-preflight");
	return new UpdatePreMutationError("managed-service-preflight", failure.message, failure);
}
/** The installed process owns ancestry and coordination inspection before candidate code runs. */
async function inspectUpdateManagedServices(params) {
	return await withCommandProcessScope(() => inspectUpdateManagedServicesInScope(params));
}
async function inspectUpdateManagedServicesInScope(params) {
	const foreground = await resolveForegroundUpdateAdmission({
		root: params.roots[0],
		expectedForeground: params.expectedForeground
	});
	let service;
	const services = /* @__PURE__ */ new Map();
	const serviceRoots = params.managedServiceRoot ? [params.managedServiceRoot] : params.roots;
	for (const root of new Set(serviceRoots)) {
		const inspected = await maybeStopManagedServiceBeforeMutableUpdate({
			root,
			handoffRoot: params.managedServiceRoot ? params.roots[0] : void 0,
			updateInstallKind: params.updateInstallKind,
			shouldRestart: params.shouldRestart,
			jsonMode: params.jsonMode,
			timeoutMs: params.timeoutMs,
			phase: "inspect",
			expectedService: params.expectedServices?.get(root),
			assertCurrent: params.assertCurrent,
			handoffFromGateway: params.handoffFromGateway
		}).catch((error) => {
			if (hasCommandProcessCleanupError(error)) throw error;
			if (error instanceof GatewayServiceUpdateOwnershipError) throw new UpdatePreMutationError("managed-service-preflight", error.message, { failureFacts: error.failureFacts });
			throw error;
		});
		if (inspected.blockMessage) throw new UpdatePreMutationError("managed-service-preflight", formatUpdateAncestryBlockMessage(inspected.blockMessage), { failureFacts: inspected.blockFailureFacts ?? collectServiceInspectionFailureFacts(inspected.serviceUpdateVerdict) });
		if (params.updateInstallKind === "package" && inspected.serviceUpdateVerdict?.kind === "unavailable") {
			const owner = await readLockPayload(resolveGatewayLockPaths(process.env).ownerLockPath);
			const live = owner && isPidAlive(owner.pid) && (owner.role ?? "gateway") === "gateway";
			const argv = live ? readGatewayLockProcessCmdline(owner.pid, process.platform, params.timeoutMs) : null;
			const entry = classifyOpenClawArgv(argv ?? [], {
				requirePackageIdentity: true,
				pid: owner?.pid
			});
			if (live && (process.platform === "win32" && (!argv || entry.kind === "unclassified") || entry.kind === "openclaw" && entry.packageIdentity && resolveIdentityPathViaExistingAncestorSync(entry.packageIdentity.root) === resolveIdentityPathViaExistingAncestorSync(params.roots[0] ?? root))) {
				const failure = createUpdatePreflightFailure("gateway-stop-unverified");
				throw new UpdatePreMutationError("gateway-stop-unverified", failure.message, failure);
			}
		}
		if (foreground && (inspected.serviceUpdateVerdict?.kind === "owned" || inspected.serviceUpdateVerdict?.kind === "unresolved") && inspected.offline !== true) throw managedServicePreflightError("service-not-offline");
		if (params.managedServiceRoot && (inspected.serviceUpdateVerdict?.kind !== "owned" || !inspected.serviceUpdateVerdict.refreshDefinition)) throw managedServicePreflightError("service-definition-not-writable");
		services.set(root, inspected);
		if (inspected.serviceUpdateVerdict?.kind === "owned") {
			service = inspected;
			break;
		}
	}
	const managedEnv = resolveOwnedManagedUpdatePreflightEnv({
		stopState: service,
		processEnv: process.env,
		invocationCwd: params.invocationCwd
	});
	if ((params.managedServiceRootRedirect || params.managedServiceRoot) && !managedEnv) throw managedServicePreflightError("service-context-changed");
	return {
		service,
		services,
		managedEnv,
		...foreground ? { foreground: true } : {}
	};
}
async function inspectUpdateDatabaseContexts(params) {
	return await withCommandProcessScope(async () => {
		const inspected = await inspectUpdateManagedServicesInScope(params);
		const configValidation = params.candidateAdmissionChecks?.includes("config") ? "candidate" : void 0;
		const managed = await captureOwnedManagedUpdatePreflightContext({
			stopState: inspected.service,
			processEnv: process.env,
			invocationCwd: params.invocationCwd,
			legacyConfigPlan: params.legacyConfigPlan,
			configValidation
		});
		const contexts = params.managedServiceRootRedirect ? [] : [await captureTargetDatabaseSchemaContext(process.env, {
			legacyConfigPlan: params.callerLegacyConfigPlan?.snapshot.path === resolveConfigPath() ? params.callerLegacyConfigPlan : params.legacyConfigPlan,
			configValidation
		})];
		if (managed) contexts.push(managed);
		return {
			...inspected,
			contexts,
			managedEnv: inspected.foreground ? void 0 : managed?.env
		};
	});
}
/** Check target schema support; native service effects validate their own authority. */
async function revalidateUpdateDatabaseContexts(params, admission, versions) {
	if (!admission) throw new UpdatePreMutationError("database-schema-preflight", "Database admission was not inspected.");
	const installedContexts = params.candidateAdmissionChecks?.includes("database-schema") ? admission.contexts.filter((context) => !isCandidateAdmissionContextCovered(context.env)) : admission.contexts;
	const schemas = await checkTargetDatabaseSchemasForContexts(versions, installedContexts);
	if (hasSchemaRefusal(schemas)) throw new UpdatePreMutationError("database-schema-preflight", formatSchemaRefusalLines(schemas).join("\n"));
	return admission;
}
//#endregion
export { inspectUpdateManagedServices as n, revalidateUpdateDatabaseContexts as r, inspectUpdateDatabaseContexts as t };
