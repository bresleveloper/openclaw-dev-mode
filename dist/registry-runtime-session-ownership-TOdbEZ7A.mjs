import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { M as parseAgentSessionKey, o as classifySessionKeyShape, s as isUnscopedSessionKeySentinel } from "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { i as sqliteSessionFileMarkerMatchesTarget, n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { n as readResolvedSessionEntryInWorker } from "./session-accessor.entry-read-runtime-BoYobsOQ.mjs";
import { a as isAgentHarnessSessionKey, h as resolveSessionPinnedHarnessId, o as isAgentHarnessSessionKeyOwnedBy } from "./agent-harness-session-key-zbrcLVpT.mjs";
import "./session-accessor.entry-BLpjjUTc.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
import { t as assertSessionEntryPatchAuthority } from "./session-entry-patch-authority-CS4-jhpZ.mjs";
import { r as resolveInitialEmbeddedRunModel } from "./runtime-resolution-Bu3JoF4M.mjs";
//#region src/plugins/registry-runtime-session-reads.ts
/** Read plugin ownership from the memory actor or the durable worker. */
function createPluginSessionOwnershipReads({ runtime, currentSessionConfig, assertRuntimeOwnerCurrent }) {
	const readOwnershipEntry = async (params) => {
		const memory = captureMemoryExactSessionReader(params, assertRuntimeOwnerCurrent);
		if (memory) return memory.read(params.sessionKey);
		const entry = await runtime.agent.session.getSessionEntryAsync(params);
		assertRuntimeOwnerCurrent();
		return entry;
	};
	const listOwnershipEntries = async (params) => {
		const memory = captureMemoryExactSessionReader(params, assertRuntimeOwnerCurrent);
		if (memory) return memory.entries("list");
		const selectedAgentId = params.agentId ?? resolveDefaultAgentId(currentSessionConfig());
		const entries = await runtime.agent.session.listSessionEntriesAsync({
			...params,
			agentId: selectedAgentId
		});
		assertRuntimeOwnerCurrent();
		return entries;
	};
	return {
		readOwnershipEntry,
		listOwnershipEntries
	};
}
//#endregion
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
function createPluginSessionOwnership(state, pluginId, resolveRegistry, assertRuntimeOwnerCurrent) {
	const { registryParams } = state;
	const currentSessionConfig = () => registryParams.runtime.config.current();
	const requireHarnessRegistration = (value, action) => {
		const harnessId = normalizeOptionalAgentRuntimeId(value);
		if (!harnessId) throw new Error(`Plugin "${pluginId}" must provide a registered agent harness id to ${action}.`);
		const registration = resolveRegistry().agentHarnesses.find((entry) => normalizeOptionalAgentRuntimeId(entry.harness.id) === harnessId);
		if (!registration) throw new Error(`Plugin "${pluginId}" must register agent harness "${harnessId}" before it can ${action}.`);
		return {
			harnessId,
			registration
		};
	};
	const resolveHarnessRegistrationForSessionKey = (sessionKey) => resolveRegistry().agentHarnesses.find((entry) => {
		const rawHarnessId = normalizeOptionalString(entry.harness.id)?.toLowerCase();
		return rawHarnessId === normalizeOptionalAgentRuntimeId(rawHarnessId) && isAgentHarnessSessionKeyOwnedBy(sessionKey, rawHarnessId);
	});
	const assertOwnedHarness = (harnessId, action) => {
		const { harnessId: normalizedHarnessId, registration } = requireHarnessRegistration(harnessId, action);
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
		const { harnessId, registration } = requireHarnessRegistration(resolveSessionPinnedHarnessId(entry), `${action} locked sessions`);
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
	const { readOwnershipEntry, listOwnershipEntries } = createPluginSessionOwnershipReads({
		runtime: registryParams.runtime,
		currentSessionConfig,
		assertRuntimeOwnerCurrent
	});
	const resolveStoredSessionOwnershipTarget = async (params) => {
		if (classifySessionKeyShape(params.sessionKey) === "legacy_or_alias" && !isUnscopedSessionKeySentinel(params.sessionKey) && params.agentId === void 0 && params.storePath === void 0) {
			const cfg = currentSessionConfig();
			const { canonicalKey } = resolveSessionStoreIdentity({
				cfg,
				sessionKey: params.sessionKey
			});
			const entry = await readResolvedSessionEntryInWorker({
				cfg,
				sessionKey: params.sessionKey,
				...params.env !== void 0 ? { env: params.env } : {}
			});
			assertRuntimeOwnerCurrent();
			return {
				entry,
				sessionKey: canonicalKey
			};
		}
		return {
			entry: await readOwnershipEntry({
				sessionKey: params.sessionKey,
				readConsistency: "latest",
				...params.agentId !== void 0 ? { agentId: params.agentId } : {},
				...params.env !== void 0 ? { env: params.env } : {},
				...params.storePath !== void 0 ? { storePath: params.storePath } : {}
			}),
			sessionKey: params.sessionKey
		};
	};
	const assertStoredSessionEntryOwned = async (params) => {
		const target = await resolveStoredSessionOwnershipTarget(params);
		assertSessionEntryOwned({
			action: params.action,
			...target
		});
		return target.entry;
	};
	const resolveStoredSessionExecutionOwner = async (params) => {
		const target = await resolveStoredSessionOwnershipTarget(params);
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
	const assertSessionIdentitiesOwned = async (params) => {
		const agentId = normalizeOptionalString(params.agentId);
		const storePath = normalizeOptionalString(params.storePath);
		const sessionKeys = new Set(normalizeTrimmedStringList(params.sessionKeys));
		for (const sessionKey of sessionKeys) await assertStoredSessionEntryOwned({
			action: params.action,
			sessionKey,
			...agentId ? { agentId } : {},
			...storePath ? { storePath } : {}
		});
		const sessionIds = new Set(normalizeTrimmedStringList(params.sessionIds));
		const sessionFiles = new Set(normalizeTrimmedStringList(params.sessionFiles));
		if (sessionIds.size === 0 && sessionFiles.size === 0) return;
		const entries = await listOwnershipEntries({
			...agentId ? { agentId } : {},
			...storePath ? { storePath } : {}
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
				const matchedSessionIds = new Set(normalizeTrimmedStringList(sessionKeyMatches.map(({ entry }) => entry.sessionId)));
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
			const matches = (await listOwnershipEntries({
				agentId: marker.agentId,
				storePath: marker.storePath
			})).filter(({ entry }) => entry.sessionId === marker.sessionId);
			if (matches.length === 0) throw new Error(`Plugin session ownership target not found: ${marker.sessionId}`);
			for (const match of matches) assertSessionEntryOwned({
				action: params.action,
				entry: match.entry,
				sessionKey: match.sessionKey
			});
		}
	};
	const prepareRunSessionExecution = async (params) => {
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
		const entry = sessionKey ? await readOwnershipEntry({
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
		await assertSessionIdentitiesOwned({
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
	const assertGatewaySessionRequestOwned = async (method, params) => {
		if (PLUGIN_GATEWAY_GLOBAL_SESSION_MUTATION_METHODS.has(method)) throw new Error(`Plugin "${pluginId}" cannot request global session mutation "${method}".`);
		if (!PLUGIN_GATEWAY_SESSION_MUTATION_METHODS.has(method)) return;
		const request = params ?? {};
		if (method === "sessions.patchMany" && Array.isArray(request.targets)) {
			for (const target of request.targets) {
				if (!isRecord(target)) continue;
				await assertSessionIdentitiesOwned({
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
		await assertSessionIdentitiesOwned({
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
		createSessionEntry: async (session, params) => {
			if ([
				"agentHarnessId" in params.initialEntry,
				"cliBackendId" in params.initialEntry,
				"acpSessionBinding" in params.initialEntry
			].filter(Boolean).length !== 1) throw new Error(`Plugin "${pluginId}" session creation requires exactly one runtime owner.`);
			if ("agentHarnessId" in params.initialEntry) {
				assertOwnedHarness(params.initialEntry.agentHarnessId, "create its sessions");
				assertReservedSessionKeyOwned(params.key, "create");
				return await session.createSessionEntry(params);
			}
			const initialEntry = params.initialEntry;
			if (!("acpSessionBinding" in initialEntry)) {
				const backend = resolveRegistry().cliBackends.find((entry) => entry.backend.id === initialEntry.cliBackendId);
				if (!backend || backend.pluginId !== pluginId) throw new Error(`Plugin "${pluginId}" must own CLI backend "${initialEntry.cliBackendId}" to create its sessions.`);
			}
			if (!params.key.startsWith(`plugin:${pluginId}:`)) throw new Error(`Plugin "${pluginId}" session keys must start with "plugin:${pluginId}:".`);
			return await session.createSessionEntry({
				...params,
				initialEntry: {
					...initialEntry,
					pluginOwnerId: pluginId
				}
			});
		},
		prepareSessionEntryPatch: async (session, params, assertRuntimeCurrent) => {
			assertSessionEntryPatchAuthority(params.authority);
			return await session.prepareSessionEntryPatch({
				...params,
				authority: {
					kind: "source",
					source: composeSessionSourceAssertion([params.authority?.kind === "source" ? params.authority.source : void 0], (assertSources) => {
						assertRuntimeCurrent();
						if (params.authority?.kind === "host") params.authority.assertCurrent();
						assertSources();
					})
				},
				prepare: async (entry, context) => {
					assertStoreEntryOwned({
						action: "patch",
						before: context.existingEntry,
						entry,
						sessionKey: params.sessionKey
					});
					const patch = await params.prepare(entry, context);
					assertRuntimeCurrent();
					if (patch) assertStoreEntryOwned({
						action: "patch",
						before: context.existingEntry,
						entry: params.replaceEntry ? patch : {
							...entry,
							...patch
						},
						sessionKey: params.sessionKey
					});
					return patch;
				}
			});
		},
		patchSessionEntry: async (session, params, assertRuntimeCurrent) => {
			await assertStoredSessionEntryOwned({
				...params,
				action: "patch"
			});
			return await session.patchSessionEntry({
				...params,
				update: async (entry, context) => {
					const patch = await params.update(entry, context);
					assertRuntimeCurrent();
					if (!patch) return patch;
					const next = params.replaceEntry ? patch : {
						...entry,
						...patch
					};
					assertStoreEntryOwned({
						action: "patch",
						before: context.existingEntry ?? entry,
						entry: next,
						sessionKey: params.sessionKey
					});
					return patch;
				}
			});
		},
		upsertSessionEntry: async (session, params, assertRuntimeCurrent) => {
			await session.prepareSessionEntryPatch({
				...params,
				fallbackEntry: params.entry,
				replaceEntry: true,
				authority: {
					kind: "host",
					assertCurrent: assertRuntimeCurrent
				},
				prepare: (entry, context) => {
					assertStoreEntryOwned({
						action: "upsert",
						before: context.existingEntry,
						entry,
						sessionKey: params.sessionKey
					});
					assertStoreEntryOwned({
						action: "upsert",
						before: context.existingEntry,
						entry: params.entry,
						sessionKey: params.sessionKey
					});
					return params.entry;
				}
			});
		},
		prepareSessionStoreUpdate: async (params, assertRuntimeCurrent) => {
			await assertStoredSessionEntryOwned({
				...params,
				action: "update"
			});
			return async (entry) => {
				const patch = await params.update(entry);
				assertRuntimeCurrent();
				if (!patch) return patch;
				assertStoreEntryOwned({
					action: "update",
					before: entry,
					entry: {
						...entry,
						...patch
					},
					sessionKey: params.sessionKey
				});
				return patch;
			};
		},
		assertStoredSessionEntryOwned,
		resolveStoredSessionExecutionOwner,
		prepareRunSessionExecution,
		assertGatewaySessionRequestOwned,
		assertSessionIdentitiesOwned
	};
}
//#endregion
export { createPluginSessionOwnership };
