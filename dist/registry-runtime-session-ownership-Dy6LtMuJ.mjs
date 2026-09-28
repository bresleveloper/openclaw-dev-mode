import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey, o as classifySessionKeyShape, s as isUnscopedSessionKeySentinel } from "./session-key-CBvmC8zz.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { a as isAgentHarnessSessionKey, h as resolveSessionPinnedHarnessId, o as isAgentHarnessSessionKeyOwnedBy } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-CJOaEEoJ.mjs";
import { i as sqliteSessionFileMarkerMatchesTarget, n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { T as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-BFzDgQIL.mjs";
import { r as resolveInitialEmbeddedRunModel } from "./runtime-resolution-DCl87wyh.mjs";
//#region src/plugins/registry-runtime-session-ownership.ts
const PLUGIN_GATEWAY_SESSION_MUTATION_METHODS = /* @__PURE__ */ new Set([
	"agent",
	"chat.abort",
	"chat.inject",
	"chat.send",
	"message.action",
	"plugins.sessionAction",
	"send",
	"sessions.abort",
	"sessions.compact",
	"sessions.branches.switch",
	"sessions.rewind",
	"sessions.fork",
	"sessions.create",
	"sessions.delete",
	"sessions.patchMany",
	"sessions.patch",
	"sessions.pluginPatch",
	"sessions.reset",
	"sessions.send",
	"sessions.steer",
	"wake"
]);
const PLUGIN_GATEWAY_GLOBAL_SESSION_MUTATION_METHODS = /* @__PURE__ */ new Set([
	"sessions.cleanup",
	"sessions.groups.delete",
	"sessions.groups.rename"
]);
/** Session ownership checks loaded only when a plugin invokes an async action. */
function createPluginSessionOwnership(state, pluginId, resolveRegistry = () => state.registry) {
	const { registryParams } = state;
	const currentSessionConfig = () => registryParams.runtime.config.current();
	const resolveHarnessRegistration = (harnessId) => {
		const normalizedHarnessId = normalizeOptionalAgentRuntimeId(harnessId);
		return normalizedHarnessId ? resolveRegistry().agentHarnesses.find((entry) => normalizeOptionalAgentRuntimeId(entry.harness.id) === normalizedHarnessId) : void 0;
	};
	const resolveHarnessRegistrationForSessionKey = (sessionKey) => resolveRegistry().agentHarnesses.find((entry) => {
		const rawHarnessId = normalizeOptionalString(entry.harness.id)?.toLowerCase();
		return rawHarnessId === normalizeOptionalAgentRuntimeId(rawHarnessId) && isAgentHarnessSessionKeyOwnedBy(sessionKey, rawHarnessId);
	});
	const assertOwnedHarness = (harnessId, action) => {
		const normalizedHarnessId = normalizeOptionalAgentRuntimeId(harnessId);
		if (!normalizedHarnessId) throw new Error(`Plugin "${pluginId}" must provide a registered agent harness id to ${action}.`);
		const registration = resolveHarnessRegistration(normalizedHarnessId);
		if (!registration) throw new Error(`Plugin "${pluginId}" must register agent harness "${normalizedHarnessId}" before it can ${action}.`);
		if (registration.pluginId !== pluginId) throw new Error(`Agent harness "${normalizedHarnessId}" is owned by plugin "${registration.pluginId}", not "${pluginId}".`);
		return normalizedHarnessId;
	};
	const assertReservedSessionKeyOwned = (sessionKey, action) => {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey || !isAgentHarnessSessionKey(normalizedSessionKey)) return;
		const registration = resolveHarnessRegistrationForSessionKey(normalizedSessionKey);
		if (!registration) throw new Error(`Plugin "${pluginId}" cannot ${action} reserved agent harness session "${normalizedSessionKey}" because its harness is not registered.`);
		if (registration.pluginId !== pluginId) throw new Error(`Plugin "${pluginId}" cannot ${action} reserved agent harness session "${normalizedSessionKey}" owned by plugin "${registration.pluginId}".`);
	};
	const resolveLockedSessionHarnessRegistration = (sessionKey, entry, action) => {
		if (entry.modelSelectionLocked !== true) return;
		const pluginOwnerId = normalizeOptionalString(entry.pluginOwnerId);
		if (pluginOwnerId) {
			if (isAgentHarnessSessionKey(sessionKey)) throw new Error(`Locked session "${sessionKey}" mixes plugin and reserved harness ownership.`);
			return { ownerPluginId: pluginOwnerId };
		}
		const harnessId = resolveSessionPinnedHarnessId(entry);
		if (!harnessId) throw new Error(`Plugin "${pluginId}" must provide a registered agent harness id to ${action} locked sessions.`);
		const registration = resolveHarnessRegistration(harnessId);
		if (!registration) throw new Error(`Plugin "${pluginId}" must register agent harness "${harnessId}" before it can ${action} locked sessions.`);
		if (isAgentHarnessSessionKey(sessionKey) && !isAgentHarnessSessionKeyOwnedBy(sessionKey, harnessId)) throw new Error(`Locked session "${sessionKey}" belongs to agent harness "${harnessId}", which does not match its reserved session key.`);
		return {
			ownerPluginId: registration.pluginId,
			harnessId,
			registration
		};
	};
	const assertLockedSessionEntryOwned = (sessionKey, entry, action) => {
		const resolved = resolveLockedSessionHarnessRegistration(sessionKey, entry, action);
		if (!resolved) return;
		if (resolved.ownerPluginId !== pluginId) throw new Error(`Locked session "${sessionKey}" is owned by plugin "${resolved.ownerPluginId}", not "${pluginId}".`);
	};
	const assertSessionEntryOwned = (params) => {
		if (params.entry) {
			assertLockedSessionEntryOwned(params.sessionKey, params.entry, params.action);
			return;
		}
		assertReservedSessionKeyOwned(params.sessionKey, params.action);
	};
	const resolveStoredSessionOwnershipTarget = (params) => {
		if (classifySessionKeyShape(params.sessionKey) === "legacy_or_alias" && !isUnscopedSessionKeySentinel(params.sessionKey) && params.agentId === void 0 && params.storePath === void 0) {
			const target = resolveSessionEntryAccessTarget({
				cfg: currentSessionConfig(),
				sessionKey: params.sessionKey,
				...params.env !== void 0 ? { env: params.env } : {}
			});
			return {
				entry: target.entry,
				sessionKey: target.canonicalKey
			};
		}
		return {
			entry: registryParams.runtime.agent.session.getSessionEntry({
				sessionKey: params.sessionKey,
				readConsistency: "latest",
				...params.agentId !== void 0 ? { agentId: params.agentId } : {},
				...params.env !== void 0 ? { env: params.env } : {},
				...params.storePath !== void 0 ? { storePath: params.storePath } : {}
			}),
			sessionKey: params.sessionKey
		};
	};
	const assertStoredSessionEntryOwned = (params) => {
		const target = resolveStoredSessionOwnershipTarget(params);
		assertSessionEntryOwned({
			action: params.action,
			...target
		});
		return target.entry;
	};
	const resolveStoredSessionExecutionOwner = (params) => {
		const target = resolveStoredSessionOwnershipTarget(params);
		const { entry, sessionKey } = target;
		const locked = entry ? resolveLockedSessionHarnessRegistration(sessionKey, entry, params.action) : void 0;
		if (!entry || !locked || locked.ownerPluginId === pluginId) {
			assertSessionEntryOwned({
				action: params.action,
				...target
			});
			return;
		}
		const registration = "registration" in locked ? locked.registration : void 0;
		if (!registration) throw new Error(`Locked session "${sessionKey}" is owned by plugin "${locked.ownerPluginId}", not "${pluginId}".`);
		if (!registration.harness.delegatedExecutionPluginIds?.includes(pluginId)) assertLockedSessionEntryOwned(sessionKey, entry, params.action);
		return locked.ownerPluginId;
	};
	const assertSessionIdentitiesOwned = (params) => {
		const agentId = normalizeOptionalString(params.agentId);
		const storePath = normalizeOptionalString(params.storePath);
		const sessionKeys = /* @__PURE__ */ new Set();
		for (const value of params.sessionKeys ?? []) {
			const sessionKey = normalizeOptionalString(value);
			if (sessionKey) sessionKeys.add(sessionKey);
		}
		for (const sessionKey of sessionKeys) assertStoredSessionEntryOwned({
			action: params.action,
			sessionKey,
			...agentId ? { agentId } : {},
			...storePath ? { storePath } : {}
		});
		const sessionIds = /* @__PURE__ */ new Set();
		for (const value of params.sessionIds ?? []) {
			const sessionId = normalizeOptionalString(value);
			if (sessionId) sessionIds.add(sessionId);
		}
		const sessionFiles = /* @__PURE__ */ new Set();
		for (const value of params.sessionFiles ?? []) {
			const sessionFile = normalizeOptionalString(value);
			if (sessionFile) sessionFiles.add(sessionFile);
		}
		if (sessionIds.size === 0 && sessionFiles.size === 0) return;
		const entries = registryParams.runtime.agent.session.listSessionEntries({
			...agentId ? { agentId } : {},
			...storePath ? { storePath } : {},
			readOnly: true
		});
		for (const { sessionKey, entry } of entries) if (sessionIds.has(entry.sessionId)) assertSessionEntryOwned({
			action: params.action,
			entry,
			sessionKey
		});
		for (const sessionFile of sessionFiles) {
			const sessionKeyMatches = entries.filter(({ sessionKey }) => sessionKey === sessionFile);
			if (sessionKeyMatches.length > 0) {
				for (const match of sessionKeyMatches) assertSessionEntryOwned({
					action: params.action,
					entry: match.entry,
					sessionKey: match.sessionKey
				});
				const matchedSessionIds = new Set(sessionKeyMatches.map(({ entry }) => normalizeOptionalString(entry.sessionId)).filter((sessionId) => Boolean(sessionId)));
				for (const match of entries) {
					const matchSessionId = normalizeOptionalString(match.entry.sessionId);
					if (matchSessionId && matchedSessionIds.has(matchSessionId)) assertSessionEntryOwned({
						action: params.action,
						entry: match.entry,
						sessionKey: match.sessionKey
					});
				}
				continue;
			}
			const marker = parseSqliteSessionFileMarker(sessionFile);
			if (!marker) throw new Error("Plugin session ownership checks require a SQLite transcript marker.");
			const matches = registryParams.runtime.agent.session.listSessionEntries({
				agentId: marker.agentId,
				storePath: marker.storePath,
				readOnly: true
			}).filter(({ entry }) => entry.sessionId === marker.sessionId);
			if (matches.length === 0) throw new Error(`Plugin session ownership target not found: ${marker.sessionId}`);
			for (const match of matches) assertSessionEntryOwned({
				action: params.action,
				entry: match.entry,
				sessionKey: match.sessionKey
			});
		}
	};
	const prepareRunSessionExecution = (params) => {
		const target = params.sessionTarget;
		const targetSessionKey = normalizeOptionalString(target?.sessionKey);
		const directSessionKey = normalizeOptionalString(params.sessionKey);
		if (targetSessionKey && directSessionKey && targetSessionKey !== directSessionKey) throw new Error("Delegated agent execution requires one exact session key.");
		const sessionKey = targetSessionKey ?? directSessionKey;
		const storePath = normalizeOptionalString(target?.storePath);
		const agentId = normalizeOptionalString(target?.agentId ?? params.agentId);
		const sessionKeyAgentId = parseAgentSessionKey(sessionKey)?.agentId;
		const normalizedAgentId = agentId ? normalizeAgentId(agentId) : void 0;
		if (sessionKeyAgentId && normalizedAgentId && normalizedAgentId !== sessionKeyAgentId) throw new Error(`Plugin session ownership agent "${normalizedAgentId}" does not match session key agent "${sessionKeyAgentId}".`);
		const ownershipAgentId = sessionKeyAgentId ?? normalizedAgentId;
		const ownershipStorePath = sessionKey && sessionKeyAgentId ? resolveSessionStorePathForScope({
			agentId: sessionKeyAgentId,
			sessionKey,
			...storePath ? { storePath } : {}
		}) : storePath;
		const entry = sessionKey ? registryParams.runtime.agent.session.getSessionEntry({
			sessionKey,
			readConsistency: "latest",
			...agentId ? { agentId } : {},
			...storePath ? { storePath } : {}
		}) : void 0;
		const targetSessionId = normalizeOptionalString(target?.sessionId);
		const targetAgentId = normalizeOptionalString(target?.agentId);
		const directSessionId = normalizeOptionalString(params.sessionId);
		const directAgentId = normalizeOptionalString(params.agentId);
		const sessionFile = normalizeOptionalString(params.sessionFile);
		if (target) {
			const legacySessionIdentityMatches = Boolean(sessionFile) && Boolean(agentId) && Boolean(storePath) && Boolean(entry?.sessionId) && sqliteSessionFileMarkerMatchesTarget(sessionFile, {
				agentId,
				sessionId: entry.sessionId,
				storePath
			});
			if (!(targetSessionKey === sessionKey && Boolean(storePath) && Boolean(entry) && targetSessionId === entry?.sessionId && directSessionId === entry?.sessionId && targetAgentId === directAgentId && (!sessionFile || sessionFile === sessionKey || legacySessionIdentityMatches))) throw new Error(`Plugin "${pluginId}" may execute a persisted session only with its exact session target identity.`);
		}
		const locked = sessionKey && entry ? resolveLockedSessionHarnessRegistration(sessionKey, entry, "run") : void 0;
		const ownerPluginId = locked?.ownerPluginId;
		if (locked && entry && sessionKey && ownerPluginId !== pluginId) {
			const registration = "registration" in locked ? locked.registration : void 0;
			if (!registration) throw new Error(`Locked session "${sessionKey}" is owned by plugin "${locked.ownerPluginId}", not "${pluginId}".`);
			if (!registration.harness.delegatedExecutionPluginIds?.includes(pluginId)) assertLockedSessionEntryOwned(sessionKey, entry, "run");
			const requestedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
			const requestedRuntimeOverride = normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
			const identityMatches = Boolean(target) && targetSessionId === entry.sessionId && directSessionId === entry.sessionId;
			const harnessMatches = params.modelSelectionLocked === true && requestedHarnessId === locked.harnessId && requestedRuntimeOverride === locked.harnessId;
			if (!identityMatches || !harnessMatches) throw new Error(`Plugin "${pluginId}" may execute locked session "${sessionKey}" only with its exact persisted identity and harness.`);
			return { ownerPluginId };
		}
		assertSessionIdentitiesOwned({
			action: "run",
			agentId: ownershipAgentId,
			sessionFiles: [params.sessionFile],
			sessionIds: [target?.sessionId ?? params.sessionId],
			sessionKeys: [target?.sessionKey ?? params.sessionKey],
			storePath: ownershipStorePath
		});
		if (!entry?.agentRuntimeOverride || params.agentHarnessRuntimeOverride !== void 0 || params.sessionPersistence === "detached" || params.modelRun || resolveSessionPinnedHarnessId(entry)) return {};
		const cfg = params.config ?? currentSessionConfig();
		const { provider } = resolveInitialEmbeddedRunModel({
			config: cfg,
			agentId: ownershipAgentId,
			provider: params.provider,
			model: params.model
		});
		return { agentHarnessRuntimeOverride: resolveSessionRuntimeOverrideForProvider({
			provider,
			entry,
			cfg
		}) };
	};
	const assertGatewaySessionRequestOwned = (method, params) => {
		if (PLUGIN_GATEWAY_GLOBAL_SESSION_MUTATION_METHODS.has(method)) throw new Error(`Plugin "${pluginId}" cannot request global session mutation "${method}".`);
		if (!PLUGIN_GATEWAY_SESSION_MUTATION_METHODS.has(method)) return;
		const request = params ?? {};
		if (method === "sessions.patchMany" && Array.isArray(request.targets)) {
			for (const target of request.targets) {
				if (!isRecord(target)) continue;
				assertSessionIdentitiesOwned({
					action: `request gateway method "${method}" for`,
					agentId: target.agentId,
					sessionKeys: [target.key]
				});
			}
			return;
		}
		const sessionKeys = [
			request.sessionKey,
			request.key,
			request.parentSessionKey
		];
		const sessionIds = [request.sessionId];
		assertSessionIdentitiesOwned({
			action: `request gateway method "${method}" for`,
			agentId: request.agentId,
			sessionIds,
			sessionKeys
		});
		if (method === "sessions.abort" && !sessionKeys.some((value) => normalizeOptionalString(value)) && !sessionIds.some((value) => normalizeOptionalString(value))) throw new Error(`Plugin "${pluginId}" must provide a session key when requesting gateway method "${method}".`);
	};
	const assertStoreEntryOwned = (params) => {
		if (params.entry.modelSelectionLocked === true) {
			assertLockedSessionEntryOwned(params.sessionKey, params.entry, params.action);
			return;
		}
		if (params.before?.modelSelectionLocked === true) {
			assertLockedSessionEntryOwned(params.sessionKey, params.before, params.action);
			return;
		}
		if (isAgentHarnessSessionKey(params.sessionKey) && !params.before) assertReservedSessionKeyOwned(params.sessionKey, params.action);
	};
	return {
		assertOwnedHarness,
		assertReservedSessionKeyOwned,
		assertStoredSessionEntryOwned,
		assertStoreEntryOwned,
		resolveStoredSessionExecutionOwner,
		prepareRunSessionExecution,
		assertGatewaySessionRequestOwned,
		assertSessionIdentitiesOwned
	};
}
//#endregion
export { createPluginSessionOwnership };
