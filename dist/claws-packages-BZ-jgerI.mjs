import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { c as readAgentDeletionJournal } from "./agent-deletion-journal-CDljXcnp.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { o as projectPluginRuntimeFailure } from "./lifecycle-CGWepTug.mjs";
import { d as claimClawPackageRefStatus } from "./mcp-A-4-BIRV.mjs";
import { M as planClawPackageRemovals, a as orderClawPackageRemovals, j as applyClawPackageRemovals, n as digestClawRemovalInstall, o as projectClawPackageRemovePlan, s as readClawPackageRemovalStatus, t as digestClawPackageRemovalPlan } from "./package-remove-plan-BJkvcHDT.mjs";
import { t as resolveClawMonitorCleanupBinding } from "./monitor-cleanup-binding-C1Sjco9n.mjs";
import { t as clawPackageRemovalRequestSchema } from "./package-remove-contract-G3kEOOhf.mjs";
import { n as pluginLifecycleError, t as captureGatewayPluginRuntimeApplications } from "./plugins-lifecycle-error-BC2idhH1.mjs";
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
	try {
		const applyRuntime = context.applyPluginLifecycleChange;
		if (!applyRuntime) throw new Error("Claw plugin cleanup requires a running plugin lifecycle owner.");
		const assertCurrent = () => {
			signal?.throwIfAborted();
			sessionMutationCommitGuard?.();
			const journal = readAgentDeletionJournal(input.agentId);
			if (!isDeepStrictEqual(input.binding, resolveClawMonitorCleanupBinding(context.cronStorePath)) || journal?.operationId !== input.operationId || journal.cleanupCompleted || listAgentEntries(context.getRuntimeConfig()).some((agent) => agent.id === input.agentId)) throw new Error("Claw package cleanup no longer owns the current removal state.");
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
	}
} };
//#endregion
export { clawsPackageHandlers };
