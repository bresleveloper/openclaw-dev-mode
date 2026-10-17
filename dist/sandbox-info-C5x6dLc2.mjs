import { t as normalizeHomeDirValue } from "./home-dir-D0b-ywue.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-Dc6nN6HB.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-rvQFgz1Z.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { a as prepareClawInstallSchemaVersions, c as withClawInstallSchemaVersionFacts, n as captureClawInstallSchemaVersionFacts } from "./provenance-runtime-read-DLNIVZio.mjs";
import { a as loadExecApprovalsReadOnlyAsync } from "./exec-approvals-store-DGp2moY9.mjs";
import { a as collectClawToolPolicyCandidates } from "./tool-policy-runtime--SOb7O-O.mjs";
import { i as withSandboxRuntimeStatusInWorker } from "./runtime-status-m46YZG5q.mjs";
import { a as resolvePreparedExecDefaultsAsync, n as resolveExecConfigState, t as prepareExecDefaults } from "./exec-defaults-tLsLm83r.mjs";
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
		const { prepareCapturedClawToolPolicyConsent } = await import("./tool-policy-runtime-CCQXhk4Q.mjs");
		assertCurrent();
		prepareCapturedClawToolPolicyConsent(capturedConfig, {
			path: statePath,
			env
		});
		return await run();
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/sandbox-info.ts
/** Computes whether elevated exec can provide full host access for an embedded turn. */
function resolveEmbeddedFullAccessState(params) {
	if (params.execPolicy?.mode !== void 0 && params.execPolicy.mode !== "full" || params.execPolicy?.security !== void 0 && params.execPolicy.security !== "full" || params.execPolicy?.ask === "always" || params.hostPolicy?.security !== void 0 && params.hostPolicy.security !== "full" || params.hostPolicy?.ask === "always") return {
		available: false,
		blockedReason: "host-policy"
	};
	if (params.execElevated?.fullAccessAvailable === true) return { available: true };
	if (params.execElevated?.fullAccessAvailable === false) return {
		available: false,
		blockedReason: params.execElevated.fullAccessBlockedReason ?? "host-policy"
	};
	if (!params.execElevated?.enabled || !params.execElevated.allowed) return {
		available: false,
		blockedReason: "host-policy"
	};
	return { available: true };
}
async function resolveEmbeddedSandboxInfoExecPolicy(params, source) {
	return withPreparedToolConstruction(params.config, source, async (shared) => withPreparedExecDefaults({
		cfg: shared.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.permissionMode ? { permissionMode: params.permissionMode } : void 0,
		sandboxAvailable: params.sandboxAvailable,
		elevatedRequested: true,
		execOverrides: params.execOverrides
	}, shared, async (defaults) => ({
		mode: defaults.mode,
		security: defaults.security,
		ask: defaults.ask
	})));
}
function buildEmbeddedSandboxInfo(sandbox, execElevated, execPolicy, hostPolicy) {
	if (!sandbox?.enabled) return;
	const elevatedConfigured = execElevated?.enabled === true;
	const elevatedAllowed = !sandbox.required && Boolean(execElevated?.enabled && execElevated.allowed);
	const fullAccess = sandbox.required ? {
		available: false,
		blockedReason: "host-policy"
	} : resolveEmbeddedFullAccessState({
		execElevated,
		execPolicy,
		hostPolicy
	});
	return {
		enabled: true,
		workspaceDir: sandbox.workspaceDir,
		containerWorkspaceDir: sandbox.containerWorkdir,
		workspaceAccess: sandbox.workspaceAccess,
		agentWorkspaceMount: sandbox.workspaceAccess === "ro" ? "/agent" : void 0,
		browserBridgeUrl: sandbox.browser?.bridgeUrl,
		hostBrowserAllowed: sandbox.browserAllowHostControl,
		...elevatedConfigured ? { elevated: {
			allowed: elevatedAllowed,
			defaultLevel: sandbox.required ? "off" : execElevated?.defaultLevel ?? "off",
			fullAccessAvailable: fullAccess.available,
			...fullAccess.blockedReason ? { fullAccessBlockedReason: fullAccess.blockedReason } : {}
		} } : {}
	};
}
//#endregion
export { resolveEmbeddedFullAccessState as n, resolveEmbeddedSandboxInfoExecPolicy as r, buildEmbeddedSandboxInfo as t };
