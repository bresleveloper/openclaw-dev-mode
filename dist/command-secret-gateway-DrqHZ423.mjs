import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { n as formatConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { g as resolveSecretInputRef } from "./types.secrets-DsPRn9Dz.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { f as resolveConfigSecretRef, i as copyConfigResolutionFactsExcept, t as cloneConfigWithResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { i as resolveManifestContractOwnerPluginId } from "./plugin-registry-contributions-JwCDUODD.mjs";
import { f as assertExpectedResolvedSecretValue, i as createResolverContext } from "./runtime-shared-7qI1DEx4.mjs";
import { r as discoverConfigSecretTargetsByIds } from "./target-registry-query-f56MMhmb.mjs";
import { i as setPathExistingStrict, n as getPath } from "./path-utils-DQXhHs4r.mjs";
import "./target-registry-1a6D8fYt.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { Ir as validateSecretsResolveResult } from "./src-l2dWvEsN.mjs";
import { n as resolveSecretRefValue } from "./resolve-DDYPuZjk.mjs";
import { a as readGatewaySecretInputValue, t as ALL_GATEWAY_SECRET_INPUT_PATHS } from "./secret-input-paths-C2PsvPdU.mjs";
import { t as gatewaySecretInputPathCanWin } from "./credentials-secret-inputs-DxDUO_P2.mjs";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-Dcrh-ATi.mjs";
import { t as analyzeCommandSecretAssignmentsFromSnapshot } from "./command-config-8PaTMA3L.mjs";
import { t as collectConfigAssignments } from "./runtime-config-collectors-BsImN7f8.mjs";
import { t as resolveRuntimeWebTools } from "./runtime-web-tools-BHnCM2Do.mjs";
//#region src/cli/command-secret-gateway.ts
function normalizeCommandSecretResolutionMode(mode) {
	if (!mode || mode === "enforce_resolved" || mode === "strict") return "enforce_resolved";
	if (mode === "read_only_status" || mode === "summary") return "read_only_status";
	return "read_only_operational";
}
function classifyRuntimeWebTarget(params) {
	const match = /^plugins\.entries\.([^.]+)\.config\.(webSearch|webFetch)\.apiKey$/.exec(params.path);
	if (!match) return { state: "unknown" };
	const kind = match[2] === "webFetch" ? "fetch" : "search";
	const web = params.config.tools?.web?.[kind];
	if (web?.enabled === false) return {
		state: "inactive",
		detail: `tools.web.${kind} is disabled.`
	};
	const provider = normalizeLowercaseStringOrEmpty(web?.provider);
	if (!provider) return { state: "active" };
	const pluginId = resolveManifestContractOwnerPluginId({
		contract: kind === "fetch" ? "webFetchProviders" : "webSearchProviders",
		value: provider,
		origin: "bundled",
		config: params.config
	});
	if (!pluginId) return { state: "unknown" };
	return pluginId === match[1] ? { state: "active" } : {
		state: "inactive",
		detail: `tools.web.${kind}.provider is "${provider}".`
	};
}
function targetsRuntimeWebPath(path) {
	return path.startsWith("plugins.entries.");
}
function collectConfiguredTargetRefPaths(params) {
	const defaults = params.config.secrets?.defaults;
	const configuredTargetRefPaths = /* @__PURE__ */ new Set();
	for (const target of discoverConfigSecretTargetsByIds(params.config, params.targetIds)) {
		if (params.allowedPaths && !params.allowedPaths.has(target.path)) continue;
		const { ref } = resolveSecretInputRef({
			value: resolveConfigSecretRef({
				config: params.config,
				path: target.path,
				value: target.value,
				defaults
			}),
			refValue: target.refValue,
			defaults
		});
		if (ref) configuredTargetRefPaths.add(target.path);
	}
	return configuredTargetRefPaths;
}
function classifyConfiguredTargetRefs(params) {
	const context = createResolverContext({
		sourceConfig: params.config,
		env: process.env
	});
	collectConfigAssignments({
		config: cloneConfigWithResolutionFacts(params.config),
		context,
		agentId: params.agentId
	});
	const activePaths = new Set(context.assignments.map((assignment) => assignment.path));
	const inactiveWarningsByPath = /* @__PURE__ */ new Map();
	for (const warning of context.warnings) {
		if (warning.code !== "SECRETS_REF_IGNORED_INACTIVE_SURFACE") continue;
		inactiveWarningsByPath.set(warning.path, warning.message);
	}
	const diagnostics = /* @__PURE__ */ new Set();
	let hasActiveConfiguredRef = false;
	let hasUnknownConfiguredRef = false;
	for (const path of params.configuredTargetRefPaths) {
		if (activePaths.has(path) || params.forcedActivePaths?.has(path) || params.optionalActivePaths?.has(path)) {
			hasActiveConfiguredRef = true;
			continue;
		}
		const inactiveWarning = inactiveWarningsByPath.get(path);
		if (inactiveWarning) {
			diagnostics.add(inactiveWarning);
			continue;
		}
		hasUnknownConfiguredRef = true;
	}
	return {
		hasActiveConfiguredRef,
		hasUnknownConfiguredRef,
		diagnostics: [...diagnostics]
	};
}
function parseGatewaySecretsResolveResult(payload) {
	if (!validateSecretsResolveResult(payload)) throw new Error("gateway returned invalid secrets.resolve payload.");
	return {
		assignments: payload.assignments ?? [],
		diagnostics: (payload.diagnostics ?? []).filter((entry) => entry.trim().length > 0),
		inactiveRefPaths: (payload.inactiveRefPaths ?? []).filter((entry) => entry.trim().length > 0)
	};
}
function inactiveSurfaceDiagnosticPath(diagnostic) {
	const markerIndex = diagnostic.indexOf(": secret ref is configured on an inactive surface;");
	return markerIndex > 0 ? diagnostic.slice(0, markerIndex).trim() : void 0;
}
function filterAllowedGatewayDiagnostics(params) {
	return params.diagnostics.filter((diagnostic) => {
		const markerIndex = diagnostic.indexOf(":");
		if (markerIndex <= 0) return true;
		const path = diagnostic.slice(0, markerIndex).trim();
		if (!path.includes(".")) return true;
		if (params.forcedActivePaths?.has(path) || params.optionalActivePaths?.has(path)) return false;
		return !params.allowedPaths || params.allowedPaths.has(path);
	});
}
function isUnsupportedSecretsResolveError(err) {
	const message = normalizeLowercaseStringOrEmpty(formatErrorMessage(err));
	if (!message.includes("secrets.resolve")) return false;
	return message.includes("does not support required method") || message.includes("unknown method") || message.includes("method not found") || message.includes("invalid request");
}
function isAllowedPathsSecretsResolveCompatError(err) {
	const message = normalizeLowercaseStringOrEmpty(formatErrorMessage(err));
	if (!message.includes("secrets.resolve")) return false;
	return message.includes("invalid request") || message.includes("invalid secrets.resolve params");
}
function collectActiveGatewayExecSecretRefCredentialPaths(config) {
	const defaults = config.secrets?.defaults;
	return ALL_GATEWAY_SECRET_INPUT_PATHS.filter((path) => {
		const { ref } = resolveSecretInputRef({
			value: readGatewaySecretInputValue(config, path),
			defaults
		});
		return ref?.source === "exec" && gatewaySecretInputPathCanWin({
			config,
			path,
			env: process.env
		});
	});
}
async function callGatewaySecretsResolve(params) {
	const callGateway = bindAgentToolGatewayRequest({ hostedOnly: true });
	const request = {
		config: params.config,
		method: "secrets.resolve",
		requiredMethods: ["secrets.resolve"],
		params: {
			commandName: params.commandName,
			targetIds: [...params.targetIds],
			...params.allowedPaths ? { allowedPaths: [...params.allowedPaths] } : {},
			...params.forcedActivePaths ? { forcedActivePaths: [...params.forcedActivePaths] } : {},
			...params.optionalActivePaths ? { optionalActivePaths: [...params.optionalActivePaths] } : {}
		},
		timeoutMs: params.timeoutMs ?? 3e4,
		clientName: GATEWAY_CLIENT_NAMES.CLI,
		mode: GATEWAY_CLIENT_MODES.CLI
	};
	try {
		return await callGateway(request);
	} catch (err) {
		if (!params.allowedPaths && !params.forcedActivePaths && !params.optionalActivePaths || Boolean(params.forcedActivePaths?.size) || !isAllowedPathsSecretsResolveCompatError(err)) throw err;
		return callGateway({
			...request,
			params: {
				commandName: params.commandName,
				targetIds: [...params.targetIds]
			}
		});
	}
}
async function resolveCommandSecretRefsLocally(params) {
	const sourceConfig = params.config;
	const resolvedConfig = cloneConfigWithResolutionFacts(params.config);
	const context = createResolverContext({
		sourceConfig,
		env: process.env
	});
	const localResolutionDiagnostics = [];
	const discoveredTargets = discoverConfigSecretTargetsByIds(sourceConfig, params.targetIds).filter((target) => !params.allowedPaths || params.allowedPaths.has(target.path));
	const runtimeWebTargets = discoveredTargets.filter((target) => targetsRuntimeWebPath(target.path));
	collectConfigAssignments({
		config: cloneConfigWithResolutionFacts(params.config),
		context,
		agentId: params.agentId
	});
	if ([...params.allowedPaths ?? params.targetIds].some(targetsRuntimeWebPath) && !runtimeWebTargets.every((target) => /^plugins\.entries\.[^.]+\.config\.(webSearch|webFetch)\.apiKey$/.test(target.path))) try {
		await resolveRuntimeWebTools({
			sourceConfig,
			resolvedConfig,
			context
		});
	} catch (error) {
		if (params.mode === "enforce_resolved") throw error;
		localResolutionDiagnostics.push(`${params.commandName}: failed to resolve web tool secrets locally (${formatErrorMessage(error)}).`);
	}
	const inactiveWarnings = context.warnings.filter((warning) => warning.code === "SECRETS_REF_IGNORED_INACTIVE_SURFACE" && (!params.allowedPaths || params.allowedPaths.has(warning.path)) && !params.forcedActivePaths?.has(warning.path) && !params.optionalActivePaths?.has(warning.path));
	const inactiveRefPaths = new Set(inactiveWarnings.map((warning) => warning.path));
	const runtimeWebActivePaths = /* @__PURE__ */ new Set();
	const runtimeWebInactiveDiagnostics = [];
	for (const target of runtimeWebTargets) {
		if (params.forcedActivePaths?.has(target.path) || params.optionalActivePaths?.has(target.path)) {
			runtimeWebActivePaths.add(target.path);
			continue;
		}
		const runtimeState = classifyRuntimeWebTarget({
			config: sourceConfig,
			path: target.path
		});
		if (runtimeState.state === "inactive") {
			inactiveRefPaths.add(target.path);
			if (runtimeState.detail) runtimeWebInactiveDiagnostics.push(`${target.path}: ${runtimeState.detail}`);
			continue;
		}
		if (runtimeState.state === "active") runtimeWebActivePaths.add(target.path);
	}
	const activePaths = new Set(context.assignments.map((assignment) => assignment.path));
	for (const target of discoveredTargets) {
		const defaults = sourceConfig.secrets?.defaults;
		const { ref } = resolveSecretInputRef({
			value: resolveConfigSecretRef({
				config: sourceConfig,
				path: target.path,
				value: target.value,
				defaults
			}),
			refValue: target.refValue,
			defaults
		});
		if (!ref || inactiveRefPaths.has(target.path) || !activePaths.has(target.path) && !runtimeWebActivePaths.has(target.path) && !params.forcedActivePaths?.has(target.path) && !params.optionalActivePaths?.has(target.path)) continue;
		if (ref.source === "exec" && !params.resolutionPolicy.allowExecSecretRefs) {
			if (params.mode !== "enforce_resolved") localResolutionDiagnostics.push(`${params.commandName}: skipped local exec SecretRef resolution for ${target.path}; rerun with --allow-exec to execute configured exec providers.`);
			continue;
		}
		try {
			const resolved = await resolveSecretRefValue(ref, {
				config: sourceConfig,
				env: context.env,
				cache: context.cache
			});
			assertExpectedResolvedSecretValue({
				value: resolved,
				expected: target.entry.expectedResolvedValue,
				errorMessage: target.entry.expectedResolvedValue === "string" ? `${target.path} resolved to a non-string or empty value.` : `${target.path} resolved to an unsupported value type.`
			});
			setPathExistingStrict(resolvedConfig, target.pathSegments, resolved);
			copyConfigResolutionFactsExcept(resolvedConfig, resolvedConfig, [target.path]);
		} catch (error) {
			if (params.mode !== "enforce_resolved") localResolutionDiagnostics.push(`${params.commandName}: failed to resolve ${target.path} locally (${formatErrorMessage(error)}).`);
		}
	}
	const analyzed = analyzeCommandSecretTargets({
		sourceConfig,
		resolvedConfig,
		targetIds: params.targetIds,
		inactiveRefPaths,
		allowedPaths: params.allowedPaths,
		optionalActivePaths: params.optionalActivePaths
	});
	const targetStatesByPath = buildTargetStatesByPath({
		analyzed,
		resolvedState: "resolved_local"
	});
	if (analyzed.unresolved.length > 0) {
		if (params.mode === "enforce_resolved") throw new Error(`${params.commandName}: ${analyzed.unresolved[0]?.path ?? "target"} is unresolved in the active runtime snapshot.`);
		if (params.resolutionPolicy.scrubUnresolvedSecretRefs) scrubUnresolvedAssignments(resolvedConfig, analyzed.unresolved);
	}
	return {
		resolvedConfig,
		diagnostics: normalizeUniqueStringEntries([
			...params.preflightDiagnostics,
			...runtimeWebInactiveDiagnostics,
			...inactiveWarnings.map((warning) => warning.message),
			...filterInactiveSurfaceDiagnostics({
				diagnostics: analyzed.diagnostics,
				inactiveRefPaths
			}),
			...localResolutionDiagnostics,
			...buildUnresolvedDiagnostics(params.commandName, analyzed.unresolved)
		]),
		targetStatesByPath,
		hadUnresolvedTargets: analyzed.unresolved.length > 0
	};
}
function analyzeCommandSecretTargets(params) {
	const { optionalActivePaths, ...snapshot } = params;
	const analyzed = analyzeCommandSecretAssignmentsFromSnapshot(snapshot);
	const optionalUnresolvedPaths = analyzed.unresolved.filter((entry) => optionalActivePaths?.has(entry.path));
	if (optionalUnresolvedPaths.length === 0) return analyzed;
	for (const { path } of optionalUnresolvedPaths) snapshot.inactiveRefPaths.add(path);
	return analyzeCommandSecretAssignmentsFromSnapshot(snapshot);
}
function buildTargetStatesByPath(params) {
	const states = {};
	for (const assignment of params.analyzed.assignments) states[assignment.path] = params.resolvedState;
	for (const entry of params.analyzed.inactive) states[entry.path] = "inactive_surface";
	for (const entry of params.analyzed.unresolved) states[entry.path] = "unresolved";
	return states;
}
function buildUnresolvedDiagnostics(commandName, unresolved) {
	return unresolved.map((entry) => `${commandName}: ${entry.path} is unavailable in this command path; continuing with degraded read-only config.`);
}
function scrubUnresolvedAssignments(config, unresolved) {
	for (const entry of unresolved) setPathExistingStrict(config, entry.pathSegments, void 0);
}
function filterInactiveSurfaceDiagnostics(params) {
	return params.diagnostics.filter((entry) => {
		const path = inactiveSurfaceDiagnosticPath(entry);
		return path === void 0 || !params.inactiveRefPaths.has(path);
	});
}
async function resolveCommandSecretRefsViaGateway(params) {
	const mode = normalizeCommandSecretResolutionMode(params.mode);
	const resolutionPolicy = {
		allowExecSecretRefs: params.allowLocalExecSecretRefs !== false,
		scrubUnresolvedSecretRefs: params.scrubUnresolvedSecretRefs !== false
	};
	const configuredTargetRefPaths = collectConfiguredTargetRefPaths({
		config: params.config,
		targetIds: params.targetIds,
		allowedPaths: params.allowedPaths
	});
	if (configuredTargetRefPaths.size === 0) return {
		resolvedConfig: params.config,
		diagnostics: [],
		targetStatesByPath: {},
		hadUnresolvedTargets: false
	};
	const preflight = classifyConfiguredTargetRefs({
		config: params.config,
		configuredTargetRefPaths,
		agentId: params.agentId,
		forcedActivePaths: params.forcedActivePaths,
		optionalActivePaths: params.optionalActivePaths
	});
	if (!preflight.hasActiveConfiguredRef && !preflight.hasUnknownConfiguredRef) return {
		resolvedConfig: params.config,
		diagnostics: preflight.diagnostics,
		targetStatesByPath: {},
		hadUnresolvedTargets: false
	};
	const resolveLocally = (allowedPaths = params.allowedPaths, preflightDiagnostics = preflight.diagnostics) => resolveCommandSecretRefsLocally({
		config: params.config,
		commandName: params.commandName,
		targetIds: params.targetIds,
		agentId: params.agentId,
		preflightDiagnostics,
		mode,
		allowedPaths,
		forcedActivePaths: params.forcedActivePaths,
		optionalActivePaths: params.optionalActivePaths,
		resolutionPolicy
	});
	const gatewayExecSecretRefCredentialPaths = resolutionPolicy.allowExecSecretRefs ? [] : collectActiveGatewayExecSecretRefCredentialPaths(params.config);
	if (gatewayExecSecretRefCredentialPaths.length > 0) {
		const fallback = await resolveLocally();
		return {
			...fallback,
			diagnostics: normalizeUniqueStringEntries([...fallback.diagnostics, `${params.commandName}: skipped gateway secrets.resolve because gateway credentials use exec SecretRefs at ${gatewayExecSecretRefCredentialPaths.join(", ")}; rerun with --allow-exec to execute configured exec providers.`])
		};
	}
	let payload;
	try {
		payload = await callGatewaySecretsResolve({
			config: params.config,
			commandName: params.commandName,
			targetIds: params.targetIds,
			allowedPaths: params.allowedPaths,
			forcedActivePaths: params.forcedActivePaths,
			optionalActivePaths: params.optionalActivePaths,
			...params.gatewaySecretResolveTimeoutMs !== void 0 ? { timeoutMs: params.gatewaySecretResolveTimeoutMs } : {}
		});
	} catch (err) {
		const forcedActiveCompatFailure = Boolean(params.forcedActivePaths?.size) && isAllowedPathsSecretsResolveCompatError(err);
		try {
			const fallback = await resolveLocally();
			const recoveredLocally = Object.values(fallback.targetStatesByPath).some((state) => state === "resolved_local");
			if (!forcedActiveCompatFailure || recoveredLocally && !fallback.hadUnresolvedTargets) {
				const fallbackMessage = recoveredLocally && !fallback.hadUnresolvedTargets ? "resolved command secrets locally." : "attempted local command-secret resolution.";
				return {
					...fallback,
					diagnostics: normalizeUniqueStringEntries([...fallback.diagnostics, `${params.commandName}: gateway secrets.resolve unavailable (${formatErrorMessage(err)}); ${fallbackMessage}`])
				};
			}
		} catch {}
		if (forcedActiveCompatFailure) throw new Error(`${params.commandName}: active gateway does not support command-scoped secret resolution (${formatErrorMessage(err)}). Update the gateway or run this command where the configured SecretRefs can be resolved locally.`, { cause: err });
		if (isUnsupportedSecretsResolveError(err)) throw new Error(`${params.commandName}: active gateway does not support secrets.resolve (${formatErrorMessage(err)}). Update the gateway or run without SecretRefs.`, { cause: err });
		throw new Error(`${params.commandName}: failed to resolve secrets from the active gateway snapshot (${formatErrorMessage(err)}). Local resolution also failed. Check the configured secret sources and gateway access, then retry.`, { cause: err });
	}
	const parsed = parseGatewaySecretsResolveResult(payload);
	const gatewayDiagnostics = filterAllowedGatewayDiagnostics({
		allowedPaths: params.allowedPaths,
		forcedActivePaths: params.forcedActivePaths,
		optionalActivePaths: params.optionalActivePaths,
		diagnostics: parsed.diagnostics
	});
	const gatewayInactiveRefPaths = params.allowedPaths ? parsed.inactiveRefPaths.filter((path) => params.allowedPaths?.has(path)) : parsed.inactiveRefPaths;
	const resolvedConfig = cloneConfigWithResolutionFacts(params.config);
	const resolvedAssignmentPaths = [];
	for (const { pathSegments, value } of parsed.assignments) {
		if (pathSegments.length === 0) continue;
		const path = formatConcreteConfigPath(pathSegments, resolvedConfig);
		if (params.allowedPaths && !params.allowedPaths.has(path)) continue;
		try {
			setPathExistingStrict(resolvedConfig, pathSegments, value);
			resolvedAssignmentPaths.push(path);
		} catch (err) {
			throw new Error(`${params.commandName}: failed to apply resolved secret assignment at ${path} (${formatErrorMessage(err)}).`, { cause: err });
		}
	}
	copyConfigResolutionFactsExcept(resolvedConfig, resolvedConfig, resolvedAssignmentPaths);
	const inactiveRefPaths = new Set(gatewayInactiveRefPaths.length > 0 ? gatewayInactiveRefPaths : gatewayDiagnostics.flatMap((diagnostic) => {
		const path = inactiveSurfaceDiagnosticPath(diagnostic);
		return path ? [path] : [];
	}));
	for (const path of params.forcedActivePaths ?? []) inactiveRefPaths.delete(path);
	for (const path of params.optionalActivePaths ?? []) inactiveRefPaths.delete(path);
	const analyzed = analyzeCommandSecretTargets({
		sourceConfig: params.config,
		resolvedConfig,
		targetIds: params.targetIds,
		inactiveRefPaths,
		allowedPaths: params.allowedPaths,
		optionalActivePaths: params.optionalActivePaths
	});
	let diagnostics = normalizeUniqueStringEntries(gatewayDiagnostics);
	const targetStatesByPath = buildTargetStatesByPath({
		analyzed,
		resolvedState: "resolved_gateway"
	});
	if (analyzed.unresolved.length > 0) try {
		const localFallback = await resolveLocally(new Set(analyzed.unresolved.map((entry) => entry.path)), []);
		const handledPaths = /* @__PURE__ */ new Set();
		const locallyResolvedPaths = /* @__PURE__ */ new Set();
		for (const unresolved of analyzed.unresolved) {
			const localState = localFallback.targetStatesByPath[unresolved.path];
			if (localState === "inactive_surface") {
				targetStatesByPath[unresolved.path] = localState;
				handledPaths.add(unresolved.path);
				continue;
			}
			if (localState !== "resolved_local") continue;
			setPathExistingStrict(resolvedConfig, unresolved.pathSegments, getPath(localFallback.resolvedConfig, unresolved.pathSegments));
			targetStatesByPath[unresolved.path] = localState;
			handledPaths.add(unresolved.path);
			locallyResolvedPaths.add(unresolved.path);
		}
		copyConfigResolutionFactsExcept(resolvedConfig, resolvedConfig, [...locallyResolvedPaths]);
		diagnostics = normalizeUniqueStringEntries([...diagnostics, ...localFallback.diagnostics]);
		const stillUnresolved = analyzed.unresolved.filter((entry) => !handledPaths.has(entry.path));
		if (stillUnresolved.length > 0) {
			if (mode === "enforce_resolved") throw new Error(`${params.commandName}: ${stillUnresolved[0]?.path ?? "target"} is unresolved in the active runtime snapshot.`);
			if (resolutionPolicy.scrubUnresolvedSecretRefs) scrubUnresolvedAssignments(resolvedConfig, stillUnresolved);
			diagnostics = normalizeUniqueStringEntries([...diagnostics, ...buildUnresolvedDiagnostics(params.commandName, stillUnresolved)]);
			for (const unresolved of stillUnresolved) targetStatesByPath[unresolved.path] = "unresolved";
		} else if (locallyResolvedPaths.size > 0) diagnostics = normalizeUniqueStringEntries([...diagnostics, `${params.commandName}: resolved ${locallyResolvedPaths.size} secret ${locallyResolvedPaths.size === 1 ? "path" : "paths"} locally after the gateway snapshot was incomplete.`]);
	} catch (error) {
		if (mode === "enforce_resolved") throw error;
		if (resolutionPolicy.scrubUnresolvedSecretRefs) scrubUnresolvedAssignments(resolvedConfig, analyzed.unresolved);
		diagnostics = normalizeUniqueStringEntries([
			...diagnostics,
			`${params.commandName}: local fallback after incomplete gateway snapshot failed (${formatErrorMessage(error)}).`,
			...buildUnresolvedDiagnostics(params.commandName, analyzed.unresolved)
		]);
	}
	return {
		resolvedConfig,
		diagnostics,
		targetStatesByPath,
		hadUnresolvedTargets: Object.values(targetStatesByPath).includes("unresolved")
	};
}
//#endregion
export { resolveCommandSecretRefsViaGateway as t };
