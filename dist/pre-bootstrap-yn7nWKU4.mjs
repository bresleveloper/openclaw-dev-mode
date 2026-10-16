import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { n as fsSafeEnvInput, r as normalizeFsSafeNativeEnv, t as clearFsSafeEnvFallback } from "./fs-safe-env-CCe2lU-3.mjs";
import { t as ExitError } from "./runtime-DlO3PTAd.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { _ as ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV, a as createConfigRuntimeEnv, d as resetPublishedConfigRuntimeEnv, r as cloneEnvWithPlatformSemantics, v as formatFutureConfigActionBlock, y as resolveFutureConfigActionBlock } from "./config-env-vars-DjPHKieF.mjs";
import { o as withArtifactPreservingStateReads } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as CONFIG_AUDIT_STORE_LABEL } from "./io.audit-BXzMurur.mjs";
import { t as GATEWAY_CONFIG_SELECTION_ENV_KEYS } from "./gateway-env-selection-B-LO0cRL.mjs";
import { t as getGatewayRunRuntimeHooks } from "./runtime-hooks-Dp2OHV46.mjs";
import { t as describeConfigSnapshotInputChange } from "./snapshot-inputs-BFAy-z4j.mjs";
//#region src/cli/gateway-cli/future-config-guard.ts
function resolveGatewayRunFutureConfigBlock(params) {
	const processServiceMode = Boolean(process.env.OPENCLAW_SERVICE_MARKER?.trim());
	const candidateConfig = params.config ?? (params.snapshot?.valid ? params.snapshot.sourceConfig ?? params.snapshot.config : void 0);
	const candidateServiceMode = !params.opts.reset && Boolean(candidateConfig ? createConfigRuntimeEnv(candidateConfig, process.env).OPENCLAW_SERVICE_MARKER?.trim() : void 0);
	const serviceMode = processServiceMode || candidateServiceMode;
	const futureAction = params.opts.reset ? {
		action: "reset the dev gateway state",
		exitCode: 1
	} : serviceMode ? {
		action: "start the gateway service",
		exitCode: 78
	} : params.opts.force ? {
		action: "force-kill gateway port listeners",
		exitCode: 1
	} : {
		action: "run gateway state preparation",
		exitCode: 1
	};
	const guardEnv = serviceMode ? cloneEnvWithPlatformSemantics(process.env) : process.env;
	if (serviceMode) delete guardEnv[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
	const block = resolveFutureConfigActionBlock({
		action: futureAction.action,
		snapshot: params.snapshot,
		config: params.config,
		env: guardEnv
	});
	return block ? {
		block,
		exitCode: futureAction.exitCode,
		serviceMode
	} : null;
}
function enforceGatewayRunFutureConfigGuard(params) {
	const resolved = resolveGatewayRunFutureConfigBlock(params);
	if (!resolved) return true;
	if (resolved.serviceMode) delete process.env[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
	params.runtime.error(formatFutureConfigActionBlock(resolved.block));
	params.runtime.exit(resolved.exitCode);
	return false;
}
//#endregion
//#region src/cli/gateway-cli/pre-bootstrap.ts
let selectedGatewayRunEnvironment;
let appliedGatewayRunConfigEnvironment;
let lastGuardedGatewayRunSnapshot;
let preparedGatewayRunBootstrap;
let preparedGatewayRunReset;
let gatewayRunTargetSelectedByConfig = false;
function getGatewayStartGuardErrors(params) {
	if ((params.allowUnconfigured ?? preparedGatewayRunBootstrap?.allowUnconfigured) || params.mode === "local" || !params.configExists && preparedGatewayRunBootstrap?.dev) return [];
	if (!params.configExists) return [`Missing config. Run \`${formatCliCommand("openclaw setup")}\` or set gateway.mode=local (or pass --allow-unconfigured).`];
	return [params.mode === void 0 ? [
		"Gateway start blocked: existing config is missing gateway.mode.",
		"Treat this as suspicious or clobbered config.",
		`Re-run \`${formatCliCommand("openclaw onboard --mode local")}\` or \`${formatCliCommand("openclaw setup")}\`, set gateway.mode=local manually, or pass --allow-unconfigured.`
	].join(" ") : `Gateway start blocked: set gateway.mode=local (current: ${params.mode}) or pass --allow-unconfigured.`, `Config write audit: ${CONFIG_AUDIT_STORE_LABEL}`];
}
async function pinGatewayRunRuntimePaths() {
	const [{ pinRuntimePaths }, { pinConfigDir }] = await Promise.all([import("./paths-CEShgFTd.mjs"), import("./utils-CZEHCb0v.mjs")]);
	pinRuntimePaths(process.env);
	pinConfigDir(process.env);
}
const GATEWAY_RESET_SELECTION_ENV_KEYS = /* @__PURE__ */ new Set([
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
	clearFsSafeEnvFallback(process.env);
	const keys = /* @__PURE__ */ new Set([...Object.keys(params.before), ...Object.keys(params.after)]);
	for (const key of keys) {
		const preservedKey = process.platform === "win32" ? key.toUpperCase() : key;
		if (params.preservedKeys?.has(preservedKey)) continue;
		if (params.before[key] === params.after[key] || process.env[key] !== params.after[key]) continue;
		const previous = params.before[key];
		if (previous === void 0) delete process.env[key];
		else process.env[key] = previous;
	}
	normalizeFsSafeNativeEnv(process.env);
}
function restoreSupersededGatewaySelectionEnv(params) {
	restoreGatewayEnvChanges({
		before: params.beforeCurrentPass,
		after: { ...fsSafeEnvInput(process.env) },
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
	const { createConfigIO } = await import("./io.factory-CGMKPjNX.mjs");
	return await withArtifactPreservingStateReads(async () => {
		const current = await readConfigFileSnapshot({
			isolateEnv: true,
			observe: false,
			pluginValidation: "core-only"
		});
		const guard = (snapshot) => enforceGatewayRunFutureConfigGuard({
			...params,
			snapshot
		});
		if (!guard(current)) return null;
		const recovery = await createConfigIO({
			configPath: current.path,
			env: cloneEnvWithPlatformSemantics(process.env),
			observe: false,
			pluginValidation: "core-only"
		}).prepareConfigRecovery(current);
		return recovery ? guard(recovery.snapshot) ? recovery.snapshot : null : current;
	});
}
function describeGatewayRunConfigChange(expected, current, options = {}) {
	return current.valid !== expected.valid ? "config validity changed" : describeConfigSnapshotInputChange(expected, current, {
		...options,
		compareResolvedConfig: current.valid
	});
}
function resolveGatewayConfigSelectionDeclarationSignature(entries) {
	const normalized = new Map(Object.entries(entries).map(([key, value]) => [key.toUpperCase(), value]));
	return JSON.stringify([...GATEWAY_CONFIG_SELECTION_ENV_KEYS].map((key) => [key, normalized.get(key)]));
}
async function guardGatewayRunSelectedConfig(params) {
	lastGuardedGatewayRunSnapshot = void 0;
	const [applyTrustedGatewayEnv, { applyConfigEnvVars }, { normalizeEnv }, { normalizeStateDirEnv }, { collectEnvSecretRefIds }, { clearMissingManagedServiceEnvKeys, readManagedSystemdServiceEnvKeysFromEnvironment }] = await Promise.all([
		createTrustedGatewayEnvLoader(),
		import("./config-env-vars-BJbL6eL7.mjs"),
		import("./env-Cdavhzzg.mjs"),
		import("./paths-CEShgFTd.mjs"),
		import("./resolution-facts-CEwQo43-.mjs"),
		import("./service-managed-env-CU_bATp_.mjs")
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
	const applySelectedConfigEnv = (snapshot) => {
		restoreAppliedGatewayRunConfigEnvironment(params.opts.reset !== true);
		if (snapshot.valid && params.opts.reset !== true) {
			const envBeforeApply = { ...fsSafeEnvInput(process.env) };
			applyConfigEnvVars(snapshot.sourceConfig, process.env);
			normalizeStateDirEnv(process.env);
			normalizeEnv();
			appliedGatewayRunConfigEnvironment = {
				before: envBeforeApply,
				after: { ...fsSafeEnvInput(process.env) }
			};
		}
		applyInvocationDestructiveOverride(invocationDestructiveOverride);
	};
	for (;;) {
		const envBeforeTrustedApply = { ...fsSafeEnvInput(process.env) };
		const trustedSelectionSignature = resolveGatewayConfigSelectionSignature(process.env);
		const trustedEnvLoad = applyTrustedGatewayEnv(invocationDestructiveOverride);
		if (resolveGatewayConfigSelectionSignature(process.env) !== trustedSelectionSignature) {
			if (trustedEnvLoad.stateEnvAppliedKeys.some((key) => GATEWAY_CONFIG_SELECTION_ENV_KEYS.has(key.toUpperCase()))) {
				const fallbackSelectorKeys = new Set(trustedEnvLoad.gatewayEnvAppliedKeys.map((key) => key.toUpperCase()).filter((key) => GATEWAY_CONFIG_SELECTION_ENV_KEYS.has(key)));
				restoreGatewayEnvChanges({
					before: envBeforeTrustedApply,
					after: { ...fsSafeEnvInput(process.env) },
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
			lastGuardedGatewayRunSnapshot = snapshot;
			return true;
		}
		clearMissingManagedServiceEnvKeys({
			environment: process.env,
			managedKeys: readManagedSystemdServiceEnvKeysFromEnvironment(process.env),
			presentKeys: trustedEnvLoad.dotenvPresentKeys,
			preserveKeys: collectEnvSecretRefIds(snapshot.sourceConfig)
		});
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
		lastGuardedGatewayRunSnapshot = snapshot;
		return true;
	}
}
async function guardGatewayRunReset(params) {
	gatewayRunTargetSelectedByConfig = false;
	const envBeforeGuard = { ...fsSafeEnvInput(process.env) };
	try {
		return await guardGatewayRunSelectedConfig(params);
	} finally {
		restoreAppliedGatewayRunConfigEnvironment(false);
		restoreGatewayEnvChanges({
			before: envBeforeGuard,
			after: { ...fsSafeEnvInput(process.env) },
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
	if (resolveGatewayConfigSelectionSignature(process.env) !== expected.selectionSignature || !current || describeGatewayRunConfigChange(expected.snapshot, current)) return await rejectDrift();
	return true;
}
async function applyFinalGatewayRunConfigEnv(params) {
	const preparedSnapshot = preparedGatewayRunBootstrap?.snapshot;
	preparedGatewayRunBootstrap = void 0;
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
	const envBeforeApply = { ...fsSafeEnvInput(process.env) };
	const selectionSignature = resolveGatewayConfigSelectionSignature(process.env);
	const [{ applyConfigEnvVars, collectConfigRuntimeEnvOwnership, collectConfigRuntimeEnvVars, initializePublishedConfigRuntimeEnv }, { normalizeEnv }, { normalizeStateDirEnv }, { clearShellEnvAppliedKeys }] = await Promise.all([
		import("./config-env-vars-BJbL6eL7.mjs"),
		import("./env-Cdavhzzg.mjs"),
		import("./paths-CEShgFTd.mjs"),
		import("./shell-env-CIeama6G.mjs")
	]);
	const finalConfigEnv = collectConfigRuntimeEnvVars(params.snapshot.sourceConfig);
	if (preparedSnapshot && resolveGatewayConfigSelectionDeclarationSignature(collectConfigRuntimeEnvVars(preparedSnapshot.sourceConfig)) !== resolveGatewayConfigSelectionDeclarationSignature(finalConfigEnv)) {
		params.runtime.error("Refusing to start the gateway because the final config read changed config or state selection. Retry startup so the selected target can be validated.");
		params.runtime.exit(1);
		return false;
	}
	restoreAppliedGatewayRunConfigEnvironment();
	const envBeforeConfigApply = { ...fsSafeEnvInput(process.env) };
	const replacedLowerPrecedenceKeys = [];
	applyConfigEnvVars(params.snapshot.sourceConfig, process.env, {
		lowerPrecedenceEnv: params.lowerPrecedenceEnv,
		onLowerPrecedenceKeysReplaced: (keys) => {
			replacedLowerPrecedenceKeys.push(...keys);
			clearShellEnvAppliedKeys(keys);
		}
	});
	normalizeStateDirEnv(process.env);
	normalizeEnv();
	applyInvocationDestructiveOverride(invocationDestructiveOverride);
	appliedGatewayRunConfigEnvironment = {
		before: envBeforeApply,
		after: { ...fsSafeEnvInput(process.env) }
	};
	if (resolveGatewayConfigSelectionSignature(process.env) === selectionSignature) {
		initializePublishedConfigRuntimeEnv(params.snapshot.sourceConfig, { ownedEnv: collectConfigRuntimeEnvOwnership(params.snapshot.sourceConfig, envBeforeConfigApply, process.env, { replacedLowerPrecedenceKeys }) });
		return true;
	}
	appliedGatewayRunConfigEnvironment = void 0;
	restoreGatewayEnvChanges({
		before: envBeforeApply,
		after: { ...fsSafeEnvInput(process.env) }
	});
	params.runtime.error("Refusing to start the gateway because the final config read changed config or state selection. Retry startup so the selected target can be validated.");
	params.runtime.exit(1);
	return false;
}
function clearGatewayRunConfigEnvironment() {
	restoreAppliedGatewayRunConfigEnvironment();
	resetPublishedConfigRuntimeEnv();
}
async function createTrustedGatewayEnvLoader() {
	const [path, { isConfigRuntimeEnvVarAllowed }, { loadGlobalRuntimeDotEnvFiles }, { normalizeEnv }, { normalizeStateDirEnv, resolveStateDir }, { resolveConfigDir }, { readManagedSystemdServiceEnvKeysFromEnvironment }] = await Promise.all([
		import("node:path"),
		import("./config-env-vars-BJbL6eL7.mjs"),
		import("./dotenv-global-BWuwz4qB.mjs"),
		import("./env-Cdavhzzg.mjs"),
		import("./paths-CEShgFTd.mjs"),
		import("./utils-CZEHCb0v.mjs"),
		import("./service-managed-env-CU_bATp_.mjs")
	]);
	return (invocationDestructiveOverride) => {
		normalizeStateDirEnv(process.env);
		const stateEnvPath = path.join(resolveStateDir(process.env), ".env");
		const configEnvPath = path.join(resolveConfigDir(process.env), ".env");
		const loaded = loadGlobalRuntimeDotEnvFiles({
			...gatewayRunTargetSelectedByConfig ? { entryFilter: isConfigRuntimeEnvVarAllowed } : {},
			overrideKeys: readManagedSystemdServiceEnvKeysFromEnvironment(process.env),
			quiet: true,
			stateEnvPath,
			...path.resolve(stateEnvPath) === path.resolve(configEnvPath) ? {} : { additionalEnvPaths: [configEnvPath] }
		});
		normalizeStateDirEnv(process.env);
		normalizeEnv();
		applyInvocationDestructiveOverride(invocationDestructiveOverride);
		return loaded;
	};
}
async function reloadTrustedGatewayRunEnvironment(params) {
	const applyTrustedGatewayEnv = await createTrustedGatewayEnvLoader();
	const envBeforeReload = { ...fsSafeEnvInput(process.env) };
	const selectionSignature = resolveGatewayConfigSelectionSignature(process.env);
	const invocationDestructiveOverride = resolveInvocationDestructiveOverride();
	applyTrustedGatewayEnv(invocationDestructiveOverride);
	if (resolveGatewayConfigSelectionSignature(process.env) !== selectionSignature) {
		restoreGatewayEnvChanges({
			before: envBeforeReload,
			after: { ...fsSafeEnvInput(process.env) }
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
	preparedGatewayRunBootstrap = void 0;
	preparedGatewayRunReset = void 0;
	restoreAppliedGatewayRunConfigEnvironment(params.opts.reset !== true);
	const envBeforeGuard = { ...fsSafeEnvInput(process.env) };
	selectedGatewayRunEnvironment = void 0;
	let guarded;
	try {
		guarded = await guardGatewayRunSelectedConfig(params);
	} finally {
		if (params.opts.reset) {
			restoreAppliedGatewayRunConfigEnvironment(false);
			restoreGatewayEnvChanges({
				before: envBeforeGuard,
				after: { ...fsSafeEnvInput(process.env) },
				preservedKeys: GATEWAY_RESET_SELECTION_ENV_KEYS
			});
		}
	}
	selectedGatewayRunEnvironment = {
		before: envBeforeGuard,
		after: { ...fsSafeEnvInput(process.env) }
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
		environmentSelection
	});
	await pinGatewayRunRuntimePaths();
	const shouldBootstrap = guarded && !params.opts.reset;
	preparedGatewayRunBootstrap = shouldBootstrap && lastGuardedGatewayRunSnapshot ? {
		snapshot: lastGuardedGatewayRunSnapshot,
		allowUnconfigured: params.opts.allowUnconfigured === true,
		dev: Boolean(params.opts.dev) || normalizeOptionalLowercaseString(process.env.OPENCLAW_PROFILE) === "dev"
	} : void 0;
	if (guarded && params.opts.reset && lastGuardedGatewayRunSnapshot) preparedGatewayRunReset = {
		selectionEnvironment: snapshotGatewayConfigSelectionEnvironment(process.env),
		selectionSignature: resolveGatewayConfigSelectionSignature(process.env),
		snapshot: lastGuardedGatewayRunSnapshot
	};
	return shouldBootstrap;
}
async function recheckGatewayRunBootstrap(params) {
	const deferredExitRuntime = {
		...params.runtime,
		exit: (code) => {
			throw new ExitError(code);
		}
	};
	const prepared = preparedGatewayRunBootstrap;
	if (!prepared) {
		params.runtime.error("Refusing to run gateway state preparation without a prepared config snapshot. Retry startup.");
		throw new ExitError(1);
	}
	const current = params.snapshot ? enforceGatewayRunFutureConfigGuard({
		opts: params.opts,
		runtime: deferredExitRuntime,
		snapshot: params.snapshot
	}) ? params.snapshot : null : await readGuardedGatewayRunConfig({
		...params,
		runtime: deferredExitRuntime
	});
	if (!current) return false;
	const change = describeGatewayRunConfigChange(prepared.snapshot, current, { allowPathChange: params.snapshot !== void 0 });
	if (!change) return true;
	params.runtime.error(`Refusing to run gateway state preparation because the selected config changed during startup (${change}). Retry startup so the new config can be validated.`);
	throw new ExitError(1);
}
//#endregion
export { recheckGatewayRunBootstrap as a, selectGatewayRunEnvironment as c, prepareGatewayRunBootstrap as i, enforceGatewayRunFutureConfigGuard as l, clearGatewayRunConfigEnvironment as n, recheckGatewayRunReset as o, getGatewayStartGuardErrors as r, reloadTrustedGatewayRunEnvironment as s, applyFinalGatewayRunConfigEnv as t };
