import { m as sessionBindingIdentity } from "./session-binding-record-BGoz8wOK.mjs";
import { C as boundedCatalogString, L as requireBoundThread, v as CatalogParamsError } from "./session-catalog-native-projection-DowriLid.mjs";
import { n as codexUpstreamBaseline, t as codexLastTerminalTurnId } from "./session-upstream-marker-D15C9NHp.mjs";
import { i as reclaimCurrentCodexSessionGeneration } from "./session-binding-Cm0apEbd.mjs";
import { adoptionSessionKeyRest, continueOperations, runSessionActionExclusive } from "./session-catalog-node-adoption-ITddWx_X.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { listSessionCatalogEntries, sessionCatalogAdoptedSessionKey, sessionCatalogAdoptedSourceKey } from "openclaw/plugin-sdk/session-catalog";
//#region extensions/codex/src/session-catalog-adoption.ts
const CODEX_SUPERVISION_SESSION_KEY_PREFIX = "harness:codex:supervision:";
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
	const entries = listSessionCatalogEntries({
		...params.agentId ? { agentId: params.agentId } : {},
		config: params.config ?? {},
		runtime: params.runtime,
		sessionEntries: params.sessionEntries
	});
	const candidateForEntry = ({ agentId, entry, sessionKey }) => {
		const sessionKeyRest = adoptionSessionKeyRest(sessionKey);
		const marker = readCodexSupervisionMarker(entry);
		if (!sessionKeyRest.startsWith(CODEX_SUPERVISION_SESSION_KEY_PREFIX) || !marker || entry.initializationPending === true || entry.agentHarnessId !== "codex" || entry.modelSelectionLocked !== true) return;
		const sessionId = entry.sessionId?.trim();
		if (!sessionId) return;
		return {
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
		};
	};
	function* candidates() {
		for (const entry of entries) {
			const candidate = candidateForEntry(entry);
			if (candidate) yield candidate;
		}
	}
	const collect = (selected, readBinding = (identity) => params.bindingStore.read(identity)) => {
		const adopted = /* @__PURE__ */ new Map();
		for (const { agentId, sessionKey, sessionKeyRest, sessionId, marker, identity } of selected) {
			const binding = readBinding(identity);
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
	};
	if (!params.bindingStore.readMany) return collect(candidates());
	let prepared;
	try {
		prepared = [...candidates()];
	} catch {
		return collect(candidates());
	}
	const bindings = params.bindingStore.readMany(prepared.map(({ identity }) => identity));
	try {
		return collect(prepared, () => bindings.next().value);
	} finally {
		bindings.return(void 0);
	}
}
async function findAdoptedSessionEntry(params) {
	const adopted = await listAdoptedSessionEntries(params);
	return adopted.get(sessionCatalogAdoptedSourceKey(params.sourceHomeId ?? "gateway:local", params.threadId)) ?? (params.sourceHomeId && params.allowLegacy === true ? adopted.get(sessionCatalogAdoptedSourceKey("gateway:local", params.threadId)) : void 0);
}
function matchesPendingAdoptionBinding(binding, expected) {
	const historyCoveredThrough = binding?.historyCoveredThrough;
	return binding?.threadId === expected.sourceThreadId && binding.connectionScope === "supervision" && binding.supervisionSourceThreadId === expected.sourceThreadId && binding.cwd === expected.cwd && binding.conversationSourceTransferComplete === true && binding.preserveNativeModel === true && binding.pendingSupervisionBranch?.sourceThreadId === expected.sourceThreadId && binding.pendingSupervisionBranch.connectionFingerprint === expected.connectionFingerprint && binding.pendingSupervisionBranch.lastTurnId === expected.lastTurnId && (binding.pendingSupervisionBranch.cleanupThreadIds?.length ?? 0) === 0 && typeof historyCoveredThrough === "string" && Number.isFinite(Date.parse(historyCoveredThrough));
}
async function ensurePendingAdoptionBinding(params) {
	const pending = {
		sourceThreadId: params.sourceThreadId,
		connectionFingerprint: params.connectionFingerprint,
		...params.lastTurnId ? { lastTurnId: params.lastTurnId } : {}
	};
	const ownsGeneration = await reclaimCurrentCodexSessionGeneration({
		assertCurrent: params.initialization.assertCurrent,
		bindingStore: params.bindingStore,
		identity: params.identity,
		config: params.config
	});
	params.initialization.assertCurrent();
	if (!ownsGeneration) throw new Error(`failed to claim the OpenClaw session generation for ${params.sourceThreadId}`);
	const existing = params.bindingStore.read(params.identity);
	params.initialization.assertCurrent();
	if (existing) {
		if (matchesPendingAdoptionBinding(existing, params)) return;
		throw new Error(`OpenClaw session is already bound to Codex thread ${existing.threadId}`);
	}
	const binding = {
		threadId: params.sourceThreadId,
		connectionScope: "supervision",
		supervisionSourceThreadId: params.sourceThreadId,
		cwd: params.cwd,
		historyCoveredThrough: (/* @__PURE__ */ new Date()).toISOString(),
		conversationSourceTransferComplete: true,
		preserveNativeModel: true,
		pendingSupervisionBranch: pending
	};
	await params.initialization.bind(binding);
}
async function createOrReuseAdoptedSession(params) {
	const runtime = params.api.runtime;
	const lookup = {
		...params,
		runtime,
		threadId: params.sourceThread.id
	};
	const existing = await findAdoptedSessionEntry(lookup);
	if (existing) return existing;
	try {
		const spawnedCwd = params.sourceThread.cwd?.trim() || void 0;
		const pendingLastTurnId = codexLastTerminalTurnId(params.sourceThread, boundCatalogSessionId);
		const marker = {
			sourceThreadId: params.sourceThread.id,
			...params.sourceHomeId ? { sourceHomeId: params.sourceHomeId } : {}
		};
		const { createImportedCodexSession } = await import("./session-history-import-D-3wAgOP.mjs");
		const created = await createImportedCodexSession({
			runtime: params.api.runtime,
			bindingStore: params.bindingStore,
			config: params.config,
			key: adoptionSessionKey(params.sourceThread.id, params.sourceHomeId),
			agentId: params.agentId,
			displayName: params.sourceThread.name ?? void 0,
			thread: params.sourceThread,
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
				await ensurePendingAdoptionBinding({
					bindingStore: params.bindingStore,
					config: params.config,
					identity,
					initialization,
					sourceThreadId: params.sourceThread.id,
					connectionFingerprint: params.connectionFingerprint,
					cwd: spawnedCwd ?? "",
					...pendingLastTurnId ? { lastTurnId: pendingLastTurnId } : {}
				});
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
			boundThreadId: params.sourceThread.id
		};
	} catch (error) {
		const raced = await findAdoptedSessionEntry(lookup);
		if (raced) return raced;
		throw error;
	}
}
async function continueLocalCodexSessionInner(params) {
	await params.control.requireEligibleThread(params.threadId);
	const existing = await findAdoptedSessionEntry({
		...params,
		runtime: params.api.runtime
	});
	if (existing) {
		const boundThreadId = requireBoundThread(existing);
		const boundThread = await params.control.readThread(boundThreadId, true);
		if (boundThread.id !== boundThreadId) throw new Error("Codex app-server returned a different thread than requested");
		const changedError = () => new CatalogParamsError("Codex OpenClaw session changed before it could be opened. Retry.");
		if (!await params.api.runtime.agent.session.patchSessionEntry({
			sessionKey: existing.key,
			readConsistency: "latest",
			preserveActivity: true,
			update: (entry) => {
				if (entry.sessionId?.trim() !== existing.sessionId || entry.initializationPending === true || entry.agentHarnessId !== "codex" || entry.modelSelectionLocked !== true) throw changedError();
				return {
					archivedAt: void 0,
					archivedBy: void 0,
					archiveReason: void 0
				};
			}
		})) throw changedError();
		const connectionFingerprint = params.control.connectionFingerprint;
		if (connectionFingerprint) params.onContinued?.({
			connectionFingerprint,
			...codexUpstreamBaseline(boundThread, boundCatalogSessionId)
		});
		return {
			sessionKey: existing.key,
			disposition: "existing"
		};
	}
	const sourceThread = await params.control.readThread(params.threadId, true);
	if (sourceThread.id !== params.threadId) throw new Error("Codex app-server returned a different thread than requested");
	if (sourceThread.status?.type !== "notLoaded") requireIdleThread(sourceThread, "continue");
	const connectionFingerprint = params.control.connectionFingerprint;
	if (!connectionFingerprint) throw new Error("Codex Continue requires a pinned app-server connection");
	const adopted = await createOrReuseAdoptedSession({
		...params,
		sourceThread,
		connectionFingerprint
	});
	const boundThreadId = requireBoundThread(adopted);
	const baselineThread = boundThreadId === sourceThread.id ? sourceThread : await params.control.readThread(boundThreadId, true);
	if (baselineThread.id !== boundThreadId) throw new Error("Codex app-server returned a different thread than requested");
	params.onContinued?.({
		connectionFingerprint,
		...codexUpstreamBaseline(baselineThread, boundCatalogSessionId)
	});
	return {
		sessionKey: adopted.key,
		disposition: "forked"
	};
}
/** Creates one locked OpenClaw branch whose first harness run forks the Codex source. */
async function continueLocalCodexSession(params) {
	const sourceKey = sessionCatalogAdoptedSourceKey(params.hostId ?? "gateway:local", params.threadId);
	const operationKey = sessionCatalogAdoptedSourceKey(params.agentId, sourceKey);
	const current = continueOperations.get(operationKey);
	if (current) return await current;
	const run = async (control) => await continueLocalCodexSessionInner({
		...params,
		control
	});
	const operation = runSessionActionExclusive(sourceKey, async () => params.control.withPinnedConnection(run));
	continueOperations.set(operationKey, operation);
	try {
		return await operation;
	} finally {
		if (continueOperations.get(operationKey) === operation) continueOperations.delete(operationKey);
	}
}
//#endregion
export { continueLocalCodexSession, isAdoptionSessionKeyForThread, listAdoptedSessionEntries, requireIdleThread };
