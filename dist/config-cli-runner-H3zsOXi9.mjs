import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as writeRuntimeJson, t as ExitError } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-maXyqxro.mjs";
import { B as AUTO_MANAGED_CONFIG_META_PATHS } from "./io.snapshot-BXuGbHpS.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { k as readAgentRosterProperty } from "./agent-scope-config-IQKOEtZ4.mjs";
import { p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { o as toDotPath } from "./dot-path-BSC76DAI.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as parseLegacyAgentRoster } from "./legacy.roster-zIYbDm7V.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
import { c as resolveManagedUnsetPathsForWrite, n as getDeferredPluginMigrationConfigFacts } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { t as coerceConfig } from "./io.read-helpers-N26RjV2V.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { n as info, t as danger } from "./globals-QODkv80i.mjs";
import { t as REDACTED_SENTINEL } from "./redact-sentinel-f_PhnHTI.mjs";
import { r as restoreRedactedValues } from "./redact-snapshot-uX3ICFnt.mjs";
import { n as prepareConfigWriteValues } from "./io.write-prepare-xbITFBQs.mjs";
import { n as visitConfigValueTree } from "./value-tree-D8NwsREA.mjs";
import { r as replaceConfigFile } from "./mutate-CDIHLSip.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-q1wYjpRM.mjs";
import { c as setAtPath, i as getAtPath, l as unsetAtPath, n as formatConfigSetPath, o as mergeAtPath, r as formatConfigUnsetMissingPathMessage, t as assertNonDestructiveReplacement } from "./config-cli-path-BmFvm17U.mjs";
import { r as readBestEffortRuntimeConfigSchema } from "./runtime-schema-CMVIi63f.mjs";
import { i as formatPluginInstallConfigSetError } from "./config-cli-input-CoVOYyoy.mjs";
import { t as prepareConfigWriteTopology } from "./io.write-topology-Cmb9jFq4.mjs";
import { o as diffConfigPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-CGQS_zJR.mjs";
import { t as normalizeSubmittedConfigModelRefs } from "./model-input-normalization-bO0bV4m6.mjs";
import { a as loadValidConfigForWrite, o as validateConfigMutation, t as assertStrictConfigForMutation } from "./config-cli-validation-BGHRLbtY.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cli/config-cli-model-normalization.ts
function normalizeConfigMutationModelRefs(cfg) {
	const pluginMetadata = loadPluginMetadataSnapshot({
		config: cfg,
		env: process.env
	});
	return normalizeSubmittedConfigModelRefs(cfg, pluginMetadata.owners.modelIdNormalizationPolicies);
}
function normalizeConfigMutationExplicitSetPath(path) {
	const modelKeyIndex = path[0] === "agents" && path[1] === "defaults" && path[2] === "models" ? 3 : path[0] === "agents" && (path[1] === "entries" || path[1] === "list") && path[3] === "models" ? 4 : void 0;
	if (modelKeyIndex !== void 0 && path.length > modelKeyIndex) {
		const modelId = expectDefined(path[modelKeyIndex], `path entry at ${modelKeyIndex}`);
		const normalizedModelId = normalizeAgentModelRefForConfig(modelId);
		return normalizedModelId === modelId ? path : [
			...path.slice(0, modelKeyIndex),
			normalizedModelId,
			...path.slice(modelKeyIndex + 1)
		];
	}
	return path;
}
//#endregion
//#region src/cli/config-cli-roster.ts
/** Keeps the documented list input and keyed input on one mutable roster. */
var ConfigMutationAgentRoster = class {
	constructor(root, sourceConfigBeforeMigrations) {
		this.root = root;
		const sourceRoster = readAgentRosterProperty(sourceConfigBeforeMigrations);
		this.legacyOrder = sourceRoster?.kind === "list" ? parseLegacyAgentRoster(sourceRoster.value)?.order : void 0;
	}
	prepare(operation, merge) {
		const path = operation.setPath;
		if (path[0] !== "agents") return;
		if (path.length === 1 && isRecord(operation.value) && Object.hasOwn(operation.value, "list") && Object.hasOwn(operation.value, "entries")) throw new Error("Set either agents.list or agents.entries in one value, not both.");
		const submittedRoster = path.length === 1 ? readAgentRosterProperty({ agents: operation.value }) : void 0;
		const kind = path.length === 1 ? submittedRoster?.kind : path[1];
		const roster = readAgentRosterProperty(this.root);
		if (!roster) this.legacyOrder = void 0;
		const agents = this.root.agents;
		if (kind !== "list" && kind !== "entries" || !isRecord(agents)) return;
		if (path.length <= 2 && !merge && (kind === "entries" || operation.mutation !== "delete")) {
			delete agents[kind === "entries" ? "list" : "entries"];
			this.legacyOrder = void 0;
			return;
		}
		if (kind === "entries") {
			if (roster?.kind === "list") this.canonicalize(true);
			return;
		}
		if (roster?.kind !== "entries") return;
		if (!isRecord(roster.value) || Object.values(roster.value).some((entry) => !isRecord(entry) || Object.hasOwn(entry, "id"))) throw new Error("Cannot address agents.list while agents.entries contains invalid entries; correct the keyed roster first.");
		const entries = roster.value;
		const order = [.../* @__PURE__ */ new Set([...this.legacyOrder ?? [], ...Object.keys(entries)])].filter((id) => Object.hasOwn(entries, id));
		const list = [];
		for (const id of order) list.push({
			...entries[id],
			id
		});
		agents.list = list;
		delete agents.entries;
	}
	writePath(path) {
		if (path[0] !== "agents" || path[1] !== "list") return path;
		if (path.length === 2) {
			const roster = readAgentRosterProperty(this.root);
			return roster?.kind === "list" && parseLegacyAgentRoster(roster.value) ? ["agents", "entries"] : path;
		}
		const entry = getAtPath(this.root, path.slice(0, 3));
		const id = (entry.found ? parseLegacyAgentRoster([entry.value]) : void 0)?.order[0];
		return id === void 0 ? path : [
			"agents",
			"entries",
			id,
			...path.slice(3)
		];
	}
	finish() {
		this.canonicalize(false);
	}
	canonicalize(required) {
		const agents = this.root.agents;
		const roster = readAgentRosterProperty(this.root);
		if (!isRecord(agents) || roster?.kind !== "list") return;
		const parsed = parseLegacyAgentRoster(roster.value);
		if (!parsed) {
			if (required) throw new Error("Cannot address agents.entries while agents.list contains invalid or duplicate ids; correct the list first.");
			return;
		}
		this.legacyOrder = parsed.order;
		agents.entries = parsed.entries;
		delete agents.list;
	}
};
//#endregion
//#region src/cli/config-set-dryrun.ts
var ConfigSetDryRunValidationError = class extends Error {
	constructor(result) {
		super("config set dry-run validation failed");
		this.result = result;
		this.name = "ConfigSetDryRunValidationError";
	}
};
function printConfigDryRunResult(result, runtime, json) {
	if (!result.ok) {
		if (json) throw new ConfigSetDryRunValidationError(result);
		throw new Error(formatDryRunFailureMessage({
			errors: result.errors ?? [],
			skippedExecRefs: result.skippedExecRefs
		}));
	}
	if (json) {
		writeRuntimeJson(runtime, result);
		return;
	}
	if (!result.checks.schema && !result.checks.resolvability) runtime.log(info("Dry run note: value mode does not run schema/resolvability checks. Use --strict-json, builder flags, or batch mode to enable validation checks."));
	if (result.skippedExecRefs > 0) runtime.log(info(formatSkippedExecRefs(result.skippedExecRefs)));
	runtime.log(info(`Dry run successful: ${result.operations} update(s) validated against ${shortenHomePath(result.configPath)}.`));
}
function formatSkippedExecRefs(count) {
	return `Dry run note: skipped ${count} exec SecretRef resolvability check(s). Re-run with --allow-exec to execute exec providers during dry-run.`;
}
function formatDryRunFailureMessage(params) {
	const missingPathErrors = params.errors.filter((error) => error.kind === "missing-path");
	const schemaErrors = params.errors.filter((error) => error.kind === "schema");
	const resolveErrors = params.errors.filter((error) => error.kind === "resolvability");
	const modelErrors = params.errors.filter((error) => error.kind === "model");
	const lines = missingPathErrors.map((error) => error.message);
	if (schemaErrors.length > 0) lines.push("Dry run failed: config schema validation failed.", ...schemaErrors.map((error) => `- ${error.message}`));
	if (resolveErrors.length > 0) {
		lines.push(`Dry run failed: ${resolveErrors.length} SecretRef assignment(s) could not be resolved.`, ...resolveErrors.slice(0, 5).map((error) => `- ${error.ref ?? "<unknown-ref>"} -> ${error.message}`));
		if (resolveErrors.length > 5) lines.push(`- ... ${resolveErrors.length - 5} more`);
	}
	if (modelErrors.length > 0) lines.push("Dry run failed: model reference validation failed.", ...modelErrors.map((error) => `- ${error.message}`));
	if (params.skippedExecRefs > 0) lines.push(formatSkippedExecRefs(params.skippedExecRefs));
	return lines.join("\n");
}
//#endregion
//#region src/cli/config-cli-runner.ts
const GATEWAY_AUTH_MODE_PATH = [
	"gateway",
	"auth",
	"mode"
];
const PLUGIN_INSTALL_RECORD_PATH_PREFIX = ["plugins", "installs"];
function pathStartsWith(path, prefix) {
	return prefix.every((segment, index) => path[index] === segment);
}
function pathEquals(path, expected) {
	return path.length === expected.length && path.every((segment, index) => segment === expected[index]);
}
function remapSuppliedPathsAfterDelete(paths, deletedPath, arrayIndex) {
	const parent = deletedPath.slice(0, -1);
	return paths.flatMap((path) => {
		if (pathStartsWith(path, deletedPath)) return [];
		if (arrayIndex === void 0 || path.length <= parent.length || !pathStartsWith(path, parent)) return [path];
		const segment = path[parent.length];
		const index = segment === void 0 ? void 0 : parseConfigPathArrayIndex(segment);
		return index !== void 0 && index > arrayIndex ? [[
			...parent,
			String(index - 1),
			...path.slice(parent.length + 1)
		]] : [path];
	});
}
function valueHasAutoManagedChild(value, childPath) {
	let cursor = value;
	for (const segment of childPath) {
		if (!isRecord(cursor)) return false;
		if (!Object.hasOwn(cursor, segment)) return false;
		cursor = cursor[segment];
	}
	return cursor !== void 0;
}
function operationClobbersAncestorChild(operation, managedPath, merge) {
	if (operation.mutation === "delete") return true;
	const childPath = managedPath.slice(operation.requestedPath.length);
	return operation.mutation === "merge" || merge && operation.mutation !== "replace" ? valueHasAutoManagedChild(operation.value, childPath) : true;
}
function findAutoManagedMetaTargets(operations, merge) {
	const matches = [];
	const seen = /* @__PURE__ */ new Set();
	const record = (path) => {
		const key = toDotPath(path);
		if (!seen.has(key)) {
			seen.add(key);
			matches.push([...path]);
		}
	};
	for (const operation of operations) {
		if (AUTO_MANAGED_CONFIG_META_PATHS.some((path) => pathStartsWith(operation.requestedPath, path))) {
			record(operation.requestedPath);
			continue;
		}
		for (const managedPath of AUTO_MANAGED_CONFIG_META_PATHS) if (operation.requestedPath.length < managedPath.length && pathStartsWith(managedPath, operation.requestedPath) && operationClobbersAncestorChild(operation, managedPath, merge)) record(managedPath);
	}
	return matches;
}
function formatAutoManagedMetaError(paths) {
	const targets = paths.map(toDotPath);
	return [
		`${targets.length === 1 ? targets[0] : targets.join(", ")} is auto-managed by OpenClaw and cannot be edited; the value would be overwritten on the next config write.`,
		"",
		"These fields are stamped on every config write to record the OpenClaw version and timestamp that produced the file."
	].join("\n");
}
function pruneInactiveGatewayAuthCredentials(params) {
	const touchedMode = params.operations.some(({ requestedPath }) => pathEquals(requestedPath, GATEWAY_AUTH_MODE_PATH));
	const gateway = params.root.gateway;
	if (!touchedMode || !isRecord(gateway)) return [];
	const auth = gateway.auth;
	if (!isRecord(auth)) return [];
	const mode = typeof auth.mode === "string" ? auth.mode.trim() : "";
	const removedPaths = [];
	const remove = (key) => {
		if (Object.hasOwn(auth, key)) {
			delete auth[key];
			removedPaths.push(`gateway.auth.${key}`);
		}
	};
	if (mode === "token") remove("password");
	else if (mode === "password") remove("token");
	else if (mode === "trusted-proxy") {
		remove("token");
		remove("password");
	}
	return removedPaths;
}
function collectChangedLeafPaths(value, prefix) {
	if (!isRecord(value)) return [prefix];
	const entries = Object.entries(value);
	return entries.length === 0 ? [prefix] : entries.flatMap(([key, child]) => collectChangedLeafPaths(child, prefix ? `${prefix}.${key}` : key));
}
function expandActualChangedPaths(actualPaths, requestedPaths, before, after) {
	const expanded = /* @__PURE__ */ new Set();
	for (const actualPath of actualPaths) {
		const descendants = requestedPaths.filter((requested) => requested !== actualPath && requested.startsWith(`${actualPath}.`));
		if (descendants.length > 0) {
			descendants.forEach((path) => expanded.add(path));
			continue;
		}
		const path = actualPath === "<root>" ? [] : actualPath.split(".");
		const beforeValue = getAtPath(before, path);
		const afterValue = getAtPath(after, path);
		const changedValue = beforeValue.found && !afterValue.found ? beforeValue : afterValue;
		(beforeValue.found !== afterValue.found ? collectChangedLeafPaths(changedValue.value, actualPath) : [actualPath]).forEach((entry) => expanded.add(entry));
	}
	return [...expanded];
}
function configApplyHintForOperations(operations, beforeConfig, afterConfig) {
	const requestedPaths = operations.map(({ requestedPath }) => toDotPath(requestedPath));
	const paths = expandActualChangedPaths(diffConfigPaths(beforeConfig, afterConfig), requestedPaths, beforeConfig, afterConfig);
	if (paths.length === 0) return "No gateway restart needed.";
	const plan = buildGatewayReloadPlan(paths, { candidateConfig: afterConfig });
	if (plan.restartGateway || plan.hotReasons.length > 0 && resolveGatewayReloadSettings(afterConfig).mode === "off") return "Restart the gateway to apply.";
	return plan.hotReasons.length > 0 ? "Change will apply without restarting the gateway." : "No gateway restart needed.";
}
async function loadMutationSchema() {
	try {
		return await readBestEffortRuntimeConfigSchema();
	} catch {
		return;
	}
}
function assertConfigSetCurrentExpectation(params) {
	const current = getAtPath(params.authoredConfig, params.operation.setPath);
	if (!(params.expectation.kind === "absent" ? !current.found : current.found && isDeepStrictEqual(current.value, params.expectation.value))) throw new ConfigMutationConflictError("conditional config set expectation did not match the authored config", { retryable: false });
}
function assertConfigSetCurrentExpectationPath(params) {
	if (!pathEquals(params.operation.requestedPath, params.writePath)) throw new Error("conditional config set requires a direct, non-redirected config path");
}
async function runConfigOperations(params) {
	const { runtime, operations, options } = params;
	if (operations.some(({ requestedPath }) => pathStartsWith(requestedPath, PLUGIN_INSTALL_RECORD_PATH_PREFIX))) throw new Error(formatPluginInstallConfigSetError());
	const autoManagedTargets = findAutoManagedMetaTargets(operations, options.merge);
	if (autoManagedTargets.length > 0) throw new Error(formatAutoManagedMetaError(autoManagedTargets));
	const mutationStart = await loadValidConfigForWrite(runtime);
	const { snapshot } = mutationStart;
	const currentExpectation = params.currentExpectation;
	let assertCurrentExpectation;
	if (currentExpectation) {
		const expectationOperation = operations[0];
		if (!expectationOperation) throw new Error("conditional config set requires one resolved operation");
		assertCurrentExpectation = () => {
			assertConfigSetCurrentExpectation({
				authoredConfig: snapshot.resolved,
				operation: expectationOperation,
				expectation: currentExpectation
			});
		};
	}
	const next = structuredClone(snapshot.resolved);
	const currentConfig = normalizeConfigMutationModelRefs(snapshot.resolved);
	const mutationSchema = await loadMutationSchema();
	const roster = new ConfigMutationAgentRoster(next, snapshot.sourceConfigBeforeMigrations);
	let unsetPaths = [];
	let explicitSetPaths = [];
	let suppliedValuePaths = [];
	const appliedOperations = [];
	const recordOperation = (operation) => {
		const writePath = roster.writePath(operation.setPath);
		const setPath = normalizeConfigMutationExplicitSetPath(operation.setPath[1] === "list" && writePath[1] === "entries" && writePath.length === 4 && writePath[3] === "id" ? writePath.slice(0, 3) : writePath);
		appliedOperations.push({
			...operation,
			setPath
		});
		return writePath;
	};
	for (const operation of operations) {
		const merge = operation.mutation === "merge" || options.merge && operation.mutation !== "replace";
		roster.prepare(operation, Boolean(merge));
		if (currentExpectation) assertConfigSetCurrentExpectationPath({
			operation,
			writePath: roster.writePath(operation.setPath)
		});
		if (operation.mutation === "delete") {
			const writePath = recordOperation(operation);
			const deletesCanonicalAgent = operation.setPath.length === 3 && operation.setPath[0] === "agents" && operation.setPath[1] === "list" && writePath[1] === "entries";
			const deletedSegment = operation.setPath.at(-1);
			const unsetResult = unsetAtPath(next, operation.setPath);
			if (!unsetResult.removed && operation.inputMode === "unset") {
				const requestedPath = formatConfigSetPath(operation.requestedPath, operation.pathTokens);
				const runtimeOnly = getAtPath(snapshot.runtimeConfig, operation.setPath).found;
				const message = formatConfigUnsetMissingPathMessage({
					path: requestedPath,
					runtimeOnly
				});
				if (options.dryRun && options.json) throw new ConfigSetDryRunValidationError({
					ok: false,
					operations: 1,
					configPath: snapshot.path,
					inputModes: ["unset"],
					checks: {
						schema: false,
						resolvability: false,
						resolvabilityComplete: false
					},
					refsChecked: 0,
					skippedExecRefs: 0,
					errors: [{
						kind: "missing-path",
						message: runtimeOnly ? message : `Config path not found: ${requestedPath}. Nothing was changed.`
					}]
				});
				if (!options.dryRun) assertStrictConfigForMutation(currentConfig, mutationStart.writeOptions.basePluginMetadataSnapshot, getDeferredPluginMigrationConfigFacts(snapshot.sourceConfig));
				throw new Error(message);
			}
			if (!unsetResult.removed || unsetResult.leafContainer !== "array") unsetPaths.push(writePath);
			if (unsetResult.removed) {
				const arrayIndex = unsetResult.leafContainer === "array" && !deletesCanonicalAgent && deletedSegment !== void 0 ? parseConfigPathArrayIndex(deletedSegment) : void 0;
				suppliedValuePaths = remapSuppliedPathsAfterDelete(suppliedValuePaths, writePath, arrayIndex);
				explicitSetPaths = remapSuppliedPathsAfterDelete(explicitSetPaths, writePath, arrayIndex);
				for (const applied of appliedOperations) {
					const [survivingPath] = remapSuppliedPathsAfterDelete([applied.setPath], writePath, arrayIndex);
					if (survivingPath) applied.setPath = survivingPath;
				}
			}
			continue;
		}
		const pathOptions = {
			numericObjectKeys: params.successMode === "patch",
			pathTokens: operation.pathTokens,
			quotedNumericSegments: operation.quotedNumericSegments,
			schema: mutationSchema?.schema
		};
		let suppliedPaths;
		if (merge) suppliedPaths = mergeAtPath(next, operation.setPath, operation.value, pathOptions);
		else {
			assertNonDestructiveReplacement({
				root: next,
				path: operation.setPath,
				value: operation.value,
				allowReplace: options.replace || operation.mutation === "replace"
			});
			setAtPath(next, operation.setPath, operation.value, pathOptions);
			suppliedPaths = [operation.setPath];
		}
		suppliedValuePaths.push(...suppliedPaths.map((path) => roster.writePath(path)));
		explicitSetPaths.push(recordOperation(operation));
	}
	roster.finish();
	unsetPaths = unsetPaths.filter((path) => !getAtPath(next, path).found);
	const removedGatewayAuthPaths = pruneInactiveGatewayAuthCredentials({
		root: next,
		operations
	});
	let hasRedactedValues = false;
	visitConfigValueTree(next, (candidate) => {
		hasRedactedValues ||= candidate === REDACTED_SENTINEL;
		return !hasRedactedValues;
	});
	let nextConfig = coerceConfig(next);
	if (hasRedactedValues) {
		const restored = restoreRedactedValues(next, snapshot.resolved, mutationSchema?.uiHints);
		if (!restored.ok) throw new Error(restored.humanReadableMessage ?? "Cannot restore redacted config values.");
		nextConfig = coerceConfig(restored.result);
	}
	nextConfig = normalizeConfigMutationModelRefs(nextConfig);
	const normalizedExplicitSetPaths = explicitSetPaths.map(normalizeConfigMutationExplicitSetPath);
	const resolutionEnv = mutationStart.writeOptions.envSnapshotForRestore ?? process.env;
	const preparedValues = prepareConfigWriteValues({
		snapshot,
		nextConfig,
		explicitSetPaths: suppliedValuePaths.map(normalizeConfigMutationExplicitSetPath),
		env: resolutionEnv
	});
	const authoredNextConfig = preparedValues.authoredConfig;
	const preparedPreviousValues = prepareConfigWriteValues({
		snapshot,
		nextConfig: currentConfig,
		env: resolutionEnv
	});
	const authoredPreviousConfig = preparedPreviousValues.authoredConfig;
	let modelValidation = {
		config: authoredNextConfig,
		previousConfig: authoredPreviousConfig,
		env: preparedValues.resolutionEnv,
		previousEnv: preparedPreviousValues.resolutionEnv
	};
	if (options.dryRun) {
		const topology = prepareConfigWriteTopology({
			snapshot,
			pluginMetadataSnapshot: mutationStart.writeOptions.basePluginMetadataSnapshot,
			nextConfig: authoredNextConfig,
			options: { explicitSetPaths: normalizedExplicitSetPaths },
			unsetPaths: resolveManagedUnsetPathsForWrite(unsetPaths),
			env: resolutionEnv
		});
		nextConfig = topology.nextConfig;
		modelValidation = {
			config: topology.authoredConfig,
			previousConfig: authoredPreviousConfig,
			env: topology.resolutionEnv,
			previousEnv: preparedPreviousValues.resolutionEnv
		};
	}
	const validation = await validateConfigMutation({
		config: nextConfig,
		modelValidation,
		previousConfig: currentConfig,
		operations: appliedOperations,
		options,
		configPath: snapshot.path,
		unchanged: params.successMode === "set" && isDeepStrictEqual(currentConfig, nextConfig) && isDeepStrictEqual(authoredPreviousConfig, authoredNextConfig),
		pluginMetadataSnapshot: mutationStart.writeOptions.basePluginMetadataSnapshot,
		deferredPluginMigrations: getDeferredPluginMigrationConfigFacts(snapshot.sourceConfig)
	});
	if (validation.kind === "dry-run") {
		printConfigDryRunResult(validation.result, runtime, options.json);
		return;
	}
	if (validation.kind === "unchanged") {
		assertCurrentExpectation?.();
		runtime.log(info("No change"));
		return;
	}
	await replaceConfigFile({
		sourceConfig: authoredNextConfig,
		snapshot,
		...snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {},
		writeOptions: {
			...mutationStart.writeOptions,
			auditOrigin: "cli",
			...assertCurrentExpectation || params.beforePersistentApply ? { assertConfigPathForWrite: () => {
				mutationStart.writeOptions.assertConfigPathForWrite?.();
				assertCurrentExpectation?.();
				params.beforePersistentApply?.();
			} } : {},
			...unsetPaths.length > 0 ? { unsetPaths } : {},
			...normalizedExplicitSetPaths.length > 0 ? { explicitSetPaths: normalizedExplicitSetPaths } : {}
		}
	});
	if (removedGatewayAuthPaths.length > 0) runtime.log(info(`Removed inactive ${removedGatewayAuthPaths.join(", ")} for gateway.auth.mode=${nextConfig.gateway?.auth?.mode ?? "<unset>"}.`));
	const hint = configApplyHintForOperations(operations, currentConfig, nextConfig);
	if (params.successMode === "set" && operations.length === 1) {
		const operation = operations[0];
		const action = operation?.mutation === "delete" ? "Removed" : "Updated";
		const requestedPath = formatConfigSetPath(operation?.requestedPath ?? [], operation?.pathTokens, nextConfig);
		runtime.log(info(`${action} ${requestedPath}. ${hint}`));
	} else if (params.successMode === "set") runtime.log(info(`Updated ${operations.length} config paths. ${hint}`));
	else runtime.log(info(`Applied ${operations.length} config update(s). ${hint}`));
}
function handleConfigMutationError(params) {
	if (params.err instanceof ExitError) throw params.err;
	const isConflict = params.err instanceof ConfigMutationConflictError;
	const detail = formatErrorMessage(params.err);
	const message = isConflict ? `The config file changed while this command was writing (${detail}), so nothing was changed. Re-run the same command to pick up the new file and try again.` : detail;
	if (params.options.dryRun && params.options.json) {
		if (params.err instanceof ConfigSetDryRunValidationError) {
			writeRuntimeJson(params.runtime, params.err.result);
			exitCliAfterOutput(params.runtime, 1);
		}
		const result = {
			ok: false,
			operations: 0,
			configPath: resolveConfigPath(),
			inputModes: [],
			checks: {
				schema: false,
				resolvability: false,
				resolvabilityComplete: false
			},
			refsChecked: 0,
			skippedExecRefs: 0,
			errors: [{
				kind: isConflict ? "conflict" : "schema",
				message
			}]
		};
		writeRuntimeJson(params.runtime, result);
		params.runtime.error(danger(message));
		exitCliAfterOutput(params.runtime, 1);
	}
	params.runtime.error(danger(message));
	exitCliAfterOutput(params.runtime, 1);
}
//#endregion
export { handleConfigMutationError, runConfigOperations };
