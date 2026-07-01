import { s as ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV } from "./config-env-vars-CQg5ubh6.js";
import { t as getGatewayRunRuntimeHooks } from "./runtime-hooks-Dp2OHV46.js";
import { t as enforceGatewayRunFutureConfigGuard } from "./future-config-guard-DtCdADlX.js";
//#region src/cli/gateway-cli/pre-bootstrap.ts
let selectedGatewayRunEnvironment;
let appliedGatewayRunConfigEnvironment;
let lastGuardedGatewayRunSnapshot;
let preparedGatewayRunBootstrapSnapshot;
let preparedGatewayRunReset;
let gatewayRunTargetSelectedByConfig = false;
async function pinGatewayRunRuntimePaths() {
	const [{ pinRuntimePaths }, { pinConfigDir }] = await Promise.all([import("./paths-DdBqmG_m.js"), import("./utils-B_688fa4.js")]);
	pinRuntimePaths(process.env);
	pinConfigDir(process.env);
}
const GATEWAY_CONFIG_SELECTION_ENV_KEYS = new Set([
	"ANDROID_DATA",
	"HOME",
	"HOMEDRIVE",
	"HOMEPATH",
	"OPENCLAW_AGENT_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_HOME",
	"OPENCLAW_INCLUDE_ROOTS",
	"OPENCLAW_NIX_MODE",
	"OPENCLAW_OAUTH_DIR",
	"OPENCLAW_PACKAGE_DIR",
	"OPENCLAW_PROFILE",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_TEST_FAST",
	"OPENCLAW_WORKSPACE_DIR",
	"PI_CODING_AGENT_DIR",
	"PREFIX",
	"USERPROFILE"
]);
const GATEWAY_RESET_SELECTION_ENV_KEYS = new Set([
	...GATEWAY_CONFIG_SELECTION_ENV_KEYS,
	"OPENCLAW_PROFILE",
	"OPENCLAW_WORKSPACE_DIR"
]);
function resolveGatewayConfigSelectionSignature(env) {
	return JSON.stringify([...GATEWAY_CONFIG_SELECTION_ENV_KEYS].map((key) => [key, env[key]]));
}
function snapshotGatewayConfigSelectionEnvironment(env) {
	return Object.fromEntries([...GATEWAY_CONFIG_SELECTION_ENV_KEYS].map((key) => [key, env[key]]));
}
function restoreGatewayConfigSelectionEnvironment(snapshot) {
	for (const key of GATEWAY_CONFIG_SELECTION_ENV_KEYS) {
		const value = snapshot[key];
		if (value === void 0) delete process.env[key];
		else process.env[key] = value;
	}
}
function resolveGatewayRunDotEnvPaths(params) {
	const stateEnvPath = params.join(params.resolveStateDir(params.env), ".env");
	const configEnvPath = params.join(params.resolveConfigDir(params.env), ".env");
	return params.resolve(stateEnvPath) === params.resolve(configEnvPath) ? { stateEnvPath } : {
		additionalEnvPaths: [configEnvPath],
		stateEnvPath
	};
}
function resolveInvocationDestructiveOverride() {
	if (process.env.OPENCLAW_SERVICE_MARKER?.trim()) {
		delete process.env[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
		return;
	}
	return process.env[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
}
function applyInvocationDestructiveOverride(value) {
	if (process.env.OPENCLAW_SERVICE_MARKER?.trim() || value === void 0) delete process.env[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
	else process.env[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV] = value;
}
function restoreGatewayEnvChanges(params) {
	const keys = new Set([...Object.keys(params.before), ...Object.keys(params.after)]);
	for (const key of keys) {
		const preservedKey = process.platform === "win32" ? key.toUpperCase() : key;
		if (params.preservedKeys?.has(preservedKey)) continue;
		if (params.before[key] === params.after[key] || process.env[key] !== params.after[key]) continue;
		const previous = params.before[key];
		if (previous === void 0) delete process.env[key];
		else process.env[key] = previous;
	}
}
function restoreSupersededGatewaySelectionEnv(params) {
	restoreGatewayEnvChanges({
		before: params.beforeCurrentPass,
		after: { ...process.env },
		preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS
	});
	if (params.environmentSelection) restoreGatewayEnvChanges({
		before: params.environmentSelection.before,
		after: params.environmentSelection.after,
		preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS
	});
}
function restoreAppliedGatewayRunConfigEnvironment(preserveSelection = true) {
	const applied = appliedGatewayRunConfigEnvironment;
	appliedGatewayRunConfigEnvironment = void 0;
	if (!applied) return;
	restoreGatewayEnvChanges({
		before: applied.before,
		after: applied.after,
		...preserveSelection ? { preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS } : {}
	});
}
async function readGuardedGatewayRunConfig(params) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot({
		isolateEnv: true,
		observe: false
	});
	return enforceGatewayRunFutureConfigGuard({
		opts: params.opts,
		runtime: params.runtime,
		snapshot
	}) ? snapshot : null;
}
async function isSameGatewayRunConfigSnapshot(expected, current, options = {}) {
	const { hashRuntimeConfigValue } = await import("./runtime-snapshot-CAkRKEK7.js");
	return (options.allowPathChange || current.path === expected.path) && current.exists === expected.exists && (current.hash ?? current.raw) === (expected.hash ?? expected.raw) && hashRuntimeConfigValue(current.sourceConfig) === hashRuntimeConfigValue(expected.sourceConfig);
}
function resolveGatewayConfigSelectionDeclarationSignature(entries) {
	const normalized = new Map(Object.entries(entries).map(([key, value]) => [key.toUpperCase(), value]));
	return JSON.stringify([...GATEWAY_CONFIG_SELECTION_ENV_KEYS].map((key) => [key, normalized.get(key)]));
}
async function recoverGuardedGatewayRunConfig(params) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	let recoveryAllowed = true;
	const recoveredSnapshot = await readConfigFileSnapshot({
		isolateEnv: true,
		recoverSuspicious: true,
		allowSuspiciousRecovery: (config, current) => {
			recoveryAllowed = enforceGatewayRunFutureConfigGuard({
				opts: params.opts,
				runtime: params.runtime,
				config: current
			});
			if (recoveryAllowed) recoveryAllowed = enforceGatewayRunFutureConfigGuard({
				opts: params.opts,
				runtime: params.runtime,
				config
			});
			return params.restoreSuspicious && recoveryAllowed;
		}
	});
	if (!recoveryAllowed) return null;
	return enforceGatewayRunFutureConfigGuard({
		opts: params.opts,
		runtime: params.runtime,
		snapshot: recoveredSnapshot
	}) ? recoveredSnapshot : null;
}
async function guardGatewayRunSelectedConfig(params) {
	lastGuardedGatewayRunSnapshot = void 0;
	const [path, { applyConfigEnvVars, isConfigRuntimeEnvVarAllowed }, { loadGlobalRuntimeDotEnvFiles }, { normalizeEnv }, { normalizeStateDirEnv, resolveStateDir }, { resolveConfigDir }] = await Promise.all([
		import("node:path"),
		import("./env-vars-CkUljfCi.js"),
		import("./dotenv-global-BMWCPx-A.js"),
		import("./env-CLpn5jHH.js"),
		import("./paths-DdBqmG_m.js"),
		import("./utils-B_688fa4.js")
	]);
	const invocationDestructiveOverride = resolveInvocationDestructiveOverride();
	if (params.environmentSelection) {
		restoreAppliedGatewayRunConfigEnvironment();
		restoreGatewayEnvChanges({
			before: params.environmentSelection.before,
			after: params.environmentSelection.after,
			preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS
		});
	}
	const applyTrustedGatewayEnv = () => {
		normalizeStateDirEnv(process.env);
		const loaded = loadGlobalRuntimeDotEnvFiles({
			...gatewayRunTargetSelectedByConfig ? { entryFilter: isConfigRuntimeEnvVarAllowed } : {},
			quiet: true,
			...resolveGatewayRunDotEnvPaths({
				env: process.env,
				join: path.join,
				resolve: path.resolve,
				resolveConfigDir,
				resolveStateDir
			})
		});
		normalizeStateDirEnv(process.env);
		normalizeEnv();
		applyInvocationDestructiveOverride(invocationDestructiveOverride);
		return loaded;
	};
	const applySelectedConfigEnv = (snapshot) => {
		restoreAppliedGatewayRunConfigEnvironment(params.opts.reset !== true);
		if (snapshot.valid && params.opts.reset !== true) {
			const envBeforeApply = { ...process.env };
			applyConfigEnvVars(snapshot.sourceConfig, process.env);
			normalizeStateDirEnv(process.env);
			normalizeEnv();
			appliedGatewayRunConfigEnvironment = {
				before: envBeforeApply,
				after: { ...process.env }
			};
		}
		applyInvocationDestructiveOverride(invocationDestructiveOverride);
	};
	for (;;) {
		const envBeforeTrustedApply = { ...process.env };
		const trustedSelectionSignature = resolveGatewayConfigSelectionSignature(process.env);
		const trustedEnvLoad = applyTrustedGatewayEnv();
		if (resolveGatewayConfigSelectionSignature(process.env) !== trustedSelectionSignature) {
			if (trustedEnvLoad.stateEnvAppliedKeys.some((key) => GATEWAY_CONFIG_SELECTION_ENV_KEYS.has(key.toUpperCase()))) {
				const fallbackSelectorKeys = new Set(trustedEnvLoad.gatewayEnvAppliedKeys.map((key) => key.toUpperCase()).filter((key) => GATEWAY_CONFIG_SELECTION_ENV_KEYS.has(key)));
				restoreGatewayEnvChanges({
					before: envBeforeTrustedApply,
					after: { ...process.env },
					preservedKeys: new Set([...GATEWAY_CONFIG_SELECTION_ENV_KEYS].filter((key) => !fallbackSelectorKeys.has(key)))
				});
			}
			restoreSupersededGatewaySelectionEnv({
				beforeCurrentPass: envBeforeTrustedApply,
				environmentSelection: params.environmentSelection
			});
			continue;
		}
		const snapshot = await readGuardedGatewayRunConfig(params);
		if (!snapshot) return false;
		if (!snapshot.valid) {
			if (params.opts.reset) lastGuardedGatewayRunSnapshot = snapshot;
			return params.opts.reset === true;
		}
		const selectionSignature = resolveGatewayConfigSelectionSignature(process.env);
		applySelectedConfigEnv(snapshot);
		if (resolveGatewayConfigSelectionSignature(process.env) !== selectionSignature) {
			gatewayRunTargetSelectedByConfig = true;
			restoreSupersededGatewaySelectionEnv({
				beforeCurrentPass: envBeforeTrustedApply,
				environmentSelection: params.environmentSelection
			});
			continue;
		}
		if (!params.recoverSuspicious) {
			lastGuardedGatewayRunSnapshot = snapshot;
			return true;
		}
		const recoveredSnapshot = await recoverGuardedGatewayRunConfig(params);
		if (!recoveredSnapshot) return false;
		if (recoveredSnapshot.path !== snapshot.path || recoveredSnapshot.hash !== snapshot.hash) {
			restoreSupersededGatewaySelectionEnv({
				beforeCurrentPass: envBeforeTrustedApply,
				environmentSelection: params.environmentSelection
			});
			continue;
		}
		const envBeforeRecoveredApply = { ...process.env };
		const recoveredSelectionSignature = resolveGatewayConfigSelectionSignature(process.env);
		applySelectedConfigEnv(recoveredSnapshot);
		if (resolveGatewayConfigSelectionSignature(process.env) === recoveredSelectionSignature) {
			lastGuardedGatewayRunSnapshot = recoveredSnapshot;
			return true;
		}
		restoreSupersededGatewaySelectionEnv({
			beforeCurrentPass: envBeforeRecoveredApply,
			environmentSelection: params.environmentSelection
		});
		gatewayRunTargetSelectedByConfig = true;
	}
}
async function guardGatewayRunReset(params) {
	gatewayRunTargetSelectedByConfig = false;
	const envBeforeGuard = { ...process.env };
	try {
		return await guardGatewayRunSelectedConfig({
			...params,
			recoverSuspicious: true,
			restoreSuspicious: false
		});
	} finally {
		restoreAppliedGatewayRunConfigEnvironment(false);
		restoreGatewayEnvChanges({
			before: envBeforeGuard,
			after: { ...process.env },
			preservedKeys: GATEWAY_RESET_SELECTION_ENV_KEYS
		});
	}
}
async function recheckGatewayRunReset(params) {
	const expected = preparedGatewayRunReset;
	preparedGatewayRunReset = void 0;
	const rejectDrift = async () => {
		if (expected) {
			restoreGatewayConfigSelectionEnvironment(expected.selectionEnvironment);
			await pinGatewayRunRuntimePaths();
		}
		params.runtime.error("Refusing to reset the dev gateway state because the selected config or state target changed during startup. Retry the reset so the new target can be validated.");
		params.runtime.exit(1);
		return false;
	};
	if (!expected || resolveGatewayConfigSelectionSignature(process.env) !== expected.selectionSignature) return await rejectDrift();
	if (!await guardGatewayRunReset(params)) return false;
	const current = lastGuardedGatewayRunSnapshot;
	if (resolveGatewayConfigSelectionSignature(process.env) !== expected.selectionSignature || !current || !await isSameGatewayRunConfigSnapshot(expected.snapshot, current)) return await rejectDrift();
	return true;
}
async function applyFinalGatewayRunConfigEnv(params) {
	const preparedSnapshot = preparedGatewayRunBootstrapSnapshot;
	preparedGatewayRunBootstrapSnapshot = void 0;
	if (!params.snapshot.valid) {
		restoreAppliedGatewayRunConfigEnvironment(false);
		if (preparedSnapshot) {
			params.runtime.error("Refusing to start the gateway because the final config read became invalid. Retry startup after fixing the config.");
			params.runtime.exit(1);
			return false;
		}
		await pinGatewayRunRuntimePaths();
		return true;
	}
	const invocationDestructiveOverride = resolveInvocationDestructiveOverride();
	const envBeforeApply = { ...process.env };
	const selectionSignature = resolveGatewayConfigSelectionSignature(process.env);
	const [{ applyConfigEnvVars, collectConfigRuntimeEnvVars }, { normalizeEnv }, { normalizeStateDirEnv }, { clearShellEnvAppliedKeys }] = await Promise.all([
		import("./env-vars-CkUljfCi.js"),
		import("./env-CLpn5jHH.js"),
		import("./paths-DdBqmG_m.js"),
		import("./shell-env-KSeZ3xMX.js")
	]);
	const finalConfigEnv = collectConfigRuntimeEnvVars(params.snapshot.sourceConfig);
	if (preparedSnapshot && resolveGatewayConfigSelectionDeclarationSignature(collectConfigRuntimeEnvVars(preparedSnapshot.sourceConfig)) !== resolveGatewayConfigSelectionDeclarationSignature(finalConfigEnv)) {
		params.runtime.error("Refusing to start the gateway because the final config read changed config or state selection. Retry startup so the selected target can be validated.");
		params.runtime.exit(1);
		return false;
	}
	restoreAppliedGatewayRunConfigEnvironment();
	applyConfigEnvVars(params.snapshot.sourceConfig, process.env, {
		lowerPrecedenceEnv: params.lowerPrecedenceEnv,
		onLowerPrecedenceKeysReplaced: clearShellEnvAppliedKeys
	});
	normalizeStateDirEnv(process.env);
	normalizeEnv();
	applyInvocationDestructiveOverride(invocationDestructiveOverride);
	appliedGatewayRunConfigEnvironment = {
		before: envBeforeApply,
		after: { ...process.env }
	};
	if (resolveGatewayConfigSelectionSignature(process.env) === selectionSignature) return true;
	appliedGatewayRunConfigEnvironment = void 0;
	restoreGatewayEnvChanges({
		before: envBeforeApply,
		after: { ...process.env }
	});
	params.runtime.error("Refusing to start the gateway because the final config read changed config or state selection. Retry startup so the selected target can be validated.");
	params.runtime.exit(1);
	return false;
}
function clearGatewayRunConfigEnvironment() {
	restoreAppliedGatewayRunConfigEnvironment();
}
async function reloadTrustedGatewayRunEnvironment(params) {
	const [path, { isConfigRuntimeEnvVarAllowed }, { loadGlobalRuntimeDotEnvFiles }, { normalizeEnv }, { normalizeStateDirEnv, resolveStateDir }, { resolveConfigDir }] = await Promise.all([
		import("node:path"),
		import("./env-vars-CkUljfCi.js"),
		import("./dotenv-global-BMWCPx-A.js"),
		import("./env-CLpn5jHH.js"),
		import("./paths-DdBqmG_m.js"),
		import("./utils-B_688fa4.js")
	]);
	const envBeforeReload = { ...process.env };
	const selectionSignature = resolveGatewayConfigSelectionSignature(process.env);
	const invocationDestructiveOverride = resolveInvocationDestructiveOverride();
	normalizeStateDirEnv(process.env);
	loadGlobalRuntimeDotEnvFiles({
		...gatewayRunTargetSelectedByConfig ? { entryFilter: isConfigRuntimeEnvVarAllowed } : {},
		quiet: true,
		...resolveGatewayRunDotEnvPaths({
			env: process.env,
			join: path.join,
			resolve: path.resolve,
			resolveConfigDir,
			resolveStateDir
		})
	});
	normalizeStateDirEnv(process.env);
	normalizeEnv();
	applyInvocationDestructiveOverride(invocationDestructiveOverride);
	if (resolveGatewayConfigSelectionSignature(process.env) !== selectionSignature) {
		restoreGatewayEnvChanges({
			before: envBeforeReload,
			after: { ...process.env }
		});
		applyInvocationDestructiveOverride(invocationDestructiveOverride);
		await pinGatewayRunRuntimePaths();
		params.runtime.error("Refusing to start the gateway because trusted dotenv reload after startup mutations changed config or state selection. Retry startup so the selected target can be validated.");
		params.runtime.exit(1);
		return false;
	}
	await pinGatewayRunRuntimePaths();
	return true;
}
async function selectGatewayRunEnvironment(params) {
	gatewayRunTargetSelectedByConfig = false;
	preparedGatewayRunBootstrapSnapshot = void 0;
	preparedGatewayRunReset = void 0;
	restoreAppliedGatewayRunConfigEnvironment(params.opts.reset !== true);
	const envBeforeGuard = { ...process.env };
	selectedGatewayRunEnvironment = void 0;
	let guarded;
	try {
		guarded = await guardGatewayRunSelectedConfig({
			...params,
			recoverSuspicious: false,
			restoreSuspicious: false
		});
	} finally {
		if (params.opts.reset) {
			restoreAppliedGatewayRunConfigEnvironment(false);
			restoreGatewayEnvChanges({
				before: envBeforeGuard,
				after: { ...process.env },
				preservedKeys: GATEWAY_RESET_SELECTION_ENV_KEYS
			});
		}
	}
	selectedGatewayRunEnvironment = {
		before: envBeforeGuard,
		after: { ...process.env }
	};
	await pinGatewayRunRuntimePaths();
	return guarded;
}
async function prepareGatewayRunBootstrap(params) {
	preparedGatewayRunReset = void 0;
	await getGatewayRunRuntimeHooks().releaseManagedProxy?.();
	const environmentSelection = selectedGatewayRunEnvironment;
	selectedGatewayRunEnvironment = void 0;
	if (!environmentSelection) gatewayRunTargetSelectedByConfig = false;
	const guarded = params.opts.reset ? await guardGatewayRunReset(params) : await guardGatewayRunSelectedConfig({
		...params,
		environmentSelection,
		recoverSuspicious: true,
		restoreSuspicious: true
	});
	await pinGatewayRunRuntimePaths();
	const shouldBootstrap = guarded && !params.opts.reset;
	preparedGatewayRunBootstrapSnapshot = shouldBootstrap ? lastGuardedGatewayRunSnapshot : void 0;
	if (guarded && params.opts.reset && lastGuardedGatewayRunSnapshot) preparedGatewayRunReset = {
		selectionEnvironment: snapshotGatewayConfigSelectionEnvironment(process.env),
		selectionSignature: resolveGatewayConfigSelectionSignature(process.env),
		snapshot: lastGuardedGatewayRunSnapshot
	};
	return shouldBootstrap;
}
async function recheckGatewayRunBootstrap(params) {
	const expected = preparedGatewayRunBootstrapSnapshot;
	if (!expected) {
		params.runtime.error("Refusing to run automatic gateway startup migrations without a prepared config snapshot. Retry startup.");
		params.runtime.exit(1);
		return false;
	}
	const current = params.snapshot ? enforceGatewayRunFutureConfigGuard({
		opts: params.opts,
		runtime: params.runtime,
		snapshot: params.snapshot
	}) ? params.snapshot : null : await readGuardedGatewayRunConfig(params);
	if (!current) return false;
	if (await isSameGatewayRunConfigSnapshot(expected, current, { allowPathChange: params.snapshot !== void 0 })) return true;
	params.runtime.error("Refusing to run automatic gateway startup migrations because the selected config changed during startup. Retry startup so the new config can be validated.");
	params.runtime.exit(1);
	return false;
}
//#endregion
export { applyFinalGatewayRunConfigEnv, clearGatewayRunConfigEnvironment, guardGatewayRunReset, prepareGatewayRunBootstrap, recheckGatewayRunBootstrap, recheckGatewayRunReset, reloadTrustedGatewayRunEnvironment, selectGatewayRunEnvironment };
