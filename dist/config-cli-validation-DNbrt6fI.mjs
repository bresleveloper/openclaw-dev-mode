import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { b as uniqueValues } from "./string-normalization-CECOqf64.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import { a as isConfigReadFailure, t as configFailureHeading } from "./io.invalid-config-BzeD3bi5.mjs";
import { _ as secretRefKey, c as isSecretRef, o as formatExecSecretRefIdValidationMessage, u as isValidExecSecretRefId } from "./ref-contract-D0kWy5jy.mjs";
import { a as coerceSecretRef, g as resolveSecretInputRef } from "./types.secrets-DsPRn9Dz.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-CSOrFNcy.mjs";
import { i as collectUnsupportedSecretRefPolicyIssues } from "./validation-core-DxMw-ato.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { t as assertDeferredPluginMigrationConfigEditAllowed } from "./deferred-plugin-migration-config-Db8uALnk.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { n as validateConfigObjectRawWithPlugins } from "./validation-R7HXbC_L.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-f56MMhmb.mjs";
import "./target-registry-1a6D8fYt.mjs";
import { r as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-CgbblNbu.mjs";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-CPntde4x.mjs";
import { n as visitConfigValueTree } from "./value-tree-3oLf9xok.mjs";
import "./config-CzeZu5J_.mjs";
import { i as assertSecureExecCommandPath, r as resolveSecretProviderIntegrationConfig, t as isPluginIntegrationSecretProviderConfig } from "./provider-integrations-CoL46KV7.mjs";
import { i as getAtPath } from "./config-cli-path-Dh9BCpH3.mjs";
import { n as formatPluginPackagingRuntimeOutputRecoveryHint } from "./config-recovery-hints-BcovfhC8.mjs";
import { t as renderConfigValidationIssueLines } from "./issue-location-nU8-G0tV.mjs";
import { t as writeInvalidConfigCliJson } from "./config-validation-output-DqPBFLqP.mjs";
//#region src/cli/config-cli-validation.ts
function formatInvalidConfigRepairHint(snapshot, doctorMessage) {
	return isConfigReadFailure(snapshot) ? "Resolve the read error shown above, then retry." : isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? formatPluginPackagingRuntimeOutputRecoveryHint() : `Run \`${formatCliCommand("openclaw doctor --fix")}\` ${doctorMessage}`;
}
function ensureValidConfigSnapshotForCli(snapshot, runtime, options = {}) {
	if (snapshot.valid) return;
	if (options.json) {
		writeInvalidConfigCliJson(runtime, snapshot);
		exitCliAfterOutput(runtime, 1);
	}
	runtime.error(`${configFailureHeading(snapshot)}: ${shortenHomePath(snapshot.path)}`);
	for (const line of renderConfigValidationIssueLines(snapshot)) runtime.error(line);
	runtime.error(formatInvalidConfigRepairHint(snapshot, "to repair, then retry."));
	exitCliAfterOutput(runtime, 1);
}
async function loadValidConfigForWrite(runtime = defaultRuntime) {
	const prepared = await readConfigFileSnapshotForWrite();
	ensureValidConfigSnapshotForCli(prepared.snapshot, runtime);
	return prepared;
}
async function finishConfigValidationForCli(read) {
	const { snapshot, strictIssues } = read;
	if (!snapshot.valid || !snapshot.exists) return snapshot;
	if (!strictIssues) throw new Error("Config validation requires its prepared source result.");
	const issues = strictIssues.length === 0 ? await collectConfigSecretProviderErrors({ config: snapshot.runtimeConfig }) : strictIssues;
	return issues.length === 0 ? snapshot : {
		...snapshot,
		valid: false,
		issues
	};
}
function pathContains(parent, child) {
	return parent.length <= child.length && parent.every((part, index) => part === child[index]);
}
function selectConfigMutationSecrets(config, operations) {
	const paths = operations.map(({ setPath }) => setPath);
	const changedProviders = /* @__PURE__ */ new Set();
	const changedDefaults = /* @__PURE__ */ new Set();
	let allProviders = false;
	for (const path of paths) {
		if (path[0] !== "secrets") continue;
		if (path.length === 1 || path[1] === "providers") {
			const alias = path[2];
			if (alias === void 0) allProviders = true;
			else changedProviders.add(alias);
		}
		if (path.length === 1 || path[1] === "defaults") changedDefaults.add(path[2] ?? "*");
	}
	const refsByKey = /* @__PURE__ */ new Map();
	const record = (ref) => refsByKey.set(secretRefKey(ref), ref);
	const defaults = config.secrets?.defaults;
	const ownedPaths = [];
	const overlaps = (targetPath) => paths.some((path) => pathContains(path, targetPath) || pathContains(targetPath, path));
	for (const target of discoverConfigSecretTargets(config)) {
		ownedPaths.push(target.pathSegments);
		if (target.refPathSegments) ownedPaths.push(target.refPathSegments);
		const { explicitRef, ref } = resolveSecretInputRef({
			value: target.value,
			refValue: target.refValue,
			defaults
		});
		if (!ref) continue;
		const usesDefault = !isSecretRef(explicitRef ? target.refValue : target.value);
		if (allProviders || changedProviders.has(ref.provider) || overlaps(target.pathSegments) || target.refPathSegments && overlaps(target.refPathSegments) || usesDefault && (changedDefaults.has("*") || changedDefaults.has(ref.source))) record(ref);
	}
	for (const rootPath of paths) visitConfigValueTree(getAtPath(config, rootPath).value, (candidate, path) => {
		if (ownedPaths.some((ownedPath) => pathContains(ownedPath, path))) return false;
		const ref = coerceSecretRef(candidate, defaults);
		if (ref) {
			record(ref);
			return false;
		}
		return true;
	}, rootPath);
	const refs = [...refsByKey.values()];
	return {
		refs,
		providerAliases: allProviders ? void 0 : /* @__PURE__ */ new Set([...changedProviders, ...refs.map((ref) => ref.provider)])
	};
}
async function collectDryRunResolvabilityErrors(params) {
	const { resolveSecretRefValue } = await import("./resolve-DEBHb_eE.mjs");
	const failures = [];
	for (const ref of params.refs) try {
		await resolveSecretRefValue(ref, {
			config: params.config,
			env: process.env
		});
	} catch (err) {
		failures.push({
			kind: "resolvability",
			message: formatErrorMessage(err),
			ref: `${ref.source}:${ref.provider}:${ref.id}`
		});
	}
	return failures;
}
function collectDryRunStaticErrorsForSkippedExecRefs(params) {
	return params.refs.flatMap((ref) => {
		const id = ref.id.trim();
		const refLabel = `${ref.source}:${ref.provider}:${id}`;
		let message;
		if (!id) message = "Error: Secret reference id is empty.";
		else if (!isValidExecSecretRefId(id)) message = `Error: ${formatExecSecretRefIdValidationMessage()} (ref: ${refLabel}).`;
		else {
			const providerConfig = params.config.secrets?.providers?.[ref.provider];
			if (!providerConfig) message = `Error: Secret provider "${ref.provider}" is not configured (ref: ${refLabel}).`;
			else if (providerConfig.source !== ref.source) message = `Error: Secret provider "${ref.provider}" has source "${providerConfig.source}" but ref requests "${ref.source}".`;
		}
		return message ? [{
			kind: "resolvability",
			message,
			ref: refLabel
		}] : [];
	});
}
function collectStrictConfigErrors(config, pluginMetadataSnapshot, deferredPluginMigrations) {
	const validated = validateConfigObjectRawWithPlugins(config, {
		semanticValidation: "strict",
		pluginMetadataSnapshot,
		deferredPluginMigrations
	});
	if (validated.ok) return [];
	return formatConfigIssueLines(validated.issues, "-", { normalizeRoot: true }).map((message) => ({
		kind: "schema",
		message
	}));
}
function assertStrictConfigForMutation(config, pluginMetadataSnapshot, deferredPluginMigrations) {
	const errors = collectStrictConfigErrors(config, pluginMetadataSnapshot, deferredPluginMigrations);
	if (errors.length === 0) return;
	throw new Error(["Config validation failed.", ...errors.map((error) => `- ${error.message}`)].join("\n"));
}
async function collectConfigSecretProviderErrors(params) {
	const providers = params.config.secrets?.providers ?? {};
	const issues = [];
	let manifestRegistry;
	for (const [alias, provider] of Object.entries(providers)) {
		if (params.selection?.providerAliases && !params.selection.providerAliases.has(alias)) continue;
		const providerPath = `secrets.providers.${alias}`;
		if (isPluginIntegrationSecretProviderConfig(provider)) {
			if (!params.selection) continue;
			manifestRegistry ??= loadPluginMetadataSnapshot({
				config: params.config,
				env: process.env
			}).manifestRegistry;
			const resolved = resolveSecretProviderIntegrationConfig({
				manifestRegistry,
				providerAlias: alias,
				providerConfig: provider,
				config: params.config,
				env: process.env
			});
			if (!resolved.ok) issues.push({
				path: providerPath,
				message: resolved.reason
			});
		} else if (isRecord(provider) && "command" in provider) try {
			await assertSecureExecCommandPath({
				command: provider.command,
				label: `${providerPath}.command`,
				trustedDirs: provider.trustedDirs
			});
		} catch (err) {
			issues.push({
				path: `${providerPath}.command`,
				message: formatErrorMessage(err)
			});
		}
	}
	return issues;
}
/** Validates one final candidate and decides whether the runner may preview, skip, or write it. */
async function validateConfigMutation(params) {
	const { config, operations, options, pluginMetadataSnapshot } = params;
	assertDeferredPluginMigrationConfigEditAllowed({
		sourceConfig: params.previousConfig,
		nextConfig: config,
		pending: params.deferredPluginMigrations ?? [],
		editedPaths: operations.map((operation) => operation.setPath),
		unsetPaths: operations.filter((operation) => operation.mutation === "delete").map((operation) => operation.setPath)
	});
	const policyIssues = formatConfigIssueLines(collectUnsupportedSecretRefPolicyIssues(config), "", { normalizeRoot: true }).map((line) => line.trim());
	const selection = selectConfigMutationSecrets(config, operations);
	const providerErrors = formatConfigIssueLines(await collectConfigSecretProviderErrors({
		config,
		selection
	}), "").map((message) => ({
		kind: "schema",
		message
	}));
	if (!options.dryRun) {
		if (policyIssues.length > 0) throw new Error([
			"Config policy validation failed: unsupported SecretRef usage was detected.",
			...policyIssues.slice(0, 5).map((issue) => `- ${issue}`),
			...policyIssues.length > 5 ? [`- ... ${policyIssues.length - 5} more`] : []
		].join("\n"));
		if (providerErrors.length > 0) throw new Error(["Config validation failed: SecretRef provider configuration is invalid.", ...providerErrors.map((error) => `- ${error.message}`)].join("\n"));
		if (params.unchanged) {
			assertStrictConfigForMutation(config, pluginMetadataSnapshot, params.deferredPluginMigrations);
			return { kind: "unchanged" };
		}
	}
	const { checkTouchedTextModelRefs } = await import("./config-model-validation-CWnxHno3.mjs");
	const modelCheck = await checkTouchedTextModelRefs({
		...params.modelValidation ?? {
			config,
			previousConfig: params.previousConfig
		},
		touchedPaths: operations.map(({ setPath }) => setPath),
		redactDependencyValues: true
	});
	if (!options.dryRun) {
		if (modelCheck.errors[0]) throw new Error(modelCheck.errors[0]);
		return { kind: "write" };
	}
	const inputModes = uniqueValues(operations.map(({ inputMode }) => inputMode));
	const checksRefs = inputModes.some((mode) => mode !== "value");
	const requiresFullSchema = operations.some((operation) => operation.inputMode === "unset" || (operation.inputMode === "json" || operation.inputMode === "builder") && operation.schemaValidated !== true);
	const refsToResolve = [];
	const skippedExecRefs = [];
	for (const ref of checksRefs ? selection.refs : []) (ref.source === "exec" && !options.allowExec ? skippedExecRefs : refsToResolve).push(ref);
	const errors = modelCheck.errors.map((message) => ({
		kind: "model",
		message
	}));
	if (!requiresFullSchema) errors.push(...policyIssues.map((message) => ({
		kind: "schema",
		message
	})));
	errors.push(...providerErrors);
	if (requiresFullSchema) errors.push(...collectStrictConfigErrors(config, pluginMetadataSnapshot, params.deferredPluginMigrations));
	if (checksRefs) errors.push(...collectDryRunStaticErrorsForSkippedExecRefs({
		refs: skippedExecRefs,
		config
	}), ...await collectDryRunResolvabilityErrors({
		refs: refsToResolve,
		config
	}));
	const failures = dedupeByKey(errors, (error) => error.kind === "resolvability" ? `${error.kind}\u0000${error.ref ?? ""}\u0000${error.message}` : `${error.kind}\u0000${error.message}`);
	return {
		kind: "dry-run",
		result: {
			ok: failures.length === 0,
			operations: operations.length,
			configPath: params.configPath,
			inputModes,
			checks: {
				schema: requiresFullSchema || policyIssues.length > 0 || providerErrors.length > 0,
				resolvability: checksRefs || modelCheck.refsTotal > 0,
				resolvabilityComplete: (checksRefs || modelCheck.refsTotal > 0) && skippedExecRefs.length === 0 && modelCheck.refsChecked === modelCheck.refsTotal
			},
			refsChecked: refsToResolve.length + modelCheck.refsChecked,
			skippedExecRefs: skippedExecRefs.length,
			...failures.length > 0 ? { errors: failures } : {}
		}
	};
}
//#endregion
export { loadValidConfigForWrite as a, formatInvalidConfigRepairHint as i, ensureValidConfigSnapshotForCli as n, validateConfigMutation as o, finishConfigValidationForCli as r, assertStrictConfigForMutation as t };
