import { T as requireBoundThread, d as boundedCatalogString, o as CatalogParamsError } from "./session-catalog-parsing-BS06j5dj.mjs";
import { v as sessionBindingIdentity } from "./session-binding-record-BiLa2g9Y.mjs";
import { n as codexUpstreamBaseline, t as codexLastTerminalTurnId } from "./session-upstream-marker-B7xSMlQS.mjs";
import { r as reclaimCurrentCodexSessionGeneration } from "./session-binding-_y0fotvm.mjs";
import { adoptionSessionKeyRest, catalogSessionActions } from "./session-catalog-node-adoption-C0UitAfk.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { listSessionCatalogEntries, sessionCatalogAdoptedSessionKey, sessionCatalogAdoptedSourceKey } from "openclaw/plugin-sdk/session-catalog";
// extensions/codex/src/session-catalog-adoption.ts
const CODEX_SUPERVISION_SESSION_KEY_PREFIX = "harness:codex:supervision:";
const loadSessionHistoryImport = createLazyRuntimeModule(() => import("./session-history-import-BI9tkIw6.mjs"));
const continueOperations = /* @__PURE__ */ new Map();
const boundCatalogSessionId = (value) => boundedCatalogString(value, 256);
function requireIdleThread(thread, action) {
	if (thread.status?.type === "idle" || action === "archive" && thread.status?.type === "notLoaded") return;
	if (thread.status?.type === "active") throw new CatalogParamsError(`Codex session is active in this App Server; wait for it to finish before ${action === "continue" ? "starting a branch" : "archiving"}`);
	throw new CatalogParamsError(action === "archive" ? "Codex session cannot be archived in its current state" : "Codex session cannot start a branch in its current state");
}
function adoptionSessionKey(threadId, sourceHomeId) {
	const source = sourceHomeId ? JSON.stringify([sourceHomeId, threadId]) : threadId;
	return sessionCatalogAdoptedSessionKey(CODEX_SUPERVISION_SESSION_KEY_PREFIX, source);
}
function isAdoptionSessionKeyForThread(sessionKey, threadId, sourceHomeId) {
	return adoptionSessionKeyRest(sessionKey) === adoptionSessionKey(threadId, sourceHomeId);
}
const adoptionCandidatesByRevision = /* @__PURE__ */ new WeakMap();
function readCodexSupervisionMarker(entry) {
	const codex = isRecord(entry.pluginExtensions?.codex) ? entry.pluginExtensions.codex : void 0;
	const marker = codex && isRecord(codex.supervision) ? codex.supervision : void 0;
	const sourceThreadId = marker?.sourceThreadId;
	const sourceHomeId = marker?.sourceHomeId;
	if (typeof sourceThreadId !== "string" || !sourceThreadId.trim() || sourceHomeId !== void 0 && (typeof sourceHomeId !== "string" || !sourceHomeId.trim())) return;
	return {
		sourceThreadId: sourceThreadId.trim(),
		...typeof sourceHomeId === "string" ? { sourceHomeId: sourceHomeId.trim() } : {}
	};
}
async function listAdoptedSessionEntries(params) {
	const revision = params.sessionEntries?.revision;
	const cached = revision ? adoptionCandidatesByRevision.get(revision) : void 0;
	let prepared;
	if (cached && cached.config === params.config && cached.agentId === params.agentId) prepared = cached.candidates;
	else {
		prepared = [];
		for (const { agentId, entry, sessionKey } of listSessionCatalogEntries({
			...params.agentId ? { agentId: params.agentId } : {},
			config: params.config ?? {},
			runtime: params.runtime,
			sessionEntries: params.sessionEntries
		})) {
			const marker = readCodexSupervisionMarker(entry);
			if (!marker || entry.initializationPending === true || entry.agentHarnessId !== "codex" || entry.modelSelectionLocked !== true) continue;
			const sessionId = entry.sessionId?.trim();
			const sessionKeyRest = adoptionSessionKeyRest(sessionKey);
			if (!sessionId || !sessionKeyRest.startsWith(CODEX_SUPERVISION_SESSION_KEY_PREFIX)) continue;
			prepared.push({
				agentId,
				sessionKey,
				sessionKeyRest,
				sessionId,
				marker,
				identity: sessionBindingIdentity({
					sessionId,
					sessionKey,
					config: params.config
				})
			});
		}
		if (revision) adoptionCandidatesByRevision.set(revision, {
			config: params.config,
			agentId: params.agentId,
			candidates: prepared
		});
	}
	const bindings = params.bindingStore.readMany(prepared.map(({ identity }) => identity));
	try {
		const adopted = /* @__PURE__ */ new Map();
		for (const { agentId, sessionKey, sessionKeyRest, sessionId, marker } of prepared) {
			const binding = (await bindings.next()).value;
			const sourceThreadId = binding?.supervisionSourceThreadId?.trim();
			const boundThreadId = binding?.threadId.trim();
			if (binding?.connectionScope !== "supervision" || !sourceThreadId || !boundThreadId || sessionKeyRest !== adoptionSessionKey(sourceThreadId, marker.sourceHomeId)) continue;
			const sourceKey = sessionCatalogAdoptedSourceKey(marker.sourceHomeId ?? "gateway:local", sourceThreadId);
			if (adopted.has(sourceKey)) throw new Error(`multiple OpenClaw sessions adopt Codex thread ${sourceThreadId} from the same home`);
			adopted.set(sourceKey, {
				key: sessionKey,
				sessionId,
				agentId,
				boundThreadId
			});
		}
		return adopted;
	} finally {
		await bindings.return(void 0);
	}
}
async function continueLocalCodexSessionInner(params) {
	async function findAdoptedSessionEntry(runtime) {
		const adopted = await listAdoptedSessionEntries({
			...params,
			runtime
		});
		return adopted.get(sessionCatalogAdoptedSourceKey(params.sourceHomeId ?? "gateway:local", params.threadId)) ?? (params.sourceHomeId && params.allowLegacy === true ? adopted.get(sessionCatalogAdoptedSourceKey("gateway:local", params.threadId)) : void 0);
	}
	await params.control.requireEligibleThread(params.threadId);
	const existing = await findAdoptedSessionEntry(params.api.runtime);
	if (existing) {
		const boundThreadId = requireBoundThread(existing);
		const boundThread = await params.control.readThread(boundThreadId, true);
		if (boundThread.id !== boundThreadId) throw new Error("Codex app-server returned a different thread than requested");
		const changedError = () => new CatalogParamsError("Codex OpenClaw session changed before it could be opened. Retry.");
		if (!await params.api.runtime.agent.session.prepareSessionEntryPatch({
			sessionKey: existing.key,
			readConsistency: "latest",
			preserveActivity: true,
			prepare: (entry) => {
				if (entry.sessionId?.trim() !== existing.sessionId || entry.initializationPending === true || entry.agentHarnessId !== "codex" || entry.modelSelectionLocked !== true) throw changedError();
				return {
					archivedAt: void 0,
					archivedBy: void 0,
					archiveReason: void 0
				};
			}
		})) throw changedError();
		const connectionFingerprint = params.control.connectionFingerprint;
		return {
			sessionKey: existing.key,
			disposition: "existing",
			...connectionFingerprint ? { upstream: {
				connectionFingerprint,
				...codexUpstreamBaseline(boundThread, boundCatalogSessionId)
			} } : {}
		};
	}
	const sourceThread = await params.control.readThread(params.threadId, true);
	if (sourceThread.id !== params.threadId) throw new Error("Codex app-server returned a different thread than requested");
	if (sourceThread.status?.type !== "notLoaded") requireIdleThread(sourceThread, "continue");
	const connectionFingerprint = params.control.connectionFingerprint;
	if (!connectionFingerprint) throw new Error("Codex Continue requires a pinned app-server connection");
	async function createOrReuseAdoptedSession() {
		const runtime = params.api.runtime;
		const adoptedEntry = await findAdoptedSessionEntry(runtime);
		if (adoptedEntry) return adoptedEntry;
		try {
			const spawnedCwd = sourceThread.cwd?.trim() || void 0;
			const pendingLastTurnId = codexLastTerminalTurnId(sourceThread, boundCatalogSessionId);
			const marker = {
				sourceThreadId: sourceThread.id,
				...params.sourceHomeId ? { sourceHomeId: params.sourceHomeId } : {}
			};
			const { createImportedCodexSession } = await loadSessionHistoryImport();
			const created = await createImportedCodexSession({
				runtime: params.api.runtime,
				bindingStore: params.bindingStore,
				config: params.config,
				key: adoptionSessionKey(sourceThread.id, params.sourceHomeId),
				agentId: params.agentId,
				displayName: sourceThread.name ?? void 0,
				thread: sourceThread,
				throughTurnId: pendingLastTurnId ?? null,
				recoverMatchingInitialEntry: true,
				initialEntry: {
					agentHarnessId: "codex",
					modelSelectionLocked: true,
					pluginExtensions: { codex: { supervision: {
						...marker,
						initializing: true,
						modelLocked: true
					} } }
				},
				afterImport: async (entry, initialization) => {
					const identity = sessionBindingIdentity({
						sessionId: entry.sessionId,
						sessionKey: entry.key,
						config: params.config
					});
					const sourceThreadId = sourceThread.id;
					const cwd = spawnedCwd ?? "";
					const lastTurnId = pendingLastTurnId || void 0;
					async function ensurePendingAdoptionBinding() {
						const pending = {
							sourceThreadId,
							connectionFingerprint,
							...lastTurnId ? { lastTurnId } : {}
						};
						const ownsGeneration = await reclaimCurrentCodexSessionGeneration({
							assertCurrent: initialization.assertCurrent,
							bindingStore: params.bindingStore,
							identity,
							config: params.config
						});
						initialization.assertCurrent();
						if (!ownsGeneration) throw new Error(`failed to claim the OpenClaw session generation for ${sourceThreadId}`);
						const existingBinding = await params.bindingStore.readAsync(identity);
						initialization.assertCurrent();
						function matchesPendingAdoptionBinding() {
							const historyCoveredThrough = existingBinding?.historyCoveredThrough;
							return existingBinding?.threadId === sourceThreadId && existingBinding.connectionScope === "supervision" && existingBinding.supervisionSourceThreadId === sourceThreadId && existingBinding.cwd === cwd && existingBinding.conversationSourceTransferComplete === true && existingBinding.preserveNativeModel === true && existingBinding.pendingSupervisionBranch?.sourceThreadId === sourceThreadId && existingBinding.pendingSupervisionBranch.connectionFingerprint === connectionFingerprint && existingBinding.pendingSupervisionBranch.lastTurnId === lastTurnId && (existingBinding.pendingSupervisionBranch.cleanupThreadIds?.length ?? 0) === 0 && typeof historyCoveredThrough === "string" && Number.isFinite(Date.parse(historyCoveredThrough));
						}
						if (existingBinding) {
							if (matchesPendingAdoptionBinding()) return;
							throw new Error(`OpenClaw session is already bound to Codex thread ${existingBinding.threadId}`);
						}
						const binding = {
							threadId: sourceThreadId,
							connectionScope: "supervision",
							supervisionSourceThreadId: sourceThreadId,
							cwd,
							historyCoveredThrough: (/* @__PURE__ */ new Date()).toISOString(),
							conversationSourceTransferComplete: true,
							preserveNativeModel: true,
							pendingSupervisionBranch: pending
						};
						await initialization.bind(binding);
					}
					await ensurePendingAdoptionBinding();
					return { pluginExtensions: { codex: { supervision: {
						...marker,
						modelLocked: true
					} } } };
				}
			});
			return {
				key: created.key,
				sessionId: created.sessionId,
				agentId: created.agentId,
				boundThreadId: sourceThread.id
			};
		} catch (error) {
			const raced = await findAdoptedSessionEntry(runtime);
			if (raced) return raced;
			throw error;
		}
	}
	const adopted = await createOrReuseAdoptedSession();
	const boundThreadId = requireBoundThread(adopted);
	const baselineThread = boundThreadId === sourceThread.id ? sourceThread : await params.control.readThread(boundThreadId, true);
	if (baselineThread.id !== boundThreadId) throw new Error("Codex app-server returned a different thread than requested");
	return {
		sessionKey: adopted.key,
		disposition: "forked",
		upstream: {
			connectionFingerprint,
			...codexUpstreamBaseline(baselineThread, boundCatalogSessionId)
		}
	};
}
/** Creates one locked OpenClaw branch whose first harness run forks the Codex source. */
async function continueLocalCodexSession(params) {
	const sourceKey = sessionCatalogAdoptedSourceKey(params.hostId ?? "gateway:local", params.threadId);
	const operationKey = sessionCatalogAdoptedSourceKey(params.agentId, sourceKey);
	let operation = continueOperations.get(operationKey);
	if (!operation) {
		const run = async (control) => await continueLocalCodexSessionInner({
			...params,
			control
		});
		operation = catalogSessionActions.enqueue(sourceKey, async () => params.control.withPinnedConnection(run));
		continueOperations.set(operationKey, operation);
	}
	try {
		const { sessionKey, disposition, upstream } = await operation;
		if (upstream) params.onContinued?.(upstream);
		return {
			sessionKey,
			disposition
		};
	} finally {
		if (continueOperations.get(operationKey) === operation) continueOperations.delete(operationKey);
	}
}
export { continueLocalCodexSession, isAdoptionSessionKeyForThread, listAdoptedSessionEntries, requireIdleThread };
