import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { a as hashConfigRaw } from "./io.read-helpers-N26RjV2V.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { r as createManagedUpdateRequesterContinuationAuthority, t as UpdateRequesterRevokedError } from "./update-requester-authority-DOtkGjU8.mjs";
import { c as withOwnedManagedUpdateEnv, n as resolveOwnedManagedUpdateEnv, s as stripGatewayServiceMarkerEnv } from "./update-command-service-env-a79RyIGw.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { n as UpdatePreMutationError } from "./shared-Ca2ebFXK.mjs";
import { t as captureTargetDatabaseSchemaContext } from "./schema-preflight-IQHekWL6.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cli/update-cli/update-command-managed-context.ts
/** Inspection uses the same service selectors as finalization, without activating config/plugins. */
async function captureOwnedManagedUpdatePreflightContext(params) {
	const state = params.stopState;
	if (state?.serviceUpdateVerdict?.kind !== "owned" || !state.serviceEnv) return;
	return captureTargetDatabaseSchemaContext(stripGatewayServiceMarkerEnv(resolveOwnedManagedUpdateEnv({
		processEnv: params.processEnv,
		serviceEnv: state.serviceEnv,
		serviceDefinitionEnv: state.serviceDefinitionEnv,
		invocationCwd: params.invocationCwd
	})), { legacyConfigPlan: params.legacyConfigPlan });
}
async function revalidateUpdateDatabaseContext(expected) {
	const current = await captureTargetDatabaseSchemaContext(expected.readEnv, { legacyConfigPlan: expected.legacyConfigPlan });
	const before = expected.configSnapshot;
	const after = current.configSnapshot;
	if (before.path !== after.path || before.exists !== after.exists || before.raw !== after.raw || before.hash !== after.hash || !isDeepStrictEqual(before.includedPaths ?? [], after.includedPaths ?? []) || !isDeepStrictEqual(before.includeProvenance ?? [], after.includeProvenance ?? []) || !isDeepStrictEqual(before.sourceConfig, after.sourceConfig)) throw new UpdatePreMutationError("database-schema-preflight", `Update refused: configuration changed during database admission at ${before.path}. Retry against the current configuration.`);
	return current;
}
async function captureOwnedManagedUpdateContext(params) {
	const stopState = params.stopState;
	if (stopState?.inspected !== true || stopState.serviceUpdateVerdict?.kind !== "owned" || !stopState.serviceEnv) return;
	const env = stripGatewayServiceMarkerEnv(resolveOwnedManagedUpdateEnv({
		processEnv: params.processEnv,
		serviceEnv: stopState.serviceEnv,
		serviceDefinitionEnv: stopState.serviceDefinitionEnv,
		invocationCwd: params.invocationCwd
	}));
	stopState.serviceEnv = env;
	return await withOwnedManagedUpdateEnv(env, async () => {
		const configSnapshot = await readConfigFileSnapshot({
			observe: false,
			skipPluginValidation: true
		});
		const pluginInstallRecords = await loadInstalledPluginIndexInstallRecords({ env });
		return {
			env,
			configSnapshot,
			pluginInstallRecords
		};
	});
}
async function readUpdateCandidateSource(env, legacyConfigPlan) {
	if (legacyConfigPlan) {
		const context = await captureTargetDatabaseSchemaContext(env, { legacyConfigPlan });
		if (context.legacyConfigPlan) return {
			config: context.config,
			hash: hashConfigRaw(context.configSnapshot.raw)
		};
	}
	const snapshot = await withOwnedManagedUpdateEnv(env, () => readConfigFileSnapshot({
		skipPluginValidation: true,
		observe: false
	}));
	return {
		config: snapshot.config,
		hash: hashConfigRaw(snapshot.raw)
	};
}
/** Complete native admission before any execution guard can observe the pending requester. */
async function admitUpdateRequesterContinuation(run, executor, root, serviceRoot) {
	const original = run.requesterAuthority;
	const requester = original?.requester;
	if (!requester?.authorizationSource?.startsWith("profile:")) return;
	const runId = run.runId;
	const previousFence = run.executorFence;
	const fence = await executor.enter(root, {
		preflight: true,
		serviceRoot
	});
	const assertRunCurrent = () => {
		if (run.runId !== runId || run.requesterAuthority !== original || run.executorFence !== previousFence || previousFence && previousFence !== fence) throw new UpdateRequesterRevokedError();
		fence.assertCurrent();
	};
	assertRunCurrent();
	const continued = await createManagedUpdateRequesterContinuationAuthority(requester, {
		runId,
		executor: fence
	}, run.env);
	assertRunCurrent();
	run.requesterAuthority = continued;
	run.executorFence = fence;
}
//#endregion
export { revalidateUpdateDatabaseContext as a, readUpdateCandidateSource as i, captureOwnedManagedUpdateContext as n, captureOwnedManagedUpdatePreflightContext as r, admitUpdateRequesterContinuation as t };
