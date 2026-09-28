import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { _ as adoptCodexNativeSubagentSubmissions, a as ownsStoredSessionGeneration, c as readCodexBindingTimestamp, d as readCurrentCodexNativeSubagentSubmissions, f as readPluginAppPolicyContext, g as validateBindingForWrite, h as stripUndefinedBinding, i as matchesCodexNativeSubagentSubmissionBinding, l as readCurrentCodexAppServerBinding, m as sessionBindingIdentity, n as assertCodexBindingMayBeReplaced, o as preserveCodexNativeSubagentSubmissions, p as readStoredCodexAppServerBinding, r as bindingStoreKey, s as readCodexAppServerThreadBinding, t as CodexSupervisionBindingReplacementError, u as readCurrentCodexAppServerBindings, v as mutateCodexNativeSubagentSubmissions } from "./session-binding-record-BGoz8wOK.mjs";
import { n as CODEX_APP_SERVER_BINDING_NAMESPACE, t as CODEX_APP_SERVER_BINDING_MAX_ENTRIES } from "./session-binding-meta-B7aEMU7g.mjs";
import { n as normalizeCodexAppServerBindingModelProvider } from "./auth-profile-WqZtZfXN.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash, randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { AgentHarnessSessionSupersededError, embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
import { getSessionEntry, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
//#region extensions/codex/src/app-server/session-binding.ts
/** SQLite-backed Codex app-server thread bindings. */
var session_binding_exports = /* @__PURE__ */ __exportAll({
	CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS: () => CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS,
	CODEX_APP_SERVER_BINDING_MAX_ENTRIES: () => CODEX_APP_SERVER_BINDING_MAX_ENTRIES,
	CODEX_APP_SERVER_BINDING_NAMESPACE: () => CODEX_APP_SERVER_BINDING_NAMESPACE,
	CodexSupervisionBindingReplacementError: () => CodexSupervisionBindingReplacementError,
	assertCodexBindingMayBeReplaced: () => assertCodexBindingMayBeReplaced,
	bindingStoreKey: () => bindingStoreKey,
	createCodexAppServerBindingStore: () => createCodexAppServerBindingStore,
	createCodexSessionGenerationSupersededError: () => createCodexSessionGenerationSupersededError,
	createStoredCodexAppServerBinding: () => createStoredCodexAppServerBinding,
	hashCodexAppServerBindingFingerprint: () => hashCodexAppServerBindingFingerprint,
	normalizeStoredCodexAppServerBindingFingerprints: () => normalizeStoredCodexAppServerBindingFingerprints,
	readCodexAppServerThreadBinding: () => readCodexAppServerThreadBinding,
	readStoredCodexAppServerBinding: () => readStoredCodexAppServerBinding,
	reclaimCurrentCodexSessionGeneration: () => reclaimCurrentCodexSessionGeneration,
	resolveCodexRunSessionBindingAuthority: () => resolveCodexRunSessionBindingAuthority,
	resolveCodexSessionBinding: () => resolveCodexSessionBinding,
	sessionBindingIdentity: () => sessionBindingIdentity,
	validateBindingForWrite: () => validateBindingForWrite
});
const BINDING_LEASE_RETRY_INTERVAL_MS = 1e3;
const BOUNDED_BINDING_FINGERPRINT_PATTERN = /^sha256:[a-f0-9]{64}$/i;
const CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS = 6e4;
const BINDING_LEASE_STALE_MS = 65e3;
const BINDING_LEASE_WAIT_MS = 7e4;
const BINDING_LEASE_RENEW_INTERVAL_MS = Math.floor(BINDING_LEASE_STALE_MS / 3);
const PHYSICAL_SESSION_RETIRE_TTL_MS = BINDING_LEASE_WAIT_MS;
/** Decides whether a run may share the durable stable-key binding owner. */
function resolveCodexRunSessionBindingAuthority(params) {
	return captureCodexSessionGenerationAuthority(params)[0];
}
/** Host lineage is recorded in the same transaction as its successor generation. */
function readCodexBindingSessionEntry(params) {
	const { identity } = params;
	return identity.sessionKey?.trim() ? getSessionEntry({
		agentId: identity.agentId,
		sessionKey: identity.sessionKey.trim(),
		storePath: params.storePath?.trim() || resolveStorePath(params.config?.session?.store, { agentId: identity.agentId }),
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	}) : void 0;
}
/** Synchronous model selection recognizes the predecessor; admission rewrites its fence. */
function readCodexSessionOwnershipBinding(params) {
	const binding = params.bindingStore.read(params.identity);
	if (binding || params.identity.kind !== "session") return binding;
	const entry = readCodexBindingSessionEntry({
		...params,
		identity: params.identity
	});
	return entry?.sessionId === params.identity.sessionId && entry.previousSessionId ? params.bindingStore.read({
		...params.identity,
		sessionId: entry.previousSessionId
	}) : void 0;
}
function captureCodexSessionGenerationAuthority(params, assertCallerCurrent = () => {}) {
	const readEntry = () => {
		try {
			return readCodexBindingSessionEntry(params);
		} catch {
			return null;
		}
	};
	const entry = readEntry();
	const current = entry?.sessionId === params.identity.sessionId;
	const authority = entry === void 0 ? "ephemeral" : current ? "current" : "superseded";
	const previousSessionId = current ? entry.previousSessionId : void 0;
	const assertHostCurrent = () => {
		if (authority === "ephemeral") return;
		const latest = readEntry();
		if (authority !== "current" || !latest || latest.sessionId !== params.identity.sessionId || latest.previousSessionId !== previousSessionId) throw createCodexSessionGenerationSupersededError(params.identity.sessionId);
	};
	const assertCurrent = () => {
		assertCallerCurrent();
		assertHostCurrent();
	};
	return [
		authority,
		previousSessionId,
		assertHostCurrent,
		assertCurrent
	];
}
/** Builds the terminal coordination error used when a newer OpenClaw session owns the binding. */
function createCodexSessionGenerationSupersededError(sessionId) {
	return new AgentHarnessSessionSupersededError(`Codex session generation is no longer current: ${sessionId}`);
}
function hashCodexAppServerBindingFingerprint(canonical) {
	return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}
function normalizeLegacyBindingFingerprint(value) {
	if (typeof value !== "string" || value === "" || value === "[]" || BOUNDED_BINDING_FINGERPRINT_PATTERN.test(value)) return value;
	return hashCodexAppServerBindingFingerprint(value);
}
function normalizeLegacyBindingFingerprints(record) {
	let normalized = record;
	for (const key of ["dynamicToolsFingerprint", "userMcpServersFingerprint"]) {
		const value = record[key];
		const next = normalizeLegacyBindingFingerprint(value);
		if (next === value) continue;
		if (normalized === record) normalized = { ...record };
		Object.assign(normalized, { [key]: next });
	}
	return normalized;
}
function normalizeStoredCodexAppServerBindingFingerprints(value) {
	const stored = readStoredCodexAppServerBinding(value);
	if (!stored || stored.state !== "active") return stored;
	const binding = normalizeLegacyBindingFingerprints(stored.binding);
	return binding === stored.binding ? stored : readStoredCodexAppServerBinding({
		...stored,
		binding
	});
}
/** Encodes a migrated sidecar binding as one canonical plugin-state row. */
function createStoredCodexAppServerBinding(value, options = {}) {
	const rawRecord = asOptionalRecord(value);
	if (!rawRecord) return;
	const record = normalizeLegacyBindingFingerprints(rawRecord);
	if (record.schemaVersion !== 1 && record.schemaVersion !== 2) return;
	const pluginAppPolicyContext = readPluginAppPolicyContext(record.pluginAppPolicyContext, record.schemaVersion);
	const historyCoveredThrough = readCodexBindingTimestamp(record.historyCoveredThrough) ?? readCodexBindingTimestamp(record.updatedAt) ?? readCodexBindingTimestamp(record.createdAt) ?? readCodexBindingTimestamp(options.now) ?? (/* @__PURE__ */ new Date()).toISOString();
	const authProfileId = typeof record.authProfileId === "string" ? record.authProfileId : void 0;
	const binding = readCodexAppServerThreadBinding({
		...record,
		modelProvider: normalizeCodexAppServerBindingModelProvider({
			...options.lookup,
			authProfileId,
			modelProvider: typeof record.modelProvider === "string" ? record.modelProvider : void 0
		}),
		cwd: typeof record.cwd === "string" ? record.cwd : "",
		pluginAppPolicyContext,
		historyCoveredThrough
	});
	return binding ? {
		version: 1,
		state: "active",
		binding: stripUndefinedBinding(binding)
	} : void 0;
}
function bindingLeaseLostError(key, cause) {
	return new Error(`Lost Codex binding lease: ${key}`, cause === void 0 ? void 0 : { cause });
}
async function reclaimPreparedCodexSessionGeneration(params, authority, assertCurrent = authority[3]) {
	const plan = await params.bindingStore.prepareSessionGenerationReclaim(params.identity);
	assertCurrent();
	if (plan.kind === "resolved") return plan.result;
	const [state, previousSessionId, assertHostCurrent] = authority;
	if (state !== "current") return false;
	params.onHostGenerationVerified?.(assertHostCurrent);
	if (previousSessionId === plan.expectedPreviousSessionId) {
		const adopted = await params.bindingStore.adoptSessionGeneration(params.identity, previousSessionId, assertCurrent);
		if (adopted !== "absent") return adopted !== "conflict";
	}
	if (params.reclaimStale === false) return false;
	return params.bindingStore.mutate(params.identity, {
		kind: "reclaim-generation",
		expectedPreviousSessionId: plan.expectedPreviousSessionId
	}, assertCurrent);
}
/** Lets the authoritative OpenClaw session generation claim a stale stable binding row. */
async function reclaimCurrentCodexSessionGeneration(params) {
	params.assertCurrent?.();
	if (!params.identity.sessionKey?.trim()) return true;
	const authority = captureCodexSessionGenerationAuthority(params, params.assertCurrent);
	if (authority[0] === "superseded") return false;
	return reclaimPreparedCodexSessionGeneration(params, authority);
}
/** Resolve continuity before selecting native queues, catalogs, or connections. */
async function resolveCodexSessionBinding(params) {
	let assertCurrent = params.assertCurrent ?? (() => {});
	const assertAdmissionCurrent = () => {
		assertCurrent();
		params.signal?.throwIfAborted();
	};
	assertAdmissionCurrent();
	params.assertBinding?.(readCodexSessionOwnershipBinding(params));
	const identity = params.identity;
	const authority = identity.kind === "session" && identity.sessionKey?.trim() ? captureCodexSessionGenerationAuthority({
		...params,
		identity
	}, assertCurrent) : void 0;
	assertCurrent = authority?.[3] ?? assertCurrent;
	assertAdmissionCurrent();
	let binding = params.bindingStore.read(identity);
	if (!binding && authority && identity.kind === "session") {
		if (!await reclaimPreparedCodexSessionGeneration({
			...params,
			identity,
			reclaimStale: params.reclaimStale === true
		}, authority, assertAdmissionCurrent) && params.reclaimStale) throw createCodexSessionGenerationSupersededError(identity.sessionId);
		binding = params.bindingStore.read(identity);
	}
	assertAdmissionCurrent();
	params.assertBinding?.(binding);
	return {
		binding,
		assertCurrent
	};
}
/** Creates the single binding facade owned by the Codex plugin runtime. */
function createCodexAppServerBindingStore(state) {
	const update = state.update?.bind(state);
	if (!update) throw new Error("Codex app-server bindings require atomic plugin-state updates");
	const leaseContext = new AsyncLocalStorage();
	const archiveContext = new AsyncLocalStorage();
	let activeBindingMutations = 0;
	let pendingArchives = 0;
	let archiveTail = Promise.resolve();
	let bindingMutationsDrained = [];
	const waitForBindingMutations = async () => {
		if (activeBindingMutations === 0) return;
		await new Promise((resolve) => {
			bindingMutationsDrained.push(resolve);
		});
	};
	const runBindingMutation = async (run) => {
		if (archiveContext.getStore() === true) return await run();
		if (pendingArchives > 0) throw new Error("Codex binding mutation blocked while a native archive is in progress; retry");
		activeBindingMutations += 1;
		try {
			return await run();
		} finally {
			activeBindingMutations -= 1;
			if (activeBindingMutations === 0) {
				const drained = bindingMutationsDrained;
				bindingMutationsDrained = [];
				for (const resolve of drained) resolve();
			}
		}
	};
	const renewLease = (key, owner) => {
		if (owner.failure || owner.phase !== "held") return;
		try {
			let renewed = false;
			owner.assertCurrent?.();
			const stored = update(key, (raw) => {
				const current = readStoredCodexAppServerBinding(raw);
				if (raw !== void 0 && !current) throw new Error(`Invalid Codex app-server binding row: ${key}`);
				const lease = current?.lease;
				const now = Date.now();
				if (!lease || lease.token !== owner.token || lease.expiresAt <= now) return;
				renewed = true;
				return {
					...current,
					lease: {
						token: owner.token,
						expiresAt: now + BINDING_LEASE_STALE_MS
					}
				};
			});
			if (!renewed || !stored) owner.failure = bindingLeaseLostError(key);
		} catch (error) {
			owner.failure = bindingLeaseLostError(key, error);
		}
	};
	const transactKey = async (key, apply, ttlMs, assertCurrent) => {
		const deadline = Date.now() + BINDING_LEASE_WAIT_MS;
		while (true) {
			let busy = false;
			let leaseLost = false;
			let result;
			const ownedLease = leaseContext.getStore()?.get(key);
			if (ownedLease && ownedLease.phase !== "held") throw bindingLeaseLostError(key);
			if (ownedLease?.failure) throw ownedLease.failure;
			const ownedToken = ownedLease?.token;
			assertCurrent?.();
			ownedLease?.assertCurrent?.();
			update(key, (raw) => {
				const current = readStoredCodexAppServerBinding(raw);
				if (raw !== void 0 && !current) throw new Error(`Invalid Codex app-server binding row: ${key}`);
				const activeLease = current?.lease;
				const now = Date.now();
				if (ownedToken && (!activeLease || activeLease.token !== ownedToken || activeLease.expiresAt <= now)) {
					leaseLost = true;
					return;
				}
				if (activeLease && activeLease.token !== ownedToken && activeLease.expiresAt > now) {
					busy = true;
					return;
				}
				const applied = apply(current, ownedToken);
				result = applied.result;
				return applied.next;
			}, ttlMs == null ? void 0 : { ttlMs });
			if (leaseLost) {
				const failure = bindingLeaseLostError(key);
				if (ownedLease) ownedLease.failure = failure;
				throw failure;
			}
			if (!busy) return result;
			if (Date.now() >= deadline) throw new Error(`Timed out waiting for Codex binding lease: ${key}`);
			await sleep(BINDING_LEASE_RETRY_INTERVAL_MS);
		}
	};
	const withBindingLease = async (identity, run, options = {}) => {
		options.assertCurrent?.();
		const key = bindingStoreKey(identity);
		const owned = leaseContext.getStore();
		const existingOwner = owned?.get(key);
		if (existingOwner) {
			if (existingOwner.phase !== "held") throw bindingLeaseLostError(key);
			const failureBeforeRun = existingOwner.failure;
			if (failureBeforeRun) throw failureBeforeRun;
			const result = await run();
			options.assertCurrent?.();
			const failureAfterRun = existingOwner.failure;
			if (failureAfterRun) throw failureAfterRun;
			return result;
		}
		const token = randomUUID();
		const acquired = await transactKey(key, (current) => {
			if (current?.state === "cleared" && current.retired === true && ownsStoredSessionGeneration(identity, current) && !options.allowRetired) return { result: false };
			const lease = {
				token,
				expiresAt: Date.now() + BINDING_LEASE_STALE_MS
			};
			if (current?.state === "active") return {
				result: true,
				next: {
					...current,
					...preservedSessionGeneration(identity, current),
					lease
				}
			};
			if (current?.state === "cleared" && current.retired === true) return {
				result: true,
				next: {
					...current,
					lease
				}
			};
			return {
				result: true,
				next: {
					version: 1,
					state: "cleared",
					...preservedSessionGeneration(identity, current),
					lease
				}
			};
		}, void 0, options.assertCurrent);
		options.assertCurrent?.();
		if (!acquired) throw new Error(`Codex binding generation was retired: ${key}`);
		const owner = {
			token,
			phase: "held",
			assertCurrent: options.assertCurrent
		};
		const nested = new Map(owned);
		nested.set(key, owner);
		const heartbeat = setInterval(() => renewLease(key, owner), BINDING_LEASE_RENEW_INTERVAL_MS);
		heartbeat.unref();
		try {
			const result = await leaseContext.run(nested, run);
			options.assertCurrent?.();
			if (owner.failure) throw owner.failure;
			return result;
		} finally {
			clearInterval(heartbeat);
			owner.phase = "closed";
			options.assertCurrent?.();
			try {
				const current = readStoredCodexAppServerBinding(state.lookup(key));
				if (current?.lease?.token === token) {
					const ttlMs = current.state === "active" || current.retired === true && !key.startsWith("session:") ? void 0 : current.retired === true ? PHYSICAL_SESSION_RETIRE_TTL_MS : 1;
					options.assertCurrent?.();
					update(key, (raw) => {
						const stored = readStoredCodexAppServerBinding(raw);
						if (stored?.lease?.token !== token) return;
						const { lease: _lease, ...released } = stored;
						return released;
					}, ttlMs === void 0 ? void 0 : { ttlMs });
				}
			} catch (error) {
				options.assertCurrent?.();
				embeddedAgentLog.warn("failed to release codex app-server binding lease", {
					key,
					error
				});
			}
		}
	};
	const transitionSessionGeneration = async (identity, mode) => {
		return await runBindingMutation(async () => {
			const key = bindingStoreKey(identity);
			const ttlMs = mode === "reset" ? leaseContext.getStore()?.has(key) ? void 0 : 1 : identity.sessionKey?.trim() ? void 0 : PHYSICAL_SESSION_RETIRE_TTL_MS;
			return await transactKey(key, (current, leaseToken) => {
				if (!current) return { result: "absent" };
				if (!ownsStoredSessionGeneration(identity, current)) return { result: "conflict" };
				if (current.state === "cleared" && current.retired === true) return { result: mode === "retire" ? "applied" : "conflict" };
				return {
					result: "applied",
					next: {
						version: 1,
						state: "cleared",
						...mode === "retire" ? { retired: true } : {},
						...storedSessionGeneration(identity, current),
						...current.lease && current.lease.token === leaseToken ? { lease: current.lease } : {}
					}
				};
			}, ttlMs);
		});
	};
	return {
		read: (identity) => readCurrentCodexAppServerBinding(state, identity),
		...state.lookupMany ? { readMany: (identities) => readCurrentCodexAppServerBindings(state, identities) } : {},
		readNativeSubagentSubmissions: (identity, owner) => readCurrentCodexNativeSubagentSubmissions(state, identity, owner),
		async hasOtherThreadOwner(threadId, currentIdentity) {
			const currentKey = currentIdentity ? bindingStoreKey(currentIdentity) : void 0;
			return state.entries().some(({ key, value }) => {
				const stored = readStoredCodexAppServerBinding(value);
				if (!stored) throw new Error(`Invalid Codex app-server binding row: ${key}`);
				const isCurrentOwner = currentIdentity !== void 0 && key === currentKey && (currentIdentity.kind === "conversation" || stored.sessionId === currentIdentity.sessionId.trim());
				if (stored.state !== "active" || stored.binding.threadId !== threadId || isCurrentOwner) return false;
				return true;
			});
		},
		async prepareSessionGenerationReclaim(identity) {
			const key = bindingStoreKey(identity);
			const raw = state.lookup(key);
			const current = readStoredCodexAppServerBinding(raw);
			if (raw !== void 0 && !current) throw new Error(`Invalid Codex app-server binding row: ${key}`);
			if (!current) return {
				kind: "resolved",
				result: true
			};
			const currentSessionId = current.sessionId;
			if (!currentSessionId) return {
				kind: "resolved",
				result: current.state !== "cleared" || current.retired !== true
			};
			if (currentSessionId === identity.sessionId) return current.state === "cleared" && current.retired === true ? {
				kind: "verify",
				expectedPreviousSessionId: currentSessionId
			} : {
				kind: "resolved",
				result: true
			};
			return {
				kind: "verify",
				expectedPreviousSessionId: currentSessionId
			};
		},
		async mutate(identity, mutation, assertCurrent) {
			return await runBindingMutation(async () => {
				const key = bindingStoreKey(identity);
				const retainLegacyClear = mutation.kind === "clear" && key.startsWith("conversation:legacy-");
				return await transactKey(key, (current, leaseToken) => {
					if (mutation.kind === "record-native-subagent-submission" || mutation.kind === "consume-native-subagent-submission") {
						if (!assertCurrent) throw new Error("Codex native subagent submission mutation requires current authority.");
						assertCurrent();
						if (current?.state !== "active" || !ownsStoredSessionGeneration(identity, current) || identity.kind === "session" && mutation.owner.sessionId !== identity.sessionId || !matchesCodexNativeSubagentSubmissionBinding(current.binding, mutation.owner)) return { result: false };
						const changed = mutateCodexNativeSubagentSubmissions({
							current: current.nativeSubagentSubmissions,
							owner: mutation.owner,
							receipt: mutation.receipt,
							consume: mutation.kind === "consume-native-subagent-submission"
						});
						if (!changed.applied) return { result: false };
						const { nativeSubagentSubmissions: _previous, ...bindingOwner } = current;
						return {
							result: true,
							next: {
								...bindingOwner,
								...changed.next ? { nativeSubagentSubmissions: changed.next } : {}
							}
						};
					}
					const ownsGeneration = ownsStoredSessionGeneration(identity, current);
					const ownedLease = current?.lease && current.lease.token === leaseToken ? { lease: current.lease } : {};
					if (mutation.kind === "reclaim-generation") {
						if (identity.kind !== "session" || !identity.sessionKey?.trim()) return { result: false };
						if (!current) return { result: true };
						if (ownsGeneration) {
							if (current.state === "cleared" && current.retired === true && current.sessionId === mutation.expectedPreviousSessionId) return {
								result: true,
								next: {
									version: 1,
									state: "cleared",
									sessionId: identity.sessionId,
									...ownedLease
								}
							};
							return { result: current.state !== "cleared" || current.retired !== true };
						}
						if (current.sessionId !== mutation.expectedPreviousSessionId) return { result: false };
						if (current.state === "active" && current.binding.connectionScope === "supervision") return { result: false };
						return {
							result: true,
							next: {
								version: 1,
								state: "cleared",
								sessionId: identity.sessionId,
								...ownedLease
							}
						};
					}
					const storedActive = current?.state === "active" ? current : void 0;
					const active = ownsGeneration ? storedActive : void 0;
					const retiredGeneration = current?.state === "cleared" && current.retired === true && ownsGeneration;
					const preservesSupervisionOwner = mutation.kind === "set" && active?.binding.connectionScope === "supervision" && isSameSupervisionOwner(active.binding, mutation.binding);
					const replacesExpectedOrdinaryOwner = mutation.kind === "replace-thread" && active?.binding.threadId === mutation.expectedThreadId && active.binding.connectionScope !== "supervision" && mutation.binding.connectionScope !== "supervision" && mutation.binding.threadId !== mutation.expectedThreadId;
					if (mutation.kind === "set" && (mutation.if?.kind === "absent" && storedActive || current !== void 0 && !ownsGeneration || retiredGeneration || active?.binding.connectionScope === "supervision" && !preservesSupervisionOwner) || mutation.kind === "patch" && active?.binding.threadId !== mutation.threadId || mutation.kind === "replace-thread" && !replacesExpectedOrdinaryOwner || (mutation.kind === "patch-pending-supervision-branch" || mutation.kind === "commit-pending-supervision-branch") && !matchesPendingSupervisionBranch(active?.binding, mutation.expected) || mutation.kind === "clear" && (!ownsGeneration || mutation.threadId !== void 0 && active?.binding.threadId !== mutation.threadId || active?.binding.connectionScope === "supervision")) return { result: false };
					if (mutation.kind === "clear" && retiredGeneration) return { result: true };
					if (mutation.kind === "clear") return {
						result: true,
						next: {
							version: 1,
							state: "cleared",
							...storedSessionGeneration(identity, current),
							...ownedLease
						}
					};
					let binding;
					if (mutation.kind === "set" || mutation.kind === "replace-thread") binding = validateBindingForWrite(mutation.binding);
					else if (mutation.kind === "patch-pending-supervision-branch") binding = validateBindingForWrite({
						...active.binding,
						pendingSupervisionBranch: mutation.pending
					});
					else if (mutation.kind === "commit-pending-supervision-branch") binding = validateBindingForWrite({
						...active.binding,
						...mutation.patch,
						threadId: mutation.threadId,
						pendingSupervisionBranch: void 0
					});
					else binding = validateBindingForWrite({
						...active.binding,
						...mutation.patch,
						threadId: mutation.threadId
					});
					const nativeSubagentSubmissions = active ? preserveCodexNativeSubagentSubmissions(active.binding, binding, active.nativeSubagentSubmissions) : void 0;
					return {
						result: true,
						next: {
							version: 1,
							state: "active",
							binding,
							...nativeSubagentSubmissions !== void 0 ? { nativeSubagentSubmissions } : {},
							...storedSessionGeneration(identity, current),
							...ownedLease
						}
					};
				}, mutation.kind === "clear" && !retainLegacyClear && !leaseContext.getStore()?.has(key) ? 1 : void 0, assertCurrent);
			});
		},
		async adoptSessionGeneration(identity, expectedPreviousSessionId, assertCurrent) {
			return await runBindingMutation(async () => {
				const key = bindingStoreKey(identity);
				const expectedSessionId = expectedPreviousSessionId.trim();
				const targetSessionId = identity.sessionId.trim();
				if (!expectedSessionId) throw new Error("Codex session generation adoption requires the previous session id");
				return await transactKey(key, (current) => {
					if (current?.state !== "active") return { result: "absent" };
					if (current.sessionId === targetSessionId) return { result: "current" };
					if (current.sessionId !== expectedSessionId) return { result: "conflict" };
					const { nativeSubagentSubmissions, ...bindingOwner } = current;
					const adoptedSubmissions = adoptCodexNativeSubagentSubmissions(nativeSubagentSubmissions);
					return {
						result: "adopted",
						next: {
							...bindingOwner,
							sessionId: targetSessionId,
							...adoptedSubmissions !== void 0 ? { nativeSubagentSubmissions: adoptedSubmissions } : {}
						}
					};
				}, void 0, assertCurrent);
			});
		},
		resetSessionGeneration: (identity) => transitionSessionGeneration(identity, "reset"),
		retireSessionGeneration: (identity) => transitionSessionGeneration(identity, "retire"),
		async withThreadArchiveFence(run) {
			pendingArchives += 1;
			const operation = archiveTail.then(async () => {
				await waitForBindingMutations();
				return await archiveContext.run(true, run);
			});
			archiveTail = operation.then(() => void 0, () => void 0);
			try {
				return await operation;
			} finally {
				pendingArchives -= 1;
			}
		},
		async withSessionDeletion(identity, assertCurrent, run) {
			const key = bindingStoreKey(identity);
			const deleteIf = state.deleteIf?.bind(state);
			if (!deleteIf) throw new Error("Codex session deletion requires conditional plugin-state deletion");
			return await runBindingMutation(async () => {
				assertCurrent();
				if (state.lookup(key) === void 0) {
					let active = true;
					try {
						return await run(void 0, {
							commit() {
								assertCurrent();
								if (!active || state.lookup(key) !== void 0) throw new Error("Codex binding changed before session deletion");
							},
							rollback() {}
						});
					} finally {
						active = false;
					}
				}
				return await withBindingLease(identity, async () => {
					const owner = leaseContext.getStore().get(key);
					const expected = state.lookup(key);
					const stored = readStoredCodexAppServerBinding(expected);
					if (!stored || !ownsStoredSessionGeneration(identity, stored)) throw new Error("Codex binding generation changed before session deletion");
					const { lease: _lease, ...expectedValue } = stored;
					let deleted;
					let active = true;
					const assertActive = () => {
						assertCurrent();
						if (!active || owner.phase === "closed" || owner.failure) throw owner.failure ?? bindingLeaseLostError(key);
					};
					try {
						return await run(stored.state === "active" ? stored.binding : void 0, {
							commit() {
								assertActive();
								if (deleted) return;
								const current = state.lookup(key);
								const { lease, ...value } = readStoredCodexAppServerBinding(current) ?? {};
								if (!current || lease?.token !== owner.token || lease.expiresAt <= Date.now() || !isDeepStrictEqual(value, expectedValue) || !deleteIf(key, (raw) => isDeepStrictEqual(raw, current))) throw new Error("Codex binding changed before session deletion");
								deleted = current;
								owner.phase = "deleted";
							},
							rollback() {
								assertActive();
								if (!deleted) return;
								const restored = {
									...deleted,
									lease: {
										token: owner.token,
										expiresAt: Date.now() + BINDING_LEASE_STALE_MS
									}
								};
								if (!state.registerIfAbsent(key, restored)) throw new Error("Codex binding changed before session deletion rollback");
								deleted = void 0;
								owner.phase = "held";
							}
						});
					} finally {
						active = false;
					}
				}, {
					allowRetired: true,
					assertCurrent
				});
			});
		},
		withLease: withBindingLease
	};
}
function matchesPendingSupervisionBranch(binding, expected) {
	const pending = binding?.pendingSupervisionBranch;
	if (!pending || binding?.threadId !== expected.sourceThreadId) return false;
	if (pending.sourceThreadId !== expected.sourceThreadId || pending.connectionFingerprint !== expected.connectionFingerprint || pending.lastTurnId !== expected.lastTurnId) return false;
	const currentCleanup = pending.cleanupThreadIds ?? [];
	const expectedCleanup = expected.cleanupThreadIds ?? [];
	return currentCleanup.length === expectedCleanup.length && currentCleanup.every((threadId, index) => threadId === expectedCleanup[index]);
}
function isSameSupervisionOwner(current, replacement) {
	return replacement.connectionScope === "supervision" && replacement.threadId === current.threadId && replacement.supervisionSourceThreadId === current.supervisionSourceThreadId;
}
function storedSessionGeneration(identity, current) {
	if (identity.kind === "session") return { sessionId: identity.sessionId };
	return current?.sessionId ? { sessionId: current.sessionId } : {};
}
function preservedSessionGeneration(identity, current) {
	if (current?.sessionId) return { sessionId: current.sessionId };
	return storedSessionGeneration(identity, current);
}
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
//#endregion
export { resolveCodexRunSessionBindingAuthority as a, reclaimCurrentCodexSessionGeneration as i, createCodexSessionGenerationSupersededError as n, resolveCodexSessionBinding as o, hashCodexAppServerBindingFingerprint as r, session_binding_exports as s, CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS as t };
