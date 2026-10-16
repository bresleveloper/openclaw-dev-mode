import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { o as runOutsideAsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import { c as isSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as isPathInside$1 } from "./path-guards-CH7noY0Z.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { x as resolveIncludeRoots } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as applyLoggingConfig } from "./logger-Mnn26Jj7.mjs";
import { t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { w as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-Cwkw6Ed6.mjs";
import "./workspace-default-BKv26wgx.mjs";
import { m as serializeConfigResolutionFacts, r as copyConfigResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { i as hashConfigRaw } from "./io.read-helpers-Bvdjf9tk.mjs";
import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import { n as hashStableJson } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { _ as fingerprintConfigSnapshotAuthoredConfig, b as upsertConfigSnapshotAuditRecordAsync, g as configSnapshotAuditRecordMatchesPath, i as appendConfigAuditRecord, o as capConfigAuditIssues, s as capConfigAuditPaths, v as readLatestConfigSnapshotAuditRecordAsync } from "./io.audit-BXzMurur.mjs";
import { t as getConfigValueAtPath } from "./config-paths-Bb7WEbv8.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { r as resolveChannelConfigActivationFacts } from "./channel-config-activation-CjIoaWiA.mjs";
import { E as setRuntimeConfigAppliedHash, M as collectConfiguredModelRefs, S as resolveConfigWriteFollowUp, d as hashRuntimeConfigValue, l as getRuntimeConfigSourceSnapshot, s as getRuntimeConfigSnapshotMetadata } from "./runtime-snapshot-DYptB0Cf.mjs";
import { l as getActivePluginRegistry } from "./runtime-D4MkflNJ.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
import { r as getLoadedChannelPluginEntryById } from "./registry-loaded-BugfxX6l.mjs";
import { E as getRuntimeConfigWriteApplication, r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import "./config-CzeZu5J_.mjs";
import { s as reloadSessionMcpRuntimes } from "./agent-bundle-mcp-manager-api-CsCOZa1-.mjs";
import { i as withPluginLifecycleLease, n as hasPluginLifecycleLeaseDemand, r as runOutsidePluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { r as withPluginInstallRecords } from "./installed-plugin-index-records-VCj98mZ6.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission, y as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { g as hasSameSecretReloadContract, l as getActiveSecretsRuntimeSnapshotRevisionState, p as hasActiveSecretsRuntimeSnapshotLineage, u as getActiveSecretsRuntimeSnapshotState, x as setSecretsRuntimeSourceSnapshotIfCurrent, y as restoreSecretsRuntimeSourceSnapshotIfLineageCurrent } from "./runtime-state-D5wZ6Dom.mjs";
import { s as publishOperatorRoleConfigChange } from "./operator-role-policy-BqPaarjx.mjs";
import { l as runOutsideSetupCredentialAccess } from "./order-B7W96aON.mjs";
import { h as markPreparedModelRuntimeSnapshotsStale, l as beginPreparedModelRuntimePluginDrain, s as advancePreparedModelRuntimeConfig, x as rejectPendingPreparedModelRuntimeReplacement } from "./prepared-model-runtime-B8unFFC9.mjs";
import { h as publishSystemEventStoreConfig } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { T as requestActiveCronJobCancellationByDeclarationKeyPrefix } from "./active-jobs-BS2UT6i2.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-C6PCt2me.mjs";
import { a as resolveFsObservationIntervalMs, i as observationPrefixKind, n as readObservationSnapshot, o as resolveFsObservationMode, r as admitObservationRoot } from "./fs-observation-snapshot-DTptcApl.mjs";
import { _ as isCurrentGatewayReloadGeneration, d as setGatewayRestartPolicy, g as abortPendingChannelReloads, r as deferGatewayRestartUntilIdle, v as isGatewayReloadGenerationAborted, y as nextGatewayReloadGeneration } from "./restart-DQIBmMjt.mjs";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-D2-QpshF.mjs";
import { n as isRestartEnabled } from "./commands.flags-D0cD2TME.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-C8iJzbV2.mjs";
import { r as resetDirectoryCache } from "./target-resolver-BSpO1GUs.mjs";
import "./agent-bundle-mcp-tools-CmVTlZqR.mjs";
import { a as resetContextWindowCache, i as refreshContextWindowCache } from "./context-qaLs5Adf.mjs";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-McXSFzXR.mjs";
import { n as disconnectStaleSharedGatewayAuthClients } from "./server-shared-auth-generation-C2ZgQQOt.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-CRa-OKC_.mjs";
import { l as resetSkillSnapshotConfigFingerprintCache } from "./workspace-skill-loader-CjoWF6nl.mjs";
import { b as commitHookTransformMappingReload, v as resolveHooksConfig } from "./hooks-CO8CJ3qB.mjs";
import { a as getPluginRuntimeGeneration, n as PluginRuntimeApplicationError } from "./lifecycle-CGWepTug.mjs";
import { a as resolvePluginInstallReloadMetadata, n as isNoopGatewayReloadPlan, o as diffConfigPaths, r as listConfigReloadRefinementPrefixes, s as diffGatewayReloadPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-rFxyKwyb.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-De0PJqUq.mjs";
import { n as resolveReloadAgentIds, t as refreshModelRuntimeAfterHotReload } from "./server-reload-model-runtime-scope-cy8BkIse.mjs";
import { t as reviveAgentDatabasesAfterConfigCommit } from "./server-reload-agent-databases-BbZ3naJj.mjs";
import { t as invalidateConfigGetResponseCache } from "./config-get-response--Ct7YLt_.mjs";
import { a as assertConfigReloadWriteSnapshot, i as GatewayReloadRequiresRecoveryOwnerError, n as GatewayHotReloadRecoveryError, o as assertReloadPublicationCurrent, r as GatewayHotReloadStaleSecretsError, s as createReloadCancellationError, t as GatewayConfigReloadSupersededError } from "./server-reload-contracts-pfhyb8Fq.mjs";
import { n as applyGatewayLaneConcurrency, r as resolveGatewayLaneConcurrency, t as resolveHookClientIpConfig } from "./hook-client-ip-config-Cfv8QwAY.mjs";
import { r as startGatewayCronWithLogging } from "./server-runtime-services-C9bLRyXb.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { homedir } from "node:os";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { canonicalPathFromExistingAncestor, isUnsafeDeviceReadPath } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { isPathRelativeEscape } from "@openclaw/fs-safe/path";
import { watch } from "@openclaw/fs-safe/watch";
//#region src/config/source-file-roots.ts
/** Pin observation authority once. Retry uses these same Roots, never replacement identities. */
async function admitConfigObservationRoots(configPath, includeRoots, cache = {
	roots: /* @__PURE__ */ new Map(),
	canonicalBoundaries: /* @__PURE__ */ new Map()
}, primaryTarget, paths = /* @__PURE__ */ new Set()) {
	const primarySource = path.resolve(configPath);
	const selectedPaths = /* @__PURE__ */ new Set([primarySource, ...paths]);
	const lexicalBoundaries = Array.from(/* @__PURE__ */ new Set([path.dirname(path.resolve(configPath)), ...includeRoots.filter((entry) => path.isAbsolute(entry)).map((entry) => path.resolve(entry))]));
	const boundaries = new Set(lexicalBoundaries);
	const aliases = /* @__PURE__ */ new Map();
	let unresolvedRootFailure;
	for (const boundary of lexicalBoundaries) {
		const canonical = getOrCreatePromise(cache.canonicalBoundaries, boundary, () => canonicalPathFromExistingAncestor(boundary), { cacheRejections: false });
		try {
			const target = await canonical;
			boundaries.add(target);
			if (target !== boundary) aliases.set(boundary, target);
		} catch (error) {
			if ([...selectedPaths].some((candidate) => isPathInside$1(boundary, candidate))) throw error;
			unresolvedRootFailure ??= { error };
			boundaries.delete(boundary);
		}
	}
	const target = primaryTarget ?? await canonicalPathFromExistingAncestor(primarySource);
	const primaryBoundary = path.dirname(target);
	const candidates = configObservationCandidates(selectedPaths, aliases);
	candidates.add(target);
	if (unresolvedRootFailure && [...candidates].some((candidate) => candidate !== target && ![...boundaries].some((boundary) => isPathInside$1(boundary, candidate)))) throw unresolvedRootFailure.error;
	const admitted = /* @__PURE__ */ new Map();
	for (const boundary of /* @__PURE__ */ new Set([...boundaries, primaryBoundary])) {
		const stableParent = path.dirname(boundary);
		const pinned = getOrCreatePromise(cache.roots, stableParent, () => admitObservationRoot(stableParent), { cacheRejections: false });
		let authority;
		try {
			authority = await pinned;
		} catch (error) {
			if ([...candidates].some((candidate) => isPathInside$1(boundary, candidate))) throw error;
			continue;
		}
		let selected = admitted.get(authority.rootDir);
		if (!selected) {
			selected = {
				authority,
				boundaries: [],
				aliases
			};
			admitted.set(authority.rootDir, selected);
		}
		if (boundaries.has(boundary)) selected.boundaries.push(boundary);
		if (boundary === primaryBoundary) selected.primary = {
			source: primarySource,
			target
		};
	}
	return [...admitted.values()];
}
function configObservationCandidates(paths, aliases = /* @__PURE__ */ new Map()) {
	const candidates = new Set(paths);
	for (const candidate of paths) for (const [source, target] of aliases) if (isPathInside$1(source, candidate)) candidates.add(path.resolve(target, path.relative(source, candidate)));
	return candidates;
}
function configObservationEntries(admitted, paths) {
	const entries = /* @__PURE__ */ new Map();
	const candidates = configObservationCandidates(paths, admitted.aliases);
	if (admitted.primary && paths.has(admitted.primary.source)) candidates.add(admitted.primary.target);
	for (const candidate of candidates) {
		if (candidate !== admitted.primary?.target && !admitted.boundaries.some((boundary) => isPathInside$1(boundary, candidate))) continue;
		const relative = path.relative(admitted.authority.rootDir, candidate) || ".";
		if (!isPathRelativeEscape(relative)) entries.set(relative, candidate);
	}
	return entries;
}
/** Rejected includes beneath links observe the link; unwatchable candidates are omitted. */
async function configObservationScopes(authority, entries, signal, requiredPath) {
	const scopes = /* @__PURE__ */ new Set();
	for (const [relative, absolute] of entries) {
		let selected = relative;
		let parent = ".";
		try {
			const components = relative.split(path.sep).filter((part) => part && part !== ".");
			if (process.platform === "win32" && components.some((component) => component.endsWith(".") || component.endsWith(" ") || isUnsafeDeviceReadPath(component, { platform: "win32" }))) throw new FsSafeError("invalid-path", "Config watch scopes require literal Windows names");
			for (const component of components) {
				signal.throwIfAborted();
				parent = path.join(parent, component);
				const kind = await observationPrefixKind(authority, parent, signal);
				if (kind === "missing") break;
				if (kind !== "directory") {
					selected = parent;
					break;
				}
			}
		} catch (error) {
			if (absolute !== requiredPath && error instanceof FsSafeError && error.code === "invalid-path") {
				entries.delete(relative);
				continue;
			}
			throw error;
		}
		scopes.add(selected);
	}
	return [...scopes].map((relative) => ({
		path: relative,
		kind: "entry"
	}));
}
//#endregion
//#region src/config/source-file-stability.ts
/** Config parsing waits for 200ms of unchanged guarded metadata, not backend readiness. */
function createConfigFileStability(onChange, onError) {
	const files = /* @__PURE__ */ new Map();
	let stopped = false;
	let revision = 0;
	let stableSince = 0;
	let timer;
	let checking;
	let failure;
	const schedule = () => {
		if (!stopped && !timer && !checking) timer = setTimeout(check, 50);
	};
	const check = () => {
		timer = void 0;
		const observedRevision = revision;
		checking = Promise.resolve().then(async () => {
			if (stopped) return;
			let changed = false;
			for (const [root, entries] of files) for (const [relative, previous] of entries) {
				const metadata = await readObservationSnapshot(root, relative);
				const snapshot = metadata && `${metadata.size}:${metadata.mtimeMs}`;
				if (stopped || revision !== observedRevision) return;
				changed ||= snapshot !== previous;
				entries.set(relative, snapshot);
			}
			if (changed) stableSince = performance.now();
			if (!stopped && performance.now() - stableSince >= 200) {
				files.clear();
				onChange();
			}
		}).catch((error) => {
			failure ??= toErrorObject(error, "Config file settling failed");
			onError(error);
		}).finally(() => {
			checking = void 0;
			if (files.size > 0) schedule();
		});
	};
	return {
		dirty(paths) {
			if (stopped) return;
			revision += 1;
			stableSince = performance.now();
			for (const file of paths) {
				const entries = files.get(file.root) ?? /* @__PURE__ */ new Map();
				entries.set(file.relative, void 0);
				files.set(file.root, entries);
			}
			schedule();
		},
		async close() {
			stopped = true;
			clearTimeout(timer);
			await checking;
			files.clear();
			if (failure !== void 0) throw failure;
		}
	};
}
//#endregion
//#region src/config/source-file.ts
const WATCHER_RECREATE_BACKOFF_MS = [
	500,
	2e3,
	5e3
];
function createConfigFileAdapter(opts) {
	let watcher;
	let started = false;
	let stopped = false;
	let acceptedPaths = [...opts.includedPaths ?? []];
	const normalizePaths = (paths) => new Set([opts.path, ...paths].map((entry) => path.resolve(entry)));
	let watchedPaths = normalizePaths(acceptedPaths);
	let primaryTarget;
	let selectionRevision = 0;
	let roots;
	const admittedRoots = {
		roots: /* @__PURE__ */ new Map(),
		canonicalBoundaries: /* @__PURE__ */ new Map()
	};
	let retries = 0;
	let retryTimer;
	let degradedToPolling = false;
	let status = "active";
	const retiring = /* @__PURE__ */ new Set();
	const isCurrent = (source) => !stopped && watcher === source && !source.lifetime.signal.aborted;
	const stability = () => createConfigFileStability(opts.onChange, (error) => opts.log.warn(`config file stability check failed: ${String(error)}`));
	const retire = (source) => {
		const closing = source.close();
		retiring.add(closing);
		closing.then(() => retiring.delete(closing), () => {});
		return closing;
	};
	const refresh = async (next) => {
		const desiredPaths = watchedPaths;
		if (!roots) {
			roots = admitConfigObservationRoots(opts.path, opts.includeRoots ?? resolveIncludeRoots(), admittedRoots, primaryTarget, desiredPaths);
			const admission = roots;
			admission.catch(() => {
				if (roots === admission) roots = void 0;
			});
		}
		const admitted = await roots;
		if (!isCurrent(next) || desiredPaths !== watchedPaths) return;
		primaryTarget ??= admitted.find((entry) => entry.primary)?.primary?.target ?? path.resolve(opts.path);
		const plans = /* @__PURE__ */ new Map();
		for (const boundary of admitted) {
			const entries = [...configObservationEntries(boundary, desiredPaths)];
			for (let offset = 0; offset < entries.length; offset += 128) {
				const selected = new Map(entries.slice(offset, offset + 128));
				const scopes = await configObservationScopes(boundary.authority, selected, next.lifetime.signal, primaryTarget);
				if (!isCurrent(next) || desiredPaths !== watchedPaths) return;
				if (selected.size) plans.set(`${boundary.authority.rootDir}\0${offset}`, {
					root: boundary.authority,
					entries: selected,
					scopes
				});
			}
		}
		if (![...plans.values()].some((plan) => [...plan.entries.values()].includes(primaryTarget))) throw new Error("Primary config watch path requires source-root admission");
		await next.stability.close();
		if (!isCurrent(next) || desiredPaths !== watchedPaths) return;
		next.stability = stability();
		const updates = [];
		for (const [key, source] of next.sources) if (!plans.has(key)) updates.push(source.subscription.close().then(() => {
			next.sources.delete(key);
		}));
		for (const [key, plan] of plans) {
			const existing = next.sources.get(key);
			if (existing) {
				const changed = JSON.stringify(existing.scopes) !== JSON.stringify(plan.scopes);
				Object.assign(existing, plan);
				if (changed) {
					existing.ready = false;
					updates.push(existing.subscription.setScopes(plan.scopes).then(() => {
						existing.ready = true;
					}));
				}
				continue;
			}
			const source = {
				...plan,
				ready: false,
				subscription: watch(plan.root, {
					scopes: plan.scopes,
					mode: next.mode,
					pollIntervalMs: resolveFsObservationIntervalMs(),
					signal: next.lifetime.signal,
					onInvalidate: (hint) => {
						if (!source.ready && hint.reason === "reconcile" && !hint.changes?.length) return;
						const indirect = source.scopes.filter((scope) => !source.entries.has(path.normalize(scope.path)));
						if (source.ready && indirect.length && (!hint.changes || hint.changes.some((change) => change.type === "structural" && indirect.some((scope) => path.normalize(scope.path) === path.normalize(change.path))))) {
							opts.onChange();
							reconcilePaths([...watchedPaths], true).catch((error) => handleWatcherError(next, error));
							return;
						}
						if (hint.changes?.length) retries = 0;
						next.stability.dirty([...source.entries.keys()].map((relative) => ({
							root: source.root,
							relative
						})));
					},
					onHealth: (health) => {
						if (health.state === "unavailable") handleWatcherError(next, health.failure.error, health.mode === "events" && health.failure?.operation === "watch");
					}
				})
			};
			next.sources.set(key, source);
			updates.push(source.subscription.ready.then(() => {
				source.ready = true;
			}));
		}
		await Promise.all(updates);
		if (!isCurrent(next) || desiredPaths !== watchedPaths) return;
		if (next.ready || next.replacement) opts.onChange();
		else opts.onReady?.(() => isCurrent(next));
		next.ready = true;
	};
	const enqueueRefresh = (next) => {
		next.work = next.work.then(async () => {
			if (isCurrent(next)) await refresh(next);
		});
		return next.work.catch((error) => handleWatcherError(next, error));
	};
	const createWatcher = (replacement) => {
		const lifetime = new AbortController();
		let closing;
		const next = {
			lifetime,
			mode: degradedToPolling ? "poll" : resolveFsObservationMode(),
			allowPollingRecovery: process.env.CHOKIDAR_USEPOLLING === void 0,
			sources: /* @__PURE__ */ new Map(),
			work: Promise.resolve(),
			ready: false,
			replacement,
			stability: stability(),
			close() {
				if (!closing) {
					lifetime.abort();
					closing = Promise.allSettled([
						next.work,
						next.stability.close(),
						...[...next.sources.values()].map((source) => source.subscription.close())
					]).then(([, ...results]) => {
						const errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
						if (errors.length) throw new AggregateError(errors, "Config observation retirement failed");
					});
				}
				return closing;
			}
		};
		watcher = next;
		status = "active";
		enqueueRefresh(next);
	};
	const handleWatcherError = (source, error, eventWatchFailed = false) => {
		if (!isCurrent(source)) return;
		watcher = void 0;
		const retirement = retire(source);
		opts.onChange();
		retirement.catch((failure) => {
			status = "disabled";
			clearTimeout(retryTimer);
			opts.log.error(`config watcher close failed; hot-reload disabled: ${String(failure)}`);
		});
		if (stopped) return;
		let backoff = WATCHER_RECREATE_BACKOFF_MS[retries];
		if (backoff === void 0) {
			if (eventWatchFailed && source.mode === "auto" && source.allowPollingRecovery) {
				degradedToPolling = true;
				retries = 0;
				backoff = WATCHER_RECREATE_BACKOFF_MS[0];
				opts.log.warn(`config watcher native retries exhausted; degrading to polling mode: ${String(error)}`);
			} else {
				status = "disabled";
				opts.log.error(`config hot-reload disabled: watcher failed after ${WATCHER_RECREATE_BACKOFF_MS.length} re-create attempts in ${source.mode === "poll" ? "polling" : "native"} mode: ${String(error)}`);
				return;
			}
		} else {
			retries += 1;
			opts.log.warn(`config watcher error; re-creating watcher (attempt ${retries}/${WATCHER_RECREATE_BACKOFF_MS.length} in ${backoff}ms): ${String(error)}`);
		}
		retryTimer = setTimeout(() => {
			retryTimer = void 0;
			retirement.then(() => {
				if (!stopped && !watcher) createWatcher(true);
			}, () => {});
		}, backoff);
	};
	const reconcilePaths = async (paths, changedScope = false) => {
		const revision = ++selectionRevision;
		const nextPaths = normalizePaths(paths);
		const nextPrimary = await canonicalPathFromExistingAncestor(opts.path);
		if (stopped || revision !== selectionRevision) return;
		if (!changedScope && !(nextPrimary !== primaryTarget) && nextPaths.size === watchedPaths.size && [...nextPaths].every((path) => watchedPaths.has(path))) return;
		watchedPaths = nextPaths;
		primaryTarget = nextPrimary;
		roots = void 0;
		if (watcher) await enqueueRefresh(watcher);
	};
	return {
		start: () => {
			if (!started && !stopped) {
				started = true;
				createWatcher(false);
			}
		},
		observePaths: (paths) => reconcilePaths([...acceptedPaths, ...paths]),
		acceptPaths: (paths) => {
			acceptedPaths = [...paths];
			return reconcilePaths(acceptedPaths);
		},
		async stop() {
			stopped = true;
			clearTimeout(retryTimer);
			const previous = watcher;
			watcher = void 0;
			if (previous) retire(previous).catch(() => {});
			const errors = (await Promise.allSettled(retiring)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length) throw new AggregateError(errors, "Config watcher shutdown failed");
		},
		status: () => status
	};
}
//#endregion
//#region src/config/source.ts
function configSourceSnapshotsMatch(left, right) {
	return left.exists === right.exists && left.valid === right.valid && left.hash === right.hash && isDeepStrictEqual(left.sourceConfig, right.sourceConfig) && isDeepStrictEqual(left.includedPaths, right.includedPaths) && isDeepStrictEqual(left.includeProvenance, right.includeProvenance) && isDeepStrictEqual(serializeConfigResolutionFacts(left.sourceConfig), serializeConfigResolutionFacts(right.sourceConfig));
}
/** Source admission is separate from application: reload mode can retain an older runtime. */
function createConfigSource(opts) {
	let stopped = false;
	let observation = {
		revision: 0,
		writerRevision: 0
	};
	let acceptedRevision = 0;
	const observe = (write, notify = true) => {
		if (stopped) return;
		const reconcileFile = write && !observation.write && observation.revision > acceptedRevision;
		const revision = observation.revision + 1;
		observation = {
			revision,
			writerRevision: write ? revision : observation.writerRevision,
			...write ? {
				write,
				snapshot: Promise.resolve(write.snapshot)
			} : {}
		};
		if (notify) opts.onObserved(observation);
		if (reconcileFile) observe();
	};
	const files = createConfigFileAdapter({
		path: opts.path,
		includedPaths: opts.includedPaths,
		onChange: () => observe(),
		onReady: opts.onReady,
		log: opts.log
	});
	const unsubscribe = opts.subscribeToWrites?.((write) => {
		if (write.configPath === opts.path) observe(write);
	});
	return {
		get observation() {
			return observation;
		},
		start: files.start,
		observe,
		accept(revision) {
			if (revision === observation.revision) acceptedRevision = revision;
		},
		readSnapshot(current = observation) {
			return current.snapshot ??= opts.readSnapshot();
		},
		observePaths: files.observePaths,
		acceptPaths: files.acceptPaths,
		status: files.status,
		async stop() {
			stopped = true;
			unsubscribe?.();
			await files.stop();
		}
	};
}
//#endregion
//#region src/gateway/config-applied-revision.ts
function createConfigAppliedRevisionTracker(options) {
	let pending = null;
	const flush = async (currentConfig) => {
		const owner = pending;
		if (!owner) return;
		await options.onConfigApplied?.(owner.plan, currentConfig);
		options.onRevisionApplied?.(owner.hash);
		if (pending === owner) pending = null;
	};
	return {
		defer: (plan, hash) => {
			pending = {
				plan,
				hash
			};
		},
		flush,
		apply: async (plan, config, hash) => {
			if (pending?.plan === plan) {
				await flush(config);
				return;
			}
			await options.onConfigApplied?.(plan, config);
			options.onRevisionApplied?.(hash);
		}
	};
}
//#endregion
//#region src/gateway/config-reload-plugin-drain.ts
function isConfigReloadSuperseded(error) {
	return (error instanceof PluginRuntimeApplicationError && !error.details.committed ? error.cause : error) instanceof GatewayConfigReloadSupersededError;
}
/** Retain a failed automatic drain until its generation or pending settings settle. */
function createConfigPluginDrainTracker() {
	let failure;
	const hasPendingFailure = (plan) => failure?.paths.some((failedPath) => plan?.changedPaths.some((path) => path === failedPath || path.startsWith(`${failedPath}.`) || failedPath.startsWith(`${path}.`))) ?? false;
	return {
		assertCanApply(plan) {
			if (failure && failure.error.details.generation !== getPluginRuntimeGeneration()) failure = void 0;
			if (plan.reloadPlugins && failure && !plan.pluginLifecycle?.waitForDrain && hasPendingFailure(plan)) throw failure.error;
		},
		recordFailure(plan, error) {
			if (!plan.pluginLifecycle && error instanceof PluginRuntimeApplicationError && error.details.phase === "drain" && !error.details.committed && !isConfigReloadSuperseded(error)) failure = {
				error,
				paths: plan.reloadPluginPaths ?? [],
				reported: false
			};
		},
		applied(plan, runtime) {
			if (!plan?.reloadPlugins || runtime || !hasPendingFailure(plan)) failure = void 0;
		},
		shouldReport(error) {
			if (!failure || error !== failure.error) return true;
			const report = !failure.reported;
			failure.reported = true;
			return report;
		}
	};
}
//#endregion
//#region src/gateway/config-reload.ts
const MISSING_CONFIG_RETRY_DELAY_MS = 150;
const MISSING_CONFIG_MAX_RETRIES = 2;
const LEASE_RETRY_INITIAL_DELAY_MS = 250;
const LEASE_RETRY_MAX_DELAY_MS = 5e3;
function startGatewayConfigReloader(opts) {
	const runInReloadContext = AsyncLocalStorage.snapshot();
	const initialSourceConfig = opts.initialCompareConfig ?? opts.initialConfig;
	let currentConfig = opts.initialConfig;
	let currentCompareConfig = initialSourceConfig;
	let currentSourceConfig = initialSourceConfig;
	let currentRawHash = opts.initialSnapshotRawHash;
	let lastObservedRawHash = opts.initialSnapshotRawHash;
	let currentFingerprintedAuthoredConfig = fingerprintConfigSnapshotAuthoredConfig(opts.initialAuthoredConfig, {
		env: process.env,
		homedir
	});
	let currentRuntimeEnvSourceConfig = initialSourceConfig;
	let currentReapplyRuntimeOverlays = (config) => config;
	let currentRuntimeRefresh;
	const resolveSettings = (config) => resolveGatewayReloadSettings(config, opts.testDebounceMs);
	let settings = resolveSettings(currentConfig);
	let reloadJob = null;
	let leaseRetryDelayMs = 0;
	let pending = false;
	let running = false;
	let stopped = false;
	let initialized = false;
	const lifecycle = new AbortController();
	const withRestartPreparation = (ownership, checkpointOwned, run) => runOutsidePluginLifecycleLease(() => withPluginLifecycleLease({
		signal: lifecycle.signal,
		processBound: true
	}, async (lease) => {
		const current = {
			...ownership,
			assertInvokerOwned: () => lease.assertOwned(),
			checkpoint: () => checkpointOwned(() => lease.assertOwned())
		};
		await current.checkpoint();
		const result = await run(current);
		await current.checkpoint();
		return result;
	}));
	let watcherReload;
	const activeReloads = /* @__PURE__ */ new Set();
	let pluginOperationTail = Promise.resolve();
	let missingConfigRetries = 0;
	const observationReads = /* @__PURE__ */ new WeakMap();
	let pendingInProcessConfig = null;
	let activeInProcessConfig = null;
	let retryWriteCandidate = null;
	let acceptedSourceSnapshot;
	let lastSourceOnly;
	const assertSourceLive = () => {
		if (stopped) throw new GatewayConfigReloadSupersededError();
	};
	const appendExternalAudit = async (record) => {
		await appendConfigAuditRecord({
			env: process.env,
			homedir,
			record: {
				ts: (/* @__PURE__ */ new Date()).toISOString(),
				source: "config-io",
				event: "config.external",
				configPath: opts.watchPath,
				...record
			}
		});
	};
	let currentSnapshotSlot = null;
	const updateAcceptedSnapshot = async (rawHash, authoredConfig) => {
		const fingerprinted = fingerprintConfigSnapshotAuthoredConfig(authoredConfig, {
			env: process.env,
			homedir
		});
		const updatedSlot = await upsertConfigSnapshotAuditRecordAsync({
			configPath: opts.watchPath,
			rawHash,
			authoredConfig,
			expectedSnapshot: currentSnapshotSlot
		}, assertSourceLive);
		currentRawHash = rawHash;
		currentFingerprintedAuthoredConfig = fingerprinted;
		if (updatedSlot) {
			currentSnapshotSlot = updatedSlot;
			return;
		}
		currentSnapshotSlot = await readLatestConfigSnapshotAuditRecordAsync(void 0, assertSourceLive);
		if (configSnapshotAuditRecordMatchesPath(currentSnapshotSlot, opts.watchPath)) {
			currentRawHash = currentSnapshotSlot.rawHash;
			currentFingerprintedAuthoredConfig = currentSnapshotSlot.fingerprintedAuthoredConfig;
		}
	};
	const readCurrentInstallRecords = () => withPluginCache(createPluginCache(), loadInstalledPluginIndexInstallRecords);
	let currentPluginInstallRecords = {};
	let completedPluginApplication;
	const pluginDrain = createConfigPluginDrainTracker();
	const readPluginInstallRecords = opts.readPluginInstallRecords ?? readCurrentInstallRecords;
	const appliedRevision = createConfigAppliedRevisionTracker({
		onConfigApplied: opts.onConfigApplied,
		onRevisionApplied: opts.onConfigRevisionApplied
	});
	const clearReloadTimer = () => {
		reloadJob?.cancel();
		reloadJob = null;
	};
	const scheduleAfter = (wait) => {
		if (stopped || !initialized || opts.scheduler.signal.aborted) return;
		reloadJob = runInReloadContext(() => opts.scheduler.schedule({
			id: "config:reload",
			delayMs: Math.max(wait, leaseRetryDelayMs),
			run: startTrackedReload
		}));
	};
	const schedule = () => {
		scheduleAfter(pendingInProcessConfig ? 0 : settings.debounceMs);
	};
	const prepareRestart = async (plan, nextConfig, ownership, sourceConfig) => {
		try {
			await opts.onRestart(plan, nextConfig, ownership, sourceConfig);
		} catch (err) {
			if (isConfigReloadSuperseded(err)) opts.log.info(`config restart superseded: ${String(err)}`);
			else opts.log.error(`config restart failed: ${String(err)}`);
			throw err;
		}
	};
	const handleMissingSnapshot = (snapshot) => {
		if (snapshot.exists) {
			missingConfigRetries = 0;
			return false;
		}
		if (missingConfigRetries < MISSING_CONFIG_MAX_RETRIES) {
			missingConfigRetries += 1;
			source.observe();
			opts.log.info(`config reload retry (${missingConfigRetries}/${MISSING_CONFIG_MAX_RETRIES}): config file not found`);
			scheduleAfter(MISSING_CONFIG_RETRY_DELAY_MS);
			return true;
		}
		opts.log.warn("config reload skipped (config file not found)");
		return true;
	};
	const applySnapshot = async (sourceSnapshot, candidate, initialEpoch = source.observation.revision, { pluginLifecycle, onRuntimeCommitted, assertInvokerOwned: pluginInvokerGuard } = {}) => {
		let transactionEpoch = initialEpoch;
		const { hash: persistedHash } = sourceSnapshot;
		const { config: candidateRuntimeConfig = sourceSnapshot.config, compareConfig: nextSourceConfig = sourceSnapshot.sourceConfig, afterWrite, preparedCandidate: preflightCandidate, runtimeRefresh, application } = candidate ?? {};
		const settleRuntimeApplication = (result = "applied") => {
			const status = typeof result === "string" ? result : result.status;
			application?.settle(opts.hasOutstandingGatewayRestart?.() ? "applied-restart-required" : status);
		};
		let nextPluginInstallRecords = currentPluginInstallRecords;
		let committedRuntimeConfig = null;
		let rejected = false;
		const isCurrent = () => !stopped && !rejected && source.observation.revision === transactionEpoch;
		const assertInvokerOwned = () => {
			if (!committedRuntimeConfig) pluginInvokerGuard?.();
		};
		const assertCurrent = () => {
			assertInvokerOwned();
			assertReloadPublicationCurrent(isCurrent(), false);
		};
		const checkpointOwned = async (assertOwned) => {
			if (stopped || rejected) throw new GatewayConfigReloadSupersededError();
			assertOwned();
			if (source.observation.revision !== transactionEpoch) {
				const observed = source.observation;
				if (observed.writerRevision > transactionEpoch) throw new GatewayConfigReloadSupersededError();
				let read = observationReads.get(observed);
				if (!read) {
					read = Promise.all([source.readSnapshot(observed), readPluginInstallRecords()]);
					observationReads.set(observed, read);
				}
				const [snapshot, installs] = await read;
				if (stopped || source.observation !== observed || !snapshot.exists || !snapshot.valid || typeof persistedHash !== "string" || !configSourceSnapshotsMatch(snapshot, sourceSnapshot) || !isDeepStrictEqual(installs, nextPluginInstallRecords)) throw new GatewayConfigReloadSupersededError();
				assertOwned();
				transactionEpoch = observed.revision;
			}
			assertOwned();
			assertReloadPublicationCurrent(isCurrent(), false);
		};
		const checkpoint = async () => {
			try {
				await checkpointOwned(assertInvokerOwned);
			} catch (error) {
				rejected = true;
				throw error;
			}
		};
		const completeApplication = (runtime) => {
			if (isCurrent()) {
				clearReloadTimer();
				pending = false;
				leaseRetryDelayMs = 0;
				source.accept(transactionEpoch);
			}
			return {
				runtime,
				isCurrent
			};
		};
		assertInvokerOwned();
		try {
			nextPluginInstallRecords = await readPluginInstallRecords();
		} catch (err) {
			opts.log.warn(`config reload plugin install record check failed: ${String(err)}`);
		}
		await checkpoint();
		await application?.prepare?.(assertCurrent);
		await checkpoint();
		const preparedCandidate = opts.prepareConfigCandidate ? await opts.prepareConfigCandidate({
			runtimeConfig: candidateRuntimeConfig,
			sourceConfig: nextSourceConfig,
			previousSourceConfig: currentRuntimeEnvSourceConfig
		}) : preflightCandidate;
		if (stopped) throw new GatewayConfigReloadSupersededError();
		assertInvokerOwned();
		const nextConfig = preparedCandidate?.runtimeConfig ?? candidateRuntimeConfig;
		const nextCompareConfig = preparedCandidate?.compareConfig ?? nextSourceConfig;
		const nextConfigRevisionHash = hashRuntimeConfigValue(nextSourceConfig);
		let publishedRuntimeEnv;
		let runtimeEnvCommitted = false;
		const nextSettings = resolveSettings(nextConfig);
		const commitPublishedRuntimeEnv = () => {
			runtimeEnvCommitted = true;
			publishedRuntimeEnv?.commit();
			publishedRuntimeEnv = void 0;
		};
		const ownership = {
			isCurrent,
			checkpoint,
			withRestartPreparation: (run) => withRestartPreparation(ownership, checkpointOwned, run),
			assertInvokerOwned,
			reapplyRuntimeOverlays: preparedCandidate?.reapplyRuntimeOverlays ?? ((config) => config),
			...preparedCandidate?.runtimeEnv ? { runtimeEnv: preparedCandidate.runtimeEnv } : {},
			...runtimeRefresh ? { runtimeRefresh } : {},
			publishRuntimeEnv: () => {
				assertCurrent();
				if (runtimeEnvCommitted) return;
				publishedRuntimeEnv ??= preparedCandidate?.runtimeEnv?.publish();
				assertCurrent();
			},
			rollbackRuntimeEnv: () => {
				if (runtimeEnvCommitted) return;
				publishedRuntimeEnv?.();
				publishedRuntimeEnv = void 0;
			},
			commitRuntimeEnv: commitPublishedRuntimeEnv,
			markRuntimeCommitted: (runtimeConfig, plan) => {
				commitPublishedRuntimeEnv();
				onRuntimeCommitted?.();
				opts.onRuntimeConfigCommitted?.(plan, runtimeConfig);
				committedRuntimeConfig = runtimeConfig;
				acceptedSourceSnapshot = void 0;
				currentConfig = runtimeConfig;
				currentCompareConfig = nextCompareConfig;
				currentSourceConfig = nextSourceConfig;
				currentRuntimeEnvSourceConfig = nextSourceConfig;
				currentReapplyRuntimeOverlays = ownership.reapplyRuntimeOverlays;
				currentRuntimeRefresh = ownership.runtimeRefresh;
				currentPluginInstallRecords = nextPluginInstallRecords;
				settings = resolveSettings(runtimeConfig);
				appliedRevision.defer(plan, nextConfigRevisionHash);
			}
		};
		const configChangedPaths = diffGatewayReloadPaths(currentCompareConfig, nextCompareConfig, listConfigReloadRefinementPrefixes());
		const configInstallMetadata = resolvePluginInstallReloadMetadata(currentCompareConfig, nextCompareConfig);
		await checkpoint();
		assertCurrent();
		const previousPluginInstallConfig = withPluginInstallRecords({}, currentPluginInstallRecords);
		const nextPluginInstallConfig = withPluginInstallRecords({}, nextPluginInstallRecords);
		const pluginInstallRecordChangedPaths = diffConfigPaths(previousPluginInstallConfig, nextPluginInstallConfig);
		const installMetadata = resolvePluginInstallReloadMetadata(previousPluginInstallConfig, nextPluginInstallConfig);
		const changedPaths = [...configChangedPaths, ...pluginInstallRecordChangedPaths];
		await appliedRevision.flush(currentConfig);
		await checkpoint();
		assertCurrent();
		const completed = completedPluginApplication;
		if (pluginLifecycle?.expectedInstallHashes && Object.keys(pluginLifecycle.expectedInstallHashes).length > 0 && completed && completed.runtime.generation === getPluginRuntimeGeneration() && !opts.hasOutstandingGatewayRestart?.() && configSourceSnapshotsMatch(sourceSnapshot, completed.snapshot) && isDeepStrictEqual(nextPluginInstallRecords, completed.installRecords) && Object.entries(pluginLifecycle.expectedInstallHashes).every(([id, hash]) => nextPluginInstallRecords[id] && hashStableJson(nextPluginInstallRecords[id]) === hash)) {
			const registry = getActivePluginRegistry();
			const metadata = getProcessGatewayPluginMetadataSnapshot();
			const expected = pluginLifecycle.expectedSourceDigests ?? {};
			const entries = metadata?.index.plugins.filter((entry) => expected[entry.pluginId] !== void 0) ?? [];
			if (entries.length === Object.keys(expected).length) {
				const { inspectPluginGenerationSources } = await import("./plugin-generation-source-inspection-DGKtRRU0.mjs");
				await checkpoint();
				assertCurrent();
				if (pluginLifecycle.pluginIds.every((id) => {
					const record = registry?.plugins.find((plugin) => plugin.id === id);
					const instance = record && getPluginInstance(record);
					return completed.runtime.pluginIds.includes(id) && (record?.status === "disabled" ? expected[id] === void 0 : record?.status === "loaded" && instance?.acceptingCalls && expected[id] !== void 0 && instance.sourceDigest === expected[id] && completed.runtime.sourceDigests?.[id] === expected[id]);
				}) && completed.runtime.generation === getPluginRuntimeGeneration() && registry === getActivePluginRegistry() && metadata === getProcessGatewayPluginMetadataSnapshot()) {
					const source = inspectPluginGenerationSources(entries.map((entry) => ({
						pluginId: entry.pluginId,
						rootDir: entry.rootDir,
						entryFile: entry.source === entry.manifestPath ? entry.source : void 0
					})));
					for (const [id, digest] of Object.entries(expected)) if (source.sourceDigests[id] !== digest) throw new Error(`Plugin ${id} captured source changed after installation`);
					source.assertSourceCurrent();
					assertCurrent();
					application?.settle("applied");
					return completeApplication(completed.runtime);
				}
			}
		}
		let publishedSource;
		const publishSource = changedPaths.length === 0 && !pluginLifecycle && opts.onEffectiveConfigUnchanged ? async () => {
			publishedSource ??= await opts.onEffectiveConfigUnchanged(nextConfig, ownership, nextSourceConfig);
		} : void 0;
		const commitReloadBaseline = async (options = {}) => {
			await checkpoint();
			assertCurrent();
			await appliedRevision.flush(currentConfig);
			await checkpoint();
			assertCurrent();
			const notifyCommitted = () => {
				opts.log.info(`config source revision ${initialEpoch} accepted (${candidate ? "write" : "file"})`);
				opts.onReloadEnabledChange?.(nextSettings.mode !== "off");
				if (changedPaths.length > 0) opts.onConfigCandidateCommitted?.({
					path: opts.watchPath,
					persistedHash: persistedHash ?? null,
					changedPaths
				});
			};
			const acceptConfig = async () => {
				const acceptedEpoch = transactionEpoch;
				await opts.onConfigAccepted?.(committedRuntimeConfig ?? nextConfig, ownership, nextSourceConfig, {
					runtimeApplied: options.runtimeApplied !== false,
					...publishSource ? { publishSource } : {}
				});
				return acceptedEpoch;
			};
			try {
				let acceptedEpoch = await acceptConfig();
				await checkpoint();
				assertCurrent();
				if (!publishedSource) await publishSource?.();
				await checkpoint();
				assertCurrent();
				await updateAcceptedSnapshot(hashConfigRaw(sourceSnapshot.raw), sourceSnapshot.parsed);
				await checkpoint();
				assertCurrent();
				while (acceptedEpoch !== transactionEpoch) {
					acceptedEpoch = await acceptConfig();
					await checkpoint();
					assertCurrent();
				}
				currentSourceConfig = nextSourceConfig;
				acceptedSourceSnapshot = sourceSnapshot;
				if (options.runtimeApplied === false) {
					lastSourceOnly = {
						hash: persistedHash ?? null,
						config: nextConfig,
						sourceConfig: nextSourceConfig,
						reapplyRuntimeOverlays: ownership.reapplyRuntimeOverlays,
						runtimeRefresh: ownership.runtimeRefresh
					};
					notifyCommitted();
					return;
				}
				ownership.publishRuntimeEnv();
				currentRuntimeEnvSourceConfig = nextSourceConfig;
				if (persistedHash === lastSourceOnly?.hash) lastSourceOnly = void 0;
				currentConfig = committedRuntimeConfig ?? nextConfig;
				currentCompareConfig = nextCompareConfig;
				currentReapplyRuntimeOverlays = ownership.reapplyRuntimeOverlays;
				currentRuntimeRefresh = ownership.runtimeRefresh;
				currentPluginInstallRecords = nextPluginInstallRecords;
				settings = committedRuntimeConfig ? resolveSettings(committedRuntimeConfig) : nextSettings;
				commitPublishedRuntimeEnv();
			} catch (error) {
				ownership.rollbackRuntimeEnv();
				await publishedSource?.rollback();
				throw error;
			}
			notifyCommitted();
		};
		if (changedPaths.length === 0 && !pluginLifecycle) {
			await commitReloadBaseline();
			pluginDrain.applied();
			publishedSource?.commit?.();
			opts.onConfigRevisionApplied?.(nextConfigRevisionHash);
			settleRuntimeApplication();
			return completeApplication();
		}
		const skillsChangedPath = changedPaths.find((path) => path === "skills" || path.startsWith("skills."));
		if (skillsChangedPath !== void 0) {
			bumpSkillsSnapshotVersion({
				reason: "config-change",
				changedPath: skillsChangedPath
			});
			opts.log.info(`skills snapshot invalidated by config change (${skillsChangedPath})`);
		}
		const followUp = resolveConfigWriteFollowUp(pluginLifecycle ? void 0 : afterWrite);
		opts.log.info(changedPaths.length > 0 ? `config change detected; evaluating reload (${changedPaths.join(", ")})` : "plugin metadata changed with identical config; applying plugin lifecycle");
		if (followUp.mode === "none") {
			opts.log.info(`config reload skipped by writer intent (${followUp.reason})`);
			await commitReloadBaseline({ runtimeApplied: false });
			application?.settle("failed");
			return completeApplication();
		}
		const plan = buildGatewayReloadPlan(changedPaths, {
			pluginLifecycle,
			noopPaths: [...configInstallMetadata.noopPaths, ...installMetadata.noopPaths],
			forceChangedPaths: [...configInstallMetadata.forceChangedPaths, ...installMetadata.forceChangedPaths],
			candidateConfig: nextConfig,
			previousConfig: currentConfig,
			previousCompareConfig: currentCompareConfig,
			candidateCompareConfig: nextCompareConfig
		});
		if (nextSettings.mode === "off" && !pluginLifecycle) {
			opts.log.info("config reload disabled (gateway.reload.mode=off)");
			await commitReloadBaseline({ runtimeApplied: false });
			application?.settle("failed");
			return completeApplication();
		}
		if (followUp.requiresRestart) {
			plan.restartGateway = true;
			plan.restartReasons.push(followUp.reason);
		}
		if (application?.requireImmediateApplication && (plan.restartGateway || plan.reloadPlugins)) throw new Error("The plugin or restart requirement changed before activation. Complete that update separately, then retry the saved sign-in.");
		if (plan.restartGateway) {
			await opts.onConfigChange?.(plan, nextConfig);
			await prepareRestart(plan, nextConfig, ownership, nextSourceConfig);
			await commitReloadBaseline();
			application?.settle("restart-pending");
			return completeApplication();
		}
		pluginDrain.assertCanApply(plan);
		const applyRuntime = isNoopGatewayReloadPlan(plan) ? opts.onNoopConfigCommit : opts.onHotReload;
		await opts.onConfigChange?.(plan, nextConfig);
		let applicationStatus;
		try {
			applicationStatus = await applyRuntime(plan, nextConfig, ownership, nextSourceConfig);
		} catch (error) {
			ownership.rollbackRuntimeEnv();
			pluginDrain.recordFailure(plan, error);
			throw error;
		}
		await checkpoint();
		assertCurrent();
		await appliedRevision.apply(plan, nextConfig, nextConfigRevisionHash);
		await commitReloadBaseline();
		settleRuntimeApplication(applicationStatus ?? "applied");
		const runtime = typeof applicationStatus === "object" && applicationStatus.status === "applied" ? applicationStatus.runtime : void 0;
		pluginDrain.applied(plan, runtime);
		if (runtime) completedPluginApplication = {
			runtime,
			snapshot: sourceSnapshot,
			installRecords: nextPluginInstallRecords
		};
		return completeApplication(runtime);
	};
	const promoteAcceptedSnapshot = async (snapshot, reason) => {
		if (!opts.promoteSnapshot || !snapshot.exists || !snapshot.valid) return;
		try {
			await opts.promoteSnapshot(snapshot, reason);
		} catch (err) {
			opts.log.warn(`config reload last-known-good promotion failed: ${String(err)}`);
		}
	};
	const runAcceptedTransaction = async (run, application) => {
		const runTransaction = application?.runTransaction ?? opts.runTransaction;
		await runOutsideSetupCredentialAccess(() => runTransaction ? runTransaction(run) : run());
	};
	const acceptCurrentRuntimeEcho = async (transactionEpoch, snapshot, runtimeApplied, assertLeaseOwned) => {
		const sourceOnly = runtimeApplied ? void 0 : lastSourceOnly;
		const runtimeRefresh = runtimeApplied ? currentRuntimeRefresh : sourceOnly?.runtimeRefresh;
		const checkpointOwned = async (assertOwned) => {
			if (stopped || source.observation.revision !== transactionEpoch) throw new GatewayConfigReloadSupersededError();
			assertOwned();
		};
		const ownership = {
			isCurrent: () => !stopped && source.observation.revision === transactionEpoch,
			checkpoint: () => checkpointOwned(assertLeaseOwned),
			withRestartPreparation: (run) => withRestartPreparation(ownership, checkpointOwned, run),
			reapplyRuntimeOverlays: sourceOnly?.reapplyRuntimeOverlays ?? currentReapplyRuntimeOverlays,
			publishRuntimeEnv: () => {},
			rollbackRuntimeEnv: () => {},
			commitRuntimeEnv: () => {},
			...runtimeRefresh ? { runtimeRefresh } : {},
			markRuntimeCommitted: () => {}
		};
		await runAcceptedTransaction(async () => {
			await appliedRevision.flush(currentConfig);
			assertLeaseOwned();
			if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError();
			await opts.onConfigAccepted?.(sourceOnly?.config ?? currentConfig, ownership, sourceOnly?.sourceConfig ?? currentSourceConfig, { runtimeApplied });
			assertLeaseOwned();
			if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError();
			if (snapshot.valid && typeof snapshot.hash === "string") await updateAcceptedSnapshot(hashConfigRaw(snapshot.raw), snapshot.parsed);
		});
		source.accept(transactionEpoch);
		if (snapshot.valid) await source.acceptPaths(snapshot.includedPaths ?? []);
	};
	const applyWrittenSnapshot = async (snapshot, candidate, epoch, assertLeaseOwned) => {
		const applied = await applySnapshot(snapshot, candidate, epoch, { assertInvokerOwned: assertLeaseOwned });
		if (activeInProcessConfig === candidate) activeInProcessConfig = null;
		if (retryWriteCandidate === candidate) retryWriteCandidate = null;
		await source.acceptPaths(snapshot.includedPaths ?? []);
		if (applied.isCurrent()) await promoteAcceptedSnapshot(snapshot, "in-process-write");
	};
	const runReload = async (assertLeaseOwned) => {
		if (stopped || !initialized) return;
		if (running) {
			pending = true;
			return;
		}
		running = true;
		pending = false;
		clearReloadTimer();
		let attemptedCandidate = null;
		try {
			assertLeaseOwned();
			if (pendingInProcessConfig) {
				const pendingWrite = pendingInProcessConfig;
				attemptedCandidate = pendingWrite;
				pendingInProcessConfig = null;
				activeInProcessConfig = pendingWrite;
				missingConfigRetries = 0;
				try {
					await runAcceptedTransaction(async () => {
						const snapshot = pendingWrite.snapshot;
						assertLeaseOwned();
						assertConfigReloadWriteSnapshot(snapshot);
						if (source.observation.writerRevision > pendingWrite.epoch || activeInProcessConfig !== pendingWrite || snapshot.hash !== pendingWrite.persistedHash || diffConfigPaths(snapshot.sourceConfig, pendingWrite.compareConfig).length > 0) throw new GatewayConfigReloadSupersededError();
						await applyWrittenSnapshot(snapshot, pendingWrite, pendingWrite.epoch, assertLeaseOwned);
					}, pendingWrite.application);
				} catch (err) {
					if (isConfigReloadSuperseded(err) && source.observation.revision > pendingWrite.epoch) pending = true;
					if (source.observation.writerRevision <= pendingWrite.epoch && !pendingInProcessConfig && !retryWriteCandidate) retryWriteCandidate = pendingWrite;
					throw err;
				} finally {
					if (activeInProcessConfig === pendingWrite) activeInProcessConfig = null;
				}
				return;
			}
			const transactionEpoch = source.observation.revision;
			const intentCandidate = retryWriteCandidate;
			attemptedCandidate = intentCandidate;
			const snapshot = await source.readSnapshot();
			assertLeaseOwned();
			if (source.observation.revision !== transactionEpoch) throw new GatewayConfigReloadSupersededError();
			const missingRetriesExhausted = !snapshot.exists && missingConfigRetries >= MISSING_CONFIG_MAX_RETRIES;
			if (handleMissingSnapshot(snapshot)) {
				if (missingRetriesExhausted) intentCandidate?.application?.settle("failed");
				await appliedRevision.flush(currentConfig);
				return;
			}
			await source.observePaths(snapshot.includedPaths ?? []);
			assertLeaseOwned();
			const observedRawHash = hashConfigRaw(snapshot.raw);
			const previousObservedRawHash = lastObservedRawHash;
			const newObservedRawHash = observedRawHash !== previousObservedRawHash;
			lastObservedRawHash = observedRawHash;
			if (intentCandidate && snapshot.valid && configSourceSnapshotsMatch(snapshot, intentCandidate.snapshot)) {
				try {
					await runAcceptedTransaction(async () => {
						await applyWrittenSnapshot(snapshot, intentCandidate, transactionEpoch, assertLeaseOwned);
					}, intentCandidate.application);
				} catch (err) {
					if (source.observation.revision === transactionEpoch && !retryWriteCandidate) retryWriteCandidate = intentCandidate;
					throw err;
				}
				return;
			}
			if (retryWriteCandidate === intentCandidate) {
				intentCandidate?.application?.settle("superseded");
				retryWriteCandidate = null;
			}
			if (acceptedSourceSnapshot && configSourceSnapshotsMatch(snapshot, acceptedSourceSnapshot)) {
				await acceptCurrentRuntimeEcho(transactionEpoch, snapshot, snapshot.hash !== lastSourceOnly?.hash, assertLeaseOwned);
				return;
			}
			acceptedSourceSnapshot = void 0;
			if (!snapshot.valid) {
				if (newObservedRawHash) await appendExternalAudit({
					detectedBy: "watch",
					previousHash: previousObservedRawHash,
					nextHash: observedRawHash,
					valid: false,
					issues: capConfigAuditIssues(formatConfigIssueLines(snapshot.issues, "", { normalizeRoot: true }))
				});
				const issues = formatConfigIssueLines(snapshot.issues, "").join(", ");
				opts.log.warn(`config reload skipped (invalid config): ${issues}`);
				await appliedRevision.flush(currentConfig);
				return;
			}
			const externalChangedPaths = diffConfigPaths(currentSourceConfig, snapshot.sourceConfig);
			const fingerprintedAuthoredChangedPaths = diffConfigPaths(currentFingerprintedAuthoredConfig, fingerprintConfigSnapshotAuthoredConfig(snapshot.parsed, {
				env: process.env,
				homedir
			}));
			const journalChangedPaths = [.../* @__PURE__ */ new Set([...externalChangedPaths, ...fingerprintedAuthoredChangedPaths])];
			const writerSlot = await readLatestConfigSnapshotAuditRecordAsync(void 0, assertSourceLive);
			const matchingWriterSlot = configSnapshotAuditRecordMatchesPath(writerSlot, opts.watchPath) ? writerSlot : null;
			if (newObservedRawHash && (observedRawHash === currentRawHash || matchingWriterSlot?.rawHash !== observedRawHash)) await appendExternalAudit({
				detectedBy: "watch",
				previousHash: previousObservedRawHash,
				nextHash: observedRawHash,
				valid: true,
				...journalChangedPaths.length > 0 ? { changedPaths: capConfigAuditPaths(journalChangedPaths) } : {},
				...journalChangedPaths.length === 0 ? { opaqueChange: true } : {}
			});
			await runAcceptedTransaction(async () => {
				if ((await applySnapshot(snapshot, void 0, transactionEpoch, { assertInvokerOwned: assertLeaseOwned })).isCurrent()) await promoteAcceptedSnapshot(snapshot, "valid-config");
			});
			await source.acceptPaths(snapshot.includedPaths ?? []);
		} catch (err) {
			const superseded = isConfigReloadSuperseded(err);
			if (!superseded || retryWriteCandidate !== attemptedCandidate) attemptedCandidate?.application?.settle(superseded ? "superseded" : "failed");
			if (superseded) opts.log.info(`config reload superseded: ${String(err)}`);
			else if (pluginDrain.shouldReport(err)) opts.log.error(`config reload failed: ${String(err)}`);
			else opts.log.info("config reload deferred: retry the failed plugin reload with --wait");
		} finally {
			running = false;
		}
	};
	function trackReload(reload) {
		activeReloads.add(reload);
		reload.then(() => activeReloads.delete(reload), () => activeReloads.delete(reload));
	}
	function startTrackedReload() {
		if (stopped || !initialized) return;
		if (running || watcherReload) {
			pending = true;
			return;
		}
		let enteredReload = false;
		const reload = runOutsidePluginLifecycleLease(() => withPluginLifecycleLease({
			signal: lifecycle.signal,
			processBound: true
		}, async (lease) => {
			enteredReload = true;
			leaseRetryDelayMs = 0;
			await runReload(() => lease.assertOwned());
		})).catch((error) => {
			if (stopped) return;
			if (!enteredReload && error instanceof OpenClawStateLeaseAcquisitionError && error.outcome.kind === "store-unavailable" && (error.outcome.reason === "lifecycle-busy" || error.outcome.reason === "sqlite-busy")) {
				pending = true;
				leaseRetryDelayMs = Math.min(LEASE_RETRY_MAX_DELAY_MS, leaseRetryDelayMs ? leaseRetryDelayMs * 2 : LEASE_RETRY_INITIAL_DELAY_MS);
				opts.log.warn(`config reload retry in ${leaseRetryDelayMs}ms: ${String(error)}`);
			} else {
				leaseRetryDelayMs = 0;
				opts.log.error(`config reload failed: ${String(error)}`);
			}
		});
		watcherReload = reload;
		activeReloads.add(reload);
		reload.then(() => {
			activeReloads.delete(reload);
			watcherReload = void 0;
			if (pending && !running) {
				pending = false;
				schedule();
			}
		});
		return reload;
	}
	const applyPluginLifecycleChange = (params) => {
		const operationId = randomUUID();
		const operation = pluginOperationTail.then(async () => {
			params.assertInvokerOwned?.();
			await ready;
			params.assertInvokerOwned?.();
			for (;;) {
				const reload = watcherReload;
				if (!running || !reload) break;
				await reload;
			}
			params.assertInvokerOwned?.();
			if (stopped) throw new Error("Gateway plugin lifecycle is stopped.");
			running = true;
			pending ||= reloadJob !== null;
			clearReloadTimer();
			let candidate = pendingInProcessConfig ?? retryWriteCandidate;
			let committed = false;
			try {
				const expectedSourceConfig = params.write ? params.write.persistedSourceConfig : params.config;
				source.observe(void 0, false);
				const epoch = source.observation.revision;
				const snapshot = await source.readSnapshot();
				params.assertInvokerOwned?.();
				if (!snapshot.valid || !snapshot.exists) throw new Error("Plugin runtime application requires a valid persisted config.");
				if (!expectedSourceConfig || params.write && (typeof params.write.persistedHash !== "string" || snapshot.hash !== params.write.persistedHash) || diffConfigPaths(snapshot.sourceConfig, expectedSourceConfig).length > 0) throw new GatewayConfigReloadSupersededError();
				if (pendingInProcessConfig === candidate) pendingInProcessConfig = null;
				activeInProcessConfig = candidate;
				if (source.observation.writerRevision > epoch) throw new GatewayConfigReloadSupersededError();
				const matchesSnapshot = (queued) => queued !== null && configSourceSnapshotsMatch(snapshot, queued.snapshot);
				if (!matchesSnapshot(candidate)) {
					if (candidate !== retryWriteCandidate) candidate?.application?.settle("superseded");
					candidate = matchesSnapshot(retryWriteCandidate) ? retryWriteCandidate : null;
				}
				if (retryWriteCandidate && retryWriteCandidate !== candidate) {
					retryWriteCandidate.application?.settle("superseded");
					retryWriteCandidate = null;
				}
				activeInProcessConfig = candidate;
				const applied = await applySnapshot(snapshot, candidate, epoch, {
					pluginLifecycle: {
						pluginIds: params.pluginIds,
						reason: params.reason,
						operationId,
						...params.waitForDrain ? {
							waitForDrain: true,
							drainSignal: params.drainSignal
						} : {},
						expectedSourceDigests: params.expectedSourceDigests,
						expectedInstallHashes: params.expectedInstallHashes
					},
					onRuntimeCommitted: () => {
						committed = true;
					},
					assertInvokerOwned: params.assertInvokerOwned
				});
				if (!applied.runtime) throw new Error("Plugin runtime application did not produce a completed receipt.");
				if (retryWriteCandidate === candidate) retryWriteCandidate = null;
				await source.acceptPaths(snapshot.includedPaths ?? []);
				if (applied.isCurrent()) await promoteAcceptedSnapshot(snapshot, "plugin-lifecycle");
				return applied.runtime;
			} catch (error) {
				candidate?.application?.settle("failed");
				if (error instanceof PluginRuntimeApplicationError) throw error;
				throw new PluginRuntimeApplicationError(String(error), {
					operationId,
					generation: getPluginRuntimeGeneration(),
					pluginIds: [...params.pluginIds],
					phase: "prepare",
					committed
				}, { cause: error });
			} finally {
				if (activeInProcessConfig === candidate) activeInProcessConfig = null;
				running = false;
				if (pending || pendingInProcessConfig) {
					pending = false;
					schedule();
				}
			}
		});
		pluginOperationTail = operation.catch(() => {});
		trackReload(operation);
		return operation;
	};
	const source = createConfigSource({
		path: opts.watchPath,
		includedPaths: opts.initialIncludedPaths,
		readSnapshot: () => opts.readSnapshot(currentRuntimeEnvSourceConfig),
		subscribeToWrites: opts.subscribeToWrites,
		log: opts.log,
		onReady: (isCurrent) => {
			opts.onWatcherReady?.();
			trackReload(reconcileInitialSource(isCurrent));
		},
		onObserved: (observation) => {
			opts.onConfigCandidateObserved?.();
			const event = observation.write;
			if (!event) {
				if (pendingInProcessConfig || activeInProcessConfig) scheduleAfter(0);
				else schedule();
				return;
			}
			const application = getRuntimeConfigWriteApplication(event)?.claim();
			const pendingRestartIntent = [
				pendingInProcessConfig,
				activeInProcessConfig,
				retryWriteCandidate
			].find((candidate) => candidate?.afterWrite?.mode === "restart")?.afterWrite;
			pendingInProcessConfig?.application?.settle("superseded");
			retryWriteCandidate?.application?.settle("superseded");
			retryWriteCandidate = null;
			const afterWrite = pendingRestartIntent && event.afterWrite?.mode !== "restart" ? pendingRestartIntent : event.afterWrite;
			pendingInProcessConfig = {
				config: event.runtimeConfig,
				compareConfig: event.sourceConfig,
				persistedHash: event.persistedHash,
				snapshot: event.snapshot,
				afterWrite,
				...event.preparedCandidate ? { preparedCandidate: event.preparedCandidate } : {},
				...event.runtimeRefresh ? { runtimeRefresh: event.runtimeRefresh } : {},
				...application ? { application } : {},
				epoch: observation.revision
			};
			scheduleAfter(0);
		}
	});
	const reconcileInitialSource = async (isCurrent) => {
		const observed = source.observation;
		try {
			const snapshot = await source.readSnapshot(observed);
			if (!isCurrent() || source.observation !== observed) return;
			const includedPaths = snapshot.includedPaths ?? [];
			const initialPaths = opts.initialIncludedPaths ?? [];
			const sameRoot = snapshot.exists ? hashConfigRaw(snapshot.raw) === currentRawHash : currentRawHash === null;
			if (snapshot.valid && sameRoot && initialPaths.length === includedPaths.length && initialPaths.every((path) => includedPaths.includes(path)) && (includedPaths.length === 0 || diffConfigPaths(currentSourceConfig, snapshot.sourceConfig).length === 0)) return;
		} catch (error) {
			if (!isCurrent() || source.observation !== observed) return;
			opts.log.warn(`config reload initial watch check failed: ${String(error)}`);
		}
		source.observe();
	};
	const ready = (async () => {
		const initialCandidate = opts.prepareConfigCandidate ? await opts.prepareConfigCandidate({
			runtimeConfig: opts.initialConfig,
			sourceConfig: initialSourceConfig,
			previousSourceConfig: initialSourceConfig
		}) : void 0;
		const initialPluginInstallRecords = opts.initialPluginInstallRecords ?? await readCurrentInstallRecords();
		if (stopped) throw new GatewayConfigReloadSupersededError();
		currentConfig = initialCandidate?.runtimeConfig ?? opts.initialConfig;
		currentCompareConfig = initialCandidate?.compareConfig ?? initialSourceConfig;
		currentReapplyRuntimeOverlays = initialCandidate?.reapplyRuntimeOverlays ?? ((config) => config);
		settings = resolveSettings(currentConfig);
		opts.onReloadEnabledChange?.(settings.mode !== "off");
		currentSnapshotSlot = await readLatestConfigSnapshotAuditRecordAsync(void 0, assertSourceLive);
		if (source.observation.revision === 0) {
			const priorSnapshot = configSnapshotAuditRecordMatchesPath(currentSnapshotSlot, opts.watchPath) ? currentSnapshotSlot : null;
			if (priorSnapshot && opts.initialSnapshotRawHash === null) {
				currentRawHash = priorSnapshot.rawHash;
				currentFingerprintedAuthoredConfig = priorSnapshot.fingerprintedAuthoredConfig;
				await appendExternalAudit({
					detectedBy: "startup",
					previousHash: priorSnapshot.rawHash,
					nextHash: null,
					valid: false,
					issues: capConfigAuditIssues(["config file missing"])
				});
			} else if (priorSnapshot && priorSnapshot.rawHash !== opts.initialSnapshotRawHash) {
				if (!opts.initialSnapshotValid) {
					currentRawHash = priorSnapshot.rawHash;
					currentFingerprintedAuthoredConfig = priorSnapshot.fingerprintedAuthoredConfig;
				}
				const startupChangedPaths = opts.initialSnapshotValid ? diffConfigPaths(priorSnapshot.fingerprintedAuthoredConfig, fingerprintConfigSnapshotAuthoredConfig(opts.initialAuthoredConfig, {
					env: process.env,
					homedir
				})) : [];
				await appendExternalAudit({
					detectedBy: "startup",
					previousHash: priorSnapshot.rawHash,
					nextHash: opts.initialSnapshotRawHash,
					valid: opts.initialSnapshotValid,
					...!opts.initialSnapshotValid ? { issues: capConfigAuditIssues(formatConfigIssueLines(opts.initialSnapshotIssues, "", { normalizeRoot: true })) } : startupChangedPaths.length > 0 ? { changedPaths: capConfigAuditPaths(startupChangedPaths) } : { opaqueChange: true }
				});
			}
			if (opts.initialSnapshotRawHash !== null && opts.initialSnapshotValid) await updateAcceptedSnapshot(opts.initialSnapshotRawHash, opts.initialAuthoredConfig);
		}
		currentPluginInstallRecords = initialPluginInstallRecords;
		source.start();
		initialized = true;
		if (pendingInProcessConfig || pending) scheduleAfter(0);
	})();
	return {
		ready,
		isReady: () => initialized,
		applyPluginLifecycleChange,
		isReloading: () => activeReloads.size > 0,
		stop: async () => {
			stopped = true;
			lifecycle.abort(new GatewayConfigReloadSupersededError());
			pendingInProcessConfig?.application?.settle("stopped");
			activeInProcessConfig?.application?.settle("stopped");
			retryWriteCandidate?.application?.settle("stopped");
			clearReloadTimer();
			await source.stop();
			await ready.catch(() => {});
			await Promise.all(activeReloads);
		},
		hotReloadStatus: () => initialized ? source.status() : void 0
	};
}
//#endregion
//#region src/gateway/config-reload-recovery.ts
function shouldRefreshContextWindowCache(plan) {
	return plan.reloadPlugins || plan.changedPaths.some((path) => path === "models" || path.startsWith("models.") || path === "agents" || path === "agents.defaults" || path === "agents.entries" || path.startsWith("agents.entries.") || path === "agents.defaults.workspace" || path.startsWith("agents.defaults.workspace."));
}
/** Auth changes must replace prepared owners instead of advancing their config in place. */
function doesReloadAffectProviderAuth(plan, previousConfig, nextConfig) {
	return plan.reloadPlugins || plan.changedPaths.some(isProviderAuthRelevantReloadPath) || diffConfigPaths(previousConfig, nextConfig).some(isProviderAuthRelevantReloadPath) || !isDeepStrictEqual(collectConfiguredModelRefs(previousConfig), collectConfiguredModelRefs(nextConfig)) || !isDeepStrictEqual(resolveChannelConfigActivationFacts(previousConfig), resolveChannelConfigActivationFacts(nextConfig));
}
const PROVIDER_AUTH_RELEVANT_CONFIG_ROOTS = /* @__PURE__ */ new Set([
	"auth",
	"env",
	"models",
	"plugins",
	"secrets"
]);
const PROVIDER_AUTH_RELEVANT_AGENT_SUBFIELDS = /* @__PURE__ */ new Set([
	"agentDir",
	"agentRuntime",
	"default",
	"id",
	"imageModel",
	"mediaModels",
	"model",
	"models",
	"modelPolicy",
	"pdfModel",
	"runtime",
	"utilityModel",
	"voiceModel",
	"workspace"
]);
function isAuthRelevantAgentSubfield(field, next, nested) {
	if (field === void 0) return true;
	if (PROVIDER_AUTH_RELEVANT_AGENT_SUBFIELDS.has(field)) return true;
	if (field === "heartbeat" || field === "subagents") return next === void 0 || next === "model";
	return field === "compaction" && (next === void 0 || next === "model" || next === "provider" || next === "memoryFlush" && (nested === void 0 || nested === "model"));
}
function isProviderAuthRelevantReloadPath(path) {
	const segments = path.split(".");
	const [head = "", second, third, fourth] = segments;
	if (PROVIDER_AUTH_RELEVANT_CONFIG_ROOTS.has(head)) return true;
	if (head !== "agents") return false;
	if (second === void 0 || second === "list") return true;
	if (second === "defaults") return isAuthRelevantAgentSubfield(third, segments[3], segments[4]);
	if (second === "entries") return isAuthRelevantAgentSubfield(fourth, segments[4], segments[5]);
	return false;
}
function reloadPlanNeedsRecovery(plan) {
	return plan.restartCron || plan.restartGmailWatcher || plan.reloadPlugins || plan.restartChannels.size > 0 || (plan.restartChannelAccounts?.size ?? 0) > 0 || shouldRefreshContextWindowCache(plan);
}
//#endregion
//#region src/gateway/server-reload-active-work.ts
const CHANNEL_RELOAD_DEFERRAL_POLL_MS = 500;
const CHANNEL_RELOAD_STILL_PENDING_WARN_MS = 3e4;
function createGatewayActiveWorkTracker(options) {
	const { params, myGeneration } = options;
	let deferredChannelReload;
	const getDeferredChannelReloads = () => {
		if (!deferredChannelReload || !isCurrentGatewayReloadGeneration(myGeneration) || isGatewayReloadGenerationAborted(myGeneration) || !deferredChannelReload.isCurrent()) return [];
		const { channels, publicationPending } = deferredChannelReload;
		return channels.map((channel) => ({
			channel,
			publicationPending
		}));
	};
	const getActiveCounts = () => createGatewayActiveWorkSnapshot().counts;
	const formatActiveDetails = (counts) => {
		return [
			[counts.queueSize, "operation(s)"],
			[counts.pendingReplies, "reply(ies)"],
			[counts.embeddedRuns, "embedded run(s)"],
			[counts.backgroundExecSessions, "background exec session(s)"],
			[counts.rootRequests, "gateway request(s)"],
			[counts.agentRuns, "admitted agent run(s)"],
			[counts.acpRuns, "ACP turn(s)"],
			[counts.mediaRuns, "media generation(s)"],
			[counts.cronRuns, "cron run(s)"]
		].filter(([count]) => count > 0).map(([count, label]) => `${count} ${label}`);
	};
	const formatDeferredWorkStatus = (status) => {
		try {
			return `${formatActiveDetails(getActiveCounts()).join(", ")} ${status}`;
		} catch (err) {
			return `pending work unknown (${String(err)})`;
		}
	};
	const waitForActiveWorkBeforeChannelReload = async (channels, isTransactionCurrent, publicationPending) => {
		if (!isTransactionCurrent()) return true;
		const initial = getActiveCounts();
		if (initial.totalActive <= 0) return false;
		const channelIds = [...new Set(channels)];
		const channelNames = channelIds.join(", ");
		const shouldProceedForLeaseDemand = (counts) => {
			if (!hasPluginLifecycleLeaseDemand()) return false;
			params.logReload.warn(`channel reload proceeding (${channelNames}) with ${formatActiveDetails(counts).join(", ")} still active: caller(s) waiting for the plugin lifecycle lease held by this reload`);
			return true;
		};
		if (shouldProceedForLeaseDemand(initial)) return false;
		const initialDetails = formatActiveDetails(initial);
		params.logReload.warn(`config change requires channel reload (${channelNames}) — deferring until ${initialDetails.join(", ")} complete`);
		const timeoutMs = resolveGatewayRestartDeferralTimeoutMs();
		const startedAt = Date.now();
		let nextStillPendingAt = startedAt + CHANNEL_RELOAD_STILL_PENDING_WARN_MS;
		const deferred = {
			channels: channelIds,
			publicationPending,
			isCurrent: isTransactionCurrent
		};
		deferredChannelReload = deferred;
		try {
			while (true) {
				if (!isTransactionCurrent() || isGatewayReloadGenerationAborted(myGeneration)) return true;
				await sleepWithAbort(CHANNEL_RELOAD_DEFERRAL_POLL_MS, void 0, { ref: false });
				if (!isTransactionCurrent() || isGatewayReloadGenerationAborted(myGeneration)) return true;
				const current = getActiveCounts();
				if (current.totalActive <= 0) return false;
				if (shouldProceedForLeaseDemand(current)) return false;
				const elapsedMs = Date.now() - startedAt;
				if (timeoutMs !== void 0 && elapsedMs >= timeoutMs) {
					const remaining = formatActiveDetails(current);
					params.logReload.warn(`channel reload timeout after ${elapsedMs}ms with ${remaining.join(", ")} still active; reloading channels anyway`);
					return false;
				}
				if (Date.now() >= nextStillPendingAt) {
					const remaining = formatActiveDetails(current);
					params.logReload.warn(`channel reload still deferred after ${elapsedMs}ms with ${remaining.join(", ")} active`);
					nextStillPendingAt = Date.now() + CHANNEL_RELOAD_STILL_PENDING_WARN_MS;
				}
			}
		} finally {
			if (deferredChannelReload === deferred) deferredChannelReload = void 0;
		}
	};
	return {
		formatActiveDetails,
		formatDeferredWorkStatus,
		getActiveCounts,
		getDeferredChannelReloads,
		waitForActiveWorkBeforeChannelReload
	};
}
//#endregion
//#region src/gateway/server-reload-channel-restart.ts
async function restartGatewayChannels(options) {
	const { params, nextConfig, channelsToRestart, restartChannelAccounts, activePluginChannelsAfterReload, shouldSkipChannelRestart, isLifecycleReloadAborted, getChannelAutostartSuppression, channelReloadTargets, scheduleRecoveryRestart } = options;
	const collectChannelAccountTargets = async () => {
		const targets = [];
		for (const [channel, accountIds] of restartChannelAccounts) {
			if (channelsToRestart.has(channel) || activePluginChannelsAfterReload?.has(channel) === false) continue;
			const plugin = getLoadedChannelPluginEntryById(channel, params.getPluginRegistry())?.plugin;
			let listedAccountIds;
			try {
				listedAccountIds = new Set(plugin?.config.listAccountIds(nextConfig) ?? []);
			} catch (err) {
				scheduleRecoveryRestart(`channel account enumeration (${channel})`, err);
				continue;
			}
			if ([...accountIds].some((accountId) => !listedAccountIds.has(accountId))) {
				channelsToRestart.add(channel);
				continue;
			}
			try {
				for (const accountId of accountIds) if (plugin) await resolveChannelAccount({
					plugin,
					cfg: nextConfig,
					accountId
				});
			} catch (err) {
				params.logChannels.info(`promoting ${channel} account reload to whole-channel restart after account resolution failed: ${formatErrorMessage(err)}`);
				channelsToRestart.add(channel);
				continue;
			}
			for (const accountId of accountIds) targets.push([channel, accountId]);
		}
		return targets;
	};
	if (channelsToRestart.size === 0 && restartChannelAccounts.size === 0) return;
	if (shouldSkipChannelRestart) {
		params.logChannels.info("skipping channel reload (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)");
		return;
	}
	const accountTargets = await collectChannelAccountTargets();
	if (isLifecycleReloadAborted()) return;
	const suppressed = Boolean(getChannelAutostartSuppression());
	const operation = suppressed ? "stop" : "restart";
	const phase = suppressed ? "suppressed hot reload" : "hot reload";
	const targets = [...accountTargets, ...[...channelsToRestart].map((channel) => [channel])];
	const failures = [];
	for (const [channel, accountId] of targets) {
		if (activePluginChannelsAfterReload?.has(channel) === false) continue;
		const target = accountId === void 0 ? `${channel} channel` : `${channel} account ${accountId}`;
		try {
			params.logChannels.info(suppressed ? `stopping ${target} before suppressed hot reload` : `restarting ${target}`);
			const canRestart = () => !suppressed && !isLifecycleReloadAborted();
			await params.stopChannel(channel, accountId, {
				manual: false,
				...canRestart() ? { routeHandoff: true } : {}
			});
			if (canRestart()) {
				const outcomes = await params.startChannel(channel, accountId, {
					preserveManualStop: true,
					skipUnavailableAccounts: true
				});
				for (const [id, outcome] of outcomes) if (outcome.status === "retry") throw new Error(`${channel}[${id}] replacement not admitted: ${outcome.reason}`);
			} else params.releaseChannelRouteHandoffs(channel, accountId);
		} catch (err) {
			failures.push(accountId === void 0 ? channel : `${channel}[${accountId}]`);
			params.logChannels.error(`failed to ${operation} ${target} during ${phase}: ${formatErrorMessage(err)}`);
		}
	}
	if (failures.length > 0) scheduleRecoveryRestart(`channel ${operation} (${failures.join(", ")})`);
	if (suppressed) {
		const channels = channelReloadTargets();
		if (getChannelAutostartSuppression()) params.logChannels.info(`channel restart during hot reload suppressed by crash-loop breaker for channels: ${[...channels].join(", ")}`);
	}
}
//#endregion
//#region src/gateway/applied-config-hash-publisher.ts
function createAppliedConfigHashPublisher(options) {
	let deferredHash = null;
	return {
		hasOutstandingGatewayRestart: options.hasPendingRestart,
		publishAppliedConfigHash: (hash) => {
			if (options.hasPendingRestart()) {
				deferredHash = hash;
				return;
			}
			deferredHash = null;
			options.publish(hash);
		},
		publishDeferredAppliedConfigHash: () => {
			if (deferredHash === null || options.hasPendingRestart()) return;
			const hash = deferredHash;
			deferredHash = null;
			options.publish(hash);
		}
	};
}
//#endregion
//#region src/gateway/server-reload-restart.ts
const RESTART_EMISSION_RETRY_MS = 1e3;
var GatewayRestartTransaction = class {
	constructor(options) {
		this.options = options;
		this.retryLifetime = new AbortController();
		this.retryJob = null;
		this.restartDeferral = null;
		this.requestGeneration = 0;
		this.operation = { kind: "idle" };
		this.pausedDebt = null;
		this.conservativeDebt = null;
		this.acceptedTargetState = { kind: "empty" };
		this.appliedConfigHashPublisher = createAppliedConfigHashPublisher({
			hasPendingRestart: () => this.operation.kind === "request" || this.pausedDebt !== null || this.conservativeDebt !== null,
			publish: setRuntimeConfigAppliedHash
		});
		this.isStopped = () => this.retryLifetime.signal.aborted;
		this.hasPendingConfigCandidate = () => this.acceptedTargetState.kind === "candidate-pending";
		this.hasOperation = () => this.operation.kind !== "idle";
		this.getAcceptedTarget = () => this.acceptedTargetState.kind === "accepted" ? this.acceptedTargetState.target : null;
	}
	recordAcceptedTarget(target) {
		const acceptedTarget = {
			...target,
			prepareRuntimeConfig: async () => {
				if (this.acceptedTargetState !== acceptedState) throw new GatewayConfigReloadSupersededError();
				const prepared = await target.prepareRuntimeConfig();
				if (this.acceptedTargetState !== acceptedState) throw new GatewayConfigReloadSupersededError();
				return prepared;
			}
		};
		const acceptedState = {
			kind: "accepted",
			target: acceptedTarget
		};
		this.acceptedTargetState = acceptedState;
		return { reject: () => {
			const state = this.acceptedTargetState;
			if (!(state.kind === "accepted" && state.target === acceptedTarget || state.kind === "candidate-pending" && state.previousTarget === acceptedTarget)) return;
			this.acceptedTargetState = {
				kind: "candidate-pending",
				previousTarget: void 0
			};
		} };
	}
	publishAcceptedTarget(target) {
		return {
			ownership: this.recordAcceptedTarget(target),
			conservativeDebt: this.takeConservativeDebt()
		};
	}
	restoreConservativeDebt(debt) {
		this.conservativeDebt ??= debt;
	}
	deferDebt(plan, nextConfig, options) {
		this.preserveDebt(this.createRequestDetails(plan, nextConfig, options));
	}
	acceptConfig(acceptedConfig) {
		if (this.operation.kind === "idle" || this.operation.transaction.state !== "rejected") return { retireRejectedRestart: false };
		if (this.operation.kind === "request" && !this.operation.emissionSettled) this.preserveDebt(this.operation.details);
		this.supersedeRequest();
		const configDebt = this.pausedDebt;
		const retainsConfigDebt = configDebt && acceptedConfig && configDebt.restartOwnedPaths.every((path) => isDeepStrictEqual(getConfigValueAtPath({ ...configDebt.nextConfig }, path.split(".")), getConfigValueAtPath({ ...acceptedConfig }, path.split("."))));
		if (!retainsConfigDebt) this.pausedDebt = null;
		const debt = (retainsConfigDebt ? configDebt : null) ?? this.conservativeDebt;
		return debt ? {
			retireRejectedRestart: false,
			debt
		} : { retireRejectedRestart: true };
	}
	beginLifecycle() {
		if (this.operation.kind === "request" && !this.operation.emissionSettled && this.operation.transaction.state !== "pending") this.preserveDebt(this.operation.details);
		this.supersedeRequest();
		const transaction = { state: "pending" };
		this.operation = {
			kind: "lifecycle",
			transaction
		};
		return { settle: (state) => {
			if (transaction.state === "pending") {
				transaction.state = state;
				if (state === "committed") this.pausedDebt = null;
			}
		} };
	}
	pauseForConfigCandidate() {
		const state = this.acceptedTargetState;
		const previousTarget = state.kind === "accepted" ? state.target : state.kind === "candidate-pending" ? state.previousTarget : void 0;
		this.acceptedTargetState = {
			kind: "candidate-pending",
			previousTarget
		};
		this.beginLifecycle().settle("rejected");
	}
	request(plan, nextConfig, options) {
		if (this.isStopped()) return {
			status: "recovery-pending",
			settle: () => {}
		};
		this.supersedeRequest();
		const transaction = { state: "pending" };
		this.operation = {
			kind: "request",
			transaction,
			details: this.createRequestDetails(plan, nextConfig, options),
			emissionSettled: false
		};
		const requestGeneration = this.requestGeneration;
		return {
			status: this.requestForGeneration(plan, nextConfig, requestGeneration, options) ? "accepted" : "recovery-pending",
			settle: (state) => {
				if (transaction.state === "pending") transaction.state = state;
			}
		};
	}
	stop() {
		this.retryLifetime.abort();
		this.pausedDebt = null;
		this.conservativeDebt = null;
		this.supersedeRequest();
	}
	createRequestDetails(plan, nextConfig, options) {
		const explicitRestartPaths = plan.restartReasons.filter((path) => plan.changedPaths.includes(path));
		return {
			plan,
			nextConfig: options?.debtConfig ?? nextConfig,
			restartOwnedPaths: explicitRestartPaths.length > 0 ? explicitRestartPaths : [...plan.changedPaths],
			retainDebtAcrossConfigChanges: options?.retainDebtAcrossConfigChanges === true
		};
	}
	preserveDebt(details) {
		if (details.retainDebtAcrossConfigChanges) this.conservativeDebt = details;
		else this.pausedDebt = details;
	}
	takeConservativeDebt() {
		const debt = this.conservativeDebt;
		this.conservativeDebt = null;
		return debt;
	}
	markEmissionSettled() {
		if (this.operation.kind === "request") this.operation.emissionSettled = true;
		this.conservativeDebt = null;
	}
	isCurrentRequest(requestGeneration) {
		return !this.isStopped() && !this.options.params.scheduler.signal.aborted && requestGeneration === this.requestGeneration && isCurrentGatewayReloadGeneration(this.options.myGeneration);
	}
	supersedeRequest() {
		this.requestGeneration += 1;
		this.restartDeferral?.cancel();
		this.restartDeferral = null;
		this.retryJob?.cancel();
		this.retryJob = null;
		this.operation = { kind: "idle" };
	}
	scheduleEmissionRetry(retry) {
		if (this.retryJob || !this.isCurrentRequest(retry.requestGeneration)) return;
		this.retryJob = this.options.params.scheduler.schedule({
			id: "config:restart-retry",
			delayMs: RESTART_EMISSION_RETRY_MS,
			run: () => {
				this.retryJob = null;
				if (!this.isCurrentRequest(retry.requestGeneration)) return;
				return runWithGatewayIndependentRootWorkAdmission(async () => {
					if (!this.isCurrentRequest(retry.requestGeneration)) return;
					if (retry.prepareForEmit && !await retry.prepareForEmit()) {
						this.scheduleEmissionRetry(retry);
						return;
					}
					if (!this.isCurrentRequest(retry.requestGeneration)) return;
					const emitResult = this.options.params.requestRecoveryRestart?.(retry.reason, retry.intent);
					if (emitResult && emitResult.status !== "failed") this.markEmissionSettled();
					if (!emitResult || emitResult.status === "failed") this.scheduleEmissionRetry(retry);
				}, "reload:restart", AbortSignal.any([this.retryLifetime.signal, this.options.params.scheduler.signal])).catch((err) => {
					if (this.isCurrentRequest(retry.requestGeneration)) this.options.params.logReload.warn(`gateway restart recovery retry stopped: ${String(err)}`);
				});
			}
		});
	}
	requestForGeneration(plan, nextConfig, requestGeneration, options) {
		const { params } = this.options;
		const reasons = plan.restartReasons.length ? plan.restartReasons.join(", ") : plan.changedPaths.join(", ");
		const restartReason = `config reload: ${reasons}`;
		if (!this.options.restartRecoveryAvailable) {
			params.logReload.warn("gateway restart recovery unavailable; restart-required reload rejected");
			return false;
		}
		if (!params.requestRecoveryRestart) {
			params.logReload.warn("gateway restart recovery handler unavailable; restart skipped");
			return false;
		}
		const requestRecoveryRestart = params.requestRecoveryRestart;
		let emissionPrepared = true;
		const prepareForEmit = async () => {
			try {
				await params.assertRestartReady?.(nextConfig);
				if (!this.isCurrentRequest(requestGeneration)) return false;
				const preparedConfig = options?.prepareRuntimeConfig ? await options.prepareRuntimeConfig() : nextConfig;
				if (!this.isCurrentRequest(requestGeneration)) return false;
				emissionPrepared = true;
				setGatewayRestartPolicy({ allowExternal: isRestartEnabled(preparedConfig) });
				return this.isCurrentRequest(requestGeneration);
			} catch (err) {
				emissionPrepared = false;
				params.logReload.warn(`gateway restart preflight failed: ${String(err)}`);
				return false;
			}
		};
		const active = this.options.getActiveCounts();
		if (active.totalActive > 0 || options?.prepareRuntimeConfig || params.assertRestartReady) {
			if (active.totalActive > 0) {
				const initialDetails = this.options.formatActiveDetails(active);
				params.logReload.warn(`config change requires gateway restart (${reasons}) — deferring until ${initialDetails.join(", ")} complete`);
			} else params.logReload.warn(`config change requires gateway restart (${reasons}) — preparing`);
			let failedEmission;
			this.restartDeferral = deferGatewayRestartUntilIdle({
				getPendingCount: () => this.options.getActiveCounts().totalActive,
				maxWaitMs: resolveGatewayRestartDeferralTimeoutMs(void 0),
				timeoutIntent: {
					force: true,
					reason: "config reload forced restart"
				},
				reason: restartReason,
				emitHooks: {
					beforeEmit: async () => {
						emissionPrepared = await prepareForEmit();
					},
					emitRestart: (reason, intent) => {
						if (!this.isCurrentRequest(requestGeneration)) return { status: "coalesced" };
						const resolvedReason = reason ?? restartReason;
						if (!emissionPrepared) {
							failedEmission = {
								reason: resolvedReason,
								intent
							};
							return { status: "failed" };
						}
						const emitResult = requestRecoveryRestart(resolvedReason, intent);
						if (emitResult.status !== "failed") this.markEmissionSettled();
						failedEmission = emitResult.status === "failed" ? {
							reason: resolvedReason,
							intent
						} : void 0;
						return emitResult;
					},
					afterEmitFailed: async () => {
						if (!this.isCurrentRequest(requestGeneration) || !failedEmission) return;
						if (!this.options.restartRecoveryAvailable) {
							params.logReload.warn("gateway restart recovery unavailable; retry skipped");
							return;
						}
						params.logReload.warn("gateway restart recovery emission failed; retrying");
						this.scheduleEmissionRetry({
							...failedEmission,
							requestGeneration,
							prepareForEmit
						});
					}
				},
				hooks: {
					onReady: () => {
						this.restartDeferral = null;
						params.logReload.info("all operations and replies completed; restarting gateway now");
					},
					onStillPending: (_pending, elapsedMs) => {
						params.logReload.warn(`restart still deferred after ${elapsedMs}ms with ${this.options.formatDeferredWorkStatus("active")}`);
					},
					onTimeout: (_pending, elapsedMs) => {
						params.logReload.warn(`restart timeout after ${elapsedMs}ms with ${this.options.formatDeferredWorkStatus("still active")}; forcing restart`);
					},
					onCheckError: (err) => {
						params.logReload.warn(`restart deferral check failed (${String(err)}); pending work is unknown, deferring and retrying`);
					}
				}
			});
			setGatewayRestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
			return true;
		}
		params.logReload.warn(`config change requires gateway restart (${reasons})`);
		const emitResult = requestRecoveryRestart(restartReason);
		if (emitResult.status !== "failed") this.markEmissionSettled();
		if (emitResult.status === "failed") {
			params.logReload.warn("gateway restart recovery emission failed");
			if (this.options.restartRecoveryAvailable) this.scheduleEmissionRetry({
				reason: restartReason,
				requestGeneration,
				prepareForEmit
			});
			return false;
		}
		if (emitResult.status === "coalesced") params.logReload.info("gateway restart already scheduled; skipping duplicate signal");
		setGatewayRestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
		return true;
	}
};
function createGatewayRestartCoordinator(options) {
	const transaction = new GatewayRestartTransaction(options);
	return {
		acceptRestartConfig: transaction.acceptConfig.bind(transaction),
		...transaction.appliedConfigHashPublisher,
		beginGatewayRestartLifecycle: transaction.beginLifecycle.bind(transaction),
		pauseGatewayRestartForConfigCandidate: transaction.pauseForConfigCandidate.bind(transaction),
		publishAcceptedRestartTarget: transaction.publishAcceptedTarget.bind(transaction),
		recordAcceptedRestartTarget: transaction.recordAcceptedTarget.bind(transaction),
		requestGatewayRestart: transaction.request.bind(transaction),
		restoreConservativeRestartDebt: transaction.restoreConservativeDebt.bind(transaction),
		stopRestartRetries: transaction.stop.bind(transaction),
		deferGatewayRestartDebt: transaction.deferDebt.bind(transaction),
		getLatestAcceptedRestartTarget: transaction.getAcceptedTarget,
		hasConfigCandidatePending: transaction.hasPendingConfigCandidate,
		hasRestartRequestTransaction: transaction.hasOperation,
		isRestartRetryStopped: transaction.isStopped
	};
}
//#endregion
//#region src/gateway/server-reload-utils.ts
function projectCanonicalSecretRefsOntoRuntime(sourceValue, runtimeValue) {
	if (isSecretRef(sourceValue)) return sourceValue;
	if (Array.isArray(sourceValue)) {
		const runtimeArray = Array.isArray(runtimeValue) ? runtimeValue : [];
		return sourceValue.map((entry, index) => projectCanonicalSecretRefsOntoRuntime(entry, runtimeArray[index]));
	}
	if (isRecord(sourceValue)) {
		const runtimeRecord = isRecord(runtimeValue) ? runtimeValue : {};
		const projected = { ...runtimeRecord };
		for (const [key, entry] of Object.entries(sourceValue)) projected[key] = projectCanonicalSecretRefsOntoRuntime(entry, runtimeRecord[key]);
		return projected;
	}
	return runtimeValue === void 0 ? sourceValue : runtimeValue;
}
function restoreCanonicalSecretRefs(runtimeConfig, sourceConfig) {
	return projectCanonicalSecretRefsOntoRuntime(sourceConfig, runtimeConfig);
}
function revokeActiveSkillReviewsBeforeConfigPublication(config) {
	if (resolveSkillWorkshopConfig(config).autonomous.mode === "auto") return;
	requestActiveCronJobCancellationByDeclarationKeyPrefix("skill-collection-review:", "Skill collection review disabled by configuration.");
}
function assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable) {
	if (restartRecoveryAvailable !== false) return;
	if (plan.restartGateway) throw new GatewayReloadRequiresRecoveryOwnerError("gateway restart");
	if (plan.pluginLifecycle && plan.reloadPlugins) return;
	if (reloadPlanNeedsRecovery(plan)) throw new GatewayReloadRequiresRecoveryOwnerError("irreversible hot reload");
}
async function disposeMcpRuntimesWithTimeout(params) {
	const disposePromise = Promise.resolve().then(params.dispose).catch((error) => {
		params.onWarn(`${params.label} failed: ${String(error)}`);
	});
	if (!await settlesWithin(disposePromise, params.timeoutMs)) params.onWarn(`${params.label} exceeded ${params.timeoutMs}ms; continuing`);
}
//#endregion
//#region src/gateway/server-reload-hot.ts
const MCP_RUNTIME_RELOAD_DISPOSE_TIMEOUT_MS = 5e3;
function createGatewayReloadHandlers(params) {
	const myGeneration = nextGatewayReloadGeneration();
	const restartRecoveryAvailable = params.restartRecoveryAvailable !== false && params.requestRecoveryRestart !== void 0;
	const { formatActiveDetails, formatDeferredWorkStatus, getActiveCounts, getDeferredChannelReloads, waitForActiveWorkBeforeChannelReload } = createGatewayActiveWorkTracker({
		params,
		myGeneration
	});
	const { deferGatewayRestartDebt, getLatestAcceptedRestartTarget, hasRestartRequestTransaction, isRestartRetryStopped, ...restartCoordinator } = createGatewayRestartCoordinator({
		params,
		myGeneration,
		restartRecoveryAvailable,
		getActiveCounts,
		formatActiveDetails,
		formatDeferredWorkStatus
	});
	const applyHotReload = async (plan, nextConfig, publication) => {
		publication?.assertInvokerOwned?.();
		assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable);
		const isCurrent = () => !isRestartRetryStopped() && (publication?.isCurrent?.() ?? true);
		const state = params.getState();
		const nextState = { ...state };
		const candidateEnv = publication?.runtimeEnv ?? process.env;
		const committedConfig = getRuntimeConfig();
		const refreshModelRuntime = doesReloadAffectProviderAuth(plan, committedConfig, nextConfig);
		const modelRuntimeAgentIds = resolveReloadAgentIds([...plan.changedPaths, ...diffConfigPaths(committedConfig, nextConfig)]);
		const modelRuntimeRefreshScope = modelRuntimeAgentIds ? { agentIds: modelRuntimeAgentIds } : {};
		if (plan.reloadHooks || plan.refreshHooksPolicy) try {
			nextState.hooksConfig = resolveHooksConfig(nextConfig);
		} catch (err) {
			params.logHooks.warn(`hooks config reload failed: ${String(err)}`);
			throw err;
		}
		nextState.hookClientIpConfig = resolveHookClientIpConfig(nextConfig);
		const internalHooks = plan.reloadInternalHooks || plan.reloadPlugins ? await (await import("./loader-DgzA5esZ.mjs")).prepareInternalHooks(nextConfig, tryResolveConfiguredAgentWorkspaceDir(nextConfig, candidateEnv) ?? resolveDefaultAgentWorkspaceDir(candidateEnv)) : void 0;
		await publication?.checkpoint?.();
		assertReloadPublicationCurrent(publication?.isCurrent() ?? true, isRestartRetryStopped());
		const assertCronReloadCurrent = () => assertReloadPublicationCurrent(publication?.isCurrent() ?? true, isRestartRetryStopped() || !isCurrentGatewayReloadGeneration(myGeneration) || isGatewayReloadGenerationAborted(myGeneration));
		let cronExitWatcherHandoff;
		if (plan.restartCron) {
			const { buildGatewayCronService } = await import("./server-cron-Bc4tfTHW.mjs");
			assertCronReloadCurrent();
			nextState.cronState = buildGatewayCronService({
				scheduler: params.scheduler,
				cfg: nextConfig,
				deps: params.deps,
				broadcast: params.broadcast,
				env: publication?.runtimeEnv ?? process.env,
				...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {},
				resolvePluginRegistry: params.getPluginRegistry
			});
			if (state.cronState.cronEnabled && nextState.cronState.cronEnabled && state.cronState.storePath === nextState.cronState.storePath) {
				const [previous, next] = await Promise.all([state.cronState.prepareExitWatcherHandoff?.(), nextState.cronState.prepareExitWatcherHandoff?.()]);
				assertCronReloadCurrent();
				if (previous && next) cronExitWatcherHandoff = {
					previous,
					next
				};
			}
		}
		resetDirectoryCache();
		const channelsToRestart = new Set(plan.restartChannels);
		const restartChannelAccounts = new Map([...plan.restartChannelAccounts ?? []].map(([channel, accountIds]) => [channel, new Set(accountIds)]));
		let remainingPlan = {
			...plan,
			reloadPlugins: false
		};
		const prepareConfigEffects = ({ pluginIds, channels }) => {
			for (const channel of channels) {
				channelsToRestart.delete(channel);
				restartChannelAccounts.delete(channel);
			}
			remainingPlan = {
				...plan,
				reloadPlugins: false,
				restartChannels: channelsToRestart,
				restartChannelAccounts,
				restartServices: new Set(params.getPluginRegistry().services.filter((entry) => plan.restartServices?.has(entry.id) && !pluginIds.has(entry.pluginId)).map((entry) => entry.id))
			};
			assertIrreversibleReloadPlanHasRecoveryOwner(remainingPlan, restartRecoveryAvailable);
			const previousConfig = getRuntimeConfig();
			const drain = beginPreparedModelRuntimePluginDrain();
			releasePreparedModelRuntimeDrain = drain.release;
			const retire = () => {
				if (preparedModelRuntimeReplacementGateId) return;
				preparedModelRuntimeReplacementGateId = markPreparedModelRuntimeSnapshotsStale("prepared model runtime owner is stale before plugin replacement", {
					waitForReplacement: true,
					...modelRuntimeRefreshScope
				});
				drain.release();
			};
			if (drain.pendingPublication) retire();
			return {
				retire,
				rollback: async () => {
					if (!preparedModelRuntimeReplacementGateId) return;
					await withPluginRuntimeRegistryScope(params.getPluginRegistry(), () => refreshModelRuntimeAfterHotReload({
						config: previousConfig,
						agentIds: modelRuntimeAgentIds,
						pluginMetadataSnapshot: params.getPluginMetadataSnapshot?.(),
						isPublicationCurrent: () => isCurrentGatewayReloadGeneration(myGeneration) && !isLifecycleReloadAborted() && !isRestartRetryStopped()
					}));
				}
			};
		};
		let activePluginChannelsAfterReload = null;
		let pluginReloadAborted = false;
		let runtimeCommitted = false;
		let configCommitFailure;
		const failConfigCommit = (error) => {
			configCommitFailure = { error };
			throw error;
		};
		const isLifecycleReloadAborted = () => isGatewayReloadGenerationAborted(myGeneration);
		const ownsCron = () => isCurrentGatewayReloadGeneration(myGeneration) && !isLifecycleReloadAborted() && !isRestartRetryStopped() && params.getState().cronState === nextState.cronState;
		const isPluginReloadAborted = () => pluginReloadAborted || !runtimeCommitted && !isCurrent() || isRestartRetryStopped() || isLifecycleReloadAborted();
		let preparedModelRuntimeReplacementGateId;
		let releasePreparedModelRuntimeDrain;
		let recoveryRestartScheduled = false;
		const laneConcurrency = resolveGatewayLaneConcurrency(nextConfig);
		const shouldSkipChannelRestart = isChannelStartupSuppressedByEnvironment(candidateEnv);
		const channelReloadTargets = () => /* @__PURE__ */ new Set([...channelsToRestart, ...restartChannelAccounts.keys()]);
		const getChannelAutostartSuppression = () => params.getChannelAutostartSuppression?.() ?? null;
		const commitRuntime = async (runtime) => {
			if (runtimeCommitted) return;
			let pluginNotificationFailure;
			const commit = async () => {
				if (plan.restartCron) assertCronReloadCurrent();
				publication?.assertInvokerOwned?.();
				runtime?.publish();
				if (runtime) {
					params.setState(nextState);
					runtimeCommitted = true;
				}
				if (plan.restartHeartbeat) nextState.heartbeatRunner.updateConfig(nextConfig);
				revokeActiveSkillReviewsBeforeConfigPublication(nextConfig);
				if (refreshModelRuntime) preparedModelRuntimeReplacementGateId = markPreparedModelRuntimeSnapshotsStale("prepared model runtime owner is stale before config publication", {
					waitForReplacement: true,
					...modelRuntimeRefreshScope
				});
				else advancePreparedModelRuntimeConfig(nextConfig);
				if (!runtime) {
					params.setState(nextState);
					runtimeCommitted = true;
				}
				if (plan.reloadHooks) commitHookTransformMappingReload();
				internalHooks?.commit();
				applyGatewayLaneConcurrency(laneConcurrency);
				try {
					runtime?.afterCommit?.();
				} catch (error) {
					pluginNotificationFailure = { error };
					throw error;
				}
				setGatewayRestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
			};
			try {
				await (publication ? publication.publish(commit, () => runtimeCommitted) : commit());
			} catch (error) {
				if (runtimeCommitted && (!pluginNotificationFailure || pluginNotificationFailure.error !== error)) failConfigCommit(error);
				throw error;
			} finally {
				try {
					if (runtimeCommitted && plan.restartCron) {
						if (ownsCron()) {
							params.cronReconciliation.invalidate();
							params.onCronRestart?.();
						}
						if (cronExitWatcherHandoff && ownsCron()) {
							await cronExitWatcherHandoff.next.adopt(cronExitWatcherHandoff.previous.current());
							await cronExitWatcherHandoff.previous.stopOwner();
						} else if (state.cronState.cron.stopAndDrain) await state.cronState.cron.stopAndDrain();
						else {
							state.cronState.cron.stop();
							await state.cronState.stopStreamWatchers();
						}
					}
				} catch (error) {
					failConfigCommit(error);
				}
			}
			if (plan.restartHeartbeat) await reviveAgentDatabasesAfterConfigCommit(listAgentIds(nextConfig), (message) => params.logReload.warn(message));
			if (!ownsCron()) return;
			if (plan.reconcileSystemJobs && await nextState.cronState.reconcileSystemJobs().catch(failConfigCommit) === "retry-scheduled") failConfigCommit(new GatewayHotReloadRecoveryError("cron monitor"));
			if (plan.restartCron && ownsCron()) startGatewayCronWithLogging({
				cronState: nextState.cronState,
				cronReconciliation: params.cronReconciliation,
				reason: "reload",
				config: nextConfig,
				afterStart: async () => {
					await Promise.all([nextState.cronState.reconcileExitWatchers(), nextState.cronState.reconcileStreamWatchers()]);
				},
				logCron: params.logCron,
				onStartError: (err) => {
					if (!ownsCron()) return;
					try {
						scheduleRecoveryRestart("cron reload", err);
					} catch (recoveryError) {
						params.logCron.error(formatErrorMessage(recoveryError));
					}
				}
			});
		};
		const settleRecoveryRestart = (restartTransaction, surface) => {
			if (restartTransaction.status === "recovery-pending" && !restartRecoveryAvailable) {
				restartTransaction.settle("rejected");
				throw new GatewayHotReloadRecoveryError(surface);
			}
			restartTransaction.settle("committed");
			recoveryRestartScheduled = true;
		};
		const scheduleRecoveryRestart = (surface, err) => {
			rejectPendingPreparedModelRuntimeReplacement(preparedModelRuntimeReplacementGateId, err ?? /* @__PURE__ */ new Error(`prepared model runtime replacement stopped during ${surface}`));
			if (plan.pluginLifecycle && !reloadPlanNeedsRecovery(remainingPlan)) throw new PluginRuntimeApplicationError(`Plugin runtime application failed during ${surface}: ${formatErrorMessage(err)}`, {
				...plan.pluginLifecycle,
				pluginIds: [...plan.pluginLifecycle.pluginIds],
				generation: getPluginRuntimeGeneration(),
				phase: runtimeCommitted ? "activate" : "prepare",
				committed: runtimeCommitted
			}, { cause: err });
			const detail = err === void 0 ? "" : `: ${formatErrorMessage(err)}`;
			if (isRestartRetryStopped()) {
				params.logReload.warn(`${surface} failed during gateway shutdown${detail}`);
				return;
			}
			if (!restartRecoveryAvailable || !params.requestRecoveryRestart) {
				const message = runtimeCommitted ? `config hot reload committed with unrecovered ${surface} failure${detail}; gateway restart recovery is unavailable; runtime may be inconsistent` : `config hot reload failed before commit during ${surface}${detail}; gateway restart recovery is unavailable`;
				if (params.logReload.error) params.logReload.error(message);
				else params.logReload.warn(message);
				if (runtimeCommitted) throw new GatewayHotReloadRecoveryError(surface);
				if (err instanceof Error) throw err;
				throw new Error(`config hot reload failed before commit during ${surface}${detail}`);
			}
			const recoveryPlan = {
				...plan,
				restartGateway: true,
				restartReasons: [`hot reload recovery: ${surface}`]
			};
			if (!isCurrent()) {
				params.logReload.warn(`${surface} failed after config supersession${detail}; recovery deferred to the newer config`);
				const target = getLatestAcceptedRestartTarget();
				if (!restartCoordinator.hasConfigCandidatePending() && !hasRestartRequestTransaction() && target) {
					const restartTransaction = restartCoordinator.requestGatewayRestart(recoveryPlan, target.runtimeConfig, {
						retainDebtAcrossConfigChanges: true,
						debtConfig: target.sourceConfig,
						prepareRuntimeConfig: target.prepareRuntimeConfig
					});
					settleRecoveryRestart(restartTransaction, surface);
					return;
				}
				deferGatewayRestartDebt(recoveryPlan, nextConfig, {
					retainDebtAcrossConfigChanges: true,
					debtConfig: publication?.sourceConfig ?? nextConfig
				});
				return;
			}
			const commitState = runtimeCommitted ? "after config commit" : "before config commit";
			params.logReload.warn(`${surface} failed ${commitState}${detail}; restarting gateway`);
			if (recoveryRestartScheduled) return;
			try {
				const restartTransaction = restartCoordinator.requestGatewayRestart(recoveryPlan, nextConfig, {
					retainDebtAcrossConfigChanges: true,
					debtConfig: publication?.sourceConfig ?? nextConfig,
					...publication?.prepareRestartRuntimeConfig ? { prepareRuntimeConfig: publication.prepareRestartRuntimeConfig } : {}
				});
				settleRecoveryRestart(restartTransaction, surface);
			} catch (restartError) {
				params.logReload.warn(`failed to schedule post-commit gateway restart: ${formatErrorMessage(restartError)}`);
				if (restartError instanceof GatewayHotReloadRecoveryError) throw restartError;
				throw new GatewayHotReloadRecoveryError(surface);
			}
		};
		const isReloadOwnerActive = () => isCurrentGatewayReloadGeneration(myGeneration) && !isPluginReloadAborted();
		const reloadRetainedPluginServices = async () => {
			if (!remainingPlan.restartServices?.size || !isReloadOwnerActive()) return;
			try {
				if (!params.reloadPluginServices) throw new Error("Plugin service reload owner is unavailable");
				await params.reloadPluginServices(nextConfig, remainingPlan.restartServices);
			} catch (err) {
				params.logReload.warn(`plugin services reload failed: ${formatErrorMessage(err)}`);
			}
		};
		let pluginRuntimeApplication;
		try {
			if (plan.reloadPlugins) {
				const result = await params.reloadPlugins({
					nextConfig,
					sourceConfig: publication ? publication.sourceConfig : nextConfig,
					changedPaths: plan.changedPaths,
					reloadPluginIds: plan.reloadPluginIds,
					pluginLifecycle: plan.pluginLifecycle,
					prepareConfigEffects,
					commitRuntime,
					env: publication?.runtimeEnv ?? process.env,
					isAborted: isPluginReloadAborted,
					checkpoint: publication?.checkpoint,
					assertInvokerOwned: publication?.assertInvokerOwned
				});
				pluginReloadAborted = isPluginReloadAborted();
				if (!pluginReloadAborted) {
					pluginRuntimeApplication = result.runtime;
					activePluginChannelsAfterReload = result.activeChannels;
					params.pruneInactiveChannelAccountState(result.activeChannels);
				}
			}
			const channelTargets = channelReloadTargets();
			if (!pluginReloadAborted && channelTargets.size > 0 && !shouldSkipChannelRestart) pluginReloadAborted = await waitForActiveWorkBeforeChannelReload(channelTargets, isCurrent, !runtimeCommitted) && isPluginReloadAborted();
			if (pluginReloadAborted) throw createReloadCancellationError(!runtimeCommitted && publication?.isCurrent() === false);
		} catch (error) {
			if (runtimeCommitted && (configCommitFailure || error instanceof PluginRuntimeApplicationError && reloadPlanNeedsRecovery(remainingPlan))) {
				scheduleRecoveryRestart("runtime commit", configCommitFailure?.error ?? error);
				return "applied-restart-required";
			}
			try {
				if (runtimeCommitted && error instanceof PluginRuntimeApplicationError && error.details.committed && isReloadOwnerActive()) try {
					await withPluginRuntimeRegistryScope(params.getPluginRegistry(), () => refreshModelRuntimeAfterHotReload({
						config: nextConfig,
						agentIds: modelRuntimeAgentIds,
						pluginMetadataSnapshot: params.getPluginMetadataSnapshot?.(),
						isPublicationCurrent: isReloadOwnerActive
					}));
				} catch (refreshError) {
					rejectPendingPreparedModelRuntimeReplacement(preparedModelRuntimeReplacementGateId, refreshError);
					throw new PluginRuntimeApplicationError(`Plugin model/reply recovery failed: ${formatErrorMessage(refreshError)}. Retry the plugin reload or restart the Gateway. Original failure: ${formatErrorMessage(error)}`, error.details, { cause: new AggregateError([error, refreshError], "Plugin model/reply recovery failed") });
				}
			} finally {
				rejectPendingPreparedModelRuntimeReplacement(preparedModelRuntimeReplacementGateId, error);
				releasePreparedModelRuntimeDrain?.();
				if (runtimeCommitted && error instanceof PluginRuntimeApplicationError) await reloadRetainedPluginServices();
			}
			throw error;
		} finally {
			releasePreparedModelRuntimeDrain?.();
		}
		try {
			await commitRuntime();
		} catch (err) {
			if (!runtimeCommitted) throw err;
			scheduleRecoveryRestart("runtime commit", err);
			return "applied-restart-required";
		}
		try {
			if (refreshModelRuntime) await withPluginRuntimeRegistryScope(params.getPluginRegistry(), () => refreshModelRuntimeAfterHotReload({
				config: nextConfig,
				agentIds: modelRuntimeAgentIds,
				pluginMetadataSnapshot: params.getPluginMetadataSnapshot?.()
			}));
		} catch (err) {
			scheduleRecoveryRestart("prepared model runtime reload", err);
			return "applied-restart-required";
		} finally {
			await reloadRetainedPluginServices();
		}
		if (plan.disposeMcpRuntimes) await disposeMcpRuntimesWithTimeout({
			dispose: () => reloadSessionMcpRuntimes({
				cfg: nextConfig,
				manifestRegistry: params.getPluginMetadataSnapshot?.()?.manifestRegistry,
				reloadPlugins: plan.reloadPlugins
			}),
			timeoutMs: MCP_RUNTIME_RELOAD_DISPOSE_TIMEOUT_MS,
			onWarn: params.logReload.warn,
			label: "bundle-mcp runtime disposal during config reload"
		});
		if (plan.restartGmailWatcher) {
			const restartAbortController = params.createGmailRestartAbortController?.() ?? new AbortController();
			try {
				await params.stopPostReadySidecars?.();
				if (!restartAbortController.signal.aborted) {
					const [{ stopGmailWatcher }, { startGmailWatcherWithLogs }] = await Promise.all([import("./gmail-watcher-DKTowLMZ.mjs"), import("./gmail-watcher-lifecycle-DJ6_ci7R.mjs")]);
					if (!restartAbortController.signal.aborted) await stopGmailWatcher().catch((err) => {
						params.logHooks.warn(`gmail watcher stop failed during reload: ${String(err)}`);
					});
					if (!restartAbortController.signal.aborted) await startGmailWatcherWithLogs({
						cfg: nextConfig,
						log: params.logHooks,
						signal: restartAbortController.signal,
						scheduler: params.scheduler,
						onSkipped: () => params.logHooks.info("skipping gmail watcher restart (OPENCLAW_SKIP_GMAIL_WATCHER=1)")
					});
				}
			} catch (err) {
				scheduleRecoveryRestart("gmail watcher reload", err);
			} finally {
				params.clearGmailRestartAbortController?.(restartAbortController);
			}
		}
		await restartGatewayChannels({
			params,
			nextConfig,
			channelsToRestart,
			restartChannelAccounts,
			activePluginChannelsAfterReload,
			shouldSkipChannelRestart,
			isLifecycleReloadAborted,
			getChannelAutostartSuppression,
			channelReloadTargets,
			scheduleRecoveryRestart
		});
		if (shouldRefreshContextWindowCache(plan)) try {
			await refreshContextWindowCache(nextConfig);
		} catch (err) {
			scheduleRecoveryRestart("context window cache reload", err);
		}
		if (plan.hotReasons.length > 0) params.logReload.info(`config hot reload applied (${plan.hotReasons.join(", ")})`);
		else if (plan.noopPaths.length > 0) params.logReload.info(`config change applied (dynamic reads: ${plan.noopPaths.join(", ")})`);
		const status = recoveryRestartScheduled ? "applied-restart-required" : "applied";
		return pluginRuntimeApplication ? {
			status,
			runtime: pluginRuntimeApplication
		} : status;
	};
	return {
		...restartCoordinator,
		applyHotReload,
		getDeferredChannelReloads
	};
}
//#endregion
//#region src/gateway/server-reload-managed-secrets.ts
function isRuntimeSecretsPreparationCurrent(preparation) {
	return getActiveSecretsRuntimeSnapshotRevisionState() === preparation.expectedRevision;
}
function createManagedReloadSecretHandlers(options) {
	const { params, prepareRuntimeCandidate, tryPrepareRuntimeSecrets, applyHotReload } = options;
	const prepareRestartRuntimeConfig = (runtimeConfig, sourceConfig, transactionOwnership) => transactionOwnership.withRestartPreparation(async (ownership) => {
		for (;;) {
			const prepared = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(runtimeConfig, sourceConfig, ownership), ownership, {
				reason: "restart-check",
				publishFailureAsDegraded: true,
				...ownership.runtimeEnv ? { env: ownership.runtimeEnv.env } : {}
			});
			await ownership.checkpoint();
			assertReloadPublicationCurrent(ownership.isCurrent(), false);
			if (prepared && isRuntimeSecretsPreparationCurrent(prepared)) return prepared.snapshot.config;
		}
	});
	const onEffectiveConfigUnchanged = async (nextConfig, transactionOwnership, sourceConfig) => {
		for (;;) {
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			const previousRuntimeSourceConfig = getRuntimeConfigSourceSnapshot();
			const previousSecretsSnapshot = getActiveSecretsRuntimeSnapshotState();
			const previousSecretsRevision = getActiveSecretsRuntimeSnapshotRevisionState();
			const previousRuntimeMetadata = getRuntimeConfigSnapshotMetadata();
			const nextSecretsSourceConfig = prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership);
			if (previousRuntimeMetadata && previousRuntimeSourceConfig && previousSecretsSnapshot && hasSameSecretReloadContract(previousSecretsSnapshot.sourceConfig, nextSecretsSourceConfig)) {
				const sourceOnlySnapshot = {
					...previousSecretsSnapshot,
					sourceConfig: nextSecretsSourceConfig
				};
				if (!isDeepStrictEqual(sourceOnlySnapshot.config, nextConfig)) throw new GatewayConfigReloadSupersededError();
				await transactionOwnership.checkpoint();
				assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
				if (!setSecretsRuntimeSourceSnapshotIfCurrent({
					expectedSecretsRevision: previousSecretsRevision,
					expectedRuntimeConfigRevision: previousRuntimeMetadata.revision,
					runtimeSourceConfig: sourceConfig,
					secretsSourceConfig: nextSecretsSourceConfig
				})) continue;
				const committedSecretsRevision = getActiveSecretsRuntimeSnapshotRevisionState();
				const rollbackPublishedSource = async () => {
					if (!restoreSecretsRuntimeSourceSnapshotIfLineageCurrent({
						expectedLineageRevision: committedSecretsRevision,
						runtimeSourceConfig: previousRuntimeSourceConfig,
						secretsSourceConfig: previousSecretsSnapshot.sourceConfig
					})) throw new GatewayConfigReloadSupersededError();
				};
				if (!transactionOwnership.isCurrent()) {
					await rollbackPublishedSource();
					throw new GatewayConfigReloadSupersededError();
				}
				return {
					rollback: rollbackPublishedSource,
					commit: () => params.activateRuntimeSecrets.publishStateTransition(sourceOnlySnapshot, {
						sourceOnly: true,
						expectedRevision: committedSecretsRevision
					})
				};
			}
			const preparation = await tryPrepareRuntimeSecrets(nextSecretsSourceConfig, transactionOwnership, {
				reason: "reload",
				publishFailureAsDegraded: true,
				...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {},
				includeAuthStoreRefs: true
			});
			if (!previousRuntimeMetadata || !transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError();
			if (getRuntimeConfigSnapshotMetadata()?.revision !== previousRuntimeMetadata.revision) {
				if (hasActiveSecretsRuntimeSnapshotLineage(previousSecretsRevision)) continue;
				throw new GatewayConfigReloadSupersededError();
			}
			if (!preparation || preparation.expectedRevision !== previousSecretsRevision || !isRuntimeSecretsPreparationCurrent(preparation)) continue;
			const preparedSecrets = preparation.snapshot;
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			if (!isDeepStrictEqual(preparedSecrets.config, nextConfig)) throw new GatewayConfigReloadSupersededError();
			if (!previousRuntimeSourceConfig || !previousSecretsSnapshot) throw new GatewayConfigReloadSupersededError();
			const activated = await params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent(preparedSecrets, previousSecretsRevision, {
				reason: "reload",
				activate: true,
				deferStatePublication: true,
				runtimeSourceConfig: sourceConfig
			}, void 0, transactionOwnership.isCurrent, transactionOwnership.checkpoint);
			if (!activated) continue;
			const committedSecretsRevision = getActiveSecretsRuntimeSnapshotRevisionState();
			const rollbackPublishedSource = async () => {
				if (!await params.activateRuntimeSecrets.restoreSnapshotIfCurrent(previousSecretsSnapshot, committedSecretsRevision, activated, { runtimeSourceConfig: previousRuntimeSourceConfig })) throw new GatewayConfigReloadSupersededError();
			};
			if (!transactionOwnership.isCurrent()) {
				await rollbackPublishedSource();
				throw new GatewayConfigReloadSupersededError();
			}
			return {
				rollback: rollbackPublishedSource,
				commit: () => params.activateRuntimeSecrets.publishStateTransition(activated)
			};
		}
	};
	const onHotReload = async (plan, nextConfig, transactionOwnership, sourceConfig) => {
		const authoredChannels = new Set(plan.restartChannels);
		const authoredAccountTargets = new Map([...plan.restartChannelAccounts ?? []].map(([channel, ids]) => [channel, new Set(ids)]));
		for (;;) {
			transactionOwnership.assertInvokerOwned?.();
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			const previousSnapshot = getActiveSecretsRuntimeSnapshotState();
			const previousRuntimeConfig = previousSnapshot?.config ?? getRuntimeConfig();
			const previousRuntimeSourceConfig = getRuntimeConfigSourceSnapshot() ?? void 0;
			const previousSnapshotRevision = getActiveSecretsRuntimeSnapshotRevisionState();
			const previousGenerationOwnership = params.sharedGatewaySessionGenerationState.capture();
			const previousSharedGatewaySessionGeneration = previousGenerationOwnership.generation;
			const preparation = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership), transactionOwnership, {
				reason: "reload",
				publishFailureAsDegraded: true,
				...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {},
				includeAuthStoreRefs: transactionOwnership.runtimeRefresh?.includeAuthStoreRefs
			});
			if (!preparation || preparation.expectedRevision !== previousSnapshotRevision || !isRuntimeSecretsPreparationCurrent(preparation)) continue;
			const prepared = preparation.snapshot;
			params.assertRuntimeSecurityConfig?.(prepared.config, transactionOwnership.runtimeEnv?.env);
			const resolvedChannelPlan = buildGatewayReloadPlan(previousSnapshot ? diffConfigPaths(previousSnapshot.config, prepared.config).filter((path) => path === "channels" || path.startsWith("channels.")) : [], { candidateConfig: prepared.config });
			plan.restartChannels = /* @__PURE__ */ new Set([...authoredChannels, ...resolvedChannelPlan.restartChannels]);
			plan.restartChannelAccounts = new Map([...authoredAccountTargets].map(([channel, ids]) => [channel, new Set(ids)]));
			for (const [channel, ids] of resolvedChannelPlan.restartChannelAccounts ?? []) {
				const targets = plan.restartChannelAccounts.get(channel) ?? /* @__PURE__ */ new Set();
				for (const id of ids) targets.add(id);
				plan.restartChannelAccounts.set(channel, targets);
			}
			for (const channel of plan.restartChannels) plan.restartChannelAccounts.delete(channel);
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			if (getActiveSecretsRuntimeSnapshotRevisionState() !== previousSnapshotRevision) continue;
			const nextSharedGatewaySessionGeneration = params.resolveSharedGatewaySessionGenerationForConfig(prepared.config);
			const sharedGatewaySessionGenerationChanged = previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration;
			let runtimeSecretsPublished = false;
			let runtimeCommitted = false;
			let publishedSnapshotRevision = null;
			let publishedSharedGatewaySessionGeneration = null;
			let runtimePolicyReconciled = false;
			let applicationStatus;
			const rollbackPublication = async (restore) => {
				const generationOwnership = publishedSharedGatewaySessionGeneration;
				if (!runtimeSecretsPublished || publishedSnapshotRevision === null || !generationOwnership) return;
				let generationRestored = false;
				const restoreGeneration = () => {
					generationRestored = params.sharedGatewaySessionGenerationState.restoreCurrent(generationOwnership, previousSharedGatewaySessionGeneration);
				};
				if (await restore(previousSnapshot, publishedSnapshotRevision, prepared, {
					runtimeSourceConfig: previousRuntimeSourceConfig,
					onActivated: restoreGeneration
				})) {
					if (previousSnapshot && shouldRefreshContextWindowCache(plan)) resetContextWindowCache(previousSnapshot.config);
					runtimeSecretsPublished = false;
				}
				if (generationRestored && sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
					state: params.sharedGatewaySessionGenerationState,
					clients: params.clients,
					expectedGeneration: previousSharedGatewaySessionGeneration,
					transition: {
						previous: prepared.config,
						next: previousRuntimeConfig
					}
				});
			};
			try {
				const publication = {
					isCurrent: transactionOwnership.isCurrent,
					checkpoint: transactionOwnership.checkpoint,
					assertInvokerOwned: transactionOwnership.assertInvokerOwned,
					...transactionOwnership.runtimeEnv ? { runtimeEnv: transactionOwnership.runtimeEnv.env } : {},
					sourceConfig,
					prepareRestartRuntimeConfig: () => prepareRestartRuntimeConfig(prepared.config, sourceConfig, transactionOwnership),
					publish: async (commit, isCommitted) => {
						const claimGenerationOwnership = () => {
							publishedSharedGatewaySessionGeneration ??= params.sharedGatewaySessionGenerationState.claim(previousGenerationOwnership, nextSharedGatewaySessionGeneration);
							if (!publishedSharedGatewaySessionGeneration) throw new GatewayHotReloadStaleSecretsError();
						};
						const publishRuntime = async (restore) => {
							runtimeSecretsPublished = true;
							publishedSnapshotRevision = getActiveSecretsRuntimeSnapshotRevisionState();
							claimGenerationOwnership();
							try {
								transactionOwnership.publishRuntimeEnv();
								try {
									await commit();
								} finally {
									if (isCommitted()) {
										runtimeCommitted = true;
										transactionOwnership.markRuntimeCommitted(prepared.config, plan);
										if (!runtimePolicyReconciled) {
											params.commitRuntimePolicy(prepared.config);
											await params.reconcileRuntimePolicy(prepared.config, "committed");
											runtimePolicyReconciled = true;
										}
										if (sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
											state: params.sharedGatewaySessionGenerationState,
											clients: params.clients,
											expectedGeneration: nextSharedGatewaySessionGeneration,
											transition: {
												previous: previousRuntimeConfig,
												next: prepared.config
											}
										});
									}
								}
							} catch (err) {
								if (!isCommitted()) await rollbackPublication(restore);
								throw err;
							}
						};
						const canActivate = () => {
							transactionOwnership.assertInvokerOwned?.();
							return transactionOwnership.isCurrent() && params.sharedGatewaySessionGenerationState.owns(previousGenerationOwnership);
						};
						if (!await params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent(prepared, previousSnapshotRevision, {
							reason: "reload",
							activate: true,
							runtimeSourceConfig: sourceConfig
						}, publishRuntime, canActivate, transactionOwnership.checkpoint)) throw new GatewayHotReloadStaleSecretsError();
					}
				};
				if (isNoopGatewayReloadPlan(plan) && !doesReloadAffectProviderAuth(plan, previousRuntimeConfig, prepared.config)) {
					let committed = false;
					await publication.publish(async () => {
						advancePreparedModelRuntimeConfig(prepared.config);
						committed = true;
					}, () => committed);
					applicationStatus = "applied";
				} else applicationStatus = await applyHotReload(plan, prepared.config, publication);
			} catch (err) {
				if ((err instanceof PluginRuntimeApplicationError && !err.details.committed ? err.cause : err) instanceof GatewayHotReloadStaleSecretsError) {
					await transactionOwnership.checkpoint();
					assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
					continue;
				}
				if (err instanceof GatewayHotReloadRecoveryError) throw err;
				if (runtimeCommitted) throw err;
				await rollbackPublication(params.activateRuntimeSecrets.restoreSnapshotIfCurrent);
				throw err;
			}
			if (publishedSharedGatewaySessionGeneration) params.sharedGatewaySessionGenerationState.finalize(publishedSharedGatewaySessionGeneration, {
				previous: previousRuntimeConfig,
				next: prepared.config
			});
			return applicationStatus;
		}
	};
	return {
		onEffectiveConfigUnchanged,
		onHotReload,
		prepareRestartRuntimeConfig
	};
}
//#endregion
//#region src/gateway/server-reload-managed.ts
function startManagedGatewayConfigReloader(params) {
	const runInGatewayReloadContext = AsyncLocalStorage.snapshot();
	const lifecycle = new AbortController();
	if (params.minimalTestGateway) return {
		ready: Promise.resolve(),
		getCommittedRuntimeConfig: () => params.initialConfig,
		stop: async () => {
			lifecycle.abort(new GatewayConfigReloadSupersededError());
		},
		applyPluginLifecycleChange: async () => {
			throw new Error("Plugin lifecycle is unavailable in a minimal Gateway.");
		},
		isConfigReloadSettled: () => !lifecycle.signal.aborted
	};
	const applyRuntimeConfigOverrides = (config) => {
		const applied = params.applyRuntimeConfigOverrides?.(config) ?? config;
		copyConfigResolutionFacts(config, applied);
		return applied;
	};
	const prepareRuntimeCandidate = (runtimeConfig, sourceConfig, ownership) => {
		const canonicalConfig = restoreCanonicalSecretRefs(runtimeConfig, sourceConfig);
		copyConfigResolutionFacts(sourceConfig, canonicalConfig);
		const candidateConfig = ownership?.reapplyRuntimeOverlays(canonicalConfig) ?? canonicalConfig;
		return applyRuntimeConfigOverrides(candidateConfig);
	};
	const restartRecoveryAvailable = params.restartRecoveryAvailable !== false && params.requestRecoveryRestart !== void 0;
	const tryPrepareRuntimeSecrets = async (config, transactionOwnership, activationParams) => {
		await transactionOwnership.checkpoint();
		assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
		const expectedRevision = getActiveSecretsRuntimeSnapshotRevisionState();
		try {
			const snapshot = await params.activateRuntimeSecrets(config, {
				...activationParams,
				activate: false,
				canPublishFailureAsDegraded: () => transactionOwnership.isCurrent() && getActiveSecretsRuntimeSnapshotRevisionState() === expectedRevision
			});
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			return getActiveSecretsRuntimeSnapshotRevisionState() === expectedRevision ? {
				snapshot,
				expectedRevision
			} : null;
		} catch (error) {
			if (lifecycle.signal.aborted) throw error;
			await transactionOwnership.checkpoint();
			assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			if (getActiveSecretsRuntimeSnapshotRevisionState() !== expectedRevision) return null;
			throw error;
		}
	};
	let activeGmailRestartAbortController = null;
	const abortActiveGmailRestart = () => {
		activeGmailRestartAbortController?.abort();
		activeGmailRestartAbortController = null;
	};
	const createGmailRestartAbortController = () => {
		abortActiveGmailRestart();
		const abortController = new AbortController();
		if (lifecycle.signal.aborted) {
			abortController.abort();
			return abortController;
		}
		activeGmailRestartAbortController = abortController;
		return abortController;
	};
	const { applyHotReload, getDeferredChannelReloads, acceptRestartConfig, beginGatewayRestartLifecycle, hasOutstandingGatewayRestart, hasConfigCandidatePending, pauseGatewayRestartForConfigCandidate, publishAppliedConfigHash, publishAcceptedRestartTarget, publishDeferredAppliedConfigHash, recordAcceptedRestartTarget, requestGatewayRestart, restoreConservativeRestartDebt, stopRestartRetries } = createGatewayReloadHandlers({
		...params,
		releaseChannelRouteHandoffs: params.channelManager.releaseChannelRouteHandoffs,
		pruneInactiveChannelAccountState: params.channelManager.pruneInactiveChannelAccountState,
		createGmailRestartAbortController,
		clearGmailRestartAbortController: (abortController) => {
			if (activeGmailRestartAbortController === abortController) activeGmailRestartAbortController = null;
		},
		assertRestartReady: (config) => import("./openclaw-database-preflight-ClnnU5e8.mjs").then(({ assertOpenClawDatabasesReady }) => assertOpenClawDatabasesReady({
			env: process.env,
			operation: "gateway-restart",
			config
		})),
		restartRecoveryAvailable
	});
	const runManagedRestart = async (plan, nextConfig, transactionOwnership, sourceConfig, restartOptions, beforeRestartRequest) => {
		const isCurrent = () => !lifecycle.signal.aborted && transactionOwnership.isCurrent();
		const assertCurrent = () => {
			if (!isCurrent()) throw new GatewayConfigReloadSupersededError();
		};
		await transactionOwnership.checkpoint();
		assertCurrent();
		const restartLifecycle = beginGatewayRestartLifecycle();
		let preparation;
		try {
			for (;;) {
				await transactionOwnership.checkpoint();
				assertCurrent();
				const ownership = params.sharedGatewaySessionGenerationState.capture();
				const previousRuntimeConfig = committedRuntimeConfig;
				const previousRequired = params.sharedGatewaySessionGenerationState.required;
				const prepared = await tryPrepareRuntimeSecrets(prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership), transactionOwnership, {
					reason: "restart-check",
					publishFailureAsDegraded: true,
					...transactionOwnership.runtimeEnv ? { env: transactionOwnership.runtimeEnv.env } : {}
				});
				await transactionOwnership.checkpoint();
				assertCurrent();
				const generationChanged = !params.sharedGatewaySessionGenerationState.owns(ownership);
				if (!prepared || !isRuntimeSecretsPreparationCurrent(prepared) || generationChanged) continue;
				preparation = {
					ownership,
					previousRequired,
					previousCurrent: ownership.generation,
					previousRuntimeConfig,
					nextGeneration: params.resolveSharedGatewaySessionGenerationForConfig(prepared.snapshot.config),
					runtimeConfig: prepared.snapshot.config
				};
				break;
			}
		} catch (error) {
			restartLifecycle.settle("rejected");
			throw error;
		}
		const { ownership: preparationOwnership, previousRequired: previousRequiredSharedGatewaySessionGeneration, previousCurrent: previousSharedGatewaySessionGeneration, nextGeneration: nextSharedGatewaySessionGeneration, runtimeConfig: preparedRuntimeConfig, previousRuntimeConfig } = preparation;
		let restartTransaction;
		let requiredOwnership = null;
		try {
			await transactionOwnership.checkpoint();
			assertCurrent();
			await params.reconcileRuntimePolicy(preparedRuntimeConfig, "restart");
			await transactionOwnership.checkpoint();
			assertCurrent();
			await beforeRestartRequest?.();
			await transactionOwnership.checkpoint();
			assertCurrent();
			requiredOwnership = params.sharedGatewaySessionGenerationState.setRequired(preparationOwnership, previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration ? nextSharedGatewaySessionGeneration : null);
			if (!requiredOwnership) throw new GatewayHotReloadStaleSecretsError();
			transactionOwnership.publishRuntimeEnv();
			restartTransaction = requestGatewayRestart(plan, preparedRuntimeConfig, {
				...restartOptions,
				debtConfig: sourceConfig,
				prepareRuntimeConfig: () => prepareRestartRuntimeConfig(preparedRuntimeConfig, sourceConfig, transactionOwnership)
			});
			if (restartTransaction.status === "recovery-pending") throw new GatewayHotReloadRecoveryError("config restart");
			if (previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration) disconnectStaleSharedGatewayAuthClients({
				state: params.sharedGatewaySessionGenerationState,
				clients: params.clients,
				expectedGeneration: nextSharedGatewaySessionGeneration,
				transition: {
					previous: previousRuntimeConfig,
					next: preparedRuntimeConfig
				}
			});
			restartTransaction.settle("committed");
			transactionOwnership.commitRuntimeEnv();
			restartLifecycle.settle("committed");
		} catch (error) {
			restartTransaction?.settle("rejected");
			restartLifecycle.settle("rejected");
			transactionOwnership.rollbackRuntimeEnv();
			if (requiredOwnership) params.sharedGatewaySessionGenerationState.setRequired(requiredOwnership, previousRequiredSharedGatewaySessionGeneration);
			throw error;
		}
	};
	const { onEffectiveConfigUnchanged, onHotReload, prepareRestartRuntimeConfig } = createManagedReloadSecretHandlers({
		params,
		prepareRuntimeCandidate,
		tryPrepareRuntimeSecrets,
		applyHotReload
	});
	let committedRuntimeConfig = params.initialConfig;
	const configReloader = startGatewayConfigReloader({
		scheduler: params.scheduler,
		onReloadEnabledChange: params.onReloadEnabledChange,
		initialConfig: params.initialConfig,
		initialCompareConfig: params.initialCompareConfig,
		initialSnapshotRawHash: params.initialSnapshotRawHash,
		initialAuthoredConfig: params.initialAuthoredConfig,
		initialIncludedPaths: params.initialIncludedPaths ?? [],
		initialSnapshotValid: params.initialSnapshotValid,
		initialSnapshotIssues: params.initialSnapshotIssues,
		initialPluginInstallRecords: params.initialPluginInstallRecords,
		onConfigCandidateCommitted: (info) => {
			invalidateConfigGetResponseCache();
			params.broadcast("config.changed", {
				path: info.path,
				hash: info.persistedHash ? params.configRevisionProjector.projectRawHash(info.persistedHash) : null,
				ts: Date.now()
			}, { dropIfSlow: true });
		},
		onRuntimeConfigCommitted: (plan, nextCommittedRuntimeConfig) => {
			const sessionStoresChanged = committedRuntimeConfig.session?.store !== nextCommittedRuntimeConfig.session?.store || plan.changedPaths.some((path) => path === "env" || path.startsWith("env."));
			committedRuntimeConfig = nextCommittedRuntimeConfig;
			publishOperatorRoleConfigChange(params.resolveGatewayContext?.());
			if (sessionStoresChanged) publishSystemEventStoreConfig(nextCommittedRuntimeConfig);
			params.resolveGatewayContext?.()?.mentionInbox?.invalidateAsync();
		},
		...params.prepareConfigCandidate ? { prepareConfigCandidate: params.prepareConfigCandidate } : {},
		runTransaction: (run) => runInGatewayReloadContext(() => runOutsideAsyncWorkScope(() => runOutsideGatewayRootWorkAdmission(() => runWithGatewayIndependentRootWorkAdmission(run, "reload:config", lifecycle.signal).catch((error) => {
			if (lifecycle.signal.reason instanceof GatewayConfigReloadSupersededError && error instanceof Error && error.cause === lifecycle.signal.reason) throw lifecycle.signal.reason;
			throw error;
		})))),
		readSnapshot: params.readSnapshot,
		promoteSnapshot: async (snapshot, _reason) => await params.promoteSnapshot(snapshot),
		subscribeToWrites: params.subscribeToWrites,
		onConfigCandidateObserved: () => {
			invalidateConfigGetResponseCache();
			pauseGatewayRestartForConfigCandidate();
		},
		onConfigChange: (plan, nextConfig) => {
			assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable);
			params.prepareTerminalConfig(plan, applyRuntimeConfigOverrides(nextConfig));
		},
		onConfigAccepted: async (nextConfig, transactionOwnership, sourceConfig, acceptance) => {
			const assertCurrent = () => {
				assertReloadPublicationCurrent(transactionOwnership.isCurrent(), false);
			};
			const createRestartTarget = () => ({
				runtimeConfig: prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership),
				sourceConfig,
				prepareRuntimeConfig: () => prepareRestartRuntimeConfig(nextConfig, sourceConfig, transactionOwnership)
			});
			let acceptedTargetOwnership;
			let lateConservativeDebt = null;
			try {
				await transactionOwnership.checkpoint();
				assertCurrent();
				const acceptedRestart = acceptRestartConfig(sourceConfig);
				if (!acceptance.runtimeApplied) {
					await transactionOwnership.checkpoint();
					assertCurrent();
					recordAcceptedRestartTarget(createRestartTarget());
					params.acceptTerminalConfig({ retireRejectedRestart: acceptedRestart.retireRejectedRestart });
					publishDeferredAppliedConfigHash();
					return;
				}
				if (acceptedRestart.debt) await runManagedRestart(acceptedRestart.debt.plan, nextConfig, transactionOwnership, sourceConfig, { retainDebtAcrossConfigChanges: acceptedRestart.debt.retainDebtAcrossConfigChanges }, acceptance.publishSource);
				else await acceptance.publishSource?.();
				await transactionOwnership.checkpoint();
				assertCurrent();
				const acceptedTarget = publishAcceptedRestartTarget(createRestartTarget());
				acceptedTargetOwnership = acceptedTarget.ownership;
				lateConservativeDebt = acceptedTarget.conservativeDebt;
				if (lateConservativeDebt && lateConservativeDebt !== acceptedRestart.debt) await runManagedRestart(lateConservativeDebt.plan, nextConfig, transactionOwnership, sourceConfig, { retainDebtAcrossConfigChanges: lateConservativeDebt.retainDebtAcrossConfigChanges });
				await transactionOwnership.checkpoint();
				assertCurrent();
				params.acceptTerminalConfig({ retireRejectedRestart: acceptedRestart.retireRejectedRestart && !lateConservativeDebt });
				publishDeferredAppliedConfigHash();
			} catch (error) {
				if (lateConservativeDebt) restoreConservativeRestartDebt(lateConservativeDebt);
				acceptedTargetOwnership?.reject();
				throw error;
			}
		},
		onConfigApplied: (plan, nextConfig) => {
			if (plan.changedPaths.some((path) => path === "logging" || path.startsWith("logging."))) applyLoggingConfig(nextConfig.logging);
			resetSkillSnapshotConfigFingerprintCache();
		},
		onConfigRevisionApplied: publishAppliedConfigHash,
		hasOutstandingGatewayRestart,
		onEffectiveConfigUnchanged,
		onNoopConfigCommit: onHotReload,
		onHotReload,
		onRestart: runManagedRestart,
		log: params.logReload,
		watchPath: params.watchPath
	});
	return {
		ready: configReloader.ready,
		getCommittedRuntimeConfig: () => committedRuntimeConfig,
		stop: async () => {
			lifecycle.abort(new GatewayConfigReloadSupersededError());
			stopRestartRetries();
			abortPendingChannelReloads();
			abortActiveGmailRestart();
			await configReloader.stop();
		},
		hotReloadStatus: configReloader.hotReloadStatus,
		getDeferredChannelReloads,
		applyPluginLifecycleChange: configReloader.applyPluginLifecycleChange,
		isConfigReloadSettled: () => configReloader.isReady() && !lifecycle.signal.aborted && !configReloader.isReloading() && !hasConfigCandidatePending() && !hasOutstandingGatewayRestart()
	};
}
//#endregion
export { startManagedGatewayConfigReloader };
