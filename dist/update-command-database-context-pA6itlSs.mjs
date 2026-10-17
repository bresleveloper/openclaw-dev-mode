import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { f as createUpdatePreflightFailure } from "./service-inspection-error-Bsltcpi4.mjs";
import { n as UpdatePreMutationError } from "./shared-D-l8dmoD.mjs";
import { l as resolveForegroundUpdateAdmission, n as maybeStopManagedServiceBeforeMutableUpdate, o as formatUpdateAncestryBlockMessage } from "./update-command-service-maintenance-ClkdH7ec.mjs";
import { n as GatewayServiceUpdateOwnershipError } from "./update-command-service-plan-VzuhDrTH.mjs";
import { a as isCandidateAdmissionContextCovered, i as hasSchemaRefusal, n as checkTargetDatabaseSchemasForContexts, r as formatSchemaRefusalLines, t as captureTargetDatabaseSchemaContext } from "./schema-preflight-Cj5ktU_q.mjs";
import { a as collectServiceInspectionFailureFacts } from "./update-command-result-hCfuj3eW.mjs";
import "./update-command-service-Br72rNnv.mjs";
import { a as resolveOwnedManagedUpdatePreflightEnv, o as revalidateUpdateDatabaseContext, r as captureOwnedManagedUpdatePreflightContext } from "./update-command-managed-context-xD7-PYYs.mjs";
//#region src/cli/update-cli/update-command-database-context.ts
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
		if (foreground && (inspected.serviceUpdateVerdict?.kind === "owned" || inspected.serviceUpdateVerdict?.kind === "unresolved") && inspected.offline !== true) {
			const failure = createUpdatePreflightFailure("service-not-offline", void 0, "managed-service-preflight");
			throw new UpdatePreMutationError("managed-service-preflight", failure.message, failure);
		}
		if (params.managedServiceRoot && (inspected.serviceUpdateVerdict?.kind !== "owned" || !inspected.serviceUpdateVerdict.refreshDefinition)) {
			const failure = createUpdatePreflightFailure("service-definition-not-writable", void 0, "managed-service-preflight");
			throw new UpdatePreMutationError("managed-service-preflight", failure.message, failure);
		}
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
	if ((params.managedServiceRootRedirect || params.managedServiceRoot) && !managedEnv) {
		const failure = createUpdatePreflightFailure("service-context-changed", void 0, "managed-service-preflight");
		throw new UpdatePreMutationError("managed-service-preflight", failure.message, failure);
	}
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
/** Recheck the admitted service and stores together before mutable update work. */
async function revalidateUpdateDatabaseContexts(params, admission, versions) {
	if (!admission) throw new UpdatePreMutationError("database-schema-preflight", "Database admission was not inspected.");
	await inspectUpdateManagedServices({
		...params,
		roots: [...admission.services.keys()],
		expectedServices: admission.services,
		expectedForeground: admission.foreground
	});
	admission.contexts = await Promise.all(admission.contexts.map(revalidateUpdateDatabaseContext));
	const installedContexts = params.candidateAdmissionChecks?.includes("database-schema") ? admission.contexts.filter((context) => !isCandidateAdmissionContextCovered(context.env)) : admission.contexts;
	const schemas = await checkTargetDatabaseSchemasForContexts(versions, installedContexts);
	if (hasSchemaRefusal(schemas)) throw new UpdatePreMutationError("database-schema-preflight", formatSchemaRefusalLines(schemas).join("\n"));
	return admission;
}
//#endregion
export { inspectUpdateManagedServices as n, revalidateUpdateDatabaseContexts as r, inspectUpdateDatabaseContexts as t };
