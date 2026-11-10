import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import "./io-DIF-KW3P.mjs";
import { i as isSessionStoreReadCandidateCurrent, r as captureSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as assertCapturedSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { n as omitInternalSessionEffectsEntries } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
//#region src/gateway/session-utils-read-lifetime.ts
function captureMemoryRead(params) {
	const cfg = params.cfg ?? readRuntimeConfig();
	const { canonicalKey, agentId } = resolveSessionStoreIdentity({
		cfg,
		sessionKey: params.key,
		agentId: params.agentId
	});
	if (!isIncognitoSessionKey(canonicalKey)) return;
	const captured = captureSessionActorStorageOwner({
		agentId,
		sessionKey: canonicalKey,
		env: params.env
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (!captured) throw new Error("Incognito session read requires a memory owner selection");
	const { binding, authority, owner, path: storePath } = captured;
	const assertCurrent = () => {
		if (binding) binding.actor.assertReadable();
		else owner?.assertCurrent();
		authority.assertCurrent();
	};
	const read = () => {
		let snapshot;
		if (binding?.actor.target.sessionKey === canonicalKey) snapshot = binding.actor.snapshot(authority);
		else {
			binding?.actor.assertReadable();
			snapshot = owner?.readSession(canonicalKey, authority);
		}
		return snapshot?.entry && attachSessionEntrySnapshots(snapshot.entry, {}, params.projection);
	};
	return {
		assertCurrent,
		read,
		loaded() {
			const entry = read();
			return {
				cfg,
				agentId,
				canonicalKey,
				storePath,
				storeKeys: [canonicalKey],
				store: entry ? { [canonicalKey]: entry } : {},
				entry,
				legacyKey: void 0,
				readSource: {
					agentId,
					path: storePath
				}
			};
		}
	};
}
/** Full planning rows stay with their consumer; only the actor owns current effect metadata. */
async function withGatewaySessionEntryReadOnly(params, consume) {
	const memory = captureMemoryRead(params);
	if (memory) {
		const loaded = memory.loaded();
		if (params.excludeInternalEffects) {
			omitInternalSessionEffectsEntries(loaded.store, loaded.storeKeys);
			loaded.entry = loaded.store[loaded.canonicalKey];
		}
		let active = true;
		try {
			return await consume(loaded, () => {
				if (!active) throw new Error("Session entry read is no longer retained");
				params.assertActive?.();
				memory.assertCurrent();
			});
		} finally {
			active = false;
		}
	}
	const loaded = params.prepared ?? await loadGatewaySessionEntryReadOnlyInWorker(params);
	if (params.prepared && params.excludeInternalEffects) {
		omitInternalSessionEffectsEntries(loaded.store, loaded.storeKeys);
		loaded.entry = loaded.store[loaded.legacyKey ?? loaded.canonicalKey];
	}
	return consume(loaded, () => params.assertActive?.());
}
/** Retain the selected row and physical owner through asynchronous metadata preparation. */
async function retainGatewaySessionEntryReadOnly(sessionKey, agentId, allowMetadataChanges, cfg = readRuntimeConfig(), options = {}) {
	const matches = (previous, current) => previous && current ? previous.sessionId === current.sessionId && previous.lifecycleRevision === current.lifecycleRevision && (JSON.stringify({
		...previous,
		lastReadAt: void 0
	}) === JSON.stringify({
		...current,
		lastReadAt: void 0
	}) || allowMetadataChanges?.(previous, current) === true) : previous === current;
	const memory = captureMemoryRead({
		cfg,
		key: sessionKey,
		agentId,
		projection: "list"
	});
	if (memory) {
		const selected = memory.loaded();
		let released = false;
		const isCurrent = () => {
			if (released) return false;
			try {
				memory.assertCurrent();
				return true;
			} catch {
				return false;
			}
		};
		return {
			...selected,
			readRetainedEntry: memory.read,
			isCurrent,
			isCurrentAtResponse: () => {
				if (released) return false;
				let current;
				try {
					current = memory.read();
				} catch {
					return false;
				}
				return matches(selected.entry, current);
			},
			release() {
				released = true;
			}
		};
	}
	const assertRoutingCurrent = captureSessionMutationRouting(cfg, void 0, [{
		sessionKey,
		agentId,
		preserveQualifiedAddress: options.preserveQualifiedAddress
	}]);
	let released = false;
	let invalidated = false;
	const stopChanges = sessionChanges.subscribeFacts((change) => {
		if ("all" in change || change.sessionKey === sessionKey) invalidated = true;
	});
	let predicate;
	let unregister = () => {};
	const release = () => {
		if (released) return;
		released = true;
		stopChanges();
		predicate?.release();
		unregister();
	};
	try {
		const selected = options.prepared ?? await loadGatewaySessionEntryReadOnlyInWorker({
			cfg,
			key: sessionKey,
			agentId,
			projection: "list",
			exactRead: options.exactRead,
			preserveQualifiedAddress: options.preserveQualifiedAddress
		});
		const source = selected.capturedReadSource;
		const selectedPath = captureSessionStoreReadCandidate(selected.storePath);
		if (source && typeof source.databaseIdentity === "string") {
			predicate = retainPreparedSessionEntryPredicate({
				databaseIdentity: `file:${source.databaseIdentity}`,
				sessionKey: selected.legacyKey ?? selected.canonicalKey,
				entry: selected.entry,
				matches
			});
			unregister = registerOpenClawAgentDatabaseAsyncResource({
				agentId: source.agentId,
				path: source.path,
				revoke: release,
				close: () => Promise.resolve()
			});
			stopChanges();
		}
		return {
			...selected,
			readRetainedEntry: () => predicate ? predicate.readRetainedEntry() : selected.entry,
			isCurrent: () => !released,
			isCurrentAtResponse: () => {
				if (released || (predicate ? !predicate.isCurrent() : invalidated)) return false;
				try {
					if (!isSessionStoreReadCandidateCurrent(selectedPath)) return false;
					assertRoutingCurrent(readRuntimeConfig());
					if (source) assertCapturedSessionEntryReadSource(source);
					return true;
				} catch {
					return false;
				}
			},
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { withGatewaySessionEntryReadOnly as n, retainGatewaySessionEntryReadOnly as t };
