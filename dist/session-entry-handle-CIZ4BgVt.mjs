//#region src/auto-reply/reply/session-entry-handle.ts
var ReplySessionGenerationInvalidatedError = class extends Error {};
function publishReplySessionEntry(params, entry) {
	if (entry) {
		if (params.sessionEntryHandle) params.sessionEntryHandle.replaceCurrent(entry);
		else if (params.sessionStore && params.sessionKey) params.sessionStore[params.sessionKey] = entry;
	} else {
		params.sessionEntryHandle?.clearCurrent();
		if (params.sessionStore && params.sessionKey) delete params.sessionStore[params.sessionKey];
	}
}
function createReplySessionEntryHandle(params) {
	const { generationFence, sessionKey, sessionStore } = params;
	const entries = sessionStore ?? {};
	let ownedSessionId = generationFence?.sessionId;
	let ownedLifecycleRevision = params.sessionEntry && params.sessionEntry.sessionId === ownedSessionId ? params.sessionEntry.lifecycleRevision : void 0;
	const matchesGeneration = (entry) => entry !== void 0 && (!generationFence || entry.sessionId === ownedSessionId && entry.lifecycleRevision === ownedLifecycleRevision);
	let currentEntry = matchesGeneration(params.sessionEntry) ? params.sessionEntry : void 0;
	if (sessionKey && currentEntry) {
		const storedEntry = entries[sessionKey];
		if (!generationFence || !sessionStore || storedEntry && (storedEntry === generationFence.expectedStoreEntry || matchesGeneration(storedEntry)) && (!matchesGeneration(storedEntry) || currentEntry.updatedAt >= storedEntry.updatedAt)) entries[sessionKey] = currentEntry;
	}
	const current = () => {
		const storedEntry = sessionKey ? entries[sessionKey] : void 0;
		if (generationFence && matchesGeneration(storedEntry) && (!matchesGeneration(currentEntry) || storedEntry.updatedAt >= currentEntry.updatedAt)) currentEntry = storedEntry;
		return currentEntry;
	};
	const replaceCurrent = (entry, adopt = false) => {
		const storedEntry = sessionKey ? entries[sessionKey] : void 0;
		if (adopt && generationFence) {
			const storedMatchesAdopted = storedEntry?.sessionId === entry.sessionId && storedEntry.lifecycleRevision === entry.lifecycleRevision;
			if (sessionStore && sessionKey && !storedEntry && generationFence.expectedStoreEntry || storedEntry && !matchesGeneration(storedEntry) && !storedMatchesAdopted) throw new ReplySessionGenerationInvalidatedError("Follow-up session generation was replaced during admission");
			ownedSessionId = entry.sessionId;
			ownedLifecycleRevision = entry.lifecycleRevision;
		}
		if (!matchesGeneration(entry)) return;
		const latest = current();
		currentEntry = generationFence && matchesGeneration(latest) && latest.updatedAt > entry.updatedAt ? latest : entry;
		if (sessionKey && (!generationFence || adopt || !storedEntry && !generationFence.expectedStoreEntry || matchesGeneration(storedEntry))) entries[sessionKey] = currentEntry;
	};
	const handle = {
		adoptCurrent: (entry) => replaceCurrent(entry, true),
		clearCurrent: () => {
			currentEntry = void 0;
			if (sessionKey && (!generationFence || matchesGeneration(entries[sessionKey]))) delete entries[sessionKey];
		},
		get: (key) => entries[key],
		getCurrent: current,
		replaceCurrent,
		toCompatSessionStore: () => {
			if (!generationFence || !sessionKey) return entries;
			return new Proxy({ ...entries }, {
				get: (target, key) => key === sessionKey ? current() : Reflect.get(target, key),
				set(target, key, entry) {
					if (key !== sessionKey) return Reflect.set(target, key, entry);
					if (entry) replaceCurrent(entry, !matchesGeneration(entry));
					else handle.clearCurrent();
					return true;
				},
				deleteProperty(target, key) {
					if (key !== sessionKey) return Reflect.deleteProperty(target, key);
					handle.clearCurrent();
					return true;
				}
			});
		}
	};
	return handle;
}
//#endregion
export { createReplySessionEntryHandle as n, publishReplySessionEntry as r, ReplySessionGenerationInvalidatedError as t };
