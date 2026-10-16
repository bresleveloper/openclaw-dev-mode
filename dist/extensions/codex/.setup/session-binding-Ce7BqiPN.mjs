import { i as adoptCodexNativeSubagentSubmissions, n as mutateNativePendingAssignments, o as mutateCodexNativeSubagentSubmissions } from "./native-subagent-pending-assignments-BDqhOdJp.mjs";
import { a as readStoredCodexAppServerBinding, i as readCodexBindingTimestamp, n as matchesPendingSupervisionBranch, o as stripUndefinedBinding, r as readCodexAppServerThreadBinding, s as validateBindingForWrite } from "./session-binding-record-codec-z4ZpDn6E.mjs";
import { a as ownsStoredSessionGeneration, c as preserveNativeTaskImport, d as readCurrentCodexNativeSubagentSubmissions, f as readCurrentNativePendingAssignments, i as matchesCodexNativeSubagentSubmissionBinding, l as readCurrentCodexAppServerBinding, m as sessionBindingIdentity, n as assertCodexBindingMayBeReplaced, o as preserveCodexNativeSubagentSubmissions, p as readPluginAppPolicyContext, r as bindingStoreKey, s as preserveNativePendingAssignments, t as CodexSupervisionBindingReplacementError, u as readCurrentCodexAppServerBindings } from "./session-binding-record-BZB8RgcF.mjs";
import { a as PHYSICAL_SESSION_RETIRE_TTL_MS, i as CODEX_APP_SERVER_BINDING_NAMESPACE, n as CODEX_APP_SERVER_BINDING_LEASE, r as CODEX_APP_SERVER_BINDING_MAX_ENTRIES, t as CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS } from "./session-binding-meta-Lkm5Lpf4.mjs";
import { n as normalizeCodexAppServerBindingModelProvider } from "./auth-profile-CgHQ8Vot.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { AgentHarnessSessionSupersededError, embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
import { combineNativeSessionBindingAuthority as combineCodexBindingAuthority, createNativeSessionBindingLifecycle, prepareNativeSessionGenerationAuthority, reclaimNativeSessionGenerationWithAuthority, resolveNativeSessionBindingWithAuthority } from "openclaw/plugin-sdk/agent-harness-session-runtime";
//#region extensions/codex/src/app-server/session-binding-authority.ts
/** Decides whether a run may share the durable stable-key binding owner. */
async function resolveCodexRunSessionBindingAuthority(params) {
	return (await prepareNativeSessionGenerationAuthority({
		...params,
		target: params.identity,
		createSupersededError: createCodexSessionGenerationSupersededError
	})).state;
}
/** Builds the terminal coordination error used when a newer OpenClaw session owns the binding. */
function createCodexSessionGenerationSupersededError(sessionId) {
	return new AgentHarnessSessionSupersededError(`Codex session generation is no longer current: ${sessionId}`);
}
//#endregion
//#region extensions/codex/src/app-server/session-binding-native-mutations.ts
/** The caller supplies the transaction's freshly parsed row and current-authority closure. */
function mutateNativeSubagentBinding({ identity, current, mutation, assertCurrent }) {
	const isAssignment = mutation.kind === "record-native-subagent-assignment" || mutation.kind === "consume-native-subagent-assignment";
	if (!assertCurrent) throw new Error(`Codex native ${isAssignment ? "assignment" : "subagent submission"} mutation requires current authority.`);
	assertCurrent();
	if (current?.state !== "active" || !ownsStoredSessionGeneration(identity, current) || identity.kind === "session" && mutation.owner.sessionId !== identity.sessionId || !matchesCodexNativeSubagentSubmissionBinding(current.binding, mutation.owner)) return { result: false };
	const field = isAssignment ? "nativeSubagentAssignments" : "nativeSubagentSubmissions";
	const changed = isAssignment ? mutateNativePendingAssignments({
		current: current.nativeSubagentAssignments,
		owner: mutation.owner,
		assignment: mutation.assignment,
		consume: mutation.kind === "consume-native-subagent-assignment"
	}) : mutateCodexNativeSubagentSubmissions({
		current: current.nativeSubagentSubmissions,
		owner: mutation.owner,
		receipt: mutation.receipt,
		consume: mutation.kind === "consume-native-subagent-submission"
	});
	if (!changed.applied) return { result: false };
	const { [field]: _previous, ...bindingOwner } = current;
	return {
		result: true,
		next: {
			...bindingOwner,
			...changed.next ? { [field]: changed.next } : {}
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/session-binding-codec.ts
const BOUNDED_BINDING_FINGERPRINT_PATTERN = /^sha256:[a-f0-9]{64}$/i;
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
	if (record.schemaVersion !== 2) return;
	const pluginAppPolicyContext = readPluginAppPolicyContext(record.pluginAppPolicyContext);
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
//#endregion
//#region extensions/codex/src/app-server/session-binding.ts
/** SQLite-backed Codex app-server thread bindings. */
var session_binding_exports = /* @__PURE__ */ __exportAll({
	CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS: () => CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS,
	CODEX_APP_SERVER_BINDING_MAX_ENTRIES: () => CODEX_APP_SERVER_BINDING_MAX_ENTRIES,
	CODEX_APP_SERVER_BINDING_NAMESPACE: () => CODEX_APP_SERVER_BINDING_NAMESPACE,
	CodexSupervisionBindingReplacementError: () => CodexSupervisionBindingReplacementError,
	assertCodexBindingMayBeReplaced: () => assertCodexBindingMayBeReplaced,
	bindingStoreKey: () => bindingStoreKey,
	clearCodexBindingForClient: () => clearCodexBindingForClient,
	combineCodexBindingAuthority: () => combineCodexBindingAuthority,
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
/** Attempt cleanup may only clear the physical owner captured before its awaited work. */
async function clearCodexBindingForClient(store, identity, thread, authority) {
	if (!thread.clientId) return false;
	return await store.mutate(identity, {
		kind: "clear",
		threadId: thread.threadId,
		clientId: thread.clientId
	}, authority.assertCurrent, authority);
}
function bindingLeaseLostError(key, cause) {
	return new Error(`Lost Codex binding lease: ${key}`, cause === void 0 ? void 0 : { cause });
}
/** Lets the authoritative OpenClaw session generation claim a stale stable binding row. */
async function reclaimCurrentCodexSessionGeneration(params) {
	return await reclaimNativeSessionGenerationWithAuthority({
		...params,
		target: params.identity,
		generation: codexSessionGenerationOperations(params.bindingStore, params.identity),
		createSupersededError: createCodexSessionGenerationSupersededError
	});
}
/** Resolve continuity before selecting native queues, catalogs, or connections. */
async function resolveCodexSessionBinding(params) {
	const identity = params.identity;
	return await resolveNativeSessionBindingWithAuthority({
		...params,
		...identity.kind === "session" ? {
			target: identity,
			generation: codexSessionGenerationOperations(params.bindingStore, identity)
		} : {},
		readBinding: (sessionId) => params.bindingStore.read(sessionId && identity.kind === "session" ? {
			...identity,
			sessionId
		} : identity),
		createSupersededError: createCodexSessionGenerationSupersededError
	});
}
/** Creates the single binding facade owned by the Codex plugin runtime. */
function createCodexAppServerBindingStore(state) {
	const lifecycle = createNativeSessionBindingLifecycle(state, {
		workerCodec: "codex",
		readRecord: readStoredCodexAppServerBinding,
		lease: CODEX_APP_SERVER_BINDING_LEASE,
		releaseTtlMs: (key, current) => current.nativeSubagentTaskImport !== void 0 || current.state === "active" || current.retired === true && !key.startsWith("session:") ? void 0 : current.retired === true ? PHYSICAL_SESSION_RETIRE_TTL_MS : 1,
		onReleaseFailure: (key, error) => embeddedAgentLog.warn("failed to release codex app-server binding lease", {
			key,
			error
		}),
		errors: {
			atomicUpdatesRequired: "Codex app-server bindings require atomic plugin-state updates",
			invalidRow: (key) => /* @__PURE__ */ new Error(`Invalid Codex app-server binding row: ${key}`),
			lostLease: bindingLeaseLostError,
			leaseTimeout: (key) => /* @__PURE__ */ new Error(`Timed out waiting for Codex binding lease: ${key}`),
			acquisitionRejected: (key) => /* @__PURE__ */ new Error(`Codex binding generation was retired: ${key}`),
			mutationBlocked: "Codex binding mutation blocked while a native archive is in progress; retry",
			conditionalDeletionRequired: "Codex session deletion requires conditional plugin-state deletion",
			deletionChanged: "Codex binding changed before session deletion",
			rollbackChanged: "Codex binding changed before session deletion rollback"
		}
	});
	const prepareLease = (identity, options = {}) => ({
		assertCurrent: options.assertCurrent,
		authority: options.authority,
		prepareLease(current, lease) {
			if (current?.state === "cleared" && current.retired === true && ownsStoredSessionGeneration(identity, current) && !options.allowRetired) return;
			if (current?.state === "active") return {
				...current,
				...preservedSessionGeneration(identity, current),
				lease
			};
			if (current?.state === "cleared" && current.retired === true) return {
				...current,
				lease
			};
			return {
				version: 1,
				state: "cleared",
				...preservedSessionGeneration(identity, current),
				...preserveNativeTaskImport(current),
				lease
			};
		}
	});
	const transitionSessionGeneration = async (identity, mode) => {
		return await lifecycle.withMutation(async () => {
			const key = bindingStoreKey(identity);
			const ttlMs = mode === "reset" ? lifecycle.hasLease(key) ? void 0 : 1 : identity.sessionKey?.trim() ? void 0 : PHYSICAL_SESSION_RETIRE_TTL_MS;
			return await lifecycle.transact(key, (current, leaseToken) => {
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
						...preserveNativeTaskImport(current),
						...current.lease && current.lease.token === leaseToken ? { lease: current.lease } : {}
					}
				};
			}, (next) => next.nativeSubagentTaskImport !== void 0 ? void 0 : ttlMs);
		});
	};
	return {
		read: (identity) => readCurrentCodexAppServerBinding(state, identity),
		readMany: (identities) => readCurrentCodexAppServerBindings(state.asyncReads, identities),
		readNativeSubagentAssignments: (identity, owner) => readCurrentNativePendingAssignments(state, identity, owner),
		readNativeSubagentSubmissions: (identity, owner) => readCurrentCodexNativeSubagentSubmissions(state, identity, owner),
		async hasOtherThreadOwner(threadId, currentIdentity) {
			const currentKey = currentIdentity ? bindingStoreKey(currentIdentity) : void 0;
			return state.entries().some(({ key, value }) => {
				const stored = readStoredCodexAppServerBinding(value);
				if (!stored) throw new Error(`Invalid Codex app-server binding row: ${key}`);
				const isCurrentOwner = currentIdentity !== void 0 && key === currentKey && (currentIdentity.kind === "conversation" || stored.sessionId === currentIdentity.sessionId.trim());
				return stored.state === "active" && stored.binding.threadId === threadId && !isCurrentOwner;
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
		async mutate(identity, mutation, assertCurrent, authority) {
			return await lifecycle.withMutation(async () => {
				const key = bindingStoreKey(identity);
				const retainLegacyClear = mutation.kind === "clear" && key.startsWith("conversation:legacy-");
				return await lifecycle.transact(key, (current, leaseToken) => {
					if (mutation.kind === "record-native-subagent-assignment" || mutation.kind === "consume-native-subagent-assignment" || mutation.kind === "record-native-subagent-submission" || mutation.kind === "consume-native-subagent-submission") return mutateNativeSubagentBinding({
						identity,
						current,
						mutation,
						assertCurrent
					});
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
									...preserveNativeTaskImport(current),
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
								...preserveNativeTaskImport(current),
								...ownedLease
							}
						};
					}
					const storedActive = current?.state === "active" ? current : void 0;
					const active = ownsGeneration ? storedActive : void 0;
					const retiredGeneration = current?.state === "cleared" && current.retired === true && ownsGeneration;
					const preservesSupervisionOwner = mutation.kind === "set" && active?.binding.connectionScope === "supervision" && isSameSupervisionOwner(active.binding, mutation.binding);
					const replacesExpectedOrdinaryOwner = mutation.kind === "replace-thread" && active?.binding.threadId === mutation.expectedThreadId && active.binding.connectionScope !== "supervision" && mutation.binding.connectionScope !== "supervision" && mutation.binding.threadId !== mutation.expectedThreadId;
					if ((mutation.kind === "patch" || mutation.kind === "clear") && Object.hasOwn(mutation, "clientId") && mutation.clientId !== active?.binding.clientId || mutation.kind === "set" && (mutation.if?.kind === "absent" && storedActive || current !== void 0 && !ownsGeneration || retiredGeneration || active?.binding.connectionScope === "supervision" && !preservesSupervisionOwner) || mutation.kind === "patch" && active?.binding.threadId !== mutation.threadId || mutation.kind === "replace-thread" && !replacesExpectedOrdinaryOwner || (mutation.kind === "patch-pending-supervision-branch" || mutation.kind === "commit-pending-supervision-branch") && !matchesPendingSupervisionBranch(active?.binding, mutation.expected) || mutation.kind === "clear" && (!ownsGeneration || mutation.threadId !== void 0 && active?.binding.threadId !== mutation.threadId || active?.binding.connectionScope === "supervision")) return { result: false };
					if (mutation.kind === "clear" && retiredGeneration) return { result: true };
					if (mutation.kind === "clear") return {
						result: true,
						next: {
							version: 1,
							state: "cleared",
							...storedSessionGeneration(identity, current),
							...preserveNativeTaskImport(current),
							...ownedLease
						}
					};
					let binding;
					if (mutation.kind === "set" || mutation.kind === "replace-thread") binding = mutation.binding;
					else if (mutation.kind === "patch-pending-supervision-branch") binding = {
						...active.binding,
						pendingSupervisionBranch: mutation.pending
					};
					else binding = {
						...active.binding,
						...mutation.patch,
						threadId: mutation.threadId,
						...mutation.kind === "commit-pending-supervision-branch" ? { pendingSupervisionBranch: void 0 } : {}
					};
					binding = validateBindingForWrite(binding);
					const nativeSubagentSubmissions = active ? preserveCodexNativeSubagentSubmissions(active.binding, binding, active.nativeSubagentSubmissions) : void 0;
					const nativeSubagentAssignments = active ? preserveNativePendingAssignments(active.binding, binding, active.nativeSubagentAssignments) : void 0;
					return {
						result: true,
						next: {
							version: 1,
							state: "active",
							binding,
							...nativeSubagentAssignments !== void 0 ? { nativeSubagentAssignments } : {},
							...nativeSubagentSubmissions !== void 0 ? { nativeSubagentSubmissions } : {},
							...storedSessionGeneration(identity, current),
							...preserveNativeTaskImport(current),
							...ownedLease
						}
					};
				}, (next) => mutation.kind === "clear" && next.nativeSubagentTaskImport === void 0 && !retainLegacyClear && !lifecycle.hasLease(key) ? 1 : void 0, assertCurrent, authority);
			});
		},
		async adoptSessionGeneration(identity, expectedPreviousSessionId, assertCurrent, authority) {
			return await lifecycle.withMutation(async () => {
				const key = bindingStoreKey(identity);
				const expectedSessionId = expectedPreviousSessionId.trim();
				const targetSessionId = identity.sessionId.trim();
				if (!expectedSessionId) throw new Error("Codex session generation adoption requires the previous session id");
				return await lifecycle.transact(key, (current) => {
					if (current?.state !== "active") return { result: "absent" };
					if (current.sessionId === targetSessionId) return { result: "current" };
					if (current.sessionId !== expectedSessionId) return { result: "conflict" };
					const { nativeSubagentSubmissions, nativeSubagentAssignments: _assignments, ...bindingOwner } = current;
					const adoptedSubmissions = adoptCodexNativeSubagentSubmissions(nativeSubagentSubmissions);
					return {
						result: "adopted",
						next: {
							...bindingOwner,
							sessionId: targetSessionId,
							...adoptedSubmissions !== void 0 ? { nativeSubagentSubmissions: adoptedSubmissions } : {}
						}
					};
				}, void 0, assertCurrent, authority);
			});
		},
		resetSessionGeneration: (identity) => transitionSessionGeneration(identity, "reset"),
		retireSessionGeneration: (identity) => transitionSessionGeneration(identity, "retire"),
		withThreadArchiveFence: lifecycle.withExclusiveMutationFence,
		async withSessionDeletion(identity, assertCurrent, run) {
			return await lifecycle.withDeletion(bindingStoreKey(identity), {
				...prepareLease(identity, {
					allowRetired: true,
					assertCurrent
				}),
				assertCurrent,
				assertRecordCurrent(stored) {
					if (!stored || !ownsStoredSessionGeneration(identity, stored)) throw new Error("Codex binding generation changed before session deletion");
				}
			}, (stored, mutation) => run(stored?.state === "active" ? stored.binding : void 0, mutation));
		},
		withLease: (identity, run, options) => lifecycle.withLease(bindingStoreKey(identity), run, prepareLease(identity, options))
	};
}
function codexSessionGenerationOperations(store, identity) {
	return {
		prepareReclaim: () => store.prepareSessionGenerationReclaim(identity),
		adopt: (expectedPreviousSessionId, authority) => store.adoptSessionGeneration(identity, expectedPreviousSessionId, authority.assertCurrent, authority),
		reclaim: (expectedPreviousSessionId, authority) => store.mutate(identity, {
			kind: "reclaim-generation",
			expectedPreviousSessionId
		}, authority.assertCurrent, authority)
	};
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
//#endregion
export { hashCodexAppServerBindingFingerprint as a, session_binding_exports as i, reclaimCurrentCodexSessionGeneration as n, createCodexSessionGenerationSupersededError as o, resolveCodexSessionBinding as r, resolveCodexRunSessionBindingAuthority as s, clearCodexBindingForClient as t };
