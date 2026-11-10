import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { d as prepareAgentDeletionJournalObservation } from "./agent-deletion-journal-DpYVtbBb.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { o as projectPluginRuntimeFailure } from "./lifecycle-CvcKJfYf.mjs";
import { f as claimClawPackageRefStatus } from "./path-containment-BLH2epmf.mjs";
import { A as planClawPackageRemovals, a as orderClawPackageRemovals, k as applyClawPackageRemovals, n as digestClawRemovalInstall, o as projectClawPackageRemovePlan, s as readClawPackageRemovalStatus, t as digestClawPackageRemovalPlan } from "./package-remove-plan-D6sNV8gA.mjs";
import { t as resolveClawMonitorCleanupBinding } from "./monitor-cleanup-binding-IJCEUt7F.mjs";
import { t as clawPackageRemovalRequestSchema } from "./package-remove-contract-BSc65q0f.mjs";
import { n as pluginLifecycleError, t as captureGatewayPluginRuntimeApplications } from "./plugins-lifecycle-error-D6f5ycKa.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/claws-packages.ts
const clawsPackageHandlers = { "claws.packages.remove": async ({ params, respond, context, signal, sessionMutationCommitGuard }) => {
	const parsed = clawPackageRemovalRequestSchema.safeParse(params);
	if (!parsed.success) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid Claw package cleanup parameters."));
		return;
	}
	const input = parsed.data;
	let captured;
	let entered = false;
	let releaseObservation;
	try {
		const applyRuntime = context.applyPluginLifecycleChange;
		if (!applyRuntime) throw new Error("Claw plugin cleanup requires a running plugin lifecycle owner.");
		const observation = await prepareAgentDeletionJournalObservation(input.agentId);
		releaseObservation = observation.release;
		const assertCurrent = () => {
			signal?.throwIfAborted();
			sessionMutationCommitGuard?.();
			observation.assertCurrent(input.operationId);
			if (!isDeepStrictEqual(input.binding, resolveClawMonitorCleanupBinding(context.cronStorePath)) || listAgentEntries(context.getRuntimeConfig()).some((agent) => agent.id === input.agentId)) throw new Error("Claw package cleanup no longer owns the current removal state.");
		};
		captured = captureGatewayPluginRuntimeApplications(applyRuntime, assertCurrent);
		const applyOwnedRuntime = captured.applyRuntime;
		const { runtimeFailure, ...removed } = await withPluginLifecycleLease({
			signal,
			waitMs: 0
		}, async (lease) => {
			entered = true;
			const beforePersistentApply = () => {
				assertCurrent();
				lease.assertOwned();
			};
			beforePersistentApply();
			const record = await readClawPackageRemovalStatus(input.agentId, { signal });
			beforePersistentApply();
			if (!record) throw new Error("Claw package cleanup has no unique current owner.");
			if (digestClawRemovalInstall(record.orphaned ? void 0 : record.install) !== input.expectedInstallDigest) throw new Error("Claw package cleanup no longer owns the current removal state.");
			const decisions = await planClawPackageRemovals(record.install, record.packages, { referencedCleanup: input.cleanup });
			beforePersistentApply();
			if (digestClawPackageRemovalPlan(decisions, input.cleanup) !== input.expectedPackagePlanDigest) throw new Error("Claw package ownership changed after removal planning; preview removal again.");
			const projection = projectClawPackageRemovePlan({
				decisions,
				inspections: record.packages,
				cleanup: input.cleanup
			});
			if (projection.blockers.length > 0) throw new Error(projection.blockers.map((blocker) => blocker.message).join("; "));
			return await applyClawPackageRemovals(orderClawPackageRemovals(decisions), {
				applyRuntime: applyOwnedRuntime,
				deps: { claimPackageRef: claimClawPackageRefStatus },
				assertCurrent: beforePersistentApply
			});
		});
		assertCurrent();
		const { warnings: runtimeWarnings, ...currentApplication } = captured.application ?? {};
		let application = captured.application ? currentApplication : void 0;
		if (runtimeFailure) {
			const runtime = projectPluginRuntimeFailure(runtimeFailure, captured.application).runtime;
			application = runtime?.committed ? {
				operationId: runtime.operationId,
				generation: runtime.generation,
				pluginIds: runtime.pluginIds
			} : void 0;
		}
		const warnings = [.../* @__PURE__ */ new Set([...removed.warnings ?? [], ...runtimeWarnings ?? []])];
		respond(true, {
			...removed,
			...application ? { application } : {},
			...warnings.length ? { warnings } : {}
		}, void 0);
	} catch (error) {
		respond(false, void 0, pluginLifecycleError(error, {
			application: captured?.application,
			entered,
			signal
		}));
	} finally {
		releaseObservation?.();
	}
} };
//#endregion
export { clawsPackageHandlers };
