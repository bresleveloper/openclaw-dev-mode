import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { b as uniqueValues } from "./string-normalization-_gRhJUDw.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-maXyqxro.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { _ as secretRefKey, c as isSecretRef, o as formatExecSecretRefIdValidationMessage, u as isValidExecSecretRefId } from "./ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef, p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { i as collectUnsupportedSecretRefPolicyIssues } from "./validation-core-DwJVlxTe.mjs";
import { t as assertDeferredPluginMigrationConfigEditAllowed } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { i as normalizeConfigIssues, n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { a as validateConfigObjectRawWithPlugins } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-DciTXKJy.mjs";
import "./target-registry-BD3AtdiE.mjs";
import { r as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-aFpXeB1n.mjs";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-BN-rPaec.mjs";
import { n as visitConfigValueTree } from "./value-tree-D8NwsREA.mjs";
import "./config-Ciq2mxdN.mjs";
import { i as resolveSecretProviderIntegrationConfig, n as isPluginIntegrationSecretProviderConfig, t as assertSecureExecCommandPath } from "./exec-provider-path-validation-7Cc3wazF.mjs";
import { n as formatPluginPackagingRuntimeOutputRecoveryHint } from "./config-recovery-hints-DZUkkFyc.mjs";
import { t as renderConfigValidationIssueLines } from "./issue-location-BWFXViLe.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { i as getAtPath } from "./config-cli-path-BmFvm17U.mjs";
//#region src/cli/config-cli-validation.ts
function formatInvalidConfigRepairHint(snapshot, doctorMessage) {
	return isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? formatPluginPackagingRuntimeOutputRecoveryHint() : `Run \`${formatCliCommand("openclaw doctor --fix")}\` ${doctorMessage}`;
}
function ensureValidConfigSnapshotForCli(snapshot, runtime, options = {}) {
	if (snapshot.valid) return;
	if (options.json) {
		writeRuntimeJson(runtime, {
			...formatCliJsonFailure(`OpenClaw config is invalid: ${shortenHomePath(snapshot.path)}`),
			issues: normalizeConfigIssues(snapshot.issues)
		});
		exitCliAfterOutput(runtime, 1);
	}
	runtime.error(`OpenClaw config is invalid: ${shortenHomePath(snapshot.path)}`);
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
	const visit = (value, rootPath) => {
		visitConfigValueTree(value, (candidate, path) => {
			if (ownedPaths.some((ownedPath) => pathContains(ownedPath, path))) return false;
			const ref = coerceSecretRef(candidate, defaults);
			if (ref) {
				record(ref);
				return false;
			}
			return true;
		}, rootPath);
	};
	for (const path of paths) visit(getAtPath(config, path).value, path);
	const refs = [...refsByKey.values()];
	return {
		refs,
		providerAliases: allProviders ? void 0 : /* @__PURE__ */ new Set([...changedProviders, ...refs.map((ref) => ref.provider)])
	};
}
async function collectDryRunResolvabilityErrors(params) {
	const { resolveSecretRefValue } = await import("./resolve-ClyYroaz.mjs");
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
	const failures = [];
	for (const ref of params.refs) {
		const id = ref.id.trim();
		const refLabel = `${ref.source}:${ref.provider}:${id}`;
		if (!id) {
			failures.push({
				kind: "resolvability",
				message: "Error: Secret reference id is empty.",
				ref: refLabel
			});
			continue;
		}
		if (!isValidExecSecretRefId(id)) {
			failures.push({
				kind: "resolvability",
				message: `Error: ${formatExecSecretRefIdValidationMessage()} (ref: ${refLabel}).`,
				ref: refLabel
			});
			continue;
		}
		const providerConfig = params.config.secrets?.providers?.[ref.provider];
		if (!providerConfig) {
			failures.push({
				kind: "resolvability",
				message: `Error: Secret provider "${ref.provider}" is not configured (ref: ${refLabel}).`,
				ref: refLabel
			});
			continue;
		}
		if (providerConfig.source !== ref.source) failures.push({
			kind: "resolvability",
			message: `Error: Secret provider "${ref.provider}" has source "${providerConfig.source}" but ref requests "${ref.source}".`,
			ref: refLabel
		});
	}
	return failures;
}
function selectDryRunRefsForResolution(params) {
	const refsToResolve = [];
	const skippedExecRefs = [];
	for (const ref of params.refs) (ref.source === "exec" && !params.allowExecInDryRun ? skippedExecRefs : refsToResolve).push(ref);
	return {
		refsToResolve,
		skippedExecRefs
	};
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
function dedupeDryRunErrors(errors) {
	const deduped = [];
	const seen = /* @__PURE__ */ new Set();
	for (const error of errors) {
		const key = error.kind === "resolvability" ? `${error.kind}\u0000${error.ref ?? ""}\u0000${error.message}` : `${error.kind}\u0000${error.message}`;
		if (!seen.has(key)) {
			seen.add(key);
			deduped.push(error);
		}
	}
	return deduped;
}
/** Validates one final candidate and decides whether the runner may preview, skip, or write it. */
async function validateConfigMutation(params) {
	const { config, operations, options, pluginMetadataSnapshot } = params;
	assertDeferredPluginMigrationConfigEditAllowed({
		sourceConfig: params.previousConfig,
		nextConfig: config,
		pending: params.deferredPluginMigrations ?? [],
		editedPaths: operations.map((operation) => operation.setPath)
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
	const { checkTouchedTextModelRefs } = await import("./config-model-validation-9ahigEMf.mjs");
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
	const requiresFullSchema = operations.some((operation) => operation.inputMode === "unset" || operation.inputMode === "json" && operation.schemaValidated !== true);
	const { refsToResolve, skippedExecRefs } = selectDryRunRefsForResolution({
		refs: checksRefs ? selection.refs : [],
		allowExecInDryRun: Boolean(options.allowExec)
	});
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
	const failures = dedupeDryRunErrors(errors);
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
