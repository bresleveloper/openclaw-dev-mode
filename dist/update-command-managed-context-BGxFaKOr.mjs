import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { i as hashConfigRaw } from "./io.read-helpers-Bvdjf9tk.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { r as createManagedUpdateRequesterContinuationAuthority, t as UpdateRequesterRevokedError } from "./update-requester-authority-CbCLnyCx.mjs";
import "./installed-plugin-index-records-VCj98mZ6.mjs";
import { c as stripGatewayServiceMarkerEnv, l as withOwnedManagedUpdateEnv, n as resolveOwnedManagedUpdateEnv } from "./update-command-service-env-lR0aWgPL.mjs";
import { a as isCandidateAdmissionContextCovered, t as captureTargetDatabaseSchemaContext } from "./schema-preflight-Qw67fuB1.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cli/update-cli/update-command-managed-context.ts
/** Resolve the service's selectors without reading or validating its configuration. */
function resolveOwnedManagedUpdatePreflightEnv(params) {
	const state = params.stopState;
	if (state?.serviceUpdateVerdict?.kind !== "owned" || !state.serviceEnv) return;
	return stripGatewayServiceMarkerEnv(resolveOwnedManagedUpdateEnv({
		processEnv: params.processEnv,
		serviceEnv: state.serviceEnv,
		serviceDefinitionEnv: state.serviceDefinitionEnv,
		invocationCwd: params.invocationCwd
	}));
}
/** Inspection uses the same service selectors as finalization, without activating config/plugins. */
async function captureOwnedManagedUpdatePreflightContext(params) {
	const env = resolveOwnedManagedUpdatePreflightEnv(params);
	return env ? captureTargetDatabaseSchemaContext(env, params) : void 0;
}
async function revalidateUpdateDatabaseContext(expected) {
	const current = await captureTargetDatabaseSchemaContext(expected.readEnv, {
		legacyConfigPlan: expected.legacyConfigPlan,
		configValidation: expected.configValidation
	});
	const before = expected.configSnapshot;
	const after = current.configSnapshot;
	if (before.path !== after.path || before.exists !== after.exists || before.raw !== after.raw || before.hash !== after.hash || !isDeepStrictEqual(before.includedPaths ?? [], after.includedPaths ?? []) || !isDeepStrictEqual(before.includeProvenance ?? [], after.includeProvenance ?? []) || !isDeepStrictEqual(before.sourceConfig, after.sourceConfig)) defaultRuntime.error(`Warning: Configuration changed during database admission at ${before.path}; continuing with the current configuration.`);
	return current;
}
async function captureOwnedManagedUpdateContext(params) {
	const stopState = params.stopState;
	if (stopState?.inspected !== true) return;
	const env = resolveOwnedManagedUpdatePreflightEnv(params);
	if (!env) return;
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
async function readUpdateCandidateSource(env, legacyConfigPlan, options) {
	if (legacyConfigPlan) {
		const context = await captureTargetDatabaseSchemaContext(env, {
			legacyConfigPlan,
			...options
		});
		if (context.legacyConfigPlan) return {
			config: context.config,
			hash: hashConfigRaw(context.configSnapshot.raw),
			source: candidateConfigSource(context.configSnapshot)
		};
	}
	const snapshot = await withOwnedManagedUpdateEnv(env, () => readConfigFileSnapshot({
		skipPluginValidation: true,
		observe: false
	}));
	return {
		config: options?.configValidation === "candidate" && isCandidateAdmissionContextCovered(env) ? snapshot.sourceConfig : snapshot.config,
		hash: hashConfigRaw(snapshot.raw),
		source: candidateConfigSource(snapshot)
	};
}
function candidateConfigSource(snapshot) {
	return {
		path: snapshot.path,
		exists: snapshot.exists,
		raw: snapshot.raw,
		hash: snapshot.hash,
		includedPaths: snapshot.includedPaths ?? [],
		includeProvenance: snapshot.includeProvenance ?? [],
		sourceConfig: snapshot.sourceConfig
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
export { resolveOwnedManagedUpdatePreflightEnv as a, readUpdateCandidateSource as i, captureOwnedManagedUpdateContext as n, revalidateUpdateDatabaseContext as o, captureOwnedManagedUpdatePreflightContext as r, admitUpdateRequesterContinuation as t };
