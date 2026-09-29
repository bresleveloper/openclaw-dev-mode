import { U as loggedConfigWarningFingerprints, W as loggedInvalidConfigs, a as readConfigFileSnapshotFromContext, c as readSourceConfigBestEffortFromContext, d as warnOnConfigMiskeys, f as createConfigFileSnapshot, g as recoverConfigFromLastKnownGoodCore, h as promoteConfigSnapshotToLastKnownGoodCore, i as readConfigFileSnapshotForWriteFromContext, l as logConfigWarningsOnce, m as maybeRecoverSuspiciousConfigReadSync, n as prepareConfigRecoveryFromContext, o as readConfigFileSnapshotInternal, p as maybeRecoverSuspiciousConfigRead, r as readBestEffortConfigSnapshotFromContext, s as readConfigFileSnapshotWithPluginMetadataFromContext, u as warnIfConfigFromFuture, v as persistBoundedClobberedConfigSnapshot, y as createConfigIoContext, z as withConfigWriteLock } from "./io.snapshot-BXuGbHpS.mjs";
import { b as resolveIsConfigReadOnly } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { h as snapshotEnv, m as restoreEnvChangesIfUnchanged } from "./config-env-vars-BHI12YH5.mjs";
import { p as withSynchronousArtifactPreservingStateSnapshot } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { n as replaceFileAtomic } from "./replace-file-DJtj9VLX.mjs";
import "./legacy-2ovrASa7.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import { O as DuplicateAgentDirError, k as findDuplicateAgentDirs, p as materializeRuntimeConfig } from "./validation-core-DwJVlxTe.mjs";
import { n as loadDotEnvAsync } from "./dotenv-DvPPvduE.mjs";
import { a as hashConfigRaw, c as parseConfigJson5, d as resolveConfigIncludesForRead, n as containsConfigIncludeDirective, o as maybeLoadDotEnvForConfig, t as coerceConfig, u as resolveConfigForRead } from "./io.read-helpers-N26RjV2V.mjs";
import { f as migrateLegacyContextBudgetConfig, o as validateConfigObjectWithPlugins, s as validateConfigObjectWithPluginsAsync } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { a as throwInvalidConfig } from "./io.invalid-config-Deld-wtR.mjs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
//#region src/config/io.load.ts
function* resolveConfigLoadEffect(effect) {
	let result;
	yield {
		sync: () => {
			result = effect.sync();
		},
		async: async () => {
			result = await effect.async();
		}
	};
	return result;
}
function loadConfigFromContext(context, options = {}) {
	const operation = loadConfigWithEffects(context, options);
	let step = operation.next();
	while (!step.done) try {
		options.assertCurrent?.();
		step.value.sync();
		options.assertCurrent?.();
		step = operation.next();
	} catch (error) {
		step = operation.throw(error);
	}
	return step.value;
}
async function loadConfigFromContextAsync(context, options = {}) {
	if (!isMainThread) return loadConfigFromContext(context, options);
	const operation = loadConfigWithEffects(context, options);
	let step = operation.next();
	while (!step.done) try {
		options.assertCurrent?.();
		await step.value.async();
		options.assertCurrent?.();
		step = operation.next();
	} catch (error) {
		step = operation.throw(error);
	}
	return step.value;
}
function* loadConfigWithEffects(context, options) {
	const { deps, configPath, pathResolution } = context;
	let envBeforeRead;
	try {
		yield* resolveConfigLoadEffect({
			sync: () => maybeLoadDotEnvForConfig(deps.env),
			async: async () => {
				if (deps.env === process.env) await loadDotEnvAsync({
					env: deps.env,
					quiet: true
				});
			}
		});
		envBeforeRead = snapshotEnv(deps.env);
		if (!(yield* resolveConfigLoadEffect({
			sync: () => deps.fs.existsSync(configPath),
			async: () => deps.fs.promises.access(configPath).then(() => true, () => false)
		}))) {
			loggedConfigWarningFingerprints.delete(configPath);
			const config = coerceConfig(migratePersistedImplicitMainRoster({}).config);
			const metadata = context.createValidationPluginMetadataSnapshotLoader({
				effectiveConfigRaw: config,
				env: deps.env
			});
			const materialized = yield* resolveConfigLoadEffect({
				sync: () => materializeRuntimeConfig(config, {
					...pathResolution,
					...context.options.pluginValidation === "core-only" ? { manifestRegistry: { plugins: [] } } : { loadManifestRegistry: () => metadata.load(config).manifestRegistry }
				}),
				async: async () => materializeRuntimeConfig(config, {
					...pathResolution,
					manifestRegistry: context.options.pluginValidation === "core-only" ? { plugins: [] } : (await metadata.loadAsync(config)).manifestRegistry
				})
			});
			return yield* resolveConfigLoadEffect({
				sync: () => context.finalizeLoadedRuntimeConfig(materialized),
				async: () => context.finalizeLoadedRuntimeConfigAsync(materialized, metadata, options.assertCurrent)
			});
		}
		const raw = yield* resolveConfigLoadEffect({
			sync: () => deps.fs.readFileSync(configPath, "utf-8"),
			async: () => deps.fs.promises.readFile(configPath, "utf-8")
		});
		const parsed = deps.json5.parse(raw);
		const readResolution = resolveConfigForRead(resolveConfigIncludesForRead(parsed, configPath, deps), deps.env, deps.lowerPrecedenceEnv);
		const contextBudgetMigration = migrateLegacyContextBudgetConfig(readResolution.resolvedConfigRaw);
		const rosterMigration = migratePersistedImplicitMainRoster(contextBudgetMigration.config, {
			env: deps.env,
			homedir: deps.homedir
		});
		const effectiveConfigRaw = rosterMigration.config;
		const validationConfigRaw = effectiveConfigRaw;
		const snapshotRaw = raw;
		const snapshotParsed = parsed;
		const hash = hashConfigRaw(snapshotRaw);
		for (const warning of readResolution.envWarnings) deps.logger.warn(`Config (${configPath}): missing env var "${warning.varName}" at ${warning.configPath} - feature using this value will be unavailable`);
		for (const diagnostic of [
			...contextBudgetMigration.changes.map(({ message }) => message),
			...contextBudgetMigration.warnings.map(({ message }) => message),
			...rosterMigration.diagnostics
		]) deps.logger.warn(`Config (${configPath}): ${diagnostic}`);
		warnOnConfigMiskeys(validationConfigRaw, deps.logger);
		if (typeof validationConfigRaw === "object" && validationConfigRaw !== null) {
			const duplicates = findDuplicateAgentDirs(validationConfigRaw, pathResolution);
			if (duplicates.length > 0) throw new DuplicateAgentDirError(duplicates);
		}
		const pluginMetadata = context.createValidationPluginMetadataSnapshotLoader({
			effectiveConfigRaw,
			env: deps.env
		});
		const validationParams = {
			...pathResolution,
			pluginValidation: context.options.pluginValidation,
			sourceRaw: snapshotParsed,
			preservedLegacyRootKeys: context.options.preservedLegacyRootKeys
		};
		const { deferredPluginMigrations, validated } = yield* resolveConfigLoadEffect({
			sync: () => withSynchronousArtifactPreservingStateSnapshot(() => {
				const pending = context.resolveDeferredPluginMigrations();
				return {
					deferredPluginMigrations: pending,
					validated: validateConfigObjectWithPlugins(validationConfigRaw, {
						...validationParams,
						deferredPluginMigrations: pending,
						loadPluginMetadataSnapshot: pluginMetadata.load
					})
				};
			}),
			async: async () => {
				const pending = await context.resolveDeferredPluginMigrationsAsync();
				return {
					deferredPluginMigrations: pending,
					validated: await validateConfigObjectWithPluginsAsync(validationConfigRaw, {
						...validationParams,
						deferredPluginMigrations: pending,
						loadPluginMetadataSnapshotAsync: pluginMetadata.loadAsync
					})
				};
			}
		});
		if (!validated.ok) {
			const invalidSnapshot = createConfigFileSnapshot({
				path: configPath,
				exists: true,
				raw: snapshotRaw,
				parsed: snapshotParsed,
				sourceConfig: coerceConfig(effectiveConfigRaw),
				valid: false,
				runtimeConfig: coerceConfig(effectiveConfigRaw),
				hash,
				issues: validated.issues,
				deferredPluginMigrations,
				warnings: validated.warnings,
				resolutionFacts: readResolution.resolutionFacts,
				legacyIssues: []
			});
			yield* resolveConfigLoadEffect({
				sync: () => context.observeLoadConfigSnapshot(invalidSnapshot),
				async: () => context.observeLoadConfigSnapshotAsync(invalidSnapshot, options.assertCurrent)
			});
			throwInvalidConfig({
				configPath,
				issues: validated.issues,
				logger: deps.logger,
				loggedConfigPaths: loggedInvalidConfigs
			});
		}
		if (context.options.pluginValidation !== "skip") logConfigWarningsOnce({
			configPath,
			warnings: validated.warnings,
			logger: deps.logger
		});
		if (!deps.suppressFutureVersionWarning) warnIfConfigFromFuture(validated.config, deps.logger);
		if (deps.observe && !options.skipSuspiciousRecovery && !containsConfigIncludeDirective(parsed)) {
			const recoveryParams = {
				deps,
				configPath,
				raw,
				parsed,
				prepareBackup: context.prepareRecoveryBackupCandidate
			};
			if ((yield* resolveConfigLoadEffect({
				sync: () => maybeRecoverSuspiciousConfigReadSync(recoveryParams),
				async: () => maybeRecoverSuspiciousConfigRead({
					...recoveryParams,
					prepareBackupAsync: context.prepareRecoveryBackupCandidateAsync,
					assertCurrent: options.assertCurrent
				})
			})).raw !== raw) {
				restoreEnvChangesIfUnchanged({
					env: deps.env,
					before: envBeforeRead,
					after: snapshotEnv(deps.env)
				});
				return yield* loadConfigWithEffects(context, {
					...options,
					skipSuspiciousRecovery: true
				});
			}
		}
		const cfg = materializeRuntimeConfig(validated.config, {
			...pathResolution,
			manifestRegistry: context.options.pluginValidation === "core-only" ? { plugins: [] } : pluginMetadata.getManifestRegistry()
		});
		const snapshot = createConfigFileSnapshot({
			path: configPath,
			exists: true,
			raw: snapshotRaw,
			parsed: snapshotParsed,
			sourceConfig: coerceConfig(effectiveConfigRaw),
			valid: true,
			runtimeConfig: cfg,
			deferredPluginMigrations,
			hash,
			issues: [],
			warnings: validated.warnings,
			resolutionFacts: readResolution.resolutionFacts,
			legacyIssues: []
		});
		yield* resolveConfigLoadEffect({
			sync: () => context.observeLoadConfigSnapshot(snapshot),
			async: () => context.observeLoadConfigSnapshotAsync(snapshot, options.assertCurrent)
		});
		return yield* resolveConfigLoadEffect({
			sync: () => context.finalizeLoadedRuntimeConfig(cfg),
			async: () => context.finalizeLoadedRuntimeConfigAsync(cfg, pluginMetadata, options.assertCurrent)
		});
	} catch (error) {
		if (envBeforeRead) restoreEnvChangesIfUnchanged({
			env: deps.env,
			before: envBeforeRead,
			after: snapshotEnv(deps.env)
		});
		if (error instanceof DuplicateAgentDirError) {
			deps.logger.error(error.message);
			throw error;
		}
		if (error?.code === "INVALID_CONFIG") throw error;
		deps.logger.error(`Failed to read config at ${configPath}: ${formatErrorMessage(error)}`);
		throw error;
	}
}
//#endregion
//#region src/config/io.recovery.ts
function findJsonRootSuffix(raw, json5) {
	if (/^\s*(?:\{|\[)/.test(raw)) return null;
	let offset = 0;
	while (offset < raw.length) {
		const nextNewline = raw.indexOf("\n", offset);
		const lineEnd = nextNewline === -1 ? raw.length : nextNewline + 1;
		const line = raw.slice(offset, lineEnd);
		if (/^\s*(?:\{|\[)/.test(line)) {
			const candidate = raw.slice(offset);
			const parsed = parseConfigJson5(candidate, json5);
			return parsed.ok ? {
				raw: candidate,
				parsed: parsed.parsed
			} : null;
		}
		offset = lineEnd;
	}
	return null;
}
async function persistPrefixedConfigRecovery(params) {
	const { context } = params;
	const observedAt = (/* @__PURE__ */ new Date()).toISOString();
	const clobberedPath = await persistBoundedClobberedConfigSnapshot({
		deps: context.deps,
		configPath: context.configPath,
		raw: params.originalRaw,
		observedAt
	});
	await replaceFileAtomic({
		filePath: context.configPath,
		content: params.recoveredRaw,
		dirMode: 448,
		mode: 384,
		tempPrefix: path.basename(context.configPath),
		fileSystem: context.deps.fs
	});
	context.deps.logger.warn(`Config auto-stripped non-JSON prefix: ${context.configPath}` + (clobberedPath ? ` (original saved as ${clobberedPath})` : ""));
}
async function recoverConfigFromJsonRootSuffixWithContext(context, snapshot) {
	if (resolveIsConfigReadOnly(context.deps.env)) return false;
	if (!snapshot.exists || snapshot.valid || typeof snapshot.raw !== "string") return false;
	const suffixRecovery = findJsonRootSuffix(snapshot.raw, context.deps.json5);
	if (!suffixRecovery) return false;
	let resolved;
	try {
		resolved = resolveConfigIncludesForRead(suffixRecovery.parsed, context.configPath, context.deps);
	} catch {
		return false;
	}
	const resolution = resolveConfigForRead(resolved, context.deps.env, context.deps.lowerPrecedenceEnv);
	if (!validateConfigObjectWithPlugins(resolution.resolvedConfigRaw, {
		...context.pathResolution,
		sourceRaw: suffixRecovery.parsed
	}).ok) return false;
	await persistPrefixedConfigRecovery({
		context,
		originalRaw: snapshot.raw,
		recoveredRaw: suffixRecovery.raw
	});
	return true;
}
//#endregion
//#region src/config/io.factory.ts
function createConfigIO(options = {}) {
	const context = createConfigIoContext(options);
	const readInternal = (observe) => readConfigFileSnapshotInternal(observe === false ? {
		...context,
		deps: {
			...context.deps,
			observe: false
		}
	} : context);
	return {
		configPath: context.configPath,
		env: context.deps.env,
		logger: context.deps.logger,
		loadConfig: (loadOptions) => loadConfigFromContext(context, loadOptions),
		loadConfigAsync: (loadOptions) => loadConfigFromContextAsync(context, loadOptions),
		readBestEffortConfig: async () => (await readBestEffortConfigSnapshotFromContext(context)).config,
		readBestEffortConfigSnapshot: () => readBestEffortConfigSnapshotFromContext(context),
		readSourceConfigBestEffort: () => readSourceConfigBestEffortFromContext(context),
		readConfigFileSnapshot: (readOptions = {}) => readConfigFileSnapshotFromContext(context, readOptions),
		readConfigFileSnapshotWithPluginMetadata: (readOptions = {}) => readConfigFileSnapshotWithPluginMetadataFromContext(context, readOptions),
		readConfigFileSnapshotForWrite: (readOptions) => readConfigFileSnapshotForWriteFromContext(context, readOptions),
		prepareConfigRecovery: (current) => prepareConfigRecoveryFromContext(context, current),
		promoteConfigSnapshotToLastKnownGood: (snapshot) => promoteConfigSnapshotToLastKnownGoodCore({
			deps: context.deps,
			snapshot,
			logger: context.deps.logger
		}),
		recoverConfigFromLastKnownGood: (params) => recoverConfigFromLastKnownGoodCore({
			deps: context.deps,
			snapshot: params.snapshot,
			reason: params.reason,
			prepareCandidate: context.prepareRecoveryBackupCandidate
		}),
		recoverConfigFromJsonRootSuffix: (snapshot) => recoverConfigFromJsonRootSuffixWithContext(context, snapshot),
		writeConfigFile: async (config, writeOptions = {}) => {
			writeOptions.assertConfigPathForWrite?.();
			const { writeConfigFileFromContext } = await import("./io.write-HPR4lZJ0.mjs");
			writeOptions.assertConfigPathForWrite?.();
			return withConfigWriteLock(context.configPath, () => writeConfigFileFromContext(context, config, writeOptions, () => readInternal(writeOptions.observe)), context.deps.env, writeOptions.assertCurrent);
		}
	};
}
//#endregion
export { createConfigIO as t };
