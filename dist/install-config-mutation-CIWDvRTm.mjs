import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as formatInvalidConfigDetails, r as createInvalidConfigError } from "./io.invalid-config-BzeD3bi5.mjs";
import { c as readConfigIncludeFileWithGuards, l as resolveConfigIncludeWritePath, o as hashConfigIncludeRaw } from "./includes-BkzfmxST.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { n as containsConfigIncludeDirective } from "./io.read-helpers-Bvdjf9tk.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/plugins/install-config-mutation.ts
const CONFIG_MUTATION_ALLOWED = { mode: "allowed" };
function supportsInstallConfigSingleTopLevelIncludeShape(authoredSection) {
	if (!containsConfigIncludeDirective(authoredSection)) return true;
	return isRecord(authoredSection) && Object.keys(authoredSection).length === 1 && typeof authoredSection.$include === "string";
}
function resolveSingleTopLevelIncludePath(parsed, configPath, section) {
	const authoredSection = parsed[section];
	if (!isRecord(authoredSection) || Object.keys(authoredSection).length !== 1 || typeof authoredSection.$include !== "string") return null;
	return path.normalize(path.isAbsolute(authoredSection.$include) ? authoredSection.$include : path.resolve(path.dirname(configPath), authoredSection.$include));
}
function resolveConfigMutationPreflight(params) {
	if (Object.hasOwn(params.parsed, "$include")) return {
		mode: "blocked",
		scope: "config",
		reason: `Config ${params.section} are stored through an unsupported $include shape at the root; edit the included file directly or move ${params.section} into the root config before installing.`
	};
	if (!supportsInstallConfigSingleTopLevelIncludeShape(params.parsed[params.section])) return {
		mode: "blocked",
		scope: params.section,
		reason: `Config ${params.section} are stored through an unsupported $include shape; edit the included file directly or move ${params.section} to a single-file top-level include before installing.`
	};
	const includePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, params.section);
	if (!includePath) return CONFIG_MUTATION_ALLOWED;
	const expectedTarget = params.writeOptions.includeFileTargetsForWrite?.[includePath];
	let resolvedTarget = null;
	try {
		resolvedTarget = resolveConfigIncludeWritePath({
			configPath: params.snapshotPath,
			includePath,
			allowedRoots: []
		});
	} catch {}
	if (expectedTarget && resolvedTarget && path.normalize(expectedTarget) === path.normalize(resolvedTarget)) {
		const expectedHash = params.writeOptions.includeFileHashesForWrite?.[includePath];
		try {
			const raw = readConfigIncludeFileWithGuards({
				includePath,
				resolvedPath: resolvedTarget,
				rootRealDir: fs.realpathSync(path.dirname(params.snapshotPath))
			});
			if (expectedHash !== hashConfigIncludeRaw(raw)) return {
				mode: "blocked",
				scope: params.section,
				reason: `Config ${params.section} include changed since the config was read; rerun the install after reloading the config.`
			};
			if (containsConfigIncludeDirective(parseJsonWithJson5Fallback(raw))) return {
				mode: "blocked",
				scope: params.section,
				reason: `Config ${params.section} are stored through a nested $include; edit the included file directly or remove the nested $include before installing.`
			};
			return CONFIG_MUTATION_ALLOWED;
		} catch {
			return {
				mode: "blocked",
				scope: params.section,
				reason: `Config ${params.section} include could not be inspected at its snapshot target; rerun the install after repairing or reloading the config.`
			};
		}
	}
	return {
		mode: "blocked",
		scope: params.section,
		reason: `Config ${params.section} are stored in an external or unresolved top-level $include; edit the included file directly or move it under the config directory before installing.`
	};
}
function resolveInstallConfigMutationPreflights(params) {
	const pluginMutation = resolveConfigMutationPreflight({
		...params,
		section: "plugins"
	});
	const hookMutation = resolveConfigMutationPreflight({
		...params,
		section: "hooks"
	});
	const pluginIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "plugins");
	const hookIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "hooks");
	const pluginTarget = pluginIncludePath ? params.writeOptions.includeFileTargetsForWrite?.[pluginIncludePath] : void 0;
	const hookTarget = hookIncludePath ? params.writeOptions.includeFileTargetsForWrite?.[hookIncludePath] : void 0;
	if (pluginTarget && hookTarget && path.normalize(pluginTarget) === path.normalize(hookTarget)) {
		const blocked = {
			mode: "blocked",
			scope: "config",
			reason: "Config plugins and hooks share the same top-level $include target; split them into separate include files before installing."
		};
		return {
			hookMutation: blocked,
			pluginMutation: blocked
		};
	}
	return {
		hookMutation,
		pluginMutation
	};
}
function resolveCombinedPluginAndHookConfigMutationPreflight(params) {
	const pluginIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "plugins");
	const hookIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "hooks");
	if (!pluginIncludePath && !hookIncludePath) return CONFIG_MUTATION_ALLOWED;
	return {
		mode: "blocked",
		scope: "config",
		reason: "Config plugins and hooks cannot be updated together while either section uses a top-level $include; update them separately."
	};
}
function selectInstallMutationWriteOptions(writeOptions, beforePersistentApply) {
	return {
		inputBase: "source",
		auditOrigin: "plugin-install",
		assertConfigPathForWrite: beforePersistentApply ? () => {
			writeOptions.assertConfigPathForWrite?.();
			beforePersistentApply();
		} : writeOptions.assertConfigPathForWrite,
		expectedConfigPath: writeOptions.expectedConfigPath,
		ownedConfigPathForWrite: writeOptions.ownedConfigPathForWrite,
		envSnapshotForRestore: writeOptions.envSnapshotForRestore,
		includeFileHashesForWrite: writeOptions.includeFileHashesForWrite,
		includeFileTargetsForWrite: writeOptions.includeFileTargetsForWrite
	};
}
function assertWriteOptionRecordFresh(params) {
	if (!isDeepStrictEqual(params.current ?? {}, params.expected ?? {})) throw new ConfigMutationConflictError(params.message);
}
async function assertRecordsOnlyUpdateConfigFresh(params) {
	const { readConfigFileSnapshotForWrite } = await import("./config/config.js");
	const prepared = await readConfigFileSnapshotForWrite(params.writeOptions);
	const writeOptions = {
		...prepared.writeOptions,
		...params.writeOptions
	};
	const currentHash = prepared.snapshot.hash ?? null;
	writeOptions.assertConfigPathForWrite?.();
	if (writeOptions.expectedConfigPath !== void 0 && writeOptions.expectedConfigPath !== prepared.snapshot.path) throw new ConfigMutationConflictError("config path changed since last load", { retryable: false });
	if (params.baseHash !== void 0 && params.baseHash !== currentHash) throw new ConfigMutationConflictError("config changed since last load");
	assertWriteOptionRecordFresh({
		current: prepared.writeOptions.includeFileTargetsForWrite,
		expected: params.writeOptions?.includeFileTargetsForWrite,
		message: "included config target changed since last load"
	});
	assertWriteOptionRecordFresh({
		current: prepared.writeOptions.includeFileHashesForWrite,
		expected: params.writeOptions?.includeFileHashesForWrite,
		message: "included config changed since last load"
	});
	if (!prepared.snapshot.valid) throw createInvalidConfigError(prepared.snapshot.path, formatInvalidConfigDetails(prepared.snapshot.issues));
}
//#endregion
export { supportsInstallConfigSingleTopLevelIncludeShape as a, selectInstallMutationWriteOptions as i, resolveCombinedPluginAndHookConfigMutationPreflight as n, resolveInstallConfigMutationPreflights as r, assertRecordsOnlyUpdateConfigFresh as t };
