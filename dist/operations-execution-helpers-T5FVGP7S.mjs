import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { r as parseConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { h as resolveDefaultSecretProviderAlias } from "./ref-contract-D0kWy5jy.mjs";
import { a as coerceSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as hashConfigRaw } from "./io.read-helpers-Bvdjf9tk.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-DuSgsySH.mjs";
import { i as appendSystemAgentAuditEntry } from "./audit-FqvDk6WR.mjs";
import { i as getAtPath } from "./config-cli-path-Dh9BCpH3.mjs";
import { i as formatSystemAgentPersistentPlan } from "./operations-parse-BH-EPBYS.mjs";
import { a as sameDefaultInferenceRoute, n as projectDefaultInferenceRoute, r as projectInferenceRoute } from "./inference-route-JiYgXwOF.mjs";
//#region src/system-agent/operations-execution-helpers.ts
const CONFIG_GET_OUTPUT_MAX_CHARS = 2e3;
function readConfigValueAtPath(config, path) {
	let current = config;
	for (const part of parseConcreteConfigPath(path)) {
		if (current === null || typeof current !== "object") return { found: false };
		const index = /^\d+$/.test(part) ? Number(part) : void 0;
		if (index !== void 0 && Array.isArray(current)) current = current[index];
		else current = current[part];
		if (current === void 0) return { found: false };
	}
	return {
		found: true,
		value: current
	};
}
function formatGatewayStatusLine(overview) {
	return [
		`Gateway: ${overview.gateway.reachable ? "reachable" : "not reachable"}`,
		`URL: ${overview.gateway.url}`,
		`Source: ${overview.gateway.source}`,
		overview.gateway.error ? `Note: ${overview.gateway.error}` : void 0
	].filter((line) => line !== void 0).join("\n");
}
async function runGatewayLifecycle(operation) {
	const lifecycle = await import("./lifecycle-DZncPtsd.mjs");
	if (operation === "start") {
		await lifecycle.runDaemonStart();
		return;
	}
	if (operation === "stop") {
		await lifecycle.runDaemonStop({ force: true });
		return;
	}
	return await lifecycle.runDaemonRestart();
}
async function readConfigFileSnapshotLazy() {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	return await readConfigFileSnapshot();
}
async function loadOverviewForOperation(deps) {
	if (deps?.loadOverview) return await deps.loadOverview();
	const { loadSystemAgentOverview } = await import("./overview-BjP_FMlW.mjs");
	return await loadSystemAgentOverview();
}
async function resolveChannelSetupState(deps) {
	const listPlugins = deps?.listChannelSetupPlugins ?? (await import("./setup-registry-DcoMHGuJ.mjs")).listChannelSetupPlugins;
	const resolveEntries = deps?.resolveChannelSetupEntries ?? (await import("./discovery-BzJZAIzY.mjs")).resolveChannelSetupEntries;
	const isConfigured = deps?.isChannelConfigured ?? (await import("./channel-configured-shared-MyJBxdrY.mjs")).isStaticallyChannelConfigured;
	const { shouldShowChannelInSetup } = await import("./discovery-BzJZAIzY.mjs");
	const snapshot = await readConfigFileSnapshotLazy();
	const cfg = snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	const installedPlugins = listPlugins();
	const resolved = resolveEntries({
		cfg,
		installedPlugins
	});
	return {
		cfg,
		installedPlugins,
		resolved: {
			...resolved,
			entries: resolved.entries.filter((entry) => shouldShowChannelInSetup(entry.meta))
		},
		isConfigured
	};
}
function formatChannelDocsUrl(docsPath) {
	return `https://docs.openclaw.ai${docsPath.startsWith("/") ? docsPath : `/${docsPath}`}`;
}
function formatConfigValidationLine(snapshot) {
	if (!snapshot.exists) return `Config missing: ${shortenHomePath(snapshot.path)}`;
	if (snapshot.valid) return `Config valid: ${shortenHomePath(snapshot.path)}`;
	return [`Config invalid: ${shortenHomePath(snapshot.path)}`, ...snapshot.issues.map((issue) => {
		return `  - ${issue.path ? `${issue.path}: ` : ""}${issue.message}`;
	})].join("\n");
}
/** A CLI command already wrote its failure to the runtime before calling exit. */
var SystemAgentOperationExitError = class extends Error {
	constructor(code) {
		super(`operation exited with code ${code}`);
	}
};
function createNoExitRuntime(runtime) {
	return {
		...runtime,
		exit: (code) => {
			throw new SystemAgentOperationExitError(code);
		}
	};
}
function resolveTuiAgentId(params) {
	const { overview } = params;
	const workspace = params.requestedWorkspace ? resolveUserPath(params.requestedWorkspace) : void 0;
	if (workspace) {
		const workspaceMatch = overview.agents.find((agent) => {
			return agent.workspace ? resolveUserPath(agent.workspace) === workspace : false;
		});
		if (workspaceMatch) return workspaceMatch.id;
	}
	if (!params.requestedAgentId?.trim()) return overview.defaultAgentId;
	const requested = normalizeAgentId(params.requestedAgentId);
	return overview.agents.find((agent) => {
		return normalizeAgentId(agent.id) === requested || (agent.name ? normalizeAgentId(agent.name) === requested : false);
	})?.id ?? requested;
}
/** Utility inference can power setup without making an ordinary agent ready. */
function getRegularAgentSetupNotice(overview, agentId = overview.defaultAgentId) {
	const requestedId = normalizeAgentId(agentId);
	const isDefault = requestedId === normalizeAgentId(overview.defaultAgentId);
	const agent = overview.agents.find((entry) => normalizeAgentId(entry.id) === requestedId);
	const primaryModel = agent?.model ?? (isDefault ? overview.defaultModel : void 0);
	const utilityModel = agent?.utilityModel ?? (isDefault ? overview.setupModel : void 0);
	if (primaryModel || !utilityModel) return;
	return "Your setup and utility model is ready, but this agent needs a primary model. Choose one in Model Setup or run `openclaw onboard`; you can continue setup here in the meantime.";
}
async function applyPersistentOperation(params) {
	const { auditOperation, runtime, opts } = params;
	if (!opts.approved) {
		const message = formatSystemAgentPersistentPlan(params.operation, opts.operatorApprovalOnly);
		runtime.log(message);
		return {
			applied: false,
			message
		};
	}
	runtime.log(`[openclaw] running: ${auditOperation}`);
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const before = await readConfigFileSnapshot();
	const assertPersistentApply = opts.beforePersistentApply;
	const commit = async (effect) => {
		assertPersistentApply?.();
		return await effect();
	};
	const outcome = await params.run({
		runtime,
		deps: opts.deps,
		...assertPersistentApply ? { assertPersistentApply } : {},
		commit
	});
	const after = await readConfigFileSnapshot();
	try {
		await appendSystemAgentAuditEntry({
			operation: auditOperation,
			summary: outcome.summary,
			configPath: outcome.configPath ?? after.path ?? before.path ?? void 0,
			configHashBefore: hashConfigRaw(before.raw),
			configHashAfter: hashConfigRaw(after.raw),
			details: {
				...opts.auditDetails,
				...outcome.details
			}
		});
	} catch (error) {
		runtime.error(`${outcome.summary}, but OpenClaw could not record its audit entry: ${formatErrorMessage(error)}`);
	}
	runtime.log(`[openclaw] done: ${auditOperation}`);
	return {
		applied: true,
		...outcome.bootstrapPending === void 0 ? {} : { bootstrapPending: outcome.bootstrapPending },
		...outcome.agentId ? { agentId: outcome.agentId } : {}
	};
}
async function runConfigSetOperation(params) {
	const { operation, ctx } = params;
	const runConfigSet = ctx.deps?.runConfigSet ?? (async (setOpts) => {
		const { runConfigSet: importedRunConfigSet } = await import("./config-cli-mmwnie3a.mjs");
		await importedRunConfigSet({
			...setOpts,
			runtime: createNoExitRuntime(ctx.runtime),
			throwOnError: operation.kind === "config-set-ref" && operation.secret !== void 0
		});
	});
	const beforePersistentApply = ctx.assertPersistentApply ? { beforePersistentApply: ctx.assertPersistentApply } : {};
	if (operation.kind === "config-set" || operation.secret === void 0) {
		await ctx.commit(() => runConfigSet({
			path: operation.path,
			...operation.kind === "config-set" ? {
				value: operation.value,
				cliOptions: {}
			} : { cliOptions: {
				refProvider: operation.provider ?? "default",
				refSource: operation.source,
				refId: operation.id
			} },
			...beforePersistentApply
		}));
		return {};
	}
	const secret = operation.secret;
	const snapshot = await readConfigFileSnapshotLazy();
	const configPath = parseConcreteConfigPath(operation.path);
	const currentRef = coerceSecretRef(getAtPath(snapshot.sourceConfig, configPath).value, snapshot.config.secrets?.defaults);
	const defaultStoreProvider = resolveDefaultSecretProviderAlias(snapshot.config, "store", { preferFirstProviderForSource: true });
	const refProvider = operation.provider ?? (currentRef?.source === "store" && (currentRef.provider === defaultStoreProvider || snapshot.config.secrets?.providers?.[currentRef.provider]?.source === "store") ? currentRef.provider : defaultStoreProvider);
	const { writeSecretStoreEntryForConfigRef } = await import("./secret-store-B-u-2GyM.mjs");
	const storeEntry = await ctx.commit(() => writeSecretStoreEntryForConfigRef({
		baseName: operation.id,
		value: secret,
		updatedBy: "openclaw",
		...ctx.assertPersistentApply ? { assertCurrent: ctx.assertPersistentApply } : {}
	}));
	try {
		await runConfigSet({
			path: operation.path,
			cliOptions: {
				refProvider,
				refSource: "store",
				refId: storeEntry
			},
			...beforePersistentApply
		});
	} catch (error) {
		const postCommit = error instanceof ConfigWritePostCommitError ? error : void 0;
		let referenceState = `Could not establish whether ${operation.path} references the saved entry.`;
		try {
			const { readConfigFileSnapshot } = await import("./config/config.js");
			const current = await readConfigFileSnapshot({
				observe: false,
				isolateEnv: true
			});
			if (current.path === (postCommit?.configPath ?? snapshot.path) && current.exists && current.valid) {
				const ref = coerceSecretRef(getAtPath(current.sourceConfig, configPath).value, current.config.secrets?.defaults);
				const referencesEntry = ref?.source === "store" && ref.id === storeEntry;
				referenceState = `At the recovery check, ${operation.path} ${referencesEntry ? "referenced" : "did not reference"} the saved entry.`;
			}
		} catch {}
		throw new Error([
			`Saved the secret as ${storeEntry}, but ${postCommit ? "config post-write processing" : "the config operation"} failed: ${formatErrorMessage(error)}`,
			referenceState,
			"The entry was kept; other config keys or auth profiles may use it. Do not remove it while references are present or uncertain.",
			"Resolve the config/runtime error and inspect current references before retrying; reuse the saved entry instead of saving the secret again."
		].join(" "), { cause: error });
	}
	return {
		storeEntry,
		storeProvider: refProvider
	};
}
async function verifyCurrentSetupInference(runtime, deps) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const before = await readConfigFileSnapshot();
	if (!before.exists || !before.valid) throw new Error("OpenClaw setup requires a valid configured inference route. Run `openclaw onboard` on the machine running OpenClaw, then retry.");
	const beforeConfig = before.runtimeConfig ?? before.config;
	const beforeRoute = await projectDefaultInferenceRoute(beforeConfig);
	if (!beforeRoute.route) throw new Error("OpenClaw setup requires working inference first. Run `openclaw onboard` on the machine running OpenClaw, then retry.");
	const verification = await (deps?.verifyInferenceConfig ?? (await import("./system-agent/setup-inference.js")).verifySetupInferenceConfig)({
		config: beforeConfig,
		runtime
	});
	if (!verification.ok) throw new Error(`OpenClaw setup requires working inference first. The configured route failed a live check: ${verification.error} Run \`openclaw onboard\` on the machine running OpenClaw, then retry.`);
	const after = await readConfigFileSnapshot();
	if (!after.exists || !after.valid) throw new Error("The default-agent inference route changed during setup verification, so setup was not applied. Review the current config and retry.");
	const afterConfig = after.runtimeConfig ?? after.config;
	const afterRoute = await projectDefaultInferenceRoute(afterConfig);
	if (!sameDefaultInferenceRoute(beforeRoute, afterRoute) || verification.modelRef !== afterRoute.route?.modelLabel) throw new Error("The default-agent inference route changed during setup verification, so setup was not applied. Review the current model/auth/runtime settings and retry.");
	return {
		modelRef: verification.modelRef,
		route: afterRoute,
		latencyMs: verification.latencyMs
	};
}
async function executeSetup(operation, runtime, opts) {
	const overview = await loadOverviewForOperation(opts.deps);
	const setupModel = (overview.defaultModel ?? overview.setupModel)?.trim();
	const modelRole = overview.defaultModel ? "default" : "setup";
	if (!setupModel) throw new Error("OpenClaw setup requires working inference first. Run `openclaw onboard` on the machine running OpenClaw to configure and verify a default model, then start OpenClaw again.");
	const requestedModel = operation.model?.trim();
	if (requestedModel && requestedModel !== setupModel) throw new Error(`OpenClaw setup will preserve the verified ${modelRole} model ${setupModel}. Staging, live-testing, and saving a different inference route is \`openclaw onboard\` on the machine running OpenClaw.`);
	if (!opts.approved) {
		const message = [formatSystemAgentPersistentPlan(operation, opts.operatorApprovalOnly), `Model choice: keep verified ${modelRole} ${setupModel}.`].join("\n");
		runtime.log(message);
		return {
			applied: false,
			message
		};
	}
	const verified = await verifyCurrentSetupInference(runtime, opts.deps);
	if (requestedModel && requestedModel !== verified.modelRef) throw new Error(`The verified default model is now ${verified.modelRef}, not ${requestedModel}. Review the current route, or run \`openclaw onboard\` on the machine running OpenClaw, before retrying setup.`);
	return await applyPersistentOperation({
		auditOperation: "openclaw.setup",
		operation,
		runtime,
		opts,
		run: async (ctx) => {
			const applySetup = ctx.deps?.applySetup ?? (await import("./setup-apply-D1lHK-QT.mjs")).applySystemAgentSetup;
			const surface = ctx.deps?.setupSurface ?? "cli";
			const recovery = surface === "cli" ? await (await import("./setup-recovery-CvfEFmkz.mjs")).loadLocalSetupRecovery(operation.workspace) : void 0;
			const workspace = recovery?.workspace ?? resolveUserPath(operation.workspace ?? process.cwd());
			const applied = await ctx.commit(() => applySetup({
				workspace,
				...operation.agentName ? { firstAgent: { name: operation.agentName } } : {},
				expectedInferenceRoute: verified.route,
				...recovery?.applyOptions,
				surface,
				runtime: ctx.runtime
			}, { beforePersistentApply: ctx.assertPersistentApply }));
			if (!applied.workspaceReady) throw new Error("The workspace could not be prepared. Retry onboarding to finish setup.");
			if (applied.gateway.status === "failed") throw new Error(applied.gateway.error);
			const after = await recovery?.complete(applied.configPath, (effect) => ctx.commit(effect)) ?? await readConfigFileSnapshotLazy();
			ctx.runtime.log(`Updated ${after.path || applied.configPath || "config"}`);
			for (const line of applied.lines) ctx.runtime.log(line);
			ctx.runtime.log(`${modelRole === "default" ? "Default" : "Setup"} model: ${verified.modelRef} (verified and kept)`);
			return {
				summary: "Bootstrapped setup workspace",
				bootstrapPending: applied.bootstrapPending,
				configPath: after.path || applied.configPath,
				details: {
					workspace,
					model: verified.modelRef,
					modelSource: `live-verified ${modelRole} model`,
					inferenceLatencyMs: verified.latencyMs
				}
			};
		}
	});
}
async function executeSetDefaultModel(operation, runtime, opts) {
	return await applyPersistentOperation({
		auditOperation: "config.setDefaultModel",
		operation,
		runtime,
		opts,
		run: async (ctx) => {
			const { mutateConfigFile, readConfigFileSnapshot } = await import("./config/config.js");
			const { createSystemAgentModelSelectionUpdater } = await import("./setup-model-selection-BC7kmr1N.mjs");
			const targetAgentId = operation.agentId;
			const snapshot = await readConfigFileSnapshot();
			const projectRoute = (config) => projectInferenceRoute(config, targetAgentId);
			const selectModel = await createSystemAgentModelSelectionUpdater({
				model: operation.model,
				...targetAgentId ? { targetAgentId } : {}
			});
			const stagedConfig = selectModel(snapshot.sourceConfig);
			const beforeRoute = await projectRoute(snapshot.sourceConfig);
			const verifiedRoute = await projectRoute(stagedConfig);
			const verifyInferenceConfig = ctx.deps?.verifyInferenceConfig ?? (await import("./system-agent/setup-inference.js")).verifySetupInferenceConfig;
			const initialVerification = await verifyInferenceConfig({
				config: stagedConfig,
				runtime: ctx.runtime,
				requireExecutionOwner: true,
				...targetAgentId ? { agentId: targetAgentId } : {}
			});
			if (!initialVerification.ok) throw new Error(`The requested model failed a live inference test, so the current default model was not changed. ${initialVerification.error} Fix provider authentication or model access, then retry.`);
			const verifiedModelRef = verifiedRoute.route?.modelLabel;
			if (!verifiedModelRef || initialVerification.modelRef !== verifiedModelRef) throw new Error("The live inference test did not verify the exact model route that would be saved, so the current default model was not changed. Review model aliases and runtime routing, then retry.");
			let persistedVerification = initialVerification;
			let persistedBinding;
			let selectedRouteForCommit = verifiedRoute;
			const result = await mutateConfigFile({
				base: "source",
				writeOptions: {
					auditOrigin: "system-agent",
					...ctx.assertPersistentApply ? { assertConfigPathForWrite: ctx.assertPersistentApply } : {},
					preCommitRuntimePreflight: async (sourceConfig) => {
						const commitRoute = await projectRoute(sourceConfig);
						if (!sameDefaultInferenceRoute(commitRoute, selectedRouteForCommit)) throw new Error("The selected inference route changed while preparing the config write, so the requested model was not saved. Review the current model/auth/runtime settings and retry.");
						ctx.assertPersistentApply?.();
						let latestBinding;
						const latestVerification = await verifyInferenceConfig({
							config: sourceConfig,
							runtime: ctx.runtime,
							requireExecutionOwner: true,
							...targetAgentId ? { agentId: targetAgentId } : {},
							...opts.onVerifiedInferenceChanged ? { onVerifiedExecution: (binding) => {
								latestBinding = binding;
							} } : {}
						});
						if (!latestVerification.ok) throw new Error(`The requested model no longer passes live inference at the config commit boundary, so it was not saved. ${latestVerification.error} Review concurrent configuration changes and retry.`);
						if (latestVerification.modelRef !== commitRoute.route?.modelLabel) throw new Error("The final live inference test did not verify the exact model route at the config commit boundary, so the requested model was not saved. Review model aliases and runtime routing, then retry.");
						if (opts.onVerifiedInferenceChanged && !latestBinding) throw new Error("The final live inference test did not return a reusable session binding, so the requested model was not saved. Retry the model change.");
						ctx.assertPersistentApply?.();
						persistedVerification = latestVerification;
						persistedBinding = latestBinding;
					}
				},
				mutate: async (cfg) => {
					const currentRoute = await projectRoute(cfg);
					if (!sameDefaultInferenceRoute(currentRoute, beforeRoute)) throw new Error("The default-agent inference route changed during verification, so the requested model was not saved. Review the current model/auth/runtime settings and retry.");
					const selected = selectModel(cfg);
					const selectedRoute = await projectRoute(selected);
					if (selectedRoute.route?.modelLabel !== verifiedModelRef) throw new Error("The model selection no longer resolves to the exact model that passed live inference. Review the current model/auth/runtime settings and retry.");
					selectedRouteForCommit = selectedRoute;
					cfg.agents = selected.agents;
				}
			});
			if (persistedBinding) opts.onVerifiedInferenceChanged?.(persistedBinding);
			ctx.runtime.log(`Updated ${result.path}`);
			ctx.runtime.log(targetAgentId ? `Agent ${targetAgentId} model: ${persistedVerification.modelRef}` : `Default model: ${persistedVerification.modelRef}`);
			return {
				summary: targetAgentId ? `Set agent ${targetAgentId} model to ${operation.model}` : `Set default model to ${operation.model}`,
				configPath: result.path,
				details: {
					...targetAgentId ? { agentId: targetAgentId } : {},
					requestedModel: operation.model,
					effectiveModel: persistedVerification.modelRef,
					inferenceVerified: true,
					inferenceLatencyMs: persistedVerification.latencyMs
				}
			};
		}
	});
}
/**
* Uninstalling the plugin that provides the active default inference route
* would break the very session driving the change, so that case stays a
* terminal-only operation. Every other plugin is uninstallable behind the
* standard approval gate — matching what the operator can do from the UI/CLI.
*/
async function isPluginBackingDefaultInferenceRoute(pluginId) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (!snapshot.exists || !snapshot.valid) return true;
	const config = snapshot.runtimeConfig ?? snapshot.config;
	const route = (await projectDefaultInferenceRoute(config ?? {})).route;
	if (!route) return false;
	const { resolveModelRuntimePolicy } = await import("./model-runtime-policy-sxX07Kle.mjs");
	const runtimePolicyId = resolveModelRuntimePolicy({
		config,
		provider: route.provider,
		modelId: route.model,
		agentId: route.agentId
	}).policy?.id;
	const normalizedPluginId = pluginId.trim().toLowerCase();
	const components = [
		route.provider,
		runtimePolicyId,
		route.runner === "embedded" ? route.agentHarnessRuntimeOverride : void 0
	].map((component) => component?.trim().toLowerCase()).filter((component) => Boolean(component));
	if (components.includes(normalizedPluginId)) return true;
	const { resolveOwningPluginIdsForProviderRef } = await import("./providers-BBHK8PNX.mjs");
	return components.some((component) => (resolveOwningPluginIdsForProviderRef({
		provider: component,
		config
	}) ?? []).some((owner) => owner.trim().toLowerCase() === normalizedPluginId));
}
//#endregion
export { runConfigSetOperation as _, executeSetDefaultModel as a, formatConfigValidationLine as c, isPluginBackingDefaultInferenceRoute as d, loadOverviewForOperation as f, resolveTuiAgentId as g, resolveChannelSetupState as h, createNoExitRuntime as i, formatGatewayStatusLine as l, readConfigValueAtPath as m, SystemAgentOperationExitError as n, executeSetup as o, readConfigFileSnapshotLazy as p, applyPersistentOperation as r, formatChannelDocsUrl as s, CONFIG_GET_OUTPUT_MAX_CHARS as t, getRegularAgentSetupNotice as u, runGatewayLifecycle as v };
