import { t as normalizeHomeDirValue } from "./home-dir-AB7ik58U.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-CtsdYvX3.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-DAkjzBhe.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { a as loadExecApprovalsReadOnlyAsync } from "./exec-approvals-store-BhzM_h1C.mjs";
import { s as withSandboxRuntimeStatusInWorker } from "./runtime-status-DWm-5zUj.mjs";
import { n as resolveExecConfigState, s as resolvePreparedExecDefaultsAsync, t as prepareExecDefaults } from "./exec-defaults-DrIV-0KT.mjs";
import { i as prepareClawInstallSchemaVersions, n as captureClawInstallSchemaVersionFacts, s as withClawInstallSchemaVersionFacts } from "./provenance-runtime-read-CG_KY8mE.mjs";
import { a as collectClawToolPolicyCandidates } from "./tool-policy-runtime-CiUuNYdO.mjs";
import path from "node:path";
//#region src/agents/exec-defaults.preparation.ts
/** Keep classification and approval preparation inside the consuming construction's lifetime. */
async function withPreparedExecDefaults(params, shared, consume) {
	const { agentId } = resolveExecConfigState(params);
	const scope = {
		cfg: params.cfg,
		agentId,
		sessionKey: params.sessionKey
	};
	return await withSandboxRuntimeStatusInWorker(scope, shared, async (sandbox) => {
		const defaults = await resolvePreparedExecDefaultsAsync(prepareExecDefaults(params, sandbox), shared.loadExecApprovals);
		shared.assertCurrent();
		return await consume(defaults);
	});
}
//#endregion
//#region src/agents/tool-construction-preparation.ts
/** Retain construction inputs across reads; they never grant execution authority. */
function captureToolConstructionScope(config, options) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const cwd = path.resolve(options.cwd ?? process.cwd());
	for (const key of [
		"HOME",
		"USERPROFILE",
		"PREFIX"
	]) {
		const value = normalizeHomeDirValue(env[key]);
		if (value) env[key] = path.resolve(cwd, value);
	}
	const explicitHome = normalizeHomeDirValue(env.OPENCLAW_HOME);
	if (explicitHome && !/^~(?:[\\/]|$)/u.test(explicitHome)) env.OPENCLAW_HOME = path.resolve(cwd, explicitHome);
	env.OPENCLAW_HOME = resolveRequiredHomeDir(env);
	const stateDir = env.OPENCLAW_STATE_DIR?.trim();
	if (stateDir && !/^~(?:[\\/]|$)/u.test(stateDir)) env.OPENCLAW_STATE_DIR = path.resolve(cwd, stateDir);
	Object.assign(env, captureSessionTranscriptStorageEnvironment(env));
	const capturedConfig = config ? captureRuntimeConfig(config) : void 0;
	const statePath = path.resolve(cwd, resolveOpenClawStateSqlitePath(env));
	let assertStateCurrent;
	const assertCurrent = () => {
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		options.reader?.assertCurrent();
		assertStateCurrent?.();
	};
	assertCurrent();
	return {
		config: capturedConfig,
		env,
		cwd,
		statePath,
		admitStateRead: () => {
			assertCurrent();
			assertStateCurrent ??= captureOpenClawStateWorkerContext({
				path: statePath,
				env
			}).admission.assertCurrent;
			assertCurrent();
		},
		assertCurrent
	};
}
async function loadToolConstructionExecApprovals(scope) {
	const { statePath, env, assertCurrent } = scope;
	scope.admitStateRead();
	const file = await loadExecApprovalsReadOnlyAsync({
		path: statePath,
		env
	});
	assertCurrent();
	return file;
}
async function withPreparedToolConstruction(config, options, consume) {
	const scope = captureToolConstructionScope(config, options);
	const { config: capturedConfig, env, cwd, statePath, assertCurrent } = scope;
	const run = async () => {
		let active = true;
		const assertPreparedCurrent = () => {
			if (!active) throw new Error("Tool construction preparation has ended");
			assertCurrent();
		};
		try {
			assertPreparedCurrent();
			const result = await consume({
				config: capturedConfig,
				env,
				cwd,
				reader: options.reader,
				loadExecApprovals: async () => {
					assertPreparedCurrent();
					const approvals = await loadToolConstructionExecApprovals(scope);
					assertPreparedCurrent();
					return approvals;
				},
				assertCurrent: assertPreparedCurrent
			});
			assertPreparedCurrent();
			return result;
		} finally {
			active = false;
		}
	};
	if (!capturedConfig || collectClawToolPolicyCandidates(capturedConfig).length === 0) return await run();
	scope.admitStateRead();
	const provenance = await prepareClawInstallSchemaVersions({
		path: statePath,
		env,
		artifactPreservingReadOnly: false
	});
	assertCurrent();
	provenance.publish();
	assertCurrent();
	const provenanceFacts = captureClawInstallSchemaVersionFacts({
		path: statePath,
		env
	});
	return await withClawInstallSchemaVersionFacts(provenanceFacts, async () => {
		const { prepareCapturedClawToolPolicyConsent } = await import("./tool-policy-runtime-CV5LRrUt.mjs");
		assertCurrent();
		prepareCapturedClawToolPolicyConsent(capturedConfig, {
			path: statePath,
			env
		});
		return await run();
	});
}
//#endregion
export { withPreparedExecDefaults as n, withPreparedToolConstruction as t };
