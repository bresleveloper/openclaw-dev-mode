import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { i as formatInvalidConfigDetails, r as createInvalidConfigError } from "./io.invalid-config-BzeD3bi5.mjs";
import { r as resolveConfigEnvVars } from "./env-substitution-mBnQ8cYd.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { l as resolveConfigIncludeWritePath, n as ConfigIncludeError, o as hashConfigIncludeRaw, p as isPathInside, s as isInternalIncludeWriteTarget } from "./includes-BkzfmxST.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { m as withConfigReadEnvChanges, o as createConfigRuntimeEnvBase, r as cloneEnvWithPlatformSemantics, s as getPublishedConfigRuntimeEnvState, t as applyConfigEnvVars } from "./config-env-vars-DjPHKieF.mjs";
import { L as projectIncludeModelPolicyWrite } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as hashConfigRaw, n as containsConfigIncludeDirective, p as resolveConfigSnapshotHash } from "./io.read-helpers-Bvdjf9tk.mjs";
import { m as withDeferredPluginMigrationsCurrent, o as readConfigWritePendingMigrations, p as withDeferredPluginConfigRollback } from "./deferred-plugin-migrations-by1ypkxx.mjs";
import { s as resolveManagedRuntimeEnvBaseline, t as createConfigIO } from "./io.factory-GdHkk8Z_.mjs";
import { S as hasWebhookMigrationProgress, _ as captureConfigWriteLockGuard, b as withConfigWriteLock, h as rollbackConfigFileWriteIfUnchanged, l as createConfigFileWriteGuard, o as captureConfigFileWritePathProof, r as warnIfJSON5CommentsWillBeStripped, v as markActiveConfigMutationPath } from "./io.warnings-Dz_nq5SM.mjs";
import { t as getConfigValueAtPath } from "./config-paths-Bb7WEbv8.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { n as createConfigWriteAuthorityGuard } from "./write-authority-BBYsD_pp.mjs";
import { h as recordUpdateDoctorConfigFileWrite, o as assertUpdateDoctorConfigInputHash } from "./update-doctor-result-yVslo54h.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-6uPuICvJ.mjs";
import { c as resolveManagedUnsetPathsForWrite, i as preserveDeferredPluginMigrationConfig, o as setDeferredPluginMigrationConfigFacts, s as applyUnsetPathsForWrite } from "./deferred-plugin-migration-config-Db8uALnk.mjs";
import { n as getLegacyTopLevelIncludeBoundary, r as resolveIncludeWriteBoundary, t as collectChangedConfigPaths } from "./include-write-boundary-Cv161pwQ.mjs";
import { S as resolveConfigWriteFollowUp, c as getRuntimeConfigSnapshotRefreshHandler, g as preflightRuntimeSnapshotWrite, h as preflightManagedRuntimeConfigWrite, i as finalizeRuntimeSnapshotWrite, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot, u as hasManagedRuntimeConfigWriteOwner, x as resolveConfigWriteAfterWrite } from "./runtime-snapshot-DYptB0Cf.mjs";
import { r as projectLegacyRuntimeConfigWrite } from "./runtime-source-projection-rvQFgz1Z.mjs";
import { r as validateConfigObjectWithPlugins } from "./validation-BeAnc62d.mjs";
import { t as GATEWAY_CONFIG_SELECTION_ENV_KEYS } from "./gateway-env-selection-B-LO0cRL.mjs";
import { i as resolveWriteEnvSnapshotForPath, n as configWriteCommittedSnapshot } from "./io.types-E3Nszhk8.mjs";
import { o as recoverConfigWriteFailure } from "./io.write-errors-DuSgsySH.mjs";
import { D as publishRuntimeConfigWrite, S as writeConfigFile, u as readConfigFileSnapshotForWrite, w as copyRuntimeConfigWriteApplication } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { i as projectConfigWriteSource, n as prepareConfigWriteValues, t as injectExplicitlySetPaths } from "./io.write-prepare-DWaupA4w.mjs";
import { n as prepareConfigFileWrite } from "./backup-rotation-C9pxGn3m.mjs";
import { t as rejectConfigNonFiniteNumbers } from "./value-tree-3oLf9xok.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
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
	const restored = await rollbackConfigFileWriteIfUnchanged({
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
		destinationHardlinks: "reject",
		withPublication: params.pathProof.withPublication
	});
	if (restored) recordUpdateDoctorConfigFileWrite(params.target.absolutePath, hashConfigRaw(params.committedRaw), hashConfigRaw(params.previousRaw));
	return restored;
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
	const writeGuard = createConfigFileWriteGuard(targetAtCommit.absolutePath, fs, assertCurrent, {
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
			writeGuard.assertPublishedIdentity();
		},
		captureRollbackProof: () => writeGuard.captureRollbackProof(params.assertOwnerForRollback),
		withPublication: (publish, didMutate) => withDeferredPluginConfigRollback({
			configPath: params.configPath,
			env: params.env,
			assertCurrent: params.assertOwnerForRollback
		}, publish, didMutate)
	};
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const preparedFile = _usingCtx$1.a(await prepareConfigFileWrite({
				configPath: targetAtCommit.absolutePath,
				previousRaw: currentRaw,
				content,
				fsModule: writeGuard.fileSystem,
				assertCurrent: writeGuard.assertCurrent,
				assertBeforeMutation: writeGuard.assertBeforeMutation,
				onDestinationState: writeGuard.onDestinationState,
				destinationHardlinks: "reject",
				durable: true
			}));
			await params.beforeCommit?.();
			writeGuard.assertCurrent();
			withDeferredPluginMigrationsCurrent({
				env: params.env,
				configPath: params.configPath,
				expectedPending: params.deferredPluginMigrations
			}, () => {
				preparedFile.publish();
				publication.phase = "published";
				recordUpdateDoctorConfigFileWrite(targetAtCommit.absolutePath, hashConfigRaw(currentRaw), hashConfigRaw(content));
			});
			await params.assertIncludeGraphForWrite(hashConfigIncludeRaw(content));
			writeGuard.assertCurrent();
			writeGuard.assertPublishedIdentity();
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch (error) {
		if (publication.phase === "unpublished") throw error;
		return await recoverConfigWriteFailure({
			configPath: targetAtCommit.absolutePath,
			publication: publication.phase === "removed" ? "partial" : "complete",
			cause: error,
			restoreFile: () => rollbackJsonFileWriteIfUnchanged({
				target: targetAtCommit,
				previousRaw: currentRaw,
				committedRaw: publication.phase === "published" ? content : null,
				pathProof: publicationProof
			})
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
		expectedConfigPath: mergedWriteOptions.expectedConfigPath ?? prepared.snapshot.path,
		ownedConfigPathForWrite: mergedWriteOptions.ownedConfigPathForWrite,
		assertConfigPathForWrite: mergedWriteOptions.assertConfigPathForWrite
	};
}
async function withConfigMutationSnapshotLock(writeOptions, fn) {
	let lockPath = path.resolve(writeOptions?.ownedConfigPathForWrite ?? resolveConfigPath());
	for (let attempt = 0; attempt < 3; attempt += 1) {
		writeOptions?.assertConfigPathForWrite?.();
		const outcome = await withConfigMutationLock({
			lockPath,
			assertCurrent: writeOptions?.assertCurrent
		}, async () => {
			const prepared = await readConfigSnapshotForMutation({
				ownedConfigPathForWrite: writeOptions?.ownedConfigPathForWrite,
				writeOptions
			});
			captureConfigWriteLockGuard(lockPath)?.();
			writeOptions?.assertConfigPathForWrite?.();
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
	return await withConfigMutationSnapshotLock(void 0, (prepared) => fn(prepared.snapshot.sourceConfig));
}
/**
* One include-owned write decision for the guarded writer and Doctor's
* eligibility check; a split decision lets Doctor advertise an include write
* that the writer then declines. Null means the write belongs to the root writer.
*/
function resolveIncludeOwnedWriteCandidate(params) {
	if (params.writeOptions?.persistCanonicalAgentRoster === true || hasWebhookMigrationProgress(params.snapshot.sourceConfig, params.nextConfig)) return null;
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
	const nextConfig = projectIncludeModelPolicyWrite({
		config: values.authoredConfig,
		previousConfig: params.snapshot.sourceConfig,
		explicitSetPaths: params.writeOptions?.explicitSetPaths
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
	if (params.writeOptions?.allowIncludeAncestorExplicitSetPaths && params.writeOptions.explicitSetPaths?.some((segments) => segments.length > boundary.boundaryPath.length && boundary.boundaryPath.every((part, index) => part === segments[index]))) return null;
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
	return await withConfigWriteLock(params.snapshot.path, () => withConfigWriteLock(expectedIncludeTarget, async () => {
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
		let restorePostWriteEnv;
		try {
			assertPostCommitCurrent();
			if (runtimeEnvBaseline) assertManagedRuntimeEnvGeneration(runtimeEnvBaseline.generation);
			if (params.writeOptions?.skipRuntimeSnapshotRefresh && !hadRuntimeSnapshot && !getRuntimeConfigSnapshotRefreshHandler()) return {
				persistedHash: null,
				persistedConfig: runtimeConfigToWrite,
				persistedSourceConfig: runtimeConfigToWrite
			};
			const refreshed = await withConfigReadEnvChanges(writeEnv, (restore) => {
				restorePostWriteEnv = restore;
				return withConfigWriteLock(params.snapshot.path, () => readConfigSnapshotForMutation({
					ownedConfigPathForWrite: params.snapshot.path,
					io: params.io,
					writeOptions: {
						...params.writeOptions,
						observe: false
					}
				}), writeEnv, assertPostCommitCurrent);
			});
			assertPostCommitCurrent();
			const refreshedSnapshot = refreshed.snapshot;
			await assertIncludeGraphForWrite(committedIncludeHash);
			assertPostCommitCurrent();
			assertExpectedConfigPathMatches(refreshedSnapshot, params.snapshot.path);
			const persistedHash = resolveConfigSnapshotHash(refreshedSnapshot);
			if (!refreshedSnapshot.valid) throw createInvalidConfigError(params.snapshot.path, formatInvalidConfigDetails(refreshedSnapshot.issues));
			if (!persistedHash) throw new Error(`No persisted config hash was available after rereading ${params.snapshot.path}.`);
			const notifyCommittedWrite = () => {
				publishRuntimeConfigWrite({
					configPath: params.snapshot.path,
					snapshot: refreshedSnapshot,
					sourceConfig: refreshedSnapshot.sourceConfig,
					runtimeConfig: refreshedSnapshot.runtimeConfig,
					persistedHash,
					deferRuntimeActivation,
					preparedCandidates: managedPreparedCandidates,
					writeOptions: params.writeOptions,
					afterWrite: params.afterWrite
				});
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
			return await recoverConfigWriteFailure({
				configPath: includeTarget.absolutePath,
				cause: error,
				restoreFile: () => rollbackJsonFileWriteIfUnchanged({
					target: includeTarget,
					previousRaw: previousIncludeRaw,
					committedRaw: committedIncludeRaw,
					pathProof
				}),
				restoreEffects: () => {
					assertScopedOwner();
					restorePostWriteEnv?.();
				}
			});
		}
	}, writeEnv, assertOwner), writeEnv, assertOwner);
}
async function replaceConfigFile(params) {
	params.writeOptions?.assertConfigPathForWrite?.();
	if (!params.snapshot && !params.io) return await withConfigMutationSnapshotLock(params.writeOptions, async (prepared) => await replaceConfigFileUnlocked({
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
	const deferredPluginMigrations = readConfigWritePendingMigrations(snapshot.path, params.io?.env);
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
		if (ownership.expectedConfigPath === void 0) {
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
	if (!params.io) return await withConfigMutationSnapshotLock(params.writeOptions, async (prepared) => await transformConfigFileAttempt(params, 0, createConfigMutationOwnership(prepared, params.writeOptions), prepared));
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
		const ownership = prepared ? createConfigMutationOwnership(prepared, params.writeOptions) : {};
		for (let attempt = 0; attempt < maxAttempts; attempt += 1) try {
			return await transformConfigFileAttempt(params, attempt, ownership, attempt === 0 ? prepared : void 0);
		} catch (err) {
			if (err instanceof ConfigMutationConflictError && err.retryable && attempt < maxAttempts - 1) continue;
			throw err;
		}
		throw new Error("Config mutation retry loop exhausted unexpectedly.");
	};
	if (!params.io) return await withConfigMutationSnapshotLock(params.writeOptions, runWithPrepared);
	return await withConfigMutationLock({
		io: params.io,
		assertCurrent: params.writeOptions?.assertCurrent
	}, async () => await runWithPrepared());
}
function configMutationTransform(params) {
	return {
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
	};
}
async function mutateConfigFile(params) {
	return await transformConfigFile(configMutationTransform(params));
}
async function mutateConfigFileWithRetry(params) {
	return await transformConfigFileWithRetry({
		...configMutationTransform(params),
		maxAttempts: params.maxAttempts
	});
}
//#endregion
export { transformConfigFile as a, withConfigMutationLock as c, resolveConfigIncludeWriteBoundary as i, mutateConfigFileWithRetry as n, transformConfigFileWithRetry as o, replaceConfigFile as r, withConfigMutationExclusive as s, mutateConfigFile as t };
