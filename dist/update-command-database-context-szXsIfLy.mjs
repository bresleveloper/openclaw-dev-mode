import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { n as UpdatePreMutationError } from "./shared-Ca2ebFXK.mjs";
import { a as resolveForegroundUpdateAdmission, t as formatUpdateAncestryBlockMessage } from "./update-command-handoff-DDmZ8LRL.mjs";
import { n as GatewayServiceUpdateOwnershipError } from "./update-command-service-plan-B89pDfz8.mjs";
import { r as maybeStopManagedServiceBeforeMutableUpdate } from "./update-command-service-maintenance-DeciiZGR.mjs";
import { i as hasSchemaRefusal, n as checkTargetDatabaseSchemasForContexts, r as formatSchemaRefusalLines, t as captureTargetDatabaseSchemaContext } from "./schema-preflight-IQHekWL6.mjs";
import { a as collectServiceInspectionFailureFacts } from "./update-command-result-BL-5x2xq.mjs";
import "./update-command-service-DsNlwCK0.mjs";
import { a as revalidateUpdateDatabaseContext, r as captureOwnedManagedUpdatePreflightContext } from "./update-command-managed-context-C83YdWj9.mjs";
//#region src/cli/update-cli/update-command-database-context.ts
async function inspectUpdateDatabaseContexts(params) {
	return await withCommandProcessScope(async () => {
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
				expectedService: params.expectedServices?.get(root)
			}).catch((error) => {
				if (hasCommandProcessCleanupError(error)) throw error;
				if (error instanceof GatewayServiceUpdateOwnershipError) throw new UpdatePreMutationError("managed-service-preflight", error.message, { failureFacts: error.failureFacts });
				throw error;
			});
			if (inspected.blockMessage) throw new UpdatePreMutationError("managed-service-preflight", formatUpdateAncestryBlockMessage(inspected.blockMessage), { failureFacts: collectServiceInspectionFailureFacts(inspected.serviceUpdateVerdict) });
			if (foreground && (inspected.serviceUpdateVerdict?.kind === "owned" || inspected.serviceUpdateVerdict?.kind === "unresolved") && inspected.offline !== true) throw new UpdatePreMutationError("managed-service-preflight", "Another Gateway service uses this installation and is not verified offline. Stop it through its service owner before updating the foreground Gateway.", { failureFacts: collectServiceInspectionFailureFacts(inspected.serviceUpdateVerdict) });
			if (params.managedServiceRoot && (inspected.serviceUpdateVerdict?.kind !== "owned" || !inspected.serviceUpdateVerdict.refreshDefinition)) throw new UpdatePreMutationError("managed-service-preflight", "The Gateway cannot be rebound from its current installation: its owned service definition must be writable before this update can align it with the CLI.");
			services.set(root, inspected);
			if (inspected.serviceUpdateVerdict?.kind === "owned") {
				service = inspected;
				break;
			}
		}
		const managed = await captureOwnedManagedUpdatePreflightContext({
			stopState: service,
			processEnv: process.env,
			invocationCwd: params.invocationCwd,
			legacyConfigPlan: params.legacyConfigPlan
		});
		if ((params.managedServiceRootRedirect || params.managedServiceRoot) && !managed) throw new UpdatePreMutationError("managed-service-preflight", "The managed Gateway service changed before database admission. Retry so its package root and state can be inspected together.");
		const contexts = params.managedServiceRootRedirect ? [] : [await captureTargetDatabaseSchemaContext(process.env, { legacyConfigPlan: params.legacyConfigPlan })];
		if (managed) contexts.push(managed);
		return {
			service,
			services,
			contexts,
			managedEnv: foreground ? void 0 : managed?.env,
			...foreground ? { foreground: true } : {}
		};
	});
}
/** Recheck the admitted service and stores together before mutable update work. */
async function revalidateUpdateDatabaseContexts(params, admission, versions) {
	if (!admission) throw new UpdatePreMutationError("database-schema-preflight", "Database admission was not inspected.");
	await inspectUpdateDatabaseContexts({
		...params,
		roots: [...admission.services.keys()],
		expectedServices: admission.services,
		expectedForeground: admission.foreground
	});
	admission.contexts = await Promise.all(admission.contexts.map(revalidateUpdateDatabaseContext));
	const schemas = await checkTargetDatabaseSchemasForContexts(versions, admission.contexts);
	if (hasSchemaRefusal(schemas)) throw new UpdatePreMutationError("database-schema-preflight", formatSchemaRefusalLines(schemas).join("\n"));
	return admission;
}
//#endregion
export { revalidateUpdateDatabaseContexts as n, inspectUpdateDatabaseContexts as t };
