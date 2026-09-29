import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { D as captureConfigFileWritePathProof, L as captureConfigWriteLockGuard, O as createGuardedConfigFileSystem, P as rollbackConfigFileWriteIfUnchanged, R as markActiveConfigMutationPath, _ as warnIfJSON5CommentsWillBeStripped, z as withConfigWriteLock } from "./io.snapshot-BXuGbHpS.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { n as isPathInside } from "./path-safety-0BfxAYBQ.mjs";
import { a as hashConfigIncludeRaw, c as resolveConfigIncludeWritePath, n as ConfigIncludeError, o as isInternalIncludeWriteTarget, r as INCLUDE_KEY } from "./includes-CaaCq-XN.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { n as resolveIncludeWriteBoundary, t as collectChangedConfigPaths } from "./include-write-boundary-BGbgppFc.mjs";
import { L as projectIncludeModelPolicyWrite } from "./agent-scope-config-IQKOEtZ4.mjs";
import { p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { X as resolveConfigEnvVars } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { c as getPublishedConfigRuntimeEnvState, h as snapshotEnv, m as restoreEnvChangesIfUnchanged, n as cloneEnvWithPlatformSemantics, s as createConfigRuntimeEnvBase, t as applyConfigEnvVars } from "./config-env-vars-BHI12YH5.mjs";
import { C as resolveConfigWriteAfterWrite, _ as preflightRuntimeSnapshotWrite, a as finalizeRuntimeSnapshotWrite, d as hasManagedRuntimeConfigWriteOwner, g as preflightManagedRuntimeConfigWrite, h as notifyRuntimeConfigWriteListeners, i as createRuntimeConfigWriteNotification, l as getRuntimeConfigSnapshotRefreshHandler, s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot, v as projectRuntimeConfigWritePreparedCandidates, w as resolveConfigWriteFollowUp } from "./runtime-snapshot-DbgWcCyV.mjs";
import { r as projectLegacyRuntimeConfigWrite } from "./runtime-source-projection-D2uZ1zpS.mjs";
import { a as readDeferredPluginMigrations, c as withDeferredPluginMigrationsCurrent } from "./deferred-plugin-migrations-DZuh_dkr.mjs";
import { c as resolveManagedUnsetPathsForWrite, i as preserveDeferredPluginMigrationConfig, o as setDeferredPluginMigrationConfigFacts, s as applyUnsetPathsForWrite } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { _ as GATEWAY_CONFIG_SELECTION_ENV_KEYS, a as hashConfigRaw, h as resolveManagedRuntimeEnvBaseline, n as containsConfigIncludeDirective, p as resolveConfigSnapshotHash } from "./io.read-helpers-N26RjV2V.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { n as createConfigWriteAuthorityGuard } from "./write-authority-BBYsD_pp.mjs";
import { i as assertUpdateDoctorConfigInputHash } from "./update-doctor-result-C3mikR6I.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-DALlcipW.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { o as validateConfigObjectWithPlugins } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { t as getConfigValueAtPath } from "./config-paths-BKljx7kX.mjs";
import { n as formatInvalidConfigDetails, t as createInvalidConfigError } from "./io.invalid-config-Deld-wtR.mjs";
import { t as createConfigIO } from "./io.factory-ChIex6Yh.mjs";
import { i as resolveWriteEnvSnapshotForPath, n as configWriteCommittedSnapshot } from "./io.types-zuIBxyy5.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-C28rym6a.mjs";
import { S as copyRuntimeConfigWriteApplication, b as writeConfigFile, u as readConfigFileSnapshotForWrite, w as getRuntimeConfigWriteApplication, x as attachRuntimeConfigWriteApplication } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { i as projectConfigWriteSource, n as prepareConfigWriteValues, t as injectExplicitlySetPaths } from "./io.write-prepare-xbITFBQs.mjs";
import { n as prepareConfigFileWrite } from "./backup-rotation-BHIBam1J.mjs";
import { t as rejectConfigNonFiniteNumbers } from "./value-tree-D8NwsREA.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/config/mutate.include-io.ts
function formatJsonFileValue(value) {
	rejectConfigNonFiniteNumbers(value);
	return `${JSON.stringify(value, null, 2)}\n`;
}
async function resolveRootBoundIncludeFile(params) {
	const absolutePath = resolveConfigIncludeWritePath(params);
	const candidateRoots = [path.dirname(params.configPath), ...params.allowedRoots];
	for (const candidateRoot of candidateRoots) {
		const rootReal = await fs$1.realpath(candidateRoot).catch(() => null);
		if (!rootReal || !isPathInside(rootReal, absolutePath)) continue;
		const relativePath = path.relative(rootReal, absolutePath);
		if (!relativePath || path.isAbsolute(relativePath) || relativePath.split(path.sep)[0] === "..") continue;
		return {
			absolutePath,
			relativePath,
			root: await root(rootReal, {
				hardlinks: "reject",
				mkdir: true,
				mode: 384,
				symlinks: "reject"
			})
		};
	}
	throw new Error(`Config include write path has no approved existing root: ${absolutePath}`);
}
async function resolveExpectedRootBoundIncludeFile(params) {
	let target;
	try {
		target = await resolveRootBoundIncludeFile(params);
	} catch (error) {
		if (error instanceof ConfigIncludeError || error instanceof Error && error.message.startsWith("Config include write path has no approved existing root:")) throw new ConfigMutationConflictError("included config target changed since last load");
		throw error;
	}
	if (path.normalize(target.absolutePath) !== path.normalize(params.expectedAbsolutePath)) throw new ConfigMutationConflictError("included config target changed since last load");
	return target;
}
async function readRootBoundFileRawIfExists(target) {
	try {
		return await target.root.readText(target.relativePath);
	} catch (error) {
		if (isMissingPathError(error)) return null;
		throw error;
	}
}
async function assertRootConfigStillMatchesSnapshot(snapshot) {
	let currentRaw = null;
	try {
		currentRaw = await fs$1.readFile(snapshot.path, "utf-8");
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	if (hashConfigIncludeRaw(currentRaw) !== hashConfigIncludeRaw(snapshot.exists ? snapshot.raw ?? null : null)) throw new ConfigMutationConflictError("config changed while preparing include write");
}
async function assertIncludeGraphStillMatchesSnapshot(params) {
	await assertRootConfigStillMatchesSnapshot(params.snapshot);
	for (const [includePath, capturedHash] of Object.entries(params.writeOptions?.includeFileHashesForWrite ?? {})) {
		const expectedTarget = params.writeOptions?.includeFileTargetsForWrite?.[includePath];
		if (!expectedTarget) throw new ConfigMutationConflictError("included config target changed since last load");
		const target = await resolveExpectedRootBoundIncludeFile({
			configPath: params.snapshot.path,
			includePath,
			allowedRoots: [path.dirname(expectedTarget)],
			expectedAbsolutePath: expectedTarget
		});
		const expectedHash = includePath === params.includePath ? params.includeHash : capturedHash;
		if (hashConfigIncludeRaw(await readRootBoundFileRawIfExists(target)) !== expectedHash) throw new ConfigMutationConflictError("included config changed while preparing write");
	}
}
async function rollbackJsonFileWriteIfUnchanged(params) {
	return await rollbackConfigFileWriteIfUnchanged({
		configPath: params.target.absolutePath,
		previousSnapshot: {
			path: params.target.absolutePath,
			exists: params.previousRaw !== null,
			raw: params.previousRaw
		},
		committedHash: hashConfigRaw(params.committedRaw),
		fsModule: fs,
		...params.pathProof.captureRollbackProof(),
		preserveDirectoryMode: true,
		durable: true,
		destinationHardlinks: "reject"
	});
}
async function writeRootBoundJsonFile(params) {
	params.assertConfigPathForWrite();
	await params.preCommitRuntimePreflight?.();
	params.assertConfigPathForWrite();
	const targetAtCommit = await resolveExpectedRootBoundIncludeFile({
		configPath: params.configPath,
		includePath: params.includePath,
		allowedRoots: params.allowedRoots,
		expectedAbsolutePath: params.expectedTargetPath
	});
	params.assertConfigPathForWrite();
	await params.assertIncludeGraphForWrite();
	params.assertConfigPathForWrite();
	const currentRaw = await readRootBoundFileRawIfExists(targetAtCommit);
	params.assertConfigPathForWrite();
	if (hashConfigIncludeRaw(currentRaw) !== hashConfigIncludeRaw(params.expectedRaw)) throw new ConfigMutationConflictError("included config changed while preparing write");
	const pathProof = captureConfigFileWritePathProof(params.includePath, targetAtCommit.absolutePath, fs);
	const assertCurrent = createConfigWriteAuthorityGuard(() => {
		params.assertConfigPathForWrite();
		pathProof.assertCurrent();
	});
	const content = formatJsonFileValue(params.value);
	params.assertConfigPathForWrite();
	warnIfJSON5CommentsWillBeStripped({
		raw: currentRaw,
		filePath: targetAtCommit.absolutePath,
		skipOutputLogs: params.skipOutputLogs
	});
	const publication = { phase: "unpublished" };
	const guardedFs = createGuardedConfigFileSystem(targetAtCommit.absolutePath, fs, assertCurrent, {
		snapshot: {
			path: targetAtCommit.absolutePath,
			exists: currentRaw !== null,
			raw: currentRaw
		},
		includeGraph: params.includeGraph,
		targetPathProof: pathProof,
		preserveDirectoryMode: true,
		onRootRemoved: () => {
			publication.phase = "removed";
		},
		onRootPublished: () => {
			publication.phase = "published";
		}
	});
	const publicationProof = {
		...pathProof,
		assertCurrent: () => {
			params.assertOwnerForRollback();
			pathProof.assertCurrent();
			guardedFs.assertPublishedIdentity();
		},
		captureRollbackProof: () => guardedFs.captureRollbackProof(params.assertOwnerForRollback)
	};
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const preparedFile = _usingCtx$1.a(await prepareConfigFileWrite({
				configPath: targetAtCommit.absolutePath,
				previousRaw: currentRaw,
				content,
				fsModule: guardedFs.fileSystem,
				assertCurrent: guardedFs.assertCurrent,
				destinationHardlinks: "reject",
				durable: true
			}));
			await params.beforeCommit?.();
			guardedFs.assertCurrent();
			withDeferredPluginMigrationsCurrent({
				env: params.env,
				expectedPending: params.deferredPluginMigrations
			}, () => {
				preparedFile.publish();
				publication.phase = "published";
			});
			await params.assertIncludeGraphForWrite(hashConfigIncludeRaw(content));
			guardedFs.assertCurrent();
			guardedFs.assertPublishedIdentity();
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch (error) {
		if (publication.phase === "unpublished") throw error;
		let rollbackStatus = "unknown";
		try {
			rollbackStatus = await rollbackJsonFileWriteIfUnchanged({
				target: targetAtCommit,
				previousRaw: currentRaw,
				committedRaw: publication.phase === "published" ? content : null,
				pathProof: publicationProof
			}) ? "restored" : "not-restored";
		} catch (rollbackError) {
			throw new ConfigWritePostCommitError({
				configPath: targetAtCommit.absolutePath,
				rollbackStatus,
				publication: publication.phase === "removed" ? "partial" : "complete",
				cause: new AggregateError([error, rollbackError], `${formatErrorMessage(error)} Recovery failed: ${formatErrorMessage(rollbackError)}`, { cause: rollbackError })
			});
		}
		throw new ConfigWritePostCommitError({
			configPath: targetAtCommit.absolutePath,
			rollbackStatus,
			publication: publication.phase === "removed" ? "partial" : "complete",
			cause: error
		});
	}
	return publicationProof;
}
//#endregion
//#region src/config/mutate.ts
const DEFAULT_CONFIG_MUTATION_RETRY_ATTEMPTS = 5;
function assertManagedRuntimeEnvGeneration(generation) {
	if (getPublishedConfigRuntimeEnvState().generation !== generation) throw new ConfigMutationConflictError("active config environment changed while preparing write");
}
function assertBaseHashMatches(snapshot, expectedHash) {
	const currentHash = resolveConfigSnapshotHash(snapshot) ?? null;
	if (expectedHash !== void 0 && expectedHash !== currentHash) throw new ConfigMutationConflictError("config changed since last load");
	return currentHash;
}
function assertExpectedConfigPathMatches(snapshot, expectedConfigPath) {
	if (expectedConfigPath !== void 0 && expectedConfigPath !== snapshot.path) throw new ConfigMutationConflictError("config path changed since last load", { retryable: false });
}
/** Serialize config writers without requiring a schema-valid snapshot. */
async function withConfigMutationLock(params, fn) {
	const assertCurrent = params.assertCurrent;
	assertCurrent?.();
	return params.io ? await fn() : await withConfigWriteLock(params.lockPath ?? resolveConfigPath(), fn, void 0, assertCurrent);
}
async function readConfigSnapshotForMutation(params) {
	const options = {
		...params.writeOptions?.skipPluginValidation ? { skipPluginValidation: true } : {},
		...params.writeOptions?.observe === false ? { observe: false } : {}
	};
	if (params.io) return await params.io.readConfigFileSnapshotForWrite(options);
	if (params.ownedConfigPathForWrite) {
		const ioOptions = {
			configPath: params.ownedConfigPathForWrite,
			...params.writeOptions?.skipPluginValidation ? { pluginValidation: "skip" } : {},
			...params.writeOptions?.observe === false ? { observe: false } : {},
			...params.writeOptions?.preservedLegacyRootKeys ? { preservedLegacyRootKeys: params.writeOptions.preservedLegacyRootKeys } : {}
		};
		return await (hasManagedRuntimeConfigWriteOwner(params.ownedConfigPathForWrite) ? createConfigIO({
			...ioOptions,
			env: createConfigRuntimeEnvBase(resolveManagedRuntimeEnvBaseline().sourceConfig, process.env, { preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS })
		}) : createConfigIO(ioOptions)).readConfigFileSnapshotForWrite();
	}
	return await readConfigFileSnapshotForWrite(options);
}
function mergeConfigMutationWriteOptions(prepared, caller) {
	const merged = copyRuntimeConfigWriteApplication(caller, {
		...prepared,
		...caller
	});
	const capturedGuard = prepared.assertConfigPathForWrite;
	const callerGuard = caller?.assertConfigPathForWrite;
	if (capturedGuard && callerGuard && capturedGuard !== callerGuard) merged.assertConfigPathForWrite = () => {
		capturedGuard();
		callerGuard();
	};
	else if (capturedGuard) merged.assertConfigPathForWrite = capturedGuard;
	return merged;
}
function createConfigMutationOwnership(prepared, writeOptions) {
	const mergedWriteOptions = mergeConfigMutationWriteOptions(prepared.writeOptions, writeOptions);
	return {
		initialized: true,
		expectedConfigPath: mergedWriteOptions.expectedConfigPath ?? prepared.snapshot.path,
		ownedConfigPathForWrite: mergedWriteOptions.ownedConfigPathForWrite,
		assertConfigPathForWrite: mergedWriteOptions.assertConfigPathForWrite
	};
}
async function withConfigMutationSnapshotLock(params, fn) {
	let lockPath = path.resolve(params.writeOptions?.ownedConfigPathForWrite ?? resolveConfigPath());
	for (let attempt = 0; attempt < 3; attempt += 1) {
		params.writeOptions?.assertConfigPathForWrite?.();
		const outcome = await withConfigMutationLock({
			lockPath,
			assertCurrent: params.writeOptions?.assertCurrent
		}, async () => {
			const prepared = await readConfigSnapshotForMutation({
				...params.writeOptions?.ownedConfigPathForWrite ? { ownedConfigPathForWrite: params.writeOptions.ownedConfigPathForWrite } : {},
				writeOptions: params.writeOptions
			});
			captureConfigWriteLockGuard(lockPath)?.();
			params.writeOptions?.assertConfigPathForWrite?.();
			const preparedPath = path.resolve(prepared.snapshot.path);
			if (preparedPath !== lockPath) return {
				done: false,
				lockPath: preparedPath
			};
			return {
				done: true,
				value: await fn(prepared)
			};
		});
		if (outcome.done) return outcome.value;
		lockPath = outcome.lockPath;
	}
	throw new ConfigMutationConflictError("config path changed repeatedly while acquiring lock", { retryable: false });
}
/**
* Run a multi-phase operation under the canonical cross-process write lock.
* Nested mutation helpers are reentrant through activeConfigMutationLocks.
*/
async function withConfigMutationExclusive(fn) {
	return await withConfigMutationSnapshotLock({}, async (prepared) => await fn(prepared.snapshot.sourceConfig));
}
function getLegacyTopLevelIncludeBoundary(params) {
	if (!isRecord(params.snapshot.parsed) || params.changed.rootChanged) return null;
	const topLevelKeys = new Set(params.changed.paths.map((changedPath) => changedPath[0]).filter((key) => key !== void 0));
	if (topLevelKeys.size !== 1) return null;
	const key = expectDefined([...topLevelKeys][0], "changed top-level key at 0");
	const authoredSection = params.snapshot.parsed[key];
	if (!isRecord(authoredSection)) return null;
	const includeValue = authoredSection[INCLUDE_KEY];
	if (Object.keys(authoredSection).length !== 1 || typeof includeValue !== "string") return null;
	const rootDir = path.dirname(params.snapshot.path);
	return {
		boundaryPath: [key],
		includePath: path.normalize(path.isAbsolute(includeValue) ? includeValue : path.resolve(rootDir, includeValue))
	};
}
/**
* One include-owned write decision for the guarded writer and Doctor's
* eligibility check; a split decision lets Doctor advertise an include write
* that the writer then declines. Null means the write belongs to the root writer.
*/
function resolveIncludeOwnedWriteCandidate(params) {
	if (params.writeOptions?.persistCanonicalAgentRoster === true) return null;
	const projection = {
		inputBasis: params.writeOptions?.inputBase === "source" ? {
			kind: "source",
			config: params.snapshot.sourceConfig
		} : void 0,
		runtimeConfig: params.snapshot.runtimeConfig,
		sourceConfig: params.snapshot.sourceConfig,
		nextConfig: !params.io && params.writeOptions?.inputBase === void 0 ? projectLegacyRuntimeConfigWrite(params.nextConfig) : params.nextConfig,
		unsetPaths: resolveManagedUnsetPathsForWrite(params.writeOptions?.unsetPaths),
		explicitSetPaths: params.writeOptions?.explicitSetPaths,
		explicitSetValueSource: params.writeOptions?.explicitSetValueSource ?? params.nextConfig
	};
	const requestedConfig = applyUnsetPathsForWrite(injectExplicitlySetPaths({
		...projection,
		valueSource: projection.explicitSetValueSource,
		persistedCandidate: projectConfigWriteSource(projection)
	}), projection.unsetPaths);
	const values = prepareConfigWriteValues({
		snapshot: params.snapshot,
		nextConfig: requestedConfig,
		writeOptions: params.writeOptions,
		env: params.io?.env ?? process.env,
		explicitSetPaths: params.writeOptions?.explicitSetPaths
	});
	const markerPath = [
		"meta",
		"migrations",
		"modelPolicyAllowlist"
	];
	const nextConfig = projectIncludeModelPolicyWrite({
		config: values.authoredConfig,
		previousConfig: params.snapshot.sourceConfig,
		preserveMarker: params.writeOptions?.explicitSetPaths?.some((segments) => segments.length <= markerPath.length && segments.every((part, i) => part === markerPath[i])) === true
	});
	let changed = collectChangedConfigPaths(values.authoredSourceConfig, nextConfig);
	if (changed.paths.length === 0 && !changed.rootChanged && nextConfig !== values.authoredConfig) changed = collectChangedConfigPaths(values.authoredSourceConfig, values.authoredConfig);
	if (changed.rootChanged || changed.paths.length === 0) return null;
	const boundary = params.snapshot.includeProvenance === void 0 ? getLegacyTopLevelIncludeBoundary({
		snapshot: params.snapshot,
		changed
	}) : resolveIncludeWriteBoundary({
		provenance: params.snapshot.includeProvenance,
		changed
	});
	if (!boundary || getConfigValueAtPath(nextConfig, [...boundary.boundaryPath]) === void 0) return null;
	return {
		nextConfig,
		...boundary,
		includePath: path.normalize(boundary.includePath)
	};
}
/**
* Resolve the authored $include file that solely owns every changed path of this
* write. Callers that add root-level metadata before persisting (Doctor wizard
* state) must consult this first: an extra root key would push the change set
* outside the boundary and force the guarded root writer to reject the write.
*/
function resolveConfigIncludeWriteBoundary(params) {
	const includeWrite = resolveIncludeOwnedWriteCandidate({
		snapshot: params.snapshot,
		nextConfig: params.nextConfig,
		writeOptions: {
			inputBase: "source",
			persistCanonicalAgentRoster: params.persistCanonicalAgentRoster,
			explicitSetPaths: params.explicitSetPaths
		}
	});
	return includeWrite && isInternalIncludeWriteTarget({
		configPath: params.snapshot.path,
		includePath: includeWrite.includePath
	}) ? {
		boundaryPath: includeWrite.boundaryPath,
		includePath: includeWrite.includePath
	} : null;
}
function snapshotProvesBrokenInclude(snapshot, includePath) {
	return !snapshot.valid && snapshot.issues.some((issue) => /Failed to (?:read|parse) include file:/.test(issue.message) && issue.message.includes(includePath));
}
async function tryWriteIncludeOwnedConfigMutation(params) {
	const includeWrite = resolveIncludeOwnedWriteCandidate({
		snapshot: params.snapshot,
		nextConfig: params.nextConfig,
		writeOptions: params.writeOptions,
		io: params.io
	});
	if (!includeWrite) return null;
	const { nextConfig, boundaryPath, includePath } = includeWrite;
	const rootGuard = captureConfigWriteLockGuard(params.snapshot.path);
	const assertOwner = createConfigWriteAuthorityGuard(params.writeOptions?.assertCurrent, rootGuard);
	assertOwner();
	const writeEnv = params.io?.env ?? process.env;
	const allowedRoots = [];
	const expectedIncludeTarget = params.writeOptions?.includeFileTargetsForWrite?.[includePath];
	if (!expectedIncludeTarget) throw new ConfigMutationConflictError("included config target changed since last load");
	const assertConfigPathForWrite = params.writeOptions?.assertConfigPathForWrite;
	if (!assertConfigPathForWrite) return null;
	assertConfigPathForWrite();
	const configRoot = await fs$1.realpath(path.dirname(params.snapshot.path));
	assertOwner();
	if (!isPathInside(configRoot, expectedIncludeTarget)) throw new Error(`Config mutation cannot update external $include target ${includePath}; edit the included file directly or move it under the config directory.`);
	return await withConfigWriteLock(expectedIncludeTarget, async () => {
		const includeGuard = captureConfigWriteLockGuard(expectedIncludeTarget);
		const assertScopedOwner = createConfigWriteAuthorityGuard(assertOwner, includeGuard);
		assertScopedOwner();
		const includeTarget = await resolveExpectedRootBoundIncludeFile({
			configPath: params.snapshot.path,
			includePath,
			allowedRoots,
			expectedAbsolutePath: expectedIncludeTarget
		});
		assertScopedOwner();
		const previousIncludeRaw = await readRootBoundFileRawIfExists(includeTarget);
		assertScopedOwner();
		const previousIncludeHash = hashConfigIncludeRaw(previousIncludeRaw);
		const expectedIncludeHash = params.writeOptions?.includeFileHashesForWrite?.[includePath];
		if (expectedIncludeHash !== void 0 && expectedIncludeHash !== previousIncludeHash) throw new ConfigMutationConflictError("included config changed since last load");
		const envForRestore = resolveWriteEnvSnapshotForPath({
			actualConfigPath: params.snapshot.path,
			expectedConfigPath: params.writeOptions?.expectedConfigPath,
			envSnapshotForRestore: params.writeOptions?.envSnapshotForRestore
		}) ?? params.io?.env ?? process.env;
		const snapshotHasBrokenInclude = snapshotProvesBrokenInclude(params.snapshot, includePath);
		if (previousIncludeRaw === null && (!snapshotHasBrokenInclude || expectedIncludeHash === void 0)) throw new ConfigMutationConflictError("included config changed since last load");
		const includedValueToWrite = getConfigValueAtPath(nextConfig, [...boundaryPath]);
		if (previousIncludeRaw !== null) {
			let authoredIncludeValue;
			let parsedInclude = false;
			try {
				authoredIncludeValue = parseJsonWithJson5Fallback(previousIncludeRaw);
				parsedInclude = true;
			} catch {
				if (!snapshotHasBrokenInclude || expectedIncludeHash === void 0) throw new ConfigMutationConflictError("included config changed since last load");
			}
			if (parsedInclude) {
				if (containsConfigIncludeDirective(authoredIncludeValue)) return null;
				const currentIncludedValue = resolveConfigEnvVars(authoredIncludeValue, envForRestore, { onMissing: () => {} });
				const authoredSnapshotSource = params.snapshot.sourceConfigBeforeMigrations ?? params.snapshot.sourceConfig;
				const snapshotIncludedValue = getConfigValueAtPath(authoredSnapshotSource, [...boundaryPath]);
				if (!isDeepStrictEqual(currentIncludedValue, snapshotIncludedValue)) throw new ConfigMutationConflictError("included config changed since last load");
			}
		}
		const deferRuntimeActivation = hasManagedRuntimeConfigWriteOwner(params.snapshot.path);
		const runtimeEnvBaseline = deferRuntimeActivation ? resolveManagedRuntimeEnvBaseline() : void 0;
		const runtimeCandidateEnv = runtimeEnvBaseline ? createConfigRuntimeEnvBase(runtimeEnvBaseline.sourceConfig, process.env, { preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS }) : cloneEnvWithPlatformSemantics(writeEnv);
		applyConfigEnvVars(nextConfig, runtimeCandidateEnv);
		const runtimeConfigToWrite = resolveConfigEnvVars(nextConfig, runtimeCandidateEnv, { onMissing: () => {} });
		const validated = validateConfigObjectWithPlugins(runtimeConfigToWrite, {
			...params.writeOptions?.skipPluginValidation ? { pluginValidation: "skip" } : {},
			deferredPluginMigrations: params.deferredPluginMigrations
		});
		if (!validated.ok) throw createInvalidConfigError(params.snapshot.path, formatInvalidConfigDetails(validated.issues));
		const runtimeConfigSnapshot = getRuntimeConfigSnapshot();
		const runtimeConfigSourceSnapshot = getRuntimeConfigSourceSnapshot();
		const hadRuntimeSnapshot = Boolean(runtimeConfigSnapshot);
		const hadBothSnapshots = Boolean(runtimeConfigSnapshot && runtimeConfigSourceSnapshot);
		let managedPreparedCandidates = /* @__PURE__ */ new Map();
		let runtimePreflightResult;
		if (runtimeEnvBaseline) {
			managedPreparedCandidates = await preflightManagedRuntimeConfigWrite(params.snapshot.path, runtimeConfigToWrite, params.writeOptions?.runtimeRefresh);
			assertManagedRuntimeEnvGeneration(runtimeEnvBaseline.generation);
		} else runtimePreflightResult = await preflightRuntimeSnapshotWrite({
			nextSourceConfig: runtimeConfigToWrite,
			refreshOptions: params.writeOptions?.runtimeRefresh,
			formatRefreshError: (error) => formatErrorMessage(error),
			createRefreshError: (detail, cause) => new Error(`Config write blocked before committing ${includePath}: active SecretRef resolution failed: ${detail}`, { cause })
		});
		assertScopedOwner();
		const committedIncludeRaw = formatJsonFileValue(includedValueToWrite);
		const committedIncludeHash = hashConfigIncludeRaw(committedIncludeRaw);
		const callerPreCommit = params.writeOptions?.preCommitRuntimePreflight;
		const assertIncludeGraphForWrite = (includeHash = previousIncludeHash) => assertIncludeGraphStillMatchesSnapshot({
			snapshot: params.snapshot,
			writeOptions: params.writeOptions,
			includePath,
			includeHash
		});
		const pathProof = await writeRootBoundJsonFile({
			env: writeEnv,
			deferredPluginMigrations: params.deferredPluginMigrations,
			configPath: params.snapshot.path,
			includePath,
			allowedRoots,
			expectedTargetPath: expectedIncludeTarget,
			value: includedValueToWrite,
			expectedRaw: previousIncludeRaw,
			includeGraph: {
				hashes: {
					...params.writeOptions?.includeFileHashesForWrite,
					[params.snapshot.path]: hashConfigIncludeRaw(params.snapshot.raw)
				},
				targets: {
					...params.writeOptions?.includeFileTargetsForWrite,
					[params.snapshot.path]: fs.realpathSync(params.snapshot.path)
				}
			},
			assertIncludeGraphForWrite,
			assertConfigPathForWrite: () => {
				assertScopedOwner();
				assertConfigPathForWrite();
				if (runtimeEnvBaseline) assertManagedRuntimeEnvGeneration(runtimeEnvBaseline.generation);
			},
			assertOwnerForRollback: assertScopedOwner,
			beforeCommit: params.writeOptions?.beforeCommit,
			skipOutputLogs: params.writeOptions?.skipOutputLogs,
			preCommitRuntimePreflight: async () => {
				await callerPreCommit?.(runtimeConfigToWrite);
			}
		});
		const assertPostCommitCurrent = () => {
			pathProof.assertCurrent();
			assertConfigPathForWrite();
		};
		const envBeforePostWriteRead = snapshotEnv(writeEnv);
		let envAfterPostWriteRead = envBeforePostWriteRead;
		try {
			assertPostCommitCurrent();
			if (runtimeEnvBaseline) assertManagedRuntimeEnvGeneration(runtimeEnvBaseline.generation);
			if (params.writeOptions?.skipRuntimeSnapshotRefresh && !hadRuntimeSnapshot && !getRuntimeConfigSnapshotRefreshHandler()) return {
				persistedHash: null,
				persistedConfig: runtimeConfigToWrite,
				persistedSourceConfig: runtimeConfigToWrite
			};
			let refreshed;
			try {
				refreshed = await readConfigSnapshotForMutation({
					ownedConfigPathForWrite: params.snapshot.path,
					io: params.io,
					writeOptions: params.writeOptions
				});
			} finally {
				envAfterPostWriteRead = snapshotEnv(writeEnv);
			}
			assertPostCommitCurrent();
			const refreshedSnapshot = refreshed.snapshot;
			await assertIncludeGraphForWrite(committedIncludeHash);
			assertPostCommitCurrent();
			assertExpectedConfigPathMatches(refreshedSnapshot, params.snapshot.path);
			const persistedHash = resolveConfigSnapshotHash(refreshedSnapshot);
			if (!refreshedSnapshot.valid) throw createInvalidConfigError(params.snapshot.path, formatInvalidConfigDetails(refreshedSnapshot.issues));
			if (!persistedHash) throw new Error(`No persisted config hash was available after rereading ${params.snapshot.path}.`);
			const notifyCommittedWrite = () => {
				const currentRuntimeConfig = getRuntimeConfigSnapshot();
				const notificationRuntimeConfig = deferRuntimeActivation ? refreshedSnapshot.runtimeConfig : currentRuntimeConfig;
				if (!notificationRuntimeConfig) return;
				const notificationPreparedCandidates = projectRuntimeConfigWritePreparedCandidates(managedPreparedCandidates, refreshedSnapshot.runtimeConfig, refreshedSnapshot.sourceConfig);
				notifyRuntimeConfigWriteListeners(attachRuntimeConfigWriteApplication(createRuntimeConfigWriteNotification({
					configPath: params.snapshot.path,
					sourceConfig: refreshedSnapshot.sourceConfig,
					runtimeConfig: notificationRuntimeConfig,
					persistedHash,
					afterWrite: params.afterWrite ?? params.writeOptions?.afterWrite,
					runtimeRefresh: params.writeOptions?.runtimeRefresh,
					...notificationPreparedCandidates.size > 0 ? { preparedCandidatesByOwner: notificationPreparedCandidates } : {}
				}), getRuntimeConfigWriteApplication(params.writeOptions ?? {})));
			};
			if (runtimeEnvBaseline) assertManagedRuntimeEnvGeneration(runtimeEnvBaseline.generation);
			await finalizeRuntimeSnapshotWrite({
				assertCurrent: assertPostCommitCurrent,
				nextSourceConfig: refreshedSnapshot.sourceConfig,
				refreshOptions: params.writeOptions?.runtimeRefresh,
				hadBothSnapshots,
				freshConfig: refreshedSnapshot.runtimeConfig,
				notifyCommittedWrite,
				preflightResult: runtimePreflightResult,
				deferRuntimeActivation,
				formatRefreshError: (error) => formatErrorMessage(error),
				createRefreshError: (detail, cause) => new Error(`runtime snapshot refresh failed: ${detail}`, { cause })
			});
			assertPostCommitCurrent();
			return {
				persistedHash,
				persistedConfig: refreshedSnapshot.sourceConfig,
				persistedSourceConfig: runtimeConfigToWrite
			};
		} catch (error) {
			let rollbackStatus = "unknown";
			try {
				const rolledBack = await rollbackJsonFileWriteIfUnchanged({
					target: includeTarget,
					previousRaw: previousIncludeRaw,
					committedRaw: committedIncludeRaw,
					pathProof
				});
				rollbackStatus = rolledBack ? "restored" : "not-restored";
				if (rolledBack) restoreEnvChangesIfUnchanged({
					env: writeEnv,
					before: envBeforePostWriteRead,
					after: envAfterPostWriteRead
				});
			} catch (rollbackError) {
				throw new ConfigWritePostCommitError({
					configPath: includeTarget.absolutePath,
					rollbackStatus,
					cause: new AggregateError([error, rollbackError], `${formatErrorMessage(error)} Recovery failed: ${formatErrorMessage(rollbackError)}`, { cause: rollbackError })
				});
			}
			throw new ConfigWritePostCommitError({
				configPath: includeTarget.absolutePath,
				rollbackStatus,
				cause: error
			});
		}
	}, writeEnv, assertOwner);
}
async function replaceConfigFile(params) {
	params.writeOptions?.assertConfigPathForWrite?.();
	if (!params.snapshot && !params.io) return await withConfigMutationSnapshotLock({ writeOptions: params.writeOptions }, async (prepared) => await replaceConfigFileUnlocked({
		...params,
		snapshot: prepared.snapshot,
		writeOptions: mergeConfigMutationWriteOptions(prepared.writeOptions, params.writeOptions)
	}));
	return await withConfigMutationLock({
		io: params.io,
		lockPath: params.snapshot?.path,
		assertCurrent: params.writeOptions?.assertCurrent
	}, async () => await replaceConfigFileUnlocked(params));
}
async function replaceConfigFileUnlocked(params) {
	const { snapshot, writeOptions } = params.snapshot ? {
		snapshot: params.snapshot,
		writeOptions: params.writeOptions ?? {}
	} : await readConfigSnapshotForMutation({
		io: params.io,
		writeOptions: params.writeOptions
	});
	const deferredPluginMigrations = readDeferredPluginMigrations({ env: params.io?.env });
	const mergedWriteOptions = mergeConfigMutationWriteOptions(writeOptions, params.writeOptions);
	const nextConfig = preserveDeferredPluginMigrationConfig({
		sourceConfig: snapshot.sourceConfig,
		nextConfig: params.sourceConfig ?? params.nextConfig,
		pending: deferredPluginMigrations,
		writeOptions: mergedWriteOptions
	});
	mergedWriteOptions.inputBase = params.sourceConfig ? "source" : mergedWriteOptions.inputBase;
	mergedWriteOptions.assertConfigPathForWrite?.();
	assertExpectedConfigPathMatches(snapshot, mergedWriteOptions.expectedConfigPath);
	assertConfigWriteAllowedInCurrentMode({ configPath: snapshot.path });
	markActiveConfigMutationPath(snapshot.path);
	assertUpdateDoctorConfigInputHash(snapshot.path, hashConfigRaw(snapshot.raw));
	const previousHash = assertBaseHashMatches(snapshot, params.baseHash);
	const afterWrite = resolveConfigWriteAfterWrite(params.afterWrite ?? params.writeOptions?.afterWrite);
	let writeResult = await tryWriteIncludeOwnedConfigMutation({
		snapshot,
		nextConfig,
		deferredPluginMigrations,
		afterWrite,
		writeOptions: mergedWriteOptions,
		io: params.io
	});
	if (writeResult) setDeferredPluginMigrationConfigFacts(writeResult.persistedConfig, deferredPluginMigrations);
	else {
		const fallbackWriteOptions = copyRuntimeConfigWriteApplication(mergedWriteOptions, {
			baseSnapshot: snapshot,
			...mergedWriteOptions,
			afterWrite
		});
		const ioPreCommitRuntimePreflight = params.io ? fallbackWriteOptions.preCommitRuntimePreflight : void 0;
		if (params.io) fallbackWriteOptions.preCommitRuntimePreflight = async (sourceConfig) => {
			await preflightRuntimeSnapshotWrite({
				nextSourceConfig: sourceConfig,
				refreshOptions: fallbackWriteOptions.runtimeRefresh,
				formatRefreshError: (error) => formatErrorMessage(error),
				createRefreshError: (detail, cause) => new Error(`Config write blocked before committing ${snapshot.path}: active SecretRef resolution failed: ${detail}`, { cause })
			});
			await ioPreCommitRuntimePreflight?.(sourceConfig);
		};
		const written = await (params.io?.writeConfigFile ?? writeConfigFile)(nextConfig, fallbackWriteOptions);
		const committed = written?.[configWriteCommittedSnapshot];
		writeResult = {
			persistedHash: committed?.hash ?? (written && !containsConfigIncludeDirective(written.persistedConfig) ? written.persistedHash : null),
			persistedConfig: committed?.sourceConfig ?? written?.persistedConfig ?? nextConfig,
			persistedSourceConfig: written?.persistedSourceConfig
		};
	}
	return {
		path: snapshot.path,
		previousHash,
		snapshot,
		nextConfig: writeResult.persistedConfig,
		persistedHash: writeResult.persistedHash,
		persistedSourceConfig: writeResult.persistedSourceConfig,
		afterWrite,
		followUp: resolveConfigWriteFollowUp(afterWrite)
	};
}
async function commitPreparedConfigMutation(params) {
	const result = await replaceConfigFileUnlocked({
		nextConfig: params.nextConfig,
		snapshot: params.snapshot,
		baseHash: params.baseHash,
		writeOptions: copyRuntimeConfigWriteApplication(params.writeOptions, {
			...params.writeOptions,
			afterWrite: params.afterWrite
		}),
		io: params.io
	});
	return {
		config: result.nextConfig,
		persistedHash: result.persistedHash,
		persistedSourceConfig: result.persistedSourceConfig,
		afterWrite: result.afterWrite
	};
}
async function transformConfigFileAttempt(params, attempt, ownership, prepared) {
	ownership?.assertConfigPathForWrite?.();
	const { snapshot, writeOptions } = prepared ?? await readConfigSnapshotForMutation({
		...ownership?.ownedConfigPathForWrite ? { ownedConfigPathForWrite: ownership.ownedConfigPathForWrite } : {},
		io: params.io,
		writeOptions: params.writeOptions
	});
	let mergedWriteOptions = mergeConfigMutationWriteOptions(writeOptions, params.writeOptions);
	if (ownership) {
		if (!ownership.initialized) {
			ownership.initialized = true;
			ownership.expectedConfigPath = mergedWriteOptions.expectedConfigPath ?? snapshot.path;
			ownership.ownedConfigPathForWrite = mergedWriteOptions.ownedConfigPathForWrite;
			ownership.assertConfigPathForWrite = mergedWriteOptions.assertConfigPathForWrite;
		}
		mergedWriteOptions = copyRuntimeConfigWriteApplication(mergedWriteOptions, {
			...mergedWriteOptions,
			expectedConfigPath: ownership.expectedConfigPath,
			...ownership.ownedConfigPathForWrite ? { ownedConfigPathForWrite: ownership.ownedConfigPathForWrite } : {},
			...ownership.assertConfigPathForWrite ? { assertConfigPathForWrite: ownership.assertConfigPathForWrite } : {}
		});
	}
	mergedWriteOptions.assertConfigPathForWrite?.();
	assertExpectedConfigPathMatches(snapshot, mergedWriteOptions.expectedConfigPath);
	assertConfigWriteAllowedInCurrentMode({ configPath: snapshot.path });
	markActiveConfigMutationPath(snapshot.path);
	const previousHash = assertBaseHashMatches(snapshot, params.baseHash);
	const baseConfig = params.base === "runtime" ? snapshot.runtimeConfig : snapshot.sourceConfig;
	mergedWriteOptions.inputBase = params.base ?? "source";
	const afterWrite = resolveConfigWriteAfterWrite(params.afterWrite ?? params.writeOptions?.afterWrite);
	const transformed = await params.transform(baseConfig, {
		snapshot,
		previousHash,
		attempt
	}, { envSnapshotForRestore: writeOptions.envSnapshotForRestore });
	const committed = await (params.commit ?? commitPreparedConfigMutation)({
		nextConfig: transformed.nextConfig,
		snapshot,
		...previousHash !== null ? { baseHash: previousHash } : {},
		writeOptions: mergedWriteOptions,
		afterWrite,
		io: params.io
	});
	const committedAfterWrite = committed.afterWrite ?? afterWrite;
	return {
		path: snapshot.path,
		previousHash,
		snapshot,
		nextConfig: committed.config,
		persistedHash: committed.persistedHash,
		persistedSourceConfig: committed.persistedSourceConfig,
		result: transformed.result,
		attempts: attempt + 1,
		afterWrite: committedAfterWrite,
		followUp: resolveConfigWriteFollowUp(committedAfterWrite)
	};
}
async function transformConfigFile(params) {
	params.writeOptions?.assertConfigPathForWrite?.();
	if (!params.io) return await withConfigMutationSnapshotLock({ writeOptions: params.writeOptions }, async (prepared) => await transformConfigFileAttempt(params, 0, createConfigMutationOwnership(prepared, params.writeOptions), prepared));
	return await withConfigMutationLock({
		io: params.io,
		assertCurrent: params.writeOptions?.assertCurrent
	}, async () => await transformConfigFileAttempt(params, 0));
}
async function transformConfigFileWithRetry(params) {
	params.writeOptions?.assertConfigPathForWrite?.();
	const maxAttempts = params.maxAttempts ?? DEFAULT_CONFIG_MUTATION_RETRY_ATTEMPTS;
	if (!Number.isInteger(maxAttempts) || maxAttempts < 1) throw new Error("Config mutation maxAttempts must be a positive integer.");
	const runWithPrepared = async (prepared) => {
		const ownership = prepared ? createConfigMutationOwnership(prepared, params.writeOptions) : {
			initialized: false,
			expectedConfigPath: ""
		};
		for (let attempt = 0; attempt < maxAttempts; attempt += 1) try {
			return await transformConfigFileAttempt(params, attempt, ownership, attempt === 0 ? prepared : void 0);
		} catch (err) {
			if (err instanceof ConfigMutationConflictError && err.retryable && attempt < maxAttempts - 1) continue;
			throw err;
		}
		throw new Error("Config mutation retry loop exhausted unexpectedly.");
	};
	if (!params.io) return await withConfigMutationSnapshotLock({ writeOptions: params.writeOptions }, runWithPrepared);
	return await withConfigMutationLock({
		io: params.io,
		assertCurrent: params.writeOptions?.assertCurrent
	}, async () => await runWithPrepared());
}
async function mutateConfigFile(params) {
	return await transformConfigFile({
		base: params.base,
		baseHash: params.baseHash,
		afterWrite: params.afterWrite,
		writeOptions: params.writeOptions,
		io: params.io,
		transform: async (currentConfig, context) => {
			const draft = structuredClone(currentConfig);
			return {
				nextConfig: draft,
				result: await params.mutate(draft, context)
			};
		}
	});
}
async function mutateConfigFileWithRetry(params) {
	return await transformConfigFileWithRetry({
		base: params.base,
		baseHash: params.baseHash,
		maxAttempts: params.maxAttempts,
		afterWrite: params.afterWrite,
		writeOptions: params.writeOptions,
		io: params.io,
		transform: async (currentConfig, context) => {
			const draft = structuredClone(currentConfig);
			return {
				nextConfig: draft,
				result: await params.mutate(draft, context)
			};
		}
	});
}
//#endregion
export { transformConfigFile as a, withConfigMutationLock as c, resolveConfigIncludeWriteBoundary as i, mutateConfigFileWithRetry as n, transformConfigFileWithRetry as o, replaceConfigFile as r, withConfigMutationExclusive as s, mutateConfigFile as t };
